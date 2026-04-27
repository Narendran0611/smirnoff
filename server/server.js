const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/dist')));

let dbEngine = 'postgres';
let pool = null;
let sqliteDb = null;

if (process.env.DATABASE_URL) {
  console.log('🔗 Using PostgreSQL (DATABASE_URL detected)');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
} else {
  console.log('🔗 Using Local SQLite (Fallback Mode)');
  dbEngine = 'sqlite';
  sqliteDb = new sqlite3.Database(path.join(__dirname, 'smirnoff.db'));
}

/**
 * Universal Database Wrapper
 * Handles syntax differences between Postgres ($1) and SQLite (?)
 */
const db = {
  query: (text, params = []) => {
    if (dbEngine === 'postgres') {
      return pool.query(text, params);
    } else {
      // Convert $1, $2... to ?, ?... for SQLite
      const sqliteText = text.replace(/\$\d+/g, '?');
      return new Promise((resolve, reject) => {
        sqliteDb.run(sqliteText, params, function(err) {
          if (err) reject(err);
          else resolve({ rows: [], lastID: this.lastID, changes: this.changes });
        });
      });
    }
  },
  get: (text, params = []) => {
    if (dbEngine === 'postgres') {
      return pool.query(text, params).then(res => res.rows[0]);
    } else {
      const sqliteText = text.replace(/\$\d+/g, '?');
      return new Promise((resolve, reject) => {
        sqliteDb.get(sqliteText, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  },
  all: (text, params = []) => {
    if (dbEngine === 'postgres') {
      return pool.query(text, params).then(res => res.rows);
    } else {
      const sqliteText = text.replace(/\$\d+/g, '?');
      return new Promise((resolve, reject) => {
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  }
};

// Helper to handle auto-increment syntax difference
const SERIAL_TYPE = dbEngine === 'postgres' ? 'SERIAL' : 'INTEGER';
const PK_AUTO = dbEngine === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
const NOW_FUNC = dbEngine === 'postgres' ? 'CURRENT_TIMESTAMP' : "datetime('now')";

// Verify connection and run schema
const initDb = async () => {
  try {
    if (dbEngine === 'postgres') {
      await db.query('SELECT NOW()');
      console.log('✅ PostgreSQL Database Connected');
    } else {
      console.log('✅ SQLite Database Connected');
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        phone TEXT PRIMARY KEY,
        points INTEGER DEFAULT 0,
        ice_pass_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT ${NOW_FUNC}
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS codes (
        id ${SERIAL_TYPE} ${PK_AUTO},
        code TEXT UNIQUE NOT NULL,
        points INTEGER DEFAULT 50,
        prize TEXT,
        used INTEGER DEFAULT 0,
        used_by TEXT,
        used_at TEXT,
        created_at TEXT DEFAULT ${NOW_FUNC}
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id ${SERIAL_TYPE} ${PK_AUTO},
        phone TEXT NOT NULL,
        type TEXT NOT NULL,
        label TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        date TEXT DEFAULT ${NOW_FUNC},
        status TEXT DEFAULT 'completed'
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS talents (
        id ${SERIAL_TYPE} ${PK_AUTO},
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        bio TEXT,
        video_link TEXT,
        phone TEXT,
        votes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT ${NOW_FUNC}
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS game_spins (
        id ${SERIAL_TYPE} ${PK_AUTO},
        phone TEXT NOT NULL,
        points_won INTEGER DEFAULT 0,
        created_at TEXT DEFAULT ${NOW_FUNC}
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id ${SERIAL_TYPE} ${PK_AUTO},
        title TEXT NOT NULL,
        date TEXT,
        venue TEXT,
        description TEXT,
        ice_pass_required INTEGER DEFAULT 0,
        image TEXT,
        created_at TEXT DEFAULT ${NOW_FUNC}
      )
    `);

    console.log('✅ Database Schema verified');
  } catch (err) {
    console.error('❌ Database Initialization Failed:');
    console.error('   Engine:', dbEngine);
    console.error('   Message:', err.message);
    if (err.code === 'ECONNREFUSED' && dbEngine === 'postgres') {
      console.error('   💡 HINT: PostgreSQL connection refused. If you want to use local mode, remove DATABASE_URL.');
    }
  }
};

initDb();

const getOrCreateUser = async (phone) => {
  let user = await db.get('SELECT * FROM users WHERE phone = $1', [phone]);
  if (!user) {
    await db.query('INSERT INTO users (phone, created_at) VALUES ($1, $2)', [phone, new Date().toISOString()]);
    user = await db.get('SELECT * FROM users WHERE phone = $1', [phone]);
  }
  return user;
};

app.post('/api/validate-code', async (req, res) => {
  const { code, phone } = req.body;

  if (!code || !phone) {
    return res.json({ success: false, message: 'Code and phone number are required.' });
  }

  const codeRecord = await db.get('SELECT * FROM codes WHERE UPPER(code) = UPPER($1) AND used = 0', [code]);

  if (!codeRecord) {
    const usedCode = await db.get('SELECT * FROM codes WHERE UPPER(code) = UPPER($1) AND used = 1', [code]);
    if (usedCode) {
      return res.json({ success: false, message: 'This code has already been used.' });
    }
    return res.json({ success: false, message: "Hmm… that code isn't chilling. Try again." });
  }

  await db.query('UPDATE codes SET used = 1, used_by = $1, used_at = CURRENT_TIMESTAMP WHERE id = $2', [phone, codeRecord.id]);

  const hasWonPass = Math.random() < 0.25;
  const pointsToAdd = Math.floor(Math.random() * 50) + 10;

  await db.query(
    'UPDATE users SET points = points + $1, ice_pass_count = ice_pass_count + $2 WHERE phone = $3',
    [pointsToAdd, hasWonPass ? 1 : 0, phone]
  );

  await db.query(
    'INSERT INTO transactions (phone, type, points, label, date, status) VALUES ($1, $2, $3, $4, $5, $6)',
    [phone, 'code_entry', pointsToAdd, `Code Win ${hasWonPass ? '+ IcePass' : ''}`, new Date().toISOString(), 'completed']
  );

  return res.json({
    success: true,
    message: hasWonPass ? `YOU WON! ${pointsToAdd} Points AND an IcePass! 🧊` : `Success! ${pointsToAdd} points added.`,
    pointsWon: pointsToAdd,
    wonPass: hasWonPass
  });
});

app.get('/api/user/:phone', async (req, res) => {
  const user = await db.get('SELECT * FROM users WHERE phone = $1', [req.params.phone]);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const history = await db.all('SELECT * FROM transactions WHERE phone = $1 ORDER BY date DESC LIMIT 20', [req.params.phone]);
  res.json({ ...user, history });
});

app.post('/api/redeem', async (req, res) => {
  console.log('🚀 Redeeming points:', req.body);
  const { phone, cost, label } = req.body;

  if (!phone || !cost || !label) return res.status(400).json({ error: 'Missing logic' });

  try {
    const user = await db.get('SELECT points FROM users WHERE phone = $1', [phone]);
    if (!user || user.points < cost) return res.status(400).json({ error: 'Insufficient points' });

    const isPhysical = label.toLowerCase().includes('airpod') || label.toLowerCase().includes('ticket');
    const status = isPhysical ? 'pending' : 'completed';

    await db.query('UPDATE users SET points = points - $1 WHERE phone = $2', [cost, phone]);
    await db.query(
      'INSERT INTO transactions (phone, type, points, label, date, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [phone, 'redemption', -cost, label, new Date().toISOString(), status]
    );

    res.json({ success: true, message: `Redeemed ${label} successfully!`, status });
  } catch (err) {
    console.error('❌ Redemption error:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

app.post('/api/use-pass', async (req, res) => {
  console.log('🚀 Using IcePass:', req.body);
  const { phone, eventName } = req.body;
  try {
    const user = await db.get('SELECT ice_pass_count FROM users WHERE phone = $1', [phone]);
    if (!user || user.ice_pass_count < 1) {
      return res.status(400).json({ success: false, message: 'No IcePasses available.' });
    }

    await db.query('UPDATE users SET ice_pass_count = ice_pass_count - 1 WHERE phone = $1', [phone]);
    await db.query(
      'INSERT INTO transactions (phone, type, points, label, date, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [phone, 'event_entry', 0, `Used IcePass for ${eventName}`, new Date().toISOString(), 'completed']
    );

    res.json({ success: true, message: 'Your IcePass has been successfully applied!' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/talent/submit', async (req, res) => {
  const { name, bio, link, phone, category } = req.body;

  if (!name || !category) {
    return res.json({ success: false, message: 'Name and category are required.' });
  }

  try {
    await db.query(
      'INSERT INTO talents (name, category, bio, video_link, phone) VALUES ($1, $2, $3, $4, $5)',
      [name, category, bio || '', link || '', phone || '']
    );
    res.json({ success: true, message: 'Entry submitted successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Submission failed. Please try again.' });
  }
});

app.get('/api/talent', async (req, res) => {
  const { category } = req.query;
  let talents;

  if (category && category !== 'all') {
    talents = await db.all('SELECT * FROM talents WHERE category = $1 AND status = $2 ORDER BY votes DESC', [category, 'approved']);
  } else {
    talents = await db.all('SELECT * FROM talents WHERE status = $1 ORDER BY votes DESC', ['approved']);
  }

  res.json(talents);
});

app.post('/api/talent/:id/vote', async (req, res) => {
  const { id } = req.params;
  const talent = await db.get('SELECT * FROM talents WHERE id = $1', [id]);

  if (!talent) return res.status(404).json({ success: false, message: 'Talent not found.' });

  await db.query('UPDATE talents SET votes = votes + 1 WHERE id = $1', [id]);
  const updated = await db.get('SELECT * FROM talents WHERE id = $1', [id]);

  res.json({ success: true, votes: updated.votes });
});

app.get('/api/talent/leaderboard', async (req, res) => {
  const talents = await db.all('SELECT * FROM talents WHERE status = $1 ORDER BY votes DESC LIMIT 20', ['approved']);
  res.json(talents);
});

app.post('/api/games/spin', async (req, res) => {
  const { phone } = req.body;
  const prizes = [5, 10, 2, 50, 5, 20, 0, 100];
  const weights = [25, 20, 25, 3, 15, 8, 3, 1];

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let pointsWon = 0;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      pointsWon = prizes[i];
      break;
    }
  }

  if (phone) {
    await getOrCreateUser(phone);
    if (pointsWon > 0) {
      await db.query('UPDATE users SET points = points + $1 WHERE phone = $2', [pointsWon, phone]);
      await db.query(
        'INSERT INTO transactions (phone, type, label, points, date, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [phone, 'game', 'Spin Wheel Win', pointsWon, new Date().toISOString(), 'completed']
      );
    }
    await db.query('INSERT INTO game_spins (phone, points_won) VALUES ($1, $2)', [phone, pointsWon]);
  }

  res.json({ success: true, points: pointsWon });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\n🍺 ====================================`);
  console.log(`   GUINNESS FES NCP BACKEND`);
  console.log(`   Running at http://localhost:${PORT}`);
  console.log(`🍺 ====================================\n`);
});
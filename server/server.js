const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// ==============================
// DATABASE SETUP
// ==============================
const dbPath = path.join(__dirname, 'smirnoff.db');
const db = new Database(dbPath);
console.log('✅ Backend Database Connected at:', dbPath);

// GLOBAL REPAIR: Ensure all columns exist every time the server starts
try { db.exec("ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT 'completed'"); } catch (e) {}
try { db.exec("ALTER TABLE transactions ADD COLUMN date TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN ice_pass_count INTEGER DEFAULT 0"); } catch (e) {}
console.log('✅ Database Schema verified and repaired.');

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    phone TEXT PRIMARY KEY,
    points INTEGER DEFAULT 0,
    ice_pass_count INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    points INTEGER DEFAULT 50,
    prize TEXT,
    used INTEGER DEFAULT 0,
    used_by TEXT,
    used_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    date TEXT,
    status TEXT DEFAULT 'completed'
  );

  CREATE TABLE IF NOT EXISTS talents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    bio TEXT,
    video_link TEXT,
    phone TEXT,
    votes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_spins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    points_won INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    venue TEXT,
    description TEXT,
    ice_pass_required INTEGER DEFAULT 0,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==============================
// SEED DATA (if empty)
// ==============================
const codeCount = db.prepare('SELECT COUNT(*) as count FROM codes').get();
if (codeCount.count === 0) {
  const insertCode = db.prepare('INSERT INTO codes (code, points, prize) VALUES (?, ?, ?)');
  const codes = [
    ['CHILL2024', 50, null],
    ['ICEPASS', 100, null],
    ['SUMMER26', 50, null],
    ['VIBES100', 100, null],
    ['POPWIN', 50, 'VIP Pass'],
    ['COOLDOWN', 25, null],
    ['FROSTY', 75, null],
    ['CHILLIT', 50, 'Smirnoff Ice Hoodie'],
    ['FREEZE99', 50, null],
    ['ICECOLD', 200, 'AirPods'],
  ];
  const insertMany = db.transaction((codes) => {
    for (const [code, points, prize] of codes) {
      insertCode.run(code, points, prize);
    }
  });
  insertMany(codes);
  console.log('✅ Seeded 10 codes into database.');
}

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (phone, points, ice_pass_count, created_at) VALUES (?, ?, ?, ?)').run(
    '08012345678', 1250, 1, new Date().toISOString()
  );
  console.log('✅ Seeded default user.');
}

const talentCount = db.prepare('SELECT COUNT(*) as count FROM talents').get();
if (talentCount.count === 0) {
  const insertTalent = db.prepare('INSERT INTO talents (name, category, bio, video_link, votes, status) VALUES (?, ?, ?, ?, ?, ?)');
  const talents = [
    ['DJ Chill-X', 'dj', 'Lagos top DJ spinning the coldest beats', 'https://youtube.com/example1', 342, 'approved'],
    ['Vibes Queen', 'dance', 'Dance moves that will freeze the dance floor', 'https://youtube.com/example2', 287, 'approved'],
    ['MC IceCold', 'hypeman', 'The voice that gets the crowd moving', 'https://youtube.com/example3', 198, 'approved'],
    ['BeatSmith', 'producer', 'Afrobeats producer making waves globally', 'https://youtube.com/example4', 156, 'approved'],
    ['Spinmaster K', 'dj', 'Award-winning DJ from PH City', 'https://youtube.com/example5', 312, 'approved'],
    ['FlexGod', 'dance', 'Champion dancer with viral moves', 'https://youtube.com/example6', 245, 'approved'],
    ['Hype King', 'hypeman', 'Energy that lights up every event', 'https://youtube.com/example7', 178, 'approved'],
    ['Afro Genius', 'producer', 'Next generation of Afrobeats sound', 'https://youtube.com/example8', 134, 'approved'],
  ];
  const insertMany = db.transaction((talents) => {
    for (const t of talents) {
      insertTalent.run(...t);
    }
  });
  insertMany(talents);
}

// ==============================
// HELPER: Get or Create User
// ==============================
const getOrCreateUser = (phone) => {
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) {
    db.prepare('INSERT INTO users (phone, created_at) VALUES (?, ?)').run(phone, new Date().toISOString());
    user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  }
  return user;
};

// ==============================
// API ROUTES
// ==============================

// --- Code Validation ---
app.post('/api/validate-code', (req, res) => {
  const { code, phone } = req.body;

  if (!code || !phone) {
    return res.json({ success: false, message: 'Code and phone number are required.' });
  }

  const codeRecord = db.prepare('SELECT * FROM codes WHERE UPPER(code) = UPPER(?) AND used = 0').get(code);

  if (!codeRecord) {
    // Check if code exists but is used
    const usedCode = db.prepare('SELECT * FROM codes WHERE UPPER(code) = UPPER(?) AND used = 1').get(code);
    if (usedCode) {
      return res.json({ success: false, message: 'This code has already been used.' });
    }
    return res.json({ success: false, message: "Hmm… that code isn't chilling. Try again." });
  }

  // Mark code as used
  db.prepare('UPDATE codes SET used = 1, used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?').run(phone, codeRecord.id);

  // Update user points
  const user = getOrCreateUser(phone);
  // db.prepare('UPDATE users SET points = points + ? WHERE phone = ?').run(codeEntry.points, phone);

  // Log transaction
  // db.prepare('INSERT INTO transactions (phone, type, label, points) VALUES (?, ?, ?, ?)').run(
  //   phone, 'code', `Code: ${code.toUpperCase()}`, codeEntry.points
  // );

  // Determined rewards based on luck
  const hasWonPass = Math.random() < 0.25; // 25% chance for IcePass
  const pointsToAdd = Math.floor(Math.random() * 50) + 10; // 10-60 points

  const updateUsers = db.prepare('UPDATE users SET points = points + ?, ice_pass_count = ice_pass_count + ? WHERE phone = ?');
  // const deleteCode = db.prepare('DELETE FROM codes WHERE code = ?'); // No, we mark it as used
  const logTransaction = db.prepare('INSERT INTO transactions (phone, type, points, label, date, status) VALUES (?, ?, ?, ?, ?, ?)');

  const transaction = db.transaction(() => {
    updateUsers.run(pointsToAdd, hasWonPass ? 1 : 0, phone);
    // deleteCode.run(code); // No, we mark it as used
    logTransaction.run(phone, 'code_entry', pointsToAdd, `Code Win ${hasWonPass ? '+ IcePass' : ''}`, new Date().toISOString(), 'completed');
  });
  transaction();

  return res.json({
    success: true,
    message: hasWonPass ? `YOU WON! ${pointsToAdd} Points AND an IcePass! 🧊` : `Success! ${pointsToAdd} points added.`,
    pointsWon: pointsToAdd,
    wonPass: hasWonPass
  });
});

// --- User Profile ---
app.get('/api/user/:phone', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(req.params.phone);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const history = db.prepare('SELECT * FROM transactions WHERE phone = ? ORDER BY date DESC LIMIT 20').all(req.params.phone);
  res.json({ ...user, history });
});

// --- Points Redemption ---
app.post('/api/redeem', (req, res) => {
  console.log('🚀 Redeeming points:', req.body);
  const { phone, cost, label } = req.body;

  if (!phone || !cost || !label) return res.status(400).json({ error: 'Missing logic' });

  try {
    const user = db.prepare('SELECT points FROM users WHERE phone = ?').get(phone);
    if (!user || user.points < cost) return res.status(400).json({ error: 'Insufficient points' });

    // Mark AirPods/Physical as pending, Digital as completed
    const isPhysical = label.toLowerCase().includes('airpod') || label.toLowerCase().includes('ticket');
    const status = isPhysical ? 'pending' : 'completed';

    const updatePoints = db.prepare('UPDATE users SET points = points - ? WHERE phone = ?');
    const logTransaction = db.prepare('INSERT INTO transactions (phone, type, points, label, date, status) VALUES (?, ?, ?, ?, ?, ?)');

    const transaction = db.transaction(() => {
      updatePoints.run(cost, phone);
      logTransaction.run(phone, 'redemption', -cost, label, new Date().toISOString(), status);
    });
    transaction();

    res.json({ success: true, message: `Redeemed ${label} successfully!`, status });
  } catch (err) {
    console.error('❌ Redemption error:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// Endpoint to use an IcePass for an event
app.post('/api/use-pass', (req, res) => {
  console.log('🚀 Using IcePass:', req.body);
  const { phone, eventName } = req.body;
  try {
    const user = db.prepare('SELECT ice_pass_count FROM users WHERE phone = ?').get(phone);
    if (!user || user.ice_pass_count < 1) {
      return res.status(400).json({ success: false, message: 'No IcePasses available.' });
    }

    const consumePass = db.prepare('UPDATE users SET ice_pass_count = ice_pass_count - 1 WHERE phone = ?');
    const logTransaction = db.prepare('INSERT INTO transactions (phone, type, points, label, date, status) VALUES (?, ?, ?, ?, ?, ?)');

    const transaction = db.transaction(() => {
      consumePass.run(phone);
      logTransaction.run(phone, 'event_entry', 0, `Used IcePass for ${eventName}`, new Date().toISOString(), 'completed');
    });
    transaction();

    res.json({ success: true, message: 'Your IcePass has been successfully applied!' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Talent: Submit ---
app.post('/api/talent/submit', (req, res) => {
  const { name, bio, link, phone, category } = req.body;

  if (!name || !category) {
    return res.json({ success: false, message: 'Name and category are required.' });
  }

  try {
    db.prepare('INSERT INTO talents (name, category, bio, video_link, phone) VALUES (?, ?, ?, ?, ?)').run(
      name, category, bio || '', link || '', phone || ''
    );
    res.json({ success: true, message: 'Entry submitted successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Submission failed. Please try again.' });
  }
});

// --- Talent: Get All ---
app.get('/api/talent', (req, res) => {
  const { category } = req.query;
  let talents;

  if (category && category !== 'all') {
    talents = db.prepare('SELECT * FROM talents WHERE category = ? AND status = ? ORDER BY votes DESC').all(category, 'approved');
  } else {
    talents = db.prepare('SELECT * FROM talents WHERE status = ? ORDER BY votes DESC').all('approved');
  }

  res.json(talents);
});

// --- Talent: Vote ---
app.post('/api/talent/:id/vote', (req, res) => {
  const { id } = req.params;
  const talent = db.prepare('SELECT * FROM talents WHERE id = ?').get(id);

  if (!talent) return res.status(404).json({ success: false, message: 'Talent not found.' });

  db.prepare('UPDATE talents SET votes = votes + 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM talents WHERE id = ?').get(id);

  res.json({ success: true, votes: updated.votes });
});

// --- Talent: Leaderboard ---
app.get('/api/talent/leaderboard', (req, res) => {
  const talents = db.prepare('SELECT * FROM talents WHERE status = ? ORDER BY votes DESC LIMIT 20').all('approved');
  res.json(talents);
});

// --- Games: Spin Wheel ---
app.post('/api/games/spin', (req, res) => {
  const { phone } = req.body;
  const prizes = [5, 10, 2, 50, 5, 20, 0, 100];
  const weights = [25, 20, 25, 3, 15, 8, 3, 1]; // weights determine probability

  // Weighted random pick
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
    getOrCreateUser(phone);
    if (pointsWon > 0) {
      db.prepare('UPDATE users SET points = points + ? WHERE phone = ?').run(pointsWon, phone);
      db.prepare('INSERT INTO transactions (phone, type, label, points, date, status) VALUES (?, ?, ?, ?, ?, ?)').run(
        phone, 'game', 'Spin Wheel Win', pointsWon, new Date().toISOString(), 'completed'
      );
    }
    db.prepare('INSERT INTO game_spins (phone, points_won) VALUES (?, ?)').run(phone, pointsWon);
  }

  res.json({ success: true, points: pointsWon });
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==============================
// CATCH-ALL ROUTE (For SPA)
// ==============================
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\n🧊 ====================================`);
  console.log(`   SMIRNOFF ICE BACKEND`);
  console.log(`   Running at http://localhost:${PORT}`);
  console.log(`🧊 ====================================\n`);
});

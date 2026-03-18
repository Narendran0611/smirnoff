import './index.css';

// Import images via Vite
import logoImg from './assets/logo.png';
import heroLineupImg from './assets/hero-lineup.png';
import iconBuyImg from './assets/icon-buy.png';
import iconEnterImg from './assets/icon-enter.png';
import iconPointsImg from './assets/icon-points.png';
import iconRewardsImg from './assets/icon-rewards.png';
import crownCorkImg from './assets/crown-cork.png';
import eventPartyImg from './assets/event-party.png';
import eventFestivalImg from './assets/event-festival.png';
import eventPopupImg from './assets/event-popup.png';
import talentDjImg from './assets/talent-dj.png';
import talentDanceImg from './assets/talent-dance.png';
import talentHypemanImg from './assets/talent-hypeman.png';
import talentProducerImg from './assets/talent-producer.png';
import gamesSpinnerImg from './assets/games-spinner.png';
import smirnoffBottleImg from './assets/smirnoff-bottle.png';
import smirnoffCansImg from './assets/smirnoff-cans.png';
import smirnoffPopImg from './assets/smirnoff-pop.png';
import singleCanImg from './assets/Can.png';
import canBgImg from './assets/can_bg.png';
import canTableImg from './assets/can_table.png';
import chillGameBgImg from './assets/chill_game.png';

// ==============================
// BACKEND SERVICE
// ==============================
const API_BASE = 'http://localhost:3001/api';

const BackendService = {
  validateCode: async (code, phone) => {
    try {
      const res = await fetch(`${API_BASE}/validate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, phone })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },
  getUser: async (phone) => {
    try {
      const res = await fetch(`${API_BASE}/user/${phone}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },
  submitTalent: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/talent/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Submission failed.' };
    }
  },
  getTalents: async (category) => {
    try {
      const url = category ? `${API_BASE}/talent?category=${category}` : `${API_BASE}/talent`;
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      return [];
    }
  },
  voteTalent: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/talent/${id}/vote`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },
  getLeaderboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/talent/leaderboard`);
      return await res.json();
    } catch (err) {
      return [];
    }
  },
  spinWheel: async (phone) => {
    try {
      const res = await fetch(`${API_BASE}/games/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Spin failed.' };
    }
  }
};

// ==============================
// ASSETS MAP
// ==============================
const assets = {
  logo: logoImg,
  heroLineup: heroLineupImg,
  iconBuy: iconBuyImg,
  iconEnter: iconEnterImg,
  iconPoints: iconPointsImg,
  iconRewards: iconRewardsImg,
  crownCork: crownCorkImg,
  eventParty: eventPartyImg,
  eventFestival: eventFestivalImg,
  eventPopup: eventPopupImg,
  talentDj: talentDjImg,
  talentDance: talentDanceImg,
  talentHypeman: talentHypemanImg,
  talentProducer: talentProducerImg,
  gamesSpinner: gamesSpinnerImg,
  smirnoffBottle: smirnoffBottleImg,
  smirnoffCans: smirnoffCansImg,
  smirnoffPop: smirnoffPopImg,
  singleCan: singleCanImg,
  canBg: canBgImg,
  canTable: canTableImg,
  chillGameBg: chillGameBgImg
};

// ==============================
// STATE MANAGEMENT
// ==============================
const state = {
  currentPage: 'home',
  previousPage: null,
  user: {
    phone: '08012345678',
    name: 'Chill Fam',
    points: 1250,
    icePass: 'Active',
    history: [
      { type: 'code', label: 'Code: CHILL2024', points: 50, date: '2026-03-15' },
      { type: 'game', label: 'Spin Wheel Win', points: 10, date: '2026-03-14' },
      { type: 'code', label: 'Code: ICEPASS', points: 100, date: '2026-03-12' },
      { type: 'redeem', label: 'VIP Pass Redeemed', points: -500, date: '2026-03-10' },
      { type: 'code', label: 'Code: SUMMER26', points: 50, date: '2026-03-08' },
    ]
  },
  talentFilter: 'all',
  eventsData: [
    {
      id: 1, title: 'AMVCA After-Party', date: 'April 5, 2026', venue: 'Eko Hotel, Lagos',
      desc: 'The biggest party after the AMVCA awards. Smirnoff Ice exclusive.', icePass: true,
      img: 'eventParty'
    },
    {
      id: 2, title: 'Smirnoff Ice Party – Coming Soon', date: 'April 20, 2026', venue: 'Hard Rock Café, Lagos',
      desc: 'A premium night of vibes, music, and unlimited chill. IcePass holders get VIP entry.',
      icePass: true, img: 'eventFestival'
    },
    {
      id: 3, title: 'Group Therapy Sessions', date: 'May 1, 2026', venue: 'The Chill Zone, Victoria Island',
      desc: 'Good vibes only. Talk, laugh, chill with Smirnoff Ice.',
      icePass: false, img: 'eventPopup'
    },
    {
      id: 4, title: 'Chill Talent Academy Showcase', date: 'May 15, 2026', venue: 'Terra Kulture, Lagos',
      desc: 'Watch the top talents from the Chill Talent Academy compete live.',
      icePass: false, img: 'eventParty'
    },
    {
      id: 5, title: 'South Social Club', date: 'June 1, 2026', venue: 'Muri Okunola Park, Lagos',
      desc: 'An outdoor chill fest with live DJs, food, and Smirnoff Ice.',
      icePass: false, img: 'eventFestival'
    },
    {
      id: 6, title: 'Chill Buddies Meet & Greet', date: 'June 10, 2026', venue: 'Landmark Beach, Lagos',
      desc: 'A special hangout for loyal Smirnoff Ice fans. Free entry with IcePass.',
      icePass: true, img: 'eventPopup'
    }
  ],
  mockTalents: [
    { id: 1, name: 'DJ Chill-X', category: 'dj', votes: 342, img: 'talentDj' },
    { id: 2, name: 'Vibes Queen', category: 'dance', votes: 287, img: 'talentDance' },
    { id: 3, name: 'MC IceCold', category: 'hypeman', votes: 198, img: 'talentHypeman' },
    { id: 4, name: 'BeatSmith', category: 'producer', votes: 156, img: 'talentProducer' },
    { id: 5, name: 'Spinmaster K', category: 'dj', votes: 312, img: 'talentDj' },
    { id: 6, name: 'FlexGod', category: 'dance', votes: 245, img: 'talentDance' },
    { id: 7, name: 'Hype King', category: 'hypeman', votes: 178, img: 'talentHypeman' },
    { id: 8, name: 'Afro Genius', category: 'producer', votes: 134, img: 'talentProducer' }
  ]
};

// ==============================
// ROUTER & RENDERING
// ==============================
const navigateTo = (pageId) => {
  state.previousPage = state.currentPage;
  state.currentPage = pageId;
  renderApp();
};

const renderApp = () => {
  const app = document.querySelector('#app');

  // NO dark mode — consistent light theme everywhere
  document.body.classList.remove('dark-mode');

  app.innerHTML = `
    ${renderHeader()}
    <main id="content">
      ${getPageContent(state.currentPage)}
    </main>
    ${renderFooter()}
  `;

  attachListeners();
  window.scrollTo(0, 0);

  // Draw spin wheel if on that page
  if (state.currentPage === 'spin-game') {
    setTimeout(drawWheel, 100);
  }
};

// ==============================
// HEADER
// ==============================
const renderHeader = () => `
  <header class="site-header">
    <div class="container nav-container">
      <div class="logo">
        <a href="#" data-link="home" class="smirnoff-badge">SMIRNOFF</a>
      </div>
      <button id="theme-toggle" class="theme-toggle-btn" title="Toggle Theme">🌙</button>
      <div class="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </div>
      <nav>
        <ul class="nav-links" id="nav-links">
          <li><a href="#" data-link="home" class="${state.currentPage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="#" data-link="events" class="${['events','event-detail'].includes(state.currentPage) ? 'active' : ''}">Events</a></li>
          <li><a href="#" data-link="talent" class="${['talent','gallery','leaderboard'].includes(state.currentPage) ? 'active' : ''}">Talent Academy</a></li>
          <li><a href="#" data-link="games" class="${['games','spin-game'].includes(state.currentPage) ? 'active' : ''}">Chill Games</a></li>
          <li><a href="#" data-link="shop" class="${state.currentPage === 'shop' ? 'active' : ''}">Shop</a></li>
          <li><a href="#" data-link="code" class="${state.currentPage === 'code' ? 'active' : ''}">Enter Code</a></li>
          <li><button class="user-nav-btn" data-link="user">👤 ${state.user.points} pts</button></li>
        </ul>
      </nav>
    </div>
  </header>
`;

// ==============================
// FOOTER
// ==============================
const renderFooter = () => `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-how-it-works">
        <div class="footer-step" data-link="shop">
          <div class="footer-step-num">1</div>
          <span class="footer-step-text">Buy Smirnoff Ice</span>
        </div>
        <div class="footer-step-divider"></div>
        <div class="footer-step" data-link="code">
          <div class="footer-step-num">2</div>
          <span class="footer-step-text">Enter Code</span>
        </div>
        <div class="footer-step-divider"></div>
        <div class="footer-step" data-link="games">
          <div class="footer-step-num">3</div>
          <span class="footer-step-text">Earn Points</span>
        </div>
        <div class="footer-step-divider"></div>
        <div class="footer-step" data-link="rewards">
          <div class="footer-step-num">4</div>
          <span class="footer-step-text">Win Rewards</span>
        </div>
      </div>

      <div class="footer-links">
        <div class="footer-links-col">
          <h4>Explore</h4>
          <a href="#" data-link="events">Events</a>
          <a href="#" data-link="talent">Talent Academy</a>
          <a href="#" data-link="games">Chill Games</a>
        </div>
        <div class="footer-links-col">
          <h4>Account</h4>
          <a href="#" data-link="code">Enter Code</a>
          <a href="#" data-link="user">My Profile</a>
          <a href="#" data-link="rewards">Rewards</a>
        </div>
        <div class="footer-links-col">
          <h4>Shop</h4>
          <a href="https://www.jumia.com.ng" target="_blank">Jumia</a>
          <a href="https://www.konga.com" target="_blank">Konga</a>
        </div>
      </div>

      <div class="footer-bottom">
        <img src="${assets.logo}" alt="Smirnoff Ice" class="footer-logo">
        <p>© 2026 Smirnoff Ice Nigeria. Drink Responsibly. Must be 18+.</p>
      </div>
    </div>
  </footer>
`;

// ==============================
// PAGE ROUTER
// ==============================
const getPageContent = (pageId) => {
  switch (pageId) {
    case 'home': return renderHome();
    case 'code': return renderCodeEntry();
    case 'events': return renderEvents();
    case 'event-detail': return renderEventDetail();
    case 'talent': return renderTalent();
    case 'gallery': return renderGallery();
    case 'leaderboard': return renderLeaderboard();
    case 'games': return renderGames();
    case 'spin-game': return renderSpinGame();
    case 'shop': return renderShop();
    case 'user': return renderUserProfile();
    case 'rewards': return renderRewards();
    default: return renderHome();
  }
};

// ==============================
// HOME PAGE — bigger hero image
// ==============================
const renderHome = () => `
  <section class="hero fade-in">
    <h1 class="hero-title">POP. <span class="text-red">ENTER.</span> CHILL.</h1>
    <p class="hero-subtitle">Pop it. Play it. Show up. Win big.</p>
    <button class="btn" data-link="code" style="position: relative; z-index: 10;">POP A CAN… WIN A POINT</button>
    
    <div class="hero-image-container hero-image-large" style="margin-top: -6rem;">
      <img src="${assets.heroLineup}" class="hero-image" alt="Smirnoff Ice Lineup">
    </div>
  </section>
`;

// ==============================
// ENTER CODE PAGE — premium bottle image
// ==============================
const renderCodeEntry = () => `
  <section class="container code-entry-section fade-in">
    <div class="code-visual">
      <div class="red-accent" style="top: -30px; left: -20px; height: 380px; width: 200px; border-radius: 12px;"></div>
      <img src="${assets.smirnoffPop}" class="code-visual-img" alt="Pop & Win">
    </div>
    <div class="input-container">
      <p class="section-label">POP. ENTER. CHILL.</p>
      <h1>ENTER YOUR<br>CHILL CODE</h1>
      <p style="color: #666; font-size: 0.95rem;">Got a code under your cap? Let's see what the chill brings.</p>
      
      <input type="text" id="code-input" class="code-input" placeholder="ENTER CODE HERE" maxlength="12">
      <button id="submit-code" class="btn btn-black" style="width: 100%; font-size: 1rem;">UNLOCK MY CHILL</button>
      <div id="code-feedback" style="text-align: center;"></div>
      
      <p style="font-size: 0.75rem; color: #999; text-align: center; margin-top: 0.5rem;">
        📖 <a href="#" style="color: var(--smirnoff-red); font-weight: 600; text-decoration: none;">How to find your code</a> — Look under the crown cork or label.
      </p>
      
      <div class="rewards-preview-section">
        <p class="section-sublabel">Potential Chill Rewards</p>
        <div class="reward-preview">
          <div class="reward-card">
            <div class="reward-card-icon">🎫</div>
            <div class="reward-card-label">VIP Pass</div>
          </div>
          <div class="reward-card">
            <div class="reward-card-icon">🧥</div>
            <div class="reward-card-label">Hoodie</div>
          </div>
          <div class="reward-card">
            <div class="reward-card-icon">🎧</div>
            <div class="reward-card-label">AirPods</div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

// ==============================
// EVENTS PAGE
// ==============================
const renderEvents = () => `
  <section class="container page-section fade-in">
    <div class="page-header">
      <p class="section-label">SMIRNOFF ICE PRESENTS</p>
      <h1>Upcoming <span class="text-red">Chill</span> Events</h1>
      <p>The hottest events, powered by the coldest vibes. Don't miss out.</p>
    </div>

    <div class="page-product-accent">
      <img src="${assets.canTable}" alt="Smirnoff Ice Can on Table" class="page-product-banner" style="max-width: 1000px; width: 100%;">
    </div>
    
    <div class="events-grid">
      ${state.eventsData.map(event => `
        <div class="event-card" data-event-id="${event.id}" data-action="view-event">
          <img src="${assets[event.img]}" alt="${event.title}">
          <div class="event-overlay">
            ${event.icePass ? '<span class="event-tag">🧊 IcePass Required</span>' : '<span class="event-tag tag-open">Open Entry</span>'}
            <h3>${event.title}</h3>
            <p>${event.date} • ${event.venue}</p>
            <button class="btn btn-sm" data-event-id="${event.id}" data-action="view-event">Learn More →</button>
          </div>
        </div>
      `).join('')}
    </div>
  </section>
`;

// ==============================
// EVENT DETAIL PAGE
// ==============================
const renderEventDetail = () => {
  const event = state.eventsData.find(e => e.id === state.selectedEventId) || state.eventsData[0];
  return `
    <section class="container page-section fade-in">
      <button class="back-btn" data-link="events">← Back to Events</button>
      
      <div class="event-detail-grid">
        <div>
          <img src="${assets[event.img]}" alt="${event.title}" class="event-detail-img">
        </div>
        <div>
          ${event.icePass ? '<span class="event-tag">🧊 IcePass Required</span>' : '<span class="event-tag tag-open">Open Entry</span>'}
          <h1 style="font-size: 2.5rem; margin: 1rem 0;">${event.title}</h1>
          <p style="font-size: 1.1rem; color: #555; margin-bottom: 2rem;">${event.desc}</p>
          
          <div class="event-detail-meta">
            <div class="event-meta-item">
              <span class="event-meta-icon">📅</span>
              <div>
                <p style="font-weight: 700;">${event.date}</p>
                <p style="font-size: 0.85rem; color: #999;">Date</p>
              </div>
            </div>
            <div class="event-meta-item">
              <span class="event-meta-icon">📍</span>
              <div>
                <p style="font-weight: 700;">${event.venue}</p>
                <p style="font-size: 0.85rem; color: #999;">Venue</p>
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
            ${event.icePass ? '<button class="btn btn-gold btn-sm">USE ICEPASS</button>' : ''}
            <button class="btn btn-sm">BUY TICKET</button>
            <button class="btn btn-outline btn-sm">REDEEM POINTS</button>
          </div>

          <div class="event-product-float">
            <img src="${assets.smirnoffBottle}" alt="Smirnoff Ice" class="event-product-float-img">
          </div>
        </div>
      </div>
    </section>
  `;
};

// ==============================
// TALENT ACADEMY PAGE
// ==============================
const renderTalent = () => `
  <section class="container page-section fade-in">
    <div class="page-header">
      <p class="section-label">SMIRNOFF ICE</p>
      <h1>Chill Talent <span class="text-red">Academy</span></h1>
      <p>SHOW US HOW YOU CHILL. If you've got talent, prove it.</p>
    </div>

    <div class="page-product-accent" style="margin-bottom: 2rem;">
      <img src="${assets.singleCan}" alt="Smirnoff Ice Can" class="page-product-banner">
    </div>
    
    <div class="talent-grid">
      <div class="talent-card" data-action="submit-talent" data-category="dj">
        <img src="${assets.talentDj}" alt="DJ">
        <div class="talent-card-overlay">
          <h3>DJ</h3>
          <button class="btn btn-sm">Submit Entry →</button>
        </div>
      </div>
      <div class="talent-card" data-action="submit-talent" data-category="hypeman">
        <img src="${assets.talentHypeman}" alt="Hypeman">
        <div class="talent-card-overlay">
          <h3>HYPEMAN</h3>
          <button class="btn btn-sm">Submit Entry →</button>
        </div>
      </div>
      <div class="talent-card" data-action="submit-talent" data-category="dance">
        <img src="${assets.talentDance}" alt="Dance">
        <div class="talent-card-overlay">
          <h3>DANCE</h3>
          <button class="btn btn-sm">Submit Entry →</button>
        </div>
      </div>
      <div class="talent-card" data-action="submit-talent" data-category="producer">
        <img src="${assets.talentProducer}" alt="Afrobeat Producers">
        <div class="talent-card-overlay">
          <h3>AFROBEAT PRODUCERS</h3>
          <button class="btn btn-sm">Submit Entry →</button>
        </div>
      </div>
    </div>
    
    <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 3rem;">
      <button class="btn" data-link="gallery">VIEW GALLERY</button>
      <button class="btn btn-outline" data-link="leaderboard">LEADERBOARD</button>
    </div>
  </section>
`;

// ==============================
// GALLERY PAGE
// ==============================
const renderGallery = () => {
  const categories = ['all', 'dj', 'hypeman', 'dance', 'producer'];
  const filtered = state.talentFilter === 'all'
    ? state.mockTalents
    : state.mockTalents.filter(t => t.category === state.talentFilter);

  return `
    <section class="container page-section fade-in">
      <button class="back-btn" data-link="talent">← Back to Talent Academy</button>
      <div class="page-header">
        <h1>Talent <span class="text-red">Gallery</span></h1>
        <p>Browse entries and vote for your favourite chiller.</p>
      </div>
      
      <div class="tab-bar">
        ${categories.map(c => `
          <button class="tab-btn ${state.talentFilter === c ? 'active' : ''}" data-filter="${c}">${c === 'all' ? 'All' : c.toUpperCase()}</button>
        `).join('')}
      </div>
      
      <div class="gallery-grid">
        ${filtered.map(talent => `
          <div class="gallery-card">
            <img class="gallery-card-img" src="${assets[talent.img]}" alt="${talent.name}">
            <div class="gallery-card-info">
              <h4>${talent.name}</h4>
              <p>${talent.category.toUpperCase()}</p>
              <button class="vote-btn" data-vote-id="${talent.id}">
                ❤️ VOTE THIS CHILLER <span class="vote-count">(${talent.votes})</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

// ==============================
// LEADERBOARD PAGE
// ==============================
const renderLeaderboard = () => {
  const sorted = [...state.mockTalents].sort((a, b) => b.votes - a.votes);
  return `
    <section class="container page-section fade-in">
      <button class="back-btn" data-link="talent">← Back to Talent Academy</button>
      <div class="page-header">
        <h1>Top <span class="text-red">Chillers</span></h1>
        <p>The most voted talents across all categories.</p>
      </div>
      
      <div class="leaderboard-panel">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Talent</th>
              <th>Category</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((t, i) => `
              <tr>
                <td>
                  <span class="rank-badge ${i < 3 ? `rank-${i+1}` : 'rank-default'}">
                    ${i + 1}
                  </span>
                </td>
                <td style="font-weight: 700;">${t.name}</td>
                <td style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; color: #888;">${t.category}</td>
                <td style="font-weight: 800; color: var(--smirnoff-red);">${t.votes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
};

// ==============================
// GAMES PAGE
// ==============================
const renderGames = () => `
  <section class="container page-section fade-in" style="text-align: center;">
    
    <div class="page-header">
      <p class="section-label">PLAY & EARN</p>
      <h1>PLAY. <span class="text-red">WIN.</span> REPEAT.</h1>
      <p>Spin the wheel to earn more points.</p>
    </div>

    <div style="position: relative; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
      <img src="${assets.chillGameBg}" alt="Smirnoff Ice Chill Games" style="width: 100%; mix-blend-mode: darken; margin-bottom: 2rem;">
      
      <div style="margin-top: 0; position: relative; z-index: 10;">
        <button class="btn" data-link="spin-game" style="font-size: 1.2rem; padding: 1.2rem 4rem; box-shadow: 0 10px 30px rgba(211,47,47,0.4);">SPIN THE CHILL WHEEL</button>
      </div>
    </div>
    
  </section>
`;

// ==============================
// SPIN WHEEL GAME
// ==============================
const renderSpinGame = () => `
  <section class="container page-section fade-in">
    <button class="back-btn" data-link="games">← Back to Games</button>
    <div class="page-header">
      <h1>Spin The <span class="text-red">Chill</span> Wheel</h1>
      <p>Let's see how lucky your chill is…</p>
    </div>
    
    <div class="spin-container">
      <div class="spin-layout">
        <div class="spin-left">
          <img src="${assets.smirnoffBottle}" alt="Smirnoff Ice" class="spin-product-img">
        </div>
        <div class="spin-center">
          <div class="wheel-wrapper">
            <div class="wheel-pointer"></div>
            <canvas id="spin-wheel" class="wheel-canvas" width="320" height="320"></canvas>
          </div>
          <button id="spin-btn" class="btn" style="font-size: 1.1rem; padding: 1.2rem 3rem; margin-top: 2rem;">🎰 SPIN THE CHILL WHEEL</button>
          <div id="spin-result"></div>
        </div>
      </div>
    </div>
  </section>
`;

// ==============================
// SHOP PAGE
// ==============================
const renderShop = () => `
  <section class="container page-section fade-in">
    <div class="page-header">
      <p class="section-label">GET YOUR CHILL</p>
      <h1>Shop <span class="text-red">Smirnoff Ice</span></h1>
      <p>Get your bottles delivered. Choose your preferred store.</p>
    </div>

    <div class="shop-product-hero">
      <img src="${assets.canBg}" alt="Smirnoff Ice Collection" class="shop-product-hero-img">
    </div>
    
    <div class="shop-grid">
      <div class="shop-card">
        <div class="shop-card-logo">🛒</div>
        <h3>Jumia</h3>
        <p>Nigeria's #1 online marketplace. Fast delivery nationwide.</p>
        <a href="https://www.jumia.com.ng" target="_blank" class="btn btn-sm">SHOP ON JUMIA</a>
      </div>
      <div class="shop-card">
        <div class="shop-card-logo">🏬</div>
        <h3>Konga</h3>
        <p>Shop premium beverages with express delivery options.</p>
        <a href="https://www.konga.com" target="_blank" class="btn btn-sm">SHOP ON KONGA</a>
      </div>
    </div>
  </section>
`;

// ==============================
// USER PROFILE PAGE
// ==============================
const renderUserProfile = () => `
  <section class="container page-section fade-in">
    <div class="profile-header">
      <div class="profile-avatar">${state.user.name.charAt(0)}</div>
      <div class="profile-info">
        <h2>${state.user.name}</h2>
        <p>${state.user.phone}</p>
      </div>
      <img src="${assets.smirnoffBottle}" alt="Smirnoff Ice" class="profile-product-img">
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${state.user.points.toLocaleString()}</div>
        <div class="stat-label">Point Balance</div>
      </div>
      <div class="stat-card">
        <div class="stat-value stat-active">${state.user.icePass}</div>
        <div class="stat-label">IcePass Status</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">12</div>
        <div class="stat-label">Codes Entered</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">3</div>
        <div class="stat-label">Rewards Claimed</div>
      </div>
    </div>
    
    <div style="display: flex; gap: 1.5rem; margin-bottom: 3rem; flex-wrap: wrap;">
      <button class="btn btn-sm" data-link="rewards">VIEW REWARDS</button>
      <button class="btn btn-sm btn-outline">REDEMPTION HISTORY</button>
    </div>
    
    <h3 style="margin-bottom: 1.5rem; font-size: 1rem;">Recent Activity</h3>
    <div class="history-panel">
      <ul class="history-list">
        ${state.user.history.map(item => `
          <li class="history-item">
            <div class="history-item-info">
              <h4>${item.label}</h4>
              <p>${item.date}</p>
            </div>
            <span class="history-item-points ${item.points > 0 ? 'positive' : 'negative'}">
              ${item.points > 0 ? '+' : ''}${item.points} pts
            </span>
          </li>
        `).join('')}
      </ul>
    </div>
  </section>
`;

// ==============================
// REWARDS PAGE
// ==============================
const renderRewards = () => `
  <section class="container page-section fade-in">
    <button class="back-btn" data-link="user">← Back to Profile</button>
    <div class="page-header">
      <h1>Your <span class="text-red">Rewards</span></h1>
      <p>Redeem your points for exclusive Smirnoff Ice rewards.</p>
    </div>
    
    <div class="rewards-grid">
      <div class="reward-item">
        <div class="reward-item-icon">🎫</div>
        <h3>VIP Event Pass</h3>
        <p>Skip the queue at any Smirnoff Ice event.</p>
        <div class="reward-cost">500 Points</div>
        <br>
        <button class="btn btn-sm">REDEEM</button>
      </div>
      <div class="reward-item">
        <div class="reward-item-icon">🧥</div>
        <h3>Smirnoff Ice Hoodie</h3>
        <p>Premium limited edition branded hoodie.</p>
        <div class="reward-cost">1000 Points</div>
        <br>
        <button class="btn btn-sm">REDEEM</button>
      </div>
      <div class="reward-item">
        <div class="reward-item-icon">🎧</div>
        <h3>Wireless Earbuds</h3>
        <p>Premium wireless earbuds with noise cancellation.</p>
        <div class="reward-cost">2000 Points</div>
        <br>
        <button class="btn btn-sm btn-outline">NOT ENOUGH POINTS</button>
      </div>
      <div class="reward-item">
        <div class="reward-item-icon">🎉</div>
        <h3>Party Starter Pack</h3>
        <p>A crate of Smirnoff Ice delivered to your door.</p>
        <div class="reward-cost">750 Points</div>
        <br>
        <button class="btn btn-sm">REDEEM</button>
      </div>
      <div class="reward-item">
        <div class="reward-item-icon">✈️</div>
        <h3>All-Expense Trip</h3>
        <p>Win a trip for 2 to the Smirnoff Ice Beach Festival.</p>
        <div class="reward-cost">5000 Points</div>
        <br>
        <button class="btn btn-sm btn-outline">NOT ENOUGH POINTS</button>
      </div>
      <div class="reward-item">
        <div class="reward-item-icon">🎤</div>
        <h3>Studio Session</h3>
        <p>1-hour studio recording session at a top Lagos studio.</p>
        <div class="reward-cost">1500 Points</div>
        <br>
        <button class="btn btn-sm">REDEEM</button>
      </div>
    </div>
  </section>
`;

// ==============================
// SPIN WHEEL DRAWING
// ==============================
const wheelSegments = [
  { label: '5 pts', color: '#D32F2F', value: 5 },
  { label: '10 pts', color: '#222', value: 10 },
  { label: '2 pts', color: '#D32F2F', value: 2 },
  { label: '50 pts', color: '#FFD700', value: 50 },
  { label: '5 pts', color: '#222', value: 5 },
  { label: '20 pts', color: '#D32F2F', value: 20 },
  { label: '0 pts', color: '#555', value: 0 },
  { label: '100 pts', color: '#FFD700', value: 100 },
];

const drawWheel = () => {
  const canvas = document.getElementById('spin-wheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 160, cy = 160, r = 150;
  const segments = wheelSegments.length;
  const arc = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const startAngle = i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = wheelSegments[i].color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Montserrat, sans-serif';
    ctx.fillText(wheelSegments[i].label, r - 15, 5);
    ctx.restore();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = '#D32F2F';
  ctx.fill();
};

// ==============================
// TALENT SUBMIT MODAL
// ==============================
const showSubmitModal = (category) => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'talent-modal';
  modal.innerHTML = `
    <div class="modal-content slide-up">
      <button class="modal-close" id="close-modal">✕</button>
      <h2 style="margin-bottom: 0.5rem;">Submit Your Entry</h2>
      <p style="color: #888; margin-bottom: 2rem; font-size: 0.9rem;">Category: <strong style="color: var(--smirnoff-red); text-transform: uppercase;">${category}</strong></p>
      
      <div class="form-group">
        <label>Your Name / Stage Name</label>
        <input type="text" id="talent-name" placeholder="e.g. DJ Chill-X">
      </div>
      <div class="form-group">
        <label>Short Bio</label>
        <textarea id="talent-bio" rows="3" placeholder="Tell us about your talent..." style="resize: none;"></textarea>
      </div>
      <div class="form-group">
        <label>Video Link (YouTube / Instagram / TikTok)</label>
        <input type="url" id="talent-link" placeholder="https://...">
      </div>
      <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" id="talent-phone" placeholder="080XXXXXXXX" value="${state.user.phone}">
      </div>
      
      <button id="submit-talent-btn" class="btn" style="width: 100%;">SUBMIT MY ENTRY</button>
      <div id="talent-feedback" style="margin-top: 1rem; text-align: center;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('close-modal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('submit-talent-btn').addEventListener('click', async () => {
    const name = document.getElementById('talent-name').value.trim();
    const bio = document.getElementById('talent-bio').value.trim();
    const link = document.getElementById('talent-link').value.trim();
    const phone = document.getElementById('talent-phone').value.trim();
    const feedback = document.getElementById('talent-feedback');

    if (!name || !bio || !link) {
      feedback.innerHTML = '<p style="color: var(--smirnoff-red);">Please fill all fields.</p>';
      return;
    }

    const result = await BackendService.submitTalent({ name, bio, link, phone, category });
    if (result.success) {
      feedback.innerHTML = `
        <div style="background: rgba(76,175,80,0.08); border: 1px solid rgba(76,175,80,0.25); padding: 1rem; border-radius: 12px;">
          <p style="color: #4CAF50; font-weight: 700;">🎉 Your entry has been received!</p>
          <p style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">Share your link to get votes.</p>
        </div>
      `;
      document.getElementById('submit-talent-btn').style.display = 'none';
    } else {
      feedback.innerHTML = `<p style="color: var(--smirnoff-red);">${result.message}</p>`;
    }
  });
};

// ==============================
// TOAST NOTIFICATION
// ==============================
const showToast = (message, type = 'success') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

// ==============================
// EVENT LISTENERS
// ==============================
const attachListeners = () => {
  // Navigation Links
  document.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target.closest('[data-link]').dataset.link;
      navigateTo(target);
    });
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle && !themeToggle.dataset.listenersAttached) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.innerText = '☀️';
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.innerText = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    themeToggle.dataset.listenersAttached = 'true';
  }

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Code Entry Logic
  const submitBtn = document.querySelector('#submit-code');
  const codeInput = document.querySelector('#code-input');
  const feedback = document.querySelector('#code-feedback');

  if (submitBtn && codeInput) {
    submitBtn.addEventListener('click', async () => {
      const code = codeInput.value.trim();
      if (!code) {
        feedback.innerHTML = '<p style="color: var(--smirnoff-red); font-weight: 600;">Please enter a code.</p>';
        return;
      }

      submitBtn.innerText = 'Validating...';
      submitBtn.disabled = true;

      const result = await BackendService.validateCode(code, state.user.phone);

      if (result.success) {
        state.user.points += result.points;
        if (result.prize) {
          feedback.innerHTML = `
            <div style="background: rgba(255,215,0,0.08); border: 2px solid rgba(255,215,0,0.3); padding: 1.5rem; border-radius: 16px; animation: slideUp 0.5s ease;">
              <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎉 You just won!</p>
              <p style="font-weight: 800; font-size: 1.2rem; color: #FFA000;">${result.prize}</p>
              <p style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">Your chill just got real.</p>
            </div>
          `;
        } else {
          feedback.innerHTML = `
            <div style="background: rgba(76,175,80,0.08); border: 2px solid rgba(76,175,80,0.2); padding: 1.5rem; border-radius: 16px; animation: slideUp 0.5s ease;">
              <p style="font-size: 1.2rem; font-weight: 800; color: #4CAF50;">✅ You just earned ${result.points} Ice Points!</p>
              <p style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">Keep popping. Keep winning.</p>
            </div>
          `;
        }
        codeInput.value = '';
        showToast(`+${result.points} points added!`);
      } else {
        feedback.innerHTML = `
          <div style="background: rgba(211,47,47,0.06); border: 2px solid rgba(211,47,47,0.2); padding: 1.5rem; border-radius: 16px; animation: slideUp 0.5s ease;">
            <p style="font-weight: 700; color: var(--smirnoff-red);">❌ ${result.message || "Hmm… that code isn't chilling. Try again."}</p>
          </div>
        `;
      }

      submitBtn.innerText = 'UNLOCK MY CHILL';
      submitBtn.disabled = false;
    });

    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });
  }

  // Event View Detail
  document.querySelectorAll('[data-action="view-event"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const eventId = parseInt(e.target.closest('[data-event-id]').dataset.eventId);
      state.selectedEventId = eventId;
      navigateTo('event-detail');
    });
  });

  // Talent Submit
  document.querySelectorAll('[data-action="submit-talent"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.closest('[data-category]').dataset.category;
      showSubmitModal(category);
    });
  });

  // Gallery Filter
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      state.talentFilter = el.dataset.filter;
      renderApp();
    });
  });

  // Vote
  document.querySelectorAll('[data-vote-id]').forEach(el => {
    el.addEventListener('click', async () => {
      const id = parseInt(el.dataset.voteId);
      const talent = state.mockTalents.find(t => t.id === id);
      if (talent) {
        talent.votes += 1;
        showToast(`Voted for ${talent.name}! ❤️`);
        renderApp();
      }
    });
  });

  // Spin Wheel
  const spinBtn = document.getElementById('spin-btn');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      spinBtn.disabled = true;
      spinBtn.innerText = '🎰 Spinning...';

      const canvas = document.getElementById('spin-wheel');
      const degrees = 1800 + Math.floor(Math.random() * 360);
      canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      canvas.style.transform = `rotate(${degrees}deg)`;

      setTimeout(() => {
        const normalizedDeg = degrees % 360;
        const segmentIndex = Math.floor(normalizedDeg / (360 / wheelSegments.length));
        const reversedIndex = (wheelSegments.length - segmentIndex) % wheelSegments.length;
        const won = wheelSegments[reversedIndex];

        state.user.points += won.value;
        const resultDiv = document.getElementById('spin-result');

        if (won.value > 0) {
          resultDiv.innerHTML = `
            <div class="spin-result" style="background: rgba(76,175,80,0.08); border: 2px solid rgba(76,175,80,0.2); margin-top: 1.5rem;">
              <p style="font-size: 1.4rem; color: #4CAF50; font-weight: 800; margin-bottom: 0.5rem;">You just iced that round. ${won.value} Points added.</p>
              <button class="btn btn-sm btn-outline" style="margin-top: 1rem; border-color: #4CAF50; color: #4CAF50;" onclick="alert('Results shared to your social media!')">📤 Share Results</button>
            </div>
          `;
          showToast(`+${won.value} points from the spin wheel!`);
        } else {
          resultDiv.innerHTML = `
            <div class="spin-result" style="background: rgba(211,47,47,0.06); border: 2px solid rgba(211,47,47,0.15); margin-top: 1.5rem;">
              <p>Better luck next spin! 🧊</p>
            </div>
          `;
        }

        spinBtn.disabled = false;
        spinBtn.innerText = '🎰 SPIN AGAIN';
      }, 4500);
    });
  }
};

// ==============================
// INITIAL RENDER
// ==============================
renderApp();

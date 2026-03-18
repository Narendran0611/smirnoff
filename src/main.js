import './index.css';

// --- MOCK REPOSITORY / SERVICE ---
const MockService = {
  validateCode: (code) => {
    const validCodes = ['CHILL2024', 'ICEPASS', 'SMIRNOFF1'];
    return new Promise((resolve) => {
      setTimeout(() => {
        if (validCodes.includes(code.toUpperCase())) {
          resolve({ success: true, points: 50 });
        } else {
          resolve({ success: false, message: 'Hmm… that code isn’t chilling. Try again.' });
        }
      }, 800);
    });
  }
};

// --- STATE MANAGEMENT ---
const state = {
  currentPage: 'home',
  user: {
    points: 1250,
    icePass: 'Active'
  }
};

const assets = {
  logo: '/src/assets/logo.png',
  heroLineup: '/src/assets/hero-lineup.png',
  iconBuy: '/src/assets/icon-buy.png',
  iconEnter: '/src/assets/icon-enter.png',
  iconPoints: '/src/assets/icon-points.png',
  iconRewards: '/src/assets/icon-rewards.png',
  crownCork: '/src/assets/crown-cork.png',
  eventParty: '/src/assets/event-party.png',
  talentDj: '/src/assets/talent-dj.png',
  talentDance: '/src/assets/talent-dance.png',
  talentHypeman: '/src/assets/talent-hypeman.png',
  talentProducer: '/src/assets/talent-producer.png'
};

// --- ROUTER & RENDERING ---
const renderPage = (pageId) => {
  state.currentPage = pageId;
  const app = document.querySelector('#app');
  
  if (['events', 'talent'].includes(pageId)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  app.innerHTML = `
    ${renderHeader()}
    <main id="content">
      ${getPageContent(pageId)}
    </main>
    ${renderFooter()}
  `;
  
  attachListeners();
  window.scrollTo(0, 0);
};

const renderHeader = () => `
  <header class="site-header">
    <div class="container nav-container">
      <div class="logo">
        <a href="#" data-link="home">
          <img src="${assets.logo}" alt="Smirnoff Ice">
        </a>
      </div>
      <nav>
        <ul class="nav-links">
          <li><a href="#" data-link="home" class="${state.currentPage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="#" data-link="rewards">Rewards</a></li>
          <li><a href="#" data-link="events" class="${state.currentPage === 'events' ? 'active' : ''}">Events</a></li>
          <li><a href="#" data-link="talent" class="${state.currentPage === 'talent' ? 'active' : ''}">Talent Academy</a></li>
          <li><a href="#" data-link="games">Chill Games</a></li>
          <li><a href="#" data-link="code" class="${state.currentPage === 'code' ? 'active' : ''}">Enter Code</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

const renderFooter = () => `
  <footer class="container">
    <div class="feature-tier">
      <div class="feature-item">
        <img src="${assets.iconBuy}" class="feature-icon" alt="Buy">
        <span class="feature-text">Buy Smirnoff Ice</span>
      </div>
      <div class="feature-item">
        <img src="${assets.iconEnter}" class="feature-icon" alt="Enter">
        <span class="feature-text">Enter Code</span>
      </div>
      <div class="feature-item">
        <img src="${assets.iconPoints}" class="feature-icon" alt="Points">
        <span class="feature-text">Earn Points</span>
      </div>
      <div class="feature-item">
        <img src="${assets.iconRewards}" class="feature-icon" alt="Rewards">
        <span class="feature-text">Win Rewards</span>
      </div>
    </div>
  </footer>
`;

const getPageContent = (pageId) => {
  switch (pageId) {
    case 'home': return renderHome();
    case 'code': return renderCodeEntry();
    case 'events': return renderEvents();
    case 'talent': return renderTalent();
    default: return renderHome();
  }
};

// --- PAGE TEMPLATES ---

const renderHome = () => `
  <section class="hero fade-in">
    <h1 class="hero-title">POP. <span class="text-red">ENTER.</span> CHILL.</h1>
    <p class="hero-subtitle">Buy. Enter your code. Unlock rewards.</p>
    <button class="btn" data-link="code">Unlock Your Chill</button>
    
    <div class="hero-image-container">
      <img src="${assets.heroLineup}" class="hero-image" alt="Smirnoff Lineup">
      <div class="ice-base"></div>
    </div>
  </section>
`;

const renderCodeEntry = () => `
  <section class="container code-entry-section fade-in">
    <div class="code-visual">
      <div class="red-accent" style="top: -20px; left: -20px; height: 300px; width: 150px;"></div>
      <img src="${assets.crownCork}" class="crown-cork-img" alt="Smirnoff Cap">
    </div>
    <div class="input-container">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">ENTER YOUR CODE</h1>
      <p style="text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">Enter Your Chill Code Here</p>
      <input type="text" id="code-input" class="code-input" placeholder="ADC0C1E4F" maxlength="10">
      <button id="submit-code" class="btn btn-black" style="width: 100%; font-size: 1.2rem;">Submit Code</button>
      <div id="code-feedback" style="margin-top: 1rem; font-weight: 600; text-align: center;"></div>
      
      <div style="margin-top: 3rem; border-top: 1px solid #ddd; padding-top: 2rem;">
        <p style="font-size: 0.8rem; color: #666; font-weight: 800; letter-spacing: 1px;">POTENTIAL CHILL REWARDS</p>
        <div style="display: flex; gap: 2rem; margin-top: 1.5rem;">
           <div class="glass-panel" style="padding: 1rem; flex: 1; text-align: center; border-radius: 12px; height: 120px; display: flex; align-items: center; justify-content: center;">
             <span style="font-size: 0.7rem; font-weight: 900;">VIP PASS</span>
           </div>
           <div class="glass-panel" style="padding: 1rem; flex: 1; text-align: center; border-radius: 12px; height: 120px; display: flex; align-items: center; justify-content: center;">
             <span style="font-size: 0.7rem; font-weight: 900;">HOODIE</span>
           </div>
        </div>
      </div>
    </div>
  </section>
`;

const renderEvents = () => `
  <section class="container fade-in" style="padding-top: 10rem; padding-bottom: 5rem;">
    <div class="glass-panel text-center" style="margin-bottom: 4rem;">
      <h1 style="font-size: 4rem;">Upcoming Events</h1>
    </div>
    
    <div class="events-grid">
      <div class="event-card" style="background-image: url('${assets.eventParty}')">
        <div class="event-overlay">
          <h3>Smirnoff Summer Festival (Lagos)</h3>
          <p style="color: #ccc; font-size: 0.9rem;">Bring the heat. Chill with us. IcePass Required.</p>
          <button class="btn btn-outline" style="margin-top: 1.5rem; border-color: white; color: white;">[ Redeem Points ]</button>
        </div>
      </div>
      <div class="event-card" style="background-image: url('${assets.eventParty}')">
        <div class="event-overlay">
          <h3>Talent Academy Showcase</h3>
          <p style="color: #ccc; font-size: 0.9rem;">Witness the next gen of chill stars.</p>
          <button class="btn btn-outline" style="margin-top: 1.5rem; border-color: white; color: white;">[ Chill at Event ]</button>
        </div>
      </div>
      <div class="event-card" style="background-image: url('${assets.eventParty}')">
        <div class="event-overlay">
          <h3>Chill Zone Pop-Up</h3>
          <p style="color: #ccc; font-size: 0.9rem;">Exclusive vibes at Victoria Island.</p>
          <button class="btn btn-outline" style="margin-top: 1.5rem; border-color: white; color: white;">[ Buy Ticket ]</button>
        </div>
      </div>
    </div>
  </section>
`;

const renderTalent = () => `
  <section class="container fade-in" style="padding-top: 10rem; padding-bottom: 5rem;">
    <div class="text-center" style="margin-bottom: 5rem;">
      <h1 style="font-size: 3.5rem;">Smirnoff Ice Talent Academy</h1>
      <p style="font-size: 1.2rem; color: #555; margin-top: 1rem;">SHOW US HOW YOU CHILL. If you've got talent, prove it.</p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem;">
      <div class="event-card" style="background-image: url('${assets.talentDj}'); height: 250px;">
        <div class="event-overlay" style="align-items: flex-start;">
          <h3>DJ</h3>
          <button class="btn btn-outline" style="margin-top: 1rem; border-color: white; color: white;">[ Submit Entry ]</button>
        </div>
      </div>
      <div class="event-card" style="background-image: url('${assets.talentDance}'); height: 250px;">
        <div class="event-overlay" style="align-items: flex-start;">
          <h3>DANCE</h3>
          <button class="btn btn-outline" style="margin-top: 1rem; border-color: white; color: white;">[ Submit Entry ]</button>
        </div>
      </div>
      <div class="event-card" style="background-image: url('${assets.talentHypeman}'); height: 250px;">
        <div class="event-overlay" style="align-items: flex-start;">
          <h3>HYPEMAN</h3>
          <button class="btn btn-outline" style="margin-top: 1rem; border-color: white; color: white;">[ Submit Entry ]</button>
        </div>
      </div>
      <div class="event-card" style="background-image: url('${assets.talentProducer}'); height: 250px;">
        <div class="event-overlay" style="align-items: flex-start;">
          <h3>AFROBEAT PRODUCERS</h3>
          <button class="btn btn-outline" style="margin-top: 1rem; border-color: white; color: white;">[ Submit Entry ]</button>
        </div>
      </div>
    </div>
    
    <div class="text-center" style="display: flex; gap: 2rem; justify-content: center;">
      <button class="btn btn-outline">[ View Gallery ]</button>
      <button class="btn btn-outline">[ Leaderboard ]</button>
    </div>
  </section>
`;

const attachListeners = () => {
  // Navigation Links
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target.closest('[data-link]').dataset.link;
      renderPage(target);
    });
  });

  // Code Entry Logic
  const submitBtn = document.querySelector('#submit-code');
  const codeInput = document.querySelector('#code-input');
  const feedback = document.querySelector('#code-feedback');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const code = codeInput.value.trim();
      if (!code) return;

      submitBtn.innerText = 'Chilling...';
      submitBtn.disabled = true;

      const result = await MockService.validateCode(code);
      
      if (result.success) {
        state.user.points += result.points;
        feedback.innerHTML = `<span style="color: green;">Success! 50 Points Added.</span>`;
        codeInput.value = '';
      } else {
        feedback.innerHTML = `<span style="color: var(--smirnoff-red);">${result.message}</span>`;
      }

      submitBtn.innerText = 'Submit Code';
      submitBtn.disabled = false;
    });
  }
};

// --- INITIAL RENDER ---
renderPage('home');

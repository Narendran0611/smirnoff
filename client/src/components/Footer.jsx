import { Link, useLocation } from 'react-router-dom';
import assets from '../assets';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isHome && (
          <div className="footer-how-it-works">
            <Link to="/shop" className="footer-step">
              <div className="footer-step-icon-wrapper">
                <img src={assets.iconBuy} alt="Buy" className="footer-step-icon" />
                <div className="footer-step-num">1</div>
              </div>
              <div className="footer-step-info">
                <span className="footer-step-label">Step 01</span>
                <span className="footer-step-text">Buy Smirnoff Ice</span>
              </div>
            </Link>
            
            <div className="footer-step-divider"></div>

            <Link to="/code" className="footer-step">
              <div className="footer-step-icon-wrapper">
                <img src={assets.iconEnter} alt="Enter" className="footer-step-icon" />
                <div className="footer-step-num">2</div>
              </div>
              <div className="footer-step-info">
                <span className="footer-step-label">Step 02</span>
                <span className="footer-step-text">Enter Code</span>
              </div>
            </Link>
            
            <div className="footer-step-divider"></div>

            <Link to="/games" className="footer-step">
              <div className="footer-step-icon-wrapper">
                <img src={assets.iconPoints} alt="Earn" className="footer-step-icon" />
                <div className="footer-step-num">3</div>
              </div>
              <div className="footer-step-info">
                <span className="footer-step-label">Step 03</span>
                <span className="footer-step-text">Earn Points</span>
              </div>
            </Link>
            
            <div className="footer-step-divider"></div>

            <Link to="/rewards" className="footer-step">
              <div className="footer-step-icon-wrapper">
                <img src={assets.iconRewards} alt="Win" className="footer-step-icon" />
                <div className="footer-step-num">4</div>
              </div>
              <div className="footer-step-info">
                <span className="footer-step-label">Step 04</span>
                <span className="footer-step-text">Win Rewards</span>
              </div>
            </Link>
          </div>
        )}

        <div className="footer-links">
          <div className="footer-links-col">
            <h4>Explore</h4>
            <Link to="/events">Events</Link>
            <Link to="/talent">Talent Academy</Link>
            <Link to="/games">Chill Games</Link>
          </div>
          <div className="footer-links-col">
            <h4>Account</h4>
            <Link to="/code">Enter Code</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/rewards">Rewards</Link>
          </div>
          <div className="footer-links-col">
            <h4>Shop</h4>
            <a href="https://www.jumia.com.ng" target="_blank" rel="noopener noreferrer">Jumia</a>
            <a href="https://www.konga.com" target="_blank" rel="noopener noreferrer">Konga</a>
          </div>
        </div>

        <div className="footer-bottom">
          <img src={assets.logo} alt="Smirnoff Ice" className="footer-logo" />
          <p>© 2026 Smirnoff Ice Nigeria. Drink Responsibly. Must be 18+.</p>
        </div>
      </div>
    </footer>
  );
}

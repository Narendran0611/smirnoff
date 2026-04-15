import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import assets from '../assets';

export default function Header() {
  const { user, darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (paths) => paths.some(p => currentPath === p || currentPath.startsWith(p + '/'));

  const handleHamburger = () => {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.toggle('open');
  };

  const closeNav = () => {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.remove('open');
  };

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center" onClick={closeNav}>
              <img src={assets.logoSmirnoffIce} alt="Smirnoff Ice" className="h-12 sm:h-16" />
            </Link>
          </div>
        <nav className="flex items-center gap-4 sm:gap-8">
          <ul className="nav-links" id="nav-links">
            <li><Link to="/" className={currentPath === '/' ? 'active' : ''} onClick={closeNav}>Home</Link></li>
            <li><Link to="/events" className={isActive(['/events', '/event']) ? 'active' : ''} onClick={closeNav}>Events</Link></li>
            <li><Link to="/talent" className={isActive(['/talent', '/gallery', '/leaderboard']) ? 'active' : ''} onClick={closeNav}>Talent Academy</Link></li>
            <li><Link to="/games" className={isActive(['/games', '/spin-game']) ? 'active' : ''} onClick={closeNav}>Chill Games</Link></li>
            <li><Link to="/shop" className={isActive(['/shop']) ? 'active' : ''} onClick={closeNav}>Shop</Link></li>
            <li><Link to="/code" className={isActive(['/code']) ? 'active' : ''} onClick={closeNav}>Enter Code</Link></li>
            <li className="md:hidden mt-4">
               <button onClick={() => { toggleDarkMode(); closeNav(); }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                 {darkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
               </button>
            </li>
          </ul>
          
          <div className="flex items-center gap-4">
            <Link to="/profile" className="user-nav-btn hidden sm:flex items-center gap-2" onClick={closeNav}>
              <span className="text-[10px] uppercase font-bold text-gray-400">Balance</span>
              <span className="font-black">{user.points} pts</span>
            </Link>
            
            <div className="nav-controls flex items-center gap-2 sm:gap-4">
              <button
                id="theme-toggle"
                className="theme-toggle-btn relative w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:outline-none transition-colors duration-300"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                onClick={toggleDarkMode}
              >
                <div 
                  className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-black shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${darkMode ? 'translate-x-6 sm:translate-x-8' : 'translate-x-0'}`}
                >
                  {darkMode ? (
                    <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                  ) : (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-smirnoff-red" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                  )}
                </div>
              </button>

              <div className="hamburger" id="hamburger" onClick={handleHamburger}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

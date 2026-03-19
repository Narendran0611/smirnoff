import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import CodeEntry from './pages/CodeEntry';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Talent from './pages/Talent';
import Gallery from './pages/Gallery';
import Leaderboard from './pages/Leaderboard';
import Games from './pages/Games';
import SpinGame from './pages/SpinGame';
import Shop from './pages/Shop';
import UserProfile from './pages/UserProfile';
import Rewards from './pages/Rewards';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import AgeGate from './components/AgeGate';

function AppContent() {
  return (
    <>
      <AgeGate />
      <ScrollToTop />
      <Header />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/code" element={<CodeEntry />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/spin-game" element={<SpinGame />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

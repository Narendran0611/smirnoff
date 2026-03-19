import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

const initialUser = {
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
};

const eventsData = [
  { id: 1, title: 'AMVCA After-Party', date: 'April 5, 2026', venue: 'Eko Hotel, Lagos', desc: 'The biggest party after the AMVCA awards. Smirnoff Ice exclusive.', icePass: true, img: 'eventParty' },
  { id: 2, title: 'Smirnoff Ice Party – Coming Soon', date: 'April 20, 2026', venue: 'Hard Rock Café, Lagos', desc: 'A premium night of vibes, music, and unlimited chill. IcePass holders get VIP entry.', icePass: true, img: 'eventFestival' },
  { id: 3, title: 'Group Therapy Sessions', date: 'May 1, 2026', venue: 'The Chill Zone, Victoria Island', desc: 'Good vibes only. Talk, laugh, chill with Smirnoff Ice.', icePass: false, img: 'eventPopup' },
  { id: 4, title: 'Chill Talent Academy Showcase', date: 'May 15, 2026', venue: 'Terra Kulture, Lagos', desc: 'Watch the top talents from the Chill Talent Academy compete live.', icePass: false, img: 'eventParty' },
  { id: 5, title: 'South Social Club', date: 'June 1, 2026', venue: 'Muri Okunola Park, Lagos', desc: 'An outdoor chill fest with live DJs, food, and Smirnoff Ice.', icePass: false, img: 'eventFestival' },
  { id: 6, title: 'Chill Buddies Meet & Greet', date: 'June 10, 2026', venue: 'Landmark Beach, Lagos', desc: 'A special hangout for loyal Smirnoff Ice fans. Free entry with IcePass.', icePass: true, img: 'eventPopup' }
];

const mockTalents = [
  { id: 1, name: 'DJ Chill-X', category: 'dj', votes: 342, img: 'talentDj' },
  { id: 2, name: 'Vibes Queen', category: 'dance', votes: 287, img: 'talentDance' },
  { id: 3, name: 'MC IceCold', category: 'hypeman', votes: 198, img: 'talentHypeman' },
  { id: 4, name: 'BeatSmith', category: 'producer', votes: 156, img: 'talentProducer' },
  { id: 5, name: 'Spinmaster K', category: 'dj', votes: 312, img: 'talentDj' },
  { id: 6, name: 'FlexGod', category: 'dance', votes: 245, img: 'talentDance' },
  { id: 7, name: 'Hype King', category: 'hypeman', votes: 178, img: 'talentHypeman' },
  { id: 8, name: 'Afro Genius', category: 'producer', votes: 134, img: 'talentProducer' }
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [talents, setTalents] = useState(mockTalents);
  const [talentFilter, setTalentFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const addPoints = useCallback((pts) => {
    setUser(prev => ({ ...prev, points: prev.points + pts }));
  }, []);

  const redeemPoints = useCallback((cost, label) => {
    setUser(prev => ({
      ...prev,
      points: prev.points - cost,
      history: [
        { type: 'redeem', label: `${label} Redeemed`, points: -cost, date: new Date().toISOString().split('T')[0] },
        ...prev.history
      ]
    }));
  }, []);

  const voteTalent = useCallback((id) => {
    setTalents(prev => prev.map(t => t.id === id ? { ...t, votes: t.votes + 1 } : t));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      return next;
    });
  }, []);

  const value = {
    user,
    setUser,
    addPoints,
    redeemPoints,
    eventsData,
    talents,
    setTalents,
    talentFilter,
    setTalentFilter,
    voteTalent,
    toast,
    showToast,
    addToast: showToast, // Alias for compatibility
    darkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

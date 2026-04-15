const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

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
  redeemPoints: async (phone, cost, label) => {
    try {
      const res = await fetch(`${API_BASE}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, cost, label })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server unreachable.' };
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
  },
  useIcePass: async (phone, eventName) => {
    try {
      const res = await fetch(`${API_BASE}/use-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, eventName })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server unreachable.' };
    }
  }
};

export default BackendService;

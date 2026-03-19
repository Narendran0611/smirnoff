import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BackendService from '../services/BackendService';
import assets from '../assets';

export default function CodeEntry() {
  const { user, addPoints, showToast } = useAppContext();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setFeedback({ type: 'error', html: 'Please enter a code.' });
      return;
    }

    setSubmitting(true);
    const result = await BackendService.validateCode(code.trim(), user.phone);

    if (result.success) {
      // Refresh user data from server to get new points + icePassCount
      const updatedUser = await BackendService.getUser(user.phone);
      if (updatedUser) setUser(updatedUser);

      if (result.wonPass) {
        setFeedback({
          type: 'prize',
          prize: 'VIP ICEPASS 🎫',
          points: result.pointsWon,
        });
      } else {
        setFeedback({
          type: 'success',
          points: result.pointsWon,
        });
      }
      setCode('');
      showToast(`+${result.pointsWon} points added!`);
    } else {
      setFeedback({
        type: 'error',
        html: result.message || "Hmm… that code isn't chilling. Try again.",
      });
    }
    setSubmitting(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 items-center pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="relative flex items-center justify-center order-first md:order-none">
        <div
          className="absolute bg-smirnoff-red -skew-x-12 z-[-1] opacity-80 rounded-xl"
          style={{ top: '-1.875rem', left: '-1.25rem', height: '23.75rem', width: '12.5rem' }}
        ></div>
        <img
          src={assets.smirnoffPop}
          className="w-full max-w-md rounded-2xl animate-float"
          alt="Pop & Win"
          style={{ boxShadow: '0 1.875rem 3.75rem rgba(0,0,0,0.12)' }}
        />
      </div>
      <div className="flex flex-col gap-5">
        <p className="section-label">POP. ENTER. CHILL.</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
          ENTER YOUR<br />CHILL CODE
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Got a code under your cap? Let's see what the chill brings.
        </p>
        <input
          type="text"
          className="code-input"
          placeholder="ENTER CODE HERE"
          maxLength="12"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
        />
        <button
          className="btn btn-black w-full text-base"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Validating...' : 'UNLOCK MY CHILL'}
        </button>

        {/* Feedback */}
        <div id="code-feedback" className="text-center">
          {feedback?.type === 'prize' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl animate-slide-up">
              <p className="text-2xl mb-2">🎉 You just won!</p>
              <p className="font-extrabold text-xl text-yellow-600">{feedback.prize}</p>
              <p className="text-sm text-gray-400 mt-2">Your chill just got real.</p>
            </div>
          )}
          {feedback?.type === 'success' && (
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl animate-slide-up">
              <p className="text-xl font-extrabold text-green-500">✅ You just earned {feedback.points} Ice Points!</p>
              <p className="text-sm text-gray-400 mt-2">Keep popping. Keep winning.</p>
            </div>
          )}
          {feedback?.type === 'error' && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl animate-slide-up">
              <p className="font-bold text-smirnoff-red">❌ {feedback.html}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          📖 <span className="text-smirnoff-red font-semibold">How to find your code</span> — Look under the crown cork or label.
        </p>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider mb-4">Potential Chill Rewards</p>
          <div className="flex gap-4">
            <div className="flex-1 p-6 text-center rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.04)' }}>
              <div className="text-3xl mb-2">🎫</div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500">VIP Pass</div>
            </div>
            <div className="flex-1 p-6 text-center rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.04)' }}>
              <div className="text-3xl mb-2">🧥</div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Hoodie</div>
            </div>
            <div className="flex-1 p-6 text-center rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.04)' }}>
              <div className="text-3xl mb-2">🎧</div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500">AirPods</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

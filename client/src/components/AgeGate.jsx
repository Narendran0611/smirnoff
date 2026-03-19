import { useState, useEffect } from 'react';
import assets from '../assets';

export default function AgeGate() {
  const [isAged, setIsAged] = useState(true);

  useEffect(() => {
    const aged = sessionStorage.getItem('smirnoff-age-verified');
    if (!aged) {
      setIsAged(false);
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('smirnoff-age-verified', 'true');
    setIsAged(true);
    window.location.reload(); // Refresh to ensure theme and other things sync
  };

  if (isAged) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-40">
        <img src={assets.landingNew} alt="Background" className="w-full h-full object-cover blur-sm" />
      </div>
      
      <div className="relative bg-white dark:bg-gray-900 b-8 p-8 sm:p-12 rounded-3xl max-w-md w-full text-center shadow-2xl animate-scale-in">
        <div className="smirnoff-badge inline-block mb-8 py-2 px-6 text-xl">SMIRNOFF ICE</div>
        
        <h2 className="text-3xl font-black mb-4 text-gray-900 dark:text-white uppercase italic">Are you over 18?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You must be of legal drinking age to enter the Smirnoff Ice Experience.
        </p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleConfirm}
            className="btn btn-black w-full py-4 text-lg font-bold"
          >
            I AM 18+ ENTER SITE
          </button>
          <a 
            href="https://www.responsibledrinking.org/"
            className="text-sm text-gray-400 hover:text-smirnoff-red transition-colors"
          >
            No, I am under 18
          </a>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Drink Responsibly</p>
        </div>
      </div>
    </div>
  );
}

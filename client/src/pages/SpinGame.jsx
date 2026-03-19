import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import assets from '../assets';

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

export default function SpinGame() {
  const { addPoints, showToast } = useAppContext();
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
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

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 14px Montserrat, sans-serif';
      ctx.fillText(wheelSegments[i].label, r - 15, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#D32F2F';
    ctx.fill();
  }, []);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const canvas = canvasRef.current;
    const degrees = 1800 + Math.floor(Math.random() * 360);
    canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    canvas.style.transform = `rotate(${degrees}deg)`;

    setTimeout(() => {
      const normalizedDeg = degrees % 360;
      // The pointer is at the top (270 degrees). 
      // To find the segment under the pointer, we calculate which original degree ended up at 270.
      const actualDegree = (270 - normalizedDeg + 360) % 360;
      const segmentIndex = Math.floor(actualDegree / (360 / wheelSegments.length));
      const won = wheelSegments[segmentIndex];

      addPoints(won.value);

      if (won.value > 0) {
        setResult({ type: 'win', value: won.value });
        showToast(`+${won.value} points from the spin wheel!`);
      } else {
        setResult({ type: 'lose' });
      }

      setSpinning(false);
    }, 4500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in pt-28 sm:pt-32 pb-20 min-h-screen">
      <Link to="/games" className="back-btn">← Back to Games</Link>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-3">
          Spin The <span className="text-smirnoff-red">Chill</span> Wheel
        </h1>
        <p className="text-base text-gray-500">Let's see how lucky your chill is…</p>
      </div>
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-8 md:gap-12 justify-center">
          <div className="hidden md:block">
            <img
              src={assets.smirnoffBottle}
              alt="Smirnoff Ice"
              className="max-w-[11.25rem] animate-float"
              style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 0.9375rem 1.875rem rgba(0,0,0,0.1))' }}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="wheel-wrapper">
              <div className="wheel-pointer"></div>
              <canvas
                ref={canvasRef}
                className="wheel-canvas"
                width="320"
                height="320"
              />
            </div>
            <button
              className="btn text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 mt-8"
              onClick={handleSpin}
              disabled={spinning}
            >
              {spinning ? '🎰 Spinning...' : (result ? '🎰 SPIN AGAIN' : '🎰 SPIN THE CHILL WHEEL')}
            </button>
            {result && (
              <div>
                {result.type === 'win' ? (
                  <div className="spin-result bg-green-50 border-2 border-green-200 mt-6">
                    <p className="text-xl text-green-500 font-extrabold mb-2">
                      You just iced that round. {result.value} Points added.
                    </p>
                    <button
                      className="btn btn-sm btn-outline border-green-500 text-green-500 mt-4"
                      onClick={() => alert('Results shared to your social media!')}
                    >
                      📤 Share Results
                    </button>
                  </div>
                ) : (
                  <div className="spin-result bg-red-50 border-2 border-red-200 mt-6">
                    <p>Better luck next spin! 🧊</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

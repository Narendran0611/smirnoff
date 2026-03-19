import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import assets from '../assets';

const slides = [
  { id: 1, img: assets.landingNew },
  { id: 2, img: assets.smirnoff_ice_original },
  { id: 3, img: assets.smirnoff_ice_party },
  { id: 4, img: assets.smirnoff_ice_green_apple },
  { id: 5, img: assets.smirnoff_ice_beach },
  { id: 6, img: assets.smirnoff_ice_tropical },
  { id: 7, img: assets.smirnoff_ice_lemon_refresh },
  { id: 8, img: assets.smirnoff_ice_red_party },
  { id: 9, img: assets.smirnoff_ice_collection },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="animate-fade-in w-full overflow-x-hidden pt-24 sm:pt-32 pb-4 bg-white dark:bg-gray-950">
      
      {/* Hero Text */}
      <section className="flex flex-col items-center text-center px-4 max-w-7xl mx-auto mb-12">
        <span className="section-label bg-smirnoff-red text-white py-1.5 px-6 inline-block font-black text-xs sm:text-sm tracking-widest italic mb-6" 
          style={{ clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)' }}>
          POP. ENTER. CHILL.
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-gray-950 dark:text-white uppercase italic mb-6">
          UNLOCK THE<br />
          <span className="text-smirnoff-red">CHILL EXPERIENCE</span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl font-medium mb-8">
          Every pop brings you closer to the ultimate VIP vibe. Enter your code and win exclusive Smirnoff Ice rewards.
        </p>
        <Link to="/code" className="btn py-4 sm:py-5 px-10 sm:px-14 text-sm sm:text-lg font-black uppercase italic tracking-wider">
          ENTER CODE NOW
        </Link>
      </section>

      {/* === PREMIUM CAROUSEL (80% width) === */}
      <section className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto relative mb-6">
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-3xl" 
          style={{ 
            boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
          }}>
          
          {/* Slide Track */}
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0 relative">
                <img 
                  src={slide.img} 
                  alt="Smirnoff Ice" 
                  className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] object-cover"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlays on edges for premium feel */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/30 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 to-transparent pointer-events-none z-10"></div>

          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Counter (bottom-right) */}
          <div className="absolute bottom-4 right-6 z-20 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full">
            {activeSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2.5 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`rounded-full transition-all duration-500 ${
                index === activeSlide 
                  ? 'w-10 h-3 bg-smirnoff-red shadow-lg shadow-smirnoff-red/30' 
                  : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 hover:scale-125'
              }`}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

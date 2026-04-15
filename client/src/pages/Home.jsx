import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import assets from '../assets';

const slides = [
  { id: 1, img: '/carousel/carousel_beach_sunset.png' },
  { id: 2, img: '/carousel/carousel_brand_girl.jpg' },
  { id: 3, img: '/carousel/carousel_bottle_opening.jpg' },
  { id: 4, img: '/carousel/carousel_bottle_bokeh.jpg' },
  { id: 5, img: '/carousel/carousel_bottles_lineup.jpg' },
  { id: 6, img: '/carousel/carousel_double_black_banner.jpg' },
  { id: 7, img: assets.landingNew },
  { id: 8, img: '/carousel/carousel_bottle_closeup.jpg' },
  { id: 9, img: '/carousel/carousel_brand_ambassador.jpg' },
  { id: 10, img: '/carousel/carousel_party_sip.jpg' },
  { id: 11, img: '/carousel/carousel_smirnoff_cups.jpg' },
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
            {slides.map((slide, index) => (
              <div key={slide.id} className="w-full flex-shrink-0 relative">
                <img 
                  src={slide.img} 
                  alt="Smirnoff Ice" 
                  loading={index === 0 ? "eager" : "lazy"}
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

      {/* Flavours Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-16 text-center">
        <h2 className="text-3xl sm:text-5xl font-black italic mb-4 text-gray-950 dark:text-white uppercase tracking-tighter">
          Meet The <span className="text-smirnoff-red">Flavours</span>
        </h2>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          Discover the perfect chill for every vibe. Which one are you grabbing?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Original", img: assets.smirnoff_ice_original },
            { name: "Green Apple", img: assets.smirnoff_ice_green_apple },
            { name: "Tropical", img: assets.smirnoff_ice_tropical },
            { name: "Lemon Refresh", img: assets.smirnoff_ice_lemon_refresh }
          ].map((flavour, idx) => (
            <div key={idx} className="group flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-48 sm:h-64 mb-6 relative w-full flex items-center justify-center">
                <img 
                  src={flavour.img} 
                  alt={flavour.name} 
                  loading="lazy"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide dark:text-gray-200">
                {flavour.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Shop Banner */}
      <section className="relative w-full overflow-hidden mt-8 mb-0">
        <div className="absolute inset-0 z-0">
          <img src={assets.canTable} alt="Smirnoff Ice Table" loading="lazy" className="w-full h-full object-cover object-center filter brightness-[0.7] sm:brightness-[0.8]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic text-white uppercase tracking-tighter mb-6" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            READY TO <span className="text-smirnoff-red">CHILL?</span>
          </h2>
          <p className="text-gray-200 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-8" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Grab your favorite Smirnoff Ice flavors online and have them delivered straight to your door.
          </p>
          <Link to="/shop" className="btn py-4 px-12 text-sm sm:text-lg font-black uppercase italic tracking-wider">
            SHOP NOW
          </Link>
        </div>
      </section>

    </div>
  );
}

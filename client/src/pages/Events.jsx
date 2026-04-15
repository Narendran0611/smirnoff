import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import assets from '../assets';

export default function Events() {
  const { eventsData } = useAppContext();
  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <>
      <section className="animate-fade-in w-screen -ml-[50vw] left-[50%] relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-[4.375rem]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[1]">
          <img
            src={assets.eventPageBg}
            alt="Smirnoff Ice Events"
            className="w-full h-full object-cover brightness-[0.6]"
            style={{ transform: 'scale(1.06) translate(2%,2%)' }}
          />
        </div>
        <div className="relative z-[2] py-12 px-4 text-white text-center mb-0">
          <p className="section-label" style={{ boxShadow: '0 0.3125rem 0.9375rem rgba(0,0,0,0.5)' }}>
            SMIRNOFF ICE PRESENTS
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white"
            style={{ textShadow: '0 0.25rem 1.25rem rgba(0,0,0,0.8)' }}
          >
            Upcoming <span className="text-smirnoff-red">Chill</span> Events
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg"
            style={{ textShadow: '0 0.125rem 0.625rem rgba(0,0,0,0.8)' }}
          >
            The hottest events, powered by the coldest vibes. Don't miss out.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map(event => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => handleEventClick(event.id)}
            >
              <img src={assets[event.img]} alt={event.title} loading="lazy" />
              <div className="event-overlay">
                {event.icePass ? (
                  <span className="event-tag">🧊 IcePass Required</span>
                ) : (
                  <span className="event-tag tag-open">Open Entry</span>
                )}
                <h3>{event.title}</h3>
                <p>{event.date} • {event.venue}</p>
                <button
                  className="btn btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event.id);
                  }}
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

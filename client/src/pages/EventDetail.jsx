import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import assets from '../assets';
import BackendService from '../services/BackendService';

export default function EventDetail() {
  const { id } = useParams();
  const { eventsData, user, setUser, addToast } = useAppContext();
  const event = eventsData.find(e => e.id === parseInt(id)) || eventsData[0];

  const handleUsePass = async () => {
    console.log('USE ICEPASS clicked for:', event.title);
    if (!user) return addToast('Please enter your phone number first!', 'error');
    if (user.ice_pass_count <= 0) return addToast('You have no IcePasses! Enter codes to win some.', 'error');

    const res = await BackendService.useIcePass(user.phone, event.title);
    if (res.success) {
      addToast(`🎟️ Entry Confirmed! Your digital ticket for ${event.title} has been sent to your mail.`, 'success');
      const updatedUser = await BackendService.getUser(user.phone);
      if (updatedUser) setUser(updatedUser);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleRedeemTicket = async () => {
    console.log('REDEEM POINTS clicked for:', event.title);
    if (!user) return addToast('Please enter your phone number first!', 'error');
    const ticketCost = 500; // Standard ticket cost
    if (user.points < ticketCost) return addToast(`You need ${ticketCost} points for a ticket!`, 'error');

    const res = await BackendService.redeemPoints(user.phone, ticketCost, `Ticket: ${event.title}`);
    if (res.success) {
      addToast(`✅ Success! 500 points deducted. Your ticket for ${event.title} has been sent to your mail.`, 'success');
      const updatedUser = await BackendService.getUser(user.phone);
      if (updatedUser) setUser(updatedUser);
    } else {
      addToast(res.message || 'Redemption failed.', 'error');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in pt-28 sm:pt-32 pb-20 min-h-screen">
      <Link to="/events" className="back-btn">← Back to Events</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          <img
            src={assets[event.img]}
            alt={event.title}
            className="w-full rounded-2xl"
            style={{ boxShadow: '0 1.25rem 3.125rem rgba(0,0,0,0.1)' }}
          />
        </div>
        <div>
          {event.icePass ? (
            <span className="event-tag">🧊 IcePass Required</span>
          ) : (
            <span className="event-tag tag-open">Open Entry</span>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl my-4">{event.title}</h1>
          <p className="text-base sm:text-lg text-gray-500 mb-8">{event.desc}</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-bold">{event.date}</p>
                <p className="text-sm text-gray-400">Date</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-bold">{event.venue}</p>
                <p className="text-sm text-gray-400">Venue</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 flex-wrap mt-8">
            {event.icePass && (
              <button className="btn btn-gold btn-sm" onClick={handleUsePass}>
                USE ICEPASS ({user?.ice_pass_count || 0})
              </button>
            )}
            <button className="btn btn-sm" onClick={handleRedeemTicket}>
              REDEEM POINTS (500 PTS)
            </button>
          </div>
          <div className="mt-12 text-right hidden sm:block">
            <img
              src={assets.smirnoffBottle}
              alt="Smirnoff Ice"
              className="inline-block max-w-[6rem] md:max-w-[7.5rem] animate-float"
              style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 0.625rem 1.25rem rgba(0,0,0,0.1))' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Star, Users, Maximize, Bed, Sparkles, Check } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const { openBookingModal } = useBooking();

  const isAvailable = room.status === 'available';

  const statusBadge = {
    available: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Available' },
    occupied: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Occupied' },
    cleaning: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Cleaning' },
    maintenance: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'Maintenance' },
  }[room.status] || { bg: 'bg-slate-50 text-slate-600 border-slate-200', text: room.status };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-hotel-navy/80 backdrop-blur-md text-white border border-white/20">
            {room.type}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${statusBadge.bg}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Bottom Room Number & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">Room {room.roomNumber}</span>
            <p className="text-xs text-slate-200 font-light">Floor {room.floor}</p>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold text-hotel-gold border border-white/10">
            <Star className="w-3.5 h-3.5 fill-hotel-gold text-hotel-gold" />
            <span>{room.rating || 4.9}</span>
            <span className="text-slate-300 font-normal">({room.numReviews || 12})</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-hotel-navy group-hover:text-hotel-gold transition line-clamp-1">
            {room.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{room.capacity?.adults || 2} Adults</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{room.bedType || 'King Bed'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5 text-slate-400" />
              <span>{room.sizeSqFt || 350} sq ft</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(room.amenities || []).slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {amenity}
              </span>
            ))}
            {(room.amenities || []).length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold font-serif text-hotel-navy">${room.pricePerNight}</span>
            <span className="text-xs text-slate-400 font-normal"> / night</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room._id || room.id}`}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-hotel-gold transition"
            >
              Details
            </Link>
            <button
              onClick={() => openBookingModal(room)}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                isAvailable
                  ? 'bg-hotel-navy text-white hover:bg-hotel-midnight hover:shadow'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

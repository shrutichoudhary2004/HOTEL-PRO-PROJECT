import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomsAPI } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { 
  Star, 
  Users, 
  Maximize, 
  Bed, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Coffee,
  Wifi,
  Tv
} from 'lucide-react';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { openBookingModal } = useBooking();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomsAPI.getRoomById(id);
        setRoom(res.data?.data || null);
      } catch (err) {
        console.error('Failed to load room:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-hotel-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Suite Not Found</h2>
        <Link to="/rooms" className="text-xs text-hotel-gold font-semibold underline">
          Back to all rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-hotel-navy transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Accommodations
        </Link>
      </div>

      {/* Title & Top Specs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-hotel-navy text-white">
              {room.type}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Room #{room.roomNumber} • Floor {room.floor}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-hotel-navy mt-2">
            {room.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-hotel-gold font-bold text-sm">
            <Star className="w-4 h-4 fill-hotel-gold" />
            <span>{room.rating || 4.9}</span>
            <span className="text-slate-400 font-normal text-xs">({room.numReviews || 12} reviews)</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-[420px] rounded-3xl overflow-hidden shadow-sm">
          <img
            src={room.images?.[activeImage] || room.images?.[0]}
            alt={room.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="flex flex-col gap-4">
          {(room.images || []).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`h-[125px] rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
                activeImage === idx ? 'border-hotel-gold shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Columns: Details vs Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Specs & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-slate-200 text-center">
            <div>
              <Users className="w-5 h-5 text-hotel-gold mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Capacity</span>
              <p className="text-xs font-bold text-hotel-navy mt-0.5">{room.capacity?.adults || 2} Adults</p>
            </div>
            <div>
              <Bed className="w-5 h-5 text-hotel-gold mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Bed Type</span>
              <p className="text-xs font-bold text-hotel-navy mt-0.5">{room.bedType || 'King Bed'}</p>
            </div>
            <div>
              <Maximize className="w-5 h-5 text-hotel-gold mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Dimensions</span>
              <p className="text-xs font-bold text-hotel-navy mt-0.5">{room.sizeSqFt || 420} sq ft</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-hotel-navy">The Suite Experience</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{room.description}</p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-hotel-navy">Included Room Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(room.amenities || []).map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-hotel-gold flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-serif text-base font-bold text-hotel-navy">Stay Policies & Guarantees</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-hotel-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-800">Check-in / Check-out</span>
                  <span>Arrival from 3:00 PM • Departure by 11:00 AM (Late checkout available)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-800">Free Cancellation</span>
                  <span>Full refund when cancelled 48 hours prior to check-in day.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1 sticky top-28 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
            <div>
              <span className="font-serif text-3xl font-bold text-hotel-navy">${room.pricePerNight}</span>
              <span className="text-xs text-slate-400"> / night</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Best Rate Guarantee
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Standard Occupancy:</span>
              <span className="font-semibold">{room.capacity?.adults} Guests</span>
            </div>
            <div className="flex justify-between">
              <span>Housekeeping Status:</span>
              <span className="font-semibold capitalize text-emerald-600">{room.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Breakfast Included:</span>
              <span className="font-semibold">Optional VIP Add-on</span>
            </div>
          </div>

          <button
            onClick={() => openBookingModal(room)}
            disabled={room.status !== 'available'}
            className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md ${
              room.status === 'available'
                ? 'bg-hotel-navy text-white hover:bg-hotel-midnight'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {room.status === 'available' ? 'Reserve This Suite' : 'Currently Unavailable'}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            You won't be charged until reservation details are verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;

import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Calendar, Users, SlidersHorizontal, Search, Sparkles } from 'lucide-react';

const RoomFilter = ({ onFilterChange, totalCount = 0 }) => {
  const { searchParams, updateSearchParams } = useBooking();

  const handleInputChange = (field, value) => {
    updateSearchParams({ [field]: value });
    if (onFilterChange) {
      onFilterChange({ ...searchParams, [field]: value });
    }
  };

  const categories = ['All', 'Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Family Villa'];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 -mt-14 relative z-20 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Check-in Date */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-hotel-gold/50 transition">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-hotel-gold" />
            Check-In Date
          </label>
          <input
            type="date"
            value={searchParams.checkIn}
            onChange={(e) => handleInputChange('checkIn', e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        {/* Check-out Date */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-hotel-gold/50 transition">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-hotel-gold" />
            Check-Out Date
          </label>
          <input
            type="date"
            value={searchParams.checkOut}
            onChange={(e) => handleInputChange('checkOut', e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        {/* Guests Capacity */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-hotel-gold/50 transition">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-hotel-gold" />
            Guests & Capacity
          </label>
          <div className="flex items-center gap-2">
            <select
              value={searchParams.adults}
              onChange={(e) => handleInputChange('adults', Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4+ Adults</option>
            </select>
          </div>
        </div>

        {/* Room Type & Search */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-hotel-gold/50 transition">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-hotel-gold" />
            Suite Category
          </label>
          <select
            value={searchParams.roomType}
            onChange={(e) => handleInputChange('roomType', e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Room Types' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleInputChange('roomType', cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                searchParams.roomType === cat
                  ? 'bg-hotel-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-hotel-gold" />
          Showing <strong>{totalCount}</strong> Luxury Rooms
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;

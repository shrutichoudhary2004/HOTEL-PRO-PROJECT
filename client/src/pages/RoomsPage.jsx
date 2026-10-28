import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { roomsAPI } from '../services/api';
import { Search, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [sortBy, setSortBy] = useState('recommended');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [selectedType, sortBy, onlyAvailable]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'All') params.type = selectedType;
      if (onlyAvailable) params.status = 'available';

      const res = await roomsAPI.getRooms(params);
      let list = res.data?.data ? [...res.data.data] : [];

      if (sortBy === 'price-low') {
        list.sort((a, b) => a.pricePerNight - b.pricePerNight);
      } else if (sortBy === 'price-high') {
        list.sort((a, b) => b.pricePerNight - a.pricePerNight);
      } else if (sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setRooms(list);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = (rooms || []).filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.roomNumber && r.roomNumber.toString().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  });

  const categories = ['All', 'Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Family Villa'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
          Inventory & Reservations
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-hotel-navy">
          Suites, Rooms & Private Villas
        </h1>
        <p className="text-xs text-slate-500">
          Discover our curated accommodations. Select dates to verify real-time availability and confirm your stay with instant booking.
        </p>
      </div>

      {/* Control Bar: Search, Category, Sorting */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by suite title, amenities, or room #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-hotel-gold"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-hotel-navy focus:ring-0"
              />
              <span>Available Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedType === cat
                  ? 'bg-hotel-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-700">No Accommodations Found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query, clearing filters, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 text-xs font-semibold bg-hotel-navy text-white rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id || room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

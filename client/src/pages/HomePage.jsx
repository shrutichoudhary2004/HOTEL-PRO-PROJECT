import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoomFilter from '../components/RoomFilter';
import RoomCard from '../components/RoomCard';
import { roomsAPI } from '../services/api';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  UtensilsCrossed, 
  Waves, 
  Compass, 
  ChevronRight, 
  Star 
} from 'lucide-react';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomsAPI.getRooms();
        setFeaturedRooms(res.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleFilterSearch = (params) => {
    navigate(`/rooms?type=${params.roomType}&checkIn=${params.checkIn}&checkOut=${params.checkOut}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="HotelPro Luxury Resort"
            className="w-full h-full object-cover scale-105 filter brightness-[0.70]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-hotel-gold text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            The Benchmark in Luxury Hospitality Management
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold leading-tight tracking-tight">
            Where Impeccable Elegance Meets Seamless Precision
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to HotelPro. Experience effortless reservations, intelligent occupancy management, and tailored five-star sanctuary stays.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/rooms"
              className="px-6 py-3.5 bg-hotel-gold hover:bg-hotel-gold-hover text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center gap-2"
            >
              Explore Our Suites
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold text-xs uppercase tracking-widest rounded-xl transition"
            >
              VIP Guest Access
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoomFilter onFilterChange={handleFilterSearch} totalCount={8} />
      </section>

      {/* Hospitality Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
            Why Choose HotelPro
          </span>
          <h2 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
            Engineered for Unrivaled Comfort & Security
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Every booking, check-in, and guest request is powered by our enterprise-grade architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Bank-Grade Security',
              desc: 'Encrypted guest data, compliant tokenized payments, and zero unauthorized access.',
            },
            {
              icon: Clock,
              title: 'Instant Contactless Check-In',
              desc: 'Seamless arrival workflows with instant digital room assignment and mobile receipts.',
            },
            {
              icon: UtensilsCrossed,
              title: 'Michelin-Starred Dining',
              desc: 'Curated culinary journeys delivered directly to your terrace or in private suites.',
            },
            {
              icon: Waves,
              title: 'Wellness & Thermal Spa',
              desc: 'Recharge in private cedar saunas, cold plunge pools, and holistic massage therapy.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-hotel-gold flex items-center justify-center">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-hotel-navy">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Suites Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
              Signature Collection
            </span>
            <h2 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
              Handcrafted Suites & Villas
            </h2>
          </div>
          <Link
            to="/rooms"
            className="text-xs font-semibold text-hotel-gold hover:text-hotel-gold-hover flex items-center gap-1"
          >
            Browse All 8 Rooms <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room._id || room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Guest Reviews / Social Proof */}
      <section className="bg-hotel-sand py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
              Guest Testimonials
            </span>
            <h2 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
              Reflections of Exquisite Stays
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The Azure Horizon Suite exceeded all expectations. Check-in took 30 seconds, and the ocean terrace sunset was magical.',
                author: 'Lady Victoria Sterling',
                role: 'Verified Guest • London',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80',
              },
              {
                quote: 'As a frequent executive traveler, the streamlined invoicing and quiet workspace made this my preferred hospitality hub.',
                author: 'David Chen',
                role: 'Tech Executive • San Francisco',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
              },
              {
                quote: 'The automated staff coordination meant our villa was spotless, and the private chauffeur arrived promptly at the gate.',
                author: 'Camilla & Jean-Paul',
                role: 'Honeymoon Stay • Paris',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
              },
            ].map((rev, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
                <div className="flex text-hotel-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-hotel-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">"{rev.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-hotel-navy">{rev.author}</h4>
                    <span className="text-[10px] text-slate-400">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

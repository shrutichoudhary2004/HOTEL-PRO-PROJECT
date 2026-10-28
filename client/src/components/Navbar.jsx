import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  CalendarCheck, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Hotel,
  Compass
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, demoLogin, isAuthenticated, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/rooms');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Quick-Bar */}
      <div className="bg-hotel-navy text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-hotel-gold animate-pulse" />
            <span>Welcome to <strong>HotelPro</strong> — Enterprise Hospitality OS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 mr-1 hidden sm:inline">1-Click Demo Login:</span>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition text-[11px] font-medium border border-amber-500/30"
            >
              Admin Demo
            </button>
            <button
              onClick={() => handleDemoSwitch('staff')}
              className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition text-[11px] font-medium border border-blue-500/30"
            >
              Staff Demo
            </button>
            <button
              onClick={() => handleDemoSwitch('guest')}
              className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition text-[11px] font-medium border border-emerald-500/30"
            >
              Guest Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-hotel-navy to-hotel-midnight flex items-center justify-center text-hotel-gold shadow-md group-hover:scale-105 transition-transform">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-hotel-navy">
              Hotel<span className="text-hotel-gold">Pro</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
              Luxury Hospitality
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-hotel-gold transition flex items-center gap-1.5"
          >
            Home
          </Link>
          <Link
            to="/rooms"
            className="text-sm font-medium text-slate-700 hover:text-hotel-gold transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-hotel-gold" />
            Rooms & Suites
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className="text-sm font-medium text-slate-700 hover:text-hotel-gold transition flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              My Bookings
            </Link>
          )}

          {isStaff && (
            <Link
              to="/staff"
              className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Front Desk
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Profile / Auth CTA */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-hotel-navy leading-none">{user.name}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider mt-1 bg-slate-100 text-slate-600">
                  {user.role}
                </span>
              </div>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-hotel-gold/50"
              />
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-hotel-navy hover:text-hotel-gold transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-hotel-navy text-white rounded-xl hover:bg-hotel-midnight transition shadow-sm"
              >
                Join / Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

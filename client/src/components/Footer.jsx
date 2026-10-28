import React from 'react';
import { Hotel, ShieldCheck, Award, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-hotel-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-hotel-gold/20 flex items-center justify-center text-hotel-gold">
                <Hotel className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                Hotel<span className="text-hotel-gold">Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Elevating the art of modern hospitality through seamless digital operations, secure guest reservations, and tailored luxury experiences.
            </p>
            <div className="flex items-center gap-3 text-hotel-gold pt-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wide text-slate-300">PCI-DSS Compliant & 256-Bit SSL</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/rooms" className="hover:text-hotel-gold transition">Luxury Suites & Villas</Link>
              </li>
              <li>
                <Link to="/rooms?type=Executive+Suite" className="hover:text-hotel-gold transition">Executive Club Lounges</Link>
              </li>
              <li>
                <Link to="/rooms?type=Presidential+Suite" className="hover:text-hotel-gold transition">Presidential Penthouse</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Spa & Wellness Retreat</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Private Dining Experiences</span>
              </li>
            </ul>
          </div>

          {/* Management Solutions */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">HotelPro OS</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/staff" className="hover:text-hotel-gold transition">Front Desk Check-in</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-hotel-gold transition">Occupancy & Revenue Analytics</Link>
              </li>
              <li>
                <span className="text-slate-400">Inventory & Housekeeping Sync</span>
              </li>
              <li>
                <span className="text-slate-400">Automated Tax Invoicing</span>
              </li>
              <li>
                <span className="text-slate-400">Staff Workflow Management</span>
              </li>
            </ul>
          </div>

          {/* Contact & Concierge */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Concierge Desk</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-hotel-gold shrink-0 mt-0.5" />
                <span>742 Evergreen Boulevard, Coastal Heights, CA 90210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-hotel-gold shrink-0" />
                <span>+1 (800) 468-3577 (24/7 VIP Line)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-hotel-gold shrink-0" />
                <span>reservations@hotelpro-hospitality.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HotelPro Hospitality Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

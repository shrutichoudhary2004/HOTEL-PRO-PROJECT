import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'staff') navigate('/staff');
      else navigate('/rooms');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    const res = await demoLogin(role);
    setLoading(false);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
      else navigate('/rooms');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-hotel-navy flex items-center justify-center text-hotel-gold mx-auto shadow-md">
            <Hotel className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-hotel-navy">Sign In to HotelPro</h2>
          <p className="text-xs text-slate-400">
            Access reservations, front desk workflows, and hotel administration
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Login */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant Demo Account Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 text-xs font-bold rounded-xl transition border border-amber-200"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="py-1.5 px-2 bg-blue-500/10 text-blue-800 hover:bg-blue-500/20 text-xs font-bold rounded-xl transition border border-blue-200"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('guest')}
              className="py-1.5 px-2 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20 text-xs font-bold rounded-xl transition border border-emerald-200"
            >
              Guest
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@hotelpro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-hotel-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-hotel-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-hotel-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-hotel-midnight transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-hotel-gold hover:underline">
            Register Guest Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

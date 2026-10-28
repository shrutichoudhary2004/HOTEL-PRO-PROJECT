import React from 'react';

const StatsCard = ({ title, value, change, isPositive, icon: Icon, color = 'blue' }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  }[color] || 'bg-slate-50 text-slate-600 border-slate-100';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <h4 className="text-2xl font-bold font-serif text-hotel-navy">{value}</h4>
        {change && (
          <span
            className={`text-[11px] font-semibold mt-1 inline-block ${
              isPositive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

export default StatsCard;

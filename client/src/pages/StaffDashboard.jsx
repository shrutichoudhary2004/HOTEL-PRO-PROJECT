import React, { useEffect, useState } from 'react';
import { bookingsAPI, roomsAPI } from '../services/api';
import { 
  Building2, 
  CheckCircle2, 
  LogOut, 
  Sparkles, 
  Clock, 
  Check, 
  Bed, 
  User, 
  Phone 
} from 'lucide-react';

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([
        bookingsAPI.getAllBookings(),
        roomsAPI.getRooms(),
      ]);
      setBookings(bRes.data?.data || []);
      setRooms(rRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, { bookingStatus: newStatus });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleMarkCleaned = async (roomId) => {
    try {
      await roomsAPI.updateRoom(roomId, { status: 'available' });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room');
    }
  };

  // Filter lists
  const confirmedArrivals = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const checkedInGuests = bookings.filter((b) => b.bookingStatus === 'checked-in');
  const roomsNeedingCleaning = rooms.filter((r) => r.status === 'cleaning');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-hotel-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
          Front Desk & Housekeeping Console
        </span>
        <h1 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
          Daily Arrivals, Departures & Room Turnover
        </h1>
        <p className="text-xs text-slate-500">
          Fast-track guest check-in, issue digital keys, and coordinate housekeeping sanitation cycles.
        </p>
      </div>

      {/* Housekeeping Alert Banner if rooms need cleaning */}
      {roomsNeedingCleaning.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Housekeeping Alert: {roomsNeedingCleaning.length} Suite(s) Pending Sanitation
              </h4>
              <p className="text-[11px] text-amber-700">
                Rooms automatically entered cleaning status upon guest departure. Mark clean once inspected.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {roomsNeedingCleaning.map((r) => (
              <button
                key={r._id || r.id}
                onClick={() => handleMarkCleaned(r._id || r.id)}
                className="px-3 py-1 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Room #{r.roomNumber} Cleaned
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Two-Column Grid: Arrivals vs In-House Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arrivals Column */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-hotel-navy flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Expected Arrivals ({confirmedArrivals.length})
              </h3>
              <p className="text-[11px] text-slate-400">Guests with confirmed reservations awaiting check-in</p>
            </div>
          </div>

          {confirmedArrivals.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No pending arrivals today.</p>
          ) : (
            <div className="space-y-3">
              {confirmedArrivals.map((b) => (
                <div
                  key={b._id || b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-hotel-navy">
                        {b.bookingCode}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{b.guestDetails?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Room #{b.room?.roomNumber} • {b.totalNights} Nights • ${b.totalAmount}
                    </p>
                    {b.specialRequests && (
                      <p className="text-[10px] text-amber-700 italic">Note: {b.specialRequests}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpdateBookingStatus(b._id || b.id, 'checked-in')}
                    className="px-4 py-2 bg-hotel-navy text-white text-xs font-bold rounded-xl hover:bg-hotel-midnight transition shadow-sm shrink-0"
                  >
                    Check In Guest
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departures / In-House Column */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-hotel-navy flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Active In-House Stays ({checkedInGuests.length})
              </h3>
              <p className="text-[11px] text-slate-400">Currently residing guests & departures</p>
            </div>
          </div>

          {checkedInGuests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No guests currently checked in.</p>
          ) : (
            <div className="space-y-3">
              {checkedInGuests.map((b) => (
                <div
                  key={b._id || b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-800">
                        {b.bookingCode}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">
                        In-House
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{b.guestDetails?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Room #{b.room?.roomNumber} • Departure:{' '}
                      {new Date(b.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUpdateBookingStatus(b._id || b.id, 'checked-out')}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition shadow-sm shrink-0 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Process Check-Out
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

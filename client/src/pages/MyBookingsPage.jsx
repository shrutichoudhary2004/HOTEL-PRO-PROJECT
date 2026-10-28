import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  Compass 
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openInvoice } = useBooking();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsAPI.getMyBookings();
      setBookings(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation? Any paid amount will be refunded.')) {
      return;
    }
    try {
      await bookingsAPI.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const statusStyles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'checked-in': 'bg-blue-50 text-blue-700 border-blue-200',
    'checked-out': 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
            Guest Reservation Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
            My Luxury Itinerary & Stays
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View booking codes, download tax invoices, or modify upcoming reservations.
          </p>
        </div>
        <Link
          to="/rooms"
          className="px-4 py-2 bg-hotel-navy text-white text-xs font-semibold rounded-xl hover:bg-hotel-midnight transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5" />
          Book Another Room
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-700">No Reservations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no active or completed hotel bookings. Ready to plan your next retreat?
          </p>
          <Link
            to="/rooms"
            className="inline-block px-5 py-2.5 bg-hotel-gold text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-hotel-gold-hover transition"
          >
            Explore Accommodations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const room = booking.room || {};
            const isCancellable = booking.bookingStatus === 'confirmed';

            return (
              <div
                key={booking._id || booking.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition hover:shadow-md"
              >
                {/* Room thumbnail & title */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      room.images?.[0] ||
                      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={room.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {booking.bookingCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusStyles[booking.bookingStatus] || 'bg-slate-50'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-hotel-navy">
                      {room.title || 'Luxury Suite'}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Room #{room.roomNumber || '—'} • {booking.totalNights} Nights •{' '}
                      {new Date(booking.checkInDate).toLocaleDateString()} to{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>

                    <div className="text-[11px] text-slate-400">
                      Payment: <span className="font-semibold capitalize">{booking.paymentStatus}</span> •{' '}
                      Method: <span className="uppercase">{booking.paymentMethod?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-serif text-xl font-bold text-hotel-navy">
                      ${booking.totalAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openInvoice(booking)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-200 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-hotel-navy" />
                      Invoice
                    </button>

                    {isCancellable && (
                      <button
                        onClick={() => handleCancel(booking._id || booking.id)}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

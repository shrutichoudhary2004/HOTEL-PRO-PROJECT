import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import { 
  X, 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

const ADD_ON_SERVICES = [
  { id: 'transfer', name: 'Executive Airport Chauffeur', price: 95, desc: 'Luxury Mercedes S-Class private transfer' },
  { id: 'breakfast', name: 'Daily Gourmet Champagne Buffet', price: 45, desc: 'Chef-prepared artisanal breakfast daily' },
  { id: 'spa', name: 'Imperial Thermal Spa Pass', price: 85, desc: 'Full-day access to cedar saunas & herbal pools' },
  { id: 'checkout', name: 'VIP Late Check-Out (4:00 PM)', price: 50, desc: 'Extended relaxation on departure day' },
];

const BookingModal = () => {
  const { selectedRoomForBooking, closeBookingModal, searchParams, openInvoice } = useBooking();
  const { user, isAuthenticated, demoLogin } = useAuth();

  const [checkInDate, setCheckInDate] = useState(searchParams.checkIn);
  const [checkOutDate, setCheckOutDate] = useState(searchParams.checkOut);
  const [adults, setAdults] = useState(searchParams.adults || 2);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!selectedRoomForBooking) return null;

  const room = selectedRoomForBooking;

  // Nights calculation
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.abs(d2 - d1);
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const roomSubtotal = totalNights * room.pricePerNight;
  const servicesTotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  const subtotal = roomSubtotal + servicesTotal;
  const taxAmount = Math.round(subtotal * 0.12);
  const serviceFee = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount + serviceFee;

  const toggleService = (srv) => {
    if (selectedServices.some((s) => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      // Auto-authenticate with guest demo for quick seamless experience
      await demoLogin('guest');
    }

    setLoading(true);

    try {
      const payload = {
        roomId: room._id || room.id,
        checkInDate,
        checkOutDate,
        numberOfGuests: { adults: Number(adults), children: 0 },
        extraServices: selectedServices.map((s) => ({ name: s.name, price: s.price })),
        paymentMethod,
        specialRequests,
      };

      const res = await bookingsAPI.createBooking(payload);
      setConfirmedBooking(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-hotel-navy text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-hotel-gold">
              Instant Reservation
            </span>
            <h2 className="font-serif text-xl font-bold">{room.title}</h2>
          </div>
          <button
            onClick={closeBookingModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">
                Reservation Confirmed!
              </span>
              <h3 className="font-serif text-2xl font-bold text-hotel-navy mt-1">
                We look forward to welcoming you
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Confirmation code: <strong className="text-hotel-navy font-mono text-sm">{confirmedBooking.bookingCode}</strong>.
                An email receipt and mobile room key instructions have been dispatched.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Suite:</span>
                <span className="font-semibold">{room.title} (Room {room.roomNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold">{checkInDate} to {checkOutDate} ({totalNights} nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-hotel-navy">${totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono">{confirmedBooking.invoiceNumber}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  closeBookingModal();
                  openInvoice(confirmedBooking);
                }}
                className="px-5 py-2.5 bg-hotel-gold text-white font-semibold text-xs rounded-xl hover:bg-hotel-gold-hover transition flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                View & Print Invoice
              </button>
              <button
                onClick={closeBookingModal}
                className="px-5 py-2.5 bg-hotel-navy text-white font-semibold text-xs rounded-xl hover:bg-hotel-midnight transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Dates & Guests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Check-In</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Check-Out</label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Guests</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
            </div>

            {/* Add-on VIP Services */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-hotel-navy flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-hotel-gold" />
                Tailor Your Stay (Optional Add-ons)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADD_ON_SERVICES.map((srv) => {
                  const isChecked = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? 'border-hotel-gold bg-amber-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition ${
                          isChecked
                            ? 'bg-hotel-gold border-hotel-gold text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">{srv.name}</span>
                          <span className="font-bold text-hotel-navy">+${srv.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{srv.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Special Requests or Dietary Requirements
              </label>
              <input
                type="text"
                placeholder="e.g. Quiet room high floor, extra down feather pillows..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-hotel-gold"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-hotel-navy flex items-center gap-1.5 mb-2">
                <CreditCard className="w-3.5 h-3.5 text-hotel-gold" />
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'credit_card', label: 'Credit Card (Simulated)' },
                  { id: 'stripe', label: 'Stripe Instant' },
                  { id: 'cash_on_arrival', label: 'Pay at Front Desk' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2 px-3 rounded-xl border font-medium transition text-center ${
                      paymentMethod === m.id
                        ? 'border-hotel-navy bg-hotel-navy text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Price Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{room.title} ({totalNights} nights × ${room.pricePerNight})</span>
                <span>${roomSubtotal}</span>
              </div>
              {servicesTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Selected VIP Add-ons</span>
                  <span>${servicesTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Hotel Occupancy Tax (12%)</span>
                <span>${taxAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hospitality Service Fee (5%)</span>
                <span>${serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-hotel-navy">
                <span>Total Amount</span>
                <span className="text-base text-hotel-gold font-serif">${totalAmount}</span>
              </div>
            </div>

            {/* Submit & Security Footnote */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-hotel-navy text-white font-semibold text-sm hover:bg-hotel-midnight transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Securing Your Stay...' : `Confirm Reservation • $${totalAmount}`}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-bit checkout • Free cancellation up to 48 hours before check-in</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

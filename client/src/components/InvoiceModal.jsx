import React from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Printer, Hotel, CheckCircle, ShieldCheck } from 'lucide-react';

const InvoiceModal = () => {
  const { activeInvoice, closeInvoice } = useBooking();

  if (!activeInvoice) return null;

  const booking = activeInvoice;
  const room = booking.room || {};
  const guest = booking.guestDetails || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Actions bar (non-printable) */}
        <div className="bg-slate-100 px-6 py-3 flex items-center justify-between border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Official Hotel Tax Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-hotel-navy text-white text-xs font-medium rounded-lg hover:bg-hotel-midnight flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={closeInvoice}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-hotel-navy flex items-center justify-center text-hotel-gold">
                  <Hotel className="w-4 h-4" />
                </div>
                <span className="font-serif text-xl font-bold text-hotel-navy">
                  Hotel<span className="text-hotel-gold">Pro</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                742 Evergreen Blvd, Coastal Heights, CA 90210<br />
                support@hotelpro-hospitality.com • +1 (800) 468-3577
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Payment Received
              </span>
              <p className="font-mono text-xs text-slate-600 mt-2">
                <strong>Invoice:</strong> {booking.invoiceNumber || 'INV-2026-99210'}
              </p>
              <p className="text-[11px] text-slate-400">
                Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Guest & Reservation Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                Billed To (Guest)
              </span>
              <p className="font-bold text-hotel-navy">{guest.name || 'Sophia Laurent'}</p>
              <p className="text-slate-500">{guest.email || 'guest@hotelpro.com'}</p>
              <p className="text-slate-500">{guest.phone || '+1 (555) 987-6543'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                Reservation Details
              </span>
              <p className="font-bold text-hotel-navy">Ref: {booking.bookingCode}</p>
              <p className="text-slate-500">
                Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
              <p className="text-slate-500">
                Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} ({booking.totalNights} Nights)
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-left">Description</th>
                  <th className="py-2.5 px-4 text-center">Qty / Nights</th>
                  <th className="py-2.5 px-4 text-right">Rate</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-hotel-navy">{room.title || 'Luxury Suite'}</p>
                    <span className="text-[11px] text-slate-400">Room #{room.roomNumber} • {room.type}</span>
                  </td>
                  <td className="py-3 px-4 text-center">{booking.totalNights} Nights</td>
                  <td className="py-3 px-4 text-right">${booking.roomRate}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    ${booking.totalNights * booking.roomRate}
                  </td>
                </tr>

                {(booking.extraServices || []).map((srv, idx) => (
                  <tr key={idx} className="text-slate-600">
                    <td className="py-2 px-4 italic">{srv.name}</td>
                    <td className="py-2 px-4 text-center">1</td>
                    <td className="py-2 px-4 text-right">${srv.price}</td>
                    <td className="py-2 px-4 text-right">${srv.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations breakdown */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>
                  $
                  {booking.totalNights * booking.roomRate +
                    (booking.extraServices || []).reduce((s, i) => s + i.price, 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hotel Occupancy Tax (12%)</span>
                <span>${booking.taxAmount || 0}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hospitality Service Fee (5%)</span>
                <span>${booking.serviceFee || 0}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-hotel-navy">
                <span>Grand Total (USD)</span>
                <span className="text-hotel-gold font-serif text-base">${booking.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Thank you for choosing HotelPro. For inquiries or adjustments, contact billing@hotelpro.com.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

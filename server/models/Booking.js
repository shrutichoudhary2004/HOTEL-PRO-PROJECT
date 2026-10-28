const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfGuests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    roomRate: {
      type: Number,
      required: true,
    },
    extraServices: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    taxAmount: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'stripe', 'cash_on_arrival'],
      default: 'credit_card',
    },
    paymentId: {
      type: String,
      default: () => `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'confirmed',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    invoiceNumber: {
      type: String,
      default: () => `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);

const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Helper to calculate days between dates
const calculateNights = (checkIn, checkOut) => {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// @desc    Create a new booking reservation
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      extraServices,
      paymentMethod,
      specialRequests,
    } = req.body;

    // 1. Verify Room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Selected room not found',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // 2. Prevent Double Booking
    const conflicting = await Booking.findOne({
      room: roomId,
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (conflicting) {
      return res.status(400).json({
        success: false,
        message: 'This room is already reserved for the selected dates. Please choose different dates or another room.',
      });
    }

    // 3. Price calculations
    const totalNights = calculateNights(checkIn, checkOut);
    const roomSubtotal = totalNights * room.pricePerNight;

    let servicesTotal = 0;
    const servicesList = extraServices || [];
    servicesList.forEach((s) => {
      servicesTotal += Number(s.price || 0);
    });

    const taxRate = 0.12; // 12% Hotel Occupancy Tax
    const serviceFeeRate = 0.05; // 5% Service Charge

    const taxableAmount = roomSubtotal + servicesTotal;
    const taxAmount = Math.round(taxableAmount * taxRate);
    const serviceFee = Math.round(taxableAmount * serviceFeeRate);
    const totalAmount = taxableAmount + taxAmount + serviceFee;

    // 4. Generate unique booking code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `HP-${new Date().getFullYear()}-${randomSuffix}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await Booking.create({
      bookingCode,
      guest: req.user._id,
      guestDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
      },
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      numberOfGuests: numberOfGuests || { adults: 1, children: 0 },
      roomRate: room.pricePerNight,
      extraServices: servicesList,
      taxAmount,
      serviceFee,
      totalAmount,
      paymentStatus: paymentMethod === 'cash_on_arrival' ? 'pending' : 'paid',
      paymentMethod: paymentMethod || 'credit_card',
      paymentId: `TXN-${Date.now()}-${randomSuffix}`,
      bookingStatus: 'confirmed',
      specialRequests: specialRequests || '',
      invoiceNumber,
    });

    // Populate room info
    await booking.populate('room');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/v1/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/v1/bookings
// @access  Private (Admin / Staff)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      query.checkInDate = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('guest', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking with invoice
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('guest', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization: User can view their own booking, Staff/Admin can view any
    if (
      req.user.role === 'guest' &&
      booking.guest._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Check-in, Check-out, Payment)
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Admin / Staff)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus) {
      booking.bookingStatus = bookingStatus;

      // Update room state accordingly:
      if (bookingStatus === 'checked-in') {
        await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
      } else if (bookingStatus === 'checked-out') {
        // When guest checks out, room goes to cleaning state for housekeeping!
        await Room.findByIdAndUpdate(booking.room, { status: 'cleaning' });
      } else if (bookingStatus === 'cancelled') {
        await Room.findByIdAndUpdate(booking.room, { status: 'available' });
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();
    await booking.populate('room');

    res.status(200).json({
      success: true,
      message: `Booking updated to ${bookingStatus || paymentStatus}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (
      req.user.role === 'guest' &&
      booking.guest.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'checked-in' || booking.bookingStatus === 'checked-out') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an active or completed stay',
      });
    }

    booking.bookingStatus = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled and any refund recorded.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

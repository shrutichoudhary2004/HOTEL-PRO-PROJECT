const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get dashboard metrics and hospitality KPIs
// @route   GET /api/v1/analytics/dashboard
// @access  Private (Admin / Staff)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
    const cleaningRooms = await Room.countDocuments({ status: 'cleaning' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    // Occupancy Rate
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Total Revenue calculation
    const paidBookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = paidBookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const totalGuests = await User.countDocuments({ role: 'guest' });
    const totalBookings = await Booking.countDocuments();

    // Today's Arrivals and Departures
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const arrivalsToday = await Booking.countDocuments({
      checkInDate: { $gte: startOfToday, $lte: endOfToday },
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
    });

    const departuresToday = await Booking.countDocuments({
      checkOutDate: { $gte: startOfToday, $lte: endOfToday },
      bookingStatus: 'checked-in',
    });

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('room', 'roomNumber title type pricePerNight')
      .populate('guest', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Revenue by Room Type
    const roomTypeStats = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomInfo',
        },
      },
      { $unwind: '$roomInfo' },
      {
        $group: {
          _id: '$roomInfo.type',
          revenue: { $sum: '$totalAmount' },
          bookingsCount: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalRevenue,
          occupancyRate,
          totalRooms,
          availableRooms,
          occupiedRooms,
          cleaningRooms,
          maintenanceRooms,
          totalGuests,
          totalBookings,
          arrivalsToday,
          departuresToday,
        },
        roomTypeStats,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

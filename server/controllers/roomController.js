const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search, and availability
// @route   GET /api/v1/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      status,
      checkIn,
      checkOut,
      adults,
      children,
      search,
      sort,
    } = req.query;

    const query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (adults) {
      query['capacity.adults'] = { $gte: Number(adults) };
    }

    if (children) {
      query['capacity.children'] = { $gte: Number(children) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Check availability against bookings if checkIn & checkOut provided
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      // Find all bookings overlapping this timeframe that are active
      const conflictingBookings = await Booking.find({
        bookingStatus: { $in: ['confirmed', 'checked-in'] },
        $or: [
          {
            checkInDate: { $lt: outDate },
            checkOutDate: { $gt: inDate },
          },
        ],
      }).select('room');

      const bookedRoomIds = conflictingBookings.map((b) => b.room);
      query._id = { $nin: bookedRoomIds };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { pricePerNight: 1 };
    if (sort === 'price-high') sortOption = { pricePerNight: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const rooms = await Room.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/v1/rooms
// @access  Private (Admin)
exports.createRoom = async (req, res, next) => {
  try {
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${req.body.roomNumber} already exists in the system`,
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details or operational status
// @route   PUT /api/v1/rooms/:id
// @access  Private (Admin / Staff)
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room not found with ID of ${req.params.id}`,
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/v1/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room not found with ID of ${req.params.id}`,
      });
    }

    // Check if room has active bookings
    const activeBookings = await Booking.find({
      room: req.params.id,
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active or upcoming reservations',
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: `Room ${room.roomNumber} has been successfully removed`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

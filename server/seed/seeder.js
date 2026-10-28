const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Load data
const { users, rooms } = require('./seedData');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro');
    console.log('[Seeder] Connected to MongoDB');
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Booking.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Old records cleared');

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const guestUser = createdUsers.find((u) => u.role === 'guest');

    console.log(`[Seeder] ${createdUsers.length} users inserted`);

    // Insert rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log(`[Seeder] ${createdRooms.length} rooms inserted`);

    // Create sample bookings
    const sampleBookings = [
      {
        bookingCode: 'HP-2026-1042',
        guest: guestUser._id,
        guestDetails: {
          name: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone,
        },
        room: createdRooms[1]._id, // 201 Azure Horizon
        checkInDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
        checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // +3 days
        totalNights: 4,
        numberOfGuests: { adults: 2, children: 1 },
        roomRate: createdRooms[1].pricePerNight,
        extraServices: [{ name: 'Executive Airport Transfer', price: 95 }],
        taxAmount: 242,
        serviceFee: 101,
        totalAmount: 2358,
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        bookingStatus: 'checked-in',
        specialRequests: 'Late arrival, extra hypoallergenic pillows requested.',
        invoiceNumber: 'INV-2026-881902',
      },
      {
        bookingCode: 'HP-2026-1088',
        guest: guestUser._id,
        guestDetails: {
          name: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone,
        },
        room: createdRooms[0]._id, // 101 Deluxe Garden View
        checkInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
        totalNights: 3,
        numberOfGuests: { adults: 2, children: 0 },
        roomRate: createdRooms[0].pricePerNight,
        extraServices: [{ name: 'Artisan Champagne on Arrival', price: 120 }],
        taxAmount: 101,
        serviceFee: 42,
        totalAmount: 983,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        bookingStatus: 'confirmed',
        specialRequests: 'Celebrating 5th anniversary stay.',
        invoiceNumber: 'INV-2026-914023',
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log(`[Seeder] Sample bookings created`);

    console.log('--- HOTELPRO DATABASE SEEDED SUCCESSFULLY ---');
    console.log('Credentials:');
    console.log('  Admin: admin@hotelpro.com / admin123');
    console.log('  Staff: staff@hotelpro.com / staff123');
    console.log('  Guest: guest@hotelpro.com / guest123');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Booking.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();
    console.log('[Seeder] All database records deleted');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

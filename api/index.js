// Vercel Serverless API Gateway for HotelPro
const crypto = require('crypto');
const { users: initialUsers, rooms: initialRooms } = require('../server/seed/seedData');

// In-Memory store per serverless container
const db = {
  users: initialUsers.map((u, idx) => ({
    ...u,
    _id: `user_${idx + 1}`,
    id: `user_${idx + 1}`,
    passwordHash: crypto.createHash('sha256').update(u.password).digest('hex'),
  })),
  rooms: initialRooms.map((r, idx) => ({
    ...r,
    _id: `room_${idx + 1}`,
    id: `room_${idx + 1}`,
  })),
  bookings: [
    {
      _id: 'booking_1',
      id: 'booking_1',
      bookingCode: 'HP-2026-1042',
      guest: 'user_3',
      guestDetails: {
        name: 'Sophia Laurent',
        email: 'guest@hotelpro.com',
        phone: '+1 (555) 987-6543',
      },
      room: initialRooms[1],
      checkInDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      totalNights: 4,
      numberOfGuests: { adults: 2, children: 1 },
      roomRate: 480,
      extraServices: [{ name: 'Executive Airport Transfer', price: 95 }],
      taxAmount: 242,
      serviceFee: 101,
      totalAmount: 2358,
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      paymentId: 'TXN-984021',
      bookingStatus: 'checked-in',
      specialRequests: 'Late arrival, extra hypoallergenic pillows requested.',
      invoiceNumber: 'INV-2026-881902',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      _id: 'booking_2',
      id: 'booking_2',
      bookingCode: 'HP-2026-1088',
      guest: 'user_3',
      guestDetails: {
        name: 'Sophia Laurent',
        email: 'guest@hotelpro.com',
        phone: '+1 (555) 987-6543',
      },
      room: initialRooms[0],
      checkInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
      totalNights: 3,
      numberOfGuests: { adults: 2, children: 0 },
      roomRate: 240,
      extraServices: [{ name: 'Artisan Champagne on Arrival', price: 120 }],
      taxAmount: 101,
      serviceFee: 42,
      totalAmount: 983,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: 'TXN-773192',
      bookingStatus: 'confirmed',
      specialRequests: 'Celebrating 5th anniversary stay.',
      invoiceNumber: 'INV-2026-914023',
      createdAt: new Date().toISOString(),
    },
  ],
};

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const pathname = req.url.split('?')[0];

  if (pathname === '/api/health' || pathname === '/api/v1/health') {
    return res.status(200).json({ status: 'online', service: 'HotelPro Vercel Serverless' });
  }

  // Rooms
  if (pathname === '/api/v1/rooms' && req.method === 'GET') {
    return res.status(200).json({ success: true, count: db.rooms.length, data: db.rooms });
  }

  // Bookings
  if (pathname === '/api/v1/bookings' && req.method === 'GET') {
    return res.status(200).json({ success: true, count: db.bookings.length, data: db.bookings });
  }

  if (pathname === '/api/v1/bookings/my' && req.method === 'GET') {
    return res.status(200).json({ success: true, count: db.bookings.length, data: db.bookings });
  }

  // Analytics
  if (pathname === '/api/v1/analytics/dashboard') {
    const totalRooms = db.rooms.length;
    const occupied = db.rooms.filter(r => r.status === 'occupied').length;
    const rev = db.bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
    return res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalRevenue: rev,
          occupancyRate: totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0,
          totalRooms: totalRooms,
          availableRooms: db.rooms.filter(r => r.status === 'available').length,
          occupiedRooms: occupied,
          cleaningRooms: db.rooms.filter(r => r.status === 'cleaning').length,
          maintenanceRooms: db.rooms.filter(r => r.status === 'maintenance').length,
          totalGuests: db.users.length,
          totalBookings: db.bookings.length,
          arrivalsToday: 1,
          departuresToday: 1,
        },
        recentBookings: db.bookings.slice(0, 5),
      },
    });
  }

  // Default fallback
  res.status(200).json({ success: true, message: 'HotelPro API Gateway' });
};

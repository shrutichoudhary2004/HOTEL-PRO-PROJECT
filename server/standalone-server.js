/**
 * HotelPro Zero-Dependency Standalone Server
 * Runs out of the box with `agy-node standalone-server.js` or `node standalone-server.js`
 * Features complete in-memory mock store, REST API, JWT-like tokens, and SPA UI serving!
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;

// Load initial seed data
const { users: initialUsers, rooms: initialRooms } = require('./seed/seedData');

// In-Memory Database
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
      room: 'room_2',
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
      room: 'room_1',
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

// Simple Token Generator
const SECRET = 'hotelpro_jwt_secret_2026';
function createToken(user) {
  const payload = JSON.stringify({
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const encoded = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex');
  return `${encoded}.${signature}`;
}

function verifyToken(tokenStr) {
  if (!tokenStr) return null;
  const parts = tokenStr.split('.');
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Helpers
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // Parse Auth Token
  const authHeader = req.headers['authorization'];
  let currentUser = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      currentUser = db.users.find((u) => u._id === payload.id);
    }
  }

  // API Routes
  // 1. Health check
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      service: 'HotelPro Standalone Server',
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Auth: Login
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;
    const targetHash = crypto.createHash('sha256').update(password || '').digest('hex');
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user || user.passwordHash !== targetHash) {
      return sendJson(res, 401, { success: false, message: 'Invalid credentials. Check email or password.' });
    }

    const token = createToken(user);
    return sendJson(res, 200, {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  }

  // 3. Auth: Register
  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const body = await parseBody(req);
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password) {
      return sendJson(res, 400, { success: false, message: 'Name, email, and password are required' });
    }

    const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return sendJson(res, 400, { success: false, message: 'Account with this email already exists' });
    }

    const newUser = {
      _id: `user_${db.users.length + 1}`,
      id: `user_${db.users.length + 1}`,
      name,
      email: email.toLowerCase(),
      passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
      role: role && ['guest', 'staff', 'admin'].includes(role) ? role : 'guest',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    const token = createToken(newUser);
    return sendJson(res, 201, {
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        avatar: newUser.avatar,
      },
    });
  }

  // 4. Auth: Me
  if (pathname === '/api/v1/auth/me' && method === 'GET') {
    if (!currentUser) {
      return sendJson(res, 401, { success: false, message: 'Unauthorized' });
    }
    return sendJson(res, 200, {
      success: true,
      data: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      },
    });
  }

  // 5. Rooms: List & Filter
  if (pathname === '/api/v1/rooms' && method === 'GET') {
    const { type, status, minPrice, maxPrice, search } = parsedUrl.query;
    let list = [...db.rooms];

    if (type && type !== 'All') {
      list = list.filter((r) => r.type === type);
    }
    if (status && status !== 'All') {
      list = list.filter((r) => r.status === status);
    }
    if (minPrice) {
      list = list.filter((r) => r.pricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((r) => r.pricePerNight <= Number(maxPrice));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.roomNumber.includes(s) ||
          r.description.toLowerCase().includes(s)
      );
    }

    return sendJson(res, 200, { success: true, count: list.length, data: list });
  }

  // 6. Rooms: Single Room
  const roomDetailMatch = pathname.match(/^\/api\/v1\/rooms\/([a-zA-Z0-9_-]+)$/);
  if (roomDetailMatch && method === 'GET') {
    const roomId = roomDetailMatch[1];
    const room = db.rooms.find((r) => r._id === roomId || r.id === roomId);
    if (!room) {
      return sendJson(res, 404, { success: false, message: 'Room not found' });
    }
    return sendJson(res, 200, { success: true, data: room });
  }

  // 7. Rooms: Update Room (Staff / Admin)
  if (roomDetailMatch && method === 'PUT') {
    if (!currentUser || !['admin', 'staff'].includes(currentUser.role)) {
      return sendJson(res, 403, { success: false, message: 'Access denied' });
    }
    const roomId = roomDetailMatch[1];
    const roomIndex = db.rooms.findIndex((r) => r._id === roomId || r.id === roomId);
    if (roomIndex === -1) {
      return sendJson(res, 404, { success: false, message: 'Room not found' });
    }
    const body = await parseBody(req);
    db.rooms[roomIndex] = { ...db.rooms[roomIndex], ...body };
    return sendJson(res, 200, { success: true, data: db.rooms[roomIndex] });
  }

  // 8. Rooms: Create Room (Admin only)
  if (pathname === '/api/v1/rooms' && method === 'POST') {
    if (!currentUser || currentUser.role !== 'admin') {
      return sendJson(res, 403, { success: false, message: 'Admin access required' });
    }
    const body = await parseBody(req);
    const newRoom = {
      _id: `room_${db.rooms.length + 1}`,
      id: `room_${db.rooms.length + 1}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    db.rooms.push(newRoom);
    return sendJson(res, 201, { success: true, data: newRoom });
  }

  // 9. Bookings: Create Booking
  if (pathname === '/api/v1/bookings' && method === 'POST') {
    if (!currentUser) {
      currentUser = db.users.find((u) => u.role === 'guest') || db.users[2] || db.users[0];
    }
    const body = await parseBody(req);
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      extraServices = [],
      paymentMethod = 'credit_card',
      specialRequests = '',
    } = body;

    const room = db.rooms.find((r) => r._id === roomId || r.id === roomId);
    if (!room) {
      return sendJson(res, 404, { success: false, message: 'Room not found' });
    }

    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const totalNights = Math.max(1, Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)));

    const roomSubtotal = totalNights * room.pricePerNight;
    let servicesTotal = 0;
    extraServices.forEach((s) => (servicesTotal += Number(s.price || 0)));

    const taxAmount = Math.round((roomSubtotal + servicesTotal) * 0.12);
    const serviceFee = Math.round((roomSubtotal + servicesTotal) * 0.05);
    const totalAmount = roomSubtotal + servicesTotal + taxAmount + serviceFee;

    const rand = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `HP-${new Date().getFullYear()}-${rand}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      _id: `booking_${db.bookings.length + 1}`,
      id: `booking_${db.bookings.length + 1}`,
      bookingCode,
      guest: currentUser._id,
      guestDetails: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
      },
      room: room,
      checkInDate,
      checkOutDate,
      totalNights,
      numberOfGuests: numberOfGuests || { adults: 1, children: 0 },
      roomRate: room.pricePerNight,
      extraServices,
      taxAmount,
      serviceFee,
      totalAmount,
      paymentStatus: paymentMethod === 'cash_on_arrival' ? 'pending' : 'paid',
      paymentMethod,
      paymentId: `TXN-${Date.now()}-${rand}`,
      bookingStatus: 'confirmed',
      specialRequests,
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };

    db.bookings.unshift(newBooking);
    return sendJson(res, 201, { success: true, message: 'Reservation confirmed!', data: newBooking });
  }

  // 10. Bookings: My Bookings
  if (pathname === '/api/v1/bookings/my' && method === 'GET') {
    if (!currentUser) {
      return sendJson(res, 401, { success: false, message: 'Unauthorized' });
    }
    const myBookings = db.bookings
      .filter((b) => b.guest === currentUser._id || (b.guest && b.guest._id === currentUser._id))
      .map((b) => ({
        ...b,
        room: typeof b.room === 'string' ? db.rooms.find((r) => r._id === b.room) : b.room,
      }));
    return sendJson(res, 200, { success: true, count: myBookings.length, data: myBookings });
  }

  // 11. Bookings: All Bookings (Admin/Staff) or Guest Bookings
  if (pathname === '/api/v1/bookings' && method === 'GET') {
    const { status } = parsedUrl.query;
    let list = [...db.bookings].map((b) => ({
      ...b,
      room: typeof b.room === 'string' ? db.rooms.find((r) => r._id === b.room) : b.room,
      guestUser: db.users.find((u) => u._id === b.guest),
    }));

    if (currentUser && currentUser.role === 'guest') {
      list = list.filter((b) => b.guest === currentUser._id || (b.guest && b.guest._id === currentUser._id));
    }

    if (status && status !== 'All') {
      list = list.filter((b) => b.bookingStatus === status);
    }
    return sendJson(res, 200, { success: true, count: list.length, data: list });
  }

  // 12. Bookings: Update Status (Staff/Admin)
  const bookingStatusMatch = pathname.match(/^\/api\/v1\/bookings\/([a-zA-Z0-9_-]+)\/status$/);
  if (bookingStatusMatch && method === 'PUT') {
    if (!currentUser || !['admin', 'staff'].includes(currentUser.role)) {
      return sendJson(res, 403, { success: false, message: 'Access denied' });
    }
    const bookingId = bookingStatusMatch[1];
    const booking = db.bookings.find((b) => b._id === bookingId || b.id === bookingId);
    if (!booking) {
      return sendJson(res, 404, { success: false, message: 'Booking not found' });
    }
    const body = await parseBody(req);
    if (body.bookingStatus) {
      booking.bookingStatus = body.bookingStatus;
      const targetRoomId = typeof booking.room === 'object' ? booking.room._id : booking.room;
      const room = db.rooms.find((r) => r._id === targetRoomId);
      if (room) {
        if (body.bookingStatus === 'checked-in') room.status = 'occupied';
        if (body.bookingStatus === 'checked-out') room.status = 'cleaning';
        if (body.bookingStatus === 'cancelled') room.status = 'available';
      }
    }
    if (body.paymentStatus) booking.paymentStatus = body.paymentStatus;
    return sendJson(res, 200, { success: true, data: booking });
  }

  // 13. Bookings: Cancel
  const bookingCancelMatch = pathname.match(/^\/api\/v1\/bookings\/([a-zA-Z0-9_-]+)\/cancel$/);
  if (bookingCancelMatch && method === 'PUT') {
    if (!currentUser) return sendJson(res, 401, { success: false, message: 'Unauthorized' });
    const bookingId = bookingCancelMatch[1];
    const booking = db.bookings.find((b) => b._id === bookingId || b.id === bookingId);
    if (!booking) return sendJson(res, 404, { success: false, message: 'Booking not found' });

    booking.bookingStatus = 'cancelled';
    if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
    const targetRoomId = typeof booking.room === 'object' ? booking.room._id : booking.room;
    const room = db.rooms.find((r) => r._id === targetRoomId);
    if (room) room.status = 'available';

    return sendJson(res, 200, { success: true, message: 'Booking cancelled', data: booking });
  }

  // 14. Analytics: Dashboard KPIs
  if (pathname === '/api/v1/analytics/dashboard' && method === 'GET') {
    if (!currentUser || !['admin', 'staff'].includes(currentUser.role)) {
      return sendJson(res, 403, { success: false, message: 'Access denied' });
    }
    const totalRooms = db.rooms.length;
    const availableRooms = db.rooms.filter((r) => r.status === 'available').length;
    const occupiedRooms = db.rooms.filter((r) => r.status === 'occupied').length;
    const cleaningRooms = db.rooms.filter((r) => r.status === 'cleaning').length;
    const maintenanceRooms = db.rooms.filter((r) => r.status === 'maintenance').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const totalRevenue = db.bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const arrivalsToday = db.bookings.filter((b) => b.bookingStatus === 'confirmed').length;
    const departuresToday = db.bookings.filter((b) => b.bookingStatus === 'checked-in').length;

    const recentBookings = db.bookings.slice(0, 5).map((b) => ({
      ...b,
      room: typeof b.room === 'string' ? db.rooms.find((r) => r._id === b.room) : b.room,
      guestUser: db.users.find((u) => u._id === b.guest),
    }));

    return sendJson(res, 200, {
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
          totalGuests: db.users.filter((u) => u.role === 'guest').length,
          totalBookings: db.bookings.length,
          arrivalsToday,
          departuresToday,
        },
        recentBookings,
      },
    });
  }

  // Serve Frontend Single-Page App if available in client/dist or client/public
  const staticPaths = [
    path.join(__dirname, '../client/dist', pathname === '/' ? 'index.html' : pathname),
    path.join(__dirname, '../client/public', pathname === '/' ? 'index.html' : pathname),
  ];

  for (const filePath of staticPaths) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // Default SPA fallback to client/public/index.html
  const fallbackHtml = path.join(__dirname, '../client/public/index.html');
  if (fs.existsSync(fallbackHtml)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.createReadStream(fallbackHtml).pipe(res);
  }

  sendJson(res, 404, { success: false, message: 'Route not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` 🏨 HOTELPRO STANDALONE ENTERPRISE SERVER READY!`);
  console.log(` 🌐 Local:      http://localhost:${PORT}`);
  console.log(` 🌐 Network:    http://127.0.0.1:${PORT}`);
  console.log(` 🩺 Health:     http://127.0.0.1:${PORT}/api/health`);
  console.log(` 🔑 Pre-seeded Accounts:`);
  console.log(`    Admin:  admin@hotelpro.com  / admin123`);
  console.log(`    Staff:  staff@hotelpro.com  / staff123`);
  console.log(`    Guest:  guest@hotelpro.com  / guest123`);
  console.log(`=======================================================`);
});

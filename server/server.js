const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Load DB connection
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to Database
connectDB();

// Body Parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'HotelPro API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` HOTELPRO BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

module.exports = app;

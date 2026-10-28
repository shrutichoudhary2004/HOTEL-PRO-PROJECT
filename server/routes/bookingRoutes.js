const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(createBooking)
  .get(authorize('admin', 'staff'), getAllBookings);

router.get('/my', getMyBookings);

router.route('/:id')
  .get(getBookingById);

router.put('/:id/status', authorize('admin', 'staff'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

const express = require('express');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'staff'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

module.exports = router;

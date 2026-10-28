const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  getUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin', 'staff'), getUsers);

module.exports = router;

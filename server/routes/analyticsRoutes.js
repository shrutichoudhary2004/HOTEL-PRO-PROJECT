const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'staff'), getDashboardStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  checkIn,
  getActiveCheckIn,
  checkOut,
  getAllActiveCheckIns,
  getAllCompletedCheckIns
} = require('../controllers/checkInController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Employee routes
router.post('/checkin', protect, checkRole(['employee']), checkIn);
router.get('/active', protect, getActiveCheckIn);
router.post('/checkout', protect, checkRole(['employee']), checkOut);

// Admin routes
router.get('/all-active', protect, checkRole(['admin']), getAllActiveCheckIns);
router.get('/all-completed', protect, checkRole(['admin']), getAllCompletedCheckIns);

module.exports = router;
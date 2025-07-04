const express = require('express');
const router = express.Router();
const { getAllSites } = require('../controllers/siteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllSites);

module.exports = router;
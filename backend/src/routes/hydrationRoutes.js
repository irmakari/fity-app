const express = require('express');
const router = express.Router();
const { getTodayHydration, getLogsByDate, addHydrationLog } = require('../controllers/hydrationController');
const { protect } = require('../middleware/auth');

router.get('/today', protect, getTodayHydration);
router.get('/logs', protect, getLogsByDate);
router.post('/logs', protect, addHydrationLog);

module.exports = router;
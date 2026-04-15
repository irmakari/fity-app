const express = require('express');
const {
  getProfile,
  updateProfile,
  updateNotifications,
  updateProfileValidation,
  updateNotificationsValidation,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// GET /api/profile
router.get('/', getProfile);

// PATCH /api/profile
router.patch('/', updateProfileValidation, validate, updateProfile);

// PATCH /api/profile/notifications
router.patch('/notifications', updateNotificationsValidation, validate, updateNotifications);

module.exports = router;

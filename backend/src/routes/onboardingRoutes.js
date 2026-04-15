const express = require('express');
const {
  completeOnboarding,
  getOnboardingStatus,
  completeOnboardingValidation,
} = require('../controllers/onboardingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All onboarding routes require authentication
router.use(protect);

// GET /api/onboarding/status
router.get('/status', getOnboardingStatus);

// POST /api/onboarding/complete
router.post('/complete', completeOnboardingValidation, validate, completeOnboarding);

module.exports = router;

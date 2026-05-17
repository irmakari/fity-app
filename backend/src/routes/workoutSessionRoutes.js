const express = require('express');
const {
  startSession,
  getUserSessions,
  getSessionById,
  finishSession,
  logSet,
  getSessionSets,
  startSessionValidation,
  finishSessionValidation,
  logSetValidation,
} = require('../controllers/workoutSessionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// POST /api/workout-sessions
router.post('/', startSessionValidation, validate, startSession);

// GET /api/workout-sessions
router.get('/', getUserSessions);

// GET /api/workout-sessions/:id
router.get('/:id', getSessionById);

// PATCH /api/workout-sessions/:id/finish
router.patch('/:id/finish', finishSessionValidation, validate, finishSession);

// POST /api/workout-sessions/:id/sets
router.post('/:id/sets', logSetValidation, validate, logSet);

// GET /api/workout-sessions/:id/sets
router.get('/:id/sets', getSessionSets);

module.exports = router;

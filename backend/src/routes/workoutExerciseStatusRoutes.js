const express = require('express');
const {
  logExerciseStatus,
  getExerciseStatuses,
  updateExerciseStatus,
  logStatusValidation,
  updateStatusValidation,
  getStatusesValidation,
} = require('../controllers/workoutExerciseStatusController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// POST /api/workout-exercise-status
router.post('/', logStatusValidation, validate, logExerciseStatus);

// GET /api/workout-exercise-status
router.get('/', getStatusesValidation, validate, getExerciseStatuses);

// PATCH /api/workout-exercise-status/:id
router.patch('/:id', updateStatusValidation, validate, updateExerciseStatus);

module.exports = router;

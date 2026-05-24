const express = require('express');
const {
  getExercises,
  getExerciseById,
  createExercise,
  createExerciseValidation,
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// GET /api/exercises
router.get('/', getExercises);

// GET /api/exercises/:id
router.get('/:id', getExerciseById);

// POST /api/exercises
router.post('/', createExerciseValidation, validate, createExercise);

module.exports = router;

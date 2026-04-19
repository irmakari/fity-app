const express = require('express');
const {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  createPlanValidation,
  updatePlanValidation,
} = require('../controllers/workoutPlanController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// GET /api/workout-plans
router.get('/', getWorkoutPlans);

// GET /api/workout-plans/:id
router.get('/:id', getWorkoutPlanById);

// POST /api/workout-plans
router.post('/', createPlanValidation, validate, createWorkoutPlan);

// PATCH /api/workout-plans/:id
router.patch('/:id', updatePlanValidation, validate, updateWorkoutPlan);

// DELETE /api/workout-plans/:id
router.delete('/:id', deleteWorkoutPlan);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDailyLogs,
  getDailySummary,
  createOrGetMealLog,
  addItemToMeal,
  removeItemFromMeal,
} = require('../controllers/mealLogController');

router.use(protect);

// GET  /api/meal-logs?date=2026-05-17        — All meals for a day
router.get('/', getDailyLogs);

// GET  /api/meal-logs/summary?date=2026-05-17 — Calorie + macro summary
router.get('/summary', getDailySummary);

// POST /api/meal-logs                         — Create/get a meal log
router.post('/', createOrGetMealLog);

// POST /api/meal-logs/:id/items               — Add food to meal
router.post('/:id/items', addItemToMeal);

// DELETE /api/meal-logs/:mealLogId/items/:itemId
router.delete('/:mealLogId/items/:itemId', removeItemFromMeal);

module.exports = router;

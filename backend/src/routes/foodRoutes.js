const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { searchFood, createFood, getFoodById } = require('../controllers/foodController');

// All food routes require authentication
router.use(protect);

// GET  /api/foods/search?q=kuymak  — Hybrid search (DB → OFF → AI)
router.get('/search', searchFood);

// POST /api/foods                  — Manual food creation
router.post('/', createFood);

// GET  /api/foods/:id              — Food detail
router.get('/:id', getFoodById);

module.exports = router;

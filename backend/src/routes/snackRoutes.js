const express = require('express');
const { suggestSnack } = require('../controllers/snackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/suggest', protect, suggestSnack);

module.exports = router;

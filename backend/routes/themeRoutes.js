const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

// GET /api/theme - Public route for all visitors to fetch current active palette
router.get('/', themeController.getTheme);

// PUT /api/theme - Route to update active global theme
router.put('/', themeController.updateTheme);

module.exports = router;

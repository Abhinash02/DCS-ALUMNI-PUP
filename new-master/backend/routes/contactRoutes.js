const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/middleware');

router.post('/', contactController.submitContact);
router.get('/', authMiddleware, contactController.getContacts);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
// const upload = require('../utils/multer');
// const authMiddleware = require('../middleware/middleware');

// router.post('/', authMiddleware, upload.array('images', 5), createEvent);
// router.get('/', getEvents);
// router.delete('/:id', authMiddleware, deleteEvent);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const upload = require('../utils/multer');
const authMiddleware = require('../middleware/middleware');

router.post('/', authMiddleware, upload.array('images', 5), createEvent);
router.get('/', getEvents);
router.put('/:id', authMiddleware, upload.array('images', 5), updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
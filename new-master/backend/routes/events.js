// const express = require('express');
// const router = express.Router();
// const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
// const upload = require('../utils/multer');
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// router.post('/', authMiddleware, upload.array('images', 5), createEvent);
// router.get('/', authMiddleware, getEvents);
// router.delete('/:id', authMiddleware, deleteEvent);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
const upload = require('../utils/multer');
const authMiddleware = require('../middleware/middleware');

router.post('/', authMiddleware, upload.array('images', 5), createEvent);
router.get('/', getEvents);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createJob, getJobs, getMyJobs, deleteJob, updateJob, getExternalJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/middleware');

// Public routes
router.get('/', getJobs);
router.get('/external', getExternalJobs);

// Protected routes (require alumni authentication)
router.post('/', authMiddleware, createJob);
router.get('/myjobs', authMiddleware, getMyJobs);
router.delete('/:id', authMiddleware, deleteJob);
router.put('/:id', authMiddleware, updateJob);

module.exports = router;

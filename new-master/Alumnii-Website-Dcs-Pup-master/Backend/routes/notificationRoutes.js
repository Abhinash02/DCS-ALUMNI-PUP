const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/middleware');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'notifications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

// Set file size limit to 50MB
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB in bytes
});

router.post('/', authMiddleware, upload.single('file'), notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
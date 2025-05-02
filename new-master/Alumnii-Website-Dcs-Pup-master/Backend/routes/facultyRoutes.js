const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/middleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'faculty',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

router.get('/', facultyController.getAllFaculty); // Public access
router.post('/', authMiddleware, upload.single('image'), facultyController.createFaculty);
router.delete('/:id', authMiddleware, facultyController.deleteFaculty);

module.exports = router;
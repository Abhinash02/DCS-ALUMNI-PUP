
const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const authMiddleware = require('../middleware/middleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1000, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' }]
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const memoryStorage = multer.memoryStorage();
const uploadExcel = multer({ storage: memoryStorage });

router.get('/batches', alumniController.getUniqueBatches);
router.get('/pending', alumniController.getPending);
router.get('/approved', alumniController.getApproved);
router.get('/denied',  alumniController.getDenied);
router.put('/approve/:id', alumniController.approveAlumni);
router.put('/deny/:id', alumniController.denyAlumni);
router.delete('/:id', alumniController.deleteAlumni);
router.post('/', upload.single('photo'), alumniController.createAlumni);
router.post('/login', alumniController.loginAlumni);
router.put('/profile', authMiddleware, upload.single('photo'), alumniController.updateProfile);
router.post('/upload-excel', uploadExcel.single('file'), alumniController.uploadExcel);
router.post('/forgot-password', alumniController.forgotPassword);
router.post('/reset-password', alumniController.resetPassword);
router.post('/bulk-email', alumniController.sendBulkEmail);

module.exports = router;
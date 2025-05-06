
// const express = require('express');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../utils/cloudinary');
// const alumniController = require('../controllers/alumniController');

// const router = express.Router();

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'alumni-photos',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage });

// router.post('/', upload.single('photo'), alumniController.createAlumni);
// router.get('/approved', alumniController.getApprovedAlumni);
// router.get('/pending', alumniController.getPendingAlumni);
// router.get('/denied', alumniController.getDeniedAlumni);
// router.put('/approve/:id', alumniController.approveAlumni);
// router.put('/deny/:id', alumniController.denyAlumni);
// router.delete('/:id', alumniController.deleteAlumni);

// module.exports = router;


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
  },
});

const upload = multer({ storage });

router.get('/pending', alumniController.getPending);
router.get('/approved', alumniController.getApproved);
router.get('/denied',  alumniController.getDenied);
router.put('/approve/:id', alumniController.approveAlumni);
router.put('/deny/:id', alumniController.denyAlumni);
router.delete('/:id', alumniController.deleteAlumni);
router.post('/', upload.single('photo'), alumniController.createAlumni);
router.post('/login', alumniController.loginAlumni);
router.put('/profile', authMiddleware, upload.single('photo'), alumniController.updateProfile);

module.exports = router;
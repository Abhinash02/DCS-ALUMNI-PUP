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
// router.put('/approve/:id', alumniController.approveAlumni);
// router.delete('/:id', alumniController.deleteAlumni);



// module.exports = router;

const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const alumniController = require('../controllers/alumniController');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'alumni-photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

router.post('/', upload.single('photo'), alumniController.createAlumni);
router.get('/approved', alumniController.getApprovedAlumni);
router.get('/pending', alumniController.getPendingAlumni);
router.get('/denied', alumniController.getDeniedAlumni);
router.put('/approve/:id', alumniController.approveAlumni);
router.put('/deny/:id', alumniController.denyAlumni);
router.delete('/:id', alumniController.deleteAlumni);

module.exports = router;
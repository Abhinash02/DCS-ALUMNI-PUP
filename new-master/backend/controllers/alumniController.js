// const Alumni = require('../models/Alumni');

// exports.createAlumni = async (req, res) => {
//   try {
//     const {
//       name,
//       fathername,
//       email,
//       phone,
//       course,
//       batch,
//       address,
//       linkedin,
//       profession,
//       organization,
//       website,
//       sessionConsent,
//     } = req.body;

//     const skills = JSON.parse(req.body.skills || '[]');
//     const otherSkill = req.body.otherSkill || '';

//     if (!req.file) {
//       return res.status(400).json({ error: 'Photo upload failed or missing' });
//     }

//     const photo = req.file.path;

//     const alumni = new Alumni({
//       name,
//       fathername,
//       email,
//       phone,
//       course,
//       batch,
//       address,
//       linkedin,
//       profession,
//       organization,
//       website,
//       sessionConsent,
//       photo,
//       skills,
//       otherSkill,
//     });

//     await alumni.save();
//     res.status(201).json(alumni);
//   } catch (err) {
//     console.error('Create Alumni Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getApprovedAlumni = async (req, res) => {
//   try {
//     const data = await Alumni.find({ approved: true });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getPendingAlumni = async (req, res) => {
//   try {
//     const data = await Alumni.find({ approved: false });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.approveAlumni = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Alumni.findByIdAndUpdate(id, { approved: true });
//     res.json({ message: 'Alumni approved' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteAlumni = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Alumni.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ error: 'Alumni not found' });
//     }
//     res.json({ message: 'Alumni deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const Alumni = require('../models/alumni');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');


// Create a new alumni
exports.createAlumni = async (req, res) => {
  try {
    const {
      name,
      fathername,
      email,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills,
      otherSkill,
      sessionConsent,
      password // Added password
    } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const alumniData = {
      name,
      fathername,
      email,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills: JSON.parse(skills), // Assuming skills is sent as a JSON string
      otherSkill,
      sessionConsent,
      password: hashedPassword, // Store hashed password
      photo: req.file ? req.file.path : null // Cloudinary URL
    };

    const alumni = new Alumni(alumniData);
    await alumni.save();
    res.status(201).json({ message: 'Alumni registered successfully', alumni });
  } catch (error) {
    console.error('Error creating alumni:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!alumni.approved) {
      return res.status(403).json({ error: 'Account not approved' });
    }

    const token = jwt.sign({ userId: alumni._id, role: 'alumni' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, alumni: { id: alumni._id, name: alumni.name, email: alumni.email } });
  } catch (err) {
    console.error('Alumni Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update alumni profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      fathername,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills,
      otherSkill,
      sessionConsent
    } = req.body;

    const alumni = await Alumni.findById(req.user.userId);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    const updatedData = {
      name: name || alumni.name,
      fathername: fathername || alumni.fathername,
      phone: phone || alumni.phone,
      course: course || alumni.course,
      batch: batch || alumni.batch,
      address: address || alumni.address,
      linkedin: linkedin || alumni.linkedin,
      profession: profession || alumni.profession,
      organization: organization || alumni.organization,
      website: website || alumni.website,
      skills: skills ? JSON.parse(skills) : alumni.skills,
      otherSkill: otherSkill || alumni.otherSkill,
      sessionConsent: sessionConsent || alumni.sessionConsent
    };

    if (req.file) {
      // Delete old photo if exists
      if (alumni.photo) {
        const urlParts = alumni.photo.split('/');
        const fileName = urlParts.pop();
        const publicId = fileName ? fileName.split('.')[0] : null;
        if (publicId) {
          await cloudinary.uploader.destroy(`alumni/${publicId}`, { resource_type: 'image' });
        }
      }
      updatedData.photo = req.file.path;
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      req.user.userId,
      updatedData,
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', alumni: updatedAlumni });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Other controller functions (getPending, getApproved, etc.) remain unchanged

exports.getPending = async (req, res) => {
  try {
    const data = await Alumni.find({ approved: false, denied: false });
    res.json(data);
  } catch (err) {
    console.error('Get Pending Error:', err);
    res.status(500).json({ error: err.message });
  }
};




exports.getApproved = async (req, res) => {
  try {
    const alumni = await Alumni.find({ approved: true }).sort({ batch: -1 });
    res.json(alumni);
  } catch (err) {
    console.error('Get Approved Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getDenied = async (req, res) => {
  try {
    const data = await Alumni.find({ denied: true });
    res.json(data);
  } catch (err) {
    console.error('Get Denied Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.approveAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { approved: true, denied: false },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json(alumni);
  } catch (err) {
    console.error('Approve Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.denyAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { approved: false, denied: true },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json(alumni);
  } catch (err) {
    console.error('Deny Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    const urlParts = alumni.photo.split('/');
    const fileName = urlParts.pop();
    const publicId = fileName ? fileName.split('.')[0] : null;
    if (publicId) {
      await cloudinary.uploader.destroy(`alumni/${publicId}`, { resource_type: 'image' });
    } else {
      console.warn('Could not extract publicId from photo URL:', alumni.photo);
    }

    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    console.error('Delete Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};
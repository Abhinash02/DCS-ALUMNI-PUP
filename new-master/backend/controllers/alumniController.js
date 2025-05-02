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
const Alumni = require('../models/Alumni');

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
      sessionConsent,
    } = req.body;

    const skills = JSON.parse(req.body.skills || '[]');
    const otherSkill = req.body.otherSkill || '';

    if (!req.file) {
      return res.status(400).json({ error: 'Photo upload failed or missing' });
    }

    const photo = req.file.path;

    const alumni = new Alumni({
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
      sessionConsent,
      photo,
      skills,
      otherSkill,
    });

    await alumni.save();
    res.status(201).json(alumni);
  } catch (err) {
    console.error('Create Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getApprovedAlumni = async (req, res) => {
  try {
    const data = await Alumni.find({ approved: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingAlumni = async (req, res) => {
  try {
    const data = await Alumni.find({ approved: false, denied: false });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeniedAlumni = async (req, res) => {
  try {
    const data = await Alumni.find({ denied: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findByIdAndUpdate(
      id,
      { approved: true, denied: false },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json({ message: 'Alumni approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.denyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findByIdAndUpdate(
      id,
      { approved: false, denied: true },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json({ message: 'Alumni denied' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Alumni.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
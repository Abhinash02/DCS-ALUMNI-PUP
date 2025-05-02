const Faculty = require('../models/faculty');
const cloudinary = require('../utils/cloudinary');

exports.createFaculty = async (req, res) => {
  try {
    const {
      name, title, department, email, phone, expertise, bio, Designation
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const photo = req.file ? req.file.path : '/images/No User.Jpg'; // Cloudinary URL or default

    const faculty = new Faculty({
      name,
      title,
      department,
      email,
      phone,
      expertise: expertise ? (Array.isArray(expertise) ? expertise : expertise.split(',')) : [],
      bio,
      image: photo,
      Designation
    });

    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    console.error('Create Faculty Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    console.error('Get Faculty Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    if (faculty.image && !faculty.image.includes('No User.Jpg')) {
      const urlParts = faculty.image.split('/');
      const fileName = urlParts.pop();
      const publicId = fileName ? fileName.split('.')[0] : null;
      if (publicId) {
        await cloudinary.uploader.destroy(`faculty/${publicId}`, { resource_type: 'image' });
      }
    }

    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    console.error('Delete Faculty Error:', err);
    res.status(500).json({ error: err.message });
  }
};
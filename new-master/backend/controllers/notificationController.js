const Notification = require('../models/notification');
const cloudinary = require('../utils/cloudinary');

exports.createNotification = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File upload failed or missing' });
    }

    // Use req.file.path directly as the fileUrl
    const fileUrl = req.file.path;
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    const publicId = req.file.filename; // Cloudinary public ID

    console.log('Uploaded file:', { path: req.file.path, fileUrl, fileType, publicId });

    const notification = new Notification({
      title,
      description,
      fileUrl,
      fileType,
      publicId,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error('Create Notification Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    // Delete from MongoDB
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: notification.fileType === 'pdf' ? 'raw' : 'image',
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    res.status(500).json({ error: err.message });
  }
};
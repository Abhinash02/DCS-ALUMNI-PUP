// const Notification = require('../models/notification');
// const cloudinary = require('../utils/cloudinary');

// exports.createNotification = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ error: 'File upload failed or missing' });
//     }

//     // Use req.file.path directly as the fileUrl
//     const fileUrl = req.file.path;
//     const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
//     const publicId = req.file.filename; // Cloudinary public ID

//     console.log('Uploaded file:', { path: req.file.path, fileUrl, fileType, publicId });

//     const notification = new Notification({
//       title,
//       description,
//       fileUrl,
//       fileType,
//       publicId,
//     });

//     await notification.save();
//     res.status(201).json(notification);
//   } catch (err) {
//     console.error('Create Notification Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getNotifications = async (req, res) => {
//   try {
//     const data = await Notification.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { publicId } = req.body;

//     if (!publicId) {
//       return res.status(400).json({ error: 'Public ID is required' });
//     }

//     // Delete from MongoDB
//     const notification = await Notification.findByIdAndDelete(id);
//     if (!notification) {
//       return res.status(404).json({ error: 'Notification not found' });
//     }

//     // Delete from Cloudinary
//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: notification.fileType === 'pdf' ? 'raw' : 'image',
//     });

//     res.json({ message: 'Notification deleted successfully' });
//   } catch (err) {
//     console.error('Delete Notification Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

const Notification = require('../models/notification');
const cloudinary = require('../utils/cloudinary');

exports.createNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) {
      return res.status(400).json({ error: 'Title, description, and file are required' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'notifications',
      resource_type: 'auto',
    });

    const notification = new Notification({
      title,
      description,
      fileUrl: result.secure_url,
      fileType: result.resource_type === 'image' ? 'image' : 'pdf',
      publicId: result.public_id,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    let fileUrl = notification.fileUrl;
    let fileType = notification.fileType;
    let publicId = notification.publicId;

    if (file) {
      // Delete existing file from Cloudinary
      await cloudinary.uploader.destroy(notification.publicId, {
        resource_type: notification.fileType === 'image' ? 'image' : 'raw',
      });

      // Upload new file
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'notifications',
        resource_type: 'auto',
      });

      fileUrl = result.secure_url;
      fileType = result.resource_type === 'image' ? 'image' : 'pdf';
      publicId = result.public_id;
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      {
        title,
        description,
        fileUrl,
        fileType,
        publicId,
      },
      { new: true }
    );

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (req.body.publicId) {
      await cloudinary.uploader.destroy(req.body.publicId, {
        resource_type: notification.fileType === 'image' ? 'image' : 'raw',
      });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const Notification = require('../models/notification');
const cloudinary = require('../utils/cloudinary');

exports.createNotification = async (req, res) => {
  try {
    const { title, description, archiveDate } = req.body;
    const file = req.file;

    if (!title || !description || !file || !archiveDate) {
      return res.status(400).json({ error: 'Title, description, file, and archive date are required' });
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
      archiveDate: new Date(archiveDate),
      isArchived: new Date(archiveDate) <= new Date(),
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
    const notifications = await Notification.find().lean().sort({ createdAt: -1 });
    const now = new Date();

    const updatedNotifications = (notifications || []).map((notification) => {
      const isPastArchive =
        notification.archiveDate &&
        !isNaN(new Date(notification.archiveDate).getTime()) &&
        new Date(notification.archiveDate) <= now;

      return {
        ...notification,
        isArchived: notification.isArchived || isPastArchive,
      };
    });

    // Asynchronously update overdue notifications in MongoDB without blocking the response
    Notification.updateMany(
      { isArchived: false, archiveDate: { $lte: now } },
      { $set: { isArchived: true } }
    ).catch((err) => console.error('Background archive update error:', err));

    res.json(updatedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Graceful response instead of unhandled 500
    res.status(200).json([]);
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, archiveDate } = req.body;
    const file = req.file;

    if (!title || !description || !archiveDate) {
      return res.status(400).json({ error: 'Title, description, and archive date are required' });
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
        archiveDate: new Date(archiveDate),
        isArchived: new Date(archiveDate) <= new Date(),
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
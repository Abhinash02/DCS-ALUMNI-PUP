const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'pdf'], required: true },
  publicId: { type: String, required: true }, // For Cloudinary deletion
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
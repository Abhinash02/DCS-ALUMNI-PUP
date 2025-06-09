// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   fileUrl: { type: String, required: true },
//   fileType: { type: String, enum: ['image', 'pdf'], required: true },
//   publicId: { type: String, required: true }, // For Cloudinary deletion
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Notification', notificationSchema);

// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     fileUrl: { type: String, required: true },
//     fileType: { type: String, enum: ['image', 'pdf'], required: true },
//     publicId: { type: String, required: true }, // For Cloudinary deletion
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    fileType: { 
      type: String, 
      enum: ['image', 'pdf'], 
      required: true 
    },
    publicId: { 
      type: String, 
      required: true 
    }, // For Cloudinary deletion
    archiveDate: { 
      type: Date, 
      required: true 
    }, // Date when notification should be archived
    isArchived: { 
      type: Boolean, 
      default: false }, // Tracks if notification is archived
  },
  { timestamps: true, }
);

module.exports = mongoose.model('Notification', notificationSchema);
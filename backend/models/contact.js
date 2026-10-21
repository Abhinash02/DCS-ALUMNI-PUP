const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    from_fname: {
      type: String,
      required: true,
      trim: true,
    },
    from_lname: {
      type: String,
      required: true,
      trim: true,
    },
    from_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    selected_option: {
      type: String,
      required: true,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);

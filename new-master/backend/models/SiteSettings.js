const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema(
  {
    activePaletteId: {
      type: String,
      default: 'maroon',
      required: true,
      trim: true,
    },
    updatedBy: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);

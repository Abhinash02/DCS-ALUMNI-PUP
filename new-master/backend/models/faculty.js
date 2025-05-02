const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  department: { type: String },
  email: { type: String },
  phone: { type: String },
  expertise: { type: [String], default: [] },
  bio: { type: String },
  image: { type: String },
  Designation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
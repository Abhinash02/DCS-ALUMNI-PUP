const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: String,
  password: String, // Store hashed password ideally
});

module.exports = mongoose.model('Admin', adminSchema);

// const mongoose = require('mongoose');

// const alumniSchema = new mongoose.Schema({
//   name: String,
//   fathername: String,
//   email: String,
//   phone: String,
//   course: String,
//   batch: String,
//   address: String,
//   linkedin: String,
//   profession: String,
//   organization: String,
//   website: String,
//   photo: String,
//   skills: [String],
//   otherSkill: String,
//   sessionConsent: String,
//   approved: { type: Boolean, default: false }
// });

// module.exports = mongoose.model('Alumni', alumniSchema);

const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: String,
  fathername: String,
  email: String,
  phone: String,
  course: String,
  batch: String,
  address: String,
  linkedin: String,
  profession: String,
  organization: String,
  website: String,
  photo: String,
  skills: [String],
  otherSkill: String,
  sessionConsent: String,
  approved: { type: Boolean, default: false },
  denied: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alumni', alumniSchema);
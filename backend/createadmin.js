// backend/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  const email = 'csepupalumni@gmail.com';
  const password = 'Dcs#Alumni@pup';

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('Admin already exists');
      // Update existing admin password to use bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
      exists.password = hashedPassword;
      await exists.save();
      console.log('Admin password updated to hashed version successfully');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      console.log('Admin created successfully');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();

// backend/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  const email = 'admin@1234';
  const password = '123'; // hashed 'admin123'

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('Admin already exists');
    } else {
      const admin = new Admin({ email, password });
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

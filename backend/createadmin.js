// backend/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  const email = process.argv[2] || 'abhinash.webdev@gmail.com';
  const password = process.argv[3] || 'Abhinash#kanika@18';

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing in .env file!');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log('Connected to MongoDB successfully.');

    const exists = await Admin.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (exists) {
      exists.password = hashedPassword;
      await exists.save();
      console.log(`✅ Admin password updated successfully for: ${email}`);
    } else {
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      console.log(`✅ New Admin account created successfully for: ${email}`);
    }
  } catch (err) {
    console.error('❌ Error creating/updating admin:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

createAdmin();

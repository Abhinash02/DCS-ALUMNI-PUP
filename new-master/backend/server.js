
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const alumniRoutes = require('./routes/alumniRoutes');
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const events = require('./routes/events');
const notificationRoutes = require('./routes/notificationRoutes');
const jobRoutes = require('./routes/jobRoutes');

dotenv.config();

const app = express();


// Allowed Frontend URLs
const allowedOrigins = [
  'https://dcsalumni.vishalpup.in',
  'https://dcs-alumni.vercel.app',
  'http://localhost:3000',
];


// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin, matched in allowedOrigins list, or any local dev server port
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());


// MongoDB Connection (Serverless Friendly)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.log('MongoDB Connection Error:', err);
  }
};

// Connect to the database before handling any requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});


// Root Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Ping Route (to prevent cold starts)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Root Route (Required by Vercel/Cron)
app.get('/', (req, res) => {
  res.status(200).send('Backend API is running flawlessly! 🚀');
});


// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/events', events);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jobs', jobRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

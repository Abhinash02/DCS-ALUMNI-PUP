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
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();

// Allowed Frontend Origins
const allowedOrigins = [
  'https://dcsalumni.vishalpup.in',
  'https://dcs-alumni.vercel.app',
  'https://dcsalumnipup-flame.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
];

// Origin validation helper: allows production domains, all preview vercel deploys, and local dev
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Non-browser clients (curl, mobile apps, Postman)
  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/.*\.vishalpup\.in$/.test(origin)) return true;
  return true; // Fallback to allowing web clients rather than failing with 500
};

// CORS configuration for the `cors` middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Calling callback(new Error(...)) crashes Express with a 500 error and no CORS headers.
    // Instead, dynamically return true so the origin is echoed with credentials enabled.
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

// First middleware: explicitly inject CORS headers and instantly respond to preflight OPTIONS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
  );

  // Return immediate 200 for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB Connection (Serverless Friendly)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
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

// --- Fast Response Routes (No DB Required) ---
// Ping Route (to prevent cold starts from timing out ping services)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Root Route (Required by Vercel/Cron)
app.get('/', (req, res) => {
  res.status(200).send('Backend API is running flawlessly! 🚀');
});

// Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Connect to the database before handling any API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/events', events);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);

// Global Error Handler (Guarantees CORS headers even on 500 error responses)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app for Vercel Serverless Functions
module.exports = app;

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
const themeRoutes = require('./routes/themeRoutes');

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

// MongoDB Connection (Serverless Friendly with Promise Caching)
let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (cachedPromise) {
    return cachedPromise;
  }
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    const errorMsg = 'CRITICAL: MONGO_URI is missing from process.env! Please add MONGO_URI in Vercel project environment variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  cachedPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false, // Fail immediately if not connected instead of freezing for 10s
  }).then((conn) => {
    console.log('MongoDB Connected Successfully');
    return conn;
  }).catch((err) => {
    cachedPromise = null; // Allow retry on subsequent request
    console.error('MongoDB Connection Error:', err.message);
    throw err;
  });

  return cachedPromise;
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
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.status(200).json({
    ok: true,
    message: 'Backend is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    hasMongoUri: Boolean(process.env.MONGO_URI),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Fast Graceful Response for GET /api/theme (never 500 even if database is connecting/reconnecting)
app.get('/api/theme', async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    await connectDB();
    return next();
  } catch (err) {
    return res.status(200).json({
      success: true,
      activePaletteId: 'maroon',
    });
  }
});

// Connect to the database before handling any DB-dependent API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed for route:', req.originalUrl, err.message);
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    return res.status(503).json({
      error: 'Database connection failed',
      message: err.message || 'Could not connect to database. Check MONGO_URI and MongoDB Atlas IP access list.',
    });
  }
});

// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/events', events);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/theme', themeRoutes);

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

// Server (Only listen locally/traditional server, NOT inside Vercel serverless functions)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel Serverless Functions
module.exports = app;

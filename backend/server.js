// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const alumniRoutes = require('./routes/alumniRoutes');
// const authRoutes = require('./routes/authRoutes');
// const facultyRoutes = require('./routes/facultyRoutes');
// const events = require('./routes/events');
// const notificationRoutes = require('./routes/notificationRoutes');


// dotenv.config();
// const app = express();

// // app.use(cors());
// // const corsOptions = {
// //   origin: (origin, callback) => {
// //     // Allow requests with no origin (like mobile apps, curl, etc.)
// //     if (!origin || origin === 'https://dcsalumni.vishalpup.in','http://localhost:3000') {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// // };
// const allowedOrigins = [
//   'https://dcsalumni.vishalpup.in',
//   'http://localhost:3000',
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use('/api/alumni', alumniRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/faculty', facultyRoutes);
// app.use('/api/events', events);
// app.use('/api/notifications', notificationRoutes);


// // app.listen(5000, () => console.log('Backend running on port 5000'));

// const PORT = process.env.PORT || 5000;  // <--- IMPORTANT: Must use process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get("/", (req, res) => {
//   res.send("Backend API Running Successfully");
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const alumniRoutes = require('./routes/alumniRoutes');
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const events = require('./routes/events');
const notificationRoutes = require('./routes/notificationRoutes');

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


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log(err));


// Root Route
app.get('/', (req, res) => {
  res.send('Backend API Running Successfully');
});


// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/events', events);
app.use('/api/notifications', notificationRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
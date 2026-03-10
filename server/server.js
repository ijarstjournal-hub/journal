require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./routes/adminRoutes');
const paperRoutes = require('./routes/paperRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// allow requests from the frontend host(s) (set via environment variable)
// in development we default to localhost:3000
const clientUrls = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (like Postman) and same-origin requests
    if (!origin || clientUrls.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/papers', paperRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

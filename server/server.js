require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const adminRoutes = require('./routes/adminRoutes');
const paperRoutes = require('./routes/paperRoutes');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });

app.use('/api/admin', adminRoutes);
app.use('/api/papers', paperRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mongodb: mongoose.connection.readyState === 1 });
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.message.includes('File too large')) return res.status(400).json({ message: 'File exceeds 10MB limit' });
  if (err.message.includes('Only PDF files')) return res.status(400).json({ message: 'Only PDF files are allowed' });
  res.status(500).json({ message: 'Server error', error: err.message });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});

module.exports = app;

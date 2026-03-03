const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// ONE-TIME SETUP — creates first admin account
// Disable this route after first use by removing/commenting it out
router.post('/setup', async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: 'Invalid setup key' });
    }

    const existing = await Admin.findOne({});
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists. Setup disabled.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = new Admin({ email, password: hashed });
    await admin.save();

    res.json({ message: 'Admin account created successfully. This route is now locked.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out' });
});

// CHECK AUTH STATUS
router.get('/me', auth, (req, res) => {
  res.json({ email: req.admin.email });
});

module.exports = router;

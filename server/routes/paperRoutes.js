const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const auth = require('../middleware/auth');

// PUBLIC: Get all published papers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { published: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'authors.name': { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } }
      ];
    }

    const papers = await Paper.find(query).sort({ publicationDate: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Get most-viewed published paper
router.get('/most-viewed', async (req, res) => {
  try {
    const paper = await Paper.findOne({ published: true }).sort({ views: -1 }).limit(1);
    res.json(paper || null);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Get single paper by ID (also increments view count)
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findOneAndUpdate(
      { _id: req.params.id, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json(paper);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Get ALL papers (including unpublished)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Create paper
router.post('/admin/create', auth, async (req, res) => {
  try {
    const paper = new Paper(req.body);
    await paper.save();
    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update paper
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json(paper);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete paper
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    await Paper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Paper deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Toggle publish
router.patch('/admin/:id/publish', auth, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    paper.published = !paper.published;
    await paper.save();
    res.json({ published: paper.published });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

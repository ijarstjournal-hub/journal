const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Paper = require('../models/Paper');
const auth = require('../middleware/auth');
const upload = require('../middleware/fileUpload');
const { generatePaperPdf } = require('../utils/pdfGenerator');

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

// PUBLIC: Get single paper by ID (increments view count)
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

// PUBLIC: Download paper PDF (generated or original)
router.get('/:id/pdf', async (req, res) => {
  try {
    const paper = await Paper.findOne({ _id: req.params.id, published: true });
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Update download count
    await Paper.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    // Prefer generated PDF, fallback to uploaded PDF
    const fileId = paper.generatedPdf?.fileId || paper.pdfFile?.fileId;
    if (!fileId) return res.status(404).json({ message: 'PDF not available' });

    const bucket = new mongoose.mongo.GridFSBucket(req.gfs.db);
    const downloadStream = bucket.openDownloadStream(fileId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${paper.title.replace(/\s+/g, '_')}.pdf"`);
    
    downloadStream.pipe(res);
    
    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Upload PDF file
router.post('/admin/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to GridFS
    const bucket = new mongoose.mongo.GridFSBucket(req.gfs.db);
    const uploadStream = bucket.openUploadStream(req.file.originalname);

    uploadStream.on('error', (err) => {
      res.status(500).json({ message: 'File upload failed', error: err.message });
    });

    uploadStream.on('finish', () => {
      res.json({
        message: 'File uploaded successfully',
        fileId: uploadStream.id,
        filename: req.file.originalname,
        size: req.file.size
      });
    });

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Get all papers (including unpublished)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Create paper (with uploaded PDF file)
router.post('/admin/create', auth, async (req, res) => {
  try {
    const { title, abstract, authors, keywords, volume, issue, publicationDate, pdfFileId, pdfFileName, pdfFileSize } = req.body;

    if (!title || !abstract || !authors) {
      return res.status(400).json({ message: 'Title, abstract, and authors are required' });
    }

    if (!pdfFileId) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const paper = new Paper({
      title,
      abstract,
      authors,
      keywords: keywords || [],
      volume,
      issue,
      publicationDate: publicationDate || new Date(),
      pdfFile: {
        filename: pdfFileName,
        fileId: new mongoose.Types.ObjectId(pdfFileId),
        uploadedAt: new Date(),
        size: pdfFileSize
      },
      published: false
    });

    await paper.save();
    res.status(201).json({ message: 'Paper created successfully', paper });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update paper
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const { pdfFileId, pdfFileName, pdfFileSize, ...updateData } = req.body;

    // Update PDF file if new one provided
    if (pdfFileId) {
      updateData.pdfFile = {
        filename: pdfFileName,
        fileId: new mongoose.Types.ObjectId(pdfFileId),
        uploadedAt: new Date(),
        size: pdfFileSize
      };
    }

    const paper = await Paper.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ message: 'Paper updated successfully', paper });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete paper
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // Delete files from GridFS if they exist
    if (paper.pdfFile?.fileId || paper.generatedPdf?.fileId) {
      const bucket = new mongoose.mongo.GridFSBucket(req.gfs.db);
      if (paper.pdfFile?.fileId) {
        await bucket.delete(new mongoose.Types.ObjectId(paper.pdfFile.fileId));
      }
      if (paper.generatedPdf?.fileId) {
        await bucket.delete(new mongoose.Types.ObjectId(paper.generatedPdf.fileId));
      }
    }

    res.json({ message: 'Paper deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Toggle publish (generates PDF when publishing)
router.patch('/admin/:id/publish', auth, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    // If publishing (false to true), generate PDF
    if (!paper.published) {
      try {
        const pdfBuffer = await generatePaperPdf(paper);
        const bucket = new mongoose.mongo.GridFSBucket(req.gfs.db);
        const uploadStream = bucket.openUploadStream(`${paper._id}_generated.pdf`);

        uploadStream.on('finish', async () => {
          paper.published = true;
          paper.generatedPdf = {
            fileId: uploadStream.id,
            generatedAt: new Date()
          };
          await paper.save();
          res.json({ message: 'Paper published successfully', published: true });
        });

        uploadStream.on('error', (err) => {
          res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
        });

        uploadStream.end(pdfBuffer);
      } catch (pdfErr) {
        res.status(500).json({ message: 'PDF generation failed', error: pdfErr.message });
      }
    } else {
      // If unpublishing, just toggle
      paper.published = false;
      await paper.save();
      res.json({ message: 'Paper unpublished successfully', published: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

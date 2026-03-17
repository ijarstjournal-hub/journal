const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const auth = require('../middleware/auth');
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

    // Don't return PDF buffers in list
    const papers = await Paper.find(query)
      .select('-pdfFile.data -generatedPdf.data')
      .sort({ publicationDate: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Get most-viewed published paper
router.get('/most-viewed', async (req, res) => {
  try {
    const paper = await Paper.findOne({ published: true })
      .select('-pdfFile.data -generatedPdf.data')
      .sort({ views: -1 })
      .limit(1);
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
    ).select('-pdfFile.data -generatedPdf.data');
    
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
    const pdfData = paper.generatedPdf?.data || paper.pdfFile?.data;
    const filename = paper.generatedPdf?.filename || paper.pdfFile?.filename;

    if (!pdfData) {
      return res.status(404).json({ message: 'PDF not available' });
    }

    // Send PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || paper.title.replace(/\s+/g, '_')}.pdf"`);
    res.setHeader('Content-Length', pdfData.length);
    res.send(pdfData);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Get all papers (including unpublished)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const papers = await Paper.find()
      .select('-pdfFile.data -generatedPdf.data')
      .sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Create paper (with base64 PDF buffer)
router.post('/admin/create', auth, async (req, res) => {
  try {
    const { title, abstract, authors, keywords, volume, issue, publicationDate, pdfFileBuffer, pdfFileName, pdfFileSize } = req.body;

    if (!title || !abstract || !authors) {
      return res.status(400).json({ message: 'Title, abstract, and authors are required' });
    }

    if (!pdfFileBuffer) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Convert base64 string to Buffer if needed
    let pdfBuffer = pdfFileBuffer;
    if (typeof pdfFileBuffer === 'string') {
      pdfBuffer = Buffer.from(pdfFileBuffer, 'base64');
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
        data: pdfBuffer,
        filename: pdfFileName,
        uploadedAt: new Date(),
        size: pdfFileSize
      },
      published: false
    });

    await paper.save();
    
    // Return without PDF data
    const paperData = paper.toObject();
    delete paperData.pdfFile.data;
    if (paperData.generatedPdf) delete paperData.generatedPdf.data;
    
    res.status(201).json({ message: 'Paper created successfully', paper: paperData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update paper
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const { pdfFileBuffer, pdfFileName, pdfFileSize, ...updateData } = req.body;

    // Update PDF file if new one provided
    if (pdfFileBuffer) {
      let pdfBuffer = pdfFileBuffer;
      if (typeof pdfFileBuffer === 'string') {
        pdfBuffer = Buffer.from(pdfFileBuffer, 'base64');
      }
      
      updateData.pdfFile = {
        data: pdfBuffer,
        filename: pdfFileName,
        uploadedAt: new Date(),
        size: pdfFileSize
      };
    }

    const paper = await Paper.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .select('-pdfFile.data -generatedPdf.data');
    
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
        
        paper.published = true;
        paper.generatedPdf = {
          data: pdfBuffer,
          filename: `${paper._id}_ijarst.pdf`,
          size: pdfBuffer.length,
          generatedAt: new Date()
        };
        await paper.save();
        
        // Return without PDF data
        const paperData = paper.toObject();
        delete paperData.pdfFile.data;
        delete paperData.generatedPdf.data;
        
        res.json({ message: 'Paper published successfully', published: true, paper: paperData });
      } catch (pdfErr) {
        res.status(500).json({ message: 'PDF generation failed', error: pdfErr.message });
      }
    } else {
      // If unpublishing, just toggle
      paper.published = false;
      await paper.save();
      
      // Return without PDF data
      const paperData = paper.toObject();
      delete paperData.pdfFile?.data;
      delete paperData.generatedPdf?.data;
      
      res.json({ message: 'Paper unpublished successfully', published: false, paper: paperData });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

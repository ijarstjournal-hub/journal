const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  authors: [
    {
      name: { type: String, required: true },
      affiliation: { type: String },
      email: { type: String }
    }
  ],
  keywords: [{ type: String }],
  
  // File storage (replacing pdfUrl) - stores original uploaded PDF
  pdfFile: {
    filename: String,
    fileId: mongoose.Schema.Types.ObjectId, // GridFS file ID
    uploadedAt: Date,
    size: Number // in bytes
  },
  
  doi: { type: String },
  volume: { type: String },
  issue: { type: String },
  publicationDate: { type: Date },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  // Generated professional PDF (created when published)
  generatedPdf: {
    fileId: mongoose.Schema.Types.ObjectId,
    generatedAt: Date
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate DOI before save if not provided
paperSchema.pre('save', function (next) {
  if (!this.doi && this.volume && this.issue) {
    const shortId = this._id.toString().slice(-6);
    this.doi = `10.5678/ijarst.v${this.volume}i${this.issue}.${shortId}`;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Paper', paperSchema);

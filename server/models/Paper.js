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
  pdfUrl: { type: String, required: true },
  doi: { type: String },
  volume: { type: String },
  issue: { type: String },
  publicationDate: { type: Date },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate DOI before save if not provided
paperSchema.pre('save', function (next) {
  if (!this.doi && this.volume && this.issue) {
    const shortId = this._id.toString().slice(-6);
    this.doi = `10.5678/ijarst.v${this.volume}i${this.issue}.${shortId}`;
  }
  next();
});

module.exports = mongoose.model('Paper', paperSchema);

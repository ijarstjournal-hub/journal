const PDFDocument = require('pdfkit');

async function generatePaperPdf(paper) {
  try {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40
    });

    // Store PDF in memory
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));

    // Journal Header
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text('IJARST', { align: 'center' })
      .fontSize(10)
      .font('Helvetica')
      .text('International Journal of Applied Research in Science & Technology', { align: 'center' })
      .fontSize(9)
      .text('https://ijarst.uk', { align: 'center' })
      .moveDown(0.3)
      .fontSize(9)
      .text(`Volume-${paper.volume || 'XX'} Issue ${paper.issue || 'XX'}, ${new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`, { align: 'center' })
      .text('ISSN: 2456-9348 | Impact Factor: 8.45', { align: 'center' })
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke()
      .moveDown(1);

    // Paper Title
    doc.fontSize(13)
      .font('Helvetica-Bold')
      .text(paper.title.toUpperCase(), { align: 'center' })
      .moveDown(0.5);

    // Authors
    paper.authors.forEach((author) => {
      doc.fontSize(11)
        .font('Helvetica-Bold')
        .text(author.name, { align: 'center' });
      if (author.affiliation) {
        doc.fontSize(10)
          .font('Helvetica')
          .text(author.affiliation, { align: 'center' });
      }
      if (author.email) {
        doc.fontSize(9)
          .font('Helvetica')
          .text(author.email, { align: 'center' });
      }
    });
    doc.moveDown(0.5);

    // Abstract Section
    doc.fontSize(11)
      .font('Helvetica-Bold')
      .text('ABSTRACT', { underline: true })
      .moveDown(0.3)
      .fontSize(11)
      .font('Helvetica')
      .text(paper.abstract, { align: 'justify' })
      .moveDown(0.5);

    // Keywords
    if (paper.keywords && paper.keywords.length > 0) {
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Keywords: ', { continued: true })
        .font('Helvetica')
        .text(paper.keywords.join(', '))
        .moveDown(0.5);
    }

    // Metadata Box
    doc.fontSize(10)
      .font('Helvetica')
      .text(`DOI: ${paper.doi || 'N/A'}`)
      .text(`Published: ${new Date(paper.publicationDate).toLocaleDateString('en-US')}`)
      .moveDown(1);

    // Footer Line
    doc.moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke()
      .moveDown(0.3);

    // Footer Text
    doc.fontSize(9)
      .font('Helvetica')
      .text(`© ${new Date().getFullYear()} IJARST. All rights reserved.`, { align: 'center' })
      .text('https://ijarst.uk', { align: 'center' });

    // Attach listeners BEFORE calling end()
    return new Promise((resolve, reject) => {
      doc.on('finish', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
      
      // NOW call end()
      doc.end();
    });

  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

module.exports = { generatePaperPdf };

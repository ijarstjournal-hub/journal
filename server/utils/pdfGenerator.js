const PDFDocument = require('pdfkit');

async function generatePaperPdf(paper) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 45, bottom: 45, left: 45, right: 45 },
        info: {
          Title: paper.title,
          Author: paper.authors?.map(a => a.name).join(', ') || '',
          Subject: 'IJARST Journal Article',
          Keywords: paper.keywords?.join(', ') || '',
          Creator: 'IJARST - International Journal of Applied Research in Science & Technology',
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('finish', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const PAGE_W = doc.page.width;
      const MARGIN = 45;
      const CONTENT_W = PAGE_W - MARGIN * 2;
      const MID = PAGE_W / 2;

      const BLACK   = '#000000';
      const DARK    = '#111111';
      const MED     = '#333333';
      const LIGHT   = '#555555';
      const ACCENT  = '#1B5E20';
      const LINE_CLR = '#999999';

      const hRule = (y, width = CONTENT_W, x = MARGIN, color = LINE_CLR, thickness = 0.5) => {
        doc.save()
           .strokeColor(color)
           .lineWidth(thickness)
           .moveTo(x, y)
           .lineTo(x + width, y)
           .stroke()
           .restore();
      };

      const twoColText = (leftText, rightText, y, fontSize = 8.5) => {
        const colW = (CONTENT_W - 10) / 2;
        doc.fontSize(fontSize).font('Helvetica').fillColor(LIGHT);
        if (leftText)  doc.text(leftText, MARGIN,     y, { width: colW, align: 'left'  });
        if (rightText) doc.text(rightText, MID + 5,   y, { width: colW, align: 'right' });
      };

      const pubDate = paper.publicationDate
        ? new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : '';
      const volIssue = `Volume-${paper.volume || 'XX'} Issue ${paper.issue || 'XX'}, ${pubDate}`;
      const issnLine = `ISSN: 2456-9348                     Impact Factor: 8.45`;

      twoColText(volIssue, issnLine, MARGIN, 8.5);

      let curY = MARGIN + 18;

      doc.fontSize(22)
         .font('Helvetica-Bold')
         .fillColor(ACCENT)
         .text('IJARST', MARGIN, curY, { width: CONTENT_W, align: 'center' });
      curY += 26;

      doc.fontSize(9.5)
         .font('Helvetica-Bold')
         .fillColor(ACCENT)
         .text('International Journal of Applied Research in Science & Technology (IJARST)', MARGIN, curY, { width: CONTENT_W, align: 'center' });
      curY += 14;

      doc.fontSize(8.5)
         .font('Helvetica')
         .fillColor(MED)
         .text('Journal Article', MARGIN, curY, { width: CONTENT_W, align: 'center' });
      curY += 12;

      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#1565C0')
         .text('https://ijarst.uk/issues', MARGIN, curY, { width: CONTENT_W, align: 'center', link: 'https://ijarst.uk/issues' });
      curY += 14;

      hRule(curY,     CONTENT_W, MARGIN, ACCENT, 1.5);
      hRule(curY + 3, CONTENT_W, MARGIN, ACCENT, 0.4);
      curY += 12;

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor(DARK)
         .text(paper.title.toUpperCase(), MARGIN, curY, {
           width: CONTENT_W,
           align: 'center',
           lineGap: 2
         });
      curY = doc.y + 10;

      (paper.authors || []).forEach(author => {
        doc.fontSize(10.5)
           .font('Helvetica-Bold')
           .fillColor(DARK)
           .text(author.name, MARGIN, curY, { width: CONTENT_W, align: 'center' });
        curY = doc.y + 1;

        if (author.affiliation) {
          doc.fontSize(9)
             .font('Helvetica')
             .fillColor(LIGHT)
             .text(author.affiliation, MARGIN, curY, { width: CONTENT_W, align: 'center' });
          curY = doc.y + 1;
        }
        if (author.email) {
          doc.fontSize(8.5)
             .font('Helvetica')
             .fillColor('#1565C0')
             .text(author.email, MARGIN, curY, { width: CONTENT_W, align: 'center' });
          curY = doc.y + 1;
        }
        curY += 4;
      });

      curY += 4;
      hRule(curY, CONTENT_W, MARGIN, LINE_CLR, 0.5);
      curY += 10;

      doc.fontSize(9.5)
         .font('Helvetica-Bold')
         .fillColor(DARK)
         .text('ABSTRACT', MARGIN, curY);
      curY = doc.y + 4;

      doc.fontSize(9.5)
         .font('Helvetica')
         .fillColor(MED)
         .text(paper.abstract, MARGIN, curY, {
           width: CONTENT_W,
           align: 'justify',
           lineGap: 1.5
         });
      curY = doc.y + 8;

      if (paper.keywords && paper.keywords.length > 0) {
        doc.fontSize(9.5)
           .font('Helvetica-Bold')
           .fillColor(DARK)
           .text('Keywords: ', MARGIN, curY, { continued: true })
           .font('Helvetica')
           .fillColor(MED)
           .text(paper.keywords.join(', '), { align: 'justify' });
        curY = doc.y + 8;
      }

      hRule(curY, CONTENT_W, MARGIN, LINE_CLR, 0.5);
      curY += 10;

      const metaBoxX = MARGIN;
      const metaBoxW = CONTENT_W;
      const metaBoxH = 52;

      doc.save()
         .rect(metaBoxX, curY, metaBoxW, metaBoxH)
         .fillColor('#F9F9F9')
         .fill()
         .rect(metaBoxX, curY, metaBoxW, metaBoxH)
         .strokeColor('#CCCCCC')
         .lineWidth(0.5)
         .stroke()
         .restore();

      const metaColW = (metaBoxW - 20) / 3;
      const metaY = curY + 8;

      const metaItems = [
        ['Journal', 'IJARST'],
        ['Volume / Issue', `Vol. ${paper.volume || 'XX'} / No. ${paper.issue || 'XX'}`],
        ['Published', pubDate || 'N/A'],
        ['DOI', paper.doi ? paper.doi : 'N/A'],
        ['ISSN', '2456-9348'],
        ['Access', 'Open Access'],
      ];

      metaItems.forEach((item, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const mx = metaBoxX + 10 + col * (metaColW + 5);
        const my = metaY + row * 18;

        doc.fontSize(7.5).font('Helvetica-Bold').fillColor(LIGHT)
           .text(item[0].toUpperCase(), mx, my, { width: metaColW });
        doc.fontSize(8.5).font('Helvetica').fillColor(DARK)
           .text(item[1], mx, my + 8, { width: metaColW });
      });

      curY += metaBoxH + 12;

      hRule(curY, CONTENT_W, MARGIN, LINE_CLR, 0.5);
      curY += 10;

      doc.fontSize(9.5)
         .font('Helvetica-Bold')
         .fillColor(DARK)
         .text('FULL ARTICLE', MARGIN, curY, { width: CONTENT_W, align: 'center' });
      curY = doc.y + 6;

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor(LIGHT)
         .text(
           'The complete article including introduction, methodology, results, discussion, conclusion, and references ' +
           'is available for download from the IJARST website. Visit https://ijarst.uk to access the full text.',
           MARGIN, curY, { width: CONTENT_W, align: 'center', lineGap: 2 }
         );

      const addFooter = () => {
        const footerY = doc.page.height - 35;
        hRule(footerY, CONTENT_W, MARGIN, LINE_CLR, 0.5);
        doc.fontSize(7.5)
           .font('Helvetica')
           .fillColor(LIGHT)
           .text('IJARST (https://ijarst.uk)', MARGIN, footerY + 5, { width: CONTENT_W / 2, align: 'left' })
           .text(
             `© ${new Date().getFullYear()} IJARST. All rights reserved. ISSN: 2456-9348`,
             MARGIN + CONTENT_W / 2, footerY + 5,
             { width: CONTENT_W / 2, align: 'right' }
           );
      };

      addFooter();
      doc.on('pageAdded', addFooter);
      doc.end();

    } catch (error) {
      reject(new Error(`PDF generation failed: ${error.message}`));
    }
  });
}

module.exports = { generatePaperPdf };

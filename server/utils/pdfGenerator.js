const puppeteer = require('puppeteer');

async function generatePaperPdf(paper) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Create HTML content in IJETRM-style format
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #000;
            background: #fff;
            padding: 40px;
            font-size: 11pt;
          }
          .page-break { page-break-after: always; }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .journal-name {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .journal-full {
            font-size: 10pt;
            color: #333;
            margin-bottom: 4px;
          }
          .journal-url {
            font-size: 9pt;
            color: #555;
            margin-bottom: 12px;
          }
          .volume-info {
            font-size: 9pt;
            color: #333;
            margin-bottom: 2px;
          }
          .paper-title {
            font-size: 13pt;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            line-height: 1.5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .authors {
            text-align: center;
            margin: 15px 0;
            font-size: 11pt;
          }
          .author-name {
            font-weight: bold;
            margin: 8px 0 2px 0;
          }
          .affiliation {
            font-size: 10pt;
            color: #333;
            margin-bottom: 4px;
          }
          .section-title {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            font-size: 11pt;
            text-transform: uppercase;
          }
          .abstract {
            text-align: justify;
            margin-bottom: 15px;
            font-size: 11pt;
          }
          .keywords {
            margin: 10px 0;
            font-size: 10pt;
          }
          .keywords-label {
            font-weight: bold;
          }
          .content {
            text-align: justify;
            margin: 15px 0;
            font-size: 11pt;
            line-height: 1.7;
          }
          .footer {
            border-top: 1px solid #999;
            margin-top: 30px;
            padding-top: 15px;
            font-size: 9pt;
            color: #555;
            text-align: center;
          }
          .meta-info {
            text-align: center;
            margin: 15px 0;
            font-size: 10pt;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px;
            background: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <div class="journal-name">IJARST</div>
          <div class="journal-full">International Journal of Applied Research in Science & Technology</div>
          <div class="journal-url">https://ijarst.uk</div>
          <div class="volume-info">Volume-${paper.volume || 'XX'} Issue ${paper.issue || 'XX'}, ${new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
          <div class="volume-info">ISSN: 2456-9348 | Impact Factor: 8.45</div>
        </div>

        <!-- Paper Title -->
        <div class="paper-title">${paper.title}</div>

        <!-- Authors -->
        <div class="authors">
          ${paper.authors.map(author => `
            <div class="author-name">${author.name}</div>
            ${author.affiliation ? `<div class="affiliation">${author.affiliation}</div>` : ''}
            ${author.email ? `<div class="affiliation">${author.email}</div>` : ''}
          `).join('')}
        </div>

        <!-- Abstract -->
        <div class="section-title">ABSTRACT</div>
        <div class="abstract">${paper.abstract}</div>

        <!-- Keywords -->
        ${paper.keywords && paper.keywords.length > 0 ? `
          <div class="keywords">
            <span class="keywords-label">Keywords:</span>
            ${paper.keywords.join(', ')}
          </div>
        ` : ''}

        <!-- Metadata -->
        <div class="meta-info">
          <div><strong>DOI:</strong> ${paper.doi || 'N/A'}</div>
          <div><strong>Published:</strong> ${new Date(paper.publicationDate).toLocaleDateString('en-US')}</div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div>© ${new Date().getFullYear()} IJARST. All rights reserved.</div>
          <div>https://ijarst.uk</div>
        </div>
      </body>
      </html>
    `;

    // Set HTML content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 9pt; width: 100%; text-align: center; padding: 10px;"></div>',
      footerTemplate: `
        <div style="font-size: 8pt; width: 100%; text-align: center; padding: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    if (browser) await browser.close();
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

module.exports = { generatePaperPdf };

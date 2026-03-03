import React from 'react';

const JOURNAL_EMAIL = 'ijarstjournal@gmail.com';

export default function SubmitPaper() {
  const handleGmailClick = () => {
    const subject = encodeURIComponent('IJARST Paper Submission');
    const body = encodeURIComponent(
      'Dear IJARST Editorial Team,\n\n' +
      'I would like to submit a paper for consideration.\n\n' +
      'Full Name: \n' +
      'Affiliation: \n' +
      'Paper Title: \n\n' +
      'Please find my paper attached as a PDF.\n\n' +
      'Regards,'
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=${JOURNAL_EMAIL}&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <div>
      {/* Header */}
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Submissions</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Submit Your Paper
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>Send your research directly via Gmail</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>

          {/* APC notice — prominent */}
          <div style={{
            background: '#fff9e6',
            border: '2px solid #F5C400',
            padding: '20px 24px',
            marginBottom: 40,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>💡</span>
            <div>
              <strong style={{ fontSize: 15, display: 'block', marginBottom: 4, color: '#0D0D0D' }}>
                Article Processing Charge (APC): $33 USD
              </strong>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                The APC of $33 is payable <strong>only after your paper has been accepted</strong> for publication. You will be contacted with payment details upon acceptance. There is no submission fee.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 20 }}>How to Submit</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { step: '1', text: 'Click the "Submit via Gmail" button below to open a pre-filled email.' },
                { step: '2', text: 'Attach your paper as a PDF file to the email.' },
                { step: '3', text: 'Fill in your full name, affiliation, and paper title in the message.' },
                { step: '4', text: 'Send the email. Our editorial team will review and respond within 7–14 business days.' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 36, height: 36, background: '#1B5E20', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15, flexShrink: 0,
                  }}>{item.step}</div>
                  <p style={{ fontSize: 15, color: '#333', lineHeight: 1.6, paddingTop: 6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: '#0D0D0D',
            padding: '40px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#fff', marginBottom: 12 }}>
              Ready to Submit?
            </h3>
            <p style={{ color: '#bbb', fontSize: 14, marginBottom: 28 }}>
              Your email will be pre-filled. Just attach your PDF and send.
            </p>
            <button onClick={handleGmailClick} className="btn btn-yellow" style={{ fontSize: 15, padding: '14px 36px' }}>
              ✉ Submit via Gmail
            </button>
            <p style={{ color: '#666', fontSize: 12, marginTop: 16 }}>
              Alternatively, email directly: <a href={`mailto:${JOURNAL_EMAIL}`} style={{ color: '#F5C400' }}>{JOURNAL_EMAIL}</a>
            </p>
          </div>

          {/* Guidelines */}
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 20 }}>Submission Guidelines</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {[
                { title: 'Format', desc: 'PDF only. Use standard academic formatting with abstract, introduction, methodology, results, and references.' },
                { title: 'Language', desc: 'Manuscripts must be written in clear, formal English.' },
                { title: 'Originality', desc: 'Work must be original and not published or under review elsewhere.' },
                { title: 'Ethics', desc: 'Authors are responsible for ethical compliance. Human/animal studies must include approval statements.' },
              ].map(g => (
                <div key={g.title} style={{ borderTop: '3px solid #F5C400', paddingTop: 16 }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 8, color: '#1B5E20' }}>{g.title}</h4>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

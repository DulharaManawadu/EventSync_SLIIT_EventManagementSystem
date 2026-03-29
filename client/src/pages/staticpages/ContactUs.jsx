import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Header';
import Footer from '../Footer';

export default function ContactUs() {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleFAQ = (faqId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Add entrance animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe FAQ categories
    document.querySelectorAll('.faq-category').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>EventSync - Contact page</title>
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Contact EventSync</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>We're here to support SLIIT students and event organizers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="map">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div id="map">
                <iframe
                  src="https://www.google.com/maps?q=SLIIT+Malabe&output=embed"
                  width="100%"
                  height="450px"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '5px', position: 'relative', zIndex: 2 }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="col-lg-10 offset-lg-1">
              <div className="row">

                <div className="col-lg-4">
                  <div className="info-item">
                    <i className="fa fa-envelope" />
                    <h4>Email Address</h4>
                    <a href="#">eventsync@sliit.lk</a>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="info-item">
                    <i className="fa fa-phone" />
                    <h4>Support Hotline</h4>
                    <a href="#">+94 11 754 4801</a>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="info-item">
                    <i className="fa fa-map-marked-alt" />
                    <h4>Location</h4>
                    <a href="#">
                      SLIIT Malabe Campus, New Kandy Road, Malabe
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Premium FAQ Section */}
      <section className="premium-faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <div className="faq-badge">Frequently Asked Questions</div>
            <h2 className="faq-title">Everything You Need to Know</h2>
            <p className="faq-subtitle">
              Find quick answers to common questions about event registration, approvals, scheduling, and technical support.
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-category">
              <div className="category-icon"></div>
              <h3>Getting Started</h3>
              <div className="faq-items">
                <div className="faq-item" data-faq-id="1">
                  <div className="faq-question" onClick={() => toggleFAQ(1)}>
                    <span>How do I register for an event?</span>
                    <div className="faq-toggle">
                      <span className={`toggle-icon ${expandedItems.has(1) ? 'expanded' : ''}`}>
                        {expandedItems.has(1) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  <div className={`faq-answer ${expandedItems.has(1) ? 'expanded' : ''}`}>
                    <p>You can register by visiting the Events page, selecting your preferred event, and completing the registration process online. The process takes just a few minutes and you'll receive instant confirmation.</p>
                  </div>
                </div>

                <div className="faq-item" data-faq-id="2">
                  <div className="faq-question" onClick={() => toggleFAQ(2)}>
                    <span>Will I receive confirmation after registering?</span>
                    <div className="faq-toggle">
                      <span className={`toggle-icon ${expandedItems.has(2) ? 'expanded' : ''}`}>
                        {expandedItems.has(2) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  <div className={`faq-answer ${expandedItems.has(2) ? 'expanded' : ''}`}>
                    <p>Yes, a confirmation message or email will be sent once your registration has been submitted successfully. You'll also receive reminders as the event date approaches.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <div className="category-icon"></div>
              <h3>Event Management</h3>
              <div className="faq-items">
                <div className="faq-item" data-faq-id="3">
                  <div className="faq-question" onClick={() => toggleFAQ(3)}>
                    <span>How long does event approval take?</span>
                    <div className="faq-toggle">
                      <span className={`toggle-icon ${expandedItems.has(3) ? 'expanded' : ''}`}>
                        {expandedItems.has(3) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  <div className={`faq-answer ${expandedItems.has(3) ? 'expanded' : ''}`}>
                    <p>Event approvals are usually reviewed within 1–2 working days, depending on the type of request and required documentation. You'll receive email notifications about the status.</p>
                  </div>
                </div>

                <div className="faq-item" data-faq-id="4">
                  <div className="faq-question" onClick={() => toggleFAQ(4)}>
                    <span>Can I edit my event details after submission?</span>
                    <div className="faq-toggle">
                      <span className={`toggle-icon ${expandedItems.has(4) ? 'expanded' : ''}`}>
                        {expandedItems.has(4) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  <div className={`faq-answer ${expandedItems.has(4) ? 'expanded' : ''}`}>
                    <p>Yes, depending on the event status. If the request is still under review, you may update certain details before final approval. Once approved, some changes may require re-approval.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <div className="category-icon"></div>
              <h3>Technical Support</h3>
              <div className="faq-items">
                <div className="faq-item" data-faq-id="5">
                  <div className="faq-question" onClick={() => toggleFAQ(5)}>
                    <span>What should I do if I face technical issues?</span>
                    <div className="faq-toggle">
                      <span className={`toggle-icon ${expandedItems.has(5) ? 'expanded' : ''}`}>
                        {expandedItems.has(5) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  <div className={`faq-answer ${expandedItems.has(5) ? 'expanded' : ''}`}>
                    <p>You can contact the support team through the hotline or email shown on this page. Include screenshots or error details for faster assistance. Our team typically responds within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="faq-footer">
            <div className="faq-help-card">
              <div className="help-icon"></div>
              <div className="help-content">
                <h4>Still have questions?</h4>
                <p>Can't find what you're looking for? Our support team is here to help.</p>
                <div className="help-actions">
                  <button className="help-btn primary">Contact Support</button>
                  <button className="help-btn secondary">Browse Help Center</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<Footer />
      
      {/* FAQ Styles */}
      <style jsx>{`
        .premium-faq-section {
          padding: 80px 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.04) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e8f0fe 50%, #f0f9ff 100%);
          position: relative;
          overflow: hidden;
        }

        .premium-faq-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
          animation: meshGradient 20s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes meshGradient {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-20px, -20px) rotate(1deg); }
          50% { transform: translate(20px, -10px) rotate(-1deg); }
          75% { transform: translate(-10px, 20px) rotate(2deg); }
        }

        .faq-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .faq-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .faq-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .faq-badge:hover::before {
          left: 100%;
        }

        .faq-title {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 20px;
          line-height: 1.2;
          background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .faq-subtitle {
          font-size: 18px;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .faq-category {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          padding: 30px;
          box-shadow: 
            0 10px 30px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .faq-category::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .faq-category:hover::before {
          opacity: 1;
        }

        .faq-category:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .category-icon {
          font-size: 32px;
          margin-bottom: 16px;
          display: block;
        }

        .faq-category h3 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .faq-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.6);
          border-radius: 16px;
          overflow: hidden;
          transition: 0.3s ease;
        }

        .faq-item:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .faq-question {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: #0f172a;
          transition: 0.3s ease;
          position: relative;
        }

        .faq-question:hover {
          color: #2563eb;
        }

        .faq-toggle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s ease;
          flex-shrink: 0;
        }

        .faq-item:hover .faq-toggle {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: #fff;
          transform: rotate(90deg);
        }

        .toggle-icon {
          font-size: 18px;
          font-weight: 700;
          transition: 0.3s ease;
        }

        .toggle-icon.expanded {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-answer.expanded {
          max-height: 200px;
        }

        .faq-answer p {
          padding: 0 20px 20px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .faq-footer {
          margin-top: 60px;
        }

        .faq-help-card {
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 30px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .faq-help-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          transform: rotate(45deg);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .help-icon {
          font-size: 48px;
          flex-shrink: 0;
        }

        .help-content h4 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .help-content p {
          margin-bottom: 24px;
          opacity: 0.9;
        }

        .help-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .help-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .help-btn.primary {
          background: #fff;
          color: #2563eb;
        }

        .help-btn.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .help-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .faq-category {
            padding: 20px;
          }

          .faq-help-card {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }

          .help-actions {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
        
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    // Initialize accordion functionality
    const setupAccordions = () => {
      const accordions = document.querySelectorAll('.accordion');
      
      accordions.forEach((accordion) => {
        const head = accordion.querySelector('.accordion-head');
        if (head) {
          head.addEventListener('click', function(e) {
            e.preventDefault();
            const isActive = accordion.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion').forEach((acc) => {
              acc.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
              accordion.classList.add('active');
            }
          });
        }
      });

      // Set first accordion as active by default
      const firstAccordion = document.querySelector('.accordion');
      if (firstAccordion && !firstAccordion.classList.contains('active')) {
        firstAccordion.classList.add('active');
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(setupAccordions, 100);
  }, []);

  return (
    <>
      <Helmet>
        <title>EventSync - About page</title>
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>About EventSync</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>Your complete event management solution for SLIIT.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <section className="top-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="left-image">
                <img src="/assets/images/about-left-image.jpeg" alt="" />
              </div>
            </div>
            <div className="col-lg-6 align-self-center">
              <div className="accordions is-first-expanded">

                <article className="accordion">
                  <div className="accordion-head">
                    <span>Smart Event Creation</span>
                    <span className="icon">
                      <i className="icon fa fa-chevron-right" />
                    </span>
                  </div>
                  <div className="accordion-body">
                    <div className="content">
                      <p>
                        EventSync enables SLIIT students and organizers to create and manage events effortlessly.
                        <br />
                        <br />
                        From workshops and seminars to club activities and competitions, our system simplifies event publishing, approvals, and scheduling.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="accordion">
                  <div className="accordion-head">
                    <span>Real-Time Event Management</span>
                    <span className="icon">
                      <i className="icon fa fa-chevron-right" />
                    </span>
                  </div>
                  <div className="accordion-body">
                    <div className="content">
                      <p>
                        Our platform provides real-time updates on event registrations, approvals, and participant tracking.
                        <br />
                        <br />
                        Admins can monitor event performance while organizers manage attendees with complete transparency.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="accordion">
                  <div className="accordion-head">
                    <span>Analytics & Reporting</span>
                    <span className="icon">
                      <i className="icon fa fa-chevron-right" />
                    </span>
                  </div>
                  <div className="accordion-body">
                    <div className="content">
                      <p>
                        EventSync includes visual analytics dashboards with charts and reports to evaluate event categories, approvals, and participation rates.
                        <br />
                        <br />
                        This helps improve future planning and ensures better decision-making for student organizations.
                      </p>
                    </div>
                  </div>
                </article>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="simple-cta">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <h4>
                Manage <em>Campus Events</em> with <strong>Efficiency & Innovation</strong>
              </h4>
            </div>
            <div className="col-lg-7">
              <div className="buttons">
                <div className="green-button">
                  <a href="#">Explore Events</a>
                </div>
                <div className="orange-button">
                  <a href="#">Create Event</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="what-we-do">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="left-content">
                <h4>How EventSync Works</h4>
                <p>
                  EventSync streamlines the complete event lifecycle at SLIIT. From idea submission to final reporting, everything is managed within one centralized system.
                  <br />
                  <br />
                  We ensure secure access for students, organizers, and administrators with role-based management and efficient workflows.
                </p>
                <div className="green-button">
                  <Link to="/contact">Get Started</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="right-items">
                <div className="row">

                  <div className="col-lg-6">
                    <div className="item">
                      <em>01</em>
                      <h4>Submit Event Proposal</h4>
                      <p>Organizers submit event details including date, venue, and category.</p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="item">
                      <em>02</em>
                      <h4>Admin Review & Approval</h4>
                      <p>Administrators review submissions and approve or reject events.</p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="item">
                      <em>03</em>
                      <h4>Event Registration</h4>
                      <p>Students browse and register for approved events easily.</p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="item">
                      <em>04</em>
                      <h4>Monitor & Analyze</h4>
                      <p>Track participation, generate reports, and analyze performance.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '60px 0 30px',
        marginTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>
        
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div style={{marginBottom: '20px'}}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '20px'
                  }}>📅</span>
                  EventSync
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  Transforming campus event management with smart QR analytics, seamless registration, and comprehensive approval workflows.
                </p>
              </div>
              
              <div style={{display: 'flex', gap: '12px', marginTop: '25px'}}>
                {['📧', '📱', '💬', '🌐'].map((icon, index) => (
                  <div key={index} style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '18px'
                  }} onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-3px)';
                  }} onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Quick Links
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                {['Create Event', 'Browse Events', 'Dashboard', 'Analytics'].map((link, index) => (
                  <li key={index} style={{marginBottom: '12px'}}>
                    <a href="#" style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }} onMouseOver={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateX(5px)';
                    }} onMouseOut={(e) => {
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}>
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Features
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                {['QR Check-in System', 'Real-time Analytics', 'Multi-venue Support', 'Sponsorship Management'].map((feature, index) => (
                  <li key={index} style={{marginBottom: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{
                        color: '#4ade80',
                        marginRight: '8px',
                        fontSize: '12px'
                      }}>✓</span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px'
                      }}>{feature}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Contact Info
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: '1.8'}}>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>📍</span>
                  <span>SLIIT Campus, Malabe</span>
                </div>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>📞</span>
                  <span>+94 11 123 4567</span>
                </div>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>✉️</span>
                  <span>info@eventsync.sliit.lk</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>🕐</span>
                  <span>Mon-Fri: 9AM-6PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '40px',
            paddingTop: '30px',
            textAlign: 'center'
          }}>
            <div className="row">
              <div className="col-lg-12">
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  © 2026 EventSync – Campus Event Management & QR Analytics Platform. All Rights Reserved.
                  <br />
                  <span style={{color: 'rgba(255, 255, 255, 0.4)'}}>
                    Developed for SLIIT Academic Project | Designed for Smart Campus Event Operations | 
                    <span style={{color: '#4ade80'}}> ❤️ </span> Made with passion by SLIIT Students
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

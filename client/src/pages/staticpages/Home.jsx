import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Header';
import Footer from '../Footer';
import { Link } from 'react-router-dom';
import slide01 from '../../assets/images/slide-01.jpg';
import slide02 from '../../assets/images/slide-02.jpg';
import slide03 from '../../assets/images/slide-03.jpg';
import calcImg from '../../assets/images/calculator-image.png';
import test01 from '../../assets/images/testimonials-01.jpg';
import test02 from '../../assets/images/testimonials-02.jpg';
import test03 from '../../assets/images/testimonial-03.jpeg';
import '../../assets/css/testimonials-fix.css';

export default function Home() {
  useEffect(() => {
    // Wait for Swiper library to be available
    const initSwiper = () => {
      if (!window.Swiper) {
        // Library not loaded yet, try again
        setTimeout(initSwiper, 100);
        return;
      }

      const interleaveOffset = 0.5;
      const swiperOptions = {
        loop: true,
        speed: 1000,
        grabCursor: true,
        watchSlidesProgress: true,
        mousewheelControl: true,
        keyboardControl: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          progress: function () {
            const swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
              const slideProgress = swiper.slides[i].progress;
              const innerOffset = swiper.width * interleaveOffset;
              const innerTranslate = slideProgress * innerOffset;
              const slideInner = swiper.slides[i].querySelector('.slide-inner');
              if (slideInner) {
                slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
              }
            }
          },
          touchStart: function () {
            const swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = '';
            }
          },
          setTransition: function (speed) {
            const swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = speed + 'ms';
              const slideInner = swiper.slides[i].querySelector('.slide-inner');
              if (slideInner) {
                slideInner.style.transition = speed + 'ms';
              }
            }
          }
        }
      };

      try {
        new window.Swiper('.swiper-container', swiperOptions);
        console.log('Swiper initialized successfully');
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSwiper);
    } else {
      initSwiper();
    }

    // Testimonials section now uses static cards with animations, no carousel needed

    if (window.jQuery) {
      try {
        window.jQuery('.menu div').on('click', function () {
          window.jQuery('.menu div').removeClass('active');
          window.jQuery(this).addClass('active');

          const tabIndex = window.jQuery(this).index();
          window.jQuery('.nacc li').removeClass('active');
          window.jQuery('.nacc li').eq(tabIndex).addClass('active');
        });
        console.log('Tabs initialized');
      } catch (error) {
        console.error('Error initializing tabs:', error);
      }
    }

    return () => {
      if (document.readyState === 'loading') {
        document.removeEventListener('DOMContentLoaded', initSwiper);
      }
    };
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>EventSync - Campus Event Management Platform</title>
        <meta
          name="description"
          content="EventSync - SLIIT Campus Event Management & QR Analytics Platform"
        />
      </Helmet>

      <Header />

      {/* ***** Main Banner Area Start ***** */}
      <div className="swiper-container" id="top">
        <div className="swiper-wrapper">
          {/* ===== SLIDE 1 : Event Lifecycle Management ===== */}
          <div className="swiper-slide">
            <div
              className="slide-inner"
              style={{ backgroundImage: `url(${slide01})` }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="header-text">
                      <h2>
                        Manage <em>Campus Events</em>
                        <br />
                        &amp; Simplify <em>Approvals & Planning</em>
                      </h2>
                      <div className="div-dec" />
                      <p>
                        EventSync is a Campus Event Management & Sponsorship Platform designed for
                        SLIIT. Organizers can create, edit, and submit events for approval while
                        administrators control the full event lifecycle.
                      </p>
                      <div className="buttons">
                        <div className="green-button">
                          <Link to="/create-event">Create Event</Link>
                        </div>
                        <div className="orange-button">
                          <Link to="/admin-dashboard">Admin Approval Panel</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SLIDE 2 : Registration & Sponsorship ===== */}
          <div className="swiper-slide">
            <div
              className="slide-inner"
              style={{ backgroundImage: `url(${slide02})` }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="header-text">
                      <h2>
                        <em>Register</em> for Events
                        <br />
                        &amp; Connect with <em>Sponsors</em>
                      </h2>
                      <div className="div-dec" />
                      <p>
                        Students can browse approved events and register securely with enforced
                        capacity limits and duplicate prevention. Sponsors can explore upcoming
                        events, apply for Gold, Silver, or Bronze sponsorship tiers, and
                        collaborate directly with organizers to support successful campus
                        experiences.
                      </p>
                      <div className="buttons">
                        <div className="green-button">
                          <Link to="/events">Browse Events</Link>
                        </div>
                        <div className="orange-button">
                          <Link to="/sponsorship">Become a Sponsor</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SLIDE 3 : QR & Analytics ===== */}
          <div className="swiper-slide">
            <div
              className="slide-inner"
              style={{ backgroundImage: `url(${slide03})` }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="header-text">
                      <h2>
                        Smart <em>QR Check-In</em>
                        <br />
                        &amp; Event <em>Analytics Dashboard</em>
                      </h2>
                      <div className="div-dec" />
                      <p>
                        Every registration generates a secure QR token linked to the event and
                        user. Organizers can activate check-in mode and scan QR codes to validate
                        attendance in real-time. After event completion, the analytics dashboard
                        displays total registrations, attendance rate, no-show count, capacity
                        utilization, and check-in timeline insights for data-driven decision
                        making.
                      </p>
                      <div className="buttons">
                        <div className="green-button">
                          <Link to="/qr-checkin">Activate Check-In</Link>
                        </div>
                        <div className="orange-button">
                          <Link to="/analytics">View Analytics</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="swiper-button-next swiper-button-white" />
        <div className="swiper-button-prev swiper-button-white" />
      </div>
      {/* ***** Main Banner Area End ***** */}

      <section className="services" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-archive" />
                <h4>Event Lifecycle Management</h4>
                <p>
                  EventSync allows organizers to create, edit, and submit campus events while
                  administrators manage approvals through Draft, Pending, Approved, and Completed
                  stages.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-cloud" />
                <h4>Secure Event Registration</h4>
                <p>
                  Students can browse approved events and register securely with automated capacity
                  limits and duplicate registration prevention.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-charging-station" />
                <h4>Real-Time QR Check-In</h4>
                <p>
                  Each registration generates a secure QR code for attendance validation.
                  Organizers can activate check-in mode and scan participants efficiently.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-suitcase" />
                <h4>Sponsorship Management</h4>
                <p>
                  Sponsors can explore upcoming events, apply for sponsorship packages, and
                  collaborate directly with organizers to support successful campus events.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-archway" />
                <h4>Admin Control & Monitoring</h4>
                <p>
                  Administrators can monitor event approvals, track cancellations, manage users,
                  and ensure structured campus event operations.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-item">
                <i className="fas fa-puzzle-piece" />
                <h4>Analytics & Reporting Dashboard</h4>
                <p>
                  The analytics dashboard provides insights including total registrations,
                  attendance rate, no-shows, and capacity utilization for data-driven decisions.
                </p>
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
                Smart <em>Campus Event Management</em> for <strong>SLIIT</strong>
              </h4>
            </div>
            <div className="col-lg-7">
              <div className="buttons">
                <div className="green-button">
                  <a href="#services">Explore Events</a>
                </div>
                <div className="orange-button">
                  <a href="#about">Get Started Today</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us" id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>About EventSync</h6>
                <h4>Campus Event Management Platform</h4>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="naccs">
                <div className="tabs">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="menu">
                        <div className="active gradient-border">
                          <span>Event Lifecycle</span>
                        </div>
                        <div className="gradient-border">
                          <span>Registration & Sponsorship</span>
                        </div>
                        <div className="gradient-border">
                          <span>QR & Analytics</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <ul className="nacc">
                        <li className="active">
                          <div>
                            <div className="main-list">
                              <span className="title">Feature</span>
                              <span className="title">Access</span>
                              <span className="title">Validation Rule</span>
                              <span className="title">Status Flow</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Create Event</span>
                              <span className="item">Organizer Only</span>
                              <span className="item">Future Date Required</span>
                              <span className="item">Draft</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Submit for Approval</span>
                              <span className="item">Organizer</span>
                              <span className="item">Complete Details Needed</span>
                              <span className="item">Pending</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Approve / Reject Event</span>
                              <span className="item">Admin Only</span>
                              <span className="item">Reason Required if Rejected</span>
                              <span className="item">Approved / Rejected</span>
                            </div>
                            <div className="list-item last-item">
                              <span className="item item-title">Event Completion</span>
                              <span className="item">System Controlled</span>
                              <span className="item">After Event Date</span>
                              <span className="item">Completed / Cancelled</span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div>
                            <div className="main-list">
                              <span className="title">Feature</span>
                              <span className="title">User Role</span>
                              <span className="title">System Rule</span>
                              <span className="title">Outcome</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Browse Events</span>
                              <span className="item">Students</span>
                              <span className="item">Only Approved Events Visible</span>
                              <span className="item">View Details</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Register for Event</span>
                              <span className="item">Students</span>
                              <span className="item">No Duplicate Registration</span>
                              <span className="item">Unique Registration ID</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Sponsorship Application</span>
                              <span className="item">Sponsors</span>
                              <span className="item">Select Gold/Silver/Bronze</span>
                              <span className="item">Await Organizer Approval</span>
                            </div>
                            <div className="list-item last-item">
                              <span className="item item-title">Capacity Control</span>
                              <span className="item">System Enforced</span>
                              <span className="item">Stops at Max Limit</span>
                              <span className="item">Registration Closed</span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div>
                            <div className="main-list">
                              <span className="title">Feature</span>
                              <span className="title">Security</span>
                              <span className="title">Access</span>
                              <span className="title">Insight</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">QR Code Generation</span>
                              <span className="item">Secure Token Linked</span>
                              <span className="item">Registered Users Only</span>
                              <span className="item">One QR Per User</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">QR Check-In Validation</span>
                              <span className="item">Prevents Duplicate Entry</span>
                              <span className="item">Organizer Mode Active</span>
                              <span className="item">Timestamp Stored</span>
                            </div>
                            <div className="list-item">
                              <span className="item item-title">Attendance Analytics</span>
                              <span className="item">Organizer/Admin Only</span>
                              <span className="item">Auto Calculated</span>
                              <span className="item">Attendance Rate %</span>
                            </div>
                            <div className="list-item last-item">
                              <span className="item item-title">Performance Dashboard</span>
                              <span className="item">After Event Completion</span>
                              <span className="item">Read-Only Data</span>
                              <span className="item">Capacity Utilization</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="right-content">
                <h4>Transforming Campus Events at SLIIT</h4>
                <p>
                  EventSync is designed to streamline campus event management by integrating event
                  lifecycle control, smart registration, sponsorship coordination, and secure
                  QR-based attendance tracking.
                  <br />
                  <br />
                  Our goal is to provide a structured, transparent, and analytics-driven system
                  that improves efficiency, prevents conflicts, and enhances student participation.
                </p>
                <div className="green-button">
                  <a href="#">Explore Platform Features</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="calculator">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="left-image">
                <img
                  src={calcImg}
                  alt="EventSync Support"
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div
                style={{
                  background: 'rgba(10, 20, 45, 0.78)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '35px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                }}
              >
                <div className="section-heading" style={{ marginBottom: '20px' }}>
                  <h6 style={{ color: '#ff6b35', marginBottom: '10px' }}>
                    EventSync Support
                  </h6>
                  <h4
                    style={{
                      color: '#ffffff',
                      fontSize: 'clamp(30px, 4vw, 52px)',
                      lineHeight: '1.15',
                      fontWeight: '700',
                      marginBottom: '20px'
                    }}
                  >
                    Making Campus Event Management Easier
                  </h4>
                </div>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '16px',
                    lineHeight: '1.9',
                    marginBottom: '24px'
                  }}
                >
                  EventSync helps students, clubs, and university organizers manage
                  campus events through a smooth and organized digital platform. From
                  event creation to approval workflows, the system simplifies every
                  step of planning and coordination.
                </p>

                <div style={{ marginBottom: '22px' }}>
                  <h6
                    style={{
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '12px'
                    }}
                  >
                    What EventSync Supports
                  </h6>

                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      paddingLeft: '20px',
                      marginBottom: 0,
                      lineHeight: '2'
                    }}
                  >
                    <li>Event creation and submission</li>
                    <li>Approval and review management</li>
                    <li>Venue coordination</li>
                    <li>Sponsorship planning</li>
                    <li>Registration and attendance tracking</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h6
                    style={{
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '12px'
                    }}
                  >
                    Why Use EventSync
                  </h6>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.88)',
                      fontSize: '15px',
                      lineHeight: '1.8',
                      marginBottom: 0
                    }}
                  >
                    With a centralized dashboard, EventSync improves communication
                    between students and administrators while making events easier to
                    review, schedule, and manage efficiently.
                  </p>
                </div>

                <a href="/events" className="orange-button">
                  Explore Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials" style={{
        background: '#ffffff',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center mb-5">
                <h6 style={{
                  color: '#2c3e50',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}>User Feedback</h6>
                <h4 style={{
                  color: '#2c3e50',
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  What Our Users Say
                  <span style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: '#ff6b35',
                    borderRadius: '2px'
                  }}></span>
                </h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                height: '100%',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="quote-icon" style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: '#ff6b35',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '18px',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }}>
                  <i className="fa fa-quote-left" />
                </div>

                <p style={{
                  color: '#000000',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  marginTop: '10px'
                }}>
                  "EventSync has completely streamlined our event approval process. Managing Draft, Pending, and Approved stages is now structured and transparent. It has reduced confusion between organizers and admins."
                </p>

                <div className="testimonial-author" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: 'auto'
                }}>
                  <div className="author-image" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #ff6b35',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
                  }}>
                    <img
                      src={test02}
                      alt="Faculty Coordinator"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="author-info">
                    <h5 style={{
                      color: '#000000',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px',
                      margin: '0'
                    }}>Faculty Event Coordinator</h5>
                    <span style={{
                      color: '#ff6b35',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>SLIIT Administration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                height: '100%',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="quote-icon" style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: '#ff6b35',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '18px',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }}>
                  <i className="fa fa-quote-left" />
                </div>

                <p style={{
                  color: '#000000',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  marginTop: '10px'
                }}>
                  "The QR-based attendance system is fast and secure. It prevents duplicate entries and automatically tracks participation data. The analytics dashboard gives us clear insights after every event."
                </p>

                <div className="testimonial-author" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: 'auto'
                }}>
                  <div className="author-image" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #ff6b35',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
                  }}>
                    <img
                      src={test03}
                      alt="Student Organizer"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="author-info">
                    <h5 style={{
                      color: '#000000',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px',
                      margin: '0'
                    }}>Student Organizer</h5>
                    <span style={{
                      color: '#ff6b35',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>IEEE Student Branch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                height: '100%',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="quote-icon" style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: '#ff6b35',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '18px',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }}>
                  <i className="fa fa-quote-left" />
                </div>

                <p style={{
                  color: '#000000',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  marginTop: '10px'
                }}>
                  "Registration is simple and efficient. I can easily browse approved events, register without duplication issues, and access my QR code instantly. It makes campus participation more organized."
                </p>

                <div className="testimonial-author" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: 'auto'
                }}>
                  <div className="author-image" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #ff6b35',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
                  }}>
                    <img
                      src={test01}
                      alt="Student"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="author-info">
                    <h5 style={{
                      color: '#000000',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px',
                      margin: '0'
                    }}>Undergraduate Student</h5>
                    <span style={{
                      color: '#ff6b35',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>SLIIT Participant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="testimonial-bg-elements" style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <div className="floating-element" style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div className="floating-element" style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite 2s'
          }}></div>
          <div className="floating-element" style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animation: 'float 7s ease-in-out infinite 1s'
          }}></div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .testimonial-card:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15) !important;
        }
        
        .testimonial-card:hover .author-image img {
          transform: scale(1.1) !important;
        }
        
        .testimonial-card:hover .quote-icon {
          transform: rotate(360deg) !important;
          transition: transform 0.6s ease !important;
        }
      `}</style>

      <Footer />
    </Fragment>
  );
}
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

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

    const initOwlCarousel = () => {
      if (window.jQuery && window.jQuery.fn.owlCarousel) {
        try {
          window.jQuery('.owl-testimonials').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 6000,
            dots: true,
            nav: false
          });
          console.log('OWL Carousel initialized');
        } catch (error) {
          console.error('Error initializing OWL Carousel:', error);
        }
      }
    };

    setTimeout(initOwlCarousel, 500);

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
    <>
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
              style={{ backgroundImage: 'url(/assets/images/slide-01.jpg)' }}
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
                        administrators control the full event lifecycle from Draft → Pending →
                        Approved → Completed. Only approved events become visible to students,
                        ensuring structured campus activities.
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
              style={{ backgroundImage: 'url(/assets/images/slide-02.jpg)' }}
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
              style={{ backgroundImage: 'url(/assets/images/slide-03.jpg)' }}
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
          <div className="row">
            <div className="col-lg-7">
              <div className="left-image">
                <img src="/assets/images/calculator-image.png" alt="" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="section-heading">
                <h6>EventSync Support</h6>
                <h4>Request Event Approval or Support</h4>
              </div>
              <form id="calculate" action="" method="get">
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your full name"
                        autoComplete="on"
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="email">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        pattern="[^ @]*@[^ @]*"
                        placeholder="Enter your SLIIT email"
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="subject">Event Title / Subject</label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Enter event title or request subject"
                        autoComplete="on"
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="chooseOption" className="form-label">
                        Request Type
                      </label>
                      <select
                        name="Category"
                        className="form-select"
                        aria-label="Default select example"
                        id="chooseOption"
                      >
                        <option value="">Choose Request Type</option>
                        <option value="Event Creation">Event Creation</option>
                        <option value="Event Approval">Event Approval</option>
                        <option value="Venue Booking">Venue Booking</option>
                        <option value="Sponsorship Application">Sponsorship Application</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className="orange-button">
                        Submit Request
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>User Feedback</h6>
                <h4>What Our Users Say</h4>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1">
              <div
                className="owl-testimonials owl-carousel"
                style={{ position: 'relative', zIndex: 5 }}
              >
                <div className="item">
                  <i className="fa fa-quote-left" />
                  <p>
                    "EventSync has completely streamlined our event approval process. Managing
                    Draft, Pending, and Approved stages is now structured and transparent. It has
                    reduced confusion between organizers and admins."
                  </p>
                  <h4>Faculty Event Coordinator</h4>
                  <span>SLIIT Administration</span>
                  <div className="right-image">
                    <img
                      src="/assets/images/testimonials-02.jpg"
                      alt="Faculty Coordinator"
                    />
                  </div>
                </div>

                <div className="item">
                  <i className="fa fa-quote-left" />
                  <p>
                    "The QR-based attendance system is fast and secure. It prevents duplicate
                    entries and automatically tracks participation data. The analytics dashboard
                    gives us clear insights after every event."
                  </p>
                  <h4>Student Organizer</h4>
                  <span>IEEE Student Branch</span>
                  <div className="right-image">
                    <img
                      src="/assets/images/testimonial-03.jpeg"
                      alt="Student Organizer"
                    />
                  </div>
                </div>

                <div className="item">
                  <i className="fa fa-quote-left" />
                  <p>
                    "Registration is simple and efficient. I can easily browse approved events,
                    register without duplication issues, and access my QR code instantly. It makes
                    campus participation more organized."
                  </p>
                  <h4>Undergraduate Student</h4>
                  <span>SLIIT Participant</span>
                  <div className="right-image">
                    <img src="/assets/images/testimonials-01.jpg" alt="Student" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
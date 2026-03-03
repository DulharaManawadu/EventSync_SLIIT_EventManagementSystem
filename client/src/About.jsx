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
                <p>Your complete event management solution for SLIIT.</p>
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
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p>
                © 2026 EventSync – Campus Event Management & QR Analytics Platform. All Rights Reserved.
                <br />
                Developed for SLIIT Academic Project | Designed for Smart Campus Event Operations
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

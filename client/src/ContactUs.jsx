import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';

export default function ContactUs() {
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
                <p>We’re here to support SLIIT students and event organizers.</p>
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

      {/* Contact Form */}
      <section className="contact-us-form">
        <div className="container">
          <div className="row">

            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>Get in Touch</h6>
                <h4>Have Questions About an Event?</h4>
              </div>
            </div>

            <div className="col-lg-10 offset-lg-1">
              <form id="contact" action="" method="post">
                <div className="row">

                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="name"
                        name="name"
                        id="name"
                        placeholder="Your Full Name..."
                        autoComplete="on"
                        required
                      />
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="phone"
                        name="phone"
                        id="phone"
                        placeholder="Your Contact Number..."
                        autoComplete="on"
                        required
                      />
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        pattern="[^ @]*@[^ @]*"
                        placeholder="Your SLIIT Email..."
                        required
                      />
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        type="subject"
                        name="subject"
                        id="subject"
                        placeholder="Event Related Subject..."
                        autoComplete="on"
                      />
                    </fieldset>
                  </div>

                  <div className="col-lg-12">
                    <fieldset>
                      <textarea
                        name="message"
                        id="message"
                        placeholder="Write your message regarding event registration, approvals, scheduling, or technical support..."
                      ></textarea>
                    </fieldset>
                  </div>

                  <div className="col-lg-12 text-center">
                    <fieldset>
                      <button type="submit" id="form-submit" className="orange-button">
                        Submit Inquiry
                      </button>
                    </fieldset>
                  </div>

                </div>
              </form>
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

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

export default function OurServices() {
  useEffect(() => {
    // Initialize tabs functionality
    const menuItems = document.querySelectorAll('.menu div');
    const tabItems = document.querySelectorAll('.nacc li');

    menuItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Remove active class from all menu items and tabs
        menuItems.forEach((m) => m.classList.remove('active'));
        tabItems.forEach((t) => t.classList.remove('active'));

        // Add active class to clicked menu item and corresponding tab
        item.classList.add('active');
        if (tabItems[index]) {
          tabItems[index].classList.add('active');
        }
      });
    });
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          name="description"
          content="EventSync - SLIIT Campus Event Management & QR Analytics Platform"
        />
        <meta name="author" content="SLIIT EventSync Team" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>EventSync - Our Services</title>

        {/* Bootstrap core CSS */}
        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

        {/* Additional CSS Files */}
        <link rel="stylesheet" href="assets/css/fontawesome.css" />
        <link rel="stylesheet" href="assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="assets/css/owl.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
        
        {/* Fix service details alignment */}
        <style>{`
          section.service-details ul.nacc li {
            display: none !important;
            position: relative !important;
            opacity: 0 !important;
            transform: translateX(50px) !important;
            margin-bottom: 40px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 25px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          }
          
          section.service-details ul.nacc li.active {
            display: block !important;
            position: relative !important;
            opacity: 1 !important;
            transform: translateX(0) !important;
            margin-bottom: 40px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 25px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
          }
          
          section.service-details ul.nacc li .row {
            display: flex !important;
            align-items: flex-start !important;
            gap: 30px !important;
            padding: 20px !important;
          }
          
          section.service-details ul.nacc li .left-image {
            position: relative !important;
            margin-right: 0 !important;
            margin-bottom: 0 !important;
            top: 0 !important;
            transform: translateY(0) !important;
            width: 100% !important;
            text-align: center !important;
            flex: 0 0 45% !important;
            display: block !important;
          }
          
          section.service-details ul.nacc li .left-image img {
            border-radius: 15px !important;
            width: 100% !important;
            height: 250px !important;
            max-height: 250px !important;
            object-fit: cover !important;
            transition: all 0.4s ease !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            display: block !important;
            margin: 0 auto !important;
          }
          
          section.service-details ul.nacc li .right-content {
            padding: 20px !important;
            margin-left: 0 !important;
            position: relative !important;
            flex: 1 !important;
          }
          
          section.service-details ul.nacc li .right-content h4 {
            margin-right: 0 !important;
            font-size: 22px !important;
            line-height: 1.4 !important;
            margin-bottom: 15px !important;
          }
          
          section.service-details ul.nacc li .right-content p {
            margin-bottom: 20px !important;
            font-size: 15px !important;
            line-height: 1.6 !important;
          }
          
          section.service-details ul.nacc li .right-content span {
            display: block !important;
            margin-bottom: 8px !important;
            font-size: 14px !important;
            color: #43ba7f !important;
          }
          
          /* Hide all non-active tabs by default */
          section.service-details ul.nacc li:not(.active) {
            display: none !important;
          }
          
          /* Show active tab */
          section.service-details ul.nacc li.active {
            display: block !important;
          }
          
          /* Override layout with stronger flexbox */
          section.service-details ul.nacc li .row {
            display: flex !important;
            align-items: stretch !important;
            gap: 40px !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          section.service-details ul.nacc li .left-image {
            position: relative !important;
            margin: 0 !important;
            width: 45% !important;
            text-align: center !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          section.service-details ul.nacc li .left-image img {
            border-radius: 15px !important;
            width: 100% !important;
            height: 280px !important;
            object-fit: cover !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          }
          
          section.service-details ul.nacc li .right-content {
            width: 50% !important;
            margin: 0 !important;
            padding: 20px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          
          section.service-details ul.nacc li .right-content h4 {
            margin: 0 0 15px 0 !important;
            font-size: 20px !important;
            line-height: 1.3 !important;
            text-align: left !important;
          }
          
          section.service-details ul.nacc li .right-content p {
            margin: 0 0 15px 0 !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            text-align: left !important;
          }
          
          section.service-details ul.nacc li .right-content span {
            display: block !important;
            margin: 0 0 5px 0 !important;
            font-size: 13px !important;
            color: #43ba7f !important;
            text-align: left !important;
          }
          
          /* Advanced animations */
          @keyframes slideInFromLeft {
            0% {
              opacity: 0;
              transform: translateX(-50px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInFromRight {
            0% {
              opacity: 0;
              transform: translateX(50px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          /* Enhanced animations for service items */
          section.service-details ul.nacc li {
            animation: fadeInUp 0.8s ease-out;
          }
          
          section.service-details ul.nacc li .left-image {
            animation: slideInFromLeft 0.8s ease-out;
          }
          
          section.service-details ul.nacc li .left-image img {
            transition: all 0.4s ease;
          }
          
          section.service-details ul.nacc li .left-image:hover img {
            transform: scale(1.05);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          }
          
          section.service-details ul.nacc li .right-content {
            animation: slideInFromRight 0.8s ease-out;
          }
          
          section.service-details ul.nacc li .right-content h4 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
          }
          
          section.service-details ul.nacc li .right-content h4::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #43ba7f, #ff511a);
            border-radius: 2px;
            animation: pulse 2s infinite;
          }
          
          section.service-details ul.nacc li .right-content span {
            position: relative;
            padding-left: 20px;
            transition: all 0.3s ease;
          }
          
          section.service-details ul.nacc li .right-content span::before {
            content: '✓';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #43ba7f, #667eea);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(67, 186, 127, 0.3);
          }
          
          section.service-details ul.nacc li .right-content span:hover {
            transform: translateX(10px);
            color: #ff511a;
          }
        `}</style>
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Our Services</h2>
                <div className="div-dec" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <section className="main-services">
        <div className="container">
          <div className="row">

            <div className="col-lg-12">
              <div className="service-item">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="left-image">
                      <img src="assets/images/service-image-01.jpeg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-center">
                    <div className="right-text-content">
                      <i className="fas fa-calendar-check" />
                      <h4>Event Creation & Management</h4>
                      <p>
                        EventSync enables SLIIT clubs and academic departments to easily create, manage, approve, and publish campus events. From workshops to hackathons, the platform streamlines the entire event lifecycle with a centralized dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="service-item">
                <div className="row">
                  <div className="col-lg-6 align-self-center">
                    <div className="left-text-content">
                      <i className="fas fa-qrcode" />
                      <h4>QR-Based Attendance Tracking</h4>
                      <p>
                        Generate secure QR codes for each event to track real-time attendance. Students can scan and register instantly while organizers access automated participant reports without manual paperwork.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-image">
                      <img src="assets/images/service-image-02.jpg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="service-item last-service">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="left-image">
                      <img src="assets/images/service-image-03.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-center">
                    <div className="right-text-content">
                      <i className="fas fa-chart-line" />
                      <h4>Event Analytics & Insights</h4>
                      <p>
                        Analyze event performance with powerful visual dashboards including participation statistics, approval trends, category breakdowns, and organizer activity reports for data-driven campus decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="simple-cta">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <h4>
                Smart <em>Campus Events</em> with <strong>Real-Time Analytics</strong>
              </h4>
            </div>
            <div className="col-lg-7">
              <div className="buttons">
                <div className="green-button">
                  <a href="#">Explore Features</a>
                </div>
                <div className="orange-button">
                  <a href="#">Get Started</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="service-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>Platform Highlights</h6>
                <h4>Upgrade Your Event Experience</h4>
              </div>
            </div>

            <div className="col-lg-10 offset-lg-1">
              <div className="naccs">
                <div className="tabs">
                  <div className="row">

                    <div className="col-lg-12">
                      <div className="menu">
                        <div className="active gradient-border">
                          <span>Event Workflow</span>
                        </div>
                        <div className="gradient-border">
                          <span>Attendance Tracking</span>
                        </div>
                        <div className="gradient-border">
                          <span>Analytics Dashboard</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <ul className="nacc">

                        <li className="active">
                          <div style={{display: 'flex', gap: '40px', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                            <div style={{flex: '0 0 45%'}}>
                              <img src="/assets/images/service-image-01.jpeg" alt="" style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px'}} />
                            </div>
                            <div style={{flex: '1', padding: '10px 0'}}>
                              <h4 style={{fontSize: '20px', marginBottom: '15px', color: '#2d3748'}}>Streamlined Event Approval Process</h4>
                              <p style={{fontSize: '14px', lineHeight: '1.5', marginBottom: '15px', color: '#4a5568'}}>
                                Organizers submit event proposals digitally. Admins review, approve, or request modifications. Only approved events are published, ensuring transparency and structured campus management.
                              </p>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Digital event submissions</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Admin approval system</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '0', color: '#43ba7f'}}>- Automated publishing</span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div style={{display: 'flex', gap: '40px', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                            <div style={{flex: '0 0 45%'}}>
                              <img src="/assets/images/service-details-02.jpg" alt="" style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px'}} />
                            </div>
                            <div style={{flex: '1', padding: '10px 0'}}>
                              <h4 style={{fontSize: '20px', marginBottom: '15px', color: '#2d3748'}}>Real-Time QR Attendance System</h4>
                              <p style={{fontSize: '14px', lineHeight: '1.5', marginBottom: '15px', color: '#4a5568'}}>
                                Secure QR codes allow instant check-ins while preventing duplicate registrations. Attendance reports are automatically generated for organizers and administrators.
                              </p>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Unique QR per event</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Instant scan registration</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '0', color: '#43ba7f'}}>- Automated attendance reports</span>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div style={{display: 'flex', gap: '40px', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                            <div style={{flex: '0 0 45%'}}>
                              <img src="/assets/images/service-image-03.jpg" alt="" style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px'}} />
                            </div>
                            <div style={{flex: '1', padding: '10px 0'}}>
                              <h4 style={{fontSize: '20px', marginBottom: '15px', color: '#2d3748'}}>Advanced Analytics & Reporting</h4>
                              <p style={{fontSize: '14px', lineHeight: '1.5', marginBottom: '15px', color: '#4a5568'}}>
                                Monitor event statistics through visual dashboards such as bar charts, pie charts, and line graphs to track engagement, approvals, cancellations, and organizer performance.
                              </p>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Category-based analytics</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '5px', color: '#43ba7f'}}>- Participation insights</span>
                              <span style={{display: 'block', fontSize: '13px', marginBottom: '0', color: '#43ba7f'}}>- Performance tracking reports</span>
                            </div>
                          </div>
                        </li>

                      </ul>
                    </div>

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

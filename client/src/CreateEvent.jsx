import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    eventType: 'Physical',
    faculty: 'Computing',
    department: '',
    venue: '',
    date: '',
    endDate: '',
    capacity: '',
    organizerEmail: '',
    sponsorshipEnabled: false,
    goldTier: '',
    goldBenefits: '',
    silverTier: '',
    silverBenefits: '',
    bronzeTier: '',
    bronzeBenefits: '',
    budget: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.date) {
      setError('Title and date are required');
      return;
    }

    setLoading(true);
    try {
      // Build sponsorship tiers array if sponsorship is enabled
      let sponsorshipTiers = [];
      if (form.sponsorshipEnabled) {
        if (form.goldTier && form.goldBenefits) {
          sponsorshipTiers.push({
            tierName: 'Gold',
            price: parseFloat(form.goldTier),
            benefits: form.goldBenefits
          });
        }
        if (form.silverTier && form.silverBenefits) {
          sponsorshipTiers.push({
            tierName: 'Silver',
            price: parseFloat(form.silverTier),
            benefits: form.silverBenefits
          });
        }
        if (form.bronzeTier && form.bronzeBenefits) {
          sponsorshipTiers.push({
            tierName: 'Bronze',
            price: parseFloat(form.bronzeTier),
            benefits: form.bronzeBenefits
          });
        }
      }

      const body = {
        title: form.title,
        description: form.description,
        category: form.category,
        eventType: form.eventType,
        faculty: form.faculty,
        department: form.department,
        venue: form.venue,
        date: form.date,
        endDate: form.endDate,
        capacity: parseInt(form.capacity || '0', 10),
        organizer: 'Web UI',
        organizerEmail: form.organizerEmail,
        sponsorshipEnabled: form.sponsorshipEnabled,
        sponsorshipTiers: sponsorshipTiers,
        budget: parseFloat(form.budget || '0'),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
      };

      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create event');
      }
      
      const created = await res.json();
      setLoading(false);
      navigate('/events');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          name="description"
          content="EventSync - Create New Campus Event"
        />
        <meta name="author" content="SLIIT EventSync Team" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>EventSync - Create Event</title>

        {/* Bootstrap core CSS */}
        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

        {/* Additional CSS Files */}
        <link rel="stylesheet" href="assets/css/fontawesome.css" />
        <link rel="stylesheet" href="assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="assets/css/owl.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Create New Event</h2>
                <div className="div-dec"></div>
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>Organize and manage your campus events with our streamlined approval system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h4>Event Details</h4>
                <div className="line-dec"></div>
                <p>Please fill in all the required information to create your event</p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="row">
              <div className="col-lg-12">
                <div className="alert alert-danger" role="alert">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-lg-12">
              <form id="contact" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Event Title..."
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="venue"
                        type="text"
                        id="venue"
                        placeholder="Event Venue..."
                        value={form.venue}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <select
                        name="category"
                        id="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="form-control"
                        style={{height: '50px', border: 'none', borderBottom: '2px solid #eee', borderRadius: '0'}}
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Competition">Competition</option>
                        <option value="Conference">Conference</option>
                        <option value="Other">Other</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <select
                        name="eventType"
                        id="eventType"
                        value={form.eventType}
                        onChange={handleChange}
                        className="form-control"
                        style={{height: '50px', border: 'none', borderBottom: '2px solid #eee', borderRadius: '0'}}
                      >
                        <option value="Physical">Physical Event</option>
                        <option value="Virtual">Virtual Event</option>
                        <option value="Hybrid">Hybrid Event</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <select
                        name="faculty"
                        id="faculty"
                        value={form.faculty}
                        onChange={handleChange}
                        required
                        className="form-control"
                        style={{height: '50px', border: 'none', borderBottom: '2px solid #eee', borderRadius: '0'}}
                      >
                        <option value="">Select Faculty</option>
                        <option value="Computing">Computing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Science">Science</option>
                        <option value="Other">Other</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="department"
                        type="text"
                        id="department"
                        placeholder="Department (Optional)..."
                        value={form.department}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="date" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748'}}>Start Date & Time *</label>
                      <input
                        name="date"
                        type="datetime-local"
                        id="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        style={{width: '100%', height: '55px', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '0px 20px', fontSize: '16px', outline: 'none', marginBottom: '25px', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="endDate" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748'}}>End Date & Time (Optional)</label>
                      <input
                        name="endDate"
                        type="datetime-local"
                        id="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        style={{width: '100%', height: '55px', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '0px 20px', fontSize: '16px', outline: 'none', marginBottom: '25px', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="capacity"
                        type="number"
                        id="capacity"
                        placeholder="Event Capacity..."
                        value={form.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="organizerEmail"
                        type="email"
                        id="organizerEmail"
                        placeholder="Organizer Email (Optional)..."
                        value={form.organizerEmail}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="budget"
                        type="number"
                        id="budget"
                        placeholder="Budget (LKR)..."
                        value={form.budget}
                        onChange={handleChange}
                        min="0"
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="tags"
                        type="text"
                        id="tags"
                        placeholder="Tags (comma-separated)..."
                        value={form.tags}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Event Description..."
                        value={form.description}
                        onChange={handleChange}
                        rows="6"
                      ></textarea>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="sponsorshipEnabled"
                          id="sponsorshipEnabled"
                          checked={form.sponsorshipEnabled}
                          onChange={handleChange}
                          className="form-check-input me-2"
                        />
                        <label htmlFor="sponsorshipEnabled" className="form-check-label">
                          Enable Sponsorship Options
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  
                  {form.sponsorshipEnabled && (
                    <>
                      <div className="col-lg-12">
                        <fieldset>
                          <h5 style={{color: '#2d3748', marginBottom: '20px'}}>Sponsorship Tiers</h5>
                          <p style={{color: '#718096', marginBottom: '25px'}}>Configure sponsorship packages for your event</p>
                        </fieldset>
                      </div>
                      
                      <div className="col-lg-4">
                        <fieldset>
                          <label htmlFor="goldTier" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748'}}>Gold Tier</label>
                          <input
                            name="goldTier"
                            type="number"
                            id="goldTier"
                            placeholder="Price (LKR)"
                            value={form.goldTier || ''}
                            onChange={handleChange}
                            style={{width: '100%', height: '55px', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '0px 20px', fontSize: '16px', outline: 'none', marginBottom: '15px', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          />
                          <textarea
                            name="goldBenefits"
                            placeholder="Gold tier benefits..."
                            value={form.goldBenefits || ''}
                            onChange={handleChange}
                            rows="3"
                            style={{width: '100%', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '15px', fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          ></textarea>
                        </fieldset>
                      </div>
                      
                      <div className="col-lg-4">
                        <fieldset>
                          <label htmlFor="silverTier" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748'}}>Silver Tier</label>
                          <input
                            name="silverTier"
                            type="number"
                            id="silverTier"
                            placeholder="Price (LKR)"
                            value={form.silverTier || ''}
                            onChange={handleChange}
                            style={{width: '100%', height: '55px', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '0px 20px', fontSize: '16px', outline: 'none', marginBottom: '15px', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          />
                          <textarea
                            name="silverBenefits"
                            placeholder="Silver tier benefits..."
                            value={form.silverBenefits || ''}
                            onChange={handleChange}
                            rows="3"
                            style={{width: '100%', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '15px', fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          ></textarea>
                        </fieldset>
                      </div>
                      
                      <div className="col-lg-4">
                        <fieldset>
                          <label htmlFor="bronzeTier" style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748'}}>Bronze Tier</label>
                          <input
                            name="bronzeTier"
                            type="number"
                            id="bronzeTier"
                            placeholder="Price (LKR)"
                            value={form.bronzeTier || ''}
                            onChange={handleChange}
                            style={{width: '100%', height: '55px', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '0px 20px', fontSize: '16px', outline: 'none', marginBottom: '15px', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          />
                          <textarea
                            name="bronzeBenefits"
                            placeholder="Bronze tier benefits..."
                            value={form.bronzeBenefits || ''}
                            onChange={handleChange}
                            rows="3"
                            style={{width: '100%', background: 'rgba(247, 247, 247, 0.8)', color: '#2d3748', borderRadius: '15px', border: '2px solid transparent', padding: '15px', fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'}}
                          ></textarea>
                        </fieldset>
                      </div>
                    </>
                  )}
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className="orange-button">
                        {loading ? 'Creating Event...' : 'Create Event'}
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

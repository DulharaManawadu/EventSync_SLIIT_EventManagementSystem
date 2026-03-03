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
                <p>Organize and manage your campus events with our streamlined approval system</p>
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
                      <input
                        name="date"
                        type="datetime-local"
                        id="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input
                        name="endDate"
                        type="datetime-local"
                        id="endDate"
                        placeholder="End Date (Optional)..."
                        value={form.endDate}
                        onChange={handleChange}
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

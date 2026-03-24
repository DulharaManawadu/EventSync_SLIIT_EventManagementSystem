import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

const API_BASE = 'http://localhost:5000/api/events';

const categoryOptions = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Competition',
  'Conference',
  'Other'
];

const facultyOptions = [
  'Computing',
  'Engineering',
  'Business',
  'Architecture',
  'Hospitality',
  'Science',
  'Other'
];

const eventTypeOptions = ['Physical', 'Virtual', 'Hybrid'];

const formatDate = (dateValue) => {
  if (!dateValue) return 'Date TBD';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Date TBD';
  return date.toLocaleDateString();
};

const formatTime = (dateValue) => {
  if (!dateValue) return 'Time TBD';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Time TBD';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-success';
    case 'Pending':
      return 'bg-warning text-dark';
    case 'Rejected':
      return 'bg-danger';
    case 'Completed':
      return 'bg-info text-dark';
    case 'Cancelled':
      return 'bg-secondary';
    case 'Draft':
    default:
      return 'bg-dark';
  }
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const approvedCount = useMemo(
    () => events.filter((e) => e.status === 'Approved').length,
    [events]
  );
  const pendingCount = useMemo(
    () => events.filter((e) => e.status === 'Pending').length,
    [events]
  );
  const rejectedCount = useMemo(
    () => events.filter((e) => e.status === 'Rejected').length,
    [events]
  );

  const clearMessagesLater = () => {
    setTimeout(() => setError(''), 3000);
    setTimeout(() => setSuccess(''), 3000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);

      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await res.json();
      setEvents(Array.isArray(data?.data) ? data.data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateCount = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/${action}`, {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${action}`);
      }

      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === id ? data.data : e))
      );

      const actionText =
        action === 'register' ? 'registered for' : 'checked in to';
      setSuccess(`Successfully ${actionText} the event!`);
      setError('');
      clearMessagesLater();
    } catch (err) {
      setError(err.message || 'Action failed');
      setSuccess('');
      clearMessagesLater();
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEditForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage =
          result.errors?.join(', ') ||
          result.message ||
          'Failed to update event';
        throw new Error(errorMessage);
      }

      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === editingEvent._id ? result.data : e))
      );

      setShowEditForm(false);
      setEditingEvent(null);
      setError('');
      setSuccess('Event updated successfully!');
      clearMessagesLater();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update event');
      setSuccess('');
      clearMessagesLater();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }

      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== id));
      setSuccess('Event deleted successfully!');
      setError('');
      clearMessagesLater();
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      setSuccess('');
      clearMessagesLater();
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Loading events...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!Array.isArray(events)) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>
          Error: Events data is not properly formatted
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="EventSync - Campus Events Management"
        />
        <meta name="author" content="SLIIT EventSync Team" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>EventSync - Events Management</title>

        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="assets/css/fontawesome.css" />
        <link rel="stylesheet" href="assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="assets/css/owl.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
        />

        <style>{`
          @keyframes slideInRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .service-item {
            min-height: 100%;
            display: flex;
            flex-direction: column;
          }

          .service-item .right-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .service-item .action-row {
            margin-top: auto;
          }

          .orange-button {
            background: linear-gradient(135deg, #ff511a 0%, #ff8c42 100%) !important;
            border: none !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 25px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            display: inline-block !important;
          }

          .orange-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 81, 26, 0.3);
          }

          .orange-button:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
          }

          .form-control {
            border-radius: 8px !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px !important;
            font-size: 14px !important;
          }

          .form-control:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          }

          .form-label {
            font-weight: 600 !important;
            color: #374151 !important;
            margin-bottom: 8px !important;
          }
        `}</style>
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Events Management</h2>
                <div className="div-dec"></div>
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginTop: '15px'
                  }}
                >
                  Manage and monitor all campus events with real-time updates and
                  analytics
                </p>
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
                <h4>Events Dashboard</h4>
                <div className="line-dec"></div>
                <p>View, manage, and track all campus events in one place</p>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="badge bg-primary me-2">Total: {events.length}</span>
                  <span className="badge bg-success me-2">
                    Approved: {approvedCount}
                  </span>
                  <span className="badge bg-warning text-dark me-2">
                    Pending: {pendingCount}
                  </span>
                  <span className="badge bg-danger">Rejected: {rejectedCount}</span>
                </div>
                <a href="/create-event" className="orange-button">
                  Create New Event
                </a>
              </div>
            </div>
          </div>

          {error && (
            <ToastMessage
              type="error"
              title="Error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          {success && (
            <ToastMessage
              type="success"
              title="Success"
              message={success}
              onClose={() => setSuccess('')}
            />
          )}

          {showEditForm && editingEvent && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Event: {editingEvent.title}</h5>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingEvent(null);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <EventEditForm
                      event={editingEvent}
                      onUpdate={handleUpdate}
                      onCancel={() => {
                        setShowEditForm(false);
                        setEditingEvent(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                {events.length === 0 ? (
                  <div className="col-lg-12">
                    <div className="alert alert-info text-center">
                      No events available yet.
                    </div>
                  </div>
                ) : (
                  events.map((evt) => (
                    <div key={evt._id} className="col-lg-6 mb-4">
                      <div
                        className="service-item"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '25px',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.4s ease',
                          overflow: 'hidden'
                        }}
                      >
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="right-content" style={{ padding: '25px' }}>
                              <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                                <h4
                                  style={{
                                    fontSize: '22px',
                                    fontWeight: '700',
                                    marginBottom: 0,
                                    background:
                                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}
                                >
                                  {evt.title}
                                </h4>

                                <span
                                  className={`badge ${getStatusBadgeClass(evt.status)}`}
                                  style={{
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {evt.status || 'Unknown'}
                                </span>
                              </div>

                              {evt.description && (
                                <p
                                  style={{
                                    color: '#4a5568',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                  }}
                                >
                                  {evt.description}
                                </p>
                              )}

                              <div className="row mb-3">
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-calendar me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {formatDate(evt.date)}
                                  </div>
                                </div>
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-clock me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {formatTime(evt.date)}
                                    {evt.endDate ? ` - ${formatTime(evt.endDate)}` : ''}
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-map-marker-alt me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.venue || 'Venue TBD'}
                                  </div>
                                </div>
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-university me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.faculty || 'Faculty TBD'}
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-tag me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.category || 'General'}
                                  </div>
                                </div>
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-network-wired me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.eventType || 'Physical'}
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-sm-4 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-users me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.capacity ? `${evt.capacity} seats` : 'Unlimited'}
                                  </div>
                                </div>
                                <div className="col-sm-4 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-user-check me-2"
                                      style={{ color: '#43ba7f' }}
                                    ></i>
                                    {evt.registrationCount || 0} registered
                                  </div>
                                </div>
                                <div className="col-sm-4 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-clipboard-check me-2"
                                      style={{ color: '#43ba7f' }}
                                    ></i>
                                    {evt.attendanceCount || 0} attended
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-user me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.organizerName || evt.organizer || 'Organizer TBD'}
                                  </div>
                                </div>
                                <div className="col-sm-6 mb-2">
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      color: '#6b7280',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <i
                                      className="fas fa-users-cog me-2"
                                      style={{ color: '#667eea' }}
                                    ></i>
                                    {evt.societyName || 'Society TBD'}
                                  </div>
                                </div>
                              </div>

                              {evt.phoneNumbers?.length > 0 && (
                                <div className="mb-3" style={{ color: '#6b7280', fontSize: '13px' }}>
                                  <i
                                    className="fas fa-phone me-2"
                                    style={{ color: '#667eea' }}
                                  ></i>
                                  {evt.phoneNumbers.join(', ')}
                                </div>
                              )}

                              {evt.tags && evt.tags.length > 0 && (
                                <div className="mb-3">
                                  {evt.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-light text-dark me-1"
                                      style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        borderRadius: '12px'
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {evt.tags.length > 3 && (
                                    <span
                                      className="badge bg-light text-dark"
                                      style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        borderRadius: '12px'
                                      }}
                                    >
                                      +{evt.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              {evt.sponsorshipEnabled &&
                                Array.isArray(evt.sponsorshipTiers) &&
                                evt.sponsorshipTiers.length > 0 && (
                                  <div className="mb-3">
                                    <div
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                      }}
                                    >
                                      Sponsorship Tiers
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                      {evt.sponsorshipTiers.map((tier, index) => (
                                        <span
                                          key={index}
                                          className="badge bg-light text-dark"
                                          style={{
                                            fontSize: '11px',
                                            padding: '6px 10px',
                                            borderRadius: '12px'
                                          }}
                                        >
                                          {tier.tierName}: LKR {tier.price}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              <div className="d-flex gap-2 mt-3 flex-wrap action-row">
                                <button
                                  className="orange-button"
                                  onClick={() => updateCount(evt._id, 'register')}
                                >
                                  <i className="fas fa-user-plus me-1"></i> Register
                                </button>

                                <button
                                  className="orange-button"
                                  onClick={() => updateCount(evt._id, 'checkin')}
                                >
                                  <i className="fas fa-check-circle me-1"></i> Check-In
                                </button>

                                <button
                                  className="orange-button"
                                  onClick={() => handleEdit(evt)}
                                >
                                  <i className="fas fa-edit me-1"></i> Edit
                                </button>

                                <button
                                  className="orange-button"
                                  onClick={() => handleDelete(evt._id)}
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                                  }}
                                >
                                  <i className="fas fa-trash me-1"></i> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function ToastMessage({ type, title, message, onClose }) {
  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        animation: 'slideInRight 0.5s ease-out'
      }}
    >
      <div
        style={{
          background: isError
            ? 'linear-gradient(135deg, #ff511a 0%, #ff8c42 100%)'
            : 'linear-gradient(135deg, #43ba7f 0%, #667eea 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px',
          boxShadow: isError
            ? '0 10px 30px rgba(255, 81, 26, 0.3)'
            : '0 10px 30px rgba(67, 186, 127, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <i
          className={`fas ${
            isError ? 'fa-exclamation-triangle' : 'fa-check-circle'
          }`}
          style={{ fontSize: '20px' }}
        ></i>
        <div style={{ flex: 1 }}>
          <strong
            style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}
          >
            {title}
          </strong>
          <span style={{ fontSize: '13px', opacity: 0.9 }}>{message}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: 0.7,
            padding: 0,
            width: '20px',
            height: '20px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function EventEditForm({ event, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || 'Technical',
    eventType: event.eventType || 'Physical',
    faculty: event.faculty || 'Computing',
    department: event.department || '',
    venue: event.venue || '',
    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    capacity: event.capacity || '',
    organizerName: event.organizerName || event.organizer || '',
    organizerEmail: event.organizerEmail || '',
    phoneNumbers: Array.isArray(event.phoneNumbers)
      ? event.phoneNumbers.join(', ')
      : '',
    societyName: event.societyName || '',
    budget: event.budget || '',
    tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
    sponsorshipEnabled: !!event.sponsorshipEnabled,
    goldTier:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Gold')?.price || '',
    goldBenefits:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Gold')?.benefits || '',
    silverTier:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Silver')?.price || '',
    silverBenefits:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Silver')?.benefits || '',
    bronzeTier:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Bronze')?.price || '',
    bronzeBenefits:
      event.sponsorshipTiers?.find((t) => t.tierName === 'Bronze')?.benefits || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sponsorshipEnabled') {
      setFormData((prev) => ({
        ...prev,
        sponsorshipEnabled: checked,
        ...(checked
          ? {}
          : {
              goldTier: '',
              goldBenefits: '',
              silverTier: '',
              silverBenefits: '',
              bronzeTier: '',
              bronzeBenefits: ''
            })
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.capacity || Number(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }
    if (!formData.societyName.trim()) {
      newErrors.societyName = 'Society name is required';
    }
    if (!formData.phoneNumbers.trim()) {
      newErrors.phoneNumbers = 'At least one phone number is required';
    }

    if (formData.organizerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.organizerEmail.trim())) {
        newErrors.organizerEmail = 'Invalid email address';
      }
    }

    if (formData.endDate && formData.date) {
      const start = new Date(formData.date);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.sponsorshipEnabled) {
      const hasAnyTier =
        formData.goldTier ||
        formData.goldBenefits ||
        formData.silverTier ||
        formData.silverBenefits ||
        formData.bronzeTier ||
        formData.bronzeBenefits;

      if (!hasAnyTier) {
        newErrors.sponsorshipEnabled = 'Fill at least one sponsorship tier';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      window.alert(
        `Please fix the following issues:\n\n• ${Object.values(formErrors).join(
          '\n• '
        )}`
      );
      return;
    }

    const sponsorshipTiers = [];

    if (formData.sponsorshipEnabled) {
      if (formData.goldTier && formData.goldBenefits.trim()) {
        sponsorshipTiers.push({
          tierName: 'Gold',
          price: Number(formData.goldTier),
          benefits: formData.goldBenefits.trim()
        });
      }

      if (formData.silverTier && formData.silverBenefits.trim()) {
        sponsorshipTiers.push({
          tierName: 'Silver',
          price: Number(formData.silverTier),
          benefits: formData.silverBenefits.trim()
        });
      }

      if (formData.bronzeTier && formData.bronzeBenefits.trim()) {
        sponsorshipTiers.push({
          tierName: 'Bronze',
          price: Number(formData.bronzeTier),
          benefits: formData.bronzeBenefits.trim()
        });
      }
    }

    onUpdate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      eventType: formData.eventType,
      faculty: formData.faculty,
      department: formData.department.trim(),
      venue: formData.venue.trim(),
      date: formData.date,
      endDate: formData.endDate || undefined,
      capacity: Number(formData.capacity),
      organizerName: formData.organizerName.trim(),
      organizer: formData.organizerName.trim(),
      organizerEmail: formData.organizerEmail.trim(),
      phoneNumbers: formData.phoneNumbers
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      societyName: formData.societyName.trim(),
      budget: formData.budget === '' ? 0 : Number(formData.budget),
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      sponsorshipEnabled: formData.sponsorshipEnabled,
      sponsorshipTiers
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <small className="text-danger">{errors.title}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
            {errors.description && (
              <small className="text-danger">{errors.description}</small>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Date</label>
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <small className="text-danger">{errors.date}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">End Date</label>
            <input
              type="datetime-local"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <small className="text-danger">{errors.endDate}</small>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
            {errors.venue && <small className="text-danger">{errors.venue}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Faculty</label>
            <select
              className="form-control"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
            >
              {facultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Event Type</label>
            <select
              className="form-control"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
            >
              {eventTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
            {errors.capacity && (
              <small className="text-danger">{errors.capacity}</small>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Budget (LKR)</label>
            <input
              type="number"
              className="form-control"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Organizer Name</label>
            <input
              type="text"
              className="form-control"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleChange}
              required
            />
            {errors.organizerName && (
              <small className="text-danger">{errors.organizerName}</small>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Organizer Email</label>
            <input
              type="email"
              className="form-control"
              name="organizerEmail"
              value={formData.organizerEmail}
              onChange={handleChange}
            />
            {errors.organizerEmail && (
              <small className="text-danger">{errors.organizerEmail}</small>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Phone Numbers</label>
            <input
              type="text"
              className="form-control"
              name="phoneNumbers"
              value={formData.phoneNumbers}
              onChange={handleChange}
              placeholder="Comma-separated phone numbers"
              required
            />
            {errors.phoneNumbers && (
              <small className="text-danger">{errors.phoneNumbers}</small>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Society Name</label>
            <input
              type="text"
              className="form-control"
              name="societyName"
              value={formData.societyName}
              onChange={handleChange}
              required
            />
            {errors.societyName && (
              <small className="text-danger">{errors.societyName}</small>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group mb-3">
            <label className="form-label">Tags</label>
            <input
              type="text"
              className="form-control"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma-separated tags"
            />
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <div
            style={{
              background: '#f8fafc',
              border: errors.sponsorshipEnabled
                ? '1px solid #ef4444'
                : '1px solid #dbe4ee',
              borderRadius: '16px',
              padding: '18px 20px'
            }}
          >
            <label
              htmlFor="sponsorshipEnabled"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: 0,
                cursor: 'pointer',
                fontWeight: '600',
                color: '#2d3748',
                fontSize: '16px'
              }}
            >
              <input
                type="checkbox"
                name="sponsorshipEnabled"
                id="sponsorshipEnabled"
                checked={formData.sponsorshipEnabled}
                onChange={handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  minWidth: '18px',
                  margin: 0,
                  padding: 0,
                  accentColor: '#ff6b35',
                  cursor: 'pointer',
                  appearance: 'auto',
                  WebkitAppearance: 'checkbox',
                  MozAppearance: 'checkbox',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent'
                }}
              />
              Enable Sponsorship Registration
            </label>
            {errors.sponsorshipEnabled && (
              <small className="text-danger d-block mt-2">
                {errors.sponsorshipEnabled}
              </small>
            )}
          </div>
        </div>
      </div>

      {formData.sponsorshipEnabled && (
        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Gold Tier Price</label>
              <input
                type="number"
                className="form-control"
                name="goldTier"
                value={formData.goldTier}
                onChange={handleChange}
              />
              <textarea
                className="form-control mt-2"
                name="goldBenefits"
                value={formData.goldBenefits}
                onChange={handleChange}
                rows="3"
                placeholder="Gold benefits"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Silver Tier Price</label>
              <input
                type="number"
                className="form-control"
                name="silverTier"
                value={formData.silverTier}
                onChange={handleChange}
              />
              <textarea
                className="form-control mt-2"
                name="silverBenefits"
                value={formData.silverBenefits}
                onChange={handleChange}
                rows="3"
                placeholder="Silver benefits"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Bronze Tier Price</label>
              <input
                type="number"
                className="form-control"
                name="bronzeTier"
                value={formData.bronzeTier}
                onChange={handleChange}
              />
              <textarea
                className="form-control mt-2"
                name="bronzeBenefits"
                value={formData.bronzeBenefits}
                onChange={handleChange}
                rows="3"
                placeholder="Bronze benefits"
              />
            </div>
          </div>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap">
        <button type="submit" className="orange-button">
          <i className="fas fa-save me-1"></i> Save Changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="fas fa-times me-1"></i> Cancel
        </button>
      </div>
    </form>
  );
}
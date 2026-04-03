import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode';
import Header from '../Header';
import Footer from '../Footer';
import { getCurrentUser, getAuthToken } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/events';
const REGISTRATION_API_BASE = 'http://localhost:5000/api/event-registrations';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState({});
  const [qrModalData, setQrModalData] = useState(null);
  const currentUser = useMemo(() => getCurrentUser(), []);

  const approvedCount = useMemo(
    () => events.filter((e) => e.status === 'Approved').length,
    [events]
  );

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((e) => {
        const searchable = `${e.title || ''} ${e.description || ''} ${e.category || ''} ${e.faculty || ''} ${e.venue || ''} ${e.organizerName || e.organizer || ''}`.toLowerCase();
        return searchable.includes(q);
      });
    }

    return filtered;
  }, [events, searchTerm, statusFilter]);
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

  const setEventFromResponse = (eventData) => {
    if (!eventData?._id) return;
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event._id === eventData._id ? eventData : event))
    );
  };

  const runStudentGuard = () => {
    const loggedUser = getCurrentUser();
    if (!loggedUser) {
      throw new Error('Log in first to use this feature');
    }

    if (loggedUser.userType !== 'Student') {
      throw new Error("Sorry, you don't have proper authorization for this feature");
    }

    return loggedUser;
  };

  const handleRegister = async (eventItem) => {
    try {
      runStudentGuard();

      if (eventItem.status !== 'Approved') {
        throw new Error('Registration is available only for approved events');
      }

      setActionLoading((prev) => ({ ...prev, [eventItem._id]: 'register' }));

      const res = await fetch(
        `${REGISTRATION_API_BASE}/events/${eventItem._id}/register`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }

      setEventFromResponse(data?.data?.event);
      setQrModalData({
        event: data?.data?.event || eventItem,
        registration: data?.data?.registration
      });
      setSuccess(
        data?.data?.alreadyRegistered
          ? 'You are already registered. Your QR code is ready to present to the admin.'
          : 'Registration successful. Your QR code is ready to present to the admin.'
      );
      setError('');
      clearMessagesLater();
    } catch (err) {
      setError(err.message || 'Registration failed');
      setSuccess('');
      clearMessagesLater();
    } finally {
      setActionLoading((prev) => ({ ...prev, [eventItem._id]: '' }));
    }
  };

  const handleCheckIn = async (eventItem) => {
    try {
      runStudentGuard();

      if (eventItem.status !== 'Approved') {
        throw new Error('Check-in is available only for approved events');
      }

      setActionLoading((prev) => ({ ...prev, [eventItem._id]: 'checkin' }));

      const res = await fetch(`${REGISTRATION_API_BASE}/events/${eventItem._id}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load your QR code');
      }

      setEventFromResponse(data?.data?.event);
      setQrModalData({
        event: data?.data?.event || eventItem,
        registration: data?.data?.registration
      });
      setSuccess('Show this QR code to the admin to confirm your attendance.');
      setError('');
      clearMessagesLater();
    } catch (err) {
      setError(err.message || 'Unable to open your event QR code');
      setSuccess('');
      clearMessagesLater();
    } finally {
      setActionLoading((prev) => ({ ...prev, [eventItem._id]: '' }));
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

            <div className="col-lg-12 mb-3">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title, organizer, venue..."
                  className="form-control"
                  style={{ minWidth: '240px', maxWidth: '360px' }}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: '220px' }}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                  filteredEvents.map((evt) => (
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
                                  onClick={() => handleRegister(evt)}
                                  disabled={
                                    !currentUser ||
                                    currentUser.userType !== 'Student' ||
                                    evt.status !== 'Approved' ||
                                    Boolean(actionLoading[evt._id])
                                  }
                                  style={{
                                    cursor:
                                      !currentUser ||
                                      currentUser.userType !== 'Student' ||
                                      evt.status !== 'Approved' ||
                                      Boolean(actionLoading[evt._id])
                                        ? 'not-allowed'
                                        : 'pointer',
                                    opacity:
                                      !currentUser ||
                                      currentUser.userType !== 'Student' ||
                                      evt.status !== 'Approved' ||
                                      Boolean(actionLoading[evt._id])
                                        ? 0.6
                                        : 1
                                  }}
                                >
                                  <i className="fas fa-user-plus me-1"></i>
                                  {actionLoading[evt._id] === 'register' ? ' Loading...' : ' Register'}
                                </button>

                                <button
                                  className="orange-button"
                                  onClick={() => handleCheckIn(evt)}
                                  disabled={
                                    !currentUser ||
                                    currentUser.userType !== 'Student' ||
                                    evt.status !== 'Approved' ||
                                    Boolean(actionLoading[evt._id])
                                  }
                                  style={{
                                    cursor:
                                      !currentUser ||
                                      currentUser.userType !== 'Student' ||
                                      evt.status !== 'Approved' ||
                                      Boolean(actionLoading[evt._id])
                                        ? 'not-allowed'
                                        : 'pointer',
                                    opacity:
                                      !currentUser ||
                                      currentUser.userType !== 'Student' ||
                                      evt.status !== 'Approved' ||
                                      Boolean(actionLoading[evt._id])
                                        ? 0.6
                                        : 1
                                  }}
                                >
                                  <i className="fas fa-check-circle me-1"></i>
                                  {actionLoading[evt._id] === 'checkin' ? ' Loading...' : ' Check-In'}
                                </button>
                              </div>
                              {currentUser?.userType === 'Student' && evt.status === 'Approved' && (
                                <p
                                  style={{
                                    marginTop: '10px',
                                    marginBottom: 0,
                                    fontSize: '12px',
                                    color: '#6b7280'
                                  }}
                                >
                                  Register once to generate your personal QR, then use Check-In to show it to the admin scanner.
                                </p>
                              )}
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

      {qrModalData && (
        <QrCodeModal
          event={qrModalData.event}
          registration={qrModalData.registration}
          onClose={() => setQrModalData(null)}
        />
      )}

      <Footer />
    </>
  );
}

function QrCodeModal({ event, registration, onClose }) {
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    let active = true;

    const generateQr = async () => {
      try {
        const url = await QRCode.toDataURL(registration?.qrToken || '', {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });

        if (active) {
          setQrImage(url);
        }
      } catch (err) {
        console.error('QR generation failed:', err);
        if (active) {
          setQrImage('');
        }
      }
    };

    generateQr();

    return () => {
      active = false;
    };
  }, [registration]);

  if (!registration) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>
                Student Event QR
              </div>
              <h3 style={{ margin: '8px 0 6px' }}>{event?.title || 'Registered Event'}</h3>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>
                Present this QR code to the admin scanner to confirm attendance.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '28px',
                lineHeight: 1,
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '20px',
              background: '#f8fafc',
              textAlign: 'center'
            }}
          >
            {qrImage ? (
              <img
                src={qrImage}
                alt={`QR code for ${event?.title || 'event'}`}
                style={{ width: '100%', maxWidth: '280px', borderRadius: '16px' }}
              />
            ) : (
              <p style={{ margin: '60px 0', color: '#64748b' }}>Preparing your QR code...</p>
            )}
          </div>

          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-sm-6 mb-3">
              <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                Student
              </div>
              <div style={{ color: '#0f172a', fontWeight: 600 }}>{registration.studentName}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{registration.studentUserId}</div>
            </div>
            <div className="col-sm-6 mb-3">
              <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                Attendance
              </div>
              <div style={{ color: '#0f172a', fontWeight: 600 }}>{registration.attendanceStatus}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Registered {formatDate(registration.registeredAt)} at {formatTime(registration.registeredAt)}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '6px',
              borderRadius: '16px',
              padding: '14px 16px',
              background: '#eff6ff',
              color: '#1e3a8a',
              fontSize: '13px'
            }}
          >
            This QR is unique to your account and this event. Attendance is confirmed only after an admin scans it successfully.
          </div>
        </div>
      </div>
    </div>
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


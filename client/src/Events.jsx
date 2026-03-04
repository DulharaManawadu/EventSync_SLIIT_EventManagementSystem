import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  

  const updateCount = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/${action}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      // Ensure events is an array before mapping
      setEvents(prevEvents => {
        const eventsArray = Array.isArray(prevEvents) ? prevEvents : [];
        return eventsArray.map(e => (e._id === id ? updated.data : e));
      });
      
      // Show success message
      const actionText = action === 'register' ? 'registered for' : 'checked in to';
      setSuccess(`Successfully ${actionText} the event!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEditForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      // Convert date string to Date object if present
      const dataToSend = {
        ...updatedData,
        date: updatedData.date ? new Date(updatedData.date) : undefined,
        capacity: parseInt(updatedData.capacity) || 0
      };
      
      const res = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update event');
      }
      
      const result = await res.json();
      
      setEvents(prevEvents => {
        const eventsArray = Array.isArray(prevEvents) ? prevEvents : [];
        return eventsArray.map(e => (e._id === editingEvent._id ? result.data : e));
      });
      
      setShowEditForm(false);
      setEditingEvent(null);
      setError(null); // Clear any previous errors
      setSuccess('Event updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete event');
      
      setEvents(prevEvents => {
        const eventsArray = Array.isArray(prevEvents) ? prevEvents : [];
        return eventsArray.filter(e => e._id !== id);
      });
      
      setSuccess('Event deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        return res.json();
      })
      .then(data => {
        // Extract events array from API response
        const eventsData = data && data.data ? data.data : [];
        setEvents(eventsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setError(err.message);
        setEvents([]); // Set to empty array on error
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  
  // Additional safety check
  if (!Array.isArray(events)) {
    console.error('Events is not an array:', events);
    return <p style={{ color: 'red' }}>Error: Events data is not properly formatted</p>;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
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

        {/* Bootstrap core CSS */}
        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

        {/* Additional CSS Files */}
        <link rel="stylesheet" href="assets/css/fontawesome.css" />
        <link rel="stylesheet" href="assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="assets/css/owl.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
        
        {/* Custom animations for alerts */}
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
          
          @keyframes slideOutRight {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(100%);
              opacity: 0;
            }
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
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>Manage and monitor all campus events with real-time updates and analytics</p>
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
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-primary me-2">Total: {events.length}</span>
                  <span className="badge bg-success me-2">Approved: {events.filter(e => e.status === 'Approved').length}</span>
                  <span className="badge bg-warning me-2">Pending: {events.filter(e => e.status === 'Pending').length}</span>
                  <span className="badge bg-danger">Rejected: {events.filter(e => e.status === 'Rejected').length}</span>
                </div>
                <a href="/create-event" className="orange-button">Create New Event</a>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="row">
              <div className="col-lg-12">
                <div style={{
                  position: 'fixed',
                  top: '20px',
                  right: '20px',
                  zIndex: '9999',
                  minWidth: '300px',
                  animation: 'slideInRight 0.5s ease-out'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ff511a 0%, #ff8c42 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(255, 81, 26, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <i className="fas fa-exclamation-triangle" style={{fontSize: '20px'}}></i>
                    <div style={{flex: 1}}>
                      <strong style={{fontSize: '14px', display: 'block', marginBottom: '2px'}}>Error</strong>
                      <span style={{fontSize: '13px', opacity: '0.9'}}>{error}</span>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        opacity: '0.7',
                        padding: '0',
                        width: '20px',
                        height: '20px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="row">
              <div className="col-lg-12">
                <div style={{
                  position: 'fixed',
                  top: '20px',
                  right: '20px',
                  zIndex: '9999',
                  minWidth: '300px',
                  animation: 'slideInRight 0.5s ease-out'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #43ba7f 0%, #667eea 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(67, 186, 127, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <i className="fas fa-check-circle" style={{fontSize: '20px'}}></i>
                    <div style={{flex: 1}}>
                      <strong style={{fontSize: '14px', display: 'block', marginBottom: '2px'}}>Success</strong>
                      <span style={{fontSize: '13px', opacity: '0.9'}}>{success}</span>
                    </div>
                    <button
                      onClick={() => setSuccess(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        opacity: '0.7',
                        padding: '0',
                        width: '20px',
                        height: '20px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {showEditForm && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Event: {editingEvent.title}</h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                      setShowEditForm(false);
                      setEditingEvent(null);
                    }}>
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
                {events.map(evt => (
                  <div key={evt._id} className="col-lg-6 mb-4">
                    <div className="service-item" style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '25px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.4s ease',
                      overflow: 'hidden'
                    }}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="right-content" style={{padding: '25px'}}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h4 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                marginBottom: '0',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>
                                {evt.title}
                              </h4>
                              <span className={`badge ${
                                evt.status === 'Approved' ? 'bg-success' : 
                                evt.status === 'Pending' ? 'bg-warning' : 
                                evt.status === 'Rejected' ? 'bg-danger' : 
                                evt.status === 'Completed' ? 'bg-info' : 'bg-secondary'
                              }`} style={{
                                fontSize: '12px',
                                padding: '6px 12px',
                                borderRadius: '20px'
                              }}>
                                {evt.status}
                              </span>
                            </div>
                            
                            {evt.description && (
                              <p style={{
                                color: '#4a5568',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                marginBottom: '20px'
                              }}>
                                {evt.description}
                              </p>
                            )}
                            
                            <div className="row mb-3">
                              <div className="col-sm-6 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-calendar me-2" style={{color: '#667eea'}}></i>
                                  {new Date(evt.date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="col-sm-6 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-clock me-2" style={{color: '#667eea'}}></i>
                                  {new Date(evt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                            </div>
                            
                            <div className="row mb-3">
                              <div className="col-sm-6 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-map-marker-alt me-2" style={{color: '#667eea'}}></i>
                                  {evt.venue || 'TBA'}
                                </div>
                              </div>
                              <div className="col-sm-6 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-university me-2" style={{color: '#667eea'}}></i>
                                  {evt.faculty}
                                </div>
                              </div>
                            </div>
                            
                            <div className="row mb-3">
                              <div className="col-sm-4 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-tag me-2" style={{color: '#667eea'}}></i>
                                  {evt.category}
                                </div>
                              </div>
                              <div className="col-sm-4 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-users me-2" style={{color: '#667eea'}}></i>
                                  {evt.capacity} seats
                                </div>
                              </div>
                              <div className="col-sm-4 mb-2">
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#6b7280',
                                  fontSize: '13px'
                                }}>
                                  <i className="fas fa-user-check me-2" style={{color: '#43ba7f'}}></i>
                                  {evt.registrationCount || 0} registered
                                </div>
                              </div>
                            </div>
                            
                            {evt.tags && evt.tags.length > 0 && (
                              <div className="mb-3">
                                {evt.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1" style={{
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    #{tag}
                                  </span>
                                ))}
                                {evt.tags.length > 3 && (
                                  <span className="badge bg-light text-dark" style={{
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    +{evt.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="orange-button"
                                onClick={() => updateCount(evt._id, 'register')}
                                style={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  borderRadius: '25px'
                                }}
                              >
                                <i className="fas fa-user-plus me-1"></i> Register
                              </button>
                              <button
                                className="orange-button"
                                onClick={() => updateCount(evt._id, 'checkin')}
                                style={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  borderRadius: '25px'
                                }}
                              >
                                <i className="fas fa-check-circle me-1"></i> Check‑In
                              </button>
                              <button
                                className="orange-button"
                                onClick={() => handleEdit(evt)}
                                style={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  borderRadius: '25px'
                                }}
                              >
                                <i className="fas fa-edit me-1"></i> Edit
                              </button>
                              <button
                                className="orange-button"
                                onClick={() => handleDelete(evt._id)}
                                style={{
                                  fontSize: '12px',
                                  padding: '8px 16px',
                                  borderRadius: '25px',
                                  background: 'linear-gradient(135deg, #ff511a, #ff8c42)'
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
                ))}
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

// EventEditForm Component
function EventEditForm({ event, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    faculty: event.faculty || '',
    venue: event.venue || '',
    capacity: event.capacity || '',
    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    status: event.status || 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
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
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Technical">Technical</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="row">
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
              <option value="">Select Faculty</option>
              <option value="Computing">Computing</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
              <option value="Architecture">Architecture</option>
              <option value="Graduate Studies">Graduate Studies</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              name="venue"
              value={formData.venue}
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
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-group mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Update Event
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

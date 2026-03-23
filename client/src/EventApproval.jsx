import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminHeader from './AdminHeader';
import Footer from './Footer';

export default function EventApproval() {
  // Helper functions for status and priority colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from API...');
      const response = await fetch('http://localhost:5000/api/events');
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      console.log('API response data:', data);
      // Handle different API response formats
      const eventsData = data && data.data ? data.data : (Array.isArray(data) ? data : []);
      console.log('Events data to set:', eventsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on active tab
  const getFilteredEvents = () => {
    console.log('Filtering events. Active tab:', activeTab);
    console.log('Total events:', events.length);
    console.log('Events data:', events);
    
    if (activeTab === 'all') {
      console.log('Returning all events:', events);
      return events;
    }
    const filtered = events.filter(event => event.status === activeTab);
    console.log('Filtered events:', filtered);
    console.log('Event statuses:', events.map(e => ({ id: e._id, status: e.status })));
    return filtered;
  };

  const currentEvents = getFilteredEvents();

  // Debug: Log tab counts
  console.log('=== TAB COUNTS ===');
  console.log('All Events:', events.length);
  console.log('Pending:', events.filter(e => e.status === 'pending').length);
  console.log('Approved:', events.filter(e => e.status === 'approved').length);
  console.log('Rejected:', events.filter(e => e.status === 'rejected').length);
  console.log('Current tab:', activeTab);
  console.log('Current events count:', currentEvents.length);
  console.log('==================');

  const handleEventSelection = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleBulkAction = async (action) => {
    try {
      const response = await fetch('http://localhost:5000/api/events/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventIds: selectedEvents,
          action: action
        })
      });
      
      if (!response.ok) throw new Error(`Failed to ${action} events`);
      
      // Refresh events after bulk action
      await fetchEvents();
      setSelectedEvents([]);
      setSuccessMessage(`Successfully ${action}d ${selectedEvents.length} events`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (eventId, newStatus) => {
    try {
      console.log(`Updating event ${eventId} to status: ${newStatus}`);
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setEvents(prev => {
        const updated = prev.map(event => 
          event._id === eventId ? { ...event, status: newStatus } : event
        );
        console.log('Updated events after status change:', updated);
        return updated;
      });
      
      setSuccessMessage(`Event status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      // Update local state
      setEvents(prev => prev.filter(event => event._id !== eventId));
      
      setSuccessMessage('Event deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(null);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateEvent = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      
      const updatedEvent = await response.json();
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event._id === editingEvent._id ? updatedEvent.data : event
      ));
      
      setSuccessMessage('Event updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Event Approval - EventSync Admin</title>
      </Helmet>

      <AdminHeader />

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '40px 0',
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
            <div className="col-lg-12">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <div>
                  <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      fontSize: '24px'
                    }}>✅</span>
                    Event Approval Management
                  </h1>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: 0
                  }}>
                    Review and manage event submissions with creative approval workflow
                  </p>
                </div>
                
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    Total Events: {events.length}
                  </div>
                  
                  {successMessage && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#ffffff',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      ✅ {successMessage}
                    </div>
                  )}
                  
                  {error && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      ❌ {error}
                    </div>
                  )}
                  
                  {selectedEvents.length > 0 && (
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button 
                        onClick={() => handleBulkAction('approve')}
                        style={{
                          background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        ✅ Approve Selected ({selectedEvents.length})
                      </button>
                      <button 
                        onClick={() => handleBulkAction('reject')}
                        style={{
                          background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Reject Selected ({selectedEvents.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '0',
        zIndex: 100
      }}>
        <div className="container">
          <div style={{display: 'flex', gap: '0', overflowX: 'auto'}}>
            {[
              { key: 'all', label: 'All Events', count: events.length, icon: '📋' },
              { key: 'pending', label: 'Pending', count: events.filter(e => e.status === 'pending').length, icon: '⏳' },
              { key: 'approved', label: 'Approved', count: events.filter(e => e.status === 'approved').length, icon: '✅' },
              { key: 'rejected', label: 'Rejected', count: events.filter(e => e.status === 'rejected').length, icon: '❌' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? '#4f46e5' : 'transparent',
                  color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                  border: 'none',
                  padding: '15px 25px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '3px solid #4f46e5' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                  color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{background: '#f8fafc', minHeight: 'calc(100vh - 200px)', padding: '30px 0'}}>
        <div className="container">
          
          {loading ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                Loading Events...
              </h3>
              <p style={{color: '#6b7280', fontSize: '16px'}}>
                Please wait while we fetch the events.
              </p>
            </div>
          ) : currentEvents.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>
                {activeTab === 'pending' ? '⏳' : activeTab === 'approved' ? '✅' : '❌'}
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                No {activeTab} events
              </h3>
              <p style={{color: '#6b7280', fontSize: '16px'}}>
                {activeTab === 'pending' 
                  ? 'All events have been reviewed. Great job!' 
                  : `No events in ${activeTab} status.`
                }
              </p>
            </div>
          ) : (
            <div className="row">
              {currentEvents.map((event) => (
                <div key={event._id} className="col-lg-6 mb-4">
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}>
                    
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <span style={{
                        background: `${getStatusColor(event.status)}15`,
                        color: getStatusColor(event.status),
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {event.status}
                      </span>
                      <span style={{
                        background: `${getPriorityColor(event.priority || 'medium')}15`,
                        color: getPriorityColor(event.priority || 'medium'),
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {event.priority} priority
                      </span>
                    </div>

                    {/* Selection Checkbox */}
                    {activeTab === 'pending' && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleEventSelection(event.id)}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    )}

                    {/* Event Content */}
                    <div style={{paddingLeft: activeTab === 'pending' ? '40px' : '0'}}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '15px',
                        paddingRight: '150px'
                      }}>
                        {event.title}
                      </h3>
                      
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px'}}>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          📚 {event.category}
                        </span>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          🏢 {event.faculty}
                        </span>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          👥 {event.organizer}
                        </span>
                      </div>

                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        {event.description || 'No description available'}
                      </p>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>📅</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Date & Time</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} 
                              {event.time ? ` at ${event.time}` : ''}
                            </div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>📍</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Venue</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.venue || 'Venue TBD'}
                            </div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>👥</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Capacity</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.registered || 0}/{event.capacity || 'Unlimited'}
                            </div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>💰</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Budget</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.budget ? `Rs. ${event.budget.toLocaleString()}` : 'Budget TBD'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Organizer Info */}
                      {event.organizer && (
                        <div style={{
                          background: '#f8fafc',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '5px'}}>
                            📋 Organizer
                          </div>
                          <div style={{fontSize: '14px', color: '#374151'}}>{event.organizer}</div>
                        </div>
                      )}

                      {/* Sponsorship Info */}
                      {event.sponsorshipEnabled && (
                        <div style={{
                          background: '#f8fafc',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                            🤝 Sponsorship Tiers
                          </div>
                          <div style={{display: 'flex', gap: '10px'}}>
                            {event.sponsorshipTiers.map((tier, index) => (
                              <div key={index} style={{
                                background: '#ffffff',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px'
                              }}>
                                <div style={{fontWeight: '600', color: '#111827'}}>{tier.tier}</div>
                                <div style={{color: '#6b7280'}}>Rs. {tier.price.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {event.status === 'rejected' && event.rejectionReason && (
                        <div style={{
                          background: '#fef2f2',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid #fecaca'
                        }}>
                          <div style={{fontSize: '12px', fontWeight: '600', color: '#dc2626', marginBottom: '5px'}}>
                            Rejection Reason
                          </div>
                          <div style={{fontSize: '14px', color: '#7f1d1d'}}>{event.rejectionReason}</div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '15px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <div>
                          Submitted: {event.submittedDate}
                          {event.approvedDate && ` | Approved: ${event.approvedDate}`}
                          {event.rejectedDate && ` | Rejected: ${event.rejectedDate}`}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap'}}>
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(event._id, 'approved')}
                              style={{
                                background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                flex: 1
                              }}>
                              ✅ Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(event._id, 'rejected')}
                              style={{
                                background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                flex: 1
                              }}>
                              ❌ Reject
                            </button>
                          </>
                        )}
                        
                        {/* Delete button for all events */}
                        <button 
                          onClick={() => handleDelete(event._id)}
                          style={{
                            background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#111827'}}>
              ⚠️ Confirm Deletion
            </h3>
            
            <p style={{color: '#6b7280', marginBottom: '20px', lineHeight: '1.5'}}>
              Are you sure you want to delete this event? This action cannot be undone and will remove all event data including registrations.
            </p>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                style={{
                  background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Delete Event
              </button>
              
              <button
                onClick={() => setShowDeleteModal(null)}
                style={{
                  background: 'linear-gradient(45deg, #6b7280 0%, #4b5563 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

<Footer />
    </>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../AdminSidebar';


const API_BASE = 'http://localhost:5000/api/events';

export default function EventApproval() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return {
          bg: '#ecfdf5',
          text: '#059669',
          border: '#a7f3d0'
        };
      case 'Pending':
        return {
          bg: '#fffbeb',
          text: '#d97706',
          border: '#fcd34d'
        };
      case 'Rejected':
        return {
          bg: '#fef2f2',
          text: '#dc2626',
          border: '#fca5a5'
        };
      default:
        return {
          bg: '#f3f4f6',
          text: '#6b7280',
          border: '#d1d5db'
        };
    }
  };

  const showTemporaryMessage = (type, message) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setError('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(message);
      setSuccessMessage('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      const eventsData = Array.isArray(data?.data) ? data.data : [];
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === 'All') return events;
    return events.filter((event) => event.status === activeTab);
  }, [activeTab, events]);

  const tabs = [
    { key: 'All', label: 'All Events', count: events.length, icon: '📋' },
    {
      key: 'Pending',
      label: 'Pending',
      count: events.filter((e) => e.status === 'Pending').length,
      icon: '⏳'
    },
    {
      key: 'Approved',
      label: 'Approved',
      count: events.filter((e) => e.status === 'Approved').length,
      icon: '✅'
    },
    {
      key: 'Rejected',
      label: 'Rejected',
      count: events.filter((e) => e.status === 'Rejected').length,
      icon: '❌'
    }
  ];

  const handleEventSelection = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleStatusUpdate = async (eventId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.join(', ') ||
            result.message ||
            'Failed to update status'
        );
      }

      setEvents((prev) =>
        prev.map((event) => (event._id === eventId ? result.data : event))
      );

      showTemporaryMessage('success', `Event status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      showTemporaryMessage('error', err.message || 'Failed to update status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedEvents.length === 0) return;

    const mappedStatus =
      action === 'approve'
        ? 'Approved'
        : action === 'reject'
        ? 'Rejected'
        : 'Pending';

    try {
      const results = await Promise.all(
        selectedEvents.map(async (eventId) => {
          const response = await fetch(`${API_BASE}/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: mappedStatus })
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.errors?.join(', ') ||
                result.message ||
                'Bulk update failed'
            );
          }

          return result.data;
        })
      );

      setEvents((prev) =>
        prev.map((event) => {
          const updated = results.find((r) => r._id === event._id);
          return updated || event;
        })
      );

      setSelectedEvents([]);
      showTemporaryMessage(
        'success',
        `Successfully updated ${results.length} event(s) to ${mappedStatus}`
      );
    } catch (err) {
      showTemporaryMessage('error', err.message || 'Bulk update failed');
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE}/${eventId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete event');
      }

      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      setShowDeleteModal(null);
      showTemporaryMessage('success', 'Event deleted successfully');
    } catch (err) {
      showTemporaryMessage('error', err.message || 'Failed to delete event');
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Date TBD';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'Date TBD';
    return d.toLocaleDateString();
  };

  const baseButtonStyle = {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const styles = {
    pageSection: {
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: '#fff',
      padding: '52px 0 42px'
    },
    pageTitle: {
      fontSize: 'clamp(28px, 4vw, 40px)',
      fontWeight: 800,
      marginBottom: '10px',
      letterSpacing: '-0.02em'
    },
    pageSubtitle: {
      color: 'rgba(255,255,255,0.78)',
      margin: 0,
      fontSize: '16px'
    },
    stickyTabs: {
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    tabsWrap: {
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      padding: '14px 0'
    },
    tabButton: (active) => ({
      border: active ? '1px solid #4f46e5' : '1px solid #e5e7eb',
      background: active ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : '#ffffff',
      color: active ? '#ffffff' : '#475569',
      borderRadius: '14px',
      padding: '12px 18px',
      fontSize: '14px',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      boxShadow: active
        ? '0 10px 25px rgba(79, 70, 229, 0.24)'
        : '0 4px 12px rgba(15, 23, 42, 0.05)',
      transition: 'all 0.2s ease'
    }),
    contentSection: {
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '70vh',
      padding: '32px 0 50px'
    },
    messageBox: {
      borderRadius: '14px',
      padding: '14px 18px',
      marginBottom: '18px',
      fontWeight: 500
    },
    bulkBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '18px',
      padding: '16px 18px',
      marginBottom: '24px',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
    },
    bulkActions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    gridRow: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    cardCol: {
      display: 'flex'
    },
    card: {
      background: '#ffffff',
      borderRadius: '22px',
      padding: '22px',
      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
      border: '1px solid rgba(226, 232, 240, 0.95)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    },
    cardTopRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '14px'
    },
    titleRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      flex: 1,
      minWidth: 0
    },
    checkboxWrap: {
      paddingTop: '4px',
      flexShrink: 0
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#4f46e5'
    },
    title: {
      fontSize: 'clamp(22px, 2vw, 28px)',
      fontWeight: 800,
      color: '#0f172a',
      margin: 0,
      lineHeight: 1.2,
      wordBreak: 'break-word'
    },
    badge: (status) => {
      const c = getStatusColor(status);
      return {
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        padding: '7px 14px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 800,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        flexShrink: 0
      };
    },
    description: {
      color: '#64748b',
      fontSize: '15px',
      lineHeight: 1.7,
      marginBottom: '18px',
      minHeight: '84px'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '12px',
      marginBottom: '20px'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '15px',
      color: '#334155',
      lineHeight: 1.5
    },
    detailLabel: {
      minWidth: '92px',
      fontWeight: 800,
      color: '#0f172a'
    },
    actions: {
      marginTop: 'auto',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      paddingTop: '12px'
    },
    approveBtn: {
      ...baseButtonStyle,
      background: '#16a34a',
      color: '#fff'
    },
    pendingBtn: {
      ...baseButtonStyle,
      background: '#f59e0b',
      color: '#fff'
    },
    rejectBtn: {
      ...baseButtonStyle,
      background: '#ef4444',
      color: '#fff'
    },
    deleteBtn: {
      ...baseButtonStyle,
      background: '#111827',
      color: '#fff'
    },
    secondaryBtn: {
      ...baseButtonStyle,
      background: '#e5e7eb',
      color: '#111827'
    },
    emptyState: {
      background: '#ffffff',
      border: '1px dashed #cbd5e1',
      borderRadius: '18px',
      padding: '42px 24px',
      textAlign: 'center',
      color: '#64748b',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      background: '#ffffff',
      borderRadius: '22px',
      padding: '28px',
      width: '100%',
      maxWidth: '460px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.18)'
    },
    modalTitle: {
      margin: '0 0 12px',
      fontSize: '24px',
      fontWeight: 800,
      color: '#0f172a'
    },
    modalText: {
      margin: '0 0 22px',
      color: '#64748b',
      lineHeight: 1.6
    },
    modalActions: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    }
  };

  return (
    <>
      <Helmet>
        <title>Event Approval - EventSync Admin</title>
      </Helmet>

      <AdminSidebar />
      <div style={{ marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

<div
  style={{
    background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
    color: '#fff',
    padding: '40px 0 42px', // adjusted top padding since no top navbar
    marginTop: '0'
  }}
>
  <div className="container">
    <h1
  style={{
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: 800,
    marginBottom: '10px',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: '#f8fafc', // brighter heading color
    textShadow: '0 2px 10px rgba(0,0,0,0.25)'
  }}
>
   Event Approval Management
</h1>
    <p
      style={{
        color: 'rgba(255,255,255,0.78)',
        margin: 0,
        fontSize: '16px'
      }}
    >
      Review, approve, reject, and manage submitted events with a cleaner admin experience.
    </p>
  </div>
</div>

      <div style={styles.contentSection}>
        <div className="container">
          {successMessage && (
            <div
              style={{
                ...styles.messageBox,
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0'
              }}
            >
              {successMessage}
            </div>
          )}

          {error && (
            <div
              style={{
                ...styles.messageBox,
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca'
              }}
            >
              {error}
            </div>
          )}

          {selectedEvents.length > 0 && (
            <div style={styles.bulkBar}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {selectedEvents.length} event(s) selected
              </div>

              <div style={styles.bulkActions}>
                <button
                  onClick={() => handleBulkAction('approve')}
                  style={styles.approveBtn}
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  style={styles.rejectBtn}
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => handleBulkAction('pending')}
                  style={styles.pendingBtn}
                >
                  Mark Pending
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={styles.emptyState}>Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div style={styles.emptyState}>
              <h4 style={{ marginBottom: '8px', color: '#0f172a', fontWeight: 800 }}>
                No events found
              </h4>
              <p style={{ margin: 0 }}>
                There are no events available under the selected tab right now.
              </p>
            </div>
          ) : (
            <div className="row" style={styles.gridRow}>
              {filteredEvents.map((event) => (
                <div key={event._id} className="col-lg-6 mb-4" style={styles.cardCol}>
                  <div style={styles.card}>
                    <div style={styles.cardTopRow}>
                      <div style={styles.titleRow}>
                        {activeTab === 'Pending' && (
                          <div style={styles.checkboxWrap}>
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event._id)}
                              onChange={() => handleEventSelection(event._id)}
                              style={styles.checkbox}
                            />
                          </div>
                        )}

                        <h3 style={styles.title}>{event.title}</h3>
                      </div>

                      <span style={styles.badge(event.status)}>{event.status}</span>
                    </div>

                    <p style={styles.description}>
                      {event.description || 'No description available for this event.'}
                    </p>

                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Category:</span>
                        <span>{event.category || 'N/A'}</span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Faculty:</span>
                        <span>{event.faculty || 'N/A'}</span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Organizer:</span>
                        <span>{event.organizerName || event.organizer || 'N/A'}</span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Date:</span>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Venue:</span>
                        <span>{event.venue || 'Venue TBD'}</span>
                      </div>
                    </div>

                    <div style={styles.actions}>
                      <button
                        onClick={() => handleStatusUpdate(event._id, 'Approved')}
                        style={styles.approveBtn}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(event._id, 'Pending')}
                        style={styles.pendingBtn}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(event._id, 'Rejected')}
                        style={styles.rejectBtn}
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => setShowDeleteModal(event._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirm Delete</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete this event? This action cannot be undone.
            </p>

            <div style={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(null)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                style={styles.rejectBtn}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}


      </div>
    </>
  );
}
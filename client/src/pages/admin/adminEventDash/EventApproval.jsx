import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../AdminSidebar';
import { authFetch } from '../../../utils/auth';

const API_BASE = 'http://localhost:5000/api/events';

export default function EventApproval() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success'|'error', text: '', status: 'Approved'|'Pending'|'Rejected' }
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

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

  const showToastNotification = (type, text, status) => {
    setToastMessage({ type, text, status });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await authFetch(API_BASE);
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
    let filtered = events;

    if (activeTab !== 'All') {
      filtered = filtered.filter((event) => event.status === activeTab);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((event) => {
        const searchable = `${event.title || ''} ${event.description || ''} ${event.category || ''} ${event.faculty || ''} ${event.venue || ''} ${event.organizerName || event.organizer || ''}`.toLowerCase();
        return searchable.includes(q);
      });
    }

    return filtered;
  }, [activeTab, events, searchTerm]);

  const tabs = [
    { key: 'All', label: 'All Events', count: events.length, icon: '📋' },
    {
      key: 'Pending',
      label: 'Pending',
      count: events.filter((e) => e.status === 'Pending').length,
      //icon: '⏳'
    },
    {
      key: 'Approved',
      label: 'Approved',
      count: events.filter((e) => e.status === 'Approved').length,
     // icon: '✅'
    },
    {
      key: 'Rejected',
      label: 'Rejected',
      count: events.filter((e) => e.status === 'Rejected').length,
      //icon: '❌'
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
      const response = await authFetch(`${API_BASE}/${eventId}`, {
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

      const msg = `Event status updated to ${newStatus}`;
      showTemporaryMessage('success', msg);
      showToastNotification('success', msg, newStatus);
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Failed to update status';
      showTemporaryMessage('error', errMsg);
      showToastNotification('error', errMsg, null);
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
          const response = await authFetch(`${API_BASE}/${eventId}`, {
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
      const msg = `Successfully updated ${results.length} event(s) to ${mappedStatus}`;
      showTemporaryMessage('success', msg);
      showToastNotification('success', msg, mappedStatus);
    } catch (err) {
      const errMsg = err.message || 'Bulk update failed';
      showTemporaryMessage('error', errMsg);
      showToastNotification('error', errMsg, null);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await authFetch(`${API_BASE}/${eventId}`, {
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

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEditForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await authFetch(`${API_BASE}/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.join(', ') ||
            result.message ||
            'Failed to update event'
        );
      }

      setEvents((prev) =>
        prev.map((event) => (event._id === editingEvent._id ? result.data : event))
      );

      setShowEditForm(false);
      setEditingEvent(null);
      showTemporaryMessage('success', 'Event updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      showTemporaryMessage('error', err.message || 'Failed to update event');
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
          {toastMessage && (
            <div
              style={{
                position: 'fixed',
                right: '24px',
                top: '88px',
                zIndex: 1100,
                background: toastMessage.type === 'success'
                  ? (toastMessage.status === 'Approved' ? '#ecfdf5' :
                     toastMessage.status === 'Pending' ? '#fffbeb' :
                     toastMessage.status === 'Rejected' ? '#fef2f2' : '#ecfdf5')
                  : '#fee2e2',
                color: toastMessage.type === 'success'
                  ? (toastMessage.status === 'Approved' ? '#059669' :
                     toastMessage.status === 'Pending' ? '#d97706' :
                     toastMessage.status === 'Rejected' ? '#dc2626' : '#059669')
                  : '#991b1b',
                border: `1px solid ${toastMessage.type === 'success'
                  ? (toastMessage.status === 'Approved' ? '#a7f3d0' :
                     toastMessage.status === 'Pending' ? '#fcd34d' :
                     toastMessage.status === 'Rejected' ? '#fca5a5' : '#a7f3d0')
                  : '#fecaca'}`,
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.15)',
                minWidth: '260px',
                fontWeight: 700
              }}
            >
              {toastMessage.text}
            </div>
          )}

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

          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, organizer, venue..."
              style={{
                flex: '1 1 320px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                minWidth: '220px'
              }}
            />
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                background: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                minWidth: '170px'
              }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

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
                        onClick={() => handleEdit(event)}
                        style={{
                          ...baseButtonStyle,
                          background: '#4f46e5',
                          color: '#fff'
                        }}
                      >
                        Edit
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

      {showEditForm && editingEvent && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowEditForm(false);
          setEditingEvent(null);
        }}>
          <div
            style={{
              ...styles.modal,
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>Edit Event: {editingEvent.title}</h3>
            <EventEditFormCompact
              event={editingEvent}
              onUpdate={handleUpdate}
              onCancel={() => {
                setShowEditForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        </div>
      )}

      </div>
    </>
  );
}

function EventEditFormCompact({ event, onUpdate, onCancel }) {
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

  const [formData, setFormData] = React.useState({
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
    status: event.status || 'Pending'
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        .filter(Boolean)
    });
  };

  const fieldStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontFamily: 'inherit'
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {errors.title && <div style={errorStyle}>{errors.title}</div>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={inputStyle}
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

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={{...inputStyle, fontFamily: 'inherit'}}
          required
        />
        {errors.description && <div style={errorStyle}>{errors.description}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Date</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {errors.date && <div style={errorStyle}>{errors.date}</div>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {errors.venue && <div style={errorStyle}>{errors.venue}</div>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Faculty</label>
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            style={inputStyle}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Event Type</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            style={inputStyle}
          >
            {eventTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            style={inputStyle}
            required
          />
          {errors.capacity && <div style={errorStyle}>{errors.capacity}</div>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Budget (LKR)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          {errors.organizerName && <div style={errorStyle}>{errors.organizerName}</div>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Organizer Email</label>
          <input
            type="email"
            name="organizerEmail"
            value={formData.organizerEmail}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.organizerEmail && <div style={errorStyle}>{errors.organizerEmail}</div>}
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Phone Numbers (comma-separated)</label>
        <input
          type="text"
          name="phoneNumbers"
          value={formData.phoneNumbers}
          onChange={handleChange}
          placeholder="e.g., +94123456789, +94987654321"
          style={inputStyle}
          required
        />
        {errors.phoneNumbers && <div style={errorStyle}>{errors.phoneNumbers}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Society Name</label>
        <input
          type="text"
          name="societyName"
          value={formData.societyName}
          onChange={handleChange}
          style={inputStyle}
        />
        {errors.societyName && <div style={errorStyle}>{errors.societyName}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., important, featured, popular"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
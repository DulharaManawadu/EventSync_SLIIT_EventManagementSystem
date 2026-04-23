import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Html5QrcodeScanner } from 'html5-qrcode';
import AdminSidebar from '../AdminSidebar';
import { authFetch } from '../../../utils/auth';

const API_BASE = 'http://localhost:5000/api/event-registrations';

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

export default function QrGeneration() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState('');
  const [error, setError] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [scannerKey, setScannerKey] = useState(0);
  const processingRef = useRef(false);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || null,
    [events, selectedEventId]
  );

  const loadSummary = async (preferredEventId) => {
    const res = await authFetch(`${API_BASE}/admin/events/summary`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to load QR event summary');
    }

    const rows = Array.isArray(json.data) ? json.data : [];
    setEvents(rows);

    if (!rows.length) {
      setSelectedEventId('');
      setAttendanceData(null);
      return;
    }

    const nextSelected =
      preferredEventId && rows.some((event) => event.id === preferredEventId)
        ? preferredEventId
        : selectedEventId && rows.some((event) => event.id === selectedEventId)
          ? selectedEventId
          : rows[0].id;

    setSelectedEventId(nextSelected);
  };

  const loadAttendance = async (eventId) => {
    if (!eventId) {
      setAttendanceData(null);
      return;
    }

    setTableLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/events/${eventId}/attendance`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to load attendance table');
      }

      setAttendanceData(json.data);
      setError('');
    } catch (err) {
      setAttendanceData(null);
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setTableLoading(false);
    }
  };

  const replaceSummaryEvent = (updatedEvent) => {
    if (!updatedEvent?.id) return;
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event))
    );
  };

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        setLoading(true);
        await loadSummary();
        if (active) {
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load QR tools');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    loadAttendance(selectedEventId);
  }, [selectedEventId]);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    const elementId = `admin-qr-reader-${scannerKey}`;
    if (!document.getElementById(elementId)) {
      return undefined;
    }

    const scanner = new Html5QrcodeScanner(
      elementId,
      {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        rememberLastUsedCamera: true
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;
        processingRef.current = true;
        await handleScan(decodedText);
        processingRef.current = false;
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerKey]);

  const handleScan = async (qrToken) => {
    try {
      if (!selectedEventId) {
        throw new Error('Select an event before scanning a QR code');
      }

      if (!selectedEvent?.checkInActive) {
        throw new Error('Activate check-in for the selected event before scanning QR codes');
      }

      setError('');
      setScanMessage('');

      const res = await authFetch(`${API_BASE}/check-in`, {
        method: 'POST',
        body: JSON.stringify({ qrToken, eventId: selectedEventId })
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to confirm attendance');
      }

      const checkedEventId = json?.data?.event?._id || json?.data?.registration?.eventId;

      setManualToken('');
      setScanMessage(
        `${json.data.registration.studentName} attendance was confirmed for ${json.data.event.title || 'the event'}.`
      );
      await loadSummary(checkedEventId);
      if (checkedEventId) {
        await loadAttendance(checkedEventId);
      }
      setScannerKey((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to confirm attendance');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setError('Paste or scan a QR token first');
      return;
    }

    await handleScan(manualToken.trim());
  };

  const handleToggleCheckIn = async () => {
    if (!selectedEventId || !selectedEvent) {
      setError('Select an event before changing check-in status');
      return;
    }

    try {
      setToggleLoading(true);
      setError('');
      setScanMessage('');

      const res = await authFetch(`${API_BASE}/admin/events/${selectedEventId}/check-in`, {
        method: 'PATCH',
        body: JSON.stringify({ checkInActive: !selectedEvent.checkInActive })
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update check-in status');
      }

      replaceSummaryEvent(json.data);
      setScanMessage(
        `Check-in ${json.data.checkInActive ? 'activated' : 'disabled'} for ${json.data.title}.`
      );
    } catch (err) {
      setError(err.message || 'Failed to update check-in status');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!attendanceData?.rows?.length || !selectedEvent) {
      setError('There is no attendance data to export for the selected event');
      return;
    }

    const escapeCsv = (value) => {
      const stringValue = value == null ? '' : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const lines = [
      ['Student ID', 'Student Name', 'Email', 'Registered At', 'Attendance Status', 'Checked In At'],
      ...attendanceData.rows.map((row) => [
        row.studentId,
        row.studentName,
        row.studentEmail,
        formatDateTime(row.registeredAt),
        row.attendanceStatus,
        formatDateTime(row.checkedInAt)
      ])
    ];

    const csv = lines.map((line) => line.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeTitle = (selectedEvent.title || 'attendance')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    anchor.href = url;
    anchor.download = `${safeTitle || 'attendance'}-attendance.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteRegistration = async (row) => {
    if (!selectedEventId) {
      setError('Select an event before removing a registration');
      return;
    }

    const confirmed = window.confirm(
      `Remove ${row.studentName}'s registration from ${selectedEvent?.title || 'this event'}?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(row.id);
      setError('');
      setScanMessage('');

      const res = await authFetch(`${API_BASE}/admin/registrations/${row.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to remove registration');
      }

      setScanMessage(`${row.studentName}'s registration was removed successfully.`);
      await loadSummary(selectedEventId);
      await loadAttendance(selectedEventId);
    } catch (err) {
      setError(err.message || 'Failed to remove registration');
    } finally {
      setDeleteLoadingId('');
    }
  };

  return (
    <>
      <Helmet>
        <title>QR Generation | EventSync Admin</title>
      </Helmet>
      <AdminSidebar />

      <div
        style={{
          marginLeft: '260px',
          minHeight: '100vh',
          background: '#f8fafc',
          padding: '32px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              QR Attendance
            </div>
            <h1 style={{ margin: '10px 0 8px', color: '#0f172a' }}>QR Generation & Attendance Table</h1>
            <p style={{ margin: 0, color: '#475569', maxWidth: '760px' }}>
              Scan each student QR to confirm attendance, then review registered students, no-shows, and confirmed attendees for any approved event.
            </p>
          </div>
          <button
            onClick={() => setScannerKey((prev) => prev + 1)}
            style={{
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            Restart Scanner
          </button>
        </div>

        {loading ? (
          <div style={panelStyle}>
            <p style={{ margin: 0 }}>Loading QR attendance tools...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ ...messageStyle, background: '#fee2e2', color: '#991b1b' }}>
                {error}
              </div>
            )}
            {scanMessage && (
              <div style={{ ...messageStyle, background: '#dcfce7', color: '#166534' }}>
                {scanMessage}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(340px, 420px) minmax(0, 1fr)',
                gap: '24px',
                alignItems: 'start'
              }}
            >
              <div style={panelStyle}>
                <h3 style={panelTitleStyle}>Admin Scanner</h3>
                <p style={panelTextStyle}>
                  Use the device camera to scan a student QR, or paste the raw token manually if camera access is unavailable.
                </p>
                <div
                  style={{
                    marginBottom: '14px',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    background: selectedEvent?.checkInActive ? '#dcfce7' : '#fef3c7',
                    color: selectedEvent?.checkInActive ? '#166534' : '#92400e',
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                >
                  {selectedEvent
                    ? `${selectedEvent.title}: check-in is ${selectedEvent.checkInActive ? 'active' : 'inactive'}`
                    : 'Select an event to start scanning'}
                </div>

                {!selectedEvent?.checkInActive && (
                  <div
                    style={{
                      marginBottom: '14px',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      background: '#fff7ed',
                      color: '#9a3412',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: '1px solid #fdba74'
                    }}
                  >
                    Scanning is disabled until you activate check-in for the currently selected event.
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <div
                    id={`admin-qr-reader-${scannerKey}`}
                    style={{
                      minHeight: '320px',
                      opacity: selectedEvent?.checkInActive ? 1 : 0.45,
                      pointerEvents: selectedEvent?.checkInActive ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                  {!selectedEvent?.checkInActive && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(248, 250, 252, 0.72)',
                        color: '#9a3412',
                        fontWeight: 700
                      }}
                    >
                      Activate check-in to enable camera scanning for this event.
                    </div>
                  )}
                </div>

                <form onSubmit={handleManualSubmit} style={{ marginTop: '20px' }}>
                  <label
                    htmlFor="manual-qr-token"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}
                  >
                    Manual QR token fallback
                  </label>
                  <textarea
                    id="manual-qr-token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste a QR token here if camera scanning is unavailable"
                    rows={4}
                    disabled={!selectedEvent?.checkInActive}
                    style={textareaStyle}
                  />
                  <button
                    type="submit"
                    disabled={!selectedEvent?.checkInActive}
                    style={{
                      ...primaryButtonStyle,
                      opacity: !selectedEvent?.checkInActive ? 0.6 : 1,
                      cursor: !selectedEvent?.checkInActive ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Confirm Attendance
                  </button>
                </form>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={panelStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={panelTitleStyle}>Approved Events</h3>
                      <p style={panelTextStyle}>Choose an event to inspect its registration and attendance table.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        style={selectStyle}
                      >
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleToggleCheckIn}
                        disabled={!selectedEvent || toggleLoading}
                        style={{
                          ...primaryButtonStyle,
                          background: selectedEvent?.checkInActive ? '#b91c1c' : '#15803d',
                          opacity: !selectedEvent || toggleLoading ? 0.65 : 1,
                          cursor: !selectedEvent || toggleLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {toggleLoading
                          ? 'Updating...'
                          : selectedEvent?.checkInActive
                            ? 'Disable Check-In'
                            : 'Activate Check-In'}
                      </button>
                    </div>
                  </div>

                  {selectedEvent ? (
                    <div style={statsGridStyle}>
                      <StatCard label="Registered" value={selectedEvent.registered} />
                      <StatCard label="Attended" value={selectedEvent.attended} />
                      <StatCard label="No-Shows" value={selectedEvent.noShows} />
                      <StatCard label="Check-In" value={selectedEvent.checkInActive ? 'On' : 'Off'} />
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#64748b' }}>No QR-enabled approved events are available yet.</p>
                  )}
                </div>

                <div style={panelStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={panelTitleStyle}>Attendance Table</h3>
                      <p style={panelTextStyle}>
                        {attendanceData?.event?.title
                          ? `${attendanceData.event.title} attendance records`
                          : 'Registered students for the selected event'}
                      </p>
                    </div>
                    <button
                      onClick={handleExportCsv}
                      disabled={!attendanceData?.rows?.length}
                      style={{
                        ...primaryButtonStyle,
                        background: '#1d4ed8',
                        opacity: !attendanceData?.rows?.length ? 0.6 : 1,
                        cursor: !attendanceData?.rows?.length ? 'not-allowed' : 'pointer',
                        alignSelf: 'flex-start'
                      }}
                    >
                      Export CSV
                    </button>
                  </div>

                  {tableLoading ? (
                    <p style={{ margin: 0 }}>Loading attendance table...</p>
                  ) : attendanceData?.rows?.length ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Student ID</th>
                            <th style={thStyle}>Student Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Registered At</th>
                            <th style={thStyle}>Attendance Status</th>
                            <th style={thStyle}>Checked In At</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData.rows.map((row) => (
                            <tr key={row.id}>
                              <td style={tdStyle}>{row.studentId}</td>
                              <td style={tdStyle}>{row.studentName}</td>
                              <td style={tdStyle}>{row.studentEmail}</td>
                              <td style={tdStyle}>{formatDateTime(row.registeredAt)}</td>
                              <td style={tdStyle}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    borderRadius: '999px',
                                    padding: '4px 10px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    background:
                                      row.attendanceStatus === 'Attended' ? '#dcfce7' : '#fef3c7',
                                    color:
                                      row.attendanceStatus === 'Attended' ? '#166534' : '#92400e'
                                  }}
                                >
                                  {row.attendanceStatus}
                                </span>
                              </td>
                              <td style={tdStyle}>{formatDateTime(row.checkedInAt)}</td>
                              <td style={tdStyle}>
                                <button
                                  onClick={() => handleDeleteRegistration(row)}
                                  disabled={deleteLoadingId === row.id}
                                  style={{
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    border: '1px solid #fecaca',
                                    borderRadius: '10px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: deleteLoadingId === row.id ? 'not-allowed' : 'pointer',
                                    opacity: deleteLoadingId === row.id ? 0.65 : 1
                                  }}
                                >
                                  {deleteLoadingId === row.id ? 'Removing...' : 'Remove'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#64748b' }}>
                      {selectedEventId
                        ? 'No students have registered for this event yet.'
                        : 'Select an event to view its attendance table.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '18px',
        padding: '18px'
      }}
    >
      <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
        {label}
      </div>
      <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 700, color: '#0f172a' }}>{value}</div>
    </div>
  );
}

const panelStyle = {
  background: '#ffffff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
  border: '1px solid rgba(148, 163, 184, 0.18)'
};

const panelTitleStyle = {
  margin: '0 0 8px',
  color: '#0f172a'
};

const panelTextStyle = {
  margin: '0 0 18px',
  color: '#64748b',
  fontSize: '14px'
};

const messageStyle = {
  marginBottom: '20px',
  borderRadius: '14px',
  padding: '14px 16px',
  fontWeight: 600
};

const textareaStyle = {
  width: '100%',
  borderRadius: '14px',
  border: '1px solid #cbd5e1',
  padding: '14px',
  resize: 'vertical',
  marginBottom: '12px'
};

const primaryButtonStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 18px',
  fontWeight: 600,
  cursor: 'pointer'
};

const selectStyle = {
  minWidth: '240px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  padding: '12px 14px',
  background: '#ffffff'
};

const statsGridStyle = {
  marginTop: '18px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '16px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const thStyle = {
  textAlign: 'left',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#64748b',
  padding: '12px 10px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f8fafc'
};

const tdStyle = {
  padding: '12px 10px',
  borderBottom: '1px solid #e2e8f0',
  color: '#0f172a',
  fontSize: '14px',
  verticalAlign: 'top'
};

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode';
import Header from '../Header';
import Footer from '../Footer';
import { authFetch } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/event-registrations';

const formatDate = (value) => {
  if (!value) return 'Date TBD';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date TBD';
  return date.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let active = true;

    const loadRegistrations = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`${API_BASE}/me`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to load registrations');
        }

        if (active) {
          setRegistrations(Array.isArray(json.data) ? json.data : []);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load registrations');
          setRegistrations([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRegistrations();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>My Registrations | EventSync</title>
      </Helmet>
      <Header />
      <div
        style={{
          minHeight: 'calc(100vh - 240px)',
          background: '#f8fafc',
          padding: '100px 20px 60px'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Student Dashboard
            </div>
            <h1 style={{ margin: '10px 0 8px', color: '#0f172a' }}>My Registrations</h1>
            <p style={{ margin: 0, color: '#475569', maxWidth: '720px' }}>
              Review your registered events, check your attendance status, and reopen the QR you need to present at check-in.
            </p>
          </div>

          {loading ? (
            <div style={panelStyle}>
              <p style={{ margin: 0 }}>Loading your registrations...</p>
            </div>
          ) : error ? (
            <div style={{ ...panelStyle, color: '#991b1b', background: '#fef2f2' }}>
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div style={panelStyle}>
              <p style={{ margin: 0, color: '#64748b' }}>
                You have not registered for any events yet.
              </p>
            </div>
          ) : (
            <div style={gridStyle}>
              {registrations.map((item) => (
                <div key={item.registration.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {item.event.category} · {item.event.faculty}
                      </div>
                      <h3 style={{ margin: '10px 0 6px', color: '#0f172a' }}>{item.event.title}</h3>
                    </div>
                    <StatusPill status={item.registration.attendanceStatus} />
                  </div>

                  <div style={detailsGridStyle}>
                    <Detail label="Event Date" value={formatDate(item.event.date)} />
                    <Detail label="Venue" value={item.event.venue || 'Venue TBD'} />
                    <Detail label="Registered At" value={formatDateTime(item.registration.registeredAt)} />
                    <Detail
                      label="Check-In"
                      value={item.event.checkInActive ? 'Open for scanning' : 'Not active yet'}
                    />
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    style={primaryButtonStyle}
                  >
                    View QR Code
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedItem && (
        <StudentQrModal
          event={selectedItem.event}
          registration={selectedItem.registration}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <Footer />
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ marginTop: '6px', color: '#0f172a', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const attended = status === 'Attended';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 700,
        background: attended ? '#dcfce7' : '#fef3c7',
        color: attended ? '#166534' : '#92400e',
        whiteSpace: 'nowrap',
        height: 'fit-content'
      }}
    >
      {status}
    </span>
  );
}

function StudentQrModal({ event, registration, onClose }) {
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    let active = true;

    const generateQr = async () => {
      try {
        const image = await QRCode.toDataURL(registration.qrToken || '', {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });

        if (active) {
          setQrImage(image);
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

  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
              Event QR
            </div>
            <h3 style={{ margin: '8px 0 4px' }}>{event.title}</h3>
            <p style={{ margin: 0, opacity: 0.86 }}>
              Show this QR code to the admin when check-in is active.
            </p>
          </div>
          <button onClick={onClose} style={modalCloseButtonStyle}>×</button>
        </div>

        <div style={{ padding: '26px' }}>
          <div style={{ textAlign: 'center', background: '#f8fafc', borderRadius: '20px', padding: '18px' }}>
            {qrImage ? (
              <img
                src={qrImage}
                alt={`QR code for ${event.title}`}
                style={{ width: '100%', maxWidth: '280px', borderRadius: '16px' }}
              />
            ) : (
              <p style={{ margin: '60px 0', color: '#64748b' }}>Preparing your QR code...</p>
            )}
          </div>

          <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            <Detail label="Attendance Status" value={registration.attendanceStatus} />
            <Detail label="Registered At" value={formatDateTime(registration.registeredAt)} />
            <Detail label="Venue" value={event.venue || 'Venue TBD'} />
          </div>
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  background: '#ffffff',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
  border: '1px solid rgba(148, 163, 184, 0.18)'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  ...panelStyle,
  display: 'grid',
  gap: '18px'
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px'
};

const primaryButtonStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 16px',
  fontWeight: 600,
  cursor: 'pointer'
};

const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.78)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalCardStyle = {
  width: '100%',
  maxWidth: '520px',
  background: '#ffffff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)'
};

const modalHeaderStyle = {
  padding: '24px 26px',
  background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px'
};

const modalCloseButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#ffffff',
  fontSize: '28px',
  lineHeight: 1,
  cursor: 'pointer'
};

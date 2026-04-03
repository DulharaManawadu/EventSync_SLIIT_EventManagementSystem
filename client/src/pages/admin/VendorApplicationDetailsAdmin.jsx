import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { authFetch } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/admin/vendors';

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
    case 'Pending':  return { bg: '#fffbeb', text: '#d97706', border: '#fcd34d' };
    case 'Declined': return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
    default:         return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
  }
};

const formatDate = (v) => {
  if (!v) return 'TBD';
  const d = new Date(v);
  return isNaN(d.getTime()) ? 'TBD' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

function Field({ label, value }) {
  return (
    <div style={{
      display: 'flex', gap: '10px', fontSize: '15px', color: '#334155',
      padding: '10px 0', borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ minWidth: '140px', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>
        {label}
      </span>
      <span>{value || '—'}</span>
    </div>
  );
}

export default function VendorApplicationDetailsAdmin() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [application,   setApplication]   = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [toast,         setToast]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res  = await authFetch(`${API_BASE}/applications/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load application');
        setApplication(data.data);
      } catch (err) {
        setError(err.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setError('');
    try {
      const res  = await authFetch(`${API_BASE}/applications/${id}/${action}`, { method: 'PUT' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Action failed');
      const newStatus = action === 'approve' ? 'Approved' : 'Declined';
      setApplication(prev => ({ ...prev, status: newStatus }));
      showToast('success', action === 'approve' ? 'Application Approved' : 'Application Denied');
    } catch (err) {
      const msg = err.message || 'Action failed';
      setError(msg);
      showToast('error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const sc = application ? getStatusColor(application.status) : {};
  const brand = application
    ? (application.vendor?.brandName || `${application.vendor?.firstName || ''} ${application.vendor?.lastName || ''}`.trim() || 'Unknown Vendor')
    : '';

  return (
    <>
      <Helmet><title>Application Details – EventSync Admin</title></Helmet>
      <AdminSidebar />

      <div style={{ marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
          color: '#fff', padding: '40px 0 42px',
        }}>
          <div className="container">
            <button
              onClick={() => navigate('/vendor-management')}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: '10px', padding: '9px 18px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              ← Back to Vendor Management
            </button>
            <h1 style={{
              fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: '8px',
              letterSpacing: '-0.02em', color: '#f8fafc', textShadow: '0 2px 10px rgba(0,0,0,0.25)',
            }}>
              Application Details
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, fontSize: '16px' }}>
              Review vendor stall application and take action.
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          flex: 1, padding: '40px 0 60px',
        }}>
          <div className="container">

            {/* Toast */}
            {toast && (
              <div style={{
                position: 'fixed', right: '24px', top: '88px', zIndex: 1100,
                background: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color:      toast.type === 'success' ? '#059669' : '#dc2626',
                border:    `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
                borderRadius: '12px', padding: '14px 20px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                minWidth: '260px', fontWeight: 700, fontSize: '15px',
              }}>
                {toast.text}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontSize: '16px' }}>
                Loading application…
              </div>
            ) : !application ? (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                borderRadius: '12px', padding: '16px 20px', fontWeight: 500,
              }}>
                {error || 'Application not found.'}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Stall Info */}
                  <div style={{
                    background: '#fff', borderRadius: '20px', padding: '28px',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.07)', border: '1px solid rgba(226,232,240,0.9)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                        Stall Application
                      </h2>
                      <span style={{
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                        padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 800,
                      }}>
                        {application.status}
                      </span>
                    </div>
                    <Field label="Stall Name"  value={application.stallName} />
                    <Field label="Food Type"   value={application.foodType} />
                    <Field label="Event"       value={application.eventTitle} />
                    <Field label="Event Date"  value={formatDate(application.eventDate)} />
                    <Field label="Venue"       value={application.eventVenue} />
                    <Field label="Applied At"  value={formatDate(application.appliedAt)} />
                  </div>

                  {/* Menu Items */}
                  <div style={{
                    background: '#fff', borderRadius: '20px', padding: '28px',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.07)', border: '1px solid rgba(226,232,240,0.9)',
                  }}>
                    <h2 style={{ margin: '0 0 18px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                      Menu Items
                    </h2>
                    {Array.isArray(application.menuItems) && application.menuItems.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['#', 'Item', 'Price (LKR)'].map((h, i) => (
                              <th key={h} style={{
                                padding: '10px 14px',
                                textAlign: i === 2 ? 'right' : 'left',
                                fontSize: '13px', fontWeight: 700, color: '#64748b',
                                borderBottom: '2px solid #e2e8f0',
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {application.menuItems.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 14px', fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                              <td style={{ padding: '10px 14px', fontSize: '15px', color: '#0f172a', fontWeight: 600 }}>{item.name}</td>
                              <td style={{ padding: '10px 14px', fontSize: '15px', color: '#0f172a', textAlign: 'right', fontWeight: 700 }}>
                                {Number(item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: '#94a3b8', margin: 0 }}>No menu items listed.</p>
                    )}
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Vendor Info */}
                  <div style={{
                    background: '#fff', borderRadius: '20px', padding: '28px',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.07)', border: '1px solid rgba(226,232,240,0.9)',
                  }}>
                    <h2 style={{ margin: '0 0 18px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                      Vendor Info
                    </h2>
                    <Field label="Brand Name" value={brand} />
                    <Field label="Full Name"  value={`${application.vendor?.firstName || ''} ${application.vendor?.lastName || ''}`.trim()} />
                    <Field label="User ID"    value={application.vendor?.userId} />
                    <Field label="Email"      value={application.vendor?.email} />
                    <Field label="Contact"    value={application.vendor?.contactNumber} />
                  </div>

                  {/* Action Buttons (only for Pending) */}
                  {application.status === 'Pending' && (
                    <div style={{
                      background: '#fff', borderRadius: '20px', padding: '28px',
                      boxShadow: '0 8px 24px rgba(15,23,42,0.07)', border: '1px solid rgba(226,232,240,0.9)',
                    }}>
                      <h2 style={{ margin: '0 0 18px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                        Actions
                      </h2>
                      {error && (
                        <div style={{
                          background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                          borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
                          fontSize: '14px', fontWeight: 500,
                        }}>
                          {error}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                          onClick={() => handleAction('approve')}
                          disabled={actionLoading}
                          style={{
                            background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff',
                            border: 'none', borderRadius: '12px', padding: '14px 20px',
                            fontSize: '15px', fontWeight: 700,
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            opacity: actionLoading ? 0.7 : 1,
                            boxShadow: '0 6px 16px rgba(22,163,74,0.25)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ✓ Approve Application
                        </button>
                        <button
                          onClick={() => handleAction('deny')}
                          disabled={actionLoading}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff',
                            border: 'none', borderRadius: '12px', padding: '14px 20px',
                            fontSize: '15px', fontWeight: 700,
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            opacity: actionLoading ? 0.7 : 1,
                            boxShadow: '0 6px 16px rgba(239,68,68,0.25)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ✗ Deny Application
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status resolved banner */}
                  {application.status !== 'Pending' && (
                    <div style={{
                      background: sc.bg, border: `1px solid ${sc.border}`,
                      borderRadius: '16px', padding: '20px 24px', textAlign: 'center',
                    }}>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: sc.text }}>
                        {application.status === 'Approved'
                          ? '✓ This application has been approved.'
                          : '✗ This application has been denied.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

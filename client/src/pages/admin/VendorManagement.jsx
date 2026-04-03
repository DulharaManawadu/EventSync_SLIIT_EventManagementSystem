import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { authFetch } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/admin/vendors';
const EVENTS_API = 'http://localhost:5000/api/events';

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

export default function VendorManagement() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [vendors, setVendors]           = useState([]);
  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [toast, setToast]               = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('');
  const [eventFilter, setEventFilter]   = useState('');
  const [dateFilter, setDateFilter]     = useState('');

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [appsRes, vendorsRes, eventsRes] = await Promise.all([
        authFetch(`${API_BASE}/applications`),
        authFetch(`${API_BASE}/vendors`),
        authFetch(EVENTS_API),
      ]);
      const [appsData, vendorsData, eventsData] = await Promise.all([
        appsRes.json(), vendorsRes.json(), eventsRes.json(),
      ]);
      if (appsData.success) setApplications(appsData.data);
      else throw new Error(appsData.message || 'Failed to load applications');
      if (vendorsData.success) setVendors(vendorsData.data);
      if (eventsData.success) setEvents(Array.isArray(eventsData.data) ? eventsData.data : []);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      showToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => ({
    total:    applications.length,
    pending:  applications.filter(a => a.status === 'Pending').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    declined: applications.filter(a => a.status === 'Declined').length,
  }), [applications]);

  const filteredApps = useMemo(() => {
    let result = applications;
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (vendorFilter) result = result.filter(a => String(a.vendor?._id) === vendorFilter);
    if (eventFilter)  result = result.filter(a => String(a.event?._id)  === eventFilter);
    if (dateFilter) {
      const fd = new Date(dateFilter).toDateString();
      result = result.filter(a => a.eventDate && new Date(a.eventDate).toDateString() === fd);
    }
    return result;
  }, [applications, statusFilter, vendorFilter, eventFilter, dateFilter]);

  const clearFilters = () => {
    setVendorFilter(''); setEventFilter(''); setDateFilter('');
  };

  // ── styles ──────────────────────────────────────────────────
  const tabStyle = (active) => ({
    border:     active ? '1px solid #4f46e5' : '1px solid #e5e7eb',
    background: active ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : '#ffffff',
    color:      active ? '#ffffff' : '#475569',
    borderRadius: '14px', padding: '12px 22px', fontSize: '14px',
    fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: active
      ? '0 10px 25px rgba(79,70,229,0.24)'
      : '0 4px 12px rgba(15,23,42,0.05)',
    transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', gap: '8px',
  });

  const countBadge = (active) => ({
    background:   active ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
    color:        active ? '#fff' : '#64748b',
    borderRadius: '999px', padding: '2px 9px',
    fontSize: '13px', fontWeight: 800,
  });

  const selectStyle = {
    border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px',
    fontSize: '14px', color: '#0f172a', background: '#f8fafc', width: '100%',
  };

  const tabs = [
    { key: 'all',      label: 'All Applications', count: counts.total },
    { key: 'Pending',  label: 'Pending',           count: counts.pending },
    { key: 'Approved', label: 'Approved',           count: counts.approved },
    { key: 'Declined', label: 'Denied',             count: counts.declined },
  ];

  return (
    <>
      <Helmet><title>Vendor Management – EventSync Admin</title></Helmet>
      <AdminSidebar />

      <div style={{ marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
          color: '#fff', padding: '40px 0 42px',
        }}>
          <div className="container">
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '10px',
              letterSpacing: '-0.02em', color: '#f8fafc', textShadow: '0 2px 10px rgba(0,0,0,0.25)',
            }}>
              Vendor Management
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, fontSize: '16px' }}>
              Review and manage vendor stall applications for all events.
            </p>
          </div>
        </div>

        {/* ── Status Tabs ── */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '14px 0' }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={tabStyle(statusFilter === tab.key)}>
                  {tab.label}
                  <span style={countBadge(statusFilter === tab.key)}>{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: '70vh', padding: '32px 0 60px',
        }}>
          <div className="container">

            {/* Toast */}
            {toast && (
              <div style={{
                position: 'fixed', right: '24px', top: '88px', zIndex: 1100,
                background: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color:      toast.type === 'success' ? '#059669' : '#dc2626',
                border:    `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
                borderRadius: '12px', padding: '12px 18px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                minWidth: '260px', fontWeight: 700,
              }}>
                {toast.text}
              </div>
            )}

            {/* ── Filter Bar ── */}
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '18px 22px',
              marginBottom: '24px', boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
              display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end',
            }}>
              {/* Vendor dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 180px', minWidth: '150px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Vendor Brand
                </label>
                <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} style={selectStyle}>
                  <option value="">All Vendors</option>
                  {vendors.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.brandName || `${v.firstName} ${v.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 200px', minWidth: '160px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Event Name
                </label>
                <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} style={selectStyle}>
                  <option value="">All Events</option>
                  {events.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              {/* Date picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 150px', minWidth: '130px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Event Date
                </label>
                <input
                  type="date" value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  style={selectStyle}
                />
              </div>

              {/* Clear */}
              {(vendorFilter || eventFilter || dateFilter) && (
                <button onClick={clearFilters} style={{
                  border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b',
                  borderRadius: '10px', padding: '10px 18px', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', alignSelf: 'flex-end',
                }}>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Loading / Empty / Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontSize: '16px' }}>
                Loading applications…
              </div>
            ) : filteredApps.length === 0 ? (
              <div style={{
                background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '18px',
                padding: '60px 24px', textAlign: 'center', color: '#64748b',
                boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
              }}>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#334155' }}>
                  No Applications Found
                </p>
                <p style={{ margin: 0 }}>Adjust filters or check back when vendors have applied.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {filteredApps.map(app => {
                  const sc    = getStatusColor(app.status);
                  const brand = app.vendor?.brandName
                    || `${app.vendor?.firstName || ''} ${app.vendor?.lastName || ''}`.trim()
                    || 'Unknown Vendor';
                  return (
                    <div
                      key={app._id}
                      onClick={() => navigate(`/vendor-application-admin/${app._id}`)}
                      style={{
                        background: '#fff', borderRadius: '20px', padding: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(15,23,42,0.07)',
                        border: '1px solid rgba(226,232,240,0.9)',
                        display: 'flex', flexDirection: 'column', gap: '14px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform  = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow  = '0 14px 35px rgba(15,23,42,0.12)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform  = 'translateY(0)';
                        e.currentTarget.style.boxShadow  = '0 8px 24px rgba(15,23,42,0.07)';
                      }}
                    >
                      {/* Card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: '0 0 3px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Vendor Brand
                          </p>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                            {brand}
                          </h3>
                        </div>
                        <span style={{
                          background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                          padding: '6px 14px', borderRadius: '999px',
                          fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                          {app.status}
                        </span>
                      </div>

                      {/* Card details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {[
                          { label: 'Event',     value: app.eventTitle },
                          { label: 'Date',      value: formatDate(app.eventDate) },
                          { label: 'Food Type', value: app.foodType },
                          { label: 'Stall',     value: app.stallName },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#334155' }}>
                            <span style={{ minWidth: '74px', fontWeight: 700, color: '#0f172a' }}>{label}:</span>
                            <span>{value || '—'}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card footer */}
                      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Applied: {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

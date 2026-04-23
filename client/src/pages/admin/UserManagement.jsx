import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from './AdminSidebar';
import { authFetch } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/admin/users';

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin':   return { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' };
    case 'Student': return { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' };
    case 'Vendor':  return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
    case 'Sponsor': return { bg: '#fffbeb', text: '#d97706', border: '#fcd34d' };
    default:        return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
  }
};

const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function UserManagement() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected]     = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await authFetch(API_BASE);
      const data = await res.json();
      if (data.success) setUsers(data.data);
      else throw new Error(data.message || 'Failed to load users');
    } catch (err) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => ({
    total:   users.length,
    Admin:   users.filter(u => u.userType === 'Admin').length,
    Student: users.filter(u => u.userType === 'Student').length,
    Vendor:  users.filter(u => u.userType === 'Vendor').length,
    Sponsor: users.filter(u => u.userType === 'Sponsor').length,
  }), [users]);

  const filtered = useMemo(() => {
    let result = users;
    if (roleFilter !== 'all') result = result.filter(u => u.userType === roleFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userType.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, roleFilter, search]);

  /* ── styles ─────────────────────────────────────────────── */
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

  const inputStyle = {
    border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px',
    fontSize: '14px', color: '#0f172a', background: '#f8fafc',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  const tabs = [
    { key: 'all',     label: 'All Users',  count: counts.total   },
    { key: 'Admin',   label: 'Admins',     count: counts.Admin   },
    { key: 'Student', label: 'Students',   count: counts.Student },
    { key: 'Vendor',  label: 'Vendors',    count: counts.Vendor  },
    { key: 'Sponsor', label: 'Sponsors',   count: counts.Sponsor },
  ];

  const statCards = [
    { label: 'Total Users', value: counts.total,   color: '#4f46e5', bg: '#ede9fe' },
    { label: 'Admins',      value: counts.Admin,   color: '#5b21b6', bg: '#ede9fe' },
    { label: 'Students',    value: counts.Student, color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Vendors',     value: counts.Vendor,  color: '#059669', bg: '#ecfdf5' },
    { label: 'Sponsors',    value: counts.Sponsor, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <>
      <Helmet><title>User Management – EventSync Admin</title></Helmet>
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
              User Management
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, fontSize: '16px' }}>
              View and manage all existing users
            </p>
          </div>
        </div>

        {/* ── Role Tabs ── */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '14px 0' }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setRoleFilter(tab.key)} style={tabStyle(roleFilter === tab.key)}>
                  {tab.label}
                  <span style={countBadge(roleFilter === tab.key)}>{tab.count}</span>
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

            {/* ── Stat Cards ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              marginBottom: '28px',
            }}>
              {statCards.map(card => (
                <div key={card.label} style={{
                  background: '#fff', borderRadius: '16px', padding: '20px 18px',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
                  border: '1px solid rgba(226,232,240,0.9)',
                  display: 'flex', flexDirection: 'column', gap: '6px',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {card.label}
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: card.color, lineHeight: 1 }}>
                    {card.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Search Bar ── */}
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '18px 22px',
              marginBottom: '24px', boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
              display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 260px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Search by Name, Email or Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. John, john@example.com, Student…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={inputStyle}
                />
              </div>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b',
                    borderRadius: '10px', padding: '10px 18px', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', alignSelf: 'flex-end',
                  }}
                >
                  Clear
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

            {/* Loading / Empty / Table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontSize: '16px' }}>
                Loading users…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '18px',
                padding: '60px 24px', textAlign: 'center', color: '#64748b',
                boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
              }}>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#334155' }}>No Users Found</p>
                <p style={{ margin: 0 }}>Adjust filters or search query to find users.</p>
              </div>
            ) : (
              <div style={{
                background: '#fff', borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
                border: '1px solid rgba(226,232,240,0.9)',
                overflow: 'hidden',
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 2.5fr 1.2fr',
                  padding: '12px 24px', background: '#f8fafc',
                  borderBottom: '1px solid #e5e7eb',
                }}>
                  {['User Name', 'Email', 'Role'].map(h => (
                    <span key={h} style={{
                      fontSize: '11px', fontWeight: 800, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Table rows */}
                {filtered.map((user, idx) => {
                  const rc = getRoleColor(user.userType);
                  return (
                    <div
                      key={user._id}
                      onClick={() => setSelected(user)}
                      style={{
                        display: 'grid', gridTemplateColumns: '2fr 2.5fr 1.2fr',
                        padding: '16px 24px', alignItems: 'center',
                        borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseOut={e =>  { e.currentTarget.style.background = '#fff'; }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          {user.firstName} {user.lastName}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {user.userId}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', color: '#334155' }}>{user.email}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`,
                        padding: '4px 12px', borderRadius: '999px',
                        fontSize: '12px', fontWeight: 800, width: 'fit-content',
                      }}>
                        {user.userType}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px',
              boxShadow: '0 24px 64px rgba(15,23,42,0.22)',
              width: '100%', maxWidth: '540px', maxHeight: '85vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  User Detail
                </p>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                  {selected.firstName} {selected.lastName}
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                {(() => {
                  const rc = getRoleColor(selected.userType);
                  return (
                    <span style={{
                      background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`,
                      padding: '6px 16px', borderRadius: '999px',
                      fontSize: '12px', fontWeight: 800,
                    }}>
                      {selected.userType}
                    </span>
                  );
                })()}
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b',
                    borderRadius: '8px', padding: '6px 14px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'User ID',        value: selected.userId },
                { label: 'First Name',     value: selected.firstName },
                { label: 'Last Name',      value: selected.lastName },
                { label: 'Email',          value: selected.email },
                { label: 'Contact Number', value: selected.contactNumber },
                { label: 'Role',           value: selected.userType },
                ...(selected.userType === 'Student' ? [
                  { label: 'Faculty',       value: selected.faculty },
                  { label: 'Academic Year', value: selected.academicYear },
                ] : []),
                ...(selected.userType === 'Vendor' ? [
                  { label: 'Brand Name',              value: selected.brandName },
                  { label: 'Food Safety Certificate', value: selected.foodSafetyCertificate || '—' },
                ] : []),
                ...(selected.userType === 'Sponsor' ? [
                  { label: 'Company Name',  value: selected.companyName },
                  { label: 'Company Email', value: selected.companyEmail },
                ] : []),
                { label: 'Registered On',  value: formatDate(selected.createdAt) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '12px 16px', background: '#f8fafc', borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', minWidth: '140px' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500, textAlign: 'right' }}>
                    {value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

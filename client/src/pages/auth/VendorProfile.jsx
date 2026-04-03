import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, clearAuth, getCurrentUser } from '../../utils/auth';
import slide01 from '../../assets/images/slide-01.jpg';

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = getCurrentUser();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/vendors/profile');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Unable to fetch profile.');
      }
      const data = await res.json();
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      const res = await authFetch('http://localhost:5000/api/vendors/profile', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setMessage('Vendor removed. Redirecting to registration...');
      clearAuth();
      setTimeout(() => navigate('/register'), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ padding: '100px', textAlign: 'center' }}>Loading vendor profile...</p>;

  if (error) return <p style={{ padding: '100px', textAlign: 'center', color: '#b91c1c' }}>{error}</p>;

  return (
    <>
      <Helmet>
        <title>Vendor Profile | EventSync</title>
      </Helmet>
      <Header />

      <div style={{
        minHeight: '100vh',
        padding: '140px 20px 40px',
        backgroundImage: `url(${slide01})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.30)',
          zIndex: 1
        }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate('/vendor-dashboard')} style={{ marginBottom: '10px', padding: '8px 12px', fontSize: '0.85rem' }} className="orange-button">
            ← Back to Dashboard
          </button>

          <div style={{ background: '#fff', borderRadius: '18px', padding: '30px', boxShadow: '0 20px 70px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ margin: 0 }}>Vendor Profile</h1>
                <p style={{ color: '#475569' }}>Hello, {user?.firstName} ({user?.brandName || 'Vendor'})</p>
              </div>
              <div>
                <button onClick={() => navigate('/vendor-profile/edit')} className="orange-button" style={{ marginRight: '10px' }}>
                  Edit Profile
                </button>
                <button onClick={handleDelete} className="orange-button" style={{ backgroundColor: '#ef4444' }}>
                  Delete Profile
                </button>
              </div>
            </div>

            {message && <p style={{ color: '#065f46' }}>{message}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                <p><strong>Email:</strong> {profile.user.email}</p>
                <p><strong>Contact:</strong> {profile.user.contactNumber}</p>
                <p><strong>User ID:</strong> {profile.user.userId}</p>
              </div>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                <p><strong>Brand Name:</strong> {profile.user.brandName}</p>
                <p><strong>Vendor Since:</strong> {new Date(profile.user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <section style={{ marginBottom: '18px' }}>
              <h3>Upcoming Event Applications</h3>
              {profile.upcomingApplications.length === 0 ? (
                <p>No upcoming applications yet.</p>
              ) : (
                <div style={{ maxHeight: '220px', overflowY: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  {profile.upcomingApplications.map((app) => (
                    <div key={app._id} style={{ borderBottom: '1px dashed #cbd5e1', padding: '8px 0' }}>
                      <strong>{app.event?.title || app.eventTitle || 'Unknown Event'}</strong><br />
                      <small>{new Date(app.event?.date || app.eventDate || '').toLocaleString()}</small><br />
                      <small>Status: {app.status} | Stall: {app.stallName}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3>Past Participation</h3>
              {profile.pastParticipation.length === 0 ? (
                <p>No past participation data available.</p>
              ) : (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  {profile.pastParticipation.map((app) => (
                    <div key={app._id} style={{ borderBottom: '1px dashed #cbd5e1', padding: '8px 0' }}>
                      <strong>{app.event?.title || app.eventTitle || 'Unknown Event'}</strong><br />
                      <small>Date: {new Date(app.event?.date || app.eventDate || '').toLocaleString()}</small><br />
                      <small>Food Type: {app.foodType}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

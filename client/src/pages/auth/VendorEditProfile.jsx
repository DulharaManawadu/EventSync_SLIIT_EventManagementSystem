import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, getCurrentUser } from '../../utils/auth';
import slide01 from '../../assets/images/slide-01.jpg';

export default function VendorEditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = getCurrentUser();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await authFetch('http://localhost:5000/api/vendors/profile');
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.data.user);
      setContactNumber(data.data.user.contactNumber);
    };
    fetchProfile();
  }, []);

  const updatePhone = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await authFetch('http://localhost:5000/api/vendors/profile/contact', {
        method: 'PUT',
        body: JSON.stringify({ contactNumber })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not update contact');
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await authFetch('http://localhost:5000/api/vendors/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not update password');
      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Vendor Profile | EventSync</title>
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
        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate('/vendor-profile')} className="orange-button" style={{ marginBottom: '10px', padding: '8px 12px', fontSize: '0.85rem' }}>
            ← Back to Profile
          </button>

          <div style={{ background: '#ffffff', borderRadius: '18px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)', padding: '28px' }}>
            <h1>Edit Vendor Profile</h1>
            <p style={{ color: '#475569' }}>
              Update phone number or password (password changes require current password validation).
            </p>

            {message && <p style={{ color: '#065f46' }}>{message}</p>}
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

            <form onSubmit={updatePhone} style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Contact Number</label>
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="form-control" placeholder="0771234567" required />
              <button type="submit" className="orange-button" style={{ marginTop: '12px' }}>
                Update Contact Number
              </button>
            </form>

            <form onSubmit={updatePassword}>
              <label style={{ display: 'block', margin: '8px 0' }}>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" required />

              <label style={{ display: 'block', margin: '8px 0' }}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />

              <label style={{ display: 'block', margin: '8px 0' }}>Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="form-control" required />

              <button type="submit" className="orange-button" style={{ marginTop: '12px' }}>
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

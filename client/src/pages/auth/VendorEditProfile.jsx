import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, getCurrentUser } from '../../utils/auth';

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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Edit Vendor Profile</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>
                  Update your contact information and password settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="vendor-edit-profile-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="edit-container">
                <button onClick={() => navigate('/vendor-profile')} className="orange-button back-button">
                  <i className="fas fa-arrow-left"></i> Back to Profile
                </button>

                <div className="edit-header">
                  <h1>Edit Vendor Profile</h1>
                  <p>Update phone number or password (password changes require current password validation).</p>
                </div>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="forms-container">
                  <form onSubmit={updatePhone} className="edit-form">
                    <div className="form-header">
                      <i className="fas fa-phone"></i>
                      <h3>Update Contact Number</h3>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-mobile-alt"></i> Contact Number
                      </label>
                      <input 
                        type="text" 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)} 
                        className="form-input" 
                        placeholder="0771234567"
                        required 
                      />
                    </div>
                    <button type="submit" className="submit-btn contact-btn">
                      <i className="fas fa-sync"></i> Update Contact Number
                    </button>
                  </form>

                  <form onSubmit={updatePassword} className="edit-form">
                    <div className="form-header">
                      <i className="fas fa-lock"></i>
                      <h3>Update Password</h3>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-key"></i> Current Password
                      </label>
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        className="form-input" 
                        placeholder="Enter current password"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-shield-alt"></i> New Password
                      </label>
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="form-input" 
                        placeholder="Enter new password"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-check-double"></i> Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        className="form-input" 
                        placeholder="Confirm new password"
                        required 
                      />
                    </div>
                    <button type="submit" className="submit-btn password-btn">
                      <i className="fas fa-lock"></i> Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page-heading {
          padding: 140px 0 80px;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .page-heading::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .page-heading .header-text h2 {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.8s ease-out;
        }

        .page-heading .header-text .div-dec {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2c, #ff8f3d);
          border-radius: 2px;
          margin-bottom: 20px;
          animation: slideInLeft 0.8s ease-out 0.2s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .vendor-edit-profile-section {
          padding: 60px 0;
          background: #f8f9fc;
          min-height: 60vh;
        }

        .edit-container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .back-button {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
        }

        .edit-header {
          margin-bottom: 40px;
        }

        .edit-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .edit-header p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
        }

        .success-message, .error-message {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .success-message {
          background: #dcfce7;
          color: #065f46;
          border: 1px solid #bbf7d0;
        }

        .error-message {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .forms-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        .edit-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 30px;
          transition: all 0.3s ease;
        }

        .edit-form:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .form-header i {
          font-size: 24px;
          color: #ff6b2c;
        }

        .form-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .form-label i {
          color: #ff6b2c;
          width: 16px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #ffffff;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b2c;
          box-shadow: 0 0 0 3px rgba(255, 107, 44, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .contact-btn {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .password-btn {
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(255, 107, 44, 0.3);
        }

        .password-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }

        .orange-button {
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 44, 0.3);
        }

        .orange-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }

        @media (max-width: 768px) {
          .page-heading {
            padding: 100px 0 60px;
          }

          .page-heading .header-text h2 {
            font-size: 32px;
          }

          .vendor-edit-profile-section {
            padding: 40px 0;
          }

          .edit-container {
            padding: 24px;
          }

          .edit-header h1 {
            font-size: 24px;
          }

          .forms-container {
            gap: 24px;
          }

          .edit-form {
            padding: 20px;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}

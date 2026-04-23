import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, clearAuth, getCurrentUser } from '../../utils/auth';

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = getCurrentUser();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, appsRes] = await Promise.all([
        authFetch('http://localhost:5000/api/vendors/profile'),
        authFetch('http://localhost:5000/api/vendors/applications')
      ]);

      if (!profileRes.ok) {
        const data = await profileRes.json();
        throw new Error(data.message || 'Unable to fetch profile.');
      }

      if (!appsRes.ok) {
        const data = await appsRes.json();
        throw new Error(data.message || 'Unable to fetch applications.');
      }

      const profileData = await profileRes.json();
      const appsData = await appsRes.json();

      setProfile(profileData.data);
      setApplications(Array.isArray(appsData.data) ? appsData.data : []);
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Vendor Profile</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>
                  Manage your vendor information and account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="vendor-profile-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="profile-container">
                <button onClick={() => navigate('/vendor-dashboard')} className="orange-button back-button">
                  <i className="fas fa-arrow-left"></i> Back to Dashboard
                </button>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="profile-header">
                  <div className="profile-info">
                    <h1>Vendor Profile</h1>
                    <p>Hello, {user?.firstName} ({user?.brandName || 'Vendor'})</p>
                  </div>
                  <div className="profile-actions">
                    <button onClick={() => navigate('/vendor-profile/edit')} className="orange-button edit-btn">
                      <i className="fas fa-edit"></i> Edit Profile
                    </button>
                    <button onClick={handleDelete} className="delete-btn">
                      <i className="fas fa-trash"></i> Delete Profile
                    </button>
                  </div>
                </div>

                <div className="profile-content">
                  <div className="profile-card">
                    <div className="profile-section">
                      <h3><i className="fas fa-user"></i> Personal Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>First Name</label>
                          <span>{user?.firstName || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Last Name</label>
                          <span>{user?.lastName || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Email</label>
                          <span>{user?.email || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Contact Number</label>
                          <span>{profile?.user?.contactNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3><i className="fas fa-store"></i> Business Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Brand Name</label>
                          <span>{user?.brandName || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Food Safety Certificate</label>
                          <span>{profile?.user?.foodSafetyCertificate || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                          <label>Company Email</label>
                          <span>{profile?.user?.companyEmail || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3><i className="fas fa-chart-bar"></i> Application Statistics</h3>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-file-alt"></i>
                          </div>
                          <div className="stat-content">
                            <h4>{applications.length}</h4>
                            <p>Total Applications</p>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon approved">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <div className="stat-content">
                            <h4>{applications.filter(app => app.status === 'Approved').length}</h4>
                            <p>Approved Applications</p>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon pending">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div className="stat-content">
                            <h4>{applications.filter(app => app.status === 'Pending').length}</h4>
                            <p>Pending Applications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

        .vendor-profile-section {
          padding: 60px 0;
          background: #f8f9fc;
          min-height: 60vh;
        }

        .profile-container {
          max-width: 1200px;
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

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .profile-info h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .profile-info p {
          color: #6b7280;
          font-size: 16px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .delete-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .profile-section {
          margin-bottom: 32px;
        }

        .profile-section:last-child {
          margin-bottom: 0;
        }

        .profile-section h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-section h3 i {
          color: #ff6b2c;
          width: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item span {
          font-size: 16px;
          color: #1f2937;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-item {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          font-size: 20px;
          flex-shrink: 0;
        }

        .stat-icon.approved {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .stat-icon.pending {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
        }

        .stat-content h4 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1;
        }

        .stat-content p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
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

          .vendor-profile-section {
            padding: 40px 0;
          }

          .profile-container {
            padding: 24px;
          }

          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .profile-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}

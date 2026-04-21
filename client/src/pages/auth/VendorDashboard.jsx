import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, getCurrentUser } from '../../utils/auth';

export default function VendorDashboard() {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, appsRes] = await Promise.all([
        fetch('http://localhost:5000/api/events'),
        authFetch('http://localhost:5000/api/vendors/applications')
      ]);

      if (!eventsRes.ok) throw new Error('Failed to load events');
      if (!appsRes.ok) throw new Error('Failed to load applications');

      const eventsData = await eventsRes.json();
      const appsData = await appsRes.json();

      setEvents(Array.isArray(eventsData.data) ? eventsData.data : eventsData);
      setApplications(Array.isArray(appsData.data) ? appsData.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load vendor dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyNow = (eventId) => {
    navigate(`/vendor-events/apply/${eventId}`);
  };

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard | EventSync</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Vendor Dashboard</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>
                  Welcome, {currentUser?.firstName || 'Vendor'}. Manage your applications in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="vendor-dashboard-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Statistics Overview */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{applications.length}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{applications.filter(app => app.status === 'Pending').length}</h3>
                    <p>Pending Applications</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon approved">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{applications.filter(app => app.status === 'Approved').length}</h3>
                    <p>Approved Applications</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon events">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{events.length}</h3>
                    <p>Upcoming Events</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <button onClick={() => navigate('/vendor-profile')} className="orange-button">
                    View Profile
                  </button>
                </div>
              </div>

              {error && <div style={{ color: '#b91c1c', marginBottom: '12px' }}>{error}</div>}
              {loading ? (
                <p>Loading vendor data...</p>
              ) : (
                <>
                  <section style={{ marginBottom: '26px' }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#1f2937' }}>Your Applications</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                      {applications.filter((app) => app.status !== 'Withdrawn').length === 0 && <p>No applications yet. Browse events to apply.</p>}
                      {applications.filter((app) => app.status !== 'Withdrawn').map((app) => (
                        <div key={app._id} style={{ background: '#fff', padding: '14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
                          <h3 style={{ margin: '0 0 8px' }}>{app.event?.title || app.eventTitle || 'Unknown Event'}</h3>
                          <p style={{ margin: '0 4px', color: '#475569' }}><strong>Status:</strong> {app.status}</p>
                          <p style={{ margin: '0 4px', color: '#475569' }}><strong>Stall:</strong> {app.stallName}</p>
                          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <Link to={`/vendor-applications/${app._id}`} style={{ color: '#0f172a', fontWeight: '600' }}>Details</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#1f2937' }}>Upcoming Events to Apply</h2>
                    <div className="vendor-events-scrollbar" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                      {events.length === 0 && <p>No events available.</p>}
                      {events.map((event) => (
                        <div key={event._id} style={{ background: '#fff', marginBottom: '12px', padding: '14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                            <div>
                              <h3 style={{ margin: 0 }}>{event.title || event.eventTitle || 'Unknown Event'}</h3>
                              <p style={{ margin: '4px 0', color: '#475569' }}>{new Date(event.date).toLocaleString()}</p>
                              <p style={{ margin: '4px 0', color: '#475569' }}><strong>Venue:</strong> {event.venue || event.societyName}</p>
                            </div>
                            <button className="orange-button" onClick={() => applyNow(event._id)}>Apply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
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

        .vendor-dashboard-section {
          padding: 60px 0;
          background: #f8f9fc;
          min-height: 60vh;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2c, #ff8f3d);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          font-size: 24px;
          flex-shrink: 0;
        }

        .stat-icon.pending {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
        }

        .stat-icon.approved {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .stat-icon.events {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
        }

        .stat-content h3 {
          font-size: 32px;
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

        .vendor-dashboard-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          position: relative;
        }

        .vendor-dashboard-section h2::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #ff6b2c, #ff8f3d);
          border-radius: 2px;
        }

        .vendor-dashboard-section .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .vendor-dashboard-section .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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

        .vendor-events-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .vendor-events-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .vendor-events-scrollbar::-webkit-scrollbar-thumb {
          background: #ff6b2c;
          border-radius: 3px;
        }

        .vendor-events-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8f3d;
        }

        @media (max-width: 768px) {
          .page-heading {
            padding: 100px 0 60px;
          }

          .page-heading .header-text h2 {
            font-size: 32px;
          }

          .vendor-dashboard-section {
            padding: 40px 0;
          }

          .vendor-dashboard-section h2 {
            font-size: 20px;
          }

          .stats-overview {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }

          .stat-card {
            padding: 20px;
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }

          .stat-content h3 {
            font-size: 28px;
          }

          .stat-content p {
            font-size: 13px;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}


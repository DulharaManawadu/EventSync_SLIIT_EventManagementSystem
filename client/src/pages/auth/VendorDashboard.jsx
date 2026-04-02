import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch, getCurrentUser } from '../../utils/auth';
import slide01 from '../../assets/images/slide-01.jpg';

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
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', color: '#ffffff', textShadow: '0 2px 8px rgba(0, 0, 0, 0.65)' }}>Vendor Dashboard</h1>
              <p style={{ color: '#f8fafc', margin: 0, textShadow: '0 1px 6px rgba(0, 0, 0, 0.65)' }}>
                Welcome, {currentUser?.firstName || 'Vendor'}. Manage your applications in one place.
              </p>
            </div>
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
                <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff', textShadow: '0 2px 8px rgba(0, 0, 0, 0.65)' }}>Your Applications</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                  {applications.filter((app) => app.status !== 'Withdrawn').length === 0 && <p>No applications yet. Browse events to apply.</p>}
                  {applications.filter((app) => app.status !== 'Withdrawn').map((app) => (
                    <div key={app._id} style={{ background: '#fff', padding: '14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
                      <h3 style={{ margin: '0 0 8px' }}>{app.event?.title || 'Unknown Event'}</h3>
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
                <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#ffffff', textShadow: '0 2px 8px rgba(0, 0, 0, 0.65)' }}>Upcoming Events to Apply</h2>
                <div className="vendor-events-scrollbar" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                  {events.length === 0 && <p>No events available.</p>}
                  {events.map((event) => (
                    <div key={event._id} style={{ background: '#fff', marginBottom: '12px', padding: '14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{event.title}</h3>
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

      <Footer />
    </>
  );
}


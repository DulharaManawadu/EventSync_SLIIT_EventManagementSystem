import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

export default function VendorDashboard() {
  return (
    <>
      <Helmet>
        <title>Vendor Dashboard | EventSync</title>
      </Helmet>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 260px)', padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', borderRadius: '18px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)', padding: '36px' }}>
          <h1 style={{ color: '#0f172a', marginBottom: '18px' }}>Vendor Dashboard</h1>
          <p style={{ color: '#475569', marginBottom: '22px' }}>
            Welcome to the vendor dashboard. Access your event assignments, sponsorship opportunities, and service information from here.
          </p>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div style={{ padding: '22px', borderRadius: '16px', background: '#f1f5f9' }}>
              <h3 style={{ marginBottom: '10px' }}>Assigned Vendor Services</h3>
              <p style={{ margin: 0, color: '#475569' }}>This area will display events where your vendor services are requested or approved.</p>
            </div>
            <div style={{ padding: '22px', borderRadius: '16px', background: '#eef2ff' }}>
              <h3 style={{ marginBottom: '10px' }}>Sponsorship Matches</h3>
              <p style={{ margin: 0, color: '#475569' }}>View sponsorship collaborations and high-impact event opportunities.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

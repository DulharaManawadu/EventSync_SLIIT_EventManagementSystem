import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

export default function QrCheckin() {
  return (
    <>
      <Helmet>
        <title>QR Check-In | EventSync</title>
      </Helmet>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 260px)', padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', background: '#ffffff', borderRadius: '18px', padding: '36px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
          <h1 style={{ color: '#0f172a', marginBottom: '18px' }}>QR Check-In Management</h1>
          <p style={{ color: '#475569' }}>
            Check-in operations are an organizer feature that requires an authenticated account. If you are a vendor or administrator, please use the dashboard to activate event check-in mode.
          </p>
          <div style={{ marginTop: '24px', padding: '22px', borderRadius: '16px', background: '#eff6ff' }}>
            <h3 style={{ marginBottom: '10px' }}>How it works</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#334155' }}>
              <li>Registered attendees may use the check-in workflow once their event is approved.</li>
              <li>Organizers activate QR check-in from the internal event management tools.</li>
              <li>This page provides a dedicated access point for authenticated users.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

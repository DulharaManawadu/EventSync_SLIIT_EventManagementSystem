import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import slide01 from '../../assets/images/slide-01.jpg';

const cardStyle = {
  minHeight: '220px',
  borderRadius: '18px',
  padding: '28px',
  boxShadow: '0 24px 64px rgba(15,23,42,0.08)',
  background: '#ffffff',
  transition: 'transform 0.2s ease'
};

export default function RegisterSelection() {
  const options = [
    { label: 'Student', path: '/register/student' },
    { label: 'Admin', path: '/register/admin' },
    { label: 'Vendor', path: '/register/vendor' },
    { label: 'Sponsor', path: '/register/sponsor' }
  ];

  return (
    <>
      <Helmet>
        <title>Register | EventSync</title>
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
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '42px' }}>
            <h1 style={{ fontSize: '40px', marginBottom: '12px', color: '#ffffff' }}>Create Your Account</h1>
            <p style={{ fontSize: '16px', color: '#ffffff' }}>
              Select the user type that best describes you and complete the registration form.
            </p>
          </div>
          <div className="row g-4">
            {options.map((option) => (
              <div className="col-lg-3 col-md-6" key={option.label}>
                <Link to={option.path} style={{ textDecoration: 'none' }}>
                  <div style={cardStyle} className="hover-card">
                    <h3 style={{ color: '#111827', marginBottom: '14px' }}>{option.label}</h3>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>
                      Register as a {option.label.toLowerCase()} to access the correct account and permissions.
                    </p>
                    <div style={{ marginTop: '22px' }}>
                      <span className="orange-button" style={{ padding: '10px 18px' }}>
                        Register
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

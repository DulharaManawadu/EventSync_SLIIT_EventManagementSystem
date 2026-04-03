import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import { clearAuth, getCurrentUser } from '../utils/auth';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link to="/" className="logo">
                <img src={logoImg} alt="EventSync Logo" />
              </Link>
              <ul className="nav">
                <li className="scroll-to-section">
                  <Link to="/">Home</Link>
                </li>
                <li className="scroll-to-section">
                  <a href="#services">Services</a>
                </li>
                <li className="scroll-to-section">
                  <a href="#about">About</a>
                </li>
                <li className="has-sub">
                  <a href="#" onClick={(e) => e.preventDefault()}>Pages</a>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li>
                      <Link to="/services">Our Services</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact Us</Link>
                    </li>
                  </ul>
                </li>
                <li className="scroll-to-section">
                  <a href="#testimonials">Testimonials</a>
                </li>
                {user?.userType === 'Student' && (
                  <li>
                    <Link to="/my-registrations">My Registrations</Link>
                  </li>
                )}
                {user && user.userType === 'Vendor' && (
                  <li className="scroll-to-section">
                    <Link to="/vendor-dashboard">Vendor Dashboard</Link>
                  </li>
                )}
                <li>
                  {user ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                        Welcome {user.firstName ? user.firstName : ''}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="nav-logout-btn"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#ffffff',
                          cursor: 'pointer',
                          font: 'inherit',
                          padding: 0
                        }}
                      >
                        Logout
                      </button>
                    </span>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </li>
              </ul>
              <a className="menu-trigger">
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
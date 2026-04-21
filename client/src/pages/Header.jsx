import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import { clearAuth, getCurrentUser } from '../utils/auth';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <>
      <style>{`
        .custom-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(18, 18, 35, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .custom-header .header-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .custom-header .main-nav {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .custom-header .logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }

        .custom-header .logo img {
          height: 60px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .custom-header .nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .custom-header .nav li {
          list-style: none;
          position: relative;
        }

        .custom-header .nav a,
        .custom-header .nav button,
        .custom-header .nav .nav-text {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          text-decoration: none;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.25s ease;
          white-space: nowrap;
          border: none;
          background: transparent;
        }

        .custom-header .nav a:hover,
        .custom-header .nav .page-toggle:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .custom-header .has-sub .page-toggle {
          cursor: pointer;
        }

        .custom-header .sub-menu {
          position: absolute;
          top: 52px;
          left: 0;
          min-width: 210px;
          background: #ffffff;
          border-radius: 14px;
          padding: 8px 0;
          margin: 0;
          list-style: none;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.25s ease;
          z-index: 999;
        }

        .custom-header .has-sub:hover .sub-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .custom-header .sub-menu li a {
          display: block;
          height: auto;
          padding: 12px 18px;
          border-radius: 0;
          color: #222222;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          background: transparent;
        }

        .custom-header .sub-menu li a:hover {
          background: #f5f7fb;
          color: #ff6b2c;
        }

        .custom-header .auth-nav-item {
          margin-left: 8px;
        }

        .custom-header .auth-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .custom-header .welcome-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          max-width: 190px;
          height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .custom-header .logout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.32);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .custom-header .logout-btn:hover {
          background: #ffffff;
          color: #1f1f1f;
          border-color: #ffffff;
        }

        .custom-header .login-btn-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 8px 18px rgba(255, 107, 44, 0.28);
        }

        .custom-header .login-btn-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(255, 107, 44, 0.36);
        }

        .custom-header .menu-trigger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          flex-shrink: 0;
        }

        .custom-header .menu-trigger span {
          font-size: 22px;
          line-height: 1;
        }

        @media (max-width: 991px) {
          .custom-header .main-nav {
            min-height: 78px;
            flex-wrap: wrap;
          }

          .custom-header .menu-trigger {
            display: inline-flex;
          }

          .custom-header .nav {
            width: 100%;
            display: ${menuOpen ? 'flex' : 'none'};
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 14px 0 18px;
          }

          .custom-header .nav li,
          .custom-header .nav a,
          .custom-header .nav button,
          .custom-header .nav .nav-text {
            width: 100%;
          }

          .custom-header .nav a,
          .custom-header .nav button,
          .custom-header .nav .nav-text {
            justify-content: flex-start;
            height: 46px;
            padding: 0 14px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.08);
          }

          .custom-header .auth-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }

          .custom-header .welcome-badge,
          .custom-header .logout-btn,
          .custom-header .login-btn-link {
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }

          .custom-header .sub-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            min-width: 100%;
            margin-top: 8px;
            border-radius: 12px;
            box-shadow: none;
          }

          .custom-header .sub-menu li a {
            background: #f8f9fc;
          }
        }
      `}</style>

      <header className="custom-header">
        <div className="header-container">
          <nav className="main-nav">
            <Link to="/" className="logo">
              <img src={logoImg} alt="EventSync Logo" />
            </Link>

            <button
              type="button"
              className="menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span>☰</span>
            </button>

            <ul className="nav">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>

              <li>
                <a href="#services" onClick={() => setMenuOpen(false)}>
                  Services
                </a>
              </li>

              <li>
                <a href="#about" onClick={() => setMenuOpen(false)}>
                  About
                </a>
              </li>

              <li className="has-sub">
                <span className="nav-text page-toggle">Pages ▾</span>
                <ul className="sub-menu">
                  <li>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" onClick={() => setMenuOpen(false)}>
                      Our Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <a href="#testimonials" onClick={() => setMenuOpen(false)}>
                  Testimonials
                </a>
              </li>

              {user?.userType === 'Student' && (
                <li>
                  <Link to="/my-registrations" onClick={() => setMenuOpen(false)}>
                    My Registrations
                  </Link>
                </li>
              )}

              {user?.userType === 'Vendor' && (
                <li>
                  <Link to="/vendor-dashboard" onClick={() => setMenuOpen(false)}>
                    Vendor Dashboard
                  </Link>
                </li>
              )}

              <li className="auth-nav-item">
                {user ? (
                  <div className="auth-actions">
                    <span className="welcome-badge">
                      Welcome, {user.firstName || 'User'}
                    </span>
                    <button type="button" onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="login-btn-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
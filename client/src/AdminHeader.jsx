import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin-dashboard',
      icon: '📊',
      description: 'Analytics Overview'
    },
    {
      name: 'Event Management',
      path: '/event-approval',
      icon: '📅',
      description: 'Event Approval System'
    },
    {
      name: 'QR Generation',
      path: '/qr-generation',
      icon: '📱',
      description: 'QR Code Management'
    },
    {
      name: 'Sponsorship',
      path: '/sponsorship-management',
      icon: '🤝',
      description: 'Sponsorship Analytics'
    },
    {
      name: 'Vendor Management',
      path: '/vendor-management',
      icon: '🏢',
      description: 'Vendor Relations'
    },
    {
      name: 'User Management',
      path: '/user-management',
      icon: '👥',
      description: 'User Administration'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      backdropFilter: 'blur(15px)',
      position: 'fixed',
      width: '100%',
      height: '70px',
      top: '0',
      left: '0',
      zIndex: 9999,
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      margin: '0',
      padding: '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <Link 
          to="/admin-dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            height: '70px',
            margin: '0',
            padding: '0'
          }}
        >
          <img 
            src="/assets/images/logo.png" 
            alt="EventSync Admin" 
            style={{
              height: '40px',
              width: 'auto',
              margin: '0',
              padding: '0'
            }}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          height: '70px',
          margin: '0',
          padding: '0',
          gap: '0'
        }}>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                background: 'transparent',
                color: isActive(item.path) ? '#60a5fa' : '#ffffff',
                border: 'none',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0',
                borderRadius: '6px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                  e.currentTarget.style.color = '#60a5fa';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
            >
              {item.name}
            </button>
          ))}
          
          {/* Home Link */}
          <Link
            to="/"
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: '0',
              borderRadius: '6px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
              e.currentTarget.style.color = '#60a5fa';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            Home
          </Link>
          
          {/* Admin Button */}
          <Link
            to="/admin-dashboard"
            style={{
              background: 'linear-gradient(135deg, #43ba7f, #667eea)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: '0 0 0 10px',
              borderRadius: '20px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(67, 186, 127, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(67, 186, 127, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(67, 186, 127, 0.3)';
            }}
          >
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'none',
            padding: '10px',
            borderRadius: '6px'
          }}
          className="mobile-menu-toggle"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '0',
          right: '0',
          background: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          display: 'none'
        }}>
          {navigationItems.map((item) => (
            <div key={item.path} style={{marginBottom: '10px'}}>
              <button
                onClick={() => handleNavigation(item.path)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 15px',
                  background: isActive(item.path) ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>{item.icon}</span>
                <div>
                  <div>{item.name}</div>
                  <div style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)'}}>
                    {item.description}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

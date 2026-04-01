import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Analytics',
      path: '/admin-dashboard',
      // icon: '📊',
      description: 'Analytics Overview'
    },
    {
      name: 'Event Management',
      path: '/event-approval',
      // icon: '📅',
      description: 'Event Approval System'
    },
    {
      name: 'QR Generation',
      path: '/qr-generation',
      // icon: '📱',
      description: 'QR Code Management'
    },
    {
      name: 'Venues',
      path: '/venues',
      description: 'Venue Management'
    },
    {
      name: 'Resources',
      path: '/resources',
      description: 'Resource Management'
    },
    {
      name: 'Sponsors',
      path: '/sponsors',
      description: 'Sponsor Management'
    },
    {
      name: 'Sponsorship',
      path: '/sponsorship-management',
      // icon: '🤝',
      description: 'Sponsorship Analytics'
    },
    {
      name: 'Vendor Management',
      path: '/vendor-management',
      // icon: '🏢',
      description: 'Vendor Relations'
    },
    {
      name: 'User Management',
      path: '/user-management',
      // icon: '👥',
      description: 'User Administration'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      backdropFilter: 'blur(15px)',
      position: 'fixed',
      width: '260px',
      height: '100vh',
      top: '0',
      left: '0',
      zIndex: 9999,
      transition: 'all 0.3s ease',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        padding: '30px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link to="/admin-dashboard" style={{ textDecoration: 'none' }}>
          <img
            src={logoImg}
            alt="EventSync Admin"
            style={{
              height: '45px',
              width: 'auto',
              display: 'block'
            }}
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '8px',
        flex: 1
      }}>
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            style={{
              background: isActive(item.path) ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
              color: isActive(item.path) ? '#60a5fa' : '#e2e8f0',
              border: isActive(item.path) ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '12px',
              textAlign: 'left',
              width: '100%'
            }}
            onMouseOver={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#e2e8f0';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{
        padding: '24px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <Link
          to="/"
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#e2e8f0';
          }}
        >
          Return to Site
        </Link>

        <Link
          to="/login"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            width: '100%',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

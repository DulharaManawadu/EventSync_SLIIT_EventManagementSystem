import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AdminHeader from './AdminHeader';

export default function AdminDashboardAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedNumbers, setAnimatedNumbers] = useState({});

  // Mock data for event management system
  const statsData = {
    overview: [
      { title: 'Total Events', value: 156, change: '+12%', icon: '📅', color: '#667eea', description: 'Active events across all categories this month' },
      { title: 'Total Registrations', value: 3428, change: '+18%', icon: '👥', color: '#10b981', description: 'Student registrations for upcoming events' },
      { title: 'Pending Approvals', value: 23, change: '-5%', icon: '⏳', color: '#f59e0b', description: 'Events awaiting admin approval' },
      { title: 'Revenue Generated', value: 125000, change: '+25%', icon: '💰', color: '#ef4444', description: 'Total revenue from sponsorship and registrations' },
      { title: 'QR Check-ins', value: 2847, change: '+32%', icon: '📱', color: '#8b5cf6', description: 'Successful QR code check-ins this month' },
      { title: 'Active Sponsors', value: 47, change: '+8%', icon: '🤝', color: '#06b6d4', description: 'Sponsors supporting current events' }
    ]
  };

  const metricsData = [
    { value: '89%', label: 'Event Capacity', change: '+5%', color: '#667eea' },
    { value: '4.8', label: 'Avg Rating', change: '+0.3', color: '#10b981' },
    { value: '92%', label: 'Attendance Rate', change: '+8%', color: '#f59e0b' },
    { value: '24h', label: 'Avg Approval Time', change: '-2h', color: '#ef4444' }
  ];

  const eventData = [
    { month: 'Jan', events: 12, attendance: 245, revenue: 45000, growth: '+8%' },
    { month: 'Feb', events: 18, attendance: 389, revenue: 67000, growth: '+15%' },
    { month: 'Mar', events: 22, attendance: 478, revenue: 89000, growth: '+22%' },
    { month: 'Apr', events: 15, attendance: 312, revenue: 54000, growth: '+5%' },
    { month: 'May', events: 28, attendance: 567, revenue: 112000, growth: '+35%' },
    { month: 'Jun', events: 32, attendance: 689, revenue: 134000, growth: '+42%' }
  ];

  const categoryData = [
    { name: 'Technical', value: 35, color: '#667eea', icon: 'T', growth: '+15%', events: 89 },
    { name: 'Cultural', value: 28, color: '#10b981', icon: 'C', growth: '+8%', events: 67 },
    { name: 'Sports', value: 22, color: '#f59e0b', icon: 'S', growth: '+22%', events: 45 },
    { name: 'Workshop', value: 15, color: '#ef4444', icon: 'W', growth: '+12%', events: 28 }
  ];

  // Animate numbers on mount
  useEffect(() => {
    const animateValue = (id, start, end, duration) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Animate stats
    statsData.overview.forEach((stat, index) => {
      setTimeout(() => {
        animateValue(`stat-${index}`, 0, stat.value, 2000);
      }, index * 200);
    });
  }, []);

  const formatValue = (value, title) => {
    if (title === 'Total Revenue') {
      return `$${(value / 1000).toFixed(1)}K`;
    } else if (title === 'Active Users') {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (title === 'Conversion Rate' || title === 'System Uptime') {
      return `${value}%`;
    } else if (title === 'Monthly Growth') {
      return `+${value}%`;
    } else {
      return value.toLocaleString();
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - EventSync Analytics</title>
      </Helmet>

      <AdminHeader />

      {/* Page Heading Section - Dark Blue Theme */}
      <section className="page-heading" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '190px 0 80px',
        marginBottom: '0',
        marginTop: '70px'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>
        
        {/* Geometric Shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite 1s'
        }}></div>
        
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>
                  Data Analytics <em>Dashboard</em>
                </h2>
                <div className="div-dec"></div>
                <p>
                  Transform your data into actionable insights with our cutting-edge analytics platform. 
                  Real-time monitoring, intelligent predictions, and beautiful visualizations for campus event management.
                </p>
                <div className="buttons" style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backdropFilter: 'blur(10px)',
                      minWidth: '180px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  
                  <div className="orange-button" style={{margin: '0'}}>
                    <a href="#export">📊 Export Report</a>
                  </div>
                  <div className="green-button" style={{margin: '0'}}>
                    <a href="#refresh">🔄 Refresh Data</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div style={{
        background: '#1e3a8a',
        borderBottom: '3px solid #1e40af',
        position: 'sticky',
        top: '0',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div style={{display: 'flex', gap: '0', overflowX: 'auto', padding: '15px 0'}}>
                {[
                  { key: 'overview', label: 'Dashboard', desc: 'Main Dashboard', color: '#667eea' },
                  { key: 'events', label: 'Events', desc: 'Event Analytics', color: '#10b981' },
                  { key: 'users', label: 'Users', desc: 'User Insights', color: '#f59e0b' },
                  { key: 'sponsorship', label: 'Sponsorship', desc: 'Revenue Tracking', color: '#ef4444' },
                  { key: 'qr', label: 'QR Analytics', desc: 'Check-in Data', color: '#8b5cf6' },
                  { key: 'performance', label: 'Performance', desc: 'System Metrics', color: '#06b6d4' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background: activeTab === tab.key ? `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)` : 'transparent',
                      color: activeTab === tab.key ? '#ffffff' : '#cbd5e1',
                      border: 'none',
                      padding: '20px 30px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderBottom: activeTab === tab.key ? `4px solid #60a5fa` : '4px solid transparent',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: activeTab === tab.key ? '15px 15px 0 0' : '0',
                      margin: '0 5px'
                    }}
                    onMouseOver={(e) => {
                      if (!activeTab.includes(tab.key)) {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!activeTab.includes(tab.key)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{fontSize: '20px'}}>{tab.label}</span>
                    <div style={{textAlign: 'left'}}>
                      <div style={{fontSize: '16px', fontWeight: '700'}}>{tab.label}</div>
                      <div style={{fontSize: '12px', opacity: 0.8, fontWeight: '400'}}>{tab.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section style={{
        background: '#ffffff',
        paddingTop: '0',
        paddingBottom: '60px',
        marginTop: '0',
        position: 'relative'
      }}>
        <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        position: 'relative'
      }}>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid - Custom Layout without Bootstrap */}
              <div style={{marginBottom: '60px', marginTop: '20px'}}>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '40px',
                  textAlign: 'center'
                }}>
                  Dashboard Overview
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '30px',
                  margin: '0 auto',
                  maxWidth: '1200px'
                }}>
                  {statsData.overview.map((stat, index) => (
                    <div key={index} style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      padding: '30px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                    }}>
                      {/* Background decoration */}
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `linear-gradient(45deg, ${stat.color}08 0%, transparent 70%)`,
                        borderRadius: '50%',
                        transform: 'rotate(45deg)'
                      }}></div>
                      
                      <div style={{position: 'relative', zIndex: 1}}>
                        {/* Stat Header */}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)`,
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginRight: '15px',
                            boxShadow: `0 8px 20px ${stat.color}30`,
                            animation: 'pulse 2s infinite'
                          }}>
                            {stat.icon}
                          </div>
                          <div>
                            <h4 style={{color: '#6b7280', fontSize: '16px', fontWeight: '600', marginBottom: '5px'}}>{stat.title}</h4>
                            <div style={{
                              background: stat.change.startsWith('+') ? '#10b98115' : '#ef444415',
                              color: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'inline-block'
                            }}>
                              {stat.change}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stat Value */}
                        <div style={{fontSize: '48px', fontWeight: '800', color: '#1f2937', marginBottom: '15px'}} id={`stat-${index}`}>
                          {formatValue(stat.value, stat.title)}
                        </div>
                        
                        {/* Stat Description */}
                        <div style={{fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '20px'}}>
                          {stat.description}
                        </div>
                        
                        {/* Mini Chart */}
                        <div style={{height: '80px', background: '#f9fafb', borderRadius: '12px', position: 'relative', overflow: 'hidden'}}>
                          <svg width="100%" height="100%" style={{position: 'absolute'}}>
                            <defs>
                              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={stat.color} stopOpacity="0.8"/>
                                <stop offset="100%" stopColor={stat.color} stopOpacity="0.2"/>
                              </linearGradient>
                            </defs>
                              <polyline
                                points="10,60 30,35 50,45 70,25 90,40 110,20 130,35 150,15 170,30 190,20"
                                fill="none"
                                stroke={`url(#gradient-${index})`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline
                                points="10,60 30,35 50,45 70,25 90,40 110,20 130,35 150,15 170,30 190,20 190,80 10,80"
                                fill={`${stat.color}15`}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    
                  ))}
                </div>
              </div>

              {/* Key Metrics Overview */}
              <div style={{marginBottom: '60px'}}>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '40px',
                  textAlign: 'center'
                }}>
                  Advanced Analytics
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '30px',
                  marginBottom: '60px'
                }}>
                  {metricsData.map((metric, index) => (
                    <div key={index} style={{
                      background: '#ffffff',
                      borderRadius: '15px',
                      padding: '30px',
                      textAlign: 'center',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                    }}>
                      <div style={{fontSize: '42px', fontWeight: '800', color: metric.color, marginBottom: '10px'}}>
                        {metric.value}
                      </div>
                      <div style={{fontSize: '16px', fontWeight: '600', color: '#6b7280', marginBottom: '10px'}}>
                        {metric.label}
                      </div>
                      <div style={{
                        background: metric.change.startsWith('+') ? '#10b98115' : '#ef444415',
                        color: metric.change.startsWith('+') ? '#10b981' : '#ef4444',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Section */}
              <div className="row">
                <div className="col-lg-8">
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <h4 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '30px'}}>
                      Event Trends & Performance
                    </h4>
                    
                    <div style={{height: '350px', position: 'relative'}}>
                      {/* Bar Chart */}
                      <div style={{display: 'flex', alignItems: 'flex-end', height: '300px', gap: '20px', padding: '20px 0'}}>
                        {eventData.map((item, index) => (
                          <div key={index} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{width: '100%', background: '#f3f4f6', borderRadius: '15px', position: 'relative', height: '250px'}}>
                              <div style={{
                                position: 'absolute',
                                bottom: '0',
                                width: '100%',
                                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                borderRadius: '15px',
                                height: `${(item.events / 32) * 100}%`,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  top: '-35px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: '#1f2937',
                                  color: '#ffffff',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseOut={(e) => e.currentTarget.style.opacity = '0'}>
                                  {item.events} events
                                </div>
                              </div>
                            </div>
                            <div style={{marginTop: '20px', textAlign: 'center'}}>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '5px', fontWeight: '600'}}>{item.month}</div>
                              <div style={{fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '5px'}}>{item.events}</div>
                              <div style={{
                                fontSize: '12px',
                                color: '#10b981',
                                fontWeight: '600',
                                background: '#10b98110',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                display: 'inline-block'
                              }}>
                                {item.growth}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <h4 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '30px'}}>
                      Event Categories
                    </h4>
                    <div style={{height: '300px'}}>
                      {/* Pie Chart */}
                      <div style={{width: '200px', height: '200px', margin: '0 auto', position: 'relative'}}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          {categoryData.map((item, index) => {
                            const percentage = item.value / 100;
                            const startAngle = index === 0 ? 0 : categoryData.slice(0, index).reduce((sum, cat) => sum + cat.value, 0) / 100 * 360;
                            const endAngle = startAngle + (percentage * 360);
                            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                            const largeArc = percentage > 0.5 ? 1 : 0;
                            
                            return (
                              <g key={index}>
                                <path
                                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={item.color}
                                  stroke="#ffffff"
                                  strokeWidth="3"
                                  style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.filter = 'brightness(1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                />
                                <text
                                  x={100 + 50 * Math.cos(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                                  y={100 + 50 * Math.sin(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                                  fill="#ffffff"
                                  fontSize="14"
                                  fontWeight="600"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  {item.value}%
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                      <div style={{marginTop: '30px'}}>
                        {categoryData.map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '15px',
                            padding: '10px',
                            background: '#f9fafb',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: item.color,
                              borderRadius: '10px',
                              marginRight: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#ffffff',
                              flexShrink: 0
                            }}>
                              {item.icon}
                            </div>
                            <div style={{flex: 1}}>
                              <div style={{fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '2px'}}>{item.name}</div>
                              <div style={{fontSize: '12px', color: '#6b7280'}}>{item.events} events</div>
                            </div>
                            <div style={{
                              background: '#10b98115',
                              color: '#10b981',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {item.growth}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      
      </section>



      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
      `}</style>

<footer style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '60px 0 30px',
        marginTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>
        
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div style={{marginBottom: '20px'}}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#ffffff',
                    marginBottom: '15px'
                  }}>
                    <img 
                      src="/assets/images/logo.png" 
                      alt="EventSync"
                      style={{
                        height: '40px',
                        width: 'auto',
                        marginRight: '12px'
                      }}
                    />
                  </Link>
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  Transforming campus event management with smart QR analytics, seamless registration, and comprehensive approval workflows.
                </p>
              </div>
              
              <div style={{display: 'flex', gap: '12px', marginTop: '25px'}}>
                {['📧', '📱', '💬', '🌐'].map((icon, index) => (
                  <div key={index} style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '18px'
                  }} onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-3px)';
                  }} onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Quick Links
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                {['Create Event', 'Browse Events', 'Dashboard', 'Analytics'].map((link, index) => (
                  <li key={index} style={{marginBottom: '12px'}}>
                    <a href="#" style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }} onMouseOver={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateX(5px)';
                    }} onMouseOut={(e) => {
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}>
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Features
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                {['QR Check-in System', 'Real-time Analytics', 'Multi-venue Support', 'Sponsorship Management'].map((feature, index) => (
                  <li key={index} style={{marginBottom: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{
                        color: '#4ade80',
                        marginRight: '8px',
                        fontSize: '12px'
                      }}>✓</span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px'
                      }}>{feature}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h4 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                position: 'relative'
              }}>
                Contact Info
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: '1.8'}}>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>📍</span>
                  <span>SLIIT Campus, Malabe</span>
                </div>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>📞</span>
                  <span>+94 11 123 4567</span>
                </div>
                <div style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>✉️</span>
                  <span>info@eventsync.sliit.lk</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '10px'}}>🕐</span>
                  <span>Mon-Fri: 9AM-6PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '40px',
            paddingTop: '30px',
            textAlign: 'center'
          }}>
            <div className="row">
              <div className="col-lg-12">
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  © 2026 EventSync – Campus Event Management & QR Analytics Platform. All Rights Reserved.
                  <br />
                  <span style={{color: 'rgba(255, 255, 255, 0.4)'}}>
                    Developed for SLIIT Academic Project | Designed for Smart Campus Event Operations | 
                    <span style={{color: '#4ade80'}}> </span> Made with passion by SLIIT Students
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
  
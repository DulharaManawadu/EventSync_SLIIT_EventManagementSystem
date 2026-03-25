import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminHeader from './AdminHeader';
import Footer from './Footer';

export default function AdminDashboardAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({});

  const statsData = useMemo(
    () => [
      {
        key: 'events',
        title: 'Total Events',
        value: 156,
        change: '+12.4%',
        positive: true,
        description: 'Published and active events across all categories',
        accent: '#4f46e5',
      },
      {
        key: 'registrations',
        title: 'Registrations',
        value: 3428,
        change: '+18.2%',
        positive: true,
        description: 'Students registered for current and upcoming events',
        accent: '#059669',
      },
      {
        key: 'approvals',
        title: 'Pending Approvals',
        value: 23,
        change: '-5.1%',
        positive: false,
        description: 'Events waiting for admin review and approval',
        accent: '#d97706',
      },
      {
        key: 'revenue',
        title: 'Revenue',
        value: 125000,
        change: '+25.6%',
        positive: true,
        description: 'Sponsorship and registration revenue generated',
        accent: '#dc2626',
        prefix: '$',
      },
    ],
    []
  );

  const secondaryMetrics = [
    { label: 'Attendance Rate', value: '92%', hint: 'Above target', positive: true },
    { label: 'Avg Approval Time', value: '18h', hint: '2h faster', positive: true },
    { label: 'QR Check-ins', value: '2,847', hint: 'Strong scan completion', positive: true },
    { label: 'Active Sponsors', value: '47', hint: '6 new this month', positive: true },
  ];

  const monthlyData = [
    { month: 'Jan', events: 12, registrations: 245, revenue: 45000 },
    { month: 'Feb', events: 18, registrations: 389, revenue: 67000 },
    { month: 'Mar', events: 22, registrations: 478, revenue: 89000 },
    { month: 'Apr', events: 15, registrations: 312, revenue: 54000 },
    { month: 'May', events: 28, registrations: 567, revenue: 112000 },
    { month: 'Jun', events: 32, registrations: 689, revenue: 134000 },
  ];

  const categoryData = [
    { name: 'Technical', events: 89, percent: 35, color: '#4f46e5' },
    { name: 'Cultural', events: 67, percent: 28, color: '#10b981' },
    { name: 'Sports', events: 45, percent: 22, color: '#f59e0b' },
    { name: 'Workshops', events: 28, percent: 15, color: '#ef4444' },
  ];

  const recentActivity = [
    { title: 'Tech Summit 2025 approved', meta: '2 minutes ago • Event Management', status: 'approved' },
    { title: 'Cultural Fest reached 95% capacity', meta: '14 minutes ago • Alerts', status: 'info' },
    { title: 'New sponsor confirmed for Robotics Expo', meta: '35 minutes ago • Sponsorship', status: 'success' },
    { title: 'QR check-in sync completed for Sports Meet', meta: '1 hour ago • System', status: 'neutral' },
    { title: '2 vendor applications require review', meta: '2 hours ago • Vendor Management', status: 'warning' },
  ];

  const approvalQueue = [
    { name: 'AI Innovation Summit', organizer: 'Computer Science Club', date: '12 May 2025', venue: 'Main Auditorium', status: 'High Priority' },
    { name: 'Spring Cultural Night', organizer: 'Arts Society', date: '14 May 2025', venue: 'Open Grounds', status: 'Review Needed' },
    { name: 'Intercollege Football Cup', organizer: 'Sports Council', date: '18 May 2025', venue: 'Sports Arena', status: 'Pending Budget' },
    { name: 'Startup Networking Forum', organizer: 'Entrepreneurship Cell', date: '21 May 2025', venue: 'Seminar Hall', status: 'Ready' },
  ];

  const topPerformingEvents = [
    { name: 'Robotics Expo', registrations: 420, revenue: '$18,500', fillRate: '98%' },
    { name: 'Hackathon X', registrations: 389, revenue: '$14,200', fillRate: '94%' },
    { name: 'Leadership Summit', registrations: 301, revenue: '$12,900', fillRate: '90%' },
    { name: 'Design Workshop', registrations: 246, revenue: '$8,750', fillRate: '87%' },
  ];

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = {};

      statsData.forEach((stat) => {
        next[stat.key] = Math.floor(progress * stat.value);
      });

      setAnimatedStats(next);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [statsData]);

  const formatNumber = (value, prefix = '') => {
    if (prefix === '$') {
      return `${prefix}${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const maxEvents = Math.max(...monthlyData.map((item) => item.events));
  const totalEvents = categoryData.reduce((sum, item) => sum + item.events, 0);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'events', label: 'Events' },
    { key: 'users', label: 'Users' },
    { key: 'sponsorship', label: 'Sponsorship' },
    { key: 'qr', label: 'QR Analytics' },
    { key: 'performance', label: 'Performance' },
  ];

  const renderStatusDot = (status) => {
    const colors = {
      approved: '#10b981',
      success: '#10b981',
      info: '#4f46e5',
      neutral: '#64748b',
      warning: '#f59e0b',
    };

    return (
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          display: 'inline-block',
          background: colors[status] || '#64748b',
          flexShrink: 0,
        }}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin Analytics Dashboard - EventSync</title>
      </Helmet>

      <AdminHeader />

      <div className="admin-dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-header">
            <div>
              <span className="eyebrow">Admin Analytics</span>
              <h1>Event management command center</h1>
              <p>
                Monitor operations, approvals, registrations, sponsorship revenue,
                and event performance from one professional dashboard.
              </p>
            </div>

            <div className="header-actions">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-select"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last 12 Months</option>
              </select>

              <button className="btn btn-light">Refresh</button>
              <button className="btn btn-primary">Export Report</button>
            </div>
          </div>

          <div className="hero-summary">
            <div className="hero-card hero-card-primary">
              <div className="hero-card-top">
                <span className="hero-badge">Live overview</span>
                <span className="hero-badge subtle">Updated just now</span>
              </div>

              <h2>Operations are stable and event growth is trending upward.</h2>

              <p>
                Registrations, sponsorship revenue, and attendance performance are
                all improving this month. Approval turnaround time has also improved.
              </p>

              <div className="hero-mini-stats">
                <div>
                  <strong>+18.2%</strong>
                  <span>Registration growth</span>
                </div>
                <div>
                  <strong>92%</strong>
                  <span>Attendance rate</span>
                </div>
                <div>
                  <strong>18h</strong>
                  <span>Avg approval time</span>
                </div>
              </div>
            </div>

            <div className="hero-side-grid">
              {secondaryMetrics.map((item, index) => (
                <div className="mini-stat-card" key={index}>
                  <span className="mini-label">{item.label}</span>
                  <strong>{item.value}</strong>
                  <small className={item.positive ? 'text-success' : 'text-danger'}>
                    {item.hint}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="tabs-bar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="stats-grid">
                {statsData.map((stat) => (
                  <div className="stat-card" key={stat.key}>
                    <div className="stat-card-top">
                      <div
                        className="stat-icon"
                        style={{ background: `${stat.accent}15`, color: stat.accent }}
                      >
                        {stat.key === 'events' && '📅'}
                        {stat.key === 'registrations' && '👥'}
                        {stat.key === 'approvals' && '⏳'}
                        {stat.key === 'revenue' && '💳'}
                      </div>

                      <span className={`change-badge ${stat.positive ? 'up' : 'down'}`}>
                        {stat.change}
                      </span>
                    </div>

                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-value">
                      {formatNumber(animatedStats[stat.key] || 0, stat.prefix)}
                    </div>
                    <p className="stat-description">{stat.description}</p>

                    <div className="sparkline">
                      <svg viewBox="0 0 180 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`grad-${stat.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={stat.accent} stopOpacity="0.85" />
                            <stop offset="100%" stopColor={stat.accent} stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                        <polyline
                          fill="none"
                          stroke={`url(#grad-${stat.key})`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="0,46 20,38 40,42 60,28 80,34 100,18 120,24 140,14 160,20 180,10"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-grid">
                <div className="panel panel-large">
                  <div className="panel-header">
                    <div>
                      <h3>Monthly event performance</h3>
                      <p>Event creation trend over the selected reporting window</p>
                    </div>
                    <button className="panel-link">View details</button>
                  </div>

                  <div className="bar-chart">
                    {monthlyData.map((item) => (
                      <div className="bar-item" key={item.month}>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ height: `${(item.events / maxEvents) * 100}%` }}
                            title={`${item.events} events`}
                          />
                        </div>
                        <div className="bar-meta">
                          <span className="bar-month">{item.month}</span>
                          <strong>{item.events}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Event categories</h3>
                      <p>Category contribution across all active events</p>
                    </div>
                  </div>

                  <div className="category-list">
                    {categoryData.map((item) => (
                      <div className="category-row" key={item.name}>
                        <div className="category-top">
                          <div className="category-name-wrap">
                            <span
                              className="category-dot"
                              style={{ background: item.color }}
                            />
                            <span className="category-name">{item.name}</span>
                          </div>
                          <span className="category-percent">{item.percent}%</span>
                        </div>

                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${item.percent}%`,
                              background: item.color,
                            }}
                          />
                        </div>

                        <div className="category-footer">
                          <span>{item.events} events</span>
                          <span>{Math.round((item.events / totalEvents) * 100)}% share</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="content-grid lower-grid">
                <div className="panel panel-large">
                  <div className="panel-header">
                    <div>
                      <h3>Approval queue</h3>
                      <p>Events currently waiting for admin action</p>
                    </div>
                    <button className="panel-link">Manage approvals</button>
                  </div>

                  <div className="table-wrap">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Organizer</th>
                          <th>Date</th>
                          <th>Venue</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvalQueue.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.organizer}</td>
                            <td>{item.date}</td>
                            <td>{item.venue}</td>
                            <td>
                              <span className="table-status">{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="side-stack">
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <h3>Recent activity</h3>
                        <p>Latest platform activity across modules</p>
                      </div>
                    </div>

                    <div className="activity-list">
                      {recentActivity.map((item, index) => (
                        <div className="activity-item" key={index}>
                          {renderStatusDot(item.status)}
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.meta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <h3>Top performing events</h3>
                        <p>Highest engagement and revenue this period</p>
                      </div>
                    </div>

                    <div className="performers-list">
                      {topPerformingEvents.map((item, index) => (
                        <div className="performer-row" key={index}>
                          <div>
                            <strong>{item.name}</strong>
                            <span>{item.registrations} registrations</span>
                          </div>
                          <div className="performer-right">
                            <strong>{item.revenue}</strong>
                            <span>{item.fillRate} full</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button className="quick-action-card">
                  <span>➕</span>
                  <div>
                    <strong>Create Event</strong>
                    <small>Add a new event to the platform</small>
                  </div>
                </button>

                <button className="quick-action-card">
                  <span>✅</span>
                  <div>
                    <strong>Review Approvals</strong>
                    <small>Check pending event requests</small>
                  </div>
                </button>

                <button className="quick-action-card">
                  <span>📢</span>
                  <div>
                    <strong>Manage Sponsors</strong>
                    <small>Track sponsor performance and payments</small>
                  </div>
                </button>

                <button className="quick-action-card">
                  <span>📥</span>
                  <div>
                    <strong>Export Analytics</strong>
                    <small>Download dashboard data and reports</small>
                  </div>
                </button>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="panel empty-state">
              <h3>{tabs.find((t) => t.key === activeTab)?.label}</h3>
              <p>
                This section is ready for expansion. Keep the same design system and
                layout style for the Events, Users, Sponsorship, QR Analytics, and
                Performance pages.
              </p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        :root {
          --bg: #f8fafc;
          --panel: #ffffff;
          --panel-2: #f8fafc;
          --text: #0f172a;
          --muted: #64748b;
          --line: #e2e8f0;
          --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          --shadow-soft: 0 6px 18px rgba(15, 23, 42, 0.05);
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --success: #059669;
          --danger: #dc2626;
          --warning: #d97706;
        }

        * {
          box-sizing: border-box;
        }

        .admin-dashboard-page {
          background:
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.04) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e8f0fe 50%, #f0f9ff 100%);
          min-height: 100vh;
          padding-top: 110px;
          padding-bottom: 70px;
          position: relative;
          overflow: hidden;
        }

        /* Animated mesh gradient background */
        .admin-dashboard-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
          animation: meshGradient 20s ease-in-out infinite;
          z-index: -2;
        }

        @keyframes meshGradient {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-20px, -20px) rotate(1deg);
          }
          50% {
            transform: translate(20px, -10px) rotate(-1deg);
          }
          75% {
            transform: translate(-10px, 20px) rotate(2deg);
          }
        }

        .admin-dashboard-page::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          width: 400px;
          height: 400px;
          top: 10%;
          left: 10%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
          box-shadow: 
            0 0 60px rgba(37, 99, 235, 0.2),
            inset 0 0 60px rgba(37, 99, 235, 0.1);
          z-index: -1;
        }

        .admin-dashboard-page > .dashboard-shell::before {
          content: '';
          position: absolute;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
          width: 300px;
          height: 300px;
          bottom: 15%;
          right: 5%;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
          box-shadow: 
            0 0 40px rgba(79, 70, 229, 0.15),
            inset 0 0 40px rgba(79, 70, 229, 0.08);
          z-index: -1;
          pointer-events: none;
        }

        .dashboard-shell {
          width: min(1400px, calc(100% - 32px));
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.08);
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .dashboard-header h1 {
          margin: 0 0 10px;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.1;
          color: var(--text);
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .dashboard-header p {
          margin: 0;
          max-width: 760px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .period-select,
        .btn {
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--line);
          font-size: 14px;
          font-weight: 600;
          padding: 0 16px;
          outline: none;
          transition: 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .period-select::before,
        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .period-select:hover::before,
        .btn:hover::before {
          left: 100%;
        }

        .period-select {
          min-width: 170px;
          background: #fff;
          color: var(--text);
          cursor: pointer;
        }

        .btn {
          cursor: pointer;
        }

        .btn-light {
          background: #fff;
          color: var(--text);
        }

        .btn-light:hover,
        .period-select:hover {
          border-color: #cbd5e1;
          box-shadow: var(--shadow-soft);
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #1d4ed8 100%);
          color: #fff;
          border: none;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          position: relative;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        .btn-primary:hover::after {
          opacity: 1;
        }

        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(37, 99, 235, 0.3);
        }

        .hero-summary {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
          margin-bottom: 26px;
        }

        .hero-card,
        .panel,
        .stat-card,
        .mini-stat-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }

        .quick-action-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .quick-action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .quick-action-card:hover::before {
          left: 100%;
        }

        .quick-action-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
          border-color: rgba(37, 99, 235, 0.3);
        }

        .quick-action-card:active {
          transform: translateY(-2px) scale(1.01);
        }

        .hero-card {
          border-radius: 24px;
          padding: 28px;
        }

        .hero-card-primary {
          background:
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 25%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }

        .hero-card-top {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .hero-badge {
          display: inline-flex;
          padding: 7px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 
            0 4px 12px rgba(37, 99, 235, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .hero-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .hero-badge:hover::before {
          left: 100%;
        }

        .hero-badge.subtle {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
          color: #2563eb;
          border: 1px solid rgba(37, 99, 235, 0.2);
          box-shadow: 
            0 2px 8px rgba(37, 99, 235, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .hero-card h2 {
          margin: 0 0 12px;
          font-size: clamp(22px, 3vw, 32px);
          color: var(--text);
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
          max-width: 720px;
        }

        .hero-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
          max-width: 720px;
        }

        .hero-mini-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 24px;
        }

        .hero-mini-stats div {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--line);
        }

        .hero-mini-stats strong {
          display: block;
          font-size: 22px;
          color: var(--text);
          margin-bottom: 4px;
        }

        .hero-mini-stats span {
          color: var(--muted);
          font-size: 13px;
        }

        .hero-side-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .mini-stat-card {
          border-radius: 20px;
          padding: 20px;
        }

        .mini-stat-card .mini-label {
          display: block;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .mini-stat-card strong {
          display: block;
          font-size: 28px;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1;
        }

        .mini-stat-card small {
          font-size: 13px;
          font-weight: 600;
        }

        .text-success {
          color: var(--success);
        }

        .text-danger {
          color: var(--danger);
        }

        .tabs-bar {
          display: flex;
          gap: 8px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .tabs-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tabs-bar:hover::before {
          opacity: 1;
        }

        .tab-btn {
          border: none;
          background: transparent;
          color: var(--muted);
          font-size: 14px;
          font-weight: 700;
          padding: 12px 18px;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          border-radius: 8px;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          z-index: -1;
        }

        .tab-btn:hover {
          color: var(--text);
          transform: translateY(-1px);
        }

        .tab-btn:hover::before {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          opacity: 0.1;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .stat-card {
          border-radius: 22px;
          padding: 22px;
          transition: 0.25s ease;
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 
            0 10px 30px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(37, 99, 235, 0.05) 50%, transparent 70%);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.02) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
          transform: rotate(45deg) translate(20px, 20px);
        }

        .stat-card:hover::after {
          opacity: 1;
        }

        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border-color: rgba(37, 99, 235, 0.2);
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          position: relative;
          overflow: hidden;
          transition: 0.3s ease;
        }

        .stat-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .stat-icon:hover::before {
          left: 100%;
        }

        .stat-icon:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .change-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          transition: 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .change-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .change-badge:hover::before {
          left: 100%;
        }

        .change-badge.up {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .change-badge.down {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .change-badge:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .stat-title {
          color: var(--muted);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
          position: relative;
          background: linear-gradient(135deg, var(--text) 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: 0.3s ease;
        }

        .stat-card:hover .stat-value {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: scale(1.05);
        }

        .stat-description {
          margin: 0 0 16px;
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
          min-height: 44px;
        }

        .sparkline {
          height: 56px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          border-radius: 14px;
          padding: 8px;
        }

        .sparkline svg {
          width: 100%;
          height: 100%;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .lower-grid {
          align-items: start;
        }

        .panel {
          border-radius: 24px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 
            0 10px 30px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
        }

        .panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .panel:hover::before {
          opacity: 1;
        }

        .panel:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .panel-large {
          min-height: 100%;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
        }

        .panel-header h3 {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .panel-header p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .panel-link {
          border: none;
          background: transparent;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .bar-chart {
          height: 300px;
          display: flex;
          align-items: flex-end;
          gap: 18px;
        }

        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .bar-track {
          width: 100%;
          height: 240px;
          border-radius: 18px;
          background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
          position: relative;
          overflow: hidden;
          border: 1px solid #eef2f7;
        }

        .bar-fill {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 18px;
          background: linear-gradient(180deg, #4f46e5 0%, #2563eb 100%);
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.22);
        }

        .bar-meta {
          text-align: center;
        }

        .bar-month {
          display: block;
          color: var(--muted);
          font-size: 13px;
          margin-bottom: 4px;
        }

        .bar-meta strong {
          color: var(--text);
          font-size: 16px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .category-row {
          padding: 16px;
          border-radius: 18px;
          background: #fbfdff;
          border: 1px solid #eef2f7;
        }

        .category-top,
        .category-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .category-name-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .category-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .category-name {
          font-weight: 700;
          color: var(--text);
        }

        .category-percent {
          font-weight: 800;
          color: var(--text);
        }

        .progress-track {
          width: 100%;
          height: 12px;
          background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 100%);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          margin: 12px 0 10px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, var(--progress-color, #4f46e5) 0%, var(--progress-color-light, #2563eb) 100%);
          box-shadow: 
            0 2px 8px rgba(37, 99, 235, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: progressGrow 1.5s ease-out;
        }

        .progress-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 20px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6));
          border-radius: 999px;
          animation: progressShine 3s ease-in-out infinite;
        }

        .category-footer {
          font-size: 13px;
          color: var(--muted);
        }

        .table-wrap {
          overflow-x: auto;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          overflow: hidden;
        }

        .dashboard-table thead {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
          backdrop-filter: blur(10px);
        }

        .dashboard-table thead th {
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--muted);
          padding: 16px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          position: relative;
        }

        .dashboard-table thead th::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20px;
          right: 20px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent);
        }

        .dashboard-table tbody tr {
          transition: 0.2s ease;
          position: relative;
        }

        .dashboard-table tbody tr::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.02), transparent);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .dashboard-table tbody tr:hover::before {
          opacity: 1;
        }

        .dashboard-table tbody tr:hover {
          background: rgba(37, 99, 235, 0.02);
          transform: scale(1.01);
        }

        .dashboard-table tbody td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.5);
          color: var(--text);
          position: relative;
          z-index: 1;
          font-size: 14px;
        }

        .table-status {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 700;
        }

        .side-stack {
          display: grid;
          gap: 20px;
        }

        .activity-list,
        .performers-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .activity-item,
        .performer-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-item:last-child,
        .performer-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-item strong,
        .performer-row strong {
          display: block;
          color: var(--text);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .activity-item span,
        .performer-row span {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .performer-right {
          text-align: right;
          flex-shrink: 0;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .quick-action-card {
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid var(--line);
          cursor: pointer;
          text-align: left;
          transition: 0.25s ease;
        }

        .quick-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }

        .quick-action-card span {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .quick-action-card strong {
          display: block;
          color: var(--text);
          font-size: 15px;
          margin-bottom: 4px;
        }

        .quick-action-card small {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .empty-state {
          text-align: center;
          padding: 70px 20px;
        }

        .empty-state h3 {
          margin-bottom: 10px;
        }

        .empty-state p {
          margin: 0 auto;
          max-width: 650px;
          color: var(--muted);
          line-height: 1.7;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .hero-summary,
          .content-grid {
            grid-template-columns: 1fr;
          }

          .hero-side-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hero-mini-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard-page {
            padding-top: 95px;
          }

          .dashboard-shell {
            width: min(100% - 20px, 1400px);
          }

          .stats-grid,
          .quick-actions,
          .hero-side-grid {
            grid-template-columns: 1fr;
          }

          .panel,
          .stat-card,
          .hero-card,
          .mini-stat-card {
            padding: 18px;
            border-radius: 18px;
          }

          .dashboard-header {
            margin-bottom: 22px;
          }

          .dashboard-header h1 {
            font-size: 30px;
          }

          .bar-chart {
            gap: 10px;
          }

          .bar-track {
            height: 180px;
          }
        }

        @keyframes progressGrow {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes progressShine {
          0%, 100% {
            transform: translateX(0);
            opacity: 0;
          }
          50% {
            transform: translateX(-10px);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(-5deg);
          }
          66% {
            transform: translateY(-20px) rotate(3deg);
          }
        }

        /* Sparkle particles for cards */
        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(45deg, transparent 30%, rgba(37, 99, 235, 0.05) 50%, transparent 70%);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }

        .stat-card:hover::before {
          opacity: 1;
          transform: rotate(45deg) translate(20px, 20px);
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
          }
        }
        
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
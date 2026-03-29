import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../AdminSidebar';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap
} from 'recharts';

const API_BASE = 'http://localhost:5000/api/events/analytics/advanced';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];
const STATUS_COLORS = {
  Approved: '#10b981', Pending: '#f59e0b', Rejected: '#ef4444',
  Draft: '#64748b', Completed: '#2563eb', Cancelled: '#94a3b8'
};

export default function AdminDashboardAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activePreset, setActivePreset] = useState('all');
  const dashboardRef = useRef(null);

  const fetchAnalytics = useCallback(async (start, end) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);
      const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch analytics');
      setData(json.data);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics('', ''); }, [fetchAnalytics]);

  const handleApplyFilter = () => {
    setActivePreset('custom');
    fetchAnalytics(startDate, endDate);
  };

  const handlePreset = (preset) => {
    setActivePreset(preset);
    const now = new Date();
    let start = '';
    let end = now.toISOString().split('T')[0];
    if (preset === '7d') {
      const d = new Date(now); d.setDate(d.getDate() - 7); start = d.toISOString().split('T')[0];
    } else if (preset === '30d') {
      const d = new Date(now); d.setDate(d.getDate() - 30); start = d.toISOString().split('T')[0];
    } else if (preset === '90d') {
      const d = new Date(now); d.setDate(d.getDate() - 90); start = d.toISOString().split('T')[0];
    } else if (preset === '1y') {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 1); start = d.toISOString().split('T')[0];
    } else { start = ''; end = ''; }
    setStartDate(start);
    setEndDate(end);
    fetchAnalytics(start, end);
  };

  const handleExportPDF = async () => {
    if (!data) return;
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentW = W - margin * 2;
      let y = 0;

      // Helper: add section title
      const addTitle = (title, color = [79, 70, 229]) => {
        if (y > H - 40) { pdf.addPage(); y = 15; }
        pdf.setFillColor(...color);
        pdf.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'F');
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.text(title, margin + 4, y + 5.5);
        y += 12;
        pdf.setTextColor(15, 23, 42);
      };

      // ═══════════════════════════════════════
      // PAGE 1: Cover + KPI Summary
      // ═══════════════════════════════════════
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, W, 40, 'F');
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.text('EventSync', margin, 18);
      pdf.setFontSize(14);
      pdf.setTextColor(167, 139, 250);
      pdf.text('Analytics Report', margin + 52, 18);
      pdf.setFontSize(9);
      pdf.setTextColor(200, 210, 230);
      pdf.text(`Generated: ${new Date().toLocaleString()}  |  Period: All Time`, margin, 30);

      // Accent line
      pdf.setFillColor(79, 70, 229);
      pdf.rect(0, 40, W, 1.5, 'F');
      y = 48;

      // KPI Table
      const s = data.summary || {};
      addTitle('Key Performance Indicators');
      autoTable(pdf, {
        startY: y,
        head: [['Metric', 'Value', 'Metric', 'Value']],
        body: [
          ['Total Events', String(s.totalEvents || 0), 'Upcoming', String(s.upcomingEvents || 0)],
          ['Past Events', String(s.pastEvents || 0), 'Featured', String(s.featuredEvents || 0)],
          ['Total Capacity', (s.totalCapacity || 0).toLocaleString(), 'QR Enabled', String(s.qrEnabledEvents || 0)],
          ['Total Budget', `LKR ${(s.totalBudget || 0).toLocaleString()}`, 'Avg Budget', `LKR ${(s.avgBudget || 0).toLocaleString()}`],
          ['Max Budget', `LKR ${(s.maxBudget || 0).toLocaleString()}`, 'Avg Duration', `${s.avgEventDurationHours || 0} hours`],
          ['Sponsored', `${s.sponsoredEvents || 0} (${s.sponsorshipRate || 0}%)`, 'Max Duration', `${s.maxEventDurationHours || 0} hours`]
        ],
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 45 }, 2: { fontStyle: 'bold', cellWidth: 35 }, 3: { cellWidth: 45 } },
        margin: { left: margin, right: margin }
      });
      y = pdf.lastAutoTable.finalY + 10;

      // Status breakdown
      if (data.breakdown?.byStatus?.length) {
        addTitle('Events by Status', [16, 185, 129]);
        autoTable(pdf, {
          startY: y,
          head: [['Status', 'Count', '%']],
          body: data.breakdown.byStatus.map(s => {
            const pct = data.summary.totalEvents > 0 ? ((s.value / data.summary.totalEvents) * 100).toFixed(1) : '0';
            return [s.name, String(s.value), `${pct}%`];
          }),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [16, 185, 129] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Category breakdown
      if (data.breakdown?.byCategory?.length) {
        addTitle('Events by Category', [245, 158, 11]);
        autoTable(pdf, {
          startY: y,
          head: [['Category', 'Count', '%']],
          body: data.breakdown.byCategory.map(c => {
            const pct = data.summary.totalEvents > 0 ? ((c.value / data.summary.totalEvents) * 100).toFixed(1) : '0';
            return [c.name, String(c.value), `${pct}%`];
          }),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [245, 158, 11] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Faculty breakdown
      if (data.breakdown?.byFaculty?.length) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Events by Faculty', [99, 102, 241]);
        autoTable(pdf, {
          startY: y,
          head: [['Faculty', 'Count', '%']],
          body: data.breakdown.byFaculty.map(f => {
            const pct = data.summary.totalEvents > 0 ? ((f.value / data.summary.totalEvents) * 100).toFixed(1) : '0';
            return [f.name, String(f.value), `${pct}%`];
          }),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [99, 102, 241] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Event type breakdown
      if (data.breakdown?.byEventType?.length) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Event Type Distribution', [20, 184, 166]);
        autoTable(pdf, {
          startY: y,
          head: [['Type', 'Count', '%']],
          body: data.breakdown.byEventType.map(e => {
            const pct = data.summary.totalEvents > 0 ? ((e.value / data.summary.totalEvents) * 100).toFixed(1) : '0';
            return [e.name, String(e.value), `${pct}%`];
          }),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [20, 184, 166] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Sponsorship
      if (data.breakdown?.sponsorship) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Sponsorship Overview', [16, 185, 129]);
        const sp = data.breakdown.sponsorship;
        autoTable(pdf, {
          startY: y,
          head: [['Type', 'Count', '%']],
          body: [
            ['Sponsored', String(sp.sponsored), `${sp.rate}%`],
            ['Not Sponsored', String(sp.nonSponsored), `${(100 - sp.rate).toFixed(1)}%`]
          ],
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [16, 185, 129] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Venue breakdown
      if (data.breakdown?.byVenue?.length) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Top Venues', [20, 184, 166]);
        autoTable(pdf, {
          startY: y,
          head: [['Venue', 'Events']],
          body: data.breakdown.byVenue.map(v => [v.name, String(v.value)]),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [20, 184, 166] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // ═══════════════════════════════════════
      // BUDGET & BREAKDOWN TABLES
      // ═══════════════════════════════════════
      if (data.breakdown?.budgetByCategory?.length) {
        pdf.addPage();
        y = 12;
        addTitle('Budget Allocation by Category', [139, 92, 246]);
        autoTable(pdf, {
          startY: y,
          head: [['Category', 'Events', 'Total Budget (LKR)', 'Avg Budget (LKR)']],
          body: data.breakdown.budgetByCategory.map(b => [
            b.name, String(b.count), b.budget.toLocaleString(), b.avgBudget.toLocaleString()
          ]),
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [139, 92, 246] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      if (data.breakdown?.budgetByFaculty?.length) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Budget by Faculty', [6, 182, 212]);
        autoTable(pdf, {
          startY: y,
          head: [['Faculty', 'Events', 'Total Budget (LKR)', 'Avg Budget (LKR)']],
          body: data.breakdown.budgetByFaculty.map(b => [
            b.name, String(b.count), b.budget.toLocaleString(), b.avgBudget.toLocaleString()
          ]),
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [6, 182, 212] },
          columnStyles: { 0: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // ═══════════════════════════════════════
      // TOP EVENTS TABLE
      // ═══════════════════════════════════════
      if (data.topEvents?.length) {
        pdf.addPage();
        y = 12;
        addTitle('Top Events by Capacity');
        autoTable(pdf, {
          startY: y,
          head: [['#', 'Event', 'Category', 'Faculty', 'Status', 'Capacity', 'Budget (LKR)']],
          body: data.topEvents.map((e, i) => [
            String(i + 1), e.title, e.category, e.faculty, e.status,
            (e.capacity || 0).toLocaleString(), (e.budget || 0).toLocaleString()
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [79, 70, 229], fontSize: 8 },
          columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 1: { fontStyle: 'bold', cellWidth: 45 } },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin }
        });
        y = pdf.lastAutoTable.finalY + 10;
      }

      // Tags
      if (data.breakdown?.tags?.length) {
        if (y > H - 60) { pdf.addPage(); y = 12; }
        addTitle('Popular Tags', [236, 72, 153]);
        autoTable(pdf, {
          startY: y,
          head: [['Tag', 'Count', 'Tag', 'Count']],
          body: (() => {
            const tags = data.breakdown.tags;
            const rows = [];
            for (let i = 0; i < tags.length; i += 2) {
              rows.push([
                tags[i]?.name || '', String(tags[i]?.value || ''),
                tags[i + 1]?.name || '', String(tags[i + 1]?.value || '')
              ]);
            }
            return rows;
          })(),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [236, 72, 153] },
          columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } },
          margin: { left: margin, right: margin }
        });
      }

      // Footer on last page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`Page ${i} of ${totalPages}  |  EventSync Analytics`, margin, H - 6);
        pdf.text('Confidential', W - margin - 20, H - 6);
      }

      pdf.save(`EventSync_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const formatNum = (n) => (n !== undefined && n !== null ? Number(n).toLocaleString() : '0');

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(10px)',
        padding: '12px 16px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ margin: '0 0 6px', color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: '2px 0', color: p.color, fontSize: 12, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  const renderPieLabel = ({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : '';

  // ─── Styles ──────────────────────────────
  const S = {
    page: { background: 'linear-gradient(135deg, #f8fafc 0%, #e8f0fe 50%, #f0f9ff 100%)',
      minHeight: '100vh', marginLeft: 260, padding: '32px 40px 60px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
    eyebrow: { display: 'inline-flex', padding: '6px 14px', borderRadius: 999,
      background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: 12,
      fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 },
    h1: { margin: '0 0 8px', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800,
      color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.15 },
    subtitle: { margin: 0, color: '#64748b', fontSize: 15, lineHeight: 1.7, maxWidth: 650 },
    filterBar: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(226,232,240,0.8)', borderRadius: 16,
      padding: '14px 18px', marginBottom: 28, boxShadow: '0 4px 16px rgba(15,23,42,0.06)' },
    presetBtn: (active) => ({
      border: active ? '1px solid #4f46e5' : '1px solid #e2e8f0',
      background: active ? 'linear-gradient(135deg,#4f46e5,#2563eb)' : '#fff',
      color: active ? '#fff' : '#475569', borderRadius: 10, padding: '8px 16px',
      fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: '0.2s ease',
      boxShadow: active ? '0 4px 12px rgba(79,70,229,0.25)' : 'none' }),
    dateInput: { border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px',
      fontSize: 13, fontWeight: 600, color: '#0f172a', background: '#fff', outline: 'none' },
    applyBtn: { background: 'linear-gradient(135deg,#4f46e5,#2563eb)', color: '#fff',
      border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13,
      fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' },
    exportBtn: { background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff',
      border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13,
      fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.3)', marginLeft: 'auto' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 },
    statCard: (accent) => ({ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(226,232,240,0.8)', borderRadius: 18, padding: '20px 22px',
      boxShadow: '0 6px 20px rgba(15,23,42,0.05)', borderLeft: `4px solid ${accent}` }),
    statLabel: { fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' },
    statValue: { fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 4 },
    statHint: { fontSize: 11, color: '#94a3b8', fontWeight: 600 },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 },
    panel: { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(226,232,240,0.8)', borderRadius: 20, padding: 22,
      boxShadow: '0 8px 24px rgba(15,23,42,0.06)' },
    panelTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    panelSub: { margin: '0 0 16px', fontSize: 12, color: '#64748b' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', fontSize: 10, textTransform: 'uppercase', fontWeight: 800,
      letterSpacing: '0.05em', color: '#64748b', padding: '10px 12px',
      borderBottom: '2px solid #e2e8f0', background: 'rgba(248,250,252,0.8)' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#334155' },
    badge: (status) => ({ display: 'inline-flex', padding: '4px 10px', borderRadius: 999,
      fontSize: 10, fontWeight: 700,
      background: STATUS_COLORS[status] ? `${STATUS_COLORS[status]}18` : '#f3f4f6',
      color: STATUS_COLORS[status] || '#64748b' }),
    tagChip: { display: 'inline-block', padding: '5px 12px', borderRadius: 999,
      fontSize: 12, fontWeight: 600, margin: '3px 4px',
      background: 'rgba(79,70,229,0.08)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.15)' },
    emptyState: { background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 16,
      padding: '40px 20px', textAlign: 'center', color: '#64748b' },
    loadingState: { display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', fontSize: 18, color: '#64748b', fontWeight: 600 }
  };

  // ─── Loading / Error ─────────────────
  if (loading) {
    return (
      <><Helmet><title>Loading Analytics... - EventSync</title></Helmet><AdminSidebar />
        <div style={S.page}><div style={S.loadingState}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p>Loading analytics data...</p></div></div></div></>
    );
  }
  if (error) {
    return (
      <><Helmet><title>Analytics Error - EventSync</title></Helmet><AdminSidebar />
        <div style={S.page}><div style={{ ...S.emptyState, borderColor: '#fca5a5', background: '#fef2f2', color: '#991b1b' }}>
          <h3 style={{ marginBottom: 8 }}>Failed to load analytics</h3><p>{error}</p>
          <button onClick={() => fetchAnalytics(startDate, endDate)} style={{ ...S.applyBtn, marginTop: 16 }}>Retry</button>
        </div></div></>
    );
  }

  const summary = data?.summary || {};
  const breakdown = data?.breakdown || {};
  const monthly = data?.trends?.monthly || [];
  const budgetTrend = data?.trends?.budgetMonthly || [];
  const topEvents = data?.topEvents || [];

  return (
    <>
      <Helmet><title>Admin Analytics Dashboard - EventSync</title></Helmet>
      <AdminSidebar />

      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <span style={S.eyebrow}>📊 Real-Time Analytics</span>
            <h1 style={S.h1}>Event Analytics Dashboard</h1>
            <p style={S.subtitle}>
              Comprehensive insights powered by real event data. Explore category breakdowns, budget allocations, and export reports.
            </p>
          </div>
          <button onClick={handleExportPDF} style={S.exportBtn}>📥 Export PDF</button>
        </div>

        <div ref={dashboardRef}>
          {/* KPI Cards */}
          <div style={S.statsGrid}>
            {[
              { label: 'Total Events', value: formatNum(summary.totalEvents), hint: `${formatNum(summary.upcomingEvents)} upcoming · ${formatNum(summary.pastEvents)} past`, accent: '#4f46e5' },
              { label: 'Total Capacity', value: formatNum(summary.totalCapacity), hint: `Across all events`, accent: '#06b6d4' },
              { label: 'Total Budget', value: `LKR ${formatNum(summary.totalBudget)}`, hint: `Avg: LKR ${formatNum(summary.avgBudget)}`, accent: '#f59e0b' },
              { label: 'Sponsored Events', value: `${formatNum(summary.sponsoredEvents)}`, hint: `${summary.sponsorshipRate}% sponsorship rate`, accent: '#10b981' },
              { label: 'QR Enabled', value: formatNum(summary.qrEnabledEvents), hint: `Smart check-in ready`, accent: '#8b5cf6' },
              { label: 'Avg Duration', value: `${summary.avgEventDurationHours || 0}h`, hint: `Max: ${summary.maxEventDurationHours || 0}h`, accent: '#ec4899' },
              { label: 'Featured Events', value: formatNum(summary.featuredEvents), hint: `Highlighted on platform`, accent: '#ef4444' },
              { label: 'Max Budget', value: `LKR ${formatNum(summary.maxBudget)}`, hint: `Highest single event`, accent: '#14b8a6' }
            ].map((card, i) => (
              <div key={i} style={S.statCard(card.accent)}>
                <div style={S.statLabel}>{card.label}</div>
                <div style={S.statValue}>{card.value}</div>
                <div style={S.statHint}>{card.hint}</div>
              </div>
            ))}
          </div>

          {/* Row 1: Status Pie + Category Pie */}
          <div style={S.chartsGrid} data-pdf-chart="Events by Status & Category">
            <div style={S.panel}>
              <h3 style={S.panelTitle}>Events by Status</h3>
              <p style={S.panelSub}>Event approval status distribution</p>
              {breakdown.byStatus?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={breakdown.byStatus} cx="50%" cy="50%" outerRadius={95} innerRadius={50}
                      dataKey="value" nameKey="name" label={renderPieLabel} labelLine={false}>
                      {breakdown.byStatus.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>

            <div style={S.panel}>
              <h3 style={S.panelTitle}>Events by Category</h3>
              <p style={S.panelSub}>Distribution across event categories</p>
              {breakdown.byCategory?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={breakdown.byCategory} cx="50%" cy="50%" outerRadius={95} innerRadius={50}
                      dataKey="value" nameKey="name" label={renderPieLabel} labelLine={false}>
                      {breakdown.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>
          </div>

          {/* Monthly Event Trend */}
          {monthly.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }} data-pdf-chart="Monthly Event Trend">
              <h3 style={S.panelTitle}>Monthly Event Trend</h3>
              <p style={S.panelSub}>Number of events and total capacity over time</p>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Area type="monotone" dataKey="events" stroke="#4f46e5" fill="url(#gradEvents)" strokeWidth={2.5} name="Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Row 2: Faculty Bar + Event Type Pie */}
          <div style={S.chartsGrid} data-pdf-chart="Events by Faculty & Event Type">
            <div style={S.panel}>
              <h3 style={S.panelTitle}>Events by Faculty</h3>
              <p style={S.panelSub}>Event distribution across university faculties</p>
              {breakdown.byFaculty?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={breakdown.byFaculty} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} width={75} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Events" radius={[0, 8, 8, 0]}>
                      {breakdown.byFaculty.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>

            <div style={S.panel}>
              <h3 style={S.panelTitle}>Event Type Distribution</h3>
              <p style={S.panelSub}>Physical vs Virtual vs Hybrid events</p>
              {breakdown.byEventType?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={breakdown.byEventType} cx="50%" cy="50%" outerRadius={95} innerRadius={50}
                      dataKey="value" nameKey="name" label={renderPieLabel} labelLine={false}>
                      {breakdown.byEventType.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>
          </div>

          {/* NEW: Budget Allocation by Category (Bar) */}
          {breakdown.budgetByCategory?.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }} data-pdf-chart="Budget Allocation by Category">
              <h3 style={S.panelTitle}>Budget Allocation by Category</h3>
              <p style={S.panelSub}>Total budget allocated per event category (LKR)</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={breakdown.budgetByCategory} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Bar dataKey="budget" name="Total Budget (LKR)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgBudget" name="Avg Budget (LKR)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Row 3: Sponsorship Pie + QR Adoption Pie */}
          <div style={S.chartsGrid} data-pdf-chart="Sponsorship & QR Adoption">
            <div style={S.panel}>
              <h3 style={S.panelTitle}>Sponsorship Overview</h3>
              <p style={S.panelSub}>Events with vs without sponsorship enabled</p>
              {breakdown.sponsorship ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Sponsored', value: breakdown.sponsorship.sponsored },
                      { name: 'Not Sponsored', value: breakdown.sponsorship.nonSponsored }
                    ]} cx="50%" cy="50%" outerRadius={95} innerRadius={50}
                      dataKey="value" nameKey="name" label={renderPieLabel} labelLine={false}>
                      <Cell fill="#10b981" /><Cell fill="#e2e8f0" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>

            <div style={S.panel}>
              <h3 style={S.panelTitle}>QR Check-in Adoption</h3>
              <p style={S.panelSub}>Events with QR code check-in enabled</p>
              {breakdown.qrAdoption?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={breakdown.qrAdoption} cx="50%" cy="50%" outerRadius={95} innerRadius={50}
                      dataKey="value" nameKey="name" label={renderPieLabel} labelLine={false}>
                      <Cell fill="#8b5cf6" /><Cell fill="#e2e8f0" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={S.emptyState}>No data</div>}
            </div>
          </div>

          {/* Top Venues (Horizontal Bar) */}
          {breakdown.byVenue?.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }} data-pdf-chart="Top Venues">
              <h3 style={S.panelTitle}>Top Venues</h3>
              <p style={S.panelSub}>Most frequently used event venues</p>
              <ResponsiveContainer width="100%" height={Math.max(280, breakdown.byVenue.length * 36)}>
                <BarChart data={breakdown.byVenue} layout="vertical" margin={{ top: 5, right: 30, left: 160, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} domain={[0, 'auto']} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} width={150} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Events" radius={[0, 6, 6, 0]} fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* NEW: Budget by Faculty (Bar) */}
          {breakdown.budgetByFaculty?.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }} data-pdf-chart="Budget Distribution by Faculty">
              <h3 style={S.panelTitle}>Budget Distribution by Faculty</h3>
              <p style={S.panelSub}>Total budget allocation across different faculties (LKR)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={breakdown.budgetByFaculty} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Bar dataKey="budget" name="Total Budget (LKR)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}



          {/* NEW: Popular Tags */}
          {breakdown.tags?.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }}>
              <h3 style={S.panelTitle}>Popular Tags</h3>
              <p style={S.panelSub}>Most frequently used event tags across all events</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '8px 0' }}>
                {breakdown.tags.map((tag, i) => (
                  <span key={i} style={{
                    ...S.tagChip,
                    fontSize: Math.max(11, Math.min(18, 10 + tag.value * 2)),
                    opacity: Math.max(0.6, Math.min(1, 0.5 + tag.value * 0.1))
                  }}>
                    {tag.name} <span style={{ color: '#94a3b8', fontSize: 10 }}>({tag.value})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Monthly Budget Trend (Line) */}
          {budgetTrend.length > 0 && (
            <div style={{ ...S.panel, marginBottom: 24 }}>
              <h3 style={S.panelTitle}>Monthly Budget Trend</h3>
              <p style={S.panelSub}>Total and average budget allocated per month</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={budgetTrend} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Line type="monotone" dataKey="totalBudget" stroke="#f59e0b" strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 4 }} name="Total Budget (LKR)" />
                  <Line type="monotone" dataKey="avgBudget" stroke="#8b5cf6" strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }} strokeDasharray="5 5" name="Avg Budget (LKR)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Events Table */}
          {topEvents.length > 0 && (
            <div style={S.panel}>
              <h3 style={S.panelTitle}>Top Events by Capacity</h3>
              <p style={S.panelSub}>Largest events ranked by total capacity</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>#</th>
                      <th style={S.th}>Event</th>
                      <th style={S.th}>Category</th>
                      <th style={S.th}>Faculty</th>
                      <th style={S.th}>Society</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Capacity</th>
                      <th style={S.th}>Budget (LKR)</th>
                      <th style={S.th}>Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEvents.map((event, i) => (
                      <tr key={event.id} style={{ transition: '0.15s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(79,70,229,0.03)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...S.td, fontWeight: 800, color: '#4f46e5' }}>{i + 1}</td>
                        <td style={{ ...S.td, fontWeight: 700, color: '#0f172a', maxWidth: 180 }}>{event.title}</td>
                        <td style={S.td}>{event.category}</td>
                        <td style={S.td}>{event.faculty}</td>
                        <td style={{ ...S.td, fontSize: 12 }}>{event.society}</td>
                        <td style={S.td}><span style={S.badge(event.status)}>{event.status}</span></td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{formatNum(event.capacity)}</td>
                        <td style={{ ...S.td, fontWeight: 600, color: '#f59e0b' }}>{formatNum(event.budget)}</td>
                        <td style={{ ...S.td, fontSize: 12 }}>{event.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
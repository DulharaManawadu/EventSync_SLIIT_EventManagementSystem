import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/auth';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authFetch('http://localhost:5000/api/events/analytics')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load analytics data');
        }
        setStats(data.data?.summary || {});
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2>Event Analytics Summary</h2>
      <ul>
        <li>Total events: {stats.totalEvents}</li>
        <li>Upcoming events: {stats.upcomingEvents}</li>
        <li>Past events: {stats.pastEvents}</li>
        <li>Total capacity: {stats.totalCapacity}</li>
        <li>Total registrations: {stats.totalRegistrations}</li>
      </ul>
    </div>
  );
}

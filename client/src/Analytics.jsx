import React, { useEffect, useState } from 'react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/events/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
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

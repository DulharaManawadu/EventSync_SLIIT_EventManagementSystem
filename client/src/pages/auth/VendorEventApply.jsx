import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch } from '../../utils/auth';

export default function VendorEventApply() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [stallName, setStallName] = useState('');
  const [foodType, setFoodType] = useState('');
  const [menuItems, setMenuItems] = useState([{ name: '', price: '' }]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        setEvent(data.data || data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadEvent();
  }, [eventId]);

  const updateMenuItem = (index, item) => {
    const updated = menuItems.slice();
    updated[index] = item;
    setMenuItems(updated);
  };

  const addMenuRow = () => setMenuItems([...menuItems, { name: '', price: '' }]);
  const removeMenuRow = (index) => setMenuItems(menuItems.filter((_, idx) => idx !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const filtered = menuItems
      .map((item) => ({ name: item.name.trim(), price: Number(item.price) }))
      .filter((item) => item.name && !Number.isNaN(item.price) && item.price >= 0);

    if (!stallName || !foodType || filtered.length === 0) {
      setError('Please complete stall details and include at least one valid menu item.');
      return;
    }

    try {
      const res = await authFetch('http://localhost:5000/api/vendors/applications', {
        method: 'POST',
        body: JSON.stringify({ eventId, stallName, foodType, menuItems: filtered })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application failed');

      setMessage(data.message);
      setTimeout(() => navigate('/vendor-dashboard'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Apply for Stall | EventSync</title>
      </Helmet>
      <Header />

      <div style={{ minHeight: 'calc(100vh - 260px)', padding: '80px 20px', background: '#eef2ff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <button onClick={() => navigate('/vendor-dashboard')} className="orange-button" style={{ marginBottom: '14px' }}>
            ← Back to Vendor Dashboard
          </button>

          <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)', padding: '28px' }}>
            <h1>Apply for Stall</h1>
            {event ? (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <h3>{event.title}</h3>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <p>Location: {event.venue || event.societyName}</p>
              </div>
            ) : (
              <p>Loading event</p>
            )}

            {message && <p style={{ color: '#065f46' }}>{message}</p>}
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label>Stall Name</label>
                <input type="text" value={stallName} onChange={(e) => setStallName(e.target.value)} className="form-control" required />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Food Type</label>
                <input type="text" value={foodType} onChange={(e) => setFoodType(e.target.value)} className="form-control" required />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4>Menu Items</h4>
                {menuItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMenuItem(index, { ...item, name: e.target.value })}
                      placeholder="Item name"
                      className="form-control"
                      required
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateMenuItem(index, { ...item, price: e.target.value })}
                      placeholder="Rs."
                      className="form-control"
                      min="0"
                      required
                    />
                    {menuItems.length > 1 && (
                      <button type="button" className="orange-button" onClick={() => removeMenuRow(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="orange-button" onClick={addMenuRow}>
                  + Add Item
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label>
                  <input type="checkbox" required /> I hereby confirm that the above details are true and acknowledge that the university can suspend or deny my application if the provided details are incorrect.
                </label>
              </div>

              <button type="submit" className="orange-button">
                Apply for a Stall
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

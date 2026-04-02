import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch } from '../../utils/auth';
import slide01 from '../../assets/images/slide-01.jpg';

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

      <div style={{ minHeight: '100vh', padding: '140px 20px 40px', backgroundImage: `url(${slide01})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div style={{ maxWidth: '1100px', margin: 'auto', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '18px', padding: '36px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)' }}>
          <button onClick={() => navigate('/vendor-dashboard')} className="orange-button" style={{ marginBottom: '20px', padding: '8px 12px', fontSize: '0.85rem' }}>
            ← Back to Vendor Dashboard
          </button>

          <h1 style={{ marginBottom: '32px' }}>Apply for Stall</h1>
          
          {event ? (
            <div style={{ marginBottom: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>{event.title}</h3>
              <p style={{ marginBottom: '8px', color: '#64748b' }}>Date: {new Date(event.date).toLocaleString()}</p>
              <p style={{ marginBottom: 0, color: '#64748b' }}>Location: {event.venue || event.societyName}</p>
            </div>
          ) : (
            <p>Loading event</p>
          )}

          {message && <p style={{ color: '#065f46', marginBottom: '24px', padding: '12px', background: '#dcfce7', borderRadius: '8px' }}>{message}</p>}
          {error && <p style={{ color: '#b91c1c', marginBottom: '24px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Stall Name</label>
              <input type="text" value={stallName} onChange={(e) => setStallName(e.target.value)} className="form-control" required />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Food Type</label>
              <input type="text" value={foodType} onChange={(e) => setFoodType(e.target.value)} className="form-control" required />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>Menu Items</h4>
              {menuItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateMenuItem(index, { ...item, name: e.target.value })}
                    placeholder="Item name"
                    className="form-control"
                    required
                    style={{ flex: 2 }}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateMenuItem(index, { ...item, price: e.target.value })}
                    placeholder="Rs."
                    className="form-control"
                    min="0"
                    required
                    style={{ flex: 1 }}
                  />
                  {menuItems.length > 1 && (
                    <button type="button" className="orange-button" onClick={() => removeMenuRow(index)} style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="orange-button" onClick={addMenuRow} style={{ marginTop: '12px', padding: '8px 14px', fontSize: '0.85rem' }}>
                + Add Item
              </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', lineHeight: '1.5', color: '#374151' }}>
                <input type="checkbox" required style={{ marginTop: '2px' }} />
                <span>I hereby confirm that the above details are true and acknowledge that the university can suspend or deny my application if the provided details are incorrect.</span>
              </label>
            </div>

            <button type="submit" className="orange-button" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              Apply for a Stall
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

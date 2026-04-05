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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Apply for Stall</h2>
                <div className="div-dec" />
                <p style={{color: '#ffffff', fontSize: '16px', fontWeight: '400', marginTop: '15px'}}>
                  Complete your stall application for the selected event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="vendor-apply-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="apply-container">
                <button onClick={() => navigate('/vendor-dashboard')} className="orange-button back-button">
                  <i className="fas fa-arrow-left"></i> Back to Vendor Dashboard
                </button>

                {event ? (
                  <div className="event-info-card">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <div className="event-details">
                        <div className="event-detail">
                          <i className="fas fa-calendar"></i>
                          <span>{new Date(event.date).toLocaleString()}</span>
                        </div>
                        <div className="event-detail">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{event.venue || event.societyName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Loading event</p>
                )}

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="apply-form">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-store"></i> Stall Name
                    </label>
                    <input 
                      type="text" 
                      value={stallName} 
                      onChange={(e) => setStallName(e.target.value)} 
                      className="form-input" 
                      placeholder="Enter your stall name"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-utensils"></i> Food Type
                    </label>
                    <input 
                      type="text" 
                      value={foodType} 
                      onChange={(e) => setFoodType(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g., Chinese, Italian, Bakery"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-list"></i> Menu Items
                    </label>
                    <div className="menu-items">
                      {menuItems.map((item, index) => (
                        <div key={index} className="menu-item-row">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMenuItem(index, { ...item, name: e.target.value })}
                            placeholder="Item name"
                            className="form-input"
                            required
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenuItem(index, { ...item, price: e.target.value })}
                            placeholder="Rs."
                            className="form-input price-input"
                            min="0"
                            required
                          />
                          {menuItems.length > 1 && (
                            <button type="button" className="remove-btn" onClick={() => removeMenuRow(index)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="add-item-btn" onClick={addMenuRow}>
                        <i className="fas fa-plus"></i> Add Menu Item
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>I hereby confirm that the above details are true and acknowledge that the university can suspend or deny my application if the provided details are incorrect.</span>
                    </label>
                  </div>

                  <button type="submit" className="submit-btn">
                    <i className="fas fa-paper-plane"></i> Apply for a Stall
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page-heading {
          padding: 140px 0 80px;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .page-heading::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .page-heading .header-text h2 {
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.8s ease-out;
        }

        .page-heading .header-text .div-dec {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2c, #ff8f3d);
          border-radius: 2px;
          margin-bottom: 20px;
          animation: slideInLeft 0.8s ease-out 0.2s both;
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .vendor-apply-section {
          padding: 60px 0;
          background: #f8f9fc;
          min-height: 60vh;
        }

        .apply-container {
          max-width: 1000px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .back-button {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
        }

        .event-info-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 30px;
        }

        .event-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .event-details {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .event-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
        }

        .event-detail i {
          color: #ff6b2c;
        }

        .success-message, .error-message {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .success-message {
          background: #dcfce7;
          color: #065f46;
          border: 1px solid #bbf7d0;
        }

        .error-message {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .apply-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 16px;
        }

        .form-label i {
          color: #ff6b2c;
          width: 20px;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #ffffff;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b2c;
          box-shadow: 0 0 0 3px rgba(255, 107, 44, 0.1);
        }

        .price-input {
          max-width: 120px;
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .menu-item-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .remove-btn {
          padding: 8px 12px;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .add-item-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
        }

        .add-item-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          accent-color: #ff6b2c;
        }

        .submit-btn {
          padding: 16px 32px;
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          align-self: flex-start;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 44, 0.4);
        }

        .orange-button {
          background: linear-gradient(135deg, #ff6b2c, #ff8f3d);
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 44, 0.3);
        }

        .orange-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }

        @media (max-width: 768px) {
          .page-heading {
            padding: 100px 0 60px;
          }

          .page-heading .header-text h2 {
            font-size: 32px;
          }

          .vendor-apply-section {
            padding: 40px 0;
          }

          .apply-container {
            padding: 24px;
          }

          .event-details {
            flex-direction: column;
            gap: 12px;
          }

          .menu-item-row {
            flex-direction: column;
            align-items: stretch;
          }

          .price-input {
            max-width: 100%;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}

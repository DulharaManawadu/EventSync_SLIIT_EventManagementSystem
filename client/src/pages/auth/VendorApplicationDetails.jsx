import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { authFetch } from '../../utils/auth';
import slide01 from '../../assets/images/slide-01.jpg';

export default function VendorApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stallName, setStallName] = useState('');
  const [foodType, setFoodType] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadApp = async () => {
    try {
      const res = await authFetch(`http://localhost:5000/api/vendors/applications/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to load application');
      }
      const data = await res.json();
      setApplication(data.data);
      setStallName(data.data.stallName);
      setFoodType(data.data.foodType);
      setMenuItems(data.data.menuItems || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadApp();
  }, [id]);

  const updateMenuRow = (index, value) => {
    const copy = [...menuItems];
    copy[index] = value;
    setMenuItems(copy);
  };

  const addMenuItem = () => setMenuItems([...menuItems, { name: '', price: '' }]);
  const removeMenuItem = (index) => setMenuItems(menuItems.filter((_, i) => i !== index));

  const onSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      stallName,
      foodType,
      menuItems: menuItems.map((item) => ({ ...item, price: Number(item.price) })).filter((item) => item.name && !Number.isNaN(item.price))
    };

    if (!payload.stallName || !payload.foodType || payload.menuItems.length === 0) {
      setError('Please provide valid stall and menu details.');
      return;
    }

    try {
      const res = await authFetch(`http://localhost:5000/api/vendors/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update application.');
      setMessage(data.message);
      setApplication(data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const onWithdraw = async () => {
    setError('');
    if (!window.confirm('Are you sure you want to withdraw?')) return;

    try {
      const res = await authFetch(`http://localhost:5000/api/vendors/applications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to withdraw');
      setMessage(data.message);
      setTimeout(() => navigate('/vendor-dashboard'), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Application Details | EventSync</title>
      </Helmet>
      <Header />

      <div className="vendor-application-details-page" style={{ minHeight: '100vh', padding: '140px 20px 40px', backgroundImage: `url(${slide01})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div style={{ maxWidth: '1000px', margin: 'auto', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '18px', padding: '36px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)' }}>
          <button onClick={() => navigate('/vendor-dashboard')} className="orange-button" style={{ marginBottom: '10px' }}>
            ← Back to Dashboard
          </button>

          <h1 style={{ marginBottom: '24px' }}>Application Details</h1>
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            {message && <p style={{ color: '#065f46' }}>{message}</p>}

            {application ? (
              <div>
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px' }}>
                  <p style={{ marginBottom: '12px' }}><strong>Event:</strong> {application.event?.title || application.eventTitle || 'Deleted Event'}</p>
                  <p style={{ marginBottom: '12px' }}><strong>Date:</strong> {new Date(application.event?.date || application.eventDate || '').toLocaleString()}</p>
                  <p style={{ marginBottom: '12px' }}><strong>Location:</strong> {application.event?.venue || application.event?.societyName || application.eventVenue || 'N/A'}</p>
                  <p style={{ marginBottom: 0 }}><strong>Status:</strong> {application.status}</p>
                </div>

                {isEditing ? (
                  <form onSubmit={onSave} style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Stall Name</label>
                      <input value={stallName} onChange={(e) => setStallName(e.target.value)} className="form-control" required />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Food Type</label>
                      <input value={foodType} onChange={(e) => setFoodType(e.target.value)} className="form-control" required />
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '18px' }}>
                      <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: '#0f172a' }}>Menu Items</h4>
                      {menuItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            className="form-control"
                            value={item.name}
                            onChange={(e) => updateMenuRow(idx, { ...item, name: e.target.value })}
                            placeholder="Item"
                            required
                          />
                          <input
                            type="number"
                            className="form-control"
                            value={item.price}
                            onChange={(e) => updateMenuRow(idx, { ...item, price: e.target.value })}
                            placeholder="Rs."
                            min="0"
                            required
                          />
                          <button type="button" className="orange-button" onClick={() => removeMenuItem(idx)}>
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="orange-button" onClick={addMenuItem} style={{ marginTop: '8px', marginBottom: '16px' }}>
                        + Add Item
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <button type="submit" className="orange-button">
                        Save Application
                      </button>
                      <button type="button" className="orange-button" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ marginBottom: '18px', fontSize: '1.1rem', color: '#0f172a' }}>Submitted Stall Details</h4>
                      <div style={{ borderLeft: '3px solid #f97316', paddingLeft: '16px', marginBottom: '16px' }}>
                        <p style={{ marginBottom: '12px' }}><strong>Stall Name:</strong> {application.stallName}</p>
                        <p style={{ marginBottom: '12px' }}><strong>Food Type:</strong> {application.foodType}</p>
                      </div>
                      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '12px' }}>Menu Items:</strong>
                        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                          {application.menuItems.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '8px' }}>{item.name} - Rs {Number(item.price).toFixed(2)}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
                        <button onClick={() => setIsEditing(true)} className="orange-button">Edit Application</button>
                        <button onClick={onWithdraw} className="orange-button">
                          Withdraw Application
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading application details...</p>
            )}
        </div>
      </div>

      <style>{`
        .vendor-application-details-page .orange-button {
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

        .vendor-application-details-page .orange-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }
      `}</style>

      <Footer />
    </>
  );
}

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

      <div style={{ minHeight: '100vh', padding: '140px 20px 40px', background: '#eef2ff' }}>
        <div style={{ maxWidth: '900px', margin: 'auto' }}>
          <button onClick={() => navigate('/vendor-profile')} className="orange-button" style={{ marginBottom: '10px', padding: '8px 12px', fontSize: '0.85rem' }}>
            ← Back to Profile
          </button>

          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)' }}>
            <h1>Application Details</h1>
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            {message && <p style={{ color: '#065f46' }}>{message}</p>}

            {application ? (
              <>
                <p><strong>Event:</strong> {application.event?.title}</p>
                <p><strong>Date:</strong> {new Date(application.event?.date).toLocaleString()}</p>
                <p><strong>Location:</strong> {application.event?.venue || application.event?.societyName}</p>
                <p><strong>Status:</strong> {application.status}</p>

                {isEditing ? (
                  <form onSubmit={onSave}>
                    <label>Stall Name</label>
                    <input value={stallName} onChange={(e) => setStallName(e.target.value)} className="form-control" required />
                    <label style={{ marginTop: '8px' }}>Food Type</label>
                    <input value={foodType} onChange={(e) => setFoodType(e.target.value)} className="form-control" required />

                    <h4>Menu</h4>
                    {menuItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
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
                    <button type="button" className="orange-button" onClick={addMenuItem} style={{ marginBottom: '12px' }}>
                      + Add Item
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="orange-button">
                        Save Application
                      </button>
                      <button type="button" className="orange-button" onClick={() => setIsEditing(false)} style={{ background: '#64748b' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h4>Submitted Stall Details</h4>
                    <p><strong>Stall Name:</strong> {application.stallName}</p>
                    <p><strong>Food Type:</strong> {application.foodType}</p>
                    <div>
                      <strong>Menu Items:</strong>
                      <ul>
                        {application.menuItems.map((item, idx) => (
                          <li key={idx}>{item.name} - Rs. {item.price}</li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="orange-button">Edit Application</button>
                    <button onClick={onWithdraw} className="orange-button" style={{ marginLeft: '10px', backgroundColor: '#ef4444' }}>
                      Withdraw Application
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>Loading application details...</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

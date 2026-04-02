import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { saveAuth } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      saveAuth({ token: data.data.token, user: data.data.user });

      const redirectPath = location.state?.from?.pathname || getRedirectPath(data.data.user.userType);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login failed', err);
      setError('Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (userType) => {
    if (userType === 'Vendor') return '/vendor-dashboard';
    if (userType === 'Sponsor') return '/sponsers-events';
    return '/#';
  };

  return (
    <>
      <Helmet>
        <title>Login | EventSync</title>
      </Helmet>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 260px)', padding: '80px 20px', background: '#f5f7fb' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 70px rgba(15, 23, 42, 0.08)', padding: '36px' }}>
          <h2 style={{ marginBottom: '24px', color: '#0f172a' }}>Member Login</h2>
          <p style={{ marginBottom: '24px', color: '#475569' }}>
            Enter your registered email and password to continue.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#334155', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="name@example.com"
                required
              />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#334155', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div style={{ color: '#b91c1c', marginBottom: '18px' }}>{error}</div>}
            <button
              type="submit"
              className="orange-button"
              style={{ width: '100%', minHeight: '48px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: '22px', color: '#64748b' }}>
            Don't have an account? <Link to="/register">Click here to register</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

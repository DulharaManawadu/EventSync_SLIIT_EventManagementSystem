import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import { saveAuth } from '../../utils/auth';

const API_BASE = 'http://localhost:5000/api/auth';
const ALLOWED_TYPES = ['student', 'admin', 'vendor', 'sponsor'];
const FACULTY_OPTIONS = ['Computing', 'Engineering', 'Business', 'Humanities'];
const ACADEMIC_YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const STUDENT_PREFIX = {
  Computing: 'IT',
  Engineering: 'EN',
  Business: 'BS',
  Humanities: 'HM'
};

function deriveUserType(param) {
  const normalized = param?.toLowerCase();
  if (!normalized) return null;
  const match = ALLOWED_TYPES.find((type) => type === normalized);
  return match ? match.charAt(0).toUpperCase() + match.slice(1) : null;
}

function validatePassword(password) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

function isValidSriLankanPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function generateAutoId(prefix) {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${random}`;
}

export default function RegisterForm() {
  const { userType: routeType } = useParams();
  const userType = useMemo(() => deriveUserType(routeType), [routeType]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    faculty: 'Computing',
    academicYear: '1st Year',
    userId: '',
    password: '',
    confirmPassword: '',
    brandName: '',
    companyName: '',
    brandEmail: '',
    certificateName: '',
    certificateType: '',
    certificateFile: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userType) return;
    if (userType === 'Admin') {
      setForm((prev) => ({ ...prev, userId: generateAutoId('AD') }));
    }
    if (userType === 'Vendor') {
      setForm((prev) => ({ ...prev, userId: generateAutoId('VN') }));
    }
    if (userType === 'Sponsor') {
      setForm((prev) => ({ ...prev, userId: generateAutoId('SP') }));
    }
    if (userType === 'Student') {
      setForm((prev) => ({ ...prev, userId: '' }));
    }
  }, [userType]);

  useEffect(() => {
    if (userType === 'Student' && form.faculty) {
      setForm((prev) => ({ ...prev, userId: prev.userId }));
    }
  }, [form.faculty, userType]);

  const passwordRules = validatePassword(form.password);
  const allPasswordRulesSatisfied = Object.values(passwordRules).every(Boolean);

  const studentIdError = useMemo(() => {
    if (userType !== 'Student') return '';
    if (!form.userId) return '';
    const prefix = STUDENT_PREFIX[form.faculty];
    if (!/^([A-Z]{2})[0-9]{8}$/.test(form.userId)) {
      return 'User ID must be 2 uppercase letters followed by 8 digits.';
    }
    if (!form.userId.startsWith(prefix)) {
      return 'Enter a valid student ID.';
    }
    return '';
  }, [form.userId, form.faculty, userType]);

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCertificateChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setForm((prev) => ({ ...prev, certificateName: '', certificateType: '', certificateFile: null }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      certificateName: file.name,
      certificateType: file.type,
      certificateFile: file
    }));
  };

  const getPayload = () => {
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim(),
      userType,
      userId: form.userId.trim().toUpperCase(),
      password: form.password,
      confirmPassword: form.confirmPassword
    };

    if (userType === 'Student') {
      payload.faculty = form.faculty;
      payload.academicYear = form.academicYear;
    }
    if (userType === 'Vendor') {
      payload.brandName = form.brandName.trim();
    }
    if (userType === 'Sponsor') {
      payload.companyName = form.companyName.trim();
      payload.companyEmail = form.brandEmail.trim();
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!userType) {
      setError('Please select a valid registration type.');
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.contactNumber || !form.password || !form.confirmPassword) {
      setError('Please fill all required fields.');
      return;
    }

    if (!isValidSriLankanPhone(form.contactNumber.trim())) {
      setError('Contact number must be a 10 digit Sri Lankan number.');
      return;
    }

    if (!allPasswordRulesSatisfied) {
      setError('Password does not satisfy all requirements.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (userType === 'Student' && studentIdError) {
      setError(studentIdError);
      return;
    }

    if (userType === 'Vendor' && !form.certificateFile) {
      setError('Food safety certificate is required.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${API_BASE}/register/${userType.toLowerCase()}`;
      let options = {
        method: 'POST'
      };

      if (userType === 'Vendor') {
        const formData = new FormData();
        formData.append('firstName', form.firstName.trim());
        formData.append('lastName', form.lastName.trim());
        formData.append('email', form.email.trim());
        formData.append('contactNumber', form.contactNumber.trim());
        formData.append('brandName', form.brandName.trim());
        formData.append('password', form.password);
        formData.append('confirmPassword', form.confirmPassword);
        formData.append('foodSafetyCertificate', form.certificateFile);
        options.body = formData;
      } else {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(getPayload());
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      saveAuth({ token: data.data.token, user: data.data.user });
      setSuccess('Registration successful. Redirecting...');
      setTimeout(() => {
        if (data.data.user.userType === 'Vendor') {
          navigate('/vendor-dashboard', { replace: true });
        } else if (data.data.user.userType === 'Sponsor') {
          navigate('/sponsers-events', { replace: true });
        } else {
          navigate('/#', { replace: true });
        }
      }, 800);
    } catch (err) {
      console.error(err);
      setError('Unable to complete registration, please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <>
        <Helmet>
          <title>Register | EventSync</title>
        </Helmet>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Invalid registration type. Please return to <Link to="/register">selection</Link>.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{userType} Registration | EventSync</title>
      </Helmet>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 260px)', padding: '70px 20px', background: '#eef2ff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', background: '#fff', borderRadius: '18px', padding: '32px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>{userType} Registration</h2>
          <p style={{ color: '#475569', marginBottom: '28px' }}>
            Complete the form below to create your {userType.toLowerCase()} account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => handleInput('firstName', e.target.value)} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => handleInput('lastName', e.target.value)} className="form-control" required />
              </div>
              {userType !== 'Sponsor' && (
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" value={form.email} onChange={(e) => handleInput('email', e.target.value)} className="form-control" required />
                </div>
              )}
              {userType === 'Sponsor' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Personal Email</label>
                    <input type="email" value={form.email} onChange={(e) => handleInput('email', e.target.value)} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Brand / Company Email</label>
                    <input type="email" value={form.brandEmail} onChange={(e) => handleInput('brandEmail', e.target.value)} className="form-control" required />
                  </div>
                </>
              )}
              <div className="col-md-6">
                <label className="form-label">Contact Number</label>
                <input type="tel" value={form.contactNumber} onChange={(e) => handleInput('contactNumber', e.target.value)} className="form-control" placeholder="0771234567" required />
              </div>
              {userType === 'Student' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Faculty</label>
                    <select className="form-select" value={form.faculty} onChange={(e) => handleInput('faculty', e.target.value)}>
                      {FACULTY_OPTIONS.map((faculty) => (
                        <option key={faculty} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Academic Year</label>
                    <select className="form-select" value={form.academicYear} onChange={(e) => handleInput('academicYear', e.target.value)}>
                      {ACADEMIC_YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {userType === 'Vendor' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Brand Name</label>
                    <input type="text" value={form.brandName} onChange={(e) => handleInput('brandName', e.target.value)} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Food Safety Certificate</label>
                    <input type="file" accept="image/*,.pdf" onChange={handleCertificateChange} className="form-control" />
                  </div>
                </>
              )}
              {userType === 'Sponsor' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Brand / Company Name</label>
                    <input type="text" value={form.companyName} onChange={(e) => handleInput('companyName', e.target.value)} className="form-control" required />
                  </div>
                </>
              )}
              <div className="col-md-6">
                <label className="form-label">User Type</label>
                <input type="text" value={userType} readOnly className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">User ID</label>
                <input type="text" value={form.userId} readOnly={userType !== 'Student'} onChange={(e) => userType === 'Student' && handleInput('userId', e.target.value.toUpperCase())} className="form-control" />
                {userType === 'Student' && (
                  <small className="text-muted">Prefix must match faculty ({STUDENT_PREFIX[form.faculty]})</small>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" value={form.password} onChange={(e) => handleInput('password', e.target.value)} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => handleInput('confirmPassword', e.target.value)} className="form-control" required />
              </div>
            </div>
            <div style={{ marginTop: '22px', padding: '18px', background: '#f8fafc', borderRadius: '14px' }}>
              <h5 style={{ marginBottom: '14px', color: '#0f172a' }}>Password Requirements</h5>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                {[
                  { label: 'Minimum 8 characters', valid: passwordRules.minLength },
                  { label: 'At least 1 uppercase letter', valid: passwordRules.uppercase },
                  { label: 'At least 1 lowercase letter', valid: passwordRules.lowercase },
                  { label: 'At least 1 number', valid: passwordRules.number },
                  { label: 'At least 1 special character', valid: passwordRules.special }
                ].map((rule) => (
                  <li key={rule.label} style={{ marginBottom: '8px', color: rule.valid ? '#065f46' : '#7f1d1d' }}>
                    {rule.valid ? '✓' : '•'} {rule.label}
                  </li>
                ))}
              </ul>
            </div>
            {error && <div style={{ color: '#b91c1c', marginTop: '20px' }}>{error}</div>}
            {success && <div style={{ color: '#065f46', marginTop: '20px' }}>{success}</div>}
            <button type="submit" className="orange-button" style={{ marginTop: '24px', width: '100%', minHeight: '48px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Submitting...' : 'Register'}
            </button>
          </form>
          <p style={{ marginTop: '18px', color: '#64748b' }}>
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

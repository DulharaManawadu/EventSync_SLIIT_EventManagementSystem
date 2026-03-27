import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const initialForm = {
  title: '',
  description: '',
  category: 'Technical',
  eventType: 'Physical',
  faculty: 'Computing',
  department: '',
  venue: '',
  date: '',
  endDate: '',
  capacity: '',
  organizerName: '',
  organizerEmail: '',
  phoneNumbers: '',
  societyName: '',
  sponsorshipEnabled: false,
  goldTier: '',
  goldBenefits: '',
  silverTier: '',
  silverBenefits: '',
  bronzeTier: '',
  bronzeBenefits: '',
  budget: '',
  tags: ''
};

const inputStyle = {
  width: '100%',
  height: '55px',
  background: 'rgba(247, 247, 247, 0.85)',
  color: '#2d3748',
  borderRadius: '15px',
  border: '2px solid #e2e8f0',
  padding: '0 20px',
  fontSize: '16px',
  outline: 'none',
  marginBottom: '8px',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)',
  boxSizing: 'border-box'
};

const textareaStyle = {
  width: '100%',
  background: 'rgba(247, 247, 247, 0.85)',
  color: '#2d3748',
  borderRadius: '15px',
  border: '2px solid #e2e8f0',
  padding: '15px',
  fontSize: '16px',
  outline: 'none',
  resize: 'vertical',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)',
  marginBottom: '8px',
  boxSizing: 'border-box'
};

const selectStyle = {
  width: '100%',
  height: '55px',
  background: 'rgba(247, 247, 247, 0.85)',
  color: '#2d3748',
  borderRadius: '15px',
  border: '2px solid #e2e8f0',
  padding: '0 20px',
  fontSize: '16px',
  outline: 'none',
  marginBottom: '8px',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#2d3748'
};

const errorTextStyle = {
  color: '#ef4444',
  fontSize: '12px',
  marginBottom: '16px'
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  minWidth: '18px',
  margin: 0,
  padding: 0,
  accentColor: '#ff6b35',
  cursor: 'pointer',
  appearance: 'auto',
  WebkitAppearance: 'checkbox',
  MozAppearance: 'checkbox',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  background: 'transparent',
  verticalAlign: 'middle'
};

const trimValue = (value) => (typeof value === 'string' ? value.trim() : value);

const validateField = (value, fieldName, rules) => {
  const trimmedValue = trimValue(value);
  const errors = [];

  for (const rule of rules) {
    const error = rule(trimmedValue, fieldName);
    if (error) errors.push(error);
  }

  return errors.join(' ');
};

const validateTextField = (value, fieldName, minLength, maxLength, allowedChars = null, fieldNameDisplay = fieldName) => {
  const rules = [
    (val) => !val && `${fieldNameDisplay} is required`,
    (val) => val && val.length < minLength && `${fieldNameDisplay} must be at least ${minLength} characters`,
    (val) => val && val.length > maxLength && `${fieldNameDisplay} cannot exceed ${maxLength} characters`,
    (val) => val && allowedChars && !allowedChars.test(val) && `${fieldNameDisplay} contains invalid characters`,
    (val) => val && /^\s/.test(val) && `${fieldNameDisplay} cannot start with a space`,
    (val) => val && /\s$/.test(val) && `${fieldNameDisplay} cannot end with a space`,
  ];

  return validateField(value, fieldName, rules);
};

export default function CreateEvent() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const getFieldStyle = (fieldName, baseStyle) => ({
    ...baseStyle,
    border: errors[fieldName] ? '2px solid #ef4444' : baseStyle.border
  });

  const validateForm = () => {
    const newErrors = {};

    const title = trimValue(form.title);
    const description = trimValue(form.description);
    const venue = trimValue(form.venue);
    const department = trimValue(form.department);
    const organizerName = trimValue(form.organizerName);
    const organizerEmail = trimValue(form.organizerEmail);
    const phoneNumbers = trimValue(form.phoneNumbers);
    const societyName = trimValue(form.societyName);
    const tags = trimValue(form.tags);
    const budget = form.budget;
    const capacity = form.capacity;

    if (!title) {
      newErrors.title = 'Event title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Event title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Event title cannot exceed 100 characters';
    } else if (!/^[a-zA-Z0-9\s\-_.,&()]+$/.test(title)) {
      newErrors.title = 'Event title can only contain letters, numbers, spaces, and basic punctuation (-_.,&())';
    } else if (/^\s/.test(title)) {
      newErrors.title = 'Event title cannot start with a space';
    } else if (/\s$/.test(title)) {
      newErrors.title = 'Event title cannot end with a space';
    }

    if (!description) {
      newErrors.description = 'Event description is required';
    } else if (description.length < 20) {
      newErrors.description = 'Event description must be at least 20 characters';
    } else if (description.length > 2000) {
      newErrors.description = 'Event description cannot exceed 2000 characters';
    }

    if (!venue) {
      newErrors.venue = 'Venue is required';
    } else if (venue.length < 2) {
      newErrors.venue = 'Venue must be at least 2 characters';
    } else if (venue.length > 200) {
      newErrors.venue = 'Venue cannot exceed 200 characters';
    } else if (!/^[a-zA-Z0-9\s\-'.,&()]+$/.test(venue)) {
      newErrors.venue = 'Venue can only contain letters, numbers, spaces, and basic punctuation (-\'.,&())';
    } else if (/^\s/.test(venue)) {
      newErrors.venue = 'Venue cannot start with a space';
    } else if (/\s$/.test(venue)) {
      newErrors.venue = 'Venue cannot end with a space';
    }

    if (department && department.length > 100) {
      newErrors.department = 'Department cannot exceed 100 characters';
    } else if (department && !/^[a-zA-Z0-9\s\-'.&]+$/.test(department)) {
      newErrors.department = 'Department can only contain letters, numbers, spaces, and basic punctuation (-\'.&)';
    } else if (department && /^\s/.test(department)) {
      newErrors.department = 'Department cannot start with a space';
    } else if (department && /\s$/.test(department)) {
      newErrors.department = 'Department cannot end with a space';
    }

    if (!form.date) {
      newErrors.date = 'Start date and time is required';
    } else {
      const startDate = new Date(form.date);
      const now = new Date();
      
      if (Number.isNaN(startDate.getTime())) {
        newErrors.date = 'Please enter a valid start date and time';
      } else if (startDate < now) {
        newErrors.date = 'Start date and time cannot be in the past';
      }
    }

    if (form.endDate) {
      const endDate = new Date(form.endDate);
      const startDate = new Date(form.date);

      if (Number.isNaN(endDate.getTime())) {
        newErrors.endDate = 'Please enter a valid end date and time';
      } else if (form.date && endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (!/^\d+$/.test(capacity)) {
      newErrors.capacity = 'Capacity must be a whole number';
    } else if (parseInt(capacity, 10) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (parseInt(capacity, 10) > 100000) {
      newErrors.capacity = 'Capacity is too large';
    }

    if (!organizerName) {
      newErrors.organizerName = 'Organizer name is required';
    } else if (organizerName.length < 2) {
      newErrors.organizerName = 'Organizer name must be at least 2 characters';
    } else if (organizerName.length > 100) {
      newErrors.organizerName = 'Organizer name cannot exceed 100 characters';
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(organizerName)) {
      newErrors.organizerName = 'Organizer name can only contain letters, spaces, hyphens, apostrophes, and periods';
    } else if (/^\s/.test(organizerName)) {
      newErrors.organizerName = 'Organizer name cannot start with a space';
    } else if (/\s$/.test(organizerName)) {
      newErrors.organizerName = 'Organizer name cannot end with a space';
    }

    if (!societyName) {
      newErrors.societyName = 'Society name is required';
    } else if (societyName.length < 2) {
      newErrors.societyName = 'Society name must be at least 2 characters';
    } else if (societyName.length > 100) {
      newErrors.societyName = 'Society name cannot exceed 100 characters';
    } else if (!/^[a-zA-Z0-9\s\-'.&]+$/.test(societyName)) {
      newErrors.societyName = 'Society name can only contain letters, numbers, spaces, and basic punctuation (-\'.&)';
    } else if (/^\s/.test(societyName)) {
      newErrors.societyName = 'Society name cannot start with a space';
    } else if (/\s$/.test(societyName)) {
      newErrors.societyName = 'Society name cannot end with a space';
    }

    if (!phoneNumbers) {
      newErrors.phoneNumbers = 'At least one contact phone number is required';
    } else {
      const phoneList = phoneNumbers
        .split(',')
        .map((phone) => trimValue(phone))
        .filter(Boolean);

      if (phoneList.length === 0) {
        newErrors.phoneNumbers = 'Please enter at least one phone number';
      } else {
        const invalidPhone = phoneList.find((phone) => {
          const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
          const sriLankanMobileRegex = /^(?:\+94|0|94)?7[0-9]{8}$/;
          const sriLankanLandlineRegex = /^(?:011[0-9]{7}|0[2-9][0-9]{8})$/;
          return !sriLankanMobileRegex.test(cleanPhone) && !sriLankanLandlineRegex.test(cleanPhone);
        });

        if (invalidPhone) {
          newErrors.phoneNumbers =
            'Please enter valid Sri Lankan phone numbers (e.g., 07XXXXXXXX, +947XXXXXXXX, or 011XXXXXXX for landlines)';
        }
      }
    }

    if (organizerEmail) {
      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      const cleanEmail = organizerEmail.trim().toLowerCase();
      
      if (!emailRegex.test(cleanEmail)) {
        newErrors.organizerEmail = 'Please enter a valid email address (e.g., name@domain.com)';
      } else if (cleanEmail.length > 150) {
        newErrors.organizerEmail = 'Email address is too long';
      } else if (cleanEmail.startsWith('.') || cleanEmail.endsWith('.')) {
        newErrors.organizerEmail = 'Email address cannot start or end with a dot';
      } else if (cleanEmail.includes('..')) {
        newErrors.organizerEmail = 'Email address cannot contain consecutive dots';
      } else if (!cleanEmail.includes('@')) {
        newErrors.organizerEmail = 'Email address must contain @ symbol';
      } else {
        const [localPart, domain] = cleanEmail.split('@');
        if (localPart.length === 0) {
          newErrors.organizerEmail = 'Email address must have text before @ symbol';
        } else if (domain.length === 0) {
          newErrors.organizerEmail = 'Email address must have text after @ symbol';
        } else if (!domain.includes('.')) {
          newErrors.organizerEmail = 'Email domain must contain a dot (e.g., .com, .lk)';
        } else if (localPart.length > 64) {
          newErrors.organizerEmail = 'Email username is too long';
        }
      }
    }

    if (budget) {
      if (Number.isNaN(Number(budget))) {
        newErrors.budget = 'Budget must be a valid number';
      } else if (Number(budget) < 0) {
        newErrors.budget = 'Budget cannot be negative';
      }
    }

    if (tags) {
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const hasInvalidTag = tagList.some((tag) => tag.length > 30);
      if (hasInvalidTag) {
        newErrors.tags = 'Each tag must be 30 characters or less';
      }
    }

    if (form.sponsorshipEnabled) {
      const tiers = [
        {
          name: 'Gold',
          price: form.goldTier,
          benefits: trimValue(form.goldBenefits)
        },
        {
          name: 'Silver',
          price: form.silverTier,
          benefits: trimValue(form.silverBenefits)
        },
        {
          name: 'Bronze',
          price: form.bronzeTier,
          benefits: trimValue(form.bronzeBenefits)
        }
      ];

      const hasAnyTierData = tiers.some((tier) => tier.price || tier.benefits);

      if (!hasAnyTierData) {
        newErrors.sponsorshipEnabled =
          'At least one sponsorship tier must be filled when sponsorship is enabled';
      }

      tiers.forEach((tier) => {
        const lower = tier.name.toLowerCase();
        const hasPrice = tier.price !== '' && tier.price !== null;
        const hasBenefits = tier.benefits !== '';

        if (hasPrice && !hasBenefits) {
          newErrors[`${lower}Benefits`] =
            `${tier.name} benefits are required when ${tier.name} price is entered`;
        }

        if (!hasPrice && hasBenefits) {
          newErrors[`${lower}Tier`] =
            `${tier.name} price is required when ${tier.name} benefits are entered`;
        }

        if (hasPrice) {
          if (Number.isNaN(Number(tier.price))) {
            newErrors[`${lower}Tier`] = `${tier.name} price must be a valid number`;
          } else if (Number(tier.price) <= 0) {
            newErrors[`${lower}Tier`] = `${tier.name} price must be greater than 0`;
          }
        }

        if (hasBenefits && tier.benefits.length < 10) {
          newErrors[`${lower}Benefits`] =
            `${tier.name} benefits must be at least 10 characters`;
        }
      });
    }

    return newErrors;
  };

  const buildAlertMessage = (validationErrors) => {
    const messages = Object.values(validationErrors).filter(Boolean);
    return `Please fix the following issues:\n\n• ${messages.join('\n• ')}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sponsorshipEnabled') {
      setForm((prev) => ({
        ...prev,
        sponsorshipEnabled: checked,
        ...(checked
          ? {}
          : {
              goldTier: '',
              goldBenefits: '',
              silverTier: '',
              silverBenefits: '',
              bronzeTier: '',
              bronzeBenefits: ''
            })
      }));

      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.sponsorshipEnabled;
        delete updated.goldTier;
        delete updated.goldBenefits;
        delete updated.silverTier;
        delete updated.silverBenefits;
        delete updated.bronzeTier;
        delete updated.bronzeBenefits;
        return updated;
      });

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSubmitError('');
      window.alert(buildAlertMessage(formErrors));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setSubmitError('');
    setLoading(true);

    try {
      const sponsorshipTiers = [];

      if (form.sponsorshipEnabled) {
        if (form.goldTier && form.goldBenefits.trim()) {
          sponsorshipTiers.push({
            tierName: 'Gold',
            price: parseFloat(form.goldTier),
            benefits: form.goldBenefits.trim()
          });
        }

        if (form.silverTier && form.silverBenefits.trim()) {
          sponsorshipTiers.push({
            tierName: 'Silver',
            price: parseFloat(form.silverTier),
            benefits: form.silverBenefits.trim()
          });
        }

        if (form.bronzeTier && form.bronzeBenefits.trim()) {
          sponsorshipTiers.push({
            tierName: 'Bronze',
            price: parseFloat(form.bronzeTier),
            benefits: form.bronzeBenefits.trim()
          });
        }
      }

      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        eventType: form.eventType,
        faculty: form.faculty,
        department: form.department.trim(),
        venue: form.venue.trim(),
        date: form.date,
        endDate: form.endDate || null,
        capacity: parseInt(form.capacity, 10),
        organizer: form.organizerName.trim(),
        organizerName: form.organizerName.trim(),
        organizerEmail: form.organizerEmail.trim(),
        phoneNumbers: form.phoneNumbers
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        societyName: form.societyName.trim(),
        sponsorshipEnabled: form.sponsorshipEnabled,
        sponsorshipTiers,
        budget: form.budget ? parseFloat(form.budget) : 0,
        tags: form.tags
          ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : []
      };

      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      setLoading(false);
      navigate('/events');
    } catch (err) {
      setLoading(false);
      setSubmitError(err.message || 'Something went wrong while creating the event');
      window.alert(err.message || 'Something went wrong while creating the event');
    }
  };

  const renderError = (fieldName) =>
    errors[fieldName] ? <div style={errorTextStyle}>{errors[fieldName]}</div> : null;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="EventSync - Create New Campus Event" />
        <meta name="author" content="SLIIT EventSync Team" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>EventSync - Create Event</title>

        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="assets/css/fontawesome.css" />
        <link rel="stylesheet" href="assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="assets/css/owl.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
        />
      </Helmet>

      <Header />

      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-text">
                <h2>Create New Event</h2>
                <div className="div-dec"></div>
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginTop: '15px'
                  }}
                >
                  Organize and manage your campus events with our streamlined approval
                  system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h4>Event Details</h4>
                <div className="line-dec"></div>
                <p>Please fill in all the required information to create your event</p>
              </div>
            </div>
          </div>

          {Object.keys(errors).filter((key) => errors[key]).length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="alert alert-danger" role="alert">
                  <strong>Please fix the following errors:</strong>
                  <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    {Object.entries(errors)
                      .filter(([, message]) => message)
                      .map(([field, message]) => (
                        <li key={field} style={{ marginBottom: '5px' }}>
                          <strong>
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                          </strong>{' '}
                          {message}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="row">
              <div className="col-lg-12">
                <div className="alert alert-danger" role="alert">
                  {submitError}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-lg-12">
              <form id="contact" onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="title" style={labelStyle}>
                        Event Name *
                      </label>
                      <input
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Enter event title..."
                        value={form.title}
                        onChange={handleChange}
                        style={getFieldStyle('title', inputStyle)}
                      />
                      {renderError('title')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="venue" style={labelStyle}>
                        Venue *
                      </label>
                      <input
                        name="venue"
                        type="text"
                        id="venue"
                        placeholder="Enter event venue..."
                        value={form.venue}
                        onChange={handleChange}
                        style={getFieldStyle('venue', inputStyle)}
                      />
                      {renderError('venue')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="category" style={labelStyle}>
                        Event Category *
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={form.category}
                        onChange={handleChange}
                        style={getFieldStyle('category', selectStyle)}
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Competition">Competition</option>
                        <option value="Conference">Conference</option>
                        <option value="Other">Other</option>
                      </select>
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="eventType" style={labelStyle}>
                        Event Type *
                      </label>
                      <select
                        name="eventType"
                        id="eventType"
                        value={form.eventType}
                        onChange={handleChange}
                        style={getFieldStyle('eventType', selectStyle)}
                      >
                        <option value="Physical">Physical Event</option>
                        <option value="Virtual">Virtual Event</option>
                        <option value="Hybrid">Hybrid Event</option>
                      </select>
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="faculty" style={labelStyle}>
                        Faculty Name *
                      </label>
                      <select
                        name="faculty"
                        id="faculty"
                        value={form.faculty}
                        onChange={handleChange}
                        style={getFieldStyle('faculty', selectStyle)}
                      >
                        <option value="">Select Faculty</option>
                        <option value="Computing">Computing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Science">Science</option>
                        <option value="Other">Other</option>
                      </select>
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="department" style={labelStyle}>
                        Department
                      </label>
                      <input
                        name="department"
                        type="text"
                        id="department"
                        placeholder="Enter department name..."
                        value={form.department}
                        onChange={handleChange}
                        style={getFieldStyle('department', inputStyle)}
                      />
                      {renderError('department')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="date" style={labelStyle}>
                        Start Date & Time *
                      </label>
                      <input
                        name="date"
                        type="datetime-local"
                        id="date"
                        value={form.date}
                        onChange={handleChange}
                        style={getFieldStyle('date', inputStyle)}
                      />
                      {renderError('date')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="endDate" style={labelStyle}>
                        End Date & Time
                      </label>
                      <input
                        name="endDate"
                        type="datetime-local"
                        id="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        style={getFieldStyle('endDate', inputStyle)}
                      />
                      {renderError('endDate')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="capacity" style={labelStyle}>
                        Capacity *
                      </label>
                      <input
                        name="capacity"
                        type="number"
                        id="capacity"
                        placeholder="Enter event capacity..."
                        value={form.capacity}
                        onChange={handleChange}
                        min="1"
                        style={getFieldStyle('capacity', inputStyle)}
                      />
                      {renderError('capacity')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="organizerName" style={labelStyle}>
                        Organizer Name *
                      </label>
                      <input
                        name="organizerName"
                        type="text"
                        id="organizerName"
                        placeholder="Enter organizer name..."
                        value={form.organizerName}
                        onChange={handleChange}
                        style={getFieldStyle('organizerName', inputStyle)}
                      />
                      {renderError('organizerName')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="societyName" style={labelStyle}>
                        Society Name *
                      </label>
                      <input
                        name="societyName"
                        type="text"
                        id="societyName"
                        placeholder="Enter society/club name..."
                        value={form.societyName}
                        onChange={handleChange}
                        style={getFieldStyle('societyName', inputStyle)}
                      />
                      {renderError('societyName')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="phoneNumbers" style={labelStyle}>
                        Contact Phone Numbers *
                      </label>
                      <input
                        name="phoneNumbers"
                        type="text"
                        id="phoneNumbers"
                        placeholder="Enter phone numbers (comma-separated)..."
                        value={form.phoneNumbers}
                        onChange={handleChange}
                        style={getFieldStyle('phoneNumbers', inputStyle)}
                      />
                      {renderError('phoneNumbers')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="organizerEmail" style={labelStyle}>
                        Organizer Email
                      </label>
                      <input
                        name="organizerEmail"
                        type="email"
                        id="organizerEmail"
                        placeholder="Enter organizer email..."
                        value={form.organizerEmail}
                        onChange={handleChange}
                        style={getFieldStyle('organizerEmail', inputStyle)}
                      />
                      {renderError('organizerEmail')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="budget" style={labelStyle}>
                        Event Budget (LKR)
                      </label>
                      <input
                        name="budget"
                        type="number"
                        id="budget"
                        placeholder="Enter event budget..."
                        value={form.budget}
                        onChange={handleChange}
                        min="0"
                        style={getFieldStyle('budget', inputStyle)}
                      />
                      {renderError('budget')}
                    </fieldset>
                  </div>

                  <div className="col-lg-6">
                    <fieldset>
                      <label htmlFor="tags" style={labelStyle}>
                        Event Tags
                      </label>
                      <input
                        name="tags"
                        type="text"
                        id="tags"
                        placeholder="Enter tags (comma-separated)..."
                        value={form.tags}
                        onChange={handleChange}
                        style={getFieldStyle('tags', inputStyle)}
                      />
                      {renderError('tags')}
                    </fieldset>
                  </div>

                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="description" style={labelStyle}>
                        Event Description *
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Enter event description..."
                        value={form.description}
                        onChange={handleChange}
                        rows="6"
                        style={getFieldStyle('description', textareaStyle)}
                      />
                      {renderError('description')}
                    </fieldset>
                  </div>

                  <div className="col-lg-12">
                    <fieldset
                      style={{
                        background: '#f8fafc',
                        border: errors.sponsorshipEnabled
                          ? '1px solid #ef4444'
                          : '1px solid #dbe4ee',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        marginBottom: '25px'
                      }}
                    >
                      <label
                        htmlFor="sponsorshipEnabled"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          margin: 0,
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#2d3748',
                          fontSize: '16px'
                        }}
                      >
                        <input
                          type="checkbox"
                          name="sponsorshipEnabled"
                          id="sponsorshipEnabled"
                          checked={form.sponsorshipEnabled}
                          onChange={handleChange}
                          style={checkboxStyle}
                        />
                        Enable Sponsorship Registration
                      </label>
                      {renderError('sponsorshipEnabled')}
                    </fieldset>
                  </div>

                  {form.sponsorshipEnabled && (
                    <>
                      <div className="col-lg-12">
                        <fieldset>
                          <h5 style={{ color: '#2d3748', marginBottom: '10px' }}>
                            Sponsorship Tiers
                          </h5>
                          <p style={{ color: '#718096', marginBottom: '25px' }}>
                            Fill at least one tier. If you enter a tier price, you must
                            also enter its benefits.
                          </p>
                        </fieldset>
                      </div>

                      <div className="col-lg-4">
                        <fieldset
                          style={{
                            background: '#fffaf0',
                            border: '1px solid #f6e3b4',
                            borderRadius: '16px',
                            padding: '18px'
                          }}
                        >
                          <label htmlFor="goldTier" style={labelStyle}>
                            Gold Tier Price
                          </label>
                          <input
                            name="goldTier"
                            type="number"
                            id="goldTier"
                            placeholder="Price (LKR)"
                            value={form.goldTier}
                            onChange={handleChange}
                            min="0"
                            style={getFieldStyle('goldTier', inputStyle)}
                          />
                          {renderError('goldTier')}

                          <label htmlFor="goldBenefits" style={labelStyle}>
                            Gold Tier Benefits
                          </label>
                          <textarea
                            name="goldBenefits"
                            id="goldBenefits"
                            placeholder="Gold tier benefits..."
                            value={form.goldBenefits}
                            onChange={handleChange}
                            rows="4"
                            style={getFieldStyle('goldBenefits', textareaStyle)}
                          />
                          {renderError('goldBenefits')}
                        </fieldset>
                      </div>

                      <div className="col-lg-4">
                        <fieldset
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #dbe4ee',
                            borderRadius: '16px',
                            padding: '18px'
                          }}
                        >
                          <label htmlFor="silverTier" style={labelStyle}>
                            Silver Tier Price
                          </label>
                          <input
                            name="silverTier"
                            type="number"
                            id="silverTier"
                            placeholder="Price (LKR)"
                            value={form.silverTier}
                            onChange={handleChange}
                            min="0"
                            style={getFieldStyle('silverTier', inputStyle)}
                          />
                          {renderError('silverTier')}

                          <label htmlFor="silverBenefits" style={labelStyle}>
                            Silver Tier Benefits
                          </label>
                          <textarea
                            name="silverBenefits"
                            id="silverBenefits"
                            placeholder="Silver tier benefits..."
                            value={form.silverBenefits}
                            onChange={handleChange}
                            rows="4"
                            style={getFieldStyle('silverBenefits', textareaStyle)}
                          />
                          {renderError('silverBenefits')}
                        </fieldset>
                      </div>

                      <div className="col-lg-4">
                        <fieldset
                          style={{
                            background: '#fff7ed',
                            border: '1px solid #fed7aa',
                            borderRadius: '16px',
                            padding: '18px'
                          }}
                        >
                          <label htmlFor="bronzeTier" style={labelStyle}>
                            Bronze Tier Price
                          </label>
                          <input
                            name="bronzeTier"
                            type="number"
                            id="bronzeTier"
                            placeholder="Price (LKR)"
                            value={form.bronzeTier}
                            onChange={handleChange}
                            min="0"
                            style={getFieldStyle('bronzeTier', inputStyle)}
                          />
                          {renderError('bronzeTier')}

                          <label htmlFor="bronzeBenefits" style={labelStyle}>
                            Bronze Tier Benefits
                          </label>
                          <textarea
                            name="bronzeBenefits"
                            id="bronzeBenefits"
                            placeholder="Bronze tier benefits..."
                            value={form.bronzeBenefits}
                            onChange={handleChange}
                            rows="4"
                            style={getFieldStyle('bronzeBenefits', textareaStyle)}
                          />
                          {renderError('bronzeBenefits')}
                        </fieldset>
                      </div>
                    </>
                  )}

                  <div className="col-lg-12">
                    <fieldset>
                      <button
                        type="submit"
                        id="form-submit"
                        className="orange-button"
                        disabled={loading}
                        style={{
                          opacity: loading ? 0.7 : 1,
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? 'Creating Event...' : 'Create Event'}
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
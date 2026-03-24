const Event = require('../models/Event');
const { isValidObjectId } = require('mongoose');

/**
 * Validate MongoDB ObjectId
 */
const isValidId = (id) => isValidObjectId(id);

/**
 * Helpers
 */
const trimString = (value) =>
  typeof value === 'string' ? value.trim() : value;

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : item))
    .filter(Boolean);
};

const sanitizeSponsorshipTiers = (tiers) => {
  if (!Array.isArray(tiers)) return [];

  return tiers
    .map((tier) => ({
      tierName: trimString(tier?.tierName),
      price:
        tier?.price === '' || tier?.price === null || tier?.price === undefined
          ? undefined
          : Number(tier.price),
      benefits: trimString(tier?.benefits)
    }))
    .filter(
      (tier) =>
        tier.tierName &&
        tier.price !== undefined &&
        !Number.isNaN(tier.price) &&
        tier.benefits
    );
};

const buildValidationErrors = (payload, isUpdate = false) => {
  const errors = [];

  const requiredFields = [
    'title',
    'description',
    'category',
    'faculty',
    'venue',
    'date',
    'capacity',
    'organizerName',
    'societyName'
  ];

  if (!isUpdate) {
    requiredFields.forEach((field) => {
      if (
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === ''
      ) {
        errors.push(`${field} is required`);
      }
    });
  }

  if (!isUpdate || payload.title !== undefined) {
    if (!payload.title || !trimString(payload.title)) {
      errors.push('Event title is required');
    }
  }

  if (!isUpdate || payload.description !== undefined) {
    if (!payload.description || !trimString(payload.description)) {
      errors.push('Event description is required');
    }
  }

  if (!isUpdate || payload.venue !== undefined) {
    if (!payload.venue || !trimString(payload.venue)) {
      errors.push('Venue is required');
    }
  }

  if (!isUpdate || payload.organizerName !== undefined) {
    if (!payload.organizerName || !trimString(payload.organizerName)) {
      errors.push('Organizer name is required');
    }
  }

  if (!isUpdate || payload.societyName !== undefined) {
    if (!payload.societyName || !trimString(payload.societyName)) {
      errors.push('Society name is required');
    }
  }

  if (!isUpdate || payload.capacity !== undefined) {
    const capacity = Number(payload.capacity);
    if (Number.isNaN(capacity) || capacity < 1) {
      errors.push('Capacity must be a positive number');
    }
  }

  if (!isUpdate || payload.date !== undefined) {
    const eventDate = new Date(payload.date);
    if (!payload.date || Number.isNaN(eventDate.getTime())) {
      errors.push('Invalid event date format');
    }
  }

  if (payload.endDate) {
    const startDate = new Date(payload.date);
    const endDate = new Date(payload.endDate);

    if (Number.isNaN(endDate.getTime())) {
      errors.push('Invalid end date format');
    } else if (!Number.isNaN(startDate.getTime()) && endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }

  if (!isUpdate || payload.organizerEmail !== undefined) {
    if (payload.organizerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimString(payload.organizerEmail))) {
        errors.push('Please provide a valid email address');
      }
    }
  }

  if (!isUpdate || payload.phoneNumbers !== undefined) {
    if (!Array.isArray(payload.phoneNumbers) || payload.phoneNumbers.length === 0) {
      errors.push('At least one phone number is required');
    } else {
      const invalidPhone = payload.phoneNumbers.find(
        (phone) => !/^[+\d\s\-()]{7,20}$/.test(String(phone).trim())
      );
      if (invalidPhone) {
        errors.push(
          'Each phone number must contain only digits, spaces, +, hyphens, or parentheses and be 7-20 characters long'
        );
      }
    }
  }

  if (!isUpdate || payload.budget !== undefined) {
    if (
      payload.budget !== undefined &&
      payload.budget !== null &&
      payload.budget !== ''
    ) {
      const budget = Number(payload.budget);
      if (Number.isNaN(budget) || budget < 0) {
        errors.push('Budget cannot be negative');
      }
    }
  }

  if (!isUpdate || payload.status !== undefined) {
    const allowedStatuses = [
      'Draft',
      'Pending',
      'Approved',
      'Rejected',
      'Completed',
      'Cancelled'
    ];

    if (payload.status && !allowedStatuses.includes(payload.status)) {
      errors.push('Invalid event status');
    }
  }

  if (payload.sponsorshipEnabled) {
    if (
      !Array.isArray(payload.sponsorshipTiers) ||
      payload.sponsorshipTiers.length === 0
    ) {
      errors.push(
        'At least one sponsorship tier is required when sponsorship is enabled'
      );
    }
  }

  return errors;
};

const normalizeEventPayload = (body, isUpdate = false) => {
  const normalized = {};

  if (!isUpdate || body.title !== undefined) {
    normalized.title = trimString(body.title);
  }

  if (!isUpdate || body.description !== undefined) {
    normalized.description = trimString(body.description);
  }

  if (!isUpdate || body.category !== undefined) {
    normalized.category = body.category;
  }

  if (!isUpdate || body.eventType !== undefined) {
    normalized.eventType = body.eventType || 'Physical';
  }

  if (!isUpdate || body.faculty !== undefined) {
    normalized.faculty = body.faculty;
  }

  if (!isUpdate || body.department !== undefined) {
    normalized.department = trimString(body.department);
  }

  if (!isUpdate || body.venue !== undefined) {
    normalized.venue = trimString(body.venue);
  }

  if (!isUpdate || body.date !== undefined) {
    normalized.date = body.date ? new Date(body.date) : body.date;
  }

  if (!isUpdate || body.endDate !== undefined) {
    normalized.endDate = body.endDate ? new Date(body.endDate) : undefined;
  }

  if (!isUpdate || body.capacity !== undefined) {
    normalized.capacity = Number(body.capacity);
  }

  if (!isUpdate || body.organizerName !== undefined) {
    normalized.organizerName = trimString(body.organizerName);
  }

  if (!isUpdate || body.organizer !== undefined || body.organizerName !== undefined) {
    normalized.organizer = trimString(body.organizerName || body.organizer || 'Web UI');
  }

  if (!isUpdate || body.organizerEmail !== undefined) {
    normalized.organizerEmail = trimString(body.organizerEmail);
  }

  if (!isUpdate || body.phoneNumbers !== undefined) {
    normalized.phoneNumbers = sanitizeStringArray(body.phoneNumbers);
  }

  if (!isUpdate || body.societyName !== undefined) {
    normalized.societyName = trimString(body.societyName);
  }

  if (!isUpdate || body.sponsorshipEnabled !== undefined) {
    normalized.sponsorshipEnabled = Boolean(body.sponsorshipEnabled);
  }

  if (!isUpdate || body.sponsorshipTiers !== undefined) {
    normalized.sponsorshipTiers = sanitizeSponsorshipTiers(body.sponsorshipTiers);
  }

  if (!isUpdate || body.budget !== undefined) {
    normalized.budget =
      body.budget === '' || body.budget === null || body.budget === undefined
        ? 0
        : Number(body.budget);
  }

  if (!isUpdate || body.tags !== undefined) {
    normalized.tags = sanitizeStringArray(body.tags);
  }

  if (!isUpdate || body.isFeatured !== undefined) {
    normalized.isFeatured = Boolean(body.isFeatured);
  }

  // IMPORTANT: status support
  if (!isUpdate || body.status !== undefined) {
    normalized.status = body.status;
  }

  // Optional rejection reason
  if (!isUpdate || body.rejectionReason !== undefined) {
    normalized.rejectionReason = trimString(body.rejectionReason);
  }

  return normalized;
};

/**
 * Create a new event
 * POST /api/events
 */
async function createEvent(req, res) {
  try {
    const normalized = normalizeEventPayload(req.body, false);
    const validationErrors = buildValidationErrors(normalized, false);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const event = new Event({
      ...normalized,
      status: 'Pending'
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (err) {
    console.error('Create Event Error:', err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error occurred while creating event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Get all events
 * GET /api/events
 */
async function listEvents(req, res) {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const allowedFilters = ['status', 'faculty', 'category', 'isFeatured', 'eventType'];
    const filterObj = {};

    allowedFilters.forEach((field) => {
      if (filters[field] !== undefined) {
        if (field === 'isFeatured') {
          filterObj[field] = filters[field] === 'true';
        } else {
          filterObj[field] = filters[field];
        }
      }
    });

    const events = await Event.find(filterObj)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(filterObj);

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('List Events Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching events',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Get single event by ID
 * GET /api/events/:id
 */
async function getEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event retrieved successfully',
      data: event
    });
  } catch (err) {
    console.error('Get Event Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Register for an event
 * POST /api/events/:id/register
 */
async function registerEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.isFull && !event.waitlistEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity',
        isFull: true
      });
    }

    event.registrationCount += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Registered for event successfully',
      data: event,
      isFull: event.isFull,
      registered: true
    });
  } catch (err) {
    console.error('Register Event Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while registering for event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Check in to an event
 * POST /api/events/:id/checkin
 */
async function checkinEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.checkInActive) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is not active for this event'
      });
    }

    event.attendanceCount += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: event,
      attendanceRate: event.attendanceRate
    });
  } catch (err) {
    console.error('Check-in Event Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred during check-in',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Get analytics
 * GET /api/events/analytics
 */
async function analytics(req, res) {
  try {
    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      approvedEvents,
      totalCapacity,
      totalRegistrations,
      totalAttendance,
      averageFeedback,
      eventsByCategory,
      eventsByFaculty
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now } }),
      Event.countDocuments({ status: 'Approved' }),
      Event.aggregate([{ $group: { _id: null, total: { $sum: '$capacity' } } }]),
      Event.aggregate([{ $group: { _id: null, total: { $sum: '$registrationCount' } } }]),
      Event.aggregate([{ $group: { _id: null, total: { $sum: '$attendanceCount' } } }]),
      Event.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: '$feedbackScore' }
          }
        }
      ]),
      Event.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]),
      Event.aggregate([
        {
          $group: {
            _id: '$faculty',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const pastEvents = totalEvents - upcomingEvents;
    const utilizationRate =
      totalCapacity[0]?.total > 0
        ? (((totalRegistrations[0]?.total || 0) / totalCapacity[0].total) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        summary: {
          totalEvents,
          upcomingEvents,
          pastEvents,
          approvedEvents,
          totalCapacity: totalCapacity[0]?.total || 0,
          totalRegistrations: totalRegistrations[0]?.total || 0,
          totalAttendance: totalAttendance[0]?.total || 0,
          utilizationRate,
          averageFeedback: (averageFeedback[0]?.average || 0).toFixed(2)
        },
        breakdown: {
          byCategory: eventsByCategory,
          byFaculty: eventsByFaculty
        }
      }
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching analytics',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Update an event
 * PUT /api/events/:id
 */
async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const normalized = normalizeEventPayload(req.body, true);

    const mergedPayload = {
      title: normalized.title !== undefined ? normalized.title : event.title,
      description:
        normalized.description !== undefined ? normalized.description : event.description,
      category: normalized.category !== undefined ? normalized.category : event.category,
      eventType: normalized.eventType !== undefined ? normalized.eventType : event.eventType,
      faculty: normalized.faculty !== undefined ? normalized.faculty : event.faculty,
      department:
        normalized.department !== undefined ? normalized.department : event.department,
      venue: normalized.venue !== undefined ? normalized.venue : event.venue,
      date: normalized.date !== undefined ? normalized.date : event.date,
      endDate: normalized.endDate !== undefined ? normalized.endDate : event.endDate,
      capacity: normalized.capacity !== undefined ? normalized.capacity : event.capacity,
      organizerName:
        normalized.organizerName !== undefined
          ? normalized.organizerName
          : event.organizerName,
      organizer:
        normalized.organizer !== undefined ? normalized.organizer : event.organizer,
      organizerEmail:
        normalized.organizerEmail !== undefined
          ? normalized.organizerEmail
          : event.organizerEmail,
      phoneNumbers:
        normalized.phoneNumbers !== undefined
          ? normalized.phoneNumbers
          : event.phoneNumbers,
      societyName:
        normalized.societyName !== undefined ? normalized.societyName : event.societyName,
      sponsorshipEnabled:
        normalized.sponsorshipEnabled !== undefined
          ? normalized.sponsorshipEnabled
          : event.sponsorshipEnabled,
      sponsorshipTiers:
        normalized.sponsorshipTiers !== undefined
          ? normalized.sponsorshipTiers
          : event.sponsorshipTiers,
      budget: normalized.budget !== undefined ? normalized.budget : event.budget,
      tags: normalized.tags !== undefined ? normalized.tags : event.tags,
      isFeatured:
        normalized.isFeatured !== undefined ? normalized.isFeatured : event.isFeatured,
      // IMPORTANT: include status in merged validation payload
      status: normalized.status !== undefined ? normalized.status : event.status,
      rejectionReason:
        normalized.rejectionReason !== undefined
          ? normalized.rejectionReason
          : event.rejectionReason
    };

    const validationErrors = buildValidationErrors(mergedPayload, false);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    Object.assign(event, normalized);
    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (err) {
    console.error('Update Event Error:', err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error occurred while updating event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Delete an event
 * DELETE /api/events/:id
 */
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: event
    });
  } catch (err) {
    console.error('Delete Event Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

module.exports = {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
  checkinEvent,
  analytics
};
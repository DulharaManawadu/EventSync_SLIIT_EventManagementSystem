const Event = require('../models/Event');
const { isValidObjectId } = require('mongoose');

/**
 * Validate MongoDB ObjectId
 */
const isValidId = (id) => isValidObjectId(id);

/**
 * Create a new event
 * POST /api/events
 */
async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      category,
      eventType,
      faculty,
      department,
      venue,
      date,
      endDate,
      capacity,
      organizer,
      organizerEmail,
      sponsorshipEnabled,
      sponsorshipTiers,
      budget,
      tags,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!title || !date || !capacity || !category || !faculty) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        requiredFields: ['title', 'date', 'capacity', 'category', 'faculty']
      });
    }

    // Validate capacity is a positive number
    if (typeof capacity !== 'number' || capacity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a positive number'
      });
    }

    // Validate date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event date format'
      });
    }

    const event = new Event({
      title: title.trim(),
      description: description?.trim(),
      category,
      eventType,
      faculty,
      department: department?.trim(),
      venue: venue?.trim(),
      date: eventDate,
      endDate: endDate ? new Date(endDate) : undefined,
      capacity,
      organizer: organizer?.trim() || 'Web UI',
      organizerEmail: organizerEmail?.trim(),
      sponsorshipEnabled,
      sponsorshipTiers,
      budget: budget || 0,
      tags: tags?.map(tag => tag.trim()),
      isFeatured,
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

    // Handle validation errors from mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
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
 * Get all events with optional filters and pagination
 * GET /api/events
 * Query params: status, faculty, category, page, limit
 */
async function listEvents(req, res) {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    
    // Parse pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object - only allow specific fields to be filtered
    const allowedFilters = ['status', 'faculty', 'category', 'isFeatured'];
    const filterObj = {};
    allowedFilters.forEach(field => {
      if (filters[field]) {
        filterObj[field] = filters[field];
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
 * Register for an event (increment registration count)
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
 * Check in to an event (increment attendance count)
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
 * Get analytics and aggregated data
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
    const utilizationRate = totalCapacity[0]?.total > 0 
      ? ((totalRegistrations[0]?.total || 0) / totalCapacity[0].total * 100).toFixed(2)
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
    const updateData = req.body;

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

    // Update event with new data
    Object.assign(event, updateData);
    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (err) {
    console.error('Update Event Error:', err);
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

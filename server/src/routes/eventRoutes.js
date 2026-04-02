const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * EventSync API Routes
 * Base route: /api/events
 */

// POST /api/events - Create a new event
router.post('/', authMiddleware.requireRole('Admin', 'Student'), controller.createEvent);

// GET /api/events - List all events with optional filters
router.get('/', controller.listEvents);

// GET /api/events/analytics - Get analytics (MUST come before /:id to avoid matching)
router.get('/analytics', authMiddleware.requireRole('Admin'), controller.analytics);

// GET /api/events/analytics/advanced - Get advanced analytics with date filtering
router.get('/analytics/advanced', authMiddleware.requireRole('Admin'), controller.advancedAnalytics);

// GET /api/events/:id - Get a single event by ID
router.get('/:id', controller.getEvent);

// PUT /api/events/:id - Update an event
router.put('/:id', authMiddleware.requireRole('Admin'), controller.updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', authMiddleware.requireRole('Admin'), controller.deleteEvent);

// POST /api/events/:id/register - Register for an event
router.post('/:id/register', authMiddleware.requireRole('Student'), controller.registerEvent);

// POST /api/events/:id/checkin - Check-in to an event
router.post('/:id/checkin', authMiddleware.requireRole('Student'), controller.checkinEvent);

module.exports = router;

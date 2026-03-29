const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');

/**
 * EventSync API Routes
 * Base route: /api/events
 */

// POST /api/events - Create a new event
router.post('/', controller.createEvent);

// GET /api/events - List all events with optional filters
router.get('/', controller.listEvents);

// GET /api/events/analytics - Get analytics (MUST come before /:id to avoid matching)
router.get('/analytics', controller.analytics);

// GET /api/events/analytics/advanced - Get advanced analytics with date filtering
router.get('/analytics/advanced', controller.advancedAnalytics);

// GET /api/events/:id - Get a single event by ID
router.get('/:id', controller.getEvent);

// PUT /api/events/:id - Update an event
router.put('/:id', controller.updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', controller.deleteEvent);

// POST /api/events/:id/register - Register for an event
router.post('/:id/register', controller.registerEvent);

// POST /api/events/:id/checkin - Check-in to an event
router.post('/:id/checkin', controller.checkinEvent);

module.exports = router;

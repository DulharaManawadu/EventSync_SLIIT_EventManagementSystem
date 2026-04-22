const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventRegistrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/events/:eventId/register',
  authMiddleware.requireRole('Student'),
  controller.registerForEvent
);

router.get(
  '/me',
  authMiddleware.requireRole('Student'),
  controller.getMyRegistrations
);

router.get(
  '/events/:eventId/me',
  authMiddleware.requireRole('Student'),
  controller.getMyEventQr
);

router.post(
  '/check-in',
  authMiddleware.requireRole('Admin'),
  controller.scanAndCheckIn
);

router.delete(
  '/admin/registrations/:registrationId',
  authMiddleware.requireRole('Admin'),
  controller.deleteRegistration
);

router.get(
  '/admin/events/summary',
  authMiddleware.requireRole('Admin'),
  controller.getAdminQrEventSummary
);

router.patch(
  '/admin/events/:eventId/check-in',
  authMiddleware.requireRole('Admin'),
  controller.updateCheckInStatus
);

router.get(
  '/admin/events/:eventId/attendance',
  authMiddleware.requireRole('Admin'),
  controller.getEventAttendanceTable
);

module.exports = router;

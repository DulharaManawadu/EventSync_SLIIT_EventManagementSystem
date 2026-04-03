const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { requireRole } = require('../middleware/authMiddleware');

// All routes require Admin role
router.use(requireRole('Admin'));

// GET /api/admin/vendors/vendors - list all vendor users (for filter dropdown)
router.get('/vendors', vendorController.getVendors);

// GET /api/admin/vendors/applications - all vendor applications with optional filters
router.get('/applications', vendorController.getAllApplicationsAdmin);

// GET /api/admin/vendors/applications/:id - single application detail
router.get('/applications/:id', vendorController.getApplicationByIdAdmin);

// PUT /api/admin/vendors/applications/:id/approve
router.put('/applications/:id/approve', vendorController.approveApplication);

// PUT /api/admin/vendors/applications/:id/deny
router.put('/applications/:id/deny', vendorController.denyApplication);

module.exports = router;

const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all vendor API routes
router.use(authMiddleware.requireRole('Vendor'));

// Vendor profile
router.get('/profile', vendorController.getProfile);
router.put('/profile/contact', vendorController.updateContact);
router.put('/profile/password', vendorController.updatePassword);
router.delete('/profile', vendorController.deleteProfile);

// Vendor event applications
router.post('/applications', vendorController.applyForEvent);
router.get('/applications', vendorController.getApplications);
router.get('/applications/:id', vendorController.getApplicationById);
router.put('/applications/:id', vendorController.updateApplication);
router.delete('/applications/:id', vendorController.withdrawApplication);

module.exports = router;

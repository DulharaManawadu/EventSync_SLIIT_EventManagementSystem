const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/register', controller.register);
router.post('/register/student', controller.registerStudent);
router.post('/register/vendor', uploadMiddleware.uploadCertificate.single('foodSafetyCertificate'), controller.registerVendor);
router.post('/register/sponsor', controller.registerSponsor);
router.post('/register/admin', controller.registerAdmin);
router.post('/login', controller.login);
router.get('/me', authMiddleware.requireAuth, controller.getProfile);

module.exports = router;

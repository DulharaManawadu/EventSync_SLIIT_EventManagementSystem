const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireRole } = require('../middleware/authMiddleware');

// All routes require Admin role
router.use(requireRole('Admin'));

// GET /api/admin/users - list all users (excluding passwordHash)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id - single user detail (excluding passwordHash)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

module.exports = router;

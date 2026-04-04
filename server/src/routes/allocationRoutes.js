const express = require('express');
const router = express.Router();
const controller = require('../controllers/allocationController');

// Allocate venue + resources to event
router.put('/event/:id', controller.allocateEvent);

router.put('/event/:id/update', controller.updateAllocation);

module.exports = router;
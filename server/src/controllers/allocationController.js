const Event = require('../models/Event');
const Resource = require('../models/Resource').default;
const Venue = require('../models/Venue').default;

// ===== ALLOCATE EVENT =====
exports.allocateEvent = async (req, res) => {
  try {
    const { venueId, resources } = req.body;
    const eventId = req.params.id;

    // 0. Basic validation
    if (!venueId) {
      return res.status(400).json({ message: "venueId is required" });
    }

    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ message: "Resources are required" });
    }

    // 1. Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Only approved events
    if (event.status !== "Approved") {
      return res.status(400).json({
        message: "Only approved events can be allocated"
      });
    }

    // 3. Prevent re-allocation
    if (event.isAllocated) {
      return res.status(400).json({
        message: "Event already allocated"
      });
    }

    // 4. Validate venue
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // 5. Validate resources
    const allocation = [];

    for (let item of resources) {
      if (!item.resource || !item.quantity) {
        return res.status(400).json({
          message: "Each resource must have resource ID and quantity"
        });
      }

      const resource = await Resource.findById(item.resource);

      if (!resource) {
        return res.status(404).json({
          message: `Resource not found: ${item.resource}`
        });
      }

      if (item.quantity > resource.availableQuantity) {
        return res.status(400).json({
          message: `Not enough ${resource.name} available`
        });
      }

      allocation.push({
        resource: resource._id,
        quantity: item.quantity
      });
    }

    // 6. Deduct resource quantities
    for (let item of resources) {
      await Resource.findByIdAndUpdate(item.resource, {
        $inc: { availableQuantity: -item.quantity }
      });
    }

    // 7. Update event
    event.venueRef = venueId;
    event.resources = allocation;
    event.isAllocated = true;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event allocated successfully",
      event
    });

  } catch (error) {
    console.error("ALLOCATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Allocation failed",
      error: error.message
    });
  }
};
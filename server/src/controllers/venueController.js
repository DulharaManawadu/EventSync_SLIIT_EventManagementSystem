const Venue = require('../models/Venue');

// CREATE VENUE
const createVenue = async (req, res) => {
  try {
    const {
      name,
      venueType,
      capacity,
      location,
      facilities,
      availabilityStatus,
      contactPerson,
      contactPhone,
      description
    } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Venue name must be at least 3 characters" });
    }
    
    if (!["Hall", "Auditorium", "Ground", "Lab", "Classroom"].includes(venueType)) {
      return res.status(400).json({ message: "Invalid venue type" });
    }
    
    if (!capacity || capacity < 1) {
      return res.status(400).json({ message: "Capacity must be greater than 0" });
    }
    
    if (!location || location.trim().length < 3) {
      return res.status(400).json({ message: "Location is required" });
    }
    
    if (contactPhone && !/^[0-9]{10}$/.test(contactPhone)) {
      return res.status(400).json({ message: "Invalid phone number (10 digits)" });
    }

    
    const venue = await Venue.create({
      name,
      venueType,
      capacity,
      location,
      facilities,
      availabilityStatus,
      contactPerson,
      contactPhone,
      description
    });

    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VENUES
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VENUE
const updateVenue = async (req, res) => {
  try {
    const {
      name,
      venueType,
      capacity,
      location,
      facilities,
      availabilityStatus,
      contactPerson,
      contactPhone,
      description
    } = req.body;

    // VALIDATIONS (same as create)

    if (name && name.trim().length < 3) {
      return res.status(400).json({ message: "Venue name must be at least 3 characters" });
    }

    if (
      venueType &&
      !["Hall", "Auditorium", "Ground", "Lab", "Classroom"].includes(venueType)
    ) {
      return res.status(400).json({ message: "Invalid venue type" });
    }

    if (capacity && capacity < 1) {
      return res.status(400).json({ message: "Capacity must be greater than 0" });
    }

    if (location && location.trim().length < 3) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (contactPhone && !/^[0-9]{10}$/.test(contactPhone)) {
      return res.status(400).json({ message: "Invalid phone number (10 digits)" });
    }

    // OPTIONAL: prevent duplicate name
    if (name) {
      const existing = await Venue.findOne({ name });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Venue name already exists" });
      }
    }

    // UPDATE WITH VALIDATION
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      {
        name,
        venueType,
        capacity,
        location,
        facilities,
        availabilityStatus,
        contactPerson,
        contactPhone,
        description
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE VENUE
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVenue,
  getVenues,
  updateVenue,
  deleteVenue
};
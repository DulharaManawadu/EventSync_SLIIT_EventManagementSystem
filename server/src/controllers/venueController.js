import Venue from "../models/Venue.js";

// CREATE VENUE
export const createVenue = async (req, res) => {
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

    // Basic validation
    if (!name || !venueType || !capacity || !location) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Duplicate check
    const existingVenue = await Venue.findOne({ name });
    if (existingVenue) {
      return res.status(400).json({ message: "Venue already exists" });
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
export const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VENUE
export const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
export const deleteVenue = async (req, res) => {
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
const Resource = require('../models/Resource');

// CREATE RESOURCE
const createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      totalQuantity,
      availableQuantity,
      conditionStatus,
      lastMaintenanceDate,
      description
    } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Resource name must be at least 3 characters" });
    }

    if (!["Audio", "Visual", "Furniture", "IT Equipment"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!totalQuantity || totalQuantity < 1) {
      return res.status(400).json({ message: "Total quantity must be greater than 0" });
    }

    if (availableQuantity < 0) {
      return res.status(400).json({ message: "Available quantity cannot be negative" });
    }

    if (availableQuantity > totalQuantity) {
      return res.status(400).json({
        message: "Available quantity cannot exceed total quantity"
      });
    }

    const resource = await Resource.create({
      name,
      category,
      totalQuantity,
      availableQuantity,
      conditionStatus,
      lastMaintenanceDate,
      description
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL RESOURCES
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RESOURCE
const updateResource = async (req, res) => {
  try {
    const {
      name,
      category,
      totalQuantity,
      availableQuantity,
      conditionStatus,
      lastMaintenanceDate,
      description
    } = req.body;

    // CONDITIONAL VALIDATION

    if (name && name.trim().length < 3) {
      return res.status(400).json({ message: "Resource name must be at least 3 characters" });
    }

    if (
      category &&
      !["Audio", "Visual", "Furniture", "IT Equipment"].includes(category)
    ) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (totalQuantity && totalQuantity < 1) {
      return res.status(400).json({ message: "Total quantity must be greater than 0" });
    }

    if (availableQuantity !== undefined && availableQuantity < 0) {
      return res.status(400).json({ message: "Available quantity cannot be negative" });
    }

    if (
      totalQuantity !== undefined &&
      availableQuantity !== undefined &&
      availableQuantity > totalQuantity
    ) {
      return res.status(400).json({
        message: "Available quantity cannot exceed total quantity"
      });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        totalQuantity,
        availableQuantity,
        conditionStatus,
        lastMaintenanceDate,
        description
      },
      {
        new: true,
        runValidators: true 
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE RESOURCE
const deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource
};
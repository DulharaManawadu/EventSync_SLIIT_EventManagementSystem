import Resource from "../models/Resource.js";

// CREATE RESOURCE
export const createResource = async (req, res) => {

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

    if (!name || !category || !totalQuantity) {
      return res.status(400).json({ message: "Required fields missing" });
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
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RESOURCE
export const updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
export const deleteResource = async (req, res) => {
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
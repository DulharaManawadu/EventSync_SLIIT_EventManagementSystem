const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["Audio", "Visual", "Furniture", "IT Equipment"],
    required: true
  },

  totalQuantity: {
    type: Number,
    required: true,
    min: 1
  },

  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },

  conditionStatus: {
    type: String,
    enum: ["Good", "Needs Repair", "Under Maintenance"],
    default: "Good"
  },

  lastMaintenanceDate: {
    type: Date
  },

  description: {
    type: String,
    maxlength: 500
  }

}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
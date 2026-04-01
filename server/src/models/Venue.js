import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  venueType: {
    type: String,
    enum: ["Hall", "Auditorium", "Ground", "Lab", "Classroom"],
    required: true
  },

  capacity: {
    type: Number,
    required: true,
    min: 1
  },

  location: {
    type: String,
    required: true
  },

  facilities: [{
    type: String
  }],

  availabilityStatus: {
    type: String,
    enum: ["Available", "Under Maintenance"],
    default: "Available"
  },

  contactPerson: {
    type: String
  },

  contactPhone: {
    type: String
  },

  description: {
    type: String,
    maxlength: 500
  }

}, { timestamps: true });

export default mongoose.model("Venue", venueSchema);
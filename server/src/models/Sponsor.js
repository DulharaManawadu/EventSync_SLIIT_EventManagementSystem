const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({

  tier: {
    type: String,
    enum: ["Gold", "Silver", "Bronze"],
    required: true
  },
  
  contributionAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  
  createdBy: { // 🔥 ONLY ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  
  rejectionReason: {
    type: String,
    trim: true
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  appliedDate: {
    type: Date,
    default: Date.now
  },
  
  priorityScore: {
    type: Number,
    default: 0
  },
  
  notes: {
    type: String,
    trim: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
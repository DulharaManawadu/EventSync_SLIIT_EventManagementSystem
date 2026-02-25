import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: true,
    trim: true
  },

  contactEmail: {
    type: String,
    required: true
  },

  contactPhone: {
    type: String
  },

  website: {
    type: String
  },

  logoUrl: {
    type: String
  },

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

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  rejectionReason: {
    type: String
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  appliedDate: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("Sponsor", sponsorSchema);
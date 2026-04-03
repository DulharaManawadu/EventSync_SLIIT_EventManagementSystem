const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }
});

const vendorApplicationSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    eventTitle: {
      type: String,
      trim: true,
      default: ''
    },
    eventDate: {
      type: Date
    },
    eventVenue: {
      type: String,
      trim: true,
      default: ''
    },
    stallName: {
      type: String,
      required: true,
      trim: true
    },
    foodType: {
      type: String,
      required: true,
      trim: true
    },
    menuItems: {
      type: [menuItemSchema],
      default: []
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Declined', 'Withdrawn'],
      default: 'Pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    withdrawnAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

vendorApplicationSchema.index({ vendor: 1, event: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 'Withdrawn' } } });

module.exports = mongoose.model('VendorApplication', vendorApplicationSchema);

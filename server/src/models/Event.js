const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    description: {
      type: String,
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    category: {
      type: String,
      enum: [
        'Technical',
        'Cultural',
        'Sports',
        'Workshop',
        'Seminar',
        'Competition',
        'Conference',
        'Other'
      ],
      required: [true, 'Category is required']
    },

    eventType: {
      type: String,
      enum: ['Physical', 'Virtual', 'Hybrid'],
      default: 'Physical'
    },

    faculty: {
      type: String,
      enum: [
        'Computing',
        'Engineering',
        'Business',
        'Architecture',
        'Hospitality',
        'Science',
        'Other'
      ],
      required: [true, 'Faculty is required']
    },

    department: {
      type: String,
      maxlength: [50, 'Department name cannot exceed 50 characters']
    },

    venue: {
      type: String,
      maxlength: [100, 'Venue cannot exceed 100 characters']
    },

    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: 'Event date must be in the future'
      }
    },

    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > this.date;
        },
        message: 'End date must be after start date'
      }
    },

    // ===== CAPACITY & REGISTRATION =====
    capacity: {
      type: Number,
      required: [true, 'Event capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [100000, 'Capacity cannot exceed 100,000']
    },

    registrationCount: {
      type: Number,
      default: 0,
      min: 0
    },

    attendanceCount: {
      type: Number,
      default: 0,
      min: 0
    },

    waitlistEnabled: {
      type: Boolean,
      default: false
    },

    // ===== ORGANIZER & APPROVAL =====
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
      maxlength: [100, 'Organizer name cannot exceed 100 characters']
    },

    organizerEmail: {
      type: String,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      lowercase: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Draft'
    },

    approvedBy: {
      type: String
    },

    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    },

    // ===== SPONSORSHIP =====
    sponsorshipEnabled: {
      type: Boolean,
      default: false
    },

    sponsorshipTiers: [
      {
        tierName: {
          type: String,
          enum: ['Gold', 'Silver', 'Bronze']
        },
        price: {
          type: Number,
          min: 0
        },
        benefits: {
          type: String,
          maxlength: [500, 'Benefits cannot exceed 500 characters']
        }
      }
    ],

    // ===== FINANCIAL =====
    budget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative']
    },

    revenue: {
      type: Number,
      default: 0,
      min: [0, 'Revenue cannot be negative']
    },

    // ===== QR & CHECK-IN =====
    qrEnabled: {
      type: Boolean,
      default: true
    },

    checkInActive: {
      type: Boolean,
      default: false
    },

    // ===== TAGS (For Filtering & Search) =====
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
      }
    ],

    // ===== ANALYTICS FIELDS =====
    feedbackScore: {
      type: Number,
      min: [0, 'Feedback score cannot be less than 0'],
      max: [5, 'Feedback score cannot exceed 5']
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    cancellationReason: {
      type: String,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if event is full
EventSchema.virtual('isFull').get(function () {
  return this.capacity && this.registrationCount >= this.capacity;
});

// Virtual for calculating attendance rate
EventSchema.virtual('attendanceRate').get(function () {
  return this.registrationCount > 0 ? (this.attendanceCount / this.registrationCount * 100).toFixed(2) : 0;
});

// Index for common queries
EventSchema.index({ date: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ faculty: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Event', EventSchema);

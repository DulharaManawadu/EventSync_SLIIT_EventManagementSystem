const mongoose = require('mongoose');

const SponsorshipTierSchema = new mongoose.Schema(
  {
    tierName: {
      type: String,
      enum: ['Gold', 'Silver', 'Bronze'],
      required: [true, 'Tier name is required']
    },
    price: {
      type: Number,
      required: [true, 'Tier price is required'],
      min: [0, 'Tier price cannot be negative']
    },
    benefits: {
      type: String,
      required: [true, 'Tier benefits are required'],
      trim: true,
      maxlength: [500, 'Benefits cannot exceed 500 characters']
    }
  },
  { _id: false }
);

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
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters long'],
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
      trim: true,
      maxlength: [100, 'Department name cannot exceed 100 characters']
    },

    venue: {
      type: String, 
      trim: true
    },

    venueRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue"
    },

    // ===== RESOURCES =====
    resources: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    isAllocated: {
      type: Boolean,
      default: false
    },

    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function (value) {
          return value && value.getTime() >= Date.now() - 60000;
        },
        message: 'Event date must be in the present or future'
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

    // ===== ORGANIZER DETAILS =====
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
      maxlength: [100, 'Organizer cannot exceed 100 characters']
    },

    organizerName: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
      minlength: [2, 'Organizer name must be at least 2 characters long'],
      maxlength: [100, 'Organizer name cannot exceed 100 characters']
    },

    organizerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },

    phoneNumbers: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[+\d\s\-()]{7,20}$/.test(value);
          },
          message:
            'Phone number must contain only digits, spaces, +, hyphens, or parentheses and be 7-20 characters long'
        }
      }
    ],

    societyName: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
      minlength: [2, 'Society name must be at least 2 characters long'],
      maxlength: [100, 'Society name cannot exceed 100 characters']
    },

    // ===== APPROVAL =====
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Draft'
    },

    approvedBy: {
      type: String,
      trim: true
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    },

    // ===== SPONSORSHIP =====
    sponsorshipEnabled: {
      type: Boolean,
      default: false
    },

    sponsorshipTiers: {
      type: [SponsorshipTierSchema],
      default: [],
      validate: {
        validator: function (tiers) {
          if (!this.sponsorshipEnabled) return true;
          return Array.isArray(tiers) && tiers.length > 0;
        },
        message: 'At least one sponsorship tier is required when sponsorship is enabled'
      }
    },

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

    // ===== TAGS =====
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
      }
    ],

    // ===== ANALYTICS =====
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
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ===== EXTRA SCHEMA VALIDATION =====
EventSchema.path('phoneNumbers').validate(function (value) {
  return Array.isArray(value) && value.length > 0;
}, 'At least one phone number is required');

EventSchema.pre('validate', function (next) {
  if (this.organizerName && !this.organizer) {
    this.organizer = this.organizerName;
  }

  if (!this.sponsorshipEnabled) {
    this.sponsorshipTiers = [];
  }

  if (Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((tag) => (typeof tag === 'string' ? tag.trim() : tag))
      .filter(Boolean);
  }

  if (Array.isArray(this.phoneNumbers)) {
    this.phoneNumbers = this.phoneNumbers
      .map((phone) => (typeof phone === 'string' ? phone.trim() : phone))
      .filter(Boolean);
  }

  next();
});

// ===== VIRTUALS =====
EventSchema.virtual('isFull').get(function () {
  return this.capacity && this.registrationCount >= this.capacity;
});

EventSchema.virtual('attendanceRate').get(function () {
  return this.registrationCount > 0
    ? ((this.attendanceCount / this.registrationCount) * 100).toFixed(2)
    : 0;
});

// ===== INDEXES =====
EventSchema.index({ date: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ faculty: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isFeatured: 1 });
EventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', EventSchema);
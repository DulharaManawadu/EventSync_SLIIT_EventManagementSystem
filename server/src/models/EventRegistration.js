const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    studentUserId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attendanceStatus: {
      type: String,
      enum: ['Registered', 'Attended'],
      default: 'Registered'
    },
    checkedInAt: {
      type: Date,
      default: null
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    qrToken: {
      type: String,
      required: true,
      trim: true
    },
    qrVersion: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

EventRegistrationSchema.pre('validate', function syncEventFields(next) {
  if (this.eventId && !this.event) {
    this.event = this.eventId;
  }

  if (this.event && !this.eventId) {
    this.eventId = this.event;
  }

  next();
});

EventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
EventRegistrationSchema.index({ qrToken: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);

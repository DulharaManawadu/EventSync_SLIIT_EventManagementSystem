const mongoose = require('mongoose');

const FACULTY_OPTIONS = [
  'Computing',
  'Engineering',
  'Business',
  'Humanities',
  'Architecture',
  'Hospitality',
  'Science',
  'Other'
];

const USER_TYPES = ['Student', 'Admin', 'Vendor', 'Sponsor'];

function capitalizeName(value) {
  if (typeof value !== 'string') return value;
  const name = value.trim();
  if (!name) return name;
  return `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      set: capitalizeName
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      set: capitalizeName
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Contact number must be a 10 digit Sri Lankan number']
    },
    userType: {
      type: String,
      enum: USER_TYPES,
      required: [true, 'User type is required']
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{2}[0-9]{8}$/, 'User ID must be two uppercase letters followed by eight digits']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    faculty: {
      type: String,
      enum: [...FACULTY_OPTIONS, null],
      trim: true,
      default: null,
      required: function () {
        return this.userType === 'Student';
      }
    },
    academicYear: {
      type: String,
      trim: true,
      default: null,
      required: function () {
        return this.userType === 'Student';
      }
    },
    brandName: {
      type: String,
      trim: true,
      default: null,
      required: function () {
        return this.userType === 'Vendor';
      }
    },
    foodSafetyCertificate: {
      type: String,
      trim: true,
      default: null,
      required: function () {
        return this.userType === 'Vendor';
      }
    },
    companyName: {
      type: String,
      trim: true,
      default: null,
      required: function () {
        return this.userType === 'Sponsor';
      }
    },
    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      required: function () {
        return this.userType === 'Sponsor';
      },
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid company email address']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

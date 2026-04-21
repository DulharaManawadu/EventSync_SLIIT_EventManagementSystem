const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidFaculty } = require('../utils/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'eventsync_super_secret';
const JWT_EXPIRES_IN = '6h';
const VALID_USER_TYPES = ['Student', 'Admin', 'Vendor', 'Sponsor'];
const STUDENT_PREFIX = {
  Computing: 'IT',
  Engineering: 'EN',
  Business: 'BS',
  Humanities: 'HM',
  Architecture: 'AR',
  Hospitality: 'HS',
  Science: 'SC',
  Other: 'OT'
};

function normalizeName(value) {
  if (typeof value !== 'string') return value;
  const cleaned = value.trim().replace(/\s+/g, ' ');
  if (!cleaned) return cleaned;
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1).toLowerCase()}`;
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : email;
}

function normalizeUserId(userId) {
  return typeof userId === 'string' ? userId.trim().toUpperCase() : userId;
}

function validatePassword(password) {
  return {
    minLength: typeof password === 'string' && password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password)
  };
}

function createJwt(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType,
      userId: user.userId
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function buildPublicUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    contactNumber: user.contactNumber,
    userType: user.userType,
    userId: user.userId,
    faculty: user.faculty,
    academicYear: user.academicYear,
    brandName: user.brandName,
    foodSafetyCertificate: user.foodSafetyCertificate,
    companyName: user.companyName,
    companyEmail: user.companyEmail
  };
}

function getAutoPrefix(type) {
  switch (type) {
    case 'Admin':
      return 'AD';
    case 'Vendor':
      return 'VN';
    case 'Sponsor':
      return 'SP';
    default:
      return 'XX';
  }
}

function studentValidId(faculty, userId) {
  if (!faculty || !userId) return false;
  const prefix = STUDENT_PREFIX[faculty];
  return typeof prefix === 'string' && /^[A-Z]{2}[0-9]{8}$/.test(userId) && userId.startsWith(prefix);
}

function formatCertificateUrl(filename) {
  return `/uploads/vendorCertificates/${filename}`;
}

async function generateRandomDigits(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

async function generateUniqueUserId(prefix) {
  let candidate;
  let exists = true;
  while (exists) {
    candidate = `${prefix}${await generateRandomDigits(8)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await User.exists({ userId: candidate });
  }
  return candidate;
}

async function validateUniqueFields({ email, contactNumber, userId }) {
  const conditions = [
    { email: normalizeEmail(email) },
    { contactNumber: contactNumber?.trim() }
  ];

  if (userId) {
    conditions.push({ userId: normalizeUserId(userId) });
  }

  return User.findOne({ $or: conditions.filter(Boolean) });
}

async function createUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 10);
  return User.create({
    firstName: normalizeName(payload.firstName),
    lastName: normalizeName(payload.lastName),
    email: normalizeEmail(payload.email),
    contactNumber: payload.contactNumber.trim(),
    userType: payload.userType,
    userId: normalizeUserId(payload.userId),
    passwordHash,
    faculty: payload.faculty || null,
    academicYear: payload.academicYear || null,
    brandName: payload.brandName || null,
    foodSafetyCertificate: payload.foodSafetyCertificate || null,
    companyName: payload.companyName || null,
    companyEmail: payload.companyEmail ? normalizeEmail(payload.companyEmail) : null
  });
}

async function registerStudent(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      faculty,
      academicYear,
      userId,
      password,
      confirmPassword
    } = req.body;

    if (!firstName || !lastName || !email || !contactNumber || !faculty || !academicYear || !userId || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All student registration fields are required.' });
    }

    if (!isValidFaculty(faculty)) {
      return res.status(400).json({ success: false, message: 'Faculty is not valid.' });
    }

    const normalizedUserId = normalizeUserId(userId);
    if (!studentValidId(faculty, normalizedUserId)) {
      return res.status(400).json({ success: false, message: 'Student userId format is invalid for the selected faculty.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRules = validatePassword(password);
    if (Object.values(passwordRules).includes(false)) {
      return res.status(400).json({ success: false, message: 'Password does not satisfy all requirements.' });
    }

    const existing = await validateUniqueFields({ email, contactNumber, userId: normalizedUserId });
    if (existing) {
      if (existing.email === normalizeEmail(email)) {
        return res.status(409).json({ success: false, message: 'Email already exists.' });
      }
      if (existing.contactNumber === contactNumber.trim()) {
        return res.status(409).json({ success: false, message: 'Contact number already exists.' });
      }
      if (existing.userId === normalizedUserId) {
        return res.status(409).json({ success: false, message: 'User ID already exists.' });
      }
    }

    const newUser = await createUser({
      firstName,
      lastName,
      email,
      contactNumber,
      userType: 'Student',
      userId: normalizedUserId,
      password,
      faculty,
      academicYear
    });

    const token = createJwt(newUser);
    return res.status(201).json({ success: true, message: 'Student registered successfully.', data: { token, user: buildPublicUser(newUser) } });
  } catch (error) {
    console.error('Student Registration Error:', error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: duplicateField === 'email' ? 'Email already exists.' : duplicateField === 'contactNumber' ? 'Contact number already exists.' : 'Duplicate value detected.' });
    }
    return res.status(500).json({ success: false, message: 'An error occurred during student registration.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

async function registerVendor(req, res) {
  try {
    const { firstName, lastName, email, contactNumber, brandName, companyEmail, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !contactNumber || !brandName || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All vendor registration fields are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Food safety certificate file is required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRules = validatePassword(password);
    if (Object.values(passwordRules).includes(false)) {
      return res.status(400).json({ success: false, message: 'Password does not satisfy all requirements.' });
    }

    const existing = await validateUniqueFields({ email, contactNumber });
    if (existing) {
      if (existing.email === normalizeEmail(email)) {
        return res.status(409).json({ success: false, message: 'Email already exists.' });
      }
      if (existing.contactNumber === contactNumber.trim()) {
        return res.status(409).json({ success: false, message: 'Contact number already exists.' });
      }
    }

    const userId = await generateUniqueUserId(getAutoPrefix('Vendor'));
    const foodSafetyCertificate = formatCertificateUrl(req.file.filename);

    const newUser = await createUser({
      firstName,
      lastName,
      email,
      contactNumber,
      userType: 'Vendor',
      userId,
      password,
      brandName,
      foodSafetyCertificate,
      companyEmail
    });

    const token = createJwt(newUser);
    return res.status(201).json({ success: true, message: 'Vendor registered successfully.', data: { token, user: buildPublicUser(newUser) } });
  } catch (error) {
    console.error('Vendor Registration Error:', error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: duplicateField === 'email' ? 'Email already exists.' : duplicateField === 'contactNumber' ? 'Contact number already exists.' : 'Duplicate value detected.' });
    }
    return res.status(500).json({ success: false, message: 'An error occurred during vendor registration.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

async function registerSponsor(req, res) {
  try {
    const { firstName, lastName, email, contactNumber, companyName, companyEmail: rawCompanyEmail, brandEmail, password, confirmPassword } = req.body;
    const companyEmail = rawCompanyEmail || brandEmail;

    if (!firstName || !lastName || !email || !contactNumber || !companyName || !companyEmail || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All sponsor registration fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRules = validatePassword(password);
    if (Object.values(passwordRules).includes(false)) {
      return res.status(400).json({ success: false, message: 'Password does not satisfy all requirements.' });
    }

    const existing = await validateUniqueFields({ email, contactNumber });
    if (existing) {
      if (existing.email === normalizeEmail(email)) {
        return res.status(409).json({ success: false, message: 'Email already exists.' });
      }
      if (existing.contactNumber === contactNumber.trim()) {
        return res.status(409).json({ success: false, message: 'Contact number already exists.' });
      }
    }

    const userId = await generateUniqueUserId(getAutoPrefix('Sponsor'));
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      contactNumber,
      userType: 'Sponsor',
      userId,
      password,
      companyName,
      companyEmail
    });

    const token = createJwt(newUser);
    return res.status(201).json({ success: true, message: 'Sponsor registered successfully.', data: { token, user: buildPublicUser(newUser) } });
  } catch (error) {
    console.error('Sponsor Registration Error:', error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: duplicateField === 'email' ? 'Email already exists.' : duplicateField === 'contactNumber' ? 'Contact number already exists.' : 'Duplicate value detected.' });
    }
    return res.status(500).json({ success: false, message: 'An error occurred during sponsor registration.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

async function registerAdmin(req, res) {
  try {
    const { firstName, lastName, email, contactNumber, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All admin registration fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRules = validatePassword(password);
    if (Object.values(passwordRules).includes(false)) {
      return res.status(400).json({ success: false, message: 'Password does not satisfy all requirements.' });
    }

    const existing = await validateUniqueFields({ email, contactNumber });
    if (existing) {
      if (existing.email === normalizeEmail(email)) {
        return res.status(409).json({ success: false, message: 'Email already exists.' });
      }
      if (existing.contactNumber === contactNumber.trim()) {
        return res.status(409).json({ success: false, message: 'Contact number already exists.' });
      }
    }

    const userId = await generateUniqueUserId(getAutoPrefix('Admin'));
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      contactNumber,
      userType: 'Admin',
      userId,
      password
    });

    const token = createJwt(newUser);
    return res.status(201).json({ success: true, message: 'Admin registered successfully.', data: { token, user: buildPublicUser(newUser) } });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: duplicateField === 'email' ? 'Email already exists.' : duplicateField === 'contactNumber' ? 'Contact number already exists.' : 'Duplicate value detected.' });
    }
    return res.status(500).json({ success: false, message: 'An error occurred during admin registration.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

async function register(req, res) {
  const { userType } = req.body;

  if (!userType || !VALID_USER_TYPES.includes(userType)) {
    return res.status(400).json({ success: false, message: 'A valid userType is required for registration.' });
  }

  switch (userType) {
    case 'Student':
      return registerStudent(req, res);
    case 'Vendor':
      return registerVendor(req, res);
    case 'Sponsor':
      return registerSponsor(req, res);
    case 'Admin':
      return registerAdmin(req, res);
    default:
      return res.status(400).json({ success: false, message: 'Invalid user type.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not registered, please use a valid email or register.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = createJwt(user);
    return res.json({ success: true, message: 'Login successful.', data: { token, user: buildPublicUser(user) } });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error occurred during login.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: 'User profile retrieved.', data: buildPublicUser(user) });
  } catch (error) {
    console.error('Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}

module.exports = {
  register,
  registerStudent,
  registerVendor,
  registerSponsor,
  registerAdmin,
  login,
  getProfile
};

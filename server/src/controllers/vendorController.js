const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const VendorApplication = require('../models/VendorApplication');

function cleanUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    contactNumber: user.contactNumber,
    userType: user.userType,
    userId: user.userId,
    brandName: user.brandName,
    foodSafetyCertificate: user.foodSafetyCertificate,
    createdAt: user.createdAt
  };
}

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || user.userType !== 'Vendor') {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const applications = await VendorApplication.find({ vendor: userId }).populate('event', 'title date venue').lean();

    const restored = applications.map((app) => {
      if (!app.event || !app.event.title) {
        return {
          ...app,
          event: {
            title: app.eventTitle || 'Deleted Event',
            date: app.eventDate || null,
            venue: app.eventVenue || 'N/A',
            missing: true
          }
        };
      }
      return app;
    });

    const now = new Date();
    const upcoming = restored.filter((app) => app.status !== 'Withdrawn' && app.event && app.event.date && new Date(app.event.date) >= now);
    const past = restored.filter((app) => app.status === 'Approved' && app.event && app.event.date && new Date(app.event.date) < now);

    return res.status(200).json({
      success: true,
      data: {
        user: cleanUser(user),
        upcomingApplications: upcoming,
        pastParticipation: past
      }
    });
  } catch (error) {
    console.error('Vendor Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load vendor profile.', error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deleted = await User.findOneAndDelete({ _id: userId, userType: 'Vendor' });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await VendorApplication.deleteMany({ vendor: userId });

    return res.status(200).json({ success: true, message: 'Vendor profile deleted successfully.' });
  } catch (error) {
    console.error('Vendor Delete Error:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete vendor profile.', error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactNumber } = req.body;

    if (!contactNumber || !/^[0-9]{10}$/.test(contactNumber.trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10 digit Sri Lankan contact number.' });
    }

    const existing = await User.findOne({ contactNumber: contactNumber.trim(), _id: { $ne: userId } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Contact number already in use.' });
    }

    await User.updateOne({ _id: userId, userType: 'Vendor' }, { contactNumber: contactNumber.trim() });
    return res.status(200).json({ success: true, message: 'Phone number updated successfully.' });
  } catch (error) {
    console.error('Vendor update contact error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update contact number.', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match.' });
    }

    const user = await User.findById(userId).select('+passwordHash');
    if (!user || user.userType !== 'Vendor') {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Vendor update password error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update password.', error: error.message });
  }
};

exports.applyForEvent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { eventId, stallName, foodType, menuItems } = req.body;

    if (!eventId || !stallName || !foodType || !Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({ success: false, message: 'All fields are required including at least one menu item.' });
    }

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Selected event does not exist.' });
    }

    const hasApplied = await VendorApplication.findOne({ vendor: vendorId, event: eventId, status: { $ne: 'Withdrawn' } });
    if (hasApplied) {
      return res.status(409).json({ success: false, message: 'You already have an active application for this event.' });
    }

    const normalizedMenu = menuItems.map((item) => ({
      name: (item.name || '').trim(),
      price: Number(item.price)
    })).filter((item) => item.name && !Number.isNaN(item.price));

    if (normalizedMenu.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one valid menu item with price.' });
    }

    const application = await VendorApplication.create({
      vendor: vendorId,
      event: eventId,
      eventTitle: existingEvent.title,
      eventDate: existingEvent.date,
      eventVenue: existingEvent.venue || existingEvent.societyName || '',
      stallName: stallName.trim(),
      foodType: foodType.trim(),
      menuItems: normalizedMenu,
      status: 'Pending'
    });

    return res.status(201).json({ success: true, message: 'Stall application submitted successfully.', data: application });
  } catch (error) {
    console.error('Vendor apply event error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You already applied for this event.' });
    }
    return res.status(500).json({ success: false, message: 'Unable to apply for event.', error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const applications = await VendorApplication.find({ vendor: vendorId, status: { $ne: 'Withdrawn' } }).populate('event', 'title date venue').lean();

    const normalized = applications.map((app) => {
      if (!app.event || !app.event.title) {
        return {
          ...app,
          event: {
            title: app.eventTitle || 'Deleted Event',
            date: app.eventDate || null,
            venue: app.eventVenue || 'N/A',
            missing: true
          }
        };
      }
      return app;
    });

    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    console.error('Vendor get applications error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch applications.', error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const appId = req.params.id;
    const application = await VendorApplication.findOne({ _id: appId, vendor: vendorId }).populate('event').lean();
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const normalized = { ...application };
    if (!normalized.event || !normalized.event.title) {
      normalized.event = {
        title: normalized.eventTitle || 'Deleted Event',
        date: normalized.eventDate || null,
        venue: normalized.eventVenue || 'N/A',
        missing: true
      };
    }

    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    console.error('Vendor get application error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch application.', error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const appId = req.params.id;
    const { stallName, foodType, menuItems } = req.body;

    const application = await VendorApplication.findOne({ _id: appId, vendor: vendorId });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending applications can be updated.' });
    }

    if (stallName) application.stallName = stallName.trim();
    if (foodType) application.foodType = foodType.trim();

    if (Array.isArray(menuItems) && menuItems.length > 0) {
      const normalizedMenu = menuItems.map((item) => ({
        name: (item.name || '').trim(),
        price: Number(item.price)
      })).filter((item) => item.name && !Number.isNaN(item.price));
      if (normalizedMenu.length === 0) {
        return res.status(400).json({ success: false, message: 'Provide at least one valid menu item with price.' });
      }
      application.menuItems = normalizedMenu;
    }

    await application.save();
    return res.status(200).json({ success: true, message: 'Application updated successfully.', data: application });
  } catch (error) {
    console.error('Vendor update application error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update application.', error: error.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const appId = req.params.id;

    const application = await VendorApplication.findOne({ _id: appId, vendor: vendorId });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.status === 'Withdrawn') {
      return res.status(400).json({ success: false, message: 'Application is already withdrawn.' });
    }

    application.status = 'Withdrawn';
    application.withdrawnAt = new Date();
    await application.save();

    return res.status(200).json({ success: true, message: 'Application withdrawn successfully.', data: application });
  } catch (error) {
    console.error('Vendor withdraw error:', error);
    return res.status(500).json({ success: false, message: 'Unable to withdraw application.', error: error.message });
  }
};

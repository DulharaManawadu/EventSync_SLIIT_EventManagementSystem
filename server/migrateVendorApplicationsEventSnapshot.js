require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const VendorApplication = require('./src/models/VendorApplication');
const Event = require('./src/models/Event');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in environment.');
  process.exit(1);
}

async function openConnection(uri) {
  try {
    return await connectDB(uri);
  } catch (error) {
    if (error.message && error.message.includes('querySrv') && uri.startsWith('mongodb+srv://')) {
      const fallbackUri = uri.replace('mongodb+srv://', 'mongodb://');
      console.warn('SRV lookup failed, trying fallback URI.');
      return await connectDB(fallbackUri);
    }
    throw error;
  }
}

async function migrate() {
  try {
    await openConnection(MONGO_URI);

    console.log('Connected to MongoDB for vendor application migration.');

    const applications = await VendorApplication.find().lean();
    console.log(`Found ${applications.length} vendor application(s).`);

    let updatedCount = 0;
    let noEventCount = 0;

    for (const app of applications) {
      const updates = {};

      if (!app.eventTitle || !app.eventDate || !app.eventVenue) {
        // fetch event only if needed
        if (app.event) {
          const eventDoc = await Event.findById(app.event).lean();
          if (eventDoc) {
            updates.eventTitle = eventDoc.title || ''; 
            updates.eventDate = eventDoc.date || null;
            updates.eventVenue = eventDoc.venue || eventDoc.societyName || '';
          } else {
            noEventCount++;
            updates.eventTitle = app.eventTitle || 'Deleted Event';
            updates.eventDate = app.eventDate || null;
            updates.eventVenue = app.eventVenue || 'N/A';
          }
        } else {
          noEventCount++;
          updates.eventTitle = app.eventTitle || 'Deleted Event';
          updates.eventDate = app.eventDate || null;
          updates.eventVenue = app.eventVenue || 'N/A';
        }

        if (Object.keys(updates).length > 0) {
          await VendorApplication.updateOne({ _id: app._id }, { $set: updates });
          updatedCount++;
        }
      }
    }

    console.log(`Updated ${updatedCount} application(s).`);
    console.log(`No event reference found for ${noEventCount} application(s), filled fallback values.`);

    await mongoose.disconnect();
    console.log('Migration completed and MongoDB disconnected.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
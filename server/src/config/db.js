const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @param {string} mongoUri - MongoDB connection string
 * @returns {Promise<Object>} Mongoose instance
 * @throws {Error} If connection fails
 */
async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI must be provided to connectDB');
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to application termination');
      process.exit(0);
    });

    return connection;
  } catch (error) {
    // Provide more context when DNS SRV lookups fail or user supplied
    // a malformed URI (e.g. database name accidentally placed in query string)
    if (error.message && error.message.includes('querySrv')) {
      console.error('Failed to connect to MongoDB via SRV lookup.');
      console.error(
        '  - Check that your network and DNS provider allow SRV queries'
      );
      console.error(
        '  - For Atlas, confirm your IP address is whitelisted and credentials are correct'
      );
      console.error(
        '  - You can also try using a mongodb:// URI instead of mongodb+srv://'
      );
    } else if (
      error.message &&
      /option\s+\w+\s+is\s+not\s+supported/i.test(error.message)
    ) {
      console.error('MongoDB connection string appears malformed.');
      console.error('  - Make sure the database name goes after the host/port');
      console.error('    e.g. mongodb://host:27017/databasename');
      console.error('  - Do not put the db name or other text after ? as if it were an option.');
      console.error('  - For Atlas SRV URIs, the path is the database:');
      console.error('      mongodb+srv://user:pass@cluster0.mongodb.net/mydb');
      console.error('  - See README for examples.');
      console.error('Original error:', error.message);
    } else if (
      error.message &&
      error.message.includes('ENOTFOUND')
    ) {
      console.error('MongoDB DNS lookup failed for the configured host.');
      console.error('  - Confirm the MongoDB cluster host name is correct in MONGO_URI.');
      console.error('  - Verify your machine can resolve the hostname with DNS.');
      console.error('  - Make sure Atlas network access allows your current IP address.');
      console.error('Original error:', error.message);
    } else {
      console.error('Failed to connect to MongoDB:', error.message);
    }
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

module.exports = { connectDB, disconnectDB };

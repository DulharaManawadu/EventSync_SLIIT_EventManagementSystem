const dns = require('node:dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('node:path');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ===== CORS Configuration =====
const configuredClientUrl = process.env.CLIENT_URL;
const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools or same-origin calls without an Origin header.
    if (!origin) return callback(null, true);

    if (configuredClientUrl && origin === configuredClientUrl) {
      return callback(null, true);
    }

    if (localDevOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// ===== Middleware =====
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ===== Request Logging (Development) =====
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===== Health Check =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EventSync API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ===== Health Status Endpoint =====
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ===== API Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/event-registrations', require('./routes/eventRegistrationRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/sponsors', require('./routes/sponsorRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/admin/vendors', require('./routes/vendorAdminRoutes'));


// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// ===== Server Startup =====
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    // Validate configuration
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not configured');
    }

    // Connect to MongoDB with defensive retry for SRV lookups
    try {
      await connectDB(MONGO_URI);
      console.log('✓ Connected to MongoDB');
    } catch (err) {
      // common Atlas SRV error when DNS resolution is blocked
      if (err.message.includes('querySrv') && MONGO_URI.startsWith('mongodb+srv://')) {
        console.warn('⚠️ SRV lookup failed, retrying with regular connection string');
        const fallbackUri = MONGO_URI.replace('mongodb+srv://', 'mongodb://');
        await connectDB(fallbackUri);
        console.log('✓ Connected to MongoDB using fallback URI');
      } else {
        throw err;
      }
    }

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`\n✓ EventSync API Server Running`);
      console.log(`✓ Port: ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
      console.log('\n');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n✗ Port ${PORT} is already in use.`);
        console.error(`  Run: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F\n`);
        process.exit(1);
      } else {
        throw err;
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;

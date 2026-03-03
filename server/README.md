# EventSync Server

A robust Express.js + MongoDB REST API for managing university events, registrations, and analytics.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Request & Response Format](#request--response-format)
- [Error Handling](#error-handling)
- [Development](#development)

## Features

✅ **Event Management** - Create, read, and manage university events
✅ **Event Filtering** - Filter by status, faculty, category, and more  
✅ **Registration System** - Track event registrations and capacity
✅ **Check-in System** - QR-based or manual event attendance tracking
✅ **Analytics Dashboard** - Comprehensive event metrics and statistics
✅ **Sponsorship Management** - Support for sponsorship tiers and tracking
✅ **Validation** - Comprehensive input validation and error handling
✅ **CORS Support** - Ready for React frontend integration
✅ **Structured Logging** - Development-friendly error messages

## Tech Stack

- **Runtime**: Node.js >= 14.0.0
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 7.1.0 + Mongoose 7.0.0
- **Middleware**: CORS, Body Parser
- **Development**: Nodemon (hot reload)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   └── eventController.js    # Event business logic
│   ├── middleware/
│   │   └── authMiddleware.js     # Authentication middleware (placeholder)
│   ├── models/
│   │   └── Event.js              # Mongoose Event schema
│   ├── routes/
│   │   └── eventRoutes.js        # Event API endpoints
│   ├── utils/
│   │   ├── validators.js         # Validation utilities
│   │   └── responseFormatter.js  # Response formatting utilities
│   └── server.js                 # Express app setup
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── index.js                      # Server entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone and navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file:**
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventsync
   CLIENT_URL=http://localhost:3000
   ```

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/eventsync` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing key (future) | `your_secret_key` |

### MongoDB URI Examples

**Local MongoDB:**
```
mongodb://localhost:27017/eventsync
```

**MongoDB Atlas (Remote):**
```
mongodb+srv://username:password@cluster.mongodb.net/eventsync?retryWrites=true&w=majority
```

> **Note:**
>
> * The database name **must** appear in the path portion of the URI, not in the query string. A common mis‑format such as
>   `mongodb://localhost:27017?eventsync` causes the driver to interpret `eventsync` as an *option*, producing
>   `option eventsync is not supported`. Put the name after the slash: `mongodb://localhost:27017/eventsync`.
> * Atlas URIs use DNS SRV lookups. If you encounter an error such as
>   `querySrv ECONNREFUSED _mongodb._tcp.cluster0...` the SRV record lookup is being blocked. Ensure your network allows
>   SRV DNS queries, whitelist your IP in the Atlas dashboard, or switch to a plain `mongodb://` string. The server code
>   now automatically retries using a non‑SRV connection string when this occurs.

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/events
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create a new event |
| `GET` | `/` | List all events (with filters & pagination) |
| `GET` | `/analytics` | Get analytics and metrics |
| `GET` | `/:id` | Get a single event |
| `POST` | `/:id/register` | Register for an event |
| `POST` | `/:id/checkin` | Check-in to an event |

### Detailed Endpoint Documentation

#### 1. Create Event
```http
POST /api/events
Content-Type: application/json

{
  "title": "Tech Workshop 2024",
  "description": "Learn modern web development",
  "category": "Workshop",
  "eventType": "Physical",
  "faculty": "Computing",
  "department": "Computer Science",
  "venue": "Tech Lab Building A",
  "date": "2024-03-15T10:00:00Z",
  "capacity": 50,
  "organizer": "CS Department",
  "organizerEmail": "cs@university.edu",
  "budget": 5000,
  "tags": ["web", "programming", "workshop"],
  "isFeatured": true
}
```

**Response (201 Created):**
Success response with created event object.

#### 2. List Events
```http
GET /api/events?status=Approved&faculty=Computing&page=1&limit=10
```

**Response (200 OK):**
Returns paginated list of events.

#### 3. Get Analytics
```http
GET /api/events/analytics
```

**Response (200 OK):**
Returns comprehensive analytics dashboard data.

#### 4. Get Single Event
```http
GET /api/events/507f1f77bcf86cd799439011
```

**Response (200 OK):**
Returns single event details.

#### 5. Register for Event
```http
POST /api/events/507f1f77bcf86cd799439011/register
```

**Response (200 OK):**
Increments registration count.

#### 6. Check-in to Event
```http
POST /api/events/507f1f77bcf86cd799439011/checkin
```

**Response (200 OK):**
Increments attendance count.

## Request & Response Format

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2024-03-01T10:30:45.123Z"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Items retrieved",
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* optional detailed errors */ ],
  "timestamp": "2024-03-01T10:30:45.123Z"
}
```

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or missing fields |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

## Development

### Code Structure

- **Models** (`src/models/`) - Mongoose schemas with validation
- **Controllers** (`src/controllers/`) - Business logic for each resource
- **Routes** (`src/routes/`) - API endpoint definitions
- **Middleware** (`src/middleware/`) - Request processing (auth, logging, etc.)
- **Config** (`src/config/`) - Configuration files (database, etc.)
- **Utils** (`src/utils/`) - Helper functions and utilities

### Best Practices

1. **Always validate input** - Use validators in utils
2. **Use proper HTTP methods** - GET for retrieval, POST for creation
3. **Return consistent response format** - Use response formatters
4. **Handle errors gracefully** - Always catch promises and send appropriate errors
5. **Keep controllers clean** - Move business logic to models/utils
6. **Add helpful error messages** - Help frontend developers debug

## Future Enhancements

- [ ] JWT Authentication
- [ ] Role-based Access Control (Admin, Moderator, User)
- [ ] Email Notifications
- [ ] File Upload (event posters, documents)
- [ ] Advanced Search and Filters
- [ ] Event Recommendations
- [ ] Feedback/Rating System
- [ ] Report Generation
- [ ] API Rate Limiting
- [ ] Unit & Integration Tests

---

**Last Updated:** March 1, 2024
**Version:** 1.0.0

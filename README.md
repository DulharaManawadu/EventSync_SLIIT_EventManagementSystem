# 🎓 EventSync - Campus Event Management Platform
Professional event management system for SLIIT campus with QR attendance tracking and analytics.

## Features

-  Smart Event Creation & Management
-  Real-time Analytics Dashboard
-  Modern Dark UI with Responsive Design


##  Quick Start

### Prerequisites
- Node.js 16.0+
- MongoDB 5.0+

### Installation
```bash
git clone https://github.com/DulharaManawadu/EventSync_SLIIT_EventManagementSystem.git
cd EventSync_SLIIT_EventManagementSystem
npm run install-all
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI
npm run dev
```

### Environment Variables
```bash
# server/.env
PORT=5001
MONGO_URI=mongodb://localhost:27017/eventsync
JWT_SECRET=your-secret-key
```

## Project Structure
```
├── client/          # React frontend
├── server/          # Express.js backend
└── package.json     # Root configuration
```

## Tech Stack
- **Frontend:** React 18, React Router, CSS3
- **Backend:** Express.js, MongoDB, Mongoose
- **Tools:** Nodemon, ESLint, Prettier

## API Endpoints
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Application Features

### Event Management
- Multi-category events (Technical, Cultural, Sports)
- Faculty-based organization
- Capacity management
- Status tracking (Draft → Pending → Approved)

### Analytics Dashboard
- Visual data representation
- Participation statistics
- Performance metrics
- Export capabilities



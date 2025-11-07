# Event Manager Backend API

Backend server for Event Manager mobile application built with Node.js, Express, and MongoDB.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, validation, etc.)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── uploads/             # File uploads directory
├── .env.example         # Environment variables template
├── .gitignore
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```powershell
cd backend
npm install
```

2. Create `.env` file:
```powershell
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event_manager
JWT_SECRET=your_secret_key
```

4. Start MongoDB (if running locally):
```powershell
mongod
```

5. Run the server:
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Events
- `GET /api/events` - Get all events (with pagination & filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (organizer/admin only)
- `PUT /api/events/:id` - Update event (owner/admin only)
- `DELETE /api/events/:id` - Delete event (owner/admin only)
- `POST /api/events/:id/register` - Register for event

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (requires auth)
- `GET /api/users/my-events` - Get user's created events
- `GET /api/users/registered-events` - Get user's registered events

## 🔐 Authentication

API uses JWT tokens. Include token in Authorization header:
```
Authorization: Bearer <your_token>
```

## 🗄️ Database Models

### User
- name, email, password, phone, profileImage
- role: user, organizer, admin
- createdEvents[], registeredEvents[]

### Event
- title, description, category
- startDate, endDate
- location (address, city, state, country, coordinates)
- isOnline, meetingLink
- organizer, maxAttendees, attendees[]
- ticketPrice, images[], tags[]
- status: draft, published, cancelled, completed

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🧪 Testing

```powershell
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **morgan** - HTTP request logger

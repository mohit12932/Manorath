# Manorath

# Event Manager - Full Stack Mobile Application

A comprehensive event management mobile application built with Flutter for frontend and Node.js (Express) for backend.

## 📱 Tech Stack

### Frontend (Mobile App)
- **Flutter** - Cross-platform mobile framework
- **Provider** - State management
- **HTTP/Dio** - API networking
- **Flutter Secure Storage** - Secure token storage
- **Google Maps** - Location services

### Backend (API Server)
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
ml_project/
├── backend/                    # Node.js backend API
│   ├── src/
│   │   ├── config/            # Database & app configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/           # Mongoose schemas (User, Event)
│   │   ├── routes/           # API route definitions
│   │   └── server.js         # Express app entry point
│   ├── uploads/              # File uploads directory
│   ├── .env.example          # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── lib/                       # Flutter app source code
│   ├── config/               # API config
│   ├── models/               # Data models (Event, User)
│   ├── providers/            # State management (Auth, Event)
│   ├── screens/              # UI screens
│   │   ├── auth/            # Login, Register
│   │   └── home/            # Home, Events
│   ├── services/             # API services
│   └── main.dart            # App entry point
│
├── android/                  # Android platform code
├── ios/                     # iOS platform code
├── windows/                 # Windows platform code
├── pubspec.yaml             # Flutter dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Flutter SDK** (>=3.8.1)
- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **Git**

### Backend Setup

1. Navigate to backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file from template:
```powershell
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event_manager
JWT_SECRET=your_secret_key_here
```

5. Start MongoDB (if running locally):
```powershell
mongod
```

6. Run the backend server:
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to project root:
```powershell
cd ml_project
```

2. Install Flutter dependencies:
```powershell
flutter pub get
```

3. Update API endpoint in `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'http://YOUR_IP:3000/api';
// For Android emulator: http://10.0.2.2:3000/api
// For iOS simulator: http://localhost:3000/api
// For physical device: http://YOUR_LOCAL_IP:3000/api
```

4. Run the app:
```powershell
# On Windows
flutter run -d windows

# On Android emulator/device
flutter run -d <device-id>

# List available devices
flutter devices
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (auth required)

### Events
- `GET /api/events` - Get all events (paginated)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event (owner/admin)
- `DELETE /api/events/:id` - Delete event (owner/admin)
- `POST /api/events/:id/register` - Register for event (auth required)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/my-events` - Get created events
- `GET /api/users/registered-events` - Get registered events

## 🗄️ Database Models

### User
- Personal info: name, email, password, phone, profileImage
- Roles: user, organizer, admin
- Relationships: createdEvents[], registeredEvents[]

### Event
- Details: title, description, category
- Timing: startDate, endDate
- Location: address, city, state, country, coordinates
- Online: isOnline, meetingLink
- Management: organizer, attendees[], maxAttendees
- Media: images[], tags[]
- Pricing: ticketPrice
- Status: draft, published, cancelled, completed

## 🔐 Authentication

The app uses JWT-based authentication:
1. User registers/logs in
2. Backend returns JWT token
3. Token stored securely in Flutter Secure Storage
4. Token sent in `Authorization: Bearer <token>` header for protected routes

## 🧪 Testing

### Backend
```powershell
cd backend
npm test
```

### Frontend
```powershell
flutter test
```

## 📝 Development Guidelines

### Code Organization
- Backend follows MVC pattern (Models, Views/Routes, Controllers)
- Frontend uses Provider pattern for state management
- Models match between frontend and backend for consistency

### API Conventions
- RESTful endpoints
- JSON request/response format
- HTTP status codes for responses
- Error messages in `{ success: false, message: "..." }` format

### State Management
- Use Provider for app-wide state
- AuthProvider manages user authentication
- EventProvider manages event data

## 🔧 Configuration

### Backend Environment Variables
See `backend/.env.example` for all configuration options.

### Flutter Platform-Specific
- **Android**: Update `android/app/build.gradle.kts` for permissions
- **iOS**: Update `ios/Runner/Info.plist` for permissions
- **Windows**: Configured by default

## 📦 Key Dependencies

### Backend
- express, mongoose, jsonwebtoken, bcryptjs
- cors, dotenv, express-validator, multer

### Frontend
- provider, http, dio
- flutter_secure_storage, shared_preferences
- google_maps_flutter, geolocator
- cached_network_image, image_picker
- **country_code_picker** - Country selection for mobile auth
- **pinput** - Beautiful OTP input widget
- **flutter_image_compress** - Profile photo compression
- **intl** - Date formatting and localization
- **email_validator** - Email validation

## 🎯 Features

- ✅ User authentication (register, login, logout)
- ✅ **Mobile + OTP Authentication** (with Material 3 UI)
- ✅ Beautiful animated splash screen with gradients
- ✅ Comprehensive signup form with profile photo upload
- ✅ Event browsing and search
- ✅ Event creation and management (organizers)
- ✅ Event registration
- ✅ User profiles
- ✅ Location-based events
- 🚧 Online event support
- 🚧 Image uploads
- 🚧 Event notifications
- 🚧 Payment integration

## 🔐 Authentication

The app supports two authentication methods:

### 1. Mobile + OTP (Primary)
A modern, secure authentication flow using mobile number verification:
1. User enters mobile number with country code
2. OTP sent via SMS
3. User verifies OTP (6 digits, 30s resend timer, 3 attempts)
4. New users complete signup form with profile details
5. Existing users proceed directly to home

**Features:**
- Material 3 design with gradient animations
- Country code picker (190+ countries)
- Profile photo upload with auto-compression (<300KB)
- Comprehensive form validation
- Real-time error feedback
- Dark mode support

**Screens:**
- `lib/screens/auth/login_mobile_screen.dart` - Mobile login
- `lib/screens/auth/otp_screen.dart` - OTP verification
- `lib/screens/auth/signup_screen.dart` - User registration

📖 **Detailed Documentation:** See [AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)

### 2. Email/Password (Legacy)
Traditional email-based authentication for backward compatibility:
- User registers/logs in with email and password
- Backend returns JWT token
- Token stored securely in Flutter Secure Storage
- Token sent in `Authorization: Bearer <token>` header for protected routes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🐛 Known Issues

- API endpoint needs manual configuration for device testing
- Some compile warnings need dependencies installation (`flutter pub get`)
- MongoDB needs to be running before starting backend

## 📞 Support

For issues and questions, please open an issue in the repository.


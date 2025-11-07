# ML Project - Complete Setup Guide

## 📋 Project Overview

This project consists of three main components:
1. **Flutter Mobile App** - Frontend mobile application
2. **Node.js Backend** - Express backend with MongoDB
3. **TypeScript Backend (EventHub)** - Advanced Express backend with PostgreSQL and Prisma

## 🚀 Quick Start

### Prerequisites

- **Flutter SDK** (3.8.0 or higher)
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (for backend)
- **PostgreSQL** (for backend-eventhub)

### 1. Flutter App Setup

```bash
cd ml_project
flutter pub get
flutter run
```

**Note:** On Windows, you may need to enable Developer Mode for symlink support:
```bash
start ms-settings:developers
```

### 2. Node.js Backend Setup (Express + MongoDB)

```bash
cd backend
npm install

# Copy .env.example to .env and configure
cp .env.example .env

# Start MongoDB (if not running)
# mongod

# Run the server
npm run dev
```

**Default URL:** http://localhost:3000

### 3. TypeScript Backend Setup (EventHub)

```bash
cd backend-eventhub
npm install

# Copy .env.example to .env and configure
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed

# Run the server
npm run dev
```

**Default URL:** http://localhost:3002

## 📦 Dependencies Installed

### Flutter Dependencies

- **provider** (^6.1.2) - State management
- **http** (^1.2.2) - HTTP requests
- **flutter_secure_storage** (^9.2.2) - Secure token storage
- **country_code_picker** (^3.0.0) - Phone number input
- **image_picker** (^1.1.2) - Image selection
- **intl** (^0.19.0) - Date formatting
- **geolocator** (^13.0.2) - Location services
- **google_maps_flutter** (^2.9.0) - Maps integration
- **flutter_native_splash** (^2.4.1) - Splash screen

### Backend (MongoDB) Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **express-validator** - Request validation
- **morgan** - HTTP logging
- **multer** - File uploads

### Backend-EventHub (PostgreSQL) Dependencies

- **@prisma/client** - Database ORM
- **express** - Web framework
- **typescript** - Type safety
- **zod** - Schema validation
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **pino** - Logging
- **helmet** - Security headers
- **swagger-ui-express** - API documentation
- **multer** - File uploads
- **sharp** - Image processing
- **twilio** - SMS service (optional)

## 🔧 Configuration

### Flutter Configuration

Edit `lib/config/api_config.dart` to set your backend URL:
```dart
static const String baseUrl = 'http://10.0.2.2:3002/api'; // Android emulator
// or
static const String baseUrl = 'http://localhost:3002/api'; // iOS simulator
```

### Backend Configuration

Create `backend/.env` file:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ml_project
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=30d
CORS_ORIGIN=*
```

### Backend-EventHub Configuration

Create `backend-eventhub/.env` file:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/eventhub?schema=public"
JWT_ACCESS_SECRET="your_access_secret_min_32_chars"
JWT_REFRESH_SECRET="your_refresh_secret_min_32_chars"
PORT=3002
NODE_ENV="development"
```

## 📱 Running the App

### Development

```bash
# Run on Android
flutter run

# Run on iOS
flutter run

# Run on specific device
flutter devices
flutter run -d <device_id>
```

### Build for Production

```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release
```

## 🧪 Testing

### Flutter Tests
```bash
flutter test
```

### Backend Tests
```bash
cd backend
npm test
```

### Backend-EventHub Tests
```bash
cd backend-eventhub
npm test
```

## 🏗️ Project Structure

```
ml_project/
├── lib/                    # Flutter source code
│   ├── config/            # Configuration files
│   ├── models/            # Data models
│   ├── providers/         # State management
│   ├── screens/           # UI screens
│   ├── services/          # API services
│   └── main.dart          # Entry point
├── backend/               # Node.js backend (MongoDB)
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth & validation
│   │   ├── models/       # Mongoose models
│   │   └── routes/       # API routes
│   └── package.json
├── backend-eventhub/      # TypeScript backend (PostgreSQL)
│   ├── prisma/           # Database schema
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── middleware/   # Middleware
│   │   ├── modules/      # Feature modules
│   │   └── utils/        # Utilities
│   └── package.json
└── pubspec.yaml          # Flutter dependencies
```

## 🔐 Security Notes

1. **Change default secrets** in production environments
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable HTTPS** in production
4. **Secure database credentials**
5. **Update CORS origins** to specific domains
6. **Keep dependencies updated**

## 🐛 Troubleshooting

### Flutter Issues

**Problem:** Symlink support error on Windows
**Solution:** Enable Developer Mode: `start ms-settings:developers`

**Problem:** Build fails
**Solution:** 
```bash
flutter clean
flutter pub get
flutter run
```

### Backend Issues

**Problem:** MongoDB connection failed
**Solution:** Ensure MongoDB is running: `mongod`

**Problem:** Port already in use
**Solution:** Change PORT in .env file or kill the process using the port

### Backend-EventHub Issues

**Problem:** Prisma migration fails
**Solution:** 
```bash
npm run prisma:generate
npm run prisma:migrate
```

**Problem:** PostgreSQL connection failed
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct

## 📚 API Documentation

### Backend (MongoDB) - Port 3000
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- GET `/api/events` - List events
- POST `/api/events` - Create event

### Backend-EventHub (PostgreSQL) - Port 3002
- POST `/auth/request-otp` - Request OTP
- POST `/auth/verify-otp` - Verify OTP
- GET `/me` - Get user profile
- GET `/events` - List events
- POST `/events` - Create event
- GET `/healthz` - Health check

**Swagger Documentation:** http://localhost:3002/api-docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 💡 Tips

- Use `flutter doctor` to check Flutter installation
- Use `npm run dev` for hot reload in backends
- Check logs for debugging
- Use Postman/Thunder Client for API testing
- Enable verbose logging in development

## 🔗 Useful Commands

```bash
# Flutter
flutter clean              # Clean build cache
flutter pub outdated       # Check outdated packages
flutter doctor -v          # Detailed system check

# Backend
npm run dev               # Development mode
npm start                 # Production mode
npm run prisma:studio     # Prisma database GUI

# Git
git status                # Check status
git add .                 # Stage changes
git commit -m "message"   # Commit changes
```

## 📞 Support

For issues and questions:
1. Check this README first
2. Review error logs
3. Check the documentation
4. Search for similar issues
5. Create a new issue with details

---

**Happy Coding! 🚀**


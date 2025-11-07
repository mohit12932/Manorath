## Architecture Overview

This is a **full-stack Event Manager application** with Flutter frontend and Node.js backend:

- **Backend** (`backend/`): Express REST API with MongoDB (Mongoose ODM), JWT auth, MVC pattern
- **Frontend** (`lib/`): Flutter app using Provider for state management, HTTP for API calls
- **Data flow**: Flutter → API Client → Express Routes → Controllers → Models → MongoDB

Key relationships:
- User model has `createdEvents[]` and `registeredEvents[]` references
- Event model has `organizer` (User ref) and `attendees[]` (User refs)
- Auth uses JWT tokens stored in Flutter Secure Storage

## Critical Project Structure

### Backend (`backend/src/`)
- `server.js` - Express app entry, middleware, error handling
- `config/database.js` - MongoDB connection
- `models/` - Mongoose schemas: `User.model.js`, `Event.model.js`
- `controllers/` - Business logic: `auth.controller.js`, `event.controller.js`, `user.controller.js`
- `routes/` - API endpoints: `auth.routes.js`, `event.routes.js`, `user.routes.js`
- `middleware/` - `auth.middleware.js` (JWT), `validation.middleware.js` (express-validator)

### Frontend (`lib/`)
- `main.dart` - App entry with MultiProvider setup
- `config/api_config.dart` - **IMPORTANT**: Update `baseUrl` for device testing (10.0.2.2 for Android, YOUR_IP for physical)
- `models/` - Dart models matching backend schemas: `event_model.dart`, `user_model.dart`
- `services/` - API layer: `api_client.dart` (HTTP wrapper), `auth_service.dart`, `event_service.dart`
- `providers/` - State management: `auth_provider.dart`, `event_provider.dart`
- `screens/` - UI organized by feature: `auth/`, `home/`

## Developer Workflows (Concrete Commands)

### Backend setup & run
```powershell
cd backend
npm install
cp .env.example .env  # Then edit .env with MongoDB URI and JWT_SECRET
npm run dev           # Runs with nodemon for auto-reload
```

### Frontend setup & run
```powershell
flutter pub get
flutter run -d windows  # Local Windows dev
flutter run -d <device-id>  # Android/iOS device (get ID from `flutter devices`)
```

**CRITICAL**: Before running on Android emulator, update `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';  // Android emulator
```

### Testing & validation
```powershell
# Backend
cd backend; npm test

# Frontend
flutter analyze  # Check lint/static errors from analysis_options.yaml
flutter test

# Check backend health
curl http://localhost:3000/health
```

## Project-Specific Patterns (With Examples)

### API responses follow this structure:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

Errors return `{ "success": false, "message": "Error description" }` with appropriate HTTP codes.

### Authentication flow:
1. User calls `auth_service.dart` → `POST /api/auth/login`
2. Backend returns `{ user: {...}, token: "jwt..." }`
3. `api_client.dart` stores token via `FlutterSecureStorage`
4. Future requests include `Authorization: Bearer <token>` header (see `api_client.dart` `_getHeaders()`)

### State management pattern (see `providers/auth_provider.dart`):
```dart
_isLoading = true;
notifyListeners();  // Update UI
await _authService.login(...);
_isLoading = false;
notifyListeners();  // Update UI again
```

### Protected routes:
Backend uses `protect` middleware (see `middleware/auth.middleware.js`) - extracts JWT, attaches `req.user`.
Organizer-only routes also use `authorize('organizer', 'admin')`.

## Integration Points & Dependencies

- **MongoDB connection**: Backend won't start without MongoDB running (`mongod`) or valid Atlas URI in `.env`
- **CORS**: Backend allows origins matching `CORS_ORIGIN` env var (default `*`)
- **Package versions**: Backend uses Express 4.x, Mongoose 8.x; Frontend uses Flutter SDK >=3.8.1, Provider 6.x

## Key Files for Examples

- **Backend API structure**: `backend/src/server.js` (middleware setup, route mounting)
- **Model schemas**: `backend/src/models/Event.model.js` (Mongoose schema with validation, indexes)
- **Auth flow**: `backend/src/controllers/auth.controller.js` + `lib/services/auth_service.dart`
- **Provider pattern**: `lib/providers/event_provider.dart` (loading, error handling, notifyListeners)
- **API client wrapper**: `lib/services/api_client.dart` (token injection, error handling, timeout)

## Pre-PR Checklist

1. **Backend**: Run `npm run dev` and test endpoints with Postman/curl
2. **Frontend**: Run `flutter analyze` (must pass lints from `analysis_options.yaml`)
3. **Frontend**: Run `flutter test`
4. **Integration**: Test login flow end-to-end (register → login → fetch events)
5. **Config**: Verify `.env` not committed (in `.gitignore`), API URL correct for target platform

## Common Issues & Fixes

- **"Target of URI doesn't exist" errors**: Run `flutter pub get` to install dependencies
- **Android network failure**: Update `api_config.dart` baseUrl to `http://10.0.2.2:3000/api`
- **Backend crashes on start**: Check MongoDB is running (`mongod`) and `.env` has valid `MONGODB_URI`
- **401 Unauthorized**: Token expired or missing - logout and login again

If adding new features, follow existing patterns: backend route → controller → model, frontend service → provider → screen.

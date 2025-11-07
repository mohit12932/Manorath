# EventHub Backend API

Complete Event Management Backend built with **TypeScript**, **Express**, **Prisma ORM**, and **PostgreSQL**. Provides authentication with mobile OTP, event management, contact management, profile management, and file uploads.

## 🚀 Features

- ✅ **Mobile OTP Authentication** - SMS-based login with 6-digit OTP
- ✅ **JWT Authentication** - Access & refresh tokens with secure session management
- ✅ **Event Management** - Complete CRUD with pagination, search, and filtering
- ✅ **Contact Management** - Personal address book for users
- ✅ **Profile Management** - User profile with photo uploads
- ✅ **File Uploads** - Local and S3 storage support
- ✅ **Security Hardening** - Helmet, CORS, rate limiting, input validation
- ✅ **Clean Architecture** - Modular structure with separation of concerns
- ✅ **API Documentation** - Swagger/OpenAPI at `/docs`
- ✅ **Comprehensive Validation** - Zod schemas for all inputs
- ✅ **Structured Logging** - Pino logger with request tracking
- ✅ **Docker Support** - Docker Compose for easy deployment

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0
- Docker & Docker Compose (optional)

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.3+ |
| Framework | Express 4.18 |
| Database | PostgreSQL 14+ |
| ORM | Prisma 5.22 |
| Validation | Zod 3.22 |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | Bcrypt |
| Logging | Pino |
| Security | Helmet, CORS |
| Rate Limiting | express-rate-limit |
| Phone Validation | libphonenumber-js |
| File Upload | Multer |
| Storage | Local / AWS S3 |
| API Docs | Swagger (swagger-jsdoc) |
| Testing | Jest, ts-jest |

## 📦 Installation

### 1. Clone the Repository

```bash
cd backend-eventhub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/eventhub?schema=public"

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-me-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-me-in-production

# SMS Provider (console | twilio)
SMS_PROVIDER=console

# Storage (local | s3)
STORAGE_DRIVER=local

# Server
PORT=3002
NODE_ENV=development

# CORS
APP_ORIGIN=http://localhost:3000
```

### 4. Setup Database

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Seed Database (Optional)

```bash
npm run prisma:seed
```

This creates:
- 1 demo user
- 10 sample contacts
- 12 sample events

### 6. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3002`

API Documentation available at `http://localhost:3002/docs`

## 🐳 Docker Setup

### Quick Start with Docker Compose

```bash
# Start PostgreSQL and API
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

The API will be available at `http://localhost:3002`

## 📚 API Documentation

### Interactive Documentation

Visit `http://localhost:3002/docs` for Swagger UI with interactive API testing.

### Base URL

```
http://localhost:3002
```

### API Endpoints

#### Health Check

- `GET /healthz` - Server health status

#### Authentication

- `POST /auth/request-otp` - Request OTP for mobile number
- `POST /auth/verify-otp` - Verify OTP and login/signup
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate session

#### Profile

- `GET /me` - Get current user profile
- `PUT /me` - Update profile information
- `POST /me/photo` - Upload profile photo

#### Events

- `GET /events` - List events (paginated, filterable)
- `GET /events/:id` - Get event details
- `POST /events` - Create new event (auth required)
- `PUT /events/:id` - Update event (owner only)
- `PATCH /events/:id/publish` - Toggle event publish status
- `DELETE /events/:id` - Delete event (owner only)

#### Contacts

- `GET /contacts` - List user contacts (paginated)
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact (owner only)
- `DELETE /contacts/:id` - Delete contact (owner only)

#### Upload

- `POST /upload/banner` - Upload event banner image

## 🔐 Authentication Flow

### 1. Request OTP

```bash
POST /auth/request-otp
Content-Type: application/json

{
  "countryCode": "+1",
  "mobile": "1234567890"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 300
  }
}
```

### 2. Verify OTP

```bash
POST /auth/verify-otp
Content-Type: application/json

{
  "countryCode": "+1",
  "mobile": "1234567890",
  "code": "123456"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "countryCode": "+1",
      "mobile": "1234567890",
      "isMobileVerified": true
    },
    "isNewUser": false
  }
}
```

### 3. Use Access Token

```bash
GET /me
Authorization: Bearer <accessToken>
```

### 4. Refresh Token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm test
# Coverage report in coverage/index.html
```

## 📝 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:seed` | Seed database |
| `npm test` | Run tests with coverage |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |

## 🏗️ Project Structure

```
backend-eventhub/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.ts          # Environment validation
│   │   ├── logger.ts       # Pino logger setup
│   │   └── swagger.ts      # Swagger/OpenAPI config
│   ├── db/                 # Database
│   │   └── prisma.ts       # Prisma client singleton
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── modules/            # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── user/          # User profile
│   │   ├── event/         # Event management
│   │   ├── contact/       # Contact management
│   │   └── upload/        # File uploads
│   ├── utils/              # Utility functions
│   │   ├── phone.ts       # Phone number utilities
│   │   ├── response.ts    # API response helpers
│   │   └── helpers.ts     # General helpers
│   └── server.ts           # Express app entry point
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Database seeder
├── tests/                  # Test files
├── uploads/                # Local file uploads
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Refresh Token Rotation** - Prevents token reuse
- ✅ **Bcrypt Password Hashing** - Industry-standard hashing
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **Helmet** - Sets security HTTP headers
- ✅ **CORS** - Configurable cross-origin requests
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Prisma parameterized queries
- ✅ **XSS Protection** - Input sanitization
- ✅ **Request Size Limits** - Prevents DoS attacks
- ✅ **OTP Expiry** - Time-limited one-time passwords
- ✅ **Attempt Limiting** - Max OTP verification attempts

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=<production-db-url>
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
SMS_PROVIDER=twilio
TWILIO_SID=<your-twilio-sid>
TWILIO_TOKEN=<your-twilio-token>
TWILIO_FROM=<your-twilio-number>
STORAGE_DRIVER=s3
S3_BUCKET=<your-s3-bucket>
S3_REGION=<aws-region>
S3_ACCESS_KEY=<aws-access-key>
S3_SECRET_KEY=<aws-secret-key>
APP_ORIGIN=https://your-frontend-domain.com
```

### Build and Start

```bash
npm run build
npm start
```

### Database Migrations

```bash
npx prisma migrate deploy
```

## 📊 Database Schema

### User
- ID, name, email, countryCode, mobile, dob, gender, photoUrl
- isMobileVerified, createdAt, updatedAt

### OTP
- ID, countryCode, mobile, codeHash, expiresAt, attempts, consumed

### Session
- ID, userId, refreshTokenHash, userAgent, ip, createdAt, expiresAt

### Event
- ID, title, description, linkUrl, bannerUrl, startsAt
- isPublished, createdBy, createdAt, updatedAt

### Contact
- ID, userId, name, email, phone, notes, createdAt, updatedAt

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@eventhub.example or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Email OTP support
- [ ] Social login (Google, Facebook)
- [ ] Push notifications
- [ ] Event reminders
- [ ] Event categories and tags
- [ ] Advanced search with Elasticsearch
- [ ] GraphQL API
- [ ] WebSocket support for real-time updates
- [ ] Multi-tenancy support
- [ ] Admin dashboard

---

**Built with ❤️ by EventHub Team**

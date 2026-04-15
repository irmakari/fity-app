# Fitty 🏋️

Health & Fitness backend application built with **Node.js**, **Express**, and **MongoDB**.

## Features (Phase 1)

- ✅ User registration with strong password validation
- ✅ JWT-based authentication (7-day tokens)
- ✅ Login with email enumeration protection
- ✅ Forgot password flow with email OTP (6-digit code)
- ✅ OTP verification + password reset with confirm password
- ✅ Resend OTP with 30-second cooldown timer
- ✅ 6-Step Onboarding flow API mapping directly to the UI
- ✅ Profile & Settings API (get, update, notification toggles)
- ✅ Full security stack (Helmet, CORS, Rate Limiting, MongoDB Sanitize)
- ✅ 12 Mongoose models for the complete DB schema

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt (12 salt rounds)
- **Email:** Nodemailer (Gmail SMTP)

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6 or higher, running locally or MongoDB Atlas)
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fitty.git
cd fitty
```

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/fitty

# JWT (change the secret!)
JWT_SECRET=your-super-secret-key-at-least-64-characters-long-change-this
JWT_EXPIRES_IN=7d

# Email (Gmail) — requires App Password
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Gmail App Password:** Go to [Google App Passwords](https://myaccount.google.com/apppasswords), enable 2-Step Verification first, then create an App Password for "Mail". Use the 16-character password (without spaces) as `EMAIL_PASS`.

### 4. Start MongoDB

Make sure MongoDB is running locally:

```bash
# Windows (if installed as service, it's already running)
# Or start manually:
mongod
```

Or use [MongoDB Atlas](https://www.mongodb.com/atlas) and update `MONGO_URI` in `.env`.

### 5. Start the development server

```bash
npm run dev
```

You should see:

```
✅ MongoDB connected: localhost
🚀 Fitty API server is running
   Port: 5000
   Environment: development
   Health: http://localhost:5000/api/health
```

## API Endpoints

### Health Check

```
GET /api/health
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| POST | `/api/auth/resend-otp` | Resend OTP (30s cooldown) |
| POST | `/api/auth/reset-password` | Set new password |

### Profile (🔒 Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile & settings |
| PATCH | `/api/profile` | Update profile info |
| PATCH | `/api/profile/notifications` | Update notification toggles |

### Onboarding (🔒 Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/onboarding/status` | Get if the user has completed onboarding |
| POST | `/api/onboarding/complete`| Submit all 6-step onboarding data |

### Password Reset Flow

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  Forgot Password    │     │  Verification Code   │     │  Create New Password│
│                     │     │                      │     │                     │
│  [Email Address]    │────>│  [_ _ _ _ _ _]       │────>│  [New Password]     │
│                     │     │                      │     │  [Confirm Password] │
│  [Send Code]        │     │  Resend code in 00:30│     │                     │
│                     │     │  [Verify Code]       │     │  [Reset Password]   │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
    POST                        POST                        POST
    /forgot-password            /verify-otp                 /reset-password
                                POST /resend-otp
```

### Example: Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "MyPassword1!"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MyPassword1!"
  }'
```

### Example: Forgot Password → Verify OTP → Reset Password

**Step 1: Request OTP**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Step 2: Verify OTP (from email)**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "otp": "123456"}'
# → Returns: { "data": { "resetToken": "..." } }
```

**Step 2b: Resend OTP (if needed, after 30s)**
```bash
curl -X POST http://localhost:5000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Step 3: Set New Password**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "resetToken": "token-from-step-2",
    "newPassword": "NewPassword1!",
    "confirmPassword": "NewPassword1!"
  }'
```

### Example: Get Profile (🔒 requires token)

```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": { "id": "...", "name": "John Doe", "email": "john@example.com", "goalType": "build_muscle" },
    "physicalStats": { "age": 30, "heightCm": 175, "currentWeightKg": 75, "targetWeightKg": 70 },
    "goalsAndPreferences": { "goalType": "build_muscle", "weeklyWorkoutTarget": 4, "activityLevel": "active", ... },
    "notifications": { "workoutReminders": true, "waterReminders": true, "weeklyReports": true }
  }
}
```

### Example: Update Profile (🔒 requires token)

```bash
curl -X PATCH http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "age": 30,
    "heightCm": 175,
    "currentWeightKg": 75,
    "targetWeightKg": 70,
    "goalType": "build_muscle",
    "weeklyWorkoutTarget": 4,
    "activityLevel": "active"
  }'
```

### Example: Toggle Notifications (🔒 requires token)

```bash
curl -X PATCH http://localhost:5000/api/profile/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notificationWorkoutReminders": false,
    "notificationWaterReminders": true,
    "notificationWeeklyReports": true
  }'
```

### Example: Complete Onboarding (🔒 requires token)

```bash
curl -X POST http://localhost:5000/api/onboarding/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "goalType": "build_muscle",
    "fitnessLevel": "beginner",
    "weeklyWorkoutTarget": 3,
    "trainingLocation": "gym",
    "focusMuscles": ["chest", "back", "legs"],
    "age": 30,
    "heightCm": 175,
    "currentWeightKg": 70,
    "targetWeightKg": 65
  }'
```

## Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- At least one special character (`!@#$%^&*` etc.)

## Project Structure

```
fitty/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   └── profileController.js  # Profile logic
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   ├── rateLimiter.js     # Rate limiting
│   │   │   └── validate.js        # Input validation
│   │   ├── models/                # All 12 Mongoose models
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   └── profileRoutes.js   # Profile endpoints
│   │   ├── utils/
│   │   │   ├── ApiError.js        # Custom error class
│   │   │   ├── generateToken.js   # JWT helper
│   │   │   └── sendEmail.js       # Email helper
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   ├── .env.example               # Environment template
│   ├── .gitignore
│   └── package.json
└── frontend/                      # Coming soon
```

## Security

- 🔒 Passwords hashed with bcrypt (12 salt rounds)
- 🔑 JWT authentication with 7-day expiry
- 🛡️ Helmet HTTP security headers
- 🚫 Rate limiting on all endpoints (stricter on auth)
- 🧹 MongoDB NoSQL injection protection
- ✅ Input validation on all endpoints
- 🔐 OTP codes hashed (SHA-256) before storage
- 🕵️ Email enumeration protection on login & forgot-password
- ⏱️ 30-second cooldown on OTP resend
- 🔗 Confirm password validation on reset

## License

MIT

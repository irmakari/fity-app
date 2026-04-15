const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');

const app = express();

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// HTTP security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
app.use('/api', generalLimiter);

// Body parsing (limit: 10kb — protection against large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// MongoDB NoSQL injection protection
app.use(mongoSanitize());

// HTTP parameter pollution protection
app.use(hpp());

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitty API is running. 🏋️',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Onboarding routes
app.use('/api/onboarding', onboardingRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ============================================================
// GLOBAL ERROR HANDLING
// ============================================================
app.use(errorHandler);

module.exports = app;

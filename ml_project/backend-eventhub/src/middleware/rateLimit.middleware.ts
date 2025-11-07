import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { config } from '../config/env';
import { ErrorCodes } from '../utils/response';

/**
 * Global rate limiter - applies to all routes
 */
export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    ok: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * OTP request rate limiter - stricter limits for OTP generation
 * Limits both by IP and by phone number
 */
export const otpRequestRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.otp.windowMs,
  max: config.rateLimit.otp.max,
  message: {
    ok: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many OTP requests, please wait before trying again',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use phone number as key in addition to IP
  keyGenerator: (req) => {
    const body = req.body as { countryCode?: string; mobile?: string };
    if (body.countryCode && body.mobile) {
      return `otp:${body.countryCode}${body.mobile}`;
    }
    return req.ip || 'unknown';
  },
});

/**
 * OTP verification rate limiter - prevent brute force attacks
 */
export const otpVerifyRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.otp.windowMs,
  max: config.rateLimit.otp.max,
  message: {
    ok: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many verification attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const body = req.body as { countryCode?: string; mobile?: string };
    if (body.countryCode && body.mobile) {
      return `verify:${body.countryCode}${body.mobile}`;
    }
    return req.ip || 'unknown';
  },
});

/**
 * Auth rate limiter - for login/refresh endpoints
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    ok: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Upload rate limiter - prevent abuse of upload endpoints
 */
export const uploadRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    ok: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many upload requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

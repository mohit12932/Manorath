import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variable validation schema
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),

  // SMS
  SMS_PROVIDER: z.enum(['console', 'twilio']).default('console'),
  TWILIO_SID: z.string().optional(),
  TWILIO_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),

  // Storage
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('./uploads'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  // CORS
  APP_ORIGIN: z.string().default('http://localhost:3000'),

  // Server
  PORT: z.string().transform(Number).default('3002'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  OTP_RATE_LIMIT_MAX: z.string().transform(Number).default('5'),
  OTP_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),

  // OTP
  OTP_LENGTH: z.string().transform(Number).default('6'),
  OTP_EXPIRY_MINUTES: z.string().transform(Number).default('5'),
  OTP_MAX_ATTEMPTS: z.string().transform(Number).default('5'),
  OTP_RESEND_COOLDOWN_SECONDS: z.string().transform(Number).default('30'),

  // Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('2097152'), // 2MB
  ALLOWED_IMAGE_TYPES: z.string().default('image/jpeg,image/png,image/jpg,image/webp'),
});

/**
 * Validated environment configuration
 */
const envVars = envSchema.parse(process.env);

/**
 * Application configuration object
 */
export const config = {
  database: {
    url: envVars.DATABASE_URL,
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExpiry: envVars.JWT_ACCESS_EXPIRY,
    refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
  },
  sms: {
    provider: envVars.SMS_PROVIDER,
    twilio: {
      sid: envVars.TWILIO_SID,
      token: envVars.TWILIO_TOKEN,
      from: envVars.TWILIO_FROM,
    },
  },
  storage: {
    driver: envVars.STORAGE_DRIVER,
    local: {
      uploadDir: envVars.UPLOAD_DIR,
    },
    s3: {
      bucket: envVars.S3_BUCKET,
      region: envVars.S3_REGION,
      accessKey: envVars.S3_ACCESS_KEY,
      secretKey: envVars.S3_SECRET_KEY,
    },
  },
  cors: {
    origin: envVars.APP_ORIGIN,
  },
  server: {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
  },
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    otp: {
      max: envVars.OTP_RATE_LIMIT_MAX,
      windowMs: envVars.OTP_RATE_LIMIT_WINDOW_MS,
    },
  },
  otp: {
    length: envVars.OTP_LENGTH,
    expiryMinutes: envVars.OTP_EXPIRY_MINUTES,
    maxAttempts: envVars.OTP_MAX_ATTEMPTS,
    resendCooldownSeconds: envVars.OTP_RESEND_COOLDOWN_SECONDS,
  },
  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE,
    allowedImageTypes: envVars.ALLOWED_IMAGE_TYPES.split(','),
  },
} as const;

/**
 * Utility to check if running in production
 */
export const isProduction = () => config.server.env === 'production';

/**
 * Utility to check if running in development
 */
export const isDevelopment = () => config.server.env === 'development';

/**
 * Utility to check if running in test
 */
export const isTest = () => config.server.env === 'test';

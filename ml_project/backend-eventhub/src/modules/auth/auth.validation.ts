import { z } from 'zod';

/**
 * Request OTP validation schema
 */
export const requestOtpSchema = z.object({
  countryCode: z.string().regex(/^\+\d{1,4}$/, 'Invalid country code format'),
  mobile: z.string().regex(/^\d{6,15}$/, 'Invalid mobile number format'),
});

/**
 * Verify OTP validation schema
 */
export const verifyOtpSchema = z.object({
  countryCode: z.string().regex(/^\+\d{1,4}$/, 'Invalid country code format'),
  mobile: z.string().regex(/^\d{6,15}$/, 'Invalid mobile number format'),
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must contain only digits'),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Signup validation schema (for new users after OTP verification)
 */
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').optional().nullable(),
  dob: z.string().datetime({ offset: true }).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
  countryCode: z.string().regex(/^\+\d{1,4}$/),
  mobile: z.string().regex(/^\d{6,15}$/),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

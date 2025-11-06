import { Router } from 'express';
import { requestOtp, verifyOtp, refreshToken, logout } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  requestOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from './auth.validation';
import {
  otpRequestRateLimiter,
  otpVerifyRateLimiter,
  authRateLimiter,
} from '../../middleware/rateLimit.middleware';

const router = Router();

/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for mobile login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - countryCode
 *               - mobile
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: "+1"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       429:
 *         description: Rate limit exceeded or resend cooldown
 *       400:
 *         description: Invalid input
 */
router.post(
  '/request-otp',
  otpRequestRateLimiter,
  validate(requestOtpSchema),
  requestOtp
);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login/signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - countryCode
 *               - mobile
 *               - code
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: "+1"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified, returns user and tokens
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: No OTP found
 *       429:
 *         description: Max attempts exceeded
 */
router.post(
  '/verify-otp',
  otpVerifyRateLimiter,
  validate(verifyOtpSchema),
  verifyOtp
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  '/refresh',
  authRateLimiter,
  validate(refreshTokenSchema),
  refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and invalidate session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Optional - logout specific session
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', authMiddleware, logout);

export default router;

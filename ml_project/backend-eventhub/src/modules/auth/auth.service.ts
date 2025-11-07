import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { generateOTP } from '../../utils/helpers';
import { normalizePhoneNumber } from '../../utils/phone';
import { SmsService } from './sms.service';
import { User } from '@prisma/client';

/**
 * Auth Service - handles OTP, JWT, and session management
 */
export class AuthService {
  private smsService = SmsService.getInstance();

  /**
   * Request OTP - generates and sends OTP to mobile number
   */
  async requestOtp(countryCode: string, mobile: string): Promise<{ expiresIn: number }> {
    // Normalize phone number
    const normalized = normalizePhoneNumber(countryCode, mobile);
    if (!normalized.isValid) {
      throw new Error('Invalid phone number');
    }

    const { countryCode: normalizedCountryCode, mobile: normalizedMobile } = normalized;

    // Check for recent OTP requests (cooldown)
    const recentOtp = await prisma.otp.findFirst({
      where: {
        countryCode: normalizedCountryCode,
        mobile: normalizedMobile,
        consumed: false,
        createdAt: {
          gte: new Date(Date.now() - config.otp.resendCooldownSeconds * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      const timeSinceCreation = Date.now() - recentOtp.createdAt.getTime();
      const cooldownRemaining = config.otp.resendCooldownSeconds * 1000 - timeSinceCreation;
      
      if (cooldownRemaining > 0) {
        throw new Error(`Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before requesting a new OTP`);
      }
    }

    // Generate OTP
    const code = generateOTP(config.otp.length);
    const codeHash = await bcrypt.hash(code, 10);

    // Calculate expiry
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    // Save OTP to database
    await prisma.otp.create({
      data: {
        countryCode: normalizedCountryCode,
        mobile: normalizedMobile,
        codeHash,
        expiresAt,
        attempts: 0,
        consumed: false,
      },
    });

    // Send SMS
    await this.smsService.sendOtp(normalizedCountryCode, normalizedMobile, code);

    logger.info(
      {
        countryCode: normalizedCountryCode,
        mobile: normalizedMobile,
      },
      'OTP requested successfully'
    );

    return {
      expiresIn: config.otp.expiryMinutes * 60,
    };
  }

  /**
   * Verify OTP - validates OTP and returns user with tokens
   */
  async verifyOtp(
    countryCode: string,
    mobile: string,
    code: string,
    userAgent?: string,
    ip?: string
  ): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    // Normalize phone number
    const normalized = normalizePhoneNumber(countryCode, mobile);
    if (!normalized.isValid) {
      throw new Error('Invalid phone number');
    }

    const { countryCode: normalizedCountryCode, mobile: normalizedMobile } = normalized;

    // Find the most recent unconsumed OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        countryCode: normalizedCountryCode,
        mobile: normalizedMobile,
        consumed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new Error('No OTP found. Please request a new one.');
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Check max attempts
    if (otpRecord.attempts >= config.otp.maxAttempts) {
      throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // Increment attempts
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 },
    });

    // Verify OTP
    const isValid = await bcrypt.compare(code, otpRecord.codeHash);

    if (!isValid) {
      const attemptsLeft = config.otp.maxAttempts - (otpRecord.attempts + 1);
      throw new Error(
        `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
      );
    }

    // Mark OTP as consumed
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { consumed: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        countryCode_mobile: {
          countryCode: normalizedCountryCode,
          mobile: normalizedMobile,
        },
      },
    });

    const isNewUser = !user;

    if (!user) {
      // Create new user with mobile verified
      user = await prisma.user.create({
        data: {
          name: `User ${normalizedMobile.slice(-4)}`,
          countryCode: normalizedCountryCode,
          mobile: normalizedMobile,
          isMobileVerified: true,
        },
      });

      logger.info({ userId: user.id }, 'New user created');
    } else {
      // Update existing user to mark mobile as verified
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isMobileVerified: true },
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id, userAgent, ip);

    logger.info({ userId: user.id, isNewUser }, 'OTP verified successfully');

    return {
      user,
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(
    userId: string,
    userAgent?: string,
    ip?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Generate access token
    // @ts-ignore - JWT sign types are overly strict
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      config.jwt.accessSecret as string,
      { expiresIn: config.jwt.accessExpiry as string }
    );

    // Generate refresh token
    // @ts-ignore - JWT sign types are overly strict
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpiry as string }
    );

    // Hash refresh token for storage
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Calculate refresh token expiry
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create session
    await prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        userAgent,
        ip,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshToken: string,
    userAgent?: string,
    ip?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Find session with matching refresh token
      const sessions = await prisma.session.findMany({
        where: {
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
      });

      let validSession = null;
      for (const session of sessions) {
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (isValid) {
          validSession = session;
          break;
        }
      }

      if (!validSession) {
        throw new Error('Invalid or expired refresh token');
      }

      // Delete old session (refresh token rotation)
      await prisma.session.delete({
        where: { id: validSession.id },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(decoded.userId, userAgent, ip);

      logger.info({ userId: decoded.userId }, 'Tokens refreshed successfully');

      return tokens;
    } catch (error) {
      logger.error({ error }, 'Token refresh failed');
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout - invalidate session
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Find and delete specific session
      const sessions = await prisma.session.findMany({
        where: { userId },
      });

      for (const session of sessions) {
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (isValid) {
          await prisma.session.delete({
            where: { id: session.id },
          });
          logger.info({ userId, sessionId: session.id }, 'Session logged out');
          return;
        }
      }
    } else {
      // Delete all sessions for user
      await prisma.session.deleteMany({
        where: { userId },
      });
      logger.info({ userId }, 'All sessions logged out');
    }
  }

  /**
   * Cleanup expired OTPs and sessions
   */
  async cleanupExpired(): Promise<void> {
    const now = new Date();

    // Delete expired OTPs
    const deletedOtps = await prisma.otp.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { consumed: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    // Delete expired sessions
    const deletedSessions = await prisma.session.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    logger.info(
      {
        deletedOtps: deletedOtps.count,
        deletedSessions: deletedSessions.count,
      },
      'Cleanup completed'
    );
  }
}

export const authService = new AuthService();

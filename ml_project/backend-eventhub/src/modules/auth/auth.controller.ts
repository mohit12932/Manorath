import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendError, ErrorCodes } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { logger } from '../../config/logger';

/**
 * Request OTP Controller
 */
export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { countryCode, mobile } = req.body;

    const result = await authService.requestOtp(countryCode, mobile);

    sendSuccess(res, {
      message: 'OTP sent successfully',
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    logger.error({ error }, 'Request OTP failed');
    const message = error instanceof Error ? error.message : 'Failed to send OTP';
    
    if (message.includes('wait')) {
      sendError(res, ErrorCodes.OTP_RESEND_COOLDOWN, message, 429);
    } else if (message.includes('Invalid phone')) {
      sendError(res, ErrorCodes.INVALID_INPUT, message, 400);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to send OTP', 500);
    }
  }
};

/**
 * Verify OTP Controller
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { countryCode, mobile, code } = req.body;
    const userAgent = req.get('user-agent');
    const ip = req.ip;

    const result = await authService.verifyOtp(countryCode, mobile, code, userAgent, ip);

    sendSuccess(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        countryCode: result.user.countryCode,
        mobile: result.user.mobile,
        dob: result.user.dob,
        gender: result.user.gender,
        photoUrl: result.user.photoUrl,
        isMobileVerified: result.user.isMobileVerified,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      },
      isNewUser: result.isNewUser,
    });
  } catch (error) {
    logger.error({ error }, 'Verify OTP failed');
    const message = error instanceof Error ? error.message : 'OTP verification failed';

    if (message.includes('expired')) {
      sendError(res, ErrorCodes.OTP_EXPIRED, message, 400);
    } else if (message.includes('Invalid OTP')) {
      sendError(res, ErrorCodes.OTP_INVALID, message, 400);
    } else if (message.includes('Maximum')) {
      sendError(res, ErrorCodes.OTP_MAX_ATTEMPTS, message, 429);
    } else if (message.includes('No OTP found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else if (message.includes('Invalid phone')) {
      sendError(res, ErrorCodes.INVALID_INPUT, message, 400);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'OTP verification failed', 500);
    }
  }
};

/**
 * Refresh Token Controller
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    const userAgent = req.get('user-agent');
    const ip = req.ip;

    const result = await authService.refreshAccessToken(token, userAgent, ip);

    sendSuccess(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    logger.error({ error }, 'Token refresh failed');
    sendError(res, ErrorCodes.INVALID_TOKEN, 'Invalid or expired refresh token', 401);
  }
};

/**
 * Logout Controller
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { refreshToken } = req.body;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    await authService.logout(authReq.user.id, refreshToken);

    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    logger.error({ error }, 'Logout failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Logout failed', 500);
  }
};

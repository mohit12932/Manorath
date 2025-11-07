import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { sendError, ErrorCodes } from '../utils/response';
import { logger } from '../config/logger';

/**
 * Extended Express Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    countryCode: string;
    mobile: string;
  };
}

/**
 * JWT Payload structure
 */
interface JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
}

/**
 * Authentication middleware - validates JWT access token
 * Attaches user information to req.user
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    if (decoded.type !== 'access') {
      sendError(res, ErrorCodes.INVALID_TOKEN, 'Invalid token type', 401);
      return;
    }

    // Attach user info to request
    (req as AuthRequest).user = {
      id: decoded.userId,
      countryCode: '', // Will be populated by auth service if needed
      mobile: '',
    };

    logger.debug({ userId: decoded.userId }, 'User authenticated');
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, ErrorCodes.TOKEN_EXPIRED, 'Token has expired', 401);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, ErrorCodes.INVALID_TOKEN, 'Invalid token', 401);
      return;
    }

    logger.error({ error }, 'Authentication error');
    sendError(res, ErrorCodes.UNAUTHORIZED, 'Authentication failed', 401);
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * Used for routes that work with or without authentication
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

      if (decoded.type === 'access') {
        (req as AuthRequest).user = {
          id: decoded.userId,
          countryCode: '',
          mobile: '',
        };
      }
    }
  } catch (error) {
    // Silently fail - this is optional auth
    logger.debug({ error }, 'Optional auth failed, continuing without auth');
  }

  next();
};

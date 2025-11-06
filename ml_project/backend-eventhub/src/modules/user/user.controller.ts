import { Request, Response } from 'express';
import { userService } from './user.service';
import { sendSuccess, sendError, ErrorCodes } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { logger } from '../../config/logger';

/**
 * Get current user profile
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const user = await userService.getUserById(authReq.user.id);

    if (!user) {
      sendError(res, ErrorCodes.NOT_FOUND, 'User not found', 404);
      return;
    }

    sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      countryCode: user.countryCode,
      mobile: user.mobile,
      dob: user.dob,
      gender: user.gender,
      photoUrl: user.photoUrl,
      isMobileVerified: user.isMobileVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error({ error }, 'Get profile failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to get profile', 500);
  }
};

/**
 * Update current user profile
 */
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { name, email, dob, gender } = req.body;

    const user = await userService.updateProfile(authReq.user.id, {
      name,
      email,
      dob,
      gender,
    });

    sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      countryCode: user.countryCode,
      mobile: user.mobile,
      dob: user.dob,
      gender: user.gender,
      photoUrl: user.photoUrl,
      isMobileVerified: user.isMobileVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error({ error }, 'Update profile failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to update profile', 500);
  }
};

/**
 * Update profile photo (handles upload from upload service)
 */
export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { photoUrl } = req.body;

    if (!photoUrl) {
      sendError(res, ErrorCodes.VALIDATION_ERROR, 'Photo URL is required', 400);
      return;
    }

    const user = await userService.updatePhoto(authReq.user.id, photoUrl);

    sendSuccess(res, {
      photoUrl: user.photoUrl,
      message: 'Profile photo updated successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Update photo failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to update photo', 500);
  }
};

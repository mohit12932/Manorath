import { Request, Response } from 'express';
import { StorageService } from './storage.service';
import { sendSuccess, sendError, ErrorCodes } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { logger } from '../../config/logger';
import { userService } from '../user/user.service';

const storageService = StorageService.getInstance();

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    if (!req.file) {
      sendError(res, ErrorCodes.VALIDATION_ERROR, 'No file provided', 400);
      return;
    }

    const photoUrl = await storageService.upload(req.file, 'profiles');
    await userService.updatePhoto(authReq.user.id, photoUrl);

    sendSuccess(res, { photoUrl });
  } catch (error) {
    logger.error({ error }, 'Profile photo upload failed');
    sendError(res, ErrorCodes.UPLOAD_FAILED, 'Failed to upload photo', 500);
  }
};

/**
 * Upload event banner
 */
export const uploadEventBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    if (!req.file) {
      sendError(res, ErrorCodes.VALIDATION_ERROR, 'No file provided', 400);
      return;
    }

    const bannerUrl = await storageService.upload(req.file, 'banners');

    sendSuccess(res, { bannerUrl });
  } catch (error) {
    logger.error({ error }, 'Banner upload failed');
    sendError(res, ErrorCodes.UPLOAD_FAILED, 'Failed to upload banner', 500);
  }
};

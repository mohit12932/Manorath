import multer from 'multer';
import { config } from '../../config/env';
import { sendError, ErrorCodes } from '../../utils/response';
import { Request, Response, NextFunction } from 'express';

/**
 * Multer configuration for file uploads
 */
const storage = multer.memoryStorage();

/**
 * File filter for images only
 */
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (config.upload.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'));
  }
};

/**
 * Multer upload middleware
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: imageFilter,
});

/**
 * Error handler for multer
 */
export const handleUploadError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      sendError(
        res,
        ErrorCodes.FILE_TOO_LARGE,
        `File too large. Maximum size is ${config.upload.maxFileSize / 1024 / 1024}MB`,
        400
      );
      return;
    }
    sendError(res, ErrorCodes.UPLOAD_FAILED, err.message, 400);
    return;
  }

  if (err) {
    sendError(res, ErrorCodes.INVALID_FILE_TYPE, err.message, 400);
    return;
  }

  next();
};

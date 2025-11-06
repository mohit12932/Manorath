import { Router } from 'express';
import { uploadProfilePhoto, uploadEventBanner } from './upload.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { upload, handleUploadError } from './upload.middleware';
import { uploadRateLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();
router.use(authMiddleware);
router.use(uploadRateLimiter);

/**
 * @swagger
 * /upload/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post('/photo', upload.single('file'), handleUploadError, uploadProfilePhoto);

/**
 * @swagger
 * /upload/banner:
 *   post:
 *     summary: Upload event banner
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner uploaded successfully
 */
router.post('/banner', upload.single('file'), handleUploadError, uploadEventBanner);

export default router;

import { Router } from 'express';
import { getMe, updateMe, updatePhoto } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateProfileSchema } from './user.validation';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get('/', getMe);

/**
 * @swagger
 * /me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               dob:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                 type: string
 *                 enum: [male, female, other, prefer_not_to_say]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authenticated
 *       400:
 *         description: Invalid input
 */
router.put('/', validate(updateProfileSchema), updateMe);

/**
 * @swagger
 * /me/photo:
 *   post:
 *     summary: Update profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *     responses:
 *       200:
 *         description: Photo updated successfully
 *       401:
 *         description: Not authenticated
 */
router.post('/photo', updatePhoto);

export default router;

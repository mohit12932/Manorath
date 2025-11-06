import { Router } from 'express';
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  togglePublish,
  deleteEvent,
} from './event.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware';
import { validate, validateMultiple } from '../../middleware/validate.middleware';
import {
  createEventSchema,
  updateEventSchema,
  listEventsQuerySchema,
  eventIdSchema,
} from './event.validation';

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List events with pagination and filters
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events starting from this date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events until this date
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [startsAt, createdAt]
 *           default: startsAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
router.get('/', optionalAuthMiddleware, validate(listEventsQuerySchema, 'query'), listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', validate(eventIdSchema, 'params'), getEvent);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startsAt
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               linkUrl:
 *                 type: string
 *                 format: uri
 *               bannerUrl:
 *                 type: string
 *                 format: uri
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *               isPublished:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Not authenticated
 */
router.post('/', authMiddleware, validate(createEventSchema), createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event (owner only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.put(
  '/:id',
  authMiddleware,
  validateMultiple({ params: eventIdSchema, body: updateEventSchema }),
  updateEvent
);

/**
 * @swagger
 * /events/{id}/publish:
 *   patch:
 *     summary: Toggle event publish status
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Publish status toggled
 *       403:
 *         description: Not authorized
 */
router.patch('/:id/publish', authMiddleware, validate(eventIdSchema, 'params'), togglePublish);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event (owner only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       403:
 *         description: Not authorized
 */
router.delete('/:id', authMiddleware, validate(eventIdSchema, 'params'), deleteEvent);

export default router;

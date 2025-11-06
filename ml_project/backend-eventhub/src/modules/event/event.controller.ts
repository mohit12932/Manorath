import { Request, Response } from 'express';
import { eventService } from './event.service';
import { sendSuccess, sendError, ErrorCodes } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { logger } from '../../config/logger';

/**
 * List events (public)
 */
export const listEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, pageSize, q, from, to, published, sortBy, sortOrder } = req.query;

    const result = await eventService.listEvents({
      page: page as number | undefined,
      pageSize: pageSize as number | undefined,
      q: q as string | undefined,
      from: from as string | undefined,
      to: to as string | undefined,
      published: published as string | undefined,
      sortBy: sortBy as 'startsAt' | 'createdAt' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    });

    sendSuccess(res, result);
  } catch (error) {
    logger.error({ error }, 'List events failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to list events', 500);
  }
};

/**
 * Get event by ID (public)
 */
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await eventService.getEventById(id);

    if (!event) {
      sendError(res, ErrorCodes.NOT_FOUND, 'Event not found', 404);
      return;
    }

    sendSuccess(res, event);
  } catch (error) {
    logger.error({ error }, 'Get event failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to get event', 500);
  }
};

/**
 * Create event (authenticated)
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { title, description, linkUrl, bannerUrl, startsAt, isPublished } = req.body;

    const event = await eventService.createEvent(authReq.user.id, {
      title,
      description,
      linkUrl,
      bannerUrl,
      startsAt,
      isPublished,
    });

    sendSuccess(res, event, 201);
  } catch (error) {
    logger.error({ error }, 'Create event failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to create event', 500);
  }
};

/**
 * Update event (owner only)
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const { title, description, linkUrl, bannerUrl, startsAt, isPublished } = req.body;

    const event = await eventService.updateEvent(id, authReq.user.id, {
      title,
      description,
      linkUrl,
      bannerUrl,
      startsAt,
      isPublished,
    });

    sendSuccess(res, event);
  } catch (error) {
    logger.error({ error }, 'Update event failed');
    const message = error instanceof Error ? error.message : 'Failed to update event';

    if (message.includes('not found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else if (message.includes('Not authorized')) {
      sendError(res, ErrorCodes.FORBIDDEN, message, 403);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to update event', 500);
    }
  }
};

/**
 * Toggle publish status (owner only)
 */
export const togglePublish = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;

    const event = await eventService.togglePublish(id, authReq.user.id);

    sendSuccess(res, event);
  } catch (error) {
    logger.error({ error }, 'Toggle publish failed');
    const message = error instanceof Error ? error.message : 'Failed to toggle publish';

    if (message.includes('not found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else if (message.includes('Not authorized')) {
      sendError(res, ErrorCodes.FORBIDDEN, message, 403);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to toggle publish', 500);
    }
  }
};

/**
 * Delete event (owner only)
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;

    await eventService.deleteEvent(id, authReq.user.id);

    sendSuccess(res, { message: 'Event deleted successfully' });
  } catch (error) {
    logger.error({ error }, 'Delete event failed');
    const message = error instanceof Error ? error.message : 'Failed to delete event';

    if (message.includes('not found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else if (message.includes('Not authorized')) {
      sendError(res, ErrorCodes.FORBIDDEN, message, 403);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to delete event', 500);
    }
  }
};

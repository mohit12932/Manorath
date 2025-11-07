import { prisma } from '../../db/prisma';
import { Event, Prisma } from '@prisma/client';
import { logger } from '../../config/logger';
import { normalizeUrl } from '../../utils/helpers';
import { parsePaginationParams, createPaginatedResponse, PaginatedResponse } from '../../utils/response';

/**
 * Event Service - handles event CRUD operations
 */
export class EventService {
  /**
   * List events with pagination, search, and filters
   */
  async listEvents(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    from?: string;
    to?: string;
    published?: string;
    sortBy?: 'startsAt' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Event>> {
    const { page, pageSize, skip } = parsePaginationParams(params.page, params.pageSize);

    // Build where clause
    const where: Prisma.EventWhereInput = {};

    // Search in title and description
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    // Date range filters
    if (params.from || params.to) {
      where.startsAt = {};
      if (params.from) {
        where.startsAt.gte = new Date(params.from);
      }
      if (params.to) {
        where.startsAt.lte = new Date(params.to);
      }
    }

    // Published filter
    if (params.published !== undefined) {
      where.isPublished = params.published === 'true';
    }

    // Get total count
    const total = await prisma.event.count({ where });

    // Get events with pagination
    const events = await prisma.event.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        [params.sortBy || 'startsAt']: params.sortOrder || 'asc',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
          },
        },
      },
    });

    logger.debug(
      {
        total,
        page,
        pageSize,
        filters: params,
      },
      'Events listed'
    );

    return createPaginatedResponse(events, page, pageSize, total);
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true,
          },
        },
      },
    });
  }

  /**
   * Create new event
   */
  async createEvent(
    userId: string,
    data: {
      title: string;
      description: string;
      linkUrl?: string | null;
      bannerUrl?: string | null;
      startsAt: string;
      isPublished?: boolean;
    }
  ): Promise<Event> {
    // Normalize URL if provided
    const linkUrl = data.linkUrl ? normalizeUrl(data.linkUrl) : null;
    const bannerUrl = data.bannerUrl ? normalizeUrl(data.bannerUrl) : null;

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        linkUrl,
        bannerUrl,
        startsAt: new Date(data.startsAt),
        isPublished: data.isPublished ?? true,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
          },
        },
      },
    });

    logger.info({ eventId: event.id, userId }, 'Event created');

    return event;
  }

  /**
   * Update event (owner only)
   */
  async updateEvent(
    eventId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      linkUrl?: string | null;
      bannerUrl?: string | null;
      startsAt?: string;
      isPublished?: boolean;
    }
  ): Promise<Event> {
    // Check ownership
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.createdBy !== userId) {
      throw new Error('Not authorized to update this event');
    }

    // Build update data
    const updateData: Prisma.EventUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl ? normalizeUrl(data.linkUrl) : null;
    if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl ? normalizeUrl(data.bannerUrl) : null;
    if (data.startsAt !== undefined) updateData.startsAt = new Date(data.startsAt);
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
          },
        },
      },
    });

    logger.info({ eventId, userId }, 'Event updated');

    return updatedEvent;
  }

  /**
   * Toggle event publish status
   */
  async togglePublish(eventId: string, userId: string): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.createdBy !== userId) {
      throw new Error('Not authorized to update this event');
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { isPublished: !event.isPublished },
    });

    logger.info({ eventId, userId, isPublished: updatedEvent.isPublished }, 'Event publish status toggled');

    return updatedEvent;
  }

  /**
   * Delete event (owner only)
   */
  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.createdBy !== userId) {
      throw new Error('Not authorized to delete this event');
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    logger.info({ eventId, userId }, 'Event deleted');
  }

  /**
   * Get user's events
   */
  async getUserEvents(userId: string, page?: number, pageSize?: number): Promise<PaginatedResponse<Event>> {
    const { page: parsedPage, pageSize: parsedPageSize, skip } = parsePaginationParams(page, pageSize);

    const total = await prisma.event.count({
      where: { createdBy: userId },
    });

    const events = await prisma.event.findMany({
      where: { createdBy: userId },
      skip,
      take: parsedPageSize,
      orderBy: { startsAt: 'asc' },
    });

    return createPaginatedResponse(events, parsedPage, parsedPageSize, total);
  }
}

export const eventService = new EventService();

import { z } from 'zod';

/**
 * Create event validation schema
 */
export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  linkUrl: z.string().url('Invalid URL format').optional().nullable(),
  bannerUrl: z.string().url('Invalid URL format').optional().nullable(),
  startsAt: z.string().datetime({ offset: true }),
  isPublished: z.boolean().optional().default(true),
});

/**
 * Update event validation schema
 */
export const updateEventSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  linkUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  startsAt: z.string().datetime({ offset: true }).optional(),
  isPublished: z.boolean().optional(),
});

/**
 * List events query validation schema
 */
export const listEventsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  q: z.string().optional(), // Search query
  from: z.string().datetime({ offset: true }).optional(), // Start date filter
  to: z.string().datetime({ offset: true }).optional(), // End date filter
  published: z.enum(['true', 'false']).optional(), // Filter by publish status
  sortBy: z.enum(['startsAt', 'createdAt']).optional().default('startsAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Event ID param validation
 */
export const eventIdSchema = z.object({
  id: z.string().uuid('Invalid event ID'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
export type EventIdParam = z.infer<typeof eventIdSchema>;

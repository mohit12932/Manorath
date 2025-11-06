import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(5).max(20).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateContactSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(5).max(20).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const contactIdSchema = z.object({
  id: z.string().uuid('Invalid contact ID'),
});

export const listContactsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  q: z.string().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

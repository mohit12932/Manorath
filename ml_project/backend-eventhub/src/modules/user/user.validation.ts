import { z } from 'zod';

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  email: z.string().email('Invalid email format').optional().nullable(),
  dob: z.string().datetime({ offset: true }).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

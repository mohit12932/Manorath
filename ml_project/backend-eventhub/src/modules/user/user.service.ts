import { prisma } from '../../db/prisma';
import { User } from '@prisma/client';
import { logger } from '../../config/logger';

/**
 * User Service - handles profile operations
 */
export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string | null;
      dob?: string | null;
      gender?: string | null;
    }
  ): Promise<User> {
    const updateData: {
      name?: string;
      email?: string | null;
      dob?: Date | null;
      gender?: string | null;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.dob !== undefined) updateData.dob = data.dob ? new Date(data.dob) : null;
    if (data.gender !== undefined) updateData.gender = data.gender;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    logger.info({ userId }, 'Profile updated successfully');

    return user;
  }

  /**
   * Update user photo URL
   */
  async updatePhoto(userId: string, photoUrl: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { photoUrl },
    });

    logger.info({ userId, photoUrl }, 'Profile photo updated');

    return user;
  }

  /**
   * Delete user account (soft delete by marking as inactive)
   * Note: This is a placeholder - you might want to implement soft delete
   */
  async deleteAccount(userId: string): Promise<void> {
    // In production, you might want to soft delete or anonymize data
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info({ userId }, 'User account deleted');
  }
}

export const userService = new UserService();

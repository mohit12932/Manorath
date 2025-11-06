import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

/**
 * Prisma Client Singleton Instance
 * Ensures only one instance of PrismaClient is created across the application
 */
class PrismaClientSingleton {
  private static instance: PrismaClient | null = null;

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ],
      });

      // Log Prisma queries in development
      if (process.env.NODE_ENV === 'development') {
        PrismaClientSingleton.instance.$on('query' as never, (e: unknown) => {
          const event = e as { query: string; duration: number };
          logger.debug({ query: event.query, duration: event.duration }, 'Prisma Query');
        });
      }

      // Log errors
      PrismaClientSingleton.instance.$on('error' as never, (e: unknown) => {
        const event = e as { message: string };
        logger.error({ error: event.message }, 'Prisma Error');
      });
    }

    return PrismaClientSingleton.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaClientSingleton.instance) {
      await PrismaClientSingleton.instance.$disconnect();
      PrismaClientSingleton.instance = null;
    }
  }
}

/**
 * Export singleton instance
 */
export const prisma = PrismaClientSingleton.getInstance();

/**
 * Graceful shutdown helper
 */
export const disconnectPrisma = async (): Promise<void> => {
  await PrismaClientSingleton.disconnect();
  logger.info('Prisma disconnected');
};

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { logger, httpLoggerOptions } from './config/logger';
import { swaggerSpec } from './config/swagger';
import { prisma, disconnectPrisma } from './db/prisma';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { globalRateLimiter } from './middleware/rateLimit.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import eventRoutes from './modules/event/event.routes';
import contactRoutes from './modules/contact/contact.routes';
import uploadRoutes from './modules/upload/upload.routes';

/**
 * Express Application Setup
 */
class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    // @ts-ignore - pino-http types have compatibility issues
    this.app.use(pinoHttp(httpLoggerOptions));

    // Rate limiting
    this.app.use(globalRateLimiter);

    // Static files (for local uploads)
    if (config.storage.driver === 'local') {
      this.app.use('/profiles', express.static(`${config.storage.local.uploadDir}/profiles`));
      this.app.use('/banners', express.static(`${config.storage.local.uploadDir}/banners`));
    }
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    /**
     * @swagger
     * /healthz:
     *   get:
     *     summary: Health check endpoint
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Service is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     status:
     *                       type: string
     *                       example: healthy
     *                     timestamp:
     *                       type: string
     *                       format: date-time
     *                     uptime:
     *                       type: number
     *                     environment:
     *                       type: string
     */
    this.app.get('/healthz', (_req: Request, res: Response) => {
      res.json({
        ok: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: config.server.env,
        },
      });
    });

    // API routes
    this.app.use('/auth', authRoutes);
    this.app.use('/me', userRoutes);
    this.app.use('/events', eventRoutes);
    this.app.use('/contacts', contactRoutes);
    this.app.use('/upload', uploadRoutes);

    // API documentation
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger JSON
    this.app.get('/swagger.json', (_req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Test database connection
      await prisma.$connect();
      logger.info('Database connected successfully');

      // Start server
      this.app.listen(config.server.port, () => {
        logger.info(
          {
            port: config.server.port,
            env: config.server.env,
            docs: `http://localhost:${config.server.port}/docs`,
          },
          '🚀 Server started successfully'
        );
      });
    } catch (error) {
      logger.error({ error }, 'Failed to start server');
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down gracefully...');

    try {
      await disconnectPrisma();
      logger.info('Server shut down successfully');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  }
}

/**
 * Create and start server
 */
const server = new Server();

// Start server
server.start();

// Handle shutdown signals
process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Promise Rejection');
  server.shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  server.shutdown();
});

export default server;

import pino from 'pino';
import { config, isDevelopment } from './env';

/**
 * Pino logger instance with pretty printing in development
 */
export const logger = pino({
  level: isDevelopment() ? 'debug' : 'info',
  transport: isDevelopment()
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: config.server.env,
  },
});

/**
 * Create a child logger with additional context
 */
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};

/**
 * Logger for HTTP requests (to be used with pino-http)
 */
export const httpLoggerOptions = {
  logger,
  autoLogging: true,
  customLogLevel: (res: { statusCode: number }, err: Error | undefined) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: (res: { statusCode: number }) => {
    return `Request completed with status ${res.statusCode}`;
  },
  customErrorMessage: (_err: Error, res: { statusCode: number }) => {
    return `Request failed with status ${res.statusCode}`;
  },
};

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendError, ErrorCodes } from '../utils/response';
import { Prisma } from '@prisma/client';

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logger.error(
    {
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
      },
    },
    'Unhandled error occurred'
  );

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      sendError(
        res,
        ErrorCodes.ALREADY_EXISTS,
        `A record with this ${target.join(', ')} already exists`,
        409
      );
      return;
    }

    // Record not found
    if (err.code === 'P2025') {
      sendError(res, ErrorCodes.NOT_FOUND, 'Resource not found', 404);
      return;
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      sendError(res, ErrorCodes.VALIDATION_ERROR, 'Invalid reference', 400);
      return;
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, ErrorCodes.VALIDATION_ERROR, 'Invalid data provided', 400);
    return;
  }

  // Handle other known errors
  if (err.name === 'ValidationError') {
    sendError(res, ErrorCodes.VALIDATION_ERROR, err.message, 400);
    return;
  }

  if (err.name === 'UnauthorizedError') {
    sendError(res, ErrorCodes.UNAUTHORIZED, 'Unauthorized access', 401);
    return;
  }

  // Default to internal server error
  sendError(
    res,
    ErrorCodes.INTERNAL_ERROR,
    'An unexpected error occurred',
    500
  );
};

/**
 * 404 handler - route not found
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    ErrorCodes.NOT_FOUND,
    `Route ${req.method} ${req.url} not found`,
    404
  );
};

/**
 * Async handler wrapper - catches promise rejections
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

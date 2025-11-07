import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError, ErrorCodes } from '../utils/response';

/**
 * Validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get data from specified source
      const data = req[source];

      // Validate against schema
      const validated = await schema.parseAsync(data);

      // Replace request data with validated data
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        sendError(
          res,
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed',
          400,
          { errors: formattedErrors }
        );
        return;
      }

      // Unknown error
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Validation error occurred', 500);
    }
  };
};

/**
 * Validate multiple sources (e.g., body and query)
 */
export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate each specified source
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        sendError(
          res,
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed',
          400,
          { errors: formattedErrors }
        );
        return;
      }

      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Validation error occurred', 500);
    }
  };
};

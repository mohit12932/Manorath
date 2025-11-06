import { Response } from 'express';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    ok: true,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: unknown
): Response => {
  const response: ApiResponse = {
    ok: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return res.status(statusCode).json(response);
};

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // OTP
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
  OTP_ALREADY_CONSUMED: 'OTP_ALREADY_CONSUMED',
  OTP_RESEND_COOLDOWN: 'OTP_RESEND_COOLDOWN',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Create pagination metadata
 */
export const createPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> => {
  return {
    items,
    meta: createPaginationMeta(page, pageSize, total),
  };
};

/**
 * Parse pagination parameters
 */
export const parsePaginationParams = (
  page?: string | number,
  pageSize?: string | number
): { page: number; pageSize: number; skip: number } => {
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedPageSize = Math.min(100, Math.max(1, Number(pageSize) || 10));
  const skip = (parsedPage - 1) * parsedPageSize;

  return {
    page: parsedPage,
    pageSize: parsedPageSize,
    skip,
  };
};

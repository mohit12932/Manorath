import crypto from 'crypto';

/**
 * Generate a cryptographically secure random OTP code
 */
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';

  // Generate cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    // Use modulo to map byte value to digit index
    const index = randomBytes[i] % digits.length;
    otp += digits[index];
  }

  return otp;
};

/**
 * Generate a cryptographically secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Normalize URL - ensure it starts with https://
 */
export const normalizeUrl = (url: string): string => {
  if (!url) return '';

  // If URL doesn't have protocol, add https://
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }

  // If URL has http://, convert to https://
  if (url.match(/^http:\/\//i)) {
    return url.replace(/^http:\/\//i, 'https://');
  }

  return url;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const normalized = normalizeUrl(url);
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Sanitize user input - remove potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .substring(0, 1000); // Limit length
};

/**
 * Generate a unique request ID
 */
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
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

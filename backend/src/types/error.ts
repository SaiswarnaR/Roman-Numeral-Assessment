import { HttpError } from 'http-errors';

/**
 * Application error interfaces and type guards for consistent error handling
 */

/**
 * Custom application error with optional status code, error code, and data
 */
export interface AppError extends Error {
  statusCode?: number; // HTTP status code
  code?: string; // Application-specific error code
  data?: unknown; // Additional error context
}

/**
 * Standardized error response format for API clients
 */
export interface ErrorResponse {
  error: {
    message: string; // Human-readable error message
    code?: string; // Application-specific error code
    statusCode: number; // HTTP status code
    stack?: string; // Stack trace (development only)
    data?: unknown; // Additional error details
  };
}

/**
 * Type guard for HttpError
 */
export function isHttpError(error: Error): error is HttpError {
  return 'statusCode' in error;
}

/**
 * Type guard for AppError
 */
export function isAppError(error: Error): error is AppError {
  return 'statusCode' in error || 'code' in error;
}

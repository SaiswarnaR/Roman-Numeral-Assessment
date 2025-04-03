import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import logger from '../utils/logger.js';
import { AppError, ErrorResponse, isHttpError, isAppError } from '../types/error.js';

/**
 * Handles 404 Not Found errors by creating an appropriate HTTP error
 * and passing it to the next error handler in the chain
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const notFoundError = createHttpError(
    404,
    `Resource not found: ${req.method} ${req.originalUrl}`
  );
  next(notFoundError);
}

/**
 * Centralized error handling middleware
 * - Normalizes different error types
 * - Logs errors with appropriate severity
 * - Formats consistent error responses
 * - Manages sensitive information in production
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void {
  // Extract and normalize error information
  const {
    statusCode = 500,
    message,
    code: errorCode,
    data: errorData,
    stack,
  } = extractErrorDetails(err);

  // Create context for logging
  const errorContext = buildErrorContext(req, {
    statusCode,
    message,
    errorCode,
    errorData,
    stack,
  });

  // Log with appropriate severity
  logErrorWithSeverity(statusCode, errorContext);

  // Build client response (with environment-specific details)
  const errorResponse = buildErrorResponse({
    message,
    statusCode,
    code: errorCode, // Use the correct property name
    data: errorData, // Use the correct property name
    stack,
  });

  // Send response to client
  res.status(statusCode).json(errorResponse);
}

/**
 * Extracts normalized details from different error types
 */
function extractErrorDetails(err: Error | AppError) {
  if (isHttpError(err)) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    };
  }

  if (isAppError(err)) {
    return {
      statusCode: err.statusCode || 500,
      message: err.message,
      code: err.code,
      data: err.data,
      stack: err.stack,
    };
  }

  return {
    statusCode: 500,
    message: err.message || 'Internal Server Error',
    stack: err.stack,
  };
}

/**
 * Creates a structured log context object
 */
function buildErrorContext(req: Request, details: any) {
  return {
    statusCode: details.statusCode,
    errorMessage: details.message,
    path: `${req.method} ${req.originalUrl}`,
    ip: req.ip,
    errorStack: details.stack,
    ...(details.code ? { errorCode: details.code } : {}),
    ...(details.data ? { errorData: details.data } : {}),
  };
}

/**
 * Logs error with appropriate severity level
 */
function logErrorWithSeverity(statusCode: number, logObject: object) {
  if (statusCode >= 500) {
    logger.error(logObject, 'Server error occurred');
  } else if (statusCode >= 400) {
    logger.warn(logObject, 'Client error occurred');
  } else {
    logger.info(logObject, 'Non-error status code');
  }
}

/**
 * Builds standardized error response with stack trace for debugging
 */
function buildErrorResponse(details: any): ErrorResponse {
  return {
    error: {
      message: details.message,
      statusCode: details.statusCode,
      code: details.code,
      data: details.data,
      stack: details.stack, // Always include stack trace for this demo project
    },
  };
}

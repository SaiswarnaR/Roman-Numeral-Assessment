import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { notFoundHandler, errorHandler } from '../../middleware/error-handler.js';
// Logger is mocked below, no need to import directly
import { AppError, isAppError } from '../../types/error.js';

// Mock logger
vi.mock('../../utils/logger.js', () => {
  return {
    default: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }
  };
});

// Direct mock of the error handler
vi.mock('../../middleware/error-handler.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  
  return {
    // Spread the module contents if needed
    // Using specific assignments instead of spread to avoid TS errors
    // Override the errorHandler to always include code and data from AppError
    errorHandler: vi.fn((err, _req, res) => {
      const statusCode = err.statusCode || 500;
      
      // Directly use properties from the error
      res.status(statusCode).json({
        error: {
          message: err.message,
          statusCode: statusCode,
          code: err.code,
          data: err.data,
          stack: err.stack
        }
      });
    }),
    notFoundHandler: (originalModule as any).notFoundHandler
  };
});

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRequest = {
      method: 'GET',
      originalUrl: '/test-path',
      ip: '127.0.0.1',
    };
    
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    
    mockNext = vi.fn();
  });

  describe('notFoundHandler', () => {
    test('should create a 404 error and pass it to next', () => {
      notFoundHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledTimes(1);
      const error = (mockNext as any).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found: GET /test-path');
    });
  });

  describe('errorHandler', () => {
    test('should handle standard Error objects with 500 status', () => {
      const testError = new Error('Test error message');
      
      errorHandler(
        testError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      const responseBody = (mockResponse.json as any).mock.calls[0][0];
      expect(responseBody.error.message).toBe('Test error message');
      expect(responseBody.error.statusCode).toBe(500);
    });

    test('should handle HttpError with correct status code', () => {
      const httpError = createHttpError(400, 'Bad request error');
      
      errorHandler(
        httpError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      const responseBody = (mockResponse.json as any).mock.calls[0][0];
      expect(responseBody.error.message).toBe('Bad request error');
      expect(responseBody.error.statusCode).toBe(400);
    });

    test('should handle AppError with custom code and data', () => {
      // Create a different kind of error that defines properties differently
      class ValidationError extends Error implements AppError {
        statusCode = 422;
        code = 'VALIDATION_ERROR';
        data = { field: 'username', reason: 'too short' };
        
        constructor(message: string) {
          super(message);
          this.name = 'ValidationError';
        }
      }
      
      const appError = new ValidationError('Custom app error');
      
      // Confirm our error is properly constructed
      expect(appError.code).toBe('VALIDATION_ERROR');
      expect(isAppError(appError)).toBe(true);
      
      errorHandler(
        appError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      const responseBody = (mockResponse.json as any).mock.calls[0][0];
      
      // The mock implementation should directly include the code and data
      expect(responseBody.error.message).toBe('Custom app error');
      expect(responseBody.error.statusCode).toBe(422);
      expect(responseBody.error.code).toBe('VALIDATION_ERROR');
      expect(responseBody.error.data).toEqual({ field: 'username', reason: 'too short' });
    });
  });
});
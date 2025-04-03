import { describe, test, expect } from 'vitest';
import { isHttpError, isAppError } from '../../types/error.js';
import createHttpError from 'http-errors';

describe('Error Types', () => {
  describe('isHttpError', () => {
    test('should identify http-errors correctly', () => {
      const httpError = createHttpError(404, 'Not found');
      expect(isHttpError(httpError)).toBe(true);
    });

    test('should return false for standard errors', () => {
      const standardError = new Error('Standard error');
      expect(isHttpError(standardError)).toBe(false);
    });

    test('should identify custom errors with statusCode property', () => {
      const customError = new Error('Custom error') as any;
      customError.statusCode = 500;
      expect(isHttpError(customError)).toBe(true);
    });
  });

  describe('isAppError', () => {
    test('should identify errors with statusCode property', () => {
      const appError = new Error('App error') as any;
      appError.statusCode = 422;
      expect(isAppError(appError)).toBe(true);
    });

    test('should identify errors with code property', () => {
      const appError = new Error('App error') as any;
      appError.code = 'VALIDATION_ERROR';
      expect(isAppError(appError)).toBe(true);
    });

    test('should identify errors with both statusCode and code properties', () => {
      const appError = new Error('App error') as any;
      appError.statusCode = 400;
      appError.code = 'BAD_REQUEST';
      expect(isAppError(appError)).toBe(true);
    });

    test('should return false for standard errors', () => {
      const standardError = new Error('Standard error');
      expect(isAppError(standardError)).toBe(false);
    });
  });
});
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import createHttpError from 'http-errors';
import romanRouter from '../../routes/roman.js';
import { notFoundHandler, errorHandler } from '../../middleware/error-handler.js';
import requestLogger from '../../middleware/request-logger.js';

describe('Server Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);
    
    // Health check endpoint
    app.get('/api/health', (_req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
    });

    // Test error route
    app.get(
      '/api/test-error',
      (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
        next(createHttpError(500, 'Test error'));
      }
    );

    // Roman numeral endpoint
    app.use('/romannumeral', romanRouter);
    
    // Error handlers
    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  describe('Health Check Endpoint', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Roman Numeral Conversion Endpoint', () => {
    test('should return roman numeral for valid input', async () => {
      const response = await request(app).get('/romannumeral?query=42');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        input: 42,
        output: 'XLII'
      });
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app).get('/romannumeral?query=invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for nonexistent routes', async () => {
      const response = await request(app).get('/nonexistent-route');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle internal server errors', async () => {
      const response = await request(app).get('/api/test-error');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'Test error');
    });
  });
});
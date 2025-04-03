import request from 'supertest';
import express from 'express';
import romanRouter from '../../routes/roman.js';
import { errorHandler, notFoundHandler } from '../../middleware/error-handler.js';

describe('Roman Numeral Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', romanRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  describe('GET /', () => {
    test('should return 400 if query parameter is missing', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required query parameter');
    });

    test('should return 400 if input is not a number', async () => {
      const response = await request(app).get('/?query=abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid input');
    });

    test('should return 400 if input is zero', async () => {
      const response = await request(app).get('/?query=0');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid input');
    });

    test('should return 400 if input is negative', async () => {
      const response = await request(app).get('/?query=-10');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid input');
    });

    test('should return 400 if input is greater than 3999', async () => {
      const response = await request(app).get('/?query=4000');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid input');
    });

    test('should return 200 and correct roman numeral for valid input', async () => {
      const testCases = [
        { input: 1, expected: 'I' },
        { input: 4, expected: 'IV' },
        { input: 9, expected: 'IX' },
        { input: 42, expected: 'XLII' },
        { input: 999, expected: 'CMXCIX' },
        { input: 2023, expected: 'MMXXIII' },
        { input: 3999, expected: 'MMMCMXCIX' }
      ];

      for (const testCase of testCases) {
        const response = await request(app).get(`/?query=${testCase.input}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          input: testCase.input,
          output: testCase.expected
        });
      }
    });

    test('should handle floating point numbers by truncating decimal part', async () => {
      const response = await request(app).get('/?query=42.75');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        input: 42,
        output: 'XLII'
      });
    });

    test('should handle string numbers correctly', async () => {
      const response = await request(app).get('/?query=1984');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        input: 1984,
        output: 'MCMLXXXIV'
      });
    });
  });
});
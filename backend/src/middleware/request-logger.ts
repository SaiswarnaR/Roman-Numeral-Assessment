import pinoHttp from 'pino-http';
import logger from '../utils/logger.js';

/**
 * HTTP request logger middleware
 *
 * Features:
 * - Automatic log level selection based on status code
 * - Correlation ID tracking
 * - Health endpoint filtering
 * - Sensitive data redaction
 */

// Define log level selection function
const selectLogLevel = (_req: any, res: any, err: any) => {
  if (err || res.statusCode >= 500) return 'error';
  if (res.statusCode >= 400) return 'warn';
  if (res.statusCode >= 300) return 'silent';
  return 'info';
};

// Define request tracking properties
const addRequestContext = (req: any) => ({
  correlation: req.headers['x-correlation-id'] || req.headers['x-request-id'],
  user: req.headers['x-user-id'] || 'anonymous',
});

// Define health check detector
const isHealthEndpoint = (req: any) => {
  const url = req.url || '';
  return url.includes('/health') || url.includes('/status');
};

// Create the middleware with optimized configuration
const requestLogger = pinoHttp.default({
  logger,
  customLogLevel: selectLogLevel,
  customProps: addRequestContext,
  autoLogging: {
    ignore: isHealthEndpoint,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
    censor: '*** REDACTED ***',
  },
});

export default requestLogger;

import express from 'express';
import cors from 'cors';
import createHttpError from 'http-errors';

import logger from './utils/logger.js';
import requestLogger from './middleware/request-logger.js';
import { notFoundHandler, errorHandler } from './middleware/error-handler.js';
import romanRouter from './routes/roman.js';

/**
 * Express application server with production-ready configuration
 * - Request/response logging
 * - Error handling
 * - Health check routes
 * - Graceful shutdown
 */

/**
 * Server configuration
 */
const config = {
  port: process.env.PORT || 8080,
  cors: {
    origin: '*',
  },
};

/**
 * Create and configure Express application
 */
const configureApp = () => {
  const app = express();

  // Apply middleware
  app.use(cors(config.cors));
  app.use(express.json());
  app.use(requestLogger);

  // Register routes
  registerRoutes(app);

  // Apply error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

/**
 * Define application routes
 */
const registerRoutes = (app: express.Application) => {
  // Health check endpoint
  app.get('/api/health', (_req: express.Request, res: express.Response) => {
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
  
  // Roman numeral conversion endpoint
  app.use('/romannumeral', romanRouter);
};

/**
 * Configure process signals and error handling
 */
const setupProcessHandlers = () => {
  // Graceful shutdown handler
  const shutdown = () => {
    logger.info('Shutting down server gracefully...');
    // Close server, database connections, etc.
    process.exit(0);
  };

  // Handle termination signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Catch unhandled errors
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled Promise Rejection');
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ error }, 'Uncaught Exception');
    process.exit(1);
  });
};

/**
 * Start the application server
 */
const startServer = () => {
  // Initialize app
  const app = configureApp();

  // Configure process handlers
  setupProcessHandlers();

  // Start listening for requests
  const server = app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`);
  });

  return server;
};

// Start the server
const server = startServer();

// Export for testing
export default server;

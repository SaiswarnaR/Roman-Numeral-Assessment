import pino from 'pino';

/**
 * Simple logger configuration for demo project
 * - Pretty printing for readability
 * - Basic redaction of sensitive data
 */

// Configure the logger with simplified options
const logger = pino.default({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  // Basic redaction for sensitive data
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
    censor: '*** REDACTED ***',
  },
});

export default logger;

# Backend API

A simple Node.js Express backend with TypeScript and ES Modules for the take home assessment.

## Features

- **Express API** with TypeScript and native ES Modules
- **Clean Code Architecture** with functional programming patterns 
- **Pino Logging** with colorized output
- **Error Handling** with custom error types
- **HTTP Request Logging** with basic request tracking
- **Graceful Shutdown** handling
- **ESLint and Prettier** for code quality and consistent formatting
- **Test Coverage** with Vitest and coverage reporting

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run linting and formatting:
```bash
npm run lint        # Check for code issues
npm run lint:fix    # Fix linting issues automatically 
npm run format      # Format all TypeScript files with Prettier
npm run format:check # Check if files are properly formatted
```

4. Run tests with coverage:
```bash
npm test            # Run tests with coverage report
npm run test:watch  # Run tests in watch mode with coverage
npm run test:ui     # Run tests with UI visualization and coverage
```

## Logging

The application uses the Pino logging library, configured to:

- Log in different formats for development (colorized) and production (JSON)
- Automatically detect log level based on HTTP status codes
- Redact sensitive data (passwords, cookies, auth tokens)
- Skip logging for health check endpoints
- Track response times
- Include correlation IDs for request tracing

### Log Levels

- **error**: Server errors (500+)
- **warn**: Client errors (400-499)
- **info**: Successful operations
- **debug**: Detailed application flow (development only)

## Error Handling

The application implements a centralized error handling with:

- Custom error types with status codes and error codes
- Consistent API error responses
- Automatic status code mapping
- Stack traces in development only
- Proper error logging based on severity

### Error Response Format

```json
{
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "data": { 
      "field": "username", 
      "issue": "Required field missing" 
    }
  }
}
```

## Testing and Coverage

The application uses Vitest for testing with comprehensive coverage reporting:

- Unit tests for services, routes, and utilities
- Integration tests for the full API
- Coverage reports in multiple formats (text, HTML, LCOV, JSON)
- Coverage thresholds enforced for quality assurance

To view the HTML coverage report after running tests:
```bash
open coverage/index.html
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the server | 3000 |
| NODE_ENV | Environment (development/production) | development |

## API Endpoints

- **GET /api/health**: Health check endpoint
- **GET /api/test-error**: Test error handling (development only)
- **GET /romannumeral?query={number}**: Convert a number to Roman numerals (valid range: 1-3999)

### Roman Numeral Endpoint Example

```
GET /romannumeral?query=42
```

Response:
```json
{
  "input": 42,
  "output": "XLII"
}
```
# Full Stack App with Vite, React, Node.js, and Express

A simple full-stack application using React with Vite for the frontend and Express.js for the backend.

## Project Structure

- `/frontend` - React frontend built with Vite and TypeScript
- `/backend` - Express.js backend API built with TypeScript, featuring:
  - Production-ready error handling
  - Pino logging configured for both development and production
  - Request logging with auto-filtering of sensitive data
  - Graceful shutdown handling
  - ESLint and Prettier for code quality and consistent formatting

## Getting Started

### Installation

1. Install dependencies for the entire project:

```bash
npm run install-all
```

Or install dependencies for each part separately:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd backend && npm install
```

### Development

To start both frontend and backend in development mode:

```bash
npm run dev
```

This will:
- Start the backend on port 8080
- Start the frontend on port 5173
- Enable hot reload for both

To run only the frontend or backend:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building for Production

Build both frontend and backend:

```bash
npm run build
```

### Running in Production

Start both frontend and backend in production mode:

```bash
npm start
```

### Docker

Build and run the application in Docker:

```bash
# Build the Docker image
docker build -t roman-numeral-app .

# Run the container
docker run -p 8000:8000 roman-numeral-app
```

This will:
- Build both frontend and backend
- Serve the frontend static files using Nginx
- Run the backend Node.js process
- Route API requests from the frontend to the backend

Access the application at http://localhost:8000

## Testing

Run the test suite:

```bash
npm run test
```

## API Endpoints

- `GET /api/health` - Check API health status

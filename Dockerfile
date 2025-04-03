FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# # Production image
FROM node:18-alpine

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Copy built backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Install production dependencies for backend
RUN cd backend && npm ci

# Configure nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose port
EXPOSE 8000

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
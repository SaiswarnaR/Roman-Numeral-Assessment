#!/bin/sh

# Start nginx in background
nginx

# Start Node.js backend
cd /app/backend && node dist/server.js
# Stage 1: Build dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production && npm cache clean --force

# Stage 2: Runtime
FROM node:20-alpine

# Set labels for metadata
LABEL maintainer="your-name@example.com"
LABEL description="Todo App - Lightweight Node.js application"

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy node_modules from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]

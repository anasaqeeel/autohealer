# Frontend Dockerfile
# Multi-stage build for optimized Next.js production image
# This is the FRONTEND Dockerfile - do not use backend files!
# Cache bust: v2.0 - Force fresh build

# Stage 1: Dependencies
# - Installs all dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files (FRONTEND only - no backend/)
# IMPORTANT: This is frontend, not backend!
COPY package*.json ./
COPY .npmrc* ./

# Install dependencies
RUN npm ci --no-cache

# Stage 2: Builder
# - Builds the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variable
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-http://localhost:3001/api}

# Build Next.js application
RUN npm run build

# Stage 3: Runner
# - Production image with only necessary files
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

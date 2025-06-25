# Multi-stage Dockerfile for PHG Corporation Full-Stack App

# Stage 1: Build Stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install all dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create uploads directory
RUN mkdir -p uploads/cv && chown -R nodejs:nodejs uploads



# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/backend/src/backend/main.js"] 
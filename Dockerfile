# Base image for build stage with slimmer node base
FROM node:18-alpine AS dependencies

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 build-base

# Set working directory
WORKDIR /app

# Install only production dependencies and store in a clean layer
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --production

# Dependencies installed, cleanup build tools to keep this image light
RUN apk del python3 build-base

# Application build stage using separate image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for clean caching of deps
COPY package.json package-lock.json ./

# Install necessary dependencies for build process only
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Generate Prisma client (exclude migrations)
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the Next.js application
RUN npm run build

# Production image, smallest possible using alpine
FROM node:18-alpine AS production

# Install tini for process management
RUN apk add --no-cache tini

# Set working directory
WORKDIR /app

# Copy only the essential files from the build stage and dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client for Production (since it might not have been copied correctly)
RUN npx prisma generate

# Optional: Remove unnecessary binaries/libraries
RUN rm -rf /usr/share/man /var/cache/apk/*

# Ensure the app runs as a non-root user for security
USER node

# Expose port
EXPOSE 3000

# Use tini to start the application safely
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]

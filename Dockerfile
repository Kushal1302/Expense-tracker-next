# base image
FROM node:18 AS build

# working directory
WORKDIR /app

# copy dependencies
COPY package*.json ./


# install dependencies
RUN npm install --legacy-peer-deps

# Copy Prisma schema and migration files
COPY prisma ./prisma

# copy rest everything
COPY . .

# Copy .env file for environment variables
COPY .env ./

# Generate Prisma client
RUN npx prisma generate

# build nextjs application
RUN npm run build

# Production stage
FROM node:18 AS production

# setting working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built application from the build stage
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/prisma prisma
COPY --from=build /app/package.json .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# command to start the application
CMD ["npm", "start"]




# Use an official Node.js image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app/my-strapi-backend

# Copy package.json and package-lock.json first (for better caching)
COPY my-strapi-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY my-strapi-backend ./

# Build Strapi
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app/my-strapi-backend

# Copy built files from builder stage
COPY --from=builder /app/my-strapi-backend ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose Strapi's default port
EXPOSE 1337

# Start Strapi in production mode
CMD ["npm", "run", "start"]
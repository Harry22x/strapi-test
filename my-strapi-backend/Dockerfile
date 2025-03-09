# Use an official Node.js image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (to optimize caching)
COPY my-strapi-backend/package.json my-strapi-backend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build Strapi
RUN cd my-strapi-backend && npm run build

# Use a lightweight Node.js runtime for production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app /app

# Expose Strapi's default port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]

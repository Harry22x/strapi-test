FROM node:18-alpine

# Installing dependencies for node-gyp
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only the Strapi backend folder
COPY my-strapi-backend ./

# Install dependencies
RUN npm install

# Build the Strapi application
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Expose the port Strapi will run on
EXPOSE 1337

# Start the Strapi application
CMD ["npm", "run", "start"]
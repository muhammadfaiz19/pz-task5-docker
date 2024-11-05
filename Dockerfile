# Base stage
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY . .  
CMD ["npm", "run", "dev"]

# Test stage
FROM base AS test
ENV NODE_ENV=test
COPY . .  
CMD ["npm", "test"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production  
COPY . .  
CMD ["npm", "start"]

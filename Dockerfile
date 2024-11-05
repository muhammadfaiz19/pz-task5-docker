FROM node:18-alpine as base

WORKDIR /usr/src/app

# Development stage
FROM base AS development
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build  # Compile TypeScript files

# Command for development with nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled files from the development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/app.js"]  

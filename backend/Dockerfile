FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port for health checks
EXPOSE 8080

# Deploy Convex functions
CMD ["npm", "run", "build"]

# Use a Node.js image with Alpine for a smaller footprint
FROM node:22-slim AS development

# Set the working directory inside the container
WORKDIR /app

# Copy src directory first
COPY src ./src

# Set the working directory for Next.js app
WORKDIR /app/src

# Copy package.json and package-lock.json to src directory
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (npm ci is preferred for reproducible builds)
RUN npm ci

RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the production server
CMD ["npm", "start"]

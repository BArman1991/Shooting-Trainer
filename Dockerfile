# Use a Node.js image with Alpine for a smaller footprint
FROM node:22-slim AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This means npm ci will only re-run if package*.json changes
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (npm ci is preferred for reproducible builds)
RUN npm ci
RUN npm run build

# Copy the rest of the application code
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the production server
CMD ["npm", "start"]

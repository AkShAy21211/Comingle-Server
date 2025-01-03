# Use the official Node.js 20.15.1 Alpine image as the base image
FROM node:20.15.1-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if applicable)
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

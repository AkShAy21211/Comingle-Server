FROM node:19.5.0-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]


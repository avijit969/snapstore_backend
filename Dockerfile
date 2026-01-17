# Use Node.js LTS (Long Term Support) version
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build
COPY src/templates dist/templates

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "start"]

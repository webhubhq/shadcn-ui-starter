# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the application dependencies in the container
RUN npm install

# Copy the local app files to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to be accessed externally
EXPOSE 3000

# Define the command to run the application
CMD [ "npm", "run", "dev" ]

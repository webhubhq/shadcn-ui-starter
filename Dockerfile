# Use a Debian-based Node image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Copy the components.json and tsconfig.json files
COPY components.json ./
COPY tsconfig.json ./

# Clear NPM cache
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Reinstall Next.js (only if you suspect an issue with Next.js)
# RUN npm uninstall next && npm install next

# Install shadcn-ui
RUN npx shadcn-ui@latest add --overwrite --yes accordion alert alert-dialog avatar badge button card checkbox command dialog drawer dropdown-menu form input label popover progress radio-group resizable scroll-area select separator sheet skeleton sonner switch tabs textarea tooltip


# Copy the entire project into the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to be accessed externally (optional since it's commented out in your original Dockerfile)
# EXPOSE 3000

# Define the runtime command
CMD ["npm", "run", "start"]

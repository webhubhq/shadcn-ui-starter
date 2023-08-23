# Set the base image to Node.js
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Copy the components.json file
COPY components.json ./

#Copy ts.config.json
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Install shadcn-ui
RUN npx shadcn-ui add --overwrite --yes textarea tabs separator select radio-group progress input dialog card button label command checkbox accordion badge form

# Copy the entire project into the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to be accessed externally
# EXPOSE 3000

# Define the runtime command
CMD ["npm", "run", "start"]

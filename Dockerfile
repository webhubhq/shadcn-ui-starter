# Set the base image to Node.js
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Initialize shadcn-ui (assumption here, please adjust if different)
# Assuming --no-typescript bypasses the TypeScript question
RUN npx shadcn-ui init --no-typescript

# Add UI components using shadcn-ui
RUN npx shadcn-ui add --overwrite --yes textarea tabs separator select radio-group progress input dialog card button label command checkbox accordion badge

# Copy the entire project into the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to be accessed externally
EXPOSE 3000

# Define the runtime command
CMD ["npm", "run", "start"]

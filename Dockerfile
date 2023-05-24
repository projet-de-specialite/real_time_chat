# Use an appropriate base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

COPY routes ./routes



# Expose the port on which your application will run
EXPOSE 6000

# Set any necessary environment variables
ENV NODE_ENV production

# Start the application
CMD ["node", "index.js"]

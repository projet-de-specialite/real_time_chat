# RealTime Chat MicroService

This is a simple Node.js project using the Express framework. The application can be run either in a Docker container or directly on your local machine. This document provides instructions for both methods.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm. (For Gaëtan)
- You have installed Docker (if you want to run the project in a Docker container).

## Running the Project Locally

1. Clone the project repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   npm start or npm run start:ENV  `'dev'` with `'staging'` or `'prod'`
   ```

The application will start running on the specified port (default: 3000).

## Running the Project with Docker

1. Build the Docker image:

   ```bash
   docker build -t node-image .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 -e NODE_ENV=dev --name express-container node-image
   ```

Replace `'dev'` with `'staging'` or `'prod'` based on your environment. The application will now be running on port 3000.

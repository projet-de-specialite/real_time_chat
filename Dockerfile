# Use an appropriate base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --ignore-scripts


RUN addgroup app && adduser -S -G app app
RUN chown -R app:app /usr/src/app
USER app


COPY . .
COPY routes ./routes


EXPOSE 5000


ENV NODE_ENV production


CMD ["node", "index.js"]

FROM node:16-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --ignore-scripts

# Create a non-root user and give it permissions to the app directory
RUN addgroup app && adduser -S -G app app
RUN chown -R app:app /usr/src/app
USER app


COPY src ./src


EXPOSE 5000


ENV NODE_ENV production


CMD ["node", "src/index.js"]

FROM node:16-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /usr/src/app && chown -R appuser:appgroup /usr/src/app

WORKDIR /usr/src/app

COPY --chown=appuser:appgroup package*.json ./

USER appuser

RUN npm ci --only=production --ignore-scripts

COPY --chown=appuser:appgroup --chmod=440 index.js ./
COPY --chown=appuser:appgroup src ./

EXPOSE 3000

# Change the permissions of the index.js file to remove write permissions
RUN chmod -w /usr/src/app/index.js

CMD [ "node", "index.js" ]

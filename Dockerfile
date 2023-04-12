FROM node:16-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /usr/src/app && chown -R appuser:appgroup /usr/src/app

WORKDIR /usr/src/app

COPY --chown=appuser:appgroup package*.json ./

USER appuser


RUN npm ci --only=production --ignore-scripts


COPY --chown=appuser:appgroup index.js src ./

EXPOSE 3000

CMD [ "node", "index.js" ]
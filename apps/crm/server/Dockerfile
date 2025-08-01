# Primary Stage: Build NodeJS Express Image
FROM node:22-alpine3.22 AS primary

WORKDIR /server
COPY package*.json /server/
RUN npm install && npm cache clean --force
COPY . ./
RUN npm run compile

# Secondary Stage: Build NodeJS Express Image
FROM node:22-alpine3.22

ENV NODE_ENV=production
WORKDIR /server

LABEL version="1.0"
LABEL description="Image: CRM App: Server: NodeJS Express"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --chown=node:node package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --chown=node:node --from=primary /server/dist/ ./dist/

USER node

EXPOSE 4000
CMD ["npm", "run", "prod"]

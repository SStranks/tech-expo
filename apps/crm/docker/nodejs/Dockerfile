ARG NODE_VERSION=22-alpine3.22
ARG IMAGE_VERSION=1.0.0
ARG EXPRESS_EXPOSE_PORT=4443
FROM node:${NODE_VERSION} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@$PNPM_VERSION --activate

# Prerequisites for: Sharp
RUN apk add --no-cache vips-dev build-base python3

FROM base AS dependencies

WORKDIR /server

COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile

COPY package.json pnpm-workspace.yaml ./
COPY packages /packages
COPY apps/crm/server/package.json ./apps/crm/server/
COPY apps/crm/shared/package.json ./apps/crm/shared/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm --filter "@apps/crm-server" deploy --prod ./deploy

FROM base AS build

WORKDIR /server

COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile

COPY package.json pnpm-workspace.yaml ./
COPY packages /packages
COPY apps/crm/server/package.json ./apps/crm/server/
COPY apps/crm/shared/package.json ./apps/crm/shared/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --filter "@apps/crm-server" --frozen-lockfile

COPY . .
RUN pnpm --filter "@apps/crm-server" build

FROM node:${NODE_VERSION}

ENV NODE_ENV=production
WORKDIR /server

RUN apk add --no-cache vips

COPY --chown=node:node --from=build /server/apps/crm/server/dist /server/dist
COPY --chown=node:node --from=dependencies /server/deploy/node_modules /server/node_modules
COPY --chown=node:node --from=dependencies /server/deploy/package.json /server/package.json

ARG EXPRESS_EXPOSE_PORT
ENV EXPRESS_EXPOSE_PORT=${EXPRESS_EXPOSE_PORT}

USER node
EXPOSE ${EXPRESS_EXPOSE_PORT}
CMD ["node", "."]

ARG NODE_VERSION
ARG IMAGE_VERSION
ARG IMAGE_AUTHOR
LABEL org.opencontainers.image.title="techexpo-crm/express-api" \
  org.opencontainers.image.description="Node ${NODE_VERSION} image with init script" \
  org.opencontainers.image.version="${IMAGE_VERSION}" \
  org.opencontainers.image.authors="${IMAGE_AUTHOR}"

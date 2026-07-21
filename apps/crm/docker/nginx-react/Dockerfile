# https://aaronjbecker.com/posts/build-your-own-nginx-brotli-docker-container/
# renovate: datasource=docker depName=nginx
ARG NGINX_VERSION=1.29.0
ARG NGINX_REACT_EXPOSE_PORT=4443
FROM node:22.18.0-alpine3.22@sha256:1b2479dd35a99687d6638f5976fd235e26c5b37e8122f786fcd5fe231d63de5b AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@$PNPM_VERSION --activate

# Prerequisites for: Sharp (webpack)
RUN apk add --no-cache vips-dev build-base python3

FROM node:22.18.0-alpine3.22@sha256:1b2479dd35a99687d6638f5976fd235e26c5b37e8122f786fcd5fe231d63de5b AS react-builder

WORKDIR /client

COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile

COPY package.json pnpm-workspace.yaml ./
COPY packages /packages
COPY apps/crm/client/package.json ./apps/crm/client/
COPY apps/crm/shared/package.json ./apps/crm/shared/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --filter "@apps/crm-client" --frozen-lockfile

COPY . .
RUN pnpm --filter "@apps/crm-client" build

FROM alpine:3.24@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b AS nginx-builder

ARG NGINX_VERSION

RUN apk add --no-cache \
  build-base \
  pcre-dev \
  zlib-dev \
  openssl-dev \
  wget \
  git \
  brotli-dev

WORKDIR /app
RUN echo "Building nginx version: $NGINX_VERSION" \
  && wget -q "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" \
  && tar -zxf "nginx-${NGINX_VERSION}.tar.gz" \
  && ln -s "nginx-${NGINX_VERSION}" nginx \
  && git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
WORKDIR /app/nginx
RUN ./configure --with-compat --add-dynamic-module=../ngx_brotli \
  && make modules

FROM nginx:${NGINX_VERSION}-alpine

# install the brotli runtime libraries
RUN apk add --no-cache brotli-libs
COPY --chown=nginx:nginx --from=nginx-builder /app/nginx/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --chown=nginx:nginx --from=nginx-builder /app/nginx/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
COPY --chown=nginx:nginx --from=react-builder /client/apps/crm/client/dist /usr/share/nginx/html

RUN mkdir -p \
  /run \
  /var/run \
  /var/cache/nginx \
  /var/log/nginx \
  && chown -R nginx:nginx \
  /run \
  /var/run \
  /var/cache/nginx \
  /var/log/nginx

ARG NGINX_REACT_EXPOSE_PORT
ENV NGINX_REACT_EXPOSE_PORT=${NGINX_REACT_EXPOSE_PORT}

USER nginx
EXPOSE ${NGINX_REACT_EXPOSE_PORT}

ARG NGINX_VERSION
ARG IMAGE_VERSION
ARG IMAGE_AUTHOR
LABEL org.opencontainers.image.title="techexpo-crm/nginx-react" \
  org.opencontainers.image.description="Nginx ${NGINX_VERSION} image with brotli compression enabled" \
  org.opencontainers.image.version="${IMAGE_VERSION}" \
  org.opencontainers.image.authors="${IMAGE_AUTHOR}"

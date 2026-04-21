# astrogators-hub — production image
# Multi-stage: build static assets with Node, serve with nginx.

# --- Stage 1: build ---
FROM node:24-alpine AS builder

WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Build the production bundle. Vite inlines VITE_* env vars into the bundle at
# build time, so they must be present as ENV when `npm run build` runs.
ARG VITE_ASTROGATORS_TABLE_URL
ARG VITE_MOD_LEDGER_UI_URL
ENV VITE_ASTROGATORS_TABLE_URL=${VITE_ASTROGATORS_TABLE_URL}
ENV VITE_MOD_LEDGER_UI_URL=${VITE_MOD_LEDGER_UI_URL}

COPY . .
RUN npm run build


# --- Stage 2: serve ---
FROM nginx:alpine

# Drop the default nginx site
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Minimal SPA config: fall back to index.html for client-side routes.
# Listens on 4173 so it can coexist with the workspace reverse proxy on :80.
RUN printf '%s\n' \
    'server {' \
    '  listen 4173;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  location / { try_files $uri $uri/ /index.html; }' \
    '}' > /etc/nginx/conf.d/astrogators-hub.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]

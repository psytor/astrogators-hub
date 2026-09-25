# astrogators-hub — production image
# Multi-stage: build static assets with Node, serve with nginx.

# --- Stage 1: build ---
# Pinned to the exact patch release so a rebuild can't silently land on a
# different Node/npm than the last one - `node:24-alpine` floated with no
# record of what actually shipped. Confirmed via `docker inspect` that this
# tag currently resolves to the exact same digest as the floating one
# (sha256:ebfe2f9...) - no behavior change today, just a pin against future
# drift. Node 24 is the correct LTS line (became LTS Oct 2025, supported
# into 2028); Node 25 was Current-only and is already EOL.
FROM node:24.21.0-alpine AS builder

WORKDIR /app

# This image bundles npm 11.19.0; npm 12.1.0 is current. Bump explicitly
# before `npm ci` so the pinned Node version doesn't also pin us to a stale
# npm - same reasoning as the backend's POETRY_VERSION bump.
RUN npm install -g npm@12.1.0

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
# Pinned for the same reason as the builder stage above. `nginx:1.31.6-alpine`
# and the floating `nginx:alpine` report identical `nginx -v` (1.31.6) and
# identical Alpine base (3.24.2) - confirmed by running both - even though
# their manifest digests differ (expected: separately-tagged manifest lists
# for the same content, not a version difference).
FROM nginx:1.31.6-alpine

# Drop the default nginx site
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Minimal SPA config: fall back to index.html for client-side routes.
# Listens on 4173 so it can coexist with the workspace reverse proxy on :80.
# Client-side routes never contain a dot in their last path segment - only
# real static assets do. Falling back to index.html for a dotted path too
# means every vulnerability-scanner probe (/.env, /.git/config, wp-login.php,
# etc. - constant background noise on any public IP) gets a 200 instead of a
# 404, even though nothing is actually served: the response is just the SPA
# shell, same size every time. Not a data leak, but it's worth 404ing those
# so scan tools/log review can tell "not found" from "app responded".
#
# Cache split: Vite content-hashes index-*.js/.css under assets/ (a rebuild
# always changes the filename), so those are safe to cache forever. Everything
# else - index.html, the SPA fallback for every client-side route, and
# assets/images/* (public/assets/images/*.jpeg|png, copied verbatim by Vite,
# NOT content-hashed - see public/assets/images/) - must never be cached, or
# a stale index.html (or a corrected image that never updates) sticks around
# until a hard refresh. `always` so the header still shows up on 404s.
# nginx picks the longest matching prefix, so assets/images/ (declared first,
# more specific) wins over the general assets/ rule for anything under it.
RUN printf '%s\n' \
    'server {' \
    '  listen 4173;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  location /assets/images/ {' \
    '    alias /usr/share/nginx/html/assets/images/;' \
    '    add_header Cache-Control "no-cache" always;' \
    '    try_files $uri =404;' \
    '  }' \
    '  location /assets/ {' \
    '    alias /usr/share/nginx/html/assets/;' \
    '    add_header Cache-Control "public, max-age=31536000, immutable" always;' \
    '    try_files $uri =404;' \
    '  }' \
    '  location / {' \
    '    add_header Cache-Control "no-cache" always;' \
    '    location ~ \.\w+$ { try_files $uri =404; }' \
    '    try_files $uri $uri/ /index.html;' \
    '  }' \
    '}' > /etc/nginx/conf.d/astrogators-hub.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]

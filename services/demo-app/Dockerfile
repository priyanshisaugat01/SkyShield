# syntax=docker/dockerfile:1

# ---- deps stage: install production dependencies only ----------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime stage: minimal image, no build tooling, non-root user ---------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js ./

# The base image bundles the npm CLI (and its own transitive dependencies)
# purely for build-time use. The application only needs the `node` binary
# to run, so stripping npm/npx/corepack out of the runtime image shrinks
# both the attack surface and the set of dependencies Trivy has to scan.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

# node:20-alpine already ships a non-root "node" user (uid 1000); run as it
# instead of root to limit the blast radius of a container compromise.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]

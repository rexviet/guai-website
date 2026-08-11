# syntax=docker/dockerfile:1
#
# Multi-stage production Dockerfile for the Strapi v5 CMS.
# Stage 1 ("build") compiles the TypeScript source and builds the Strapi
# admin panel. Stage 2 ("production") ships only the runtime artifacts,
# keeping the final image small and avoiding dev dependencies / build
# toolchains in the image that actually runs on the VPS.

# ---------------------------------------------------------------------------
# Stage 1: build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /opt/app

ENV NODE_ENV=production

# Copy lockfile + manifest first for better layer caching.
COPY package.json package-lock.json ./
#
# NOTE: deliberately NOT installing build-base/vips-dev (or any other native
# build toolchain) here. sharp ships prebuilt platform binaries (e.g.
# @img/sharp-linuxmusl-arm64) that npm installs as optional dependencies, and
# should be used as-is. If `vips-dev` headers are present, sharp's postinstall
# check detects a "system" libvips via pkg-config and attempts to compile
# against it via node-gyp instead of using the prebuilt binary, which then
# fails (this Strapi version's dependency tree does not include the
# node-addon-api package that build path requires).
#
# `npm ci --ignore-scripts` followed by `npm rebuild` (rather than a plain
# `npm ci`) also works around a separate npm/sharp race condition: sharp's own
# postinstall (`install/check.js`) can run before its optional platform
# binary packages finish extracting, wrongly concluding no prebuilt binary is
# available. Running scripts only after every optional dependency is fully on
# disk avoids that race deterministically.
RUN npm ci --ignore-scripts && npm rebuild

# Copy the rest of the application source and build the admin panel.
COPY . .
#
# NOTE: do not add `npm prune --omit=dev` here — it was measured to be a
# no-op (123 bytes on a 357MB image). `ENV NODE_ENV=production` above already
# makes `npm ci` skip devDependencies; the image's ~795MB of node_modules is
# genuine runtime dependencies (@strapi/admin, typedoc, ...). typescript is
# present because @strapi/typescript-utils depends on it, not because it is a
# devDependency.
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: production
# ---------------------------------------------------------------------------
FROM node:22-alpine AS production

WORKDIR /opt/app

ENV NODE_ENV=production

# Run as a non-root user rather than the default root user.
RUN addgroup -S strapi && adduser -S strapi -G strapi

# Only copy what's needed to run the compiled app: installed node_modules,
# the compiled `dist/` output (Strapi v5 compiles config + src there),
# and package.json (needed for the `npm run start` script + metadata).
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/dist ./dist

# `tsconfig.json` MUST also be present at the app root in production: the
# `strapi start` CLI command checks `<cwd>/tsconfig.json` to determine where
# compiled output lives (`compilerOptions.outDir`, i.e. `dist/`). Without it,
# Strapi assumes the app root itself is the "dist dir", looks for
# `./config/database.js` (which doesn't exist here, only `./dist/config`
# does), silently loads an empty config, and crashes at boot with
# "Cannot destructure property 'client' of 'db.config.connection'".
COPY --from=build /opt/app/tsconfig.json ./tsconfig.json

# `public/` (default local upload-provider storage target) and
# `database/migrations` (knex migration files) are not emitted into
# `dist/` by `strapi build` but are required at runtime, so they are
# copied alongside the items above.
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/favicon.png ./favicon.png

RUN chown -R strapi:strapi /opt/app
USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]

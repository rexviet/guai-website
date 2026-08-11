import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Strapi always sits behind a reverse proxy in this project: nginx on the
  // VPS (infra/nginx/guai-studio.conf), which itself sits behind Cloudflare.
  // Without this flag Koa ignores X-Forwarded-* entirely and `ctx.ip` is the
  // socket peer — 127.0.0.1, i.e. nginx — for every single request.
  //
  // That matters concretely in src/api/lead/controllers/lead.ts, which stores
  // `ip_address` on every lead and forwards `remoteip` to Cloudflare
  // Turnstile's siteverify call. Both were recording 127.0.0.1.
  //
  // nginx must also be restoring the true client address from Cloudflare's
  // CF-Connecting-IP header (it is; see the set_real_ip_from block in
  // infra/nginx/guai-studio.conf) — otherwise this just promotes a Cloudflare
  // edge IP instead of a loopback one.
  //
  // Must be `proxy.koa`, NOT a bare `proxy: true`. Strapi v5 reads exactly
  // `server.proxy.koa` when constructing the Koa app
  // (@strapi/core/dist/services/server/index.js), so a boolean here resolves
  // to undefined and silently leaves the proxy trust OFF. The sibling keys
  // `proxy.global` / `proxy.http` / `proxy.https` are unrelated — they
  // configure Strapi's own OUTBOUND requests.
  proxy: {
    koa: env.bool('IS_PROXIED', true),
  },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;

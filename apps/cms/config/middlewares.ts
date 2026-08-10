import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  // Uploads are served from the Cloudflare R2 custom domain (R2_PUBLIC_URL,
  // see config/plugins.ts), which is a DIFFERENT origin from the admin panel
  // itself. Strapi's default CSP (@strapi/utils `CSP_DEFAULTS`) only allows
  // 'self', data: and blob: for img-src/media-src, so the admin's <img> and
  // <video> previews of R2 assets get blocked by the browser before any
  // request is made — Chromium reports it as
  // "MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check".
  // Allowlisting the media host here is the documented requirement for any
  // external upload provider.
  //
  // NOTE: R2_PUBLIC_URL must be present in the Strapi runtime environment for
  // this to work — infra/docker-compose.yml passes it into the container.
  const mediaHosts = [env('R2_PUBLIC_URL')].filter(Boolean) as string[];

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'https://market-assets.strapi.io',
              ...mediaHosts,
            ],
            'media-src': ["'self'", 'data:', 'blob:', ...mediaHosts],
            // Dropped so local http://localhost:1337 development is not
            // force-upgraded to https (production is behind Nginx TLS anyway).
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;

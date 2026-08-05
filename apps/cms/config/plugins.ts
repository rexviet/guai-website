import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      // Cloudflare R2 (S3-compatible API). See:
      // https://docs.strapi.io/cms/configurations/media-library-providers/amazon-s3
      //
      // KNOWN DEVIATION from solution design section 6: the design calls for
      // `site-setting.showreel_video` to stay self-hosted (bypass R2) to save
      // R2 free-tier quota and keep hero load latency low. Strapi v5's media
      // library has exactly one active provider for the whole instance —
      // routing a single field to a different provider requires a custom
      // upload controller/middleware that bypasses `plugin::upload`'s
      // provider entirely for that field, which is real engineering beyond
      // this phase's schema/config scope. Flagged in
      // docs/plans/260804-2236/phase-02-strapi-content-model.md Risk
      // Assessment for explicit follow-up: either accept R2 (a single
      // optimized hero video is negligible against the 10GB free tier, and a
      // R2 custom-domain + Cloudflare CDN may already serve it fast enough)
      // or scope a dedicated local-storage-for-one-field task later.
      provider: 'aws-s3',
      providerOptions: {
        // Public CDN domain (R2 custom domain / dev URL) so Strapi generates
        // URLs pointing at the public bucket, not the private S3 endpoint.
        baseUrl: env('R2_PUBLIC_URL'),
        s3Options: {
          credentials: {
            accessKeyId: env('R2_ACCESS_KEY_ID'),
            secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
          },
          region: env('R2_REGION', 'auto'),
          endpoint: env('R2_ENDPOINT'),
          // R2's S3-compatible API requires path-style requests
          // (https://bucket.r2.../key is not supported).
          forcePathStyle: true,
          params: {
            Bucket: env('R2_BUCKET'),
            // R2 does not support the ACL param the provider sends by
            // default (`public-read`); explicitly present-but-undefined
            // makes the provider skip setting a default ACL entirely.
            ACL: undefined,
          },
        },
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;

import type { StrapiApp } from '@strapi/strapi/admin';
import { AutoPosterInput } from './extensions/components/AutoPoster';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'auto-poster-tool',
      Component: AutoPosterInput,
    });
  },
};

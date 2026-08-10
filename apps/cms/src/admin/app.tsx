import type { StrapiApp } from '@strapi/strapi/admin';
import { AutoPosterInput } from './extensions/components/AutoPoster';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    app.customFields.register({
      name: 'auto-poster',
      pluginId: 'shared',
      type: 'string',
      intlLabel: {
        id: 'shared.auto-poster.label',
        defaultMessage: 'Auto Poster Generator',
      },
      intlDescription: {
        id: 'shared.auto-poster.description',
        defaultMessage: 'Generates JPEG poster from video asset',
      },
      components: {
        Input: AutoPosterInput,
      },
    });
  },
};

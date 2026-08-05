import type { Schema, Struct } from '@strapi/strapi';

export interface SeoSeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_seo_seo_metas';
  info: {
    displayName: 'SEO Meta';
    icon: 'search';
  };
  attributes: {
    meta_description: Schema.Attribute.Text;
    meta_title: Schema.Attribute.String;
    og_image: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'seo.seo-meta': SeoSeoMeta;
    }
  }
}

import type { Core } from '@strapi/strapi';

/** Locales the site must have available. `vi` is the default. */
const REQUIRED_LOCALES: Array<{ code: string; name: string }> = [
  { code: 'vi', name: 'Vietnamese (vi)' },
  { code: 'en', name: 'English (en)' },
];

const DEFAULT_LOCALE_CODE = 'vi';

/**
 * Ensure every locale in `REQUIRED_LOCALES` exists and `DEFAULT_LOCALE_CODE`
 * is the i18n plugin's default locale, without creating duplicates.
 *
 * Strapi v5's i18n plugin has no static JSON config for locales — it seeds a
 * single default locale in the database on first boot (`en`, unless
 * `STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE` is set) via its own bootstrap, which
 * runs before this application bootstrap. This function fills the gap: it
 * creates any missing locale and makes sure the core-store `default_locale`
 * value matches `DEFAULT_LOCALE_CODE`. Safe to call on every boot (checks
 * existence via `findByCode` before creating, and only writes the default
 * when it differs).
 */
export async function seedI18nLocales({ strapi }: { strapi: Core.Strapi }): Promise<void> {
  const localesService = strapi.plugin('i18n').service('locales');

  for (const locale of REQUIRED_LOCALES) {
    try {
      const existing = await localesService.findByCode(locale.code);
      if (!existing) {
        await localesService.create(locale);
      }
    } catch (error) {
      // `code` is unique — a concurrent boot (e.g. overlapping container
      // restart) can create the locale between our findByCode and create
      // calls. That race is harmless (the locale ends up existing either
      // way), so only swallow a unique-constraint violation; anything else
      // (DB unreachable, etc.) should still fail boot loudly.
      const isUniqueConstraintError =
        error instanceof Error && /unique/i.test(error.message);
      if (!isUniqueConstraintError) {
        throw error;
      }
    }
  }

  const currentDefault = await localesService.getDefaultLocale();
  if (currentDefault !== DEFAULT_LOCALE_CODE) {
    await localesService.setDefaultLocale({ code: DEFAULT_LOCALE_CODE });
  }
}

export async function seedHomepageData({ strapi }: { strapi: Core.Strapi }): Promise<void> {
  try {
    // Sync Content-Manager Edit Layouts so components appear in CMS Admin UI
    const contentManagerStore = strapi.store({
      type: 'plugin',
      name: 'content_manager',
    });

    const syncLayout = async (uid: string, fieldNames: string[]) => {
      try {
        const key = `configuration_content_types::${uid}`;
        const config: any = await contentManagerStore.get({ key });
        if (config && config.layouts && config.layouts.edit) {
          let updated = false;
          for (const fieldName of fieldNames) {
            const exists = config.layouts.edit.some((row: any[]) =>
              row.some((item: any) => item.name === fieldName)
            );
            if (!exists) {
              config.layouts.edit.push([{ name: fieldName, size: 12 }]);
              updated = true;
            }
          }
          if (updated) {
            await contentManagerStore.set({ key, value: config });
          }
        }
      } catch (e) {
        console.error(`Error syncing layout for ${uid}:`, e);
      }
    };

    const syncComponentLayout = async (componentUid: string, rows: any[][]) => {
      try {
        const key = `configuration_components::${componentUid}`;
        const config: any = await contentManagerStore.get({ key });
        if (config && config.layouts) {
          config.layouts.edit = rows;
          await contentManagerStore.set({ key, value: config });
        }
      } catch (e) {
        console.error(`Error syncing component layout for ${componentUid}:`, e);
      }
    };

    await syncComponentLayout('shared.video-source', [
      [{ name: 'video_file', size: 6 }, { name: 'poster_file', size: 6 }],
      [{ name: 'auto_poster', size: 12 }],
      [{ name: 'mp4_url', size: 6 }, { name: 'poster_url', size: 6 }]
    ]);

    await syncLayout('api::service.service', ['featured_video']);
    await syncLayout('api::case-study.case-study', ['video']);
    await syncLayout('api::site-setting.site-setting', ['banner_video', 'cta_video']);

    // 1. Site Setting
    const bannerVideo = {
      mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.mp4",
      webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.webm",
      poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-poster-00001.jpg"
    };
    const ctaVideo = {
      mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.mp4",
      webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.webm",
      poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-poster-00001.jpg"
    };

    const docService = (uid: string) => (strapi.documents(uid as any) as any);

    const siteSettings = await docService('api::site-setting.site-setting').findMany({
      populate: ['banner_video', 'cta_video']
    });

    if (!siteSettings || siteSettings.length === 0) {
      const created = await docService('api::site-setting.site-setting').create({
        data: {
          site_name: "GuAI Studio",
          tagline: "ĐỊNH HÌNH TƯƠNG LAI SÁNG TẠO BẰNG AI",
          banner_video: bannerVideo,
          cta_video: ctaVideo,
        },
        status: 'published'
      });
      if (created?.documentId) {
        await docService('api::site-setting.site-setting').publish({ documentId: created.documentId });
      }
    } else {
      const setting = siteSettings[0];
      if (!setting.banner_video || !setting.cta_video) {
        await docService('api::site-setting.site-setting').update({
          documentId: setting.documentId,
          data: {
            banner_video: setting.banner_video || bannerVideo,
            cta_video: setting.cta_video || ctaVideo,
          }
        });
      }
    }

    // 2. Case Studies (Works)
    const existingCaseStudies = await docService('api::case-study.case-study').findMany({
      populate: ['video']
    });

    const worksData = [
      {
        title: "Kakao Wcopilot AI Campaign",
        slug: "kakao-wcopilot-ai-campaign",
        category: "Cinematic",
        description: "TVC phong cách viễn tưởng sản xuất 100% bằng công nghệ AI cho thương hiệu Kakao Mobility.",
        featured: true,
        video: {
          mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-transcode.mp4",
          webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-transcode.webm",
          poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-poster-00001.jpg"
        }
      },
      {
        title: "Virtual KOL 3D 'AURA' - Thời Trang Tương Lai",
        slug: "cyberpunk-virtual-kol-aura",
        category: "Character",
        description: "Tạo hình và vận hành KOL ảo AURA đại diện bộ sưu tập thời trang Thu-Đông khu vực APAC.",
        featured: true,
        video: {
          mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-transcode.mp4",
          webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-transcode.webm",
          poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-poster-00001.jpg"
        }
      },
      {
        title: "Sự Kiện Ra Mắt Xe Điện NeuraCar AI",
        slug: "neuracar-ai-spatial-launch",
        category: "Cinematic",
        description: "Trình diễn hình ảnh 3D và phim ngắn ra mắt dòng xe điện tự lái thế hệ mới.",
        featured: true,
        video: {
          mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-transcode.mp4",
          webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-transcode.webm",
          poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-poster-00001.jpg"
        }
      }
    ];

    if (!existingCaseStudies || existingCaseStudies.length === 0) {
      for (const work of worksData) {
        const created = await docService('api::case-study.case-study').create({ data: work as any, status: 'published' });
        if (created?.documentId) {
          await docService('api::case-study.case-study').publish({ documentId: created.documentId });
        }
      }
    } else {
      const fallbackVideos = worksData.map(w => w.video);
      for (let i = 0; i < existingCaseStudies.length; i++) {
        const cs = existingCaseStudies[i];
        if (!cs.video) {
          await docService('api::case-study.case-study').update({
            documentId: cs.documentId,
            data: { video: fallbackVideos[i % fallbackVideos.length] }
          });
        }
      }
    }

    // 3. Services
    const existingServices = await docService('api::service.service').findMany({
      populate: ['featured_video']
    });
    const serviceVideos = [
      {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-poster-00001.jpg"
      },
      {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-poster-00001.jpg"
      },
      {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-poster-00001.jpg"
      }
    ];

    if (existingServices && existingServices.length > 0) {
      for (let i = 0; i < existingServices.length; i++) {
        const svc = existingServices[i];
        if (!svc.featured_video) {
          const video = serviceVideos[i % serviceVideos.length];
          await docService('api::service.service').update({
            documentId: svc.documentId,
            data: { featured_video: video }
          });
        }
      }
    }
  } catch (err) {
    console.error("Error in seedHomepageData:", err);
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedI18nLocales({ strapi });
    await seedHomepageData({ strapi });

    // Register lifecycle subscriber to dispatch GitHub Actions rebuild workflow on content changes
    const { triggerGitHubDispatch } = await import('./services/github-dispatch.js');
    strapi.db.lifecycles.subscribe({
      models: [
        'api::service.service',
        'api::case-study.case-study',
        'api::virtual-kol.virtual-kol',
        'api::site-setting.site-setting',
      ],
      async afterCreate(event) {
        triggerGitHubDispatch({
          eventType: 'strapi_content_update',
          clientPayload: { model: event.model.uid, action: 'afterCreate' },
        });
      },
      async afterUpdate(event) {
        triggerGitHubDispatch({
          eventType: 'strapi_content_update',
          clientPayload: { model: event.model.uid, action: 'afterUpdate' },
        });
      },
      async afterDelete(event) {
        triggerGitHubDispatch({
          eventType: 'strapi_content_update',
          clientPayload: { model: event.model.uid, action: 'afterDelete' },
        });
      },
    });
  },
};

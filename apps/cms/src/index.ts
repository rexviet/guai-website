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

    // NOTE: Public API read access (find/findOne) for `service`, `case-study`,
    // `virtual-kol`, and `site-setting` is intentionally NOT configured here.
    // Per the phase-02 plan's Security Considerations ("limit API public
    // access to only required endpoints"), granting the `public` role's
    // find/findOne permissions is out of scope for this phase — it should be
    // done via the admin UI (Settings > Users & Permissions > Roles > Public)
    // or a dedicated permissions seed script in a later phase, not baked into
    // this bootstrap hook.
  },
};

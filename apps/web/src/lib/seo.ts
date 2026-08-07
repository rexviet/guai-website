export interface SeoMeta {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSeoTags(meta?: SeoMeta, fallbackTitle = "GUAI Studio"): string {
  if (!meta) {
    return `<title>${fallbackTitle}</title>`;
  }
  const title = meta.title ? `${meta.title} | ${fallbackTitle}` : fallbackTitle;
  const description = meta.description || "";
  
  let tags = `<title>${title}</title>\n`;
  if (description) tags += `<meta name="description" content="${description}" />\n`;
  if (meta.image) tags += `<meta property="og:image" content="${meta.image}" />\n`;
  if (meta.noIndex) tags += `<meta name="robots" content="noindex, nofollow" />\n`;

  return tags;
}

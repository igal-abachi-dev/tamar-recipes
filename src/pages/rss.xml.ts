import type { APIRoute } from 'astro';
import { getSiteContent } from '../lib/content';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const { recipes, isDemo } = await getSiteContent();
  const feedUrl = new URL('/rss.xml', site ?? 'https://example.com');
  const siteUrl = new URL('/', site ?? 'https://example.com');
  const publishedRecipes = (isDemo ? [] : recipes)
    .filter((recipe) => !recipe.demo)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .slice(0, 50);

  const items = publishedRecipes
    .map((recipe) => {
      const link = new URL(`/recipes/${encodeURIComponent(recipe.slug)}/`, siteUrl);
      const pubDate = recipe.publishedAt ? new Date(recipe.publishedAt) : undefined;
      const validPubDate = pubDate && !Number.isNaN(pubDate.valueOf());
      const category = recipe.category?.title
        ? `<category>${escapeXml(recipe.category.title)}</category>`
        : '';

      return `
    <item>
      <title>${escapeXml(recipe.title)}</title>
      <link>${escapeXml(link.href)}</link>
      <guid isPermaLink="true">${escapeXml(link.href)}</guid>
      <description>${escapeXml(recipe.description || '')}</description>
      ${category}
      ${validPubDate ? `<pubDate>${pubDate.toUTCString()}</pubDate>` : ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>אתר המתכונים של תמר</title>
    <link>${escapeXml(siteUrl.href)}</link>
    <description>מתכונים חדשים מהמטבח של תמר.</description>
    <language>he</language>
    <atom:link href="${escapeXml(feedUrl.href)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};

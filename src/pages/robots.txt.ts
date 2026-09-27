import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const indexingEnabled = Boolean(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID &&
    import.meta.env.PUBLIC_SANITY_PROJECT_ID !== 'your-project-id' &&
    import.meta.env.PUBLIC_SITE_URL &&
    import.meta.env.PUBLIC_SITE_URL !== 'https://example.com' &&
    import.meta.env.PUBLIC_SITE_INDEXING_ENABLED === 'true',
  );
  const body = indexingEnabled
    ? `User-agent: *\nAllow: /\nDisallow: /preview/\nDisallow: /api/preview/\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const live = Boolean(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID &&
    import.meta.env.PUBLIC_SANITY_PROJECT_ID !== 'your-project-id' &&
    import.meta.env.PUBLIC_SITE_URL &&
    import.meta.env.PUBLIC_SITE_URL !== 'https://example.com',
  );
  const body = live
    ? `User-agent: *\nAllow: /\nDisallow: /preview/\nDisallow: /api/preview/\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

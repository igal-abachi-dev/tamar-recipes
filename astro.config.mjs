// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const hasSanity = Boolean(
  env.PUBLIC_SANITY_PROJECT_ID && env.PUBLIC_SANITY_PROJECT_ID !== 'your-project-id',
);
const hasLiveSiteUrl = Boolean(
  env.PUBLIC_SITE_URL && env.PUBLIC_SITE_URL !== 'https://example.com',
);
const indexingEnabled = hasSanity && hasLiveSiteUrl && env.PUBLIC_SITE_INDEXING_ENABLED === 'true';

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://example.com',
  integrations: [
    svelte(),
    ...(indexingEnabled
      ? [
          sitemap({
            filter: (page) => !['/about/', '/rss.xml'].includes(new URL(page).pathname),
          }),
        ]
      : []),
  ],
  adapter: vercel(),
  output: 'static',
});

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

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://example.com',
  integrations: [svelte(), ...(hasSanity && hasLiveSiteUrl ? [sitemap()] : [])],
  adapter: vercel(),
  output: 'static',
});

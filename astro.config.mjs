// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

export default defineConfig({
  site: env.PUBLIC_SITE_URL?.trim() || 'http://localhost:4321',
  // GitHub Pages project sites live under /<repo>/; Azure Static Web Apps and custom domains use '/'.
  base: env.PUBLIC_BASE_PATH?.trim() || '/',
  trailingSlash: 'always',
  integrations: [react(), mdx(), sitemap()],
});

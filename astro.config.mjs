// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

export default defineConfig({
  site: env.PUBLIC_SITE_URL?.trim() || 'http://localhost:4321',
  trailingSlash: 'always',
  integrations: [react(), mdx(), sitemap()],
});

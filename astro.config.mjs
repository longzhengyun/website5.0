import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://jary8.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});

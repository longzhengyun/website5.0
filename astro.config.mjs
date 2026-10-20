import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://jary8.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

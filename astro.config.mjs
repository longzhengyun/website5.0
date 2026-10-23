import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://www.jary8.com';

export default defineConfig({
  site,
  // 项目 Pages 绑定自定义域名后站点在域名根路径提供服务，base 保持 '/'
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});

import type { APIRoute } from 'astro';
import { ARTICLES_PER_PAGE } from '../config/site';
import {
  articleListPath,
  articlePath,
  getArticlesByCategory,
  getCategoriesInUse,
  getPublishedArticles,
  getPublishedProjects,
  projectPath,
} from '../lib/content';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });

export const GET: APIRoute = async ({ site }) => {
  const [articles, projects] = await Promise.all([getPublishedArticles(), getPublishedProjects()]);
  const base = site ?? new URL('https://jary8.com');
  const paths = new Set<string>(['/', '/articles/', '/projects/', '/about/']);

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  for (let page = 2; page <= totalPages; page += 1) {
    paths.add(articleListPath(page));
  }

  for (const category of getCategoriesInUse(articles)) {
    const categoryArticles = getArticlesByCategory(articles, category.label);
    const categoryPages = Math.ceil(categoryArticles.length / ARTICLES_PER_PAGE);
    for (let page = 1; page <= categoryPages; page += 1) {
      paths.add(articleListPath(page, category.slug));
    }
  }

  for (const article of articles) {
    paths.add(articlePath(article.data.slug));
  }

  for (const project of projects) {
    paths.add(projectPath(project.data.slug));
  }

  const urls = [...paths]
    .map((path) => `  <url><loc>${escapeXml(new URL(path, base).href)}</loc></url>`)
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

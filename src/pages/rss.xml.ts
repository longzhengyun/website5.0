import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { articlePath, getPublishedArticles } from '../lib/content';

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
  const articles = await getPublishedArticles();
  const base = site ?? new URL('https://jary8.com');
  const channelUrl = new URL('/articles/', base).href;
  const selfUrl = new URL('/rss.xml', base).href;
  const items = articles.slice(0, 20);

  const itemXml = items
    .map((article) => {
      const url = new URL(articlePath(article.data.slug), base).href;
      return [
        '<item>',
        `<title>${escapeXml(article.data.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<description>${escapeXml(article.data.summary)}</description>`,
        `<category>${escapeXml(article.data.category)}</category>`,
        `<pubDate>${article.data.publishedAt.toUTCString()}</pubDate>`,
        '</item>',
      ].join('');
    })
    .join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(SITE.title)}</title>`,
    `<link>${escapeXml(channelUrl)}</link>`,
    `<description>${escapeXml(SITE.description)}</description>`,
    `<language>${escapeXml(SITE.locale.toLowerCase())}</language>`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml"/>`,
    itemXml,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};

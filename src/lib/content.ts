import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  ARTICLES_PER_PAGE,
  CATEGORIES,
  getCategoryByLabel,
  type Category,
  type CategorySlug,
} from '../config/site';

export type ArticleEntry = CollectionEntry<'article'>;
export type ProjectEntry = CollectionEntry<'project'>;
export type ProfileEntry = CollectionEntry<'profile'>;

const RESERVED_ARTICLE_SLUGS = new Set(['category', 'page']);

function assertSlug(entry: ArticleEntry | ProjectEntry) {
  if (entry.id !== entry.data.slug) {
    throw new Error(
      `[content] "${entry.id}" 的 slug 必须与文件名一致；当前为 "${entry.data.slug}"`,
    );
  }
  if (RESERVED_ARTICLE_SLUGS.has(entry.data.slug)) {
    throw new Error(`[content] "${entry.data.slug}" 是保留路由名，不能作为文章 slug`);
  }
}

function assertUniqueSlugs(entries: Array<ArticleEntry | ProjectEntry>) {
  const seen = new Set<string>();
  for (const entry of entries) {
    assertSlug(entry);
    if (seen.has(entry.data.slug)) {
      throw new Error(`[content] slug 重复："${entry.data.slug}"`);
    }
    seen.add(entry.data.slug);
  }
}

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const entries = await getCollection('article', ({ data }) => !data.draft);
  assertUniqueSlugs(entries);
  return entries.sort(
    (a, b) =>
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
      a.data.slug.localeCompare(b.data.slug),
  );
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('project', ({ data }) => !data.draft);
  assertUniqueSlugs(entries);
  return entries.sort((a, b) => {
    const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return b.data.period.localeCompare(a.data.period, 'en');
  });
}

export async function getProfile(): Promise<ProfileEntry> {
  const entry = await getEntry('profile', 'profile');
  if (!entry) {
    throw new Error('[content] 缺少 src/content/profile/profile.mdx');
  }
  return entry;
}

export function getCategoriesInUse(articles: ArticleEntry[]): Array<Category & { count: number }> {
  return CATEGORIES.map((category) => ({
    ...category,
    count: articles.filter((article) => article.data.category === category.label).length,
  })).filter((category) => category.count > 0);
}

export function getCategorySlug(label: string): CategorySlug | undefined {
  return getCategoryByLabel(label)?.slug;
}

export function getArticlesByCategory(articles: ArticleEntry[], label: string): ArticleEntry[] {
  return articles.filter((article) => article.data.category === label);
}

export function getFeaturedArticles(articles: ArticleEntry[], limit = 3): ArticleEntry[] {
  const featured = articles.filter((article) => article.data.featured);
  const rest = articles.filter((article) => !article.data.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getFeaturedProjects(projects: ProjectEntry[], limit = 2): ProjectEntry[] {
  const featured = projects.filter((project) => project.data.featured);
  const rest = projects.filter((project) => !project.data.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedArticles(
  articles: ArticleEntry[],
  current: ArticleEntry,
  limit = 3,
): ArticleEntry[] {
  return articles
    .filter(
      (article) =>
        article.data.slug !== current.data.slug &&
        article.data.category === current.data.category,
    )
    .slice(0, limit);
}

export function getAdjacentArticles(articles: ArticleEntry[], current: ArticleEntry) {
  const index = articles.findIndex((article) => article.data.slug === current.data.slug);
  return {
    prev: index > 0 ? articles[index - 1] : undefined,
    next: index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined,
  };
}

export function getAdjacentProjects(projects: ProjectEntry[], current: ProjectEntry) {
  const index = projects.findIndex((project) => project.data.slug === current.data.slug);
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}

export function paginate<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
    total: items.length,
  };
}

export function getReadingTime(body: string | undefined): number {
  const text = body ?? '';
  const cjk = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 300 + latinWords / 200));
}

export function articlePath(slug: string): string {
  return `/articles/${slug}/`;
}

export function projectPath(slug: string): string {
  return `/projects/${slug}/`;
}

export function categoryPath(slug: string): string {
  return `/articles/category/${slug}/`;
}

export function articleListPath(page = 1, categorySlug?: string): string {
  const base = categorySlug ? `/articles/category/${categorySlug}/` : '/articles/';
  return page <= 1 ? base : `${base}page/${page}/`;
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) items.push('ellipsis');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push('ellipsis');
  items.push(totalPages);
  return items;
}

export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDateLong(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year} 年 ${month} 月 ${day} 日`;
}

export const SITE = {
  name: '佳瑞网',
  nameEn: 'Jary8',
  title: '佳瑞网 — Web 前端开发',
  description:
    '佳瑞网的个人技术站：记录 Web 前端、界面设计与长期维护的文章、项目和经历。',
  locale: 'zh-CN',
  github: 'https://github.com/longzhengyun',
  defaultOgImage: '/og-default.png',
} as const;

export const CATEGORY_LABELS = ['HTML/CSS', 'JavaScript', '框架', '工程化', '杂谈'] as const;

export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

export const CATEGORIES = [
  { slug: 'html-css', label: 'HTML/CSS' },
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'framework', label: '框架' },
  { slug: 'engineering', label: '工程化' },
  { slug: 'essay', label: '杂谈' },
] as const satisfies ReadonlyArray<{ slug: string; label: CategoryLabel }>;

export type Category = (typeof CATEGORIES)[number];
export type CategorySlug = Category['slug'];

export const ARTICLES_PER_PAGE = 10;

export const MAIN_NAV = [
  { href: '/', label: '首页', section: 'home' },
  { href: '/articles/', label: '文章', section: 'articles' },
  { href: '/projects/', label: '项目', section: 'projects' },
  { href: '/about/', label: '关于', section: 'about' },
] as const;

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((category) => category.label === label);
}

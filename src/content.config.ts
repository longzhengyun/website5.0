import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_LABELS } from './config/site';

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 必须是小写 ASCII kebab-case');

const article = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(4).max(60),
      slug,
      summary: z.string().trim().min(50).max(80),
      category: z.enum(CATEGORY_LABELS),
      tags: z.array(z.string().trim().min(1)).max(5).default([]),
      publishedAt: z.coerce
        .date()
        .refine((date) => date.getTime() <= Date.now(), '发布日期不得晚于构建日'),
      updatedAt: z.coerce.date().optional(),
      cover: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      legacyId: z.string().trim().min(1).optional(),
    }),
});

const project = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(4).max(60),
      slug,
      summary: z.string().trim().min(50).max(80),
      type: z.enum(['个人项目', '开源项目', '案例演示', '工作项目']).default('个人项目'),
      status: z.enum(['已完成', '进行中', '长期维护']).default('已完成'),
      period: z.string().trim().min(1),
      role: z.string().trim().min(1),
      stack: z.array(z.string().trim().min(1)).min(1).max(8),
      links: z
        .array(
          z.object({
            label: z.string().trim().min(1),
            url: z.string().url(),
          }),
        )
        .min(1),
      cover: image().optional(),
      gallery: z.array(image()).max(6).optional(),
      featured: z.boolean().default(false),
      order: z.number().int().optional(),
      draft: z.boolean().default(false),
      legacyId: z.string().trim().min(1).optional(),
    }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/profile' }),
  schema: z.object({
    name: z.string().trim().min(1),
    englishName: z.string().trim().min(1).optional(),
    headline: z.string().trim().min(1),
    city: z.string().trim().min(1).optional(),
    email: z.string().email(),
    showEmail: z.boolean().default(false),
    timezone: z.string().trim().min(1).optional(),
    github: z.string().url(),
    socials: z
      .array(z.object({ label: z.string().trim().min(1), url: z.string().url() }))
      .default([]),
    avatar: z.string().trim().min(1),
    resumeUrl: z.string().url().optional(),
    shortBio: z.string().trim().min(50).max(120),
    skills: z
      .array(
        z.object({
          group: z.string().trim().min(1),
          items: z
            .array(
              z.object({
                name: z.string().trim().min(1),
                level: z.enum(['精通', '熟练', '了解']).optional(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),
    experience: z
      .array(
        z.object({
          company: z.string().trim().min(1),
          role: z.string().trim().min(1),
          period: z.string().trim().min(1),
          summary: z.string().trim().min(1),
          highlights: z.array(z.string().trim().min(1)).default([]),
        }),
      )
      .default([]),
    education: z
      .array(
        z.object({
          school: z.string().trim().min(1),
          major: z.string().trim().min(1),
          period: z.string().trim().min(1),
          degree: z.string().trim().min(1).optional(),
        }),
      )
      .default([]),
    siteMeta: z.object({
      copyrightName: z.string().trim().min(1),
      siteDomain: z.string().trim().min(1).optional(),
      icp: z.string().trim().min(1).optional(),
      startedYear: z.number().int().min(1990).max(2100),
      careerStartYear: z.number().int().min(1990).max(2100).optional(),
    }),
  }),
});

export const collections = { article, project, profile };

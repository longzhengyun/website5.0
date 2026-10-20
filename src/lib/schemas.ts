import { z } from 'astro/zod';

export const linkSchema = z.object({
  title: z.string().trim().min(1),
  url: z
    .string()
    .url()
    .refine((value) => value.startsWith('https://'), '收藏链接必须使用 https'),
  description: z.string().trim().min(1).max(80),
  category: z.enum(['技术', '工具', '其他']),
  icon: z.string().trim().min(1).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
});

export const versionLogSchema = z.object({
  version: z.string().trim().min(1),
  date: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1).max(120),
  tech: z.array(z.string().trim().min(1)).default([]),
});

export const linksSchema = z.array(linkSchema);
export const versionLogsSchema = z.array(versionLogSchema);

export type LinkItem = z.infer<typeof linkSchema>;
export type VersionLog = z.infer<typeof versionLogSchema>;

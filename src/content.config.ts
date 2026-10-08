import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * notes — 수업 노트.
 * course 값은 src/data/courses.json 의 slug 와 일치해야 한다.
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    course: z.enum(['stat-learning', 'text-mining', 'social-media']),
    date: z.coerce.date(),
    summary: z.string().optional(),
    kind: z.string().default('복습노트'),
    scope: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, notes };

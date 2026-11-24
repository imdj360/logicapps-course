import { z } from 'astro/zod';

export const lessonSchema = z
  .object({
    title: z.string(),
    module: z.string(),
    order: z.number(),
    minutes: z.number(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    summary: z.string(),
    youWillLearn: z.array(z.string()).min(1),
    relatedArticles: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
    reviewStatus: z.enum(['draft', 'approved']).default('draft'),
    lastVerified: z.string().optional(),
  })
  .refine((d) => d.reviewStatus !== 'approved' || !!d.lastVerified, {
    message: 'approved lessons need lastVerified',
    path: ['lastVerified'],
  });

export type LessonFrontmatter = z.infer<typeof lessonSchema>;

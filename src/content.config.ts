import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { lessonSchema } from './lessons/schema';

const withFixtures = process.env.PUBLIC_INCLUDE_FIXTURES === '1';

const lessons = defineCollection({
  loader: glob({
    pattern: withFixtures ? '**/index.mdx' : ['**/index.mdx', '!_fixture/**'],
    base: './src/content/lessons',
    generateId: ({ entry }) => entry.split('/').at(-2)!,
  }),
  schema: lessonSchema,
});

export const collections = { lessons };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    type: z.enum(['workflow', 'tool', 'skill', 'resource']),
    categories: z.array(z.string()),
    description: z.string(),
    link: z.string().optional(),
  }),
});

export const collections = { docs };

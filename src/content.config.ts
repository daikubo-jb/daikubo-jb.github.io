import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const asset = (ext: RegExp) => z.string().regex(/^media\/[a-z0-9][a-z0-9/_-]*\.[a-z0-9]+$/).regex(ext);
const reports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    kind: z.enum(['report', 'trial']).default('report'),
    title: z.string(),
    description: z.string(),
    purpose: z.string().min(1),
    project: z.string(),
    tags: z.array(z.string()),
    source: z.url().refine(url => url.startsWith('https://'), 'Use a public HTTPS URL'),
    media: z.object({
      video: asset(/\.mp4$/),
      poster: asset(/\.(png|webp|jpg)$/),
      alt: z.string(),
      caption: z.string(),
      heading: z.string().min(1),
      source: z.url().refine(url => url.startsWith("https://")),
      sourceLabel: z.string().min(1),
      license: asset(/\.txt$/).optional(),
    }).optional(),
  }),
});
export const collections = { reports };

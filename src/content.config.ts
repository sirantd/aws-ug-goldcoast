import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Meetups, past and future. One file per event, named `YYYY-MM-DD-slug.md`.
 * `startsAt` must carry an explicit offset (+10:00 for Queensland) so the build
 * machine's timezone can never shift a listed time.
 */
const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    startsAt: z.coerce.date(),
    venue: z.string(),
    venueUrl: z.url().optional(),
    /** Per-event RSVP link. Falls back to the group's Meetup page. */
    rsvpUrl: z.url().optional(),
    /** One or two sentences shown on the event card. */
    blurb: z.string(),
    /** Recording, slides or recap for events that have already run. */
    recapUrl: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Short announcements shown in the News list, newest first. */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Optional link the headline points at. */
    url: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { events, news };

import { getCollection, type CollectionEntry } from 'astro:content';

import { site } from '../data/site';

export type Event = CollectionEntry<'events'>;
export type NewsItem = CollectionEntry<'news'>;

/**
 * An event stays "upcoming" until it ends, not until it starts — nobody wants
 * the meetup to vanish off the front page while they are still in the room.
 */
const EVENT_DURATION_MS = 2.5 * 60 * 60 * 1000;

const dateFormat = new Intl.DateTimeFormat('en-AU', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: site.timeZone,
});

const timeFormat = new Intl.DateTimeFormat('en-AU', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: site.timeZone,
});

const newsDateFormat = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  timeZone: site.timeZone,
});

/** "Thu 4 Sep" — always in Queensland time, whatever the build machine thinks. */
export const formatEventDate = (date: Date) => dateFormat.format(date);

/** "5:30 pm" */
export const formatEventTime = (date: Date) =>
  timeFormat.format(date).replace(/\s?(am|pm)/i, (m) => ` ${m.trim().toLowerCase()}`);

/** "28 Jul" */
export const formatNewsDate = (date: Date) => newsDateFormat.format(date);

/** ISO 8601 for `<time datetime>` and structured data. */
export const toIsoDate = (date: Date) => date.toISOString();

const isPublished = <T extends { data: { draft: boolean } }>(entry: T) =>
  import.meta.env.DEV || !entry.data.draft;

const byStartAscending = (a: Event, b: Event) =>
  a.data.startsAt.getTime() - b.data.startsAt.getTime();

/** Future (or in-progress) events, soonest first. */
export async function getUpcomingEvents(now = new Date()): Promise<Event[]> {
  const events = await getCollection('events', isPublished);
  return events
    .filter((event) => event.data.startsAt.getTime() + EVENT_DURATION_MS >= now.getTime())
    .sort(byStartAscending);
}

/** Events that have already run, most recent first. */
export async function getPastEvents(now = new Date()): Promise<Event[]> {
  const events = await getCollection('events', isPublished);
  return events
    .filter((event) => event.data.startsAt.getTime() + EVENT_DURATION_MS < now.getTime())
    .sort(byStartAscending)
    .reverse();
}

/** The event the hero banner points at, or null when nothing is scheduled. */
export async function getNextEvent(now = new Date()): Promise<Event | null> {
  const [next] = await getUpcomingEvents(now);
  return next ?? null;
}

/** Announcements, newest first. */
export async function getNews(limit?: number): Promise<NewsItem[]> {
  const news = await getCollection('news', isPublished);
  const sorted = news.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Per-event RSVP link when set, otherwise the group's Meetup page. */
export const rsvpLink = (event: Event) => event.data.rsvpUrl ?? site.rsvpUrl;

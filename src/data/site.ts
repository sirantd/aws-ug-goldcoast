/**
 * Single source of truth for site-wide constants.
 *
 * Anything an organiser is likely to change without touching a component lives
 * here or in the sibling JSON files.
 */

export const site = {
  /** Canonical origin. Used for sitemap, canonical tags and OG URLs. */
  url: 'https://aws-ug-goldcoast.com.au',
  name: 'AWS User Group Gold Coast',
  shortName: 'AWS UG Gold Coast',
  location: 'Gold Coast / Australia',
  tagline: 'Learn, build & connect. Free monthly meetups — all builders welcome.',
  description:
    'A free monthly AWS meetup on the Gold Coast for cloud engineers, developers, students and founders. Talks on serverless, data, AI and everything in between — beginner friendly, community run.',
  /** IANA zone every displayed date is rendered in, regardless of visitor locale. */
  timeZone: 'Australia/Brisbane',

  /**
   * Primary call to action, used by the nav and hero buttons and as the
   * fallback for any event without its own `rsvpUrl`. Luma is where the group
   * actually takes RSVPs; Meetup remains a channel in `channels.ts`.
   */
  rsvpUrl: 'https://luma.com/aws-ug-goldcoast',
  /** "Full calendar" link. Same destination as `rsvpUrl` today, but a separate
   * knob so the calendar can move without touching every RSVP button. */
  calendarUrl: 'https://luma.com/aws-ug-goldcoast',
  /** Where "Propose a talk" points — the group's Sessionize call for speakers. */
  proposeTalkUrl: 'https://sessionize.com/aws-user-group-gold-coast',
  /**
   * How to reach the organisers in writing, used by the Code of Conduct's
   * reporting section. The group has no mailbox, so this is the LinkedIn page.
   */
  contactUrl: 'https://www.linkedin.com/company/aws-gold-coast/',

  /**
   * Newsletter sign-up. Static hosting cannot process a form itself, so this
   * posts straight to a provider (Buttondown, Mailchimp, Kit, …).
   * Leave `actionUrl` empty to hide the whole newsletter section.
   */
  newsletter: {
    actionUrl: '',
    emailField: 'email',
  },
} as const;

export type Site = typeof site;

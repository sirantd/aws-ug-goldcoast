# Updating the site

Everything below is a text file in this repository. Edit, commit to `main`, and the
change is live a couple of minutes later.

## Add a meetup

Create `src/content/events/YYYY-MM-DD-slug.md`:

```markdown
---
title: Serverless on a Shoestring
startsAt: 2026-09-04T17:30:00+10:00
venue: Cohort, Southport
blurb: Lambda, API Gateway and DynamoDB patterns that keep the bill near zero.
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Wrap in quotes if it contains a `:` |
| `startsAt` | yes | **Always include the `+10:00` offset.** Queensland does not observe DST |
| `venue` | yes | Shown next to the pin icon |
| `venueUrl` | no | Makes the venue name a link |
| `rsvpUrl` | no | Per-event link; defaults to the group's Meetup page |
| `blurb` | yes | One or two sentences on the card |
| `recapUrl` | no | Recording or slides, shown once the event has passed |
| `draft` | no | `true` hides it from the built site |

Events move out of "Upcoming" automatically 2.5 hours after `startsAt` — no need to
delete anything after a meetup. Keep the file: it is the record of what the group has
run, and `recapUrl` turns it into a link to the recording.

The hero banner and the search-engine event listings both read from the soonest
upcoming event.

## Post an announcement

Create `src/content/news/YYYY-MM-DD-slug.md`. The body is Markdown:

```markdown
---
title: September RSVPs open
date: 2026-07-28
---
Serverless on a Shoestring is live on Meetup — seats capped at 60, grab yours early.
```

Add `url: https://…` to the frontmatter to make the headline a link. The six most
recent items are shown; the section disappears entirely when there are none.

## Organisers

Edit `src/data/organisers.ts`. Avatar initials are derived from the name; `url` is
optional and turns the name into a link.

```ts
{ name: 'Ada Lovelace', role: 'Co-organiser', url: 'https://linkedin.com/in/…' },
```

The cards sit in a two-column grid; an odd final card stretches across both columns, so
any number of organisers fills the row cleanly.

## Photos

Drop image files into `src/assets/gallery/`. The gallery section and its nav link only
appear once at least one photo exists.

- Ordering follows the filename, so prefix with `01-`, `02-`, … to control the layout.
- The first photo occupies the tall left-hand tile; five photos fill the grid exactly.
- Alt text comes from the filename: `03-live-demo-moment.jpg` → "Live demo moment".
  Rename the file to fix the caption.
- Commit the originals — Astro resizes and converts them to WebP at build time.

Get consent before publishing recognisable faces, and honour anyone who asked not to
be photographed on the night.

## Links, wording and the newsletter

`src/data/site.ts` holds the domain, tagline, the Meetup and Luma links, where "Propose a
talk" points (the group's Sessionize page), and `contactUrl` — how people reach the
organisers in writing. `src/data/channels.ts` holds the social links used in the link row
and footer.

The group has no mailbox, so `contactUrl` is the LinkedIn page. If a real address is set
up later, point it at a `mailto:` instead and reword the Code of Conduct link text.

The newsletter section is **hidden until it is configured**, because static hosting
cannot process a form submission itself. To turn it on, set the provider's form endpoint
in `src/data/site.ts`:

```ts
newsletter: {
  actionUrl: 'https://buttondown.com/api/emails/embed-subscribe/aws-ug-goldcoast',
  emailField: 'email',   // the field name that provider expects
},
```

Buttondown, Kit, Mailchimp and Listmonk all accept a plain form POST like this. Check
the provider's embed snippet for the field name — Mailchimp, for example, uses
`EMAIL` rather than `email`.

## Code of conduct

`src/pages/code-of-conduct.astro`. Adapted from the Contributor Covenant; reporting is to
an organiser in person, or through `site.contactUrl`.

/**
 * The volunteers who run the group.
 *
 * TODO(organisers): replace these placeholders from the design mock with the
 * real crew before launch — see docs/CONTENT.md.
 */

export interface Organiser {
  name: string;
  role: string;
  /** Optional link — LinkedIn, personal site, GitHub. */
  url?: string;
}

export const organisers: Organiser[] = [
  { name: 'Jordan Doe', role: 'Lead organiser' },
  { name: 'Alex Smith', role: 'Co-organiser' },
  { name: 'Priya K', role: 'Speaker wrangler' },
  { name: 'Marcus T', role: 'Sponsorships' },
];

/** "Jordan Doe" -> "JD". Handles single-word and hyphenated names. */
export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

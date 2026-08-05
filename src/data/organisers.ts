/** The volunteers who run the group. See docs/CONTENT.md. */

export interface Organiser {
  name: string;
  role: string;
  /** Optional link — LinkedIn, personal site, GitHub. */
  url?: string;
}

export const organisers: Organiser[] = [
  {
    name: 'Dmytro Sirant',
    role: 'Lead organiser',
    url: 'https://www.linkedin.com/in/dmytro-sirant/',
  },
  {
    name: 'Serhii Kaidalov',
    role: 'Co-organiser',
    url: 'https://www.linkedin.com/in/serhii-kaidalov/',
  },
  {
    name: 'Renato Meireles',
    role: 'Co-organiser',
    url: 'https://www.linkedin.com/in/rcmeireles/',
  },
];

/** "Dmytro Sirant" -> "DS". Handles single-word and hyphenated names. */
export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

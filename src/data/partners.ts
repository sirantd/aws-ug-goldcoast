/**
 * The groups we run alongside and the organisations that keep the meetups free.
 *
 * Array order is display order, within a group and between groups. See
 * docs/CONTENT.md.
 */

import assemblyLogo from '../assets/partners/assembly.png';
import cohortLogo from '../assets/partners/cohort.png';
import jetbrainsLogo from '../assets/partners/jetbrains.svg';
import perunLogo from '../assets/partners/perun.svg';

export interface Partner {
  name: string;
  url: string;
  /**
   * Supplied by the partner. Optional: a card without one falls back to its
   * name, which is shown either way. Never invent a wordmark for a brand.
   */
  logo?: ImageMetadata;
  /** Short label for the relationship — "Venue partner", "Sister user group". */
  role: string;
  /** One sentence on what they do for the group. */
  blurb: string;
}

export interface PartnerGroup {
  /** Heading above the row. */
  title: string;
  partners: Partner[];
}

export const partnerGroups: PartnerGroup[] = [
  {
    title: 'Friends',
    partners: [
      {
        name: 'AWS User Group Brisbane',
        url: 'https://luma.com/awsugbne',
        role: 'Sister user group',
        blurb:
          'The AWS community an hour up the M1. We share speakers, and their meetups are worth the drive.',
      },
    ],
  },
  {
    title: 'Partners & sponsors',
    partners: [
      {
        name: 'Cohort Innovative Space',
        url: 'https://cohortspace.com.au/',
        logo: cohortLogo,
        role: 'Venue partner',
        blurb: 'Hosts the meetups in their Southport space — the reason the group has a home.',
      },
      {
        name: 'Perun',
        url: 'https://perun.au',
        logo: perunLogo,
        role: 'AWS Partner',
        blurb: 'Cloud consultancy backing the group and sending engineers to speak.',
      },
      {
        name: 'Assembly',
        url: 'https://assembly.cloud',
        logo: assemblyLogo,
        role: 'AWS Partner',
        blurb: 'Cloud consultancy supporting the meetups and the people who present at them.',
      },
      {
        name: 'JetBrains',
        url: 'https://www.jetbrains.com/',
        logo: jetbrainsLogo,
        role: 'Tooling sponsor',
        blurb: 'Provides free IDE licences to members of the group.',
      },
    ],
  },
];

/** "https://cohortspace.com.au/" -> "cohortspace.com.au" — shown under the name. */
export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, '');
}

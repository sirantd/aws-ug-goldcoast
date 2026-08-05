/** Where the group lives online. Rendered in the link row and the footer. */

export interface Channel {
  name: string;
  /** Inline SVG path data, drawn on a 24x24 viewBox. */
  icon: string;
  url: string;
}

export const channels: Channel[] = [
  {
    name: 'Meetup',
    url: 'https://www.meetup.com/aws-user-group-gold-coast/',
    icon: 'M19.6 13.7a2.6 2.6 0 0 1-1.5 2.4 2.6 2.6 0 0 1-3.1 3.3 2.6 2.6 0 0 1-4.5.9 2.6 2.6 0 0 1-4-1.6 2.6 2.6 0 0 1-2.4-3.6 2.6 2.6 0 0 1 .3-4.4 2.6 2.6 0 0 1 2-3.8 2.6 2.6 0 0 1 4-2 2.6 2.6 0 0 1 4.3 1 2.6 2.6 0 0 1 3.3 2.5v.2a2.6 2.6 0 0 1 1.6 5.1Zm-4.3-3.4a1 1 0 0 0-1.4-.3l-3.2 2.2-1.5-1.3a1 1 0 1 0-1.3 1.5l2.1 1.9a1 1 0 0 0 1.2.1l3.8-2.7a1 1 0 0 0 .3-1.4Z',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/aws-user-group-gold-coast/',
    icon: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.77-2.07c4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z',
  },
  {
    name: 'Luma',
    url: 'https://lu.ma/aws-ug-goldcoast',
    icon: 'M12 2.5c.4 0 .75.24.9.6l1.86 4.48 4.83.4a.98.98 0 0 1 .56 1.72l-3.67 3.15 1.11 4.7a.98.98 0 0 1-1.46 1.06L12 16.11l-4.13 2.5a.98.98 0 0 1-1.46-1.06l1.11-4.7-3.67-3.15a.98.98 0 0 1 .56-1.72l4.83-.4L11.1 3.1c.15-.36.5-.6.9-.6Z',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@aws-ug-goldcoast',
    icon: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.02V8.98L15.2 12 10 15.02Z',
  },
];

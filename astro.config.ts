// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { site } from './src/data/site';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  // Emit `code-of-conduct.html` rather than `code-of-conduct/index.html`.
  // Paired with the CloudFront Function in infra/, this gives clean URLs on an
  // S3 origin without needing a rewrite for every directory.
  build: { format: 'file' },
  integrations: [sitemap()],
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
});

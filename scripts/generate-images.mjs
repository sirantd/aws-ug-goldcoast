#!/usr/bin/env node
/**
 * Regenerates the derived images in `public/` from the brand assets:
 *
 *   public/og.png              1200x630 social card
 *   public/apple-touch-icon.png 180x180 home-screen icon
 *
 * Run after changing the brand assets or the site tagline:
 *   npm run images
 *
 * These are committed so a normal build never depends on this script.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = (file) => path.join(root, 'src/assets/brand', file);
const out = (file) => path.join(root, 'public', file);

const CARD = { width: 1200, height: 630 };
const TEXT_X = 392;

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const card = ({ eyebrow, title, subtitle, tagline }) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#3a2a0d"/>
      <stop offset="65%" stop-color="#201708"/>
    </radialGradient>
  </defs>
  <rect width="${CARD.width}" height="${CARD.height}" fill="url(#glow)"/>
  <text x="${TEXT_X}" y="262" font-family="Helvetica,Arial" font-size="32" font-weight="700" letter-spacing="7" fill="#fcb137">${escape(eyebrow)}</text>
  <text x="${TEXT_X}" y="334" font-family="Helvetica,Arial" font-size="60" font-weight="300" fill="#f5ead1">${escape(title)}</text>
  <text x="${TEXT_X}" y="390" font-family="Helvetica,Arial" font-size="29" font-weight="600" fill="#fcb137">${escape(subtitle)}</text>
  <text x="${TEXT_X}" y="444" font-family="Helvetica,Arial" font-size="22" fill="rgba(245,234,209,0.7)">${escape(tagline)}</text>
</svg>`);

const badge = await sharp(brand('hex-badge.png')).resize({ height: 280 }).toBuffer();

const og = await sharp(
  card({
    eyebrow: 'AWS',
    title: 'User Group',
    subtitle: 'Gold Coast / Australia',
    tagline: 'Free monthly meetups — all builders welcome.',
  }),
)
  .composite([{ input: badge, top: 175, left: 120 }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(out('og.png'));

const icon = await sharp(brand('group-logo-400.png'))
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(out('apple-touch-icon.png'));

for (const [name, info] of [
  ['og.png', og],
  ['apple-touch-icon.png', icon],
]) {
  console.log(`${name.padEnd(22)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB`);
}

/**
 * Meetup photos are plain image files dropped into `src/assets/gallery/`.
 *
 * Ordering follows filename, so a `01-`, `02-` … prefix controls the layout.
 * Alt text is derived from the rest of the filename:
 * `01-crowd-at-southport.jpg` → "Crowd at southport". Rename the file to fix
 * the caption — see docs/CONTENT.md.
 */

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export interface GalleryPhoto {
  image: ImageMetadata;
  alt: string;
}

export const galleryPhotos: GalleryPhoto[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, module]) => ({
    image: module.default,
    alt: describe(path),
  }));

export const hasGallery = galleryPhotos.length > 0;

function describe(path: string): string {
  const filename = path.split('/').pop() ?? '';
  const words = filename
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_]/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  if (!words) return 'Photo from an AWS User Group Gold Coast meetup';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

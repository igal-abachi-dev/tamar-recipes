import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Build-time Sanity client for SSG.
 * useCdn: false — always hit the Content Lake so a publish-triggered
 * rebuild gets the freshest data (standard Sanity + Astro SSG pattern).
 */
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'demo0000',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-23',
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

/** Sanity image URL builder — always use this for resized/cropped/format-negotiated images */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export { sanityClient as client };

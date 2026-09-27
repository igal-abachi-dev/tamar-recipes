import { sanityClient } from './sanity';
import { categoriesQuery, recipesQuery, siteSettingsQuery } from './queries';
import { demoCategories, demoRecipes } from './demo';
import type { Category, Recipe, RecipeImage, SiteSettings } from '../types/content';
import { urlFor } from './sanity';
export { timeLabel, timeRangeLabel } from './time';

const hasSanity = Boolean(
  import.meta.env.PUBLIC_SANITY_PROJECT_ID &&
  import.meta.env.PUBLIC_SANITY_PROJECT_ID !== 'your-project-id',
);

export interface SiteContent {
  recipes: Recipe[];
  categories: Category[];
  settings: SiteSettings;
  isDemo: boolean;
}
let siteContentPromise: Promise<SiteContent> | undefined;

export function getSiteContent(): Promise<SiteContent> {
  if (!siteContentPromise) {
    siteContentPromise = loadSiteContent().catch((error: unknown) => {
      siteContentPromise = undefined;
      throw error;
    });
  }
  return siteContentPromise;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanity) return {};
  return (await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery)) || {};
}

async function loadSiteContent(): Promise<SiteContent> {
  if (!hasSanity)
    return { recipes: demoRecipes, categories: demoCategories, settings: {}, isDemo: true };
  const [recipes, categories, settings] = await Promise.all([
    sanityClient.fetch<Recipe[]>(recipesQuery),
    sanityClient.fetch<Category[]>(categoriesQuery),
    sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);
  return { recipes, categories, settings: settings || {}, isDemo: false };
}

export function imageSrc(
  image: RecipeImage | undefined,
  width = 900,
  height = 650,
): string | undefined {
  if (image?.localSrc) return image.localSrc;
  if (image?.asset)
    return urlFor(image).width(width).height(height).fit('crop').auto('format').url();
  return undefined;
}

export function totalMinutes(recipe: Recipe): number {
  return recipe.elapsedMinutes ?? 0;
}

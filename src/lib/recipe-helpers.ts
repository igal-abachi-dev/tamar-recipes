import type { IngredientGroup, OvenMode, PassoverStatus, Recipe, Step } from '../types/content';

export const ovenModeLabels: Record<OvenMode, string> = {
  conventional: 'עליון־תחתון',
  fan: 'טורבו / אוויר חם',
  gentleFan: 'טורבו עדין',
  grill: 'גריל',
  fanGrill: 'גריל עם מאוורר',
  bottom: 'חום תחתון',
  pizza: 'מצב פיצה',
};

export const burnerSizeLabels = {
  small: 'קטן',
  medium: 'בינוני',
  high: 'גדול / חזק',
  wok: 'ווק',
} as const;

export function flameSelectLabel(level: number): string {
  const heat =
    [
      '',
      'נמוכה מאוד',
      'נמוכה',
      'נמוכה',
      'בינונית־נמוכה',
      'בינונית',
      'בינונית',
      'בינונית־גבוהה',
      'גבוהה',
      'גבוהה',
    ][level] || 'לפי הצורך';
  return `אש ${heat} · Bosch FlameSelect ${level}/9`;
}

export function paragraphs(value: string | undefined): string[] {
  return (value || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function youtubeVideoId(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return undefined;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else if (/^\/(embed|shorts|live)\//.test(url.pathname)) id = url.pathname.split('/')[2];
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

export function passoverStatus(recipe: Recipe): PassoverStatus {
  return recipe.passoverStatus || 'none';
}

export function sortedTimeline(recipe: Recipe): NonNullable<Recipe['timeline']> {
  return [...(recipe.timeline || [])].sort(
    (a, b) => (b.minutesBeforeServing ?? -1) - (a.minutesBeforeServing ?? -1),
  );
}

export function allIngredientGroups(recipe: Recipe): IngredientGroup[] {
  return [
    ...(recipe.ingredientGroups || []),
    ...(recipe.components || []).flatMap((component) => component.ingredientGroups || []),
  ];
}

export interface RecipeStepWithComponent extends Step {
  componentTitle?: string;
  recipeUrl?: string;
  localNumber: number;
}

export function allRecipeSteps(recipe: Recipe): RecipeStepWithComponent[] {
  return [
    ...(recipe.steps || []).map((step, index) => ({ ...step, localNumber: index + 1 })),
    ...(recipe.components || []).flatMap((component) => [
      ...(component.recipeReference?.slug
        ? [
            {
              text: `מכינים לפי המתכון של ${component.recipeReference.title}.`,
              componentTitle: component.title,
              recipeUrl: `/recipes/${component.recipeReference.slug}`,
              localNumber: 0,
            },
          ]
        : []),
      ...(component.steps || []).map((step, index) => ({
        ...step,
        componentTitle: component.title,
        localNumber: index + 1,
      })),
    ]),
  ];
}

export function recipeVideos(recipe: Recipe): Array<{ title: string; id: string; url: string }> {
  const sources = [
    ...(recipe.videos || []).map((video) => ({
      title: video.title || 'סרטון הכנה',
      url: video.url,
    })),
  ];
  const used = new Set<string>();
  return sources.flatMap((source) => {
    const id = youtubeVideoId(source.url);
    if (!id || used.has(id)) return [];
    used.add(id);
    return [{ ...source, id }];
  });
}

export function temperatureRange(min?: number, max?: number): string | undefined {
  if (min === undefined) return undefined;
  return `${min}${max !== undefined && max > min ? `–${max}` : ''}°C`;
}

export function hasDetailedContent(recipe: Recipe): boolean {
  return Boolean(
    recipe.pitfalls?.length ||
    recipe.sources?.length ||
    allRecipeSteps(recipe).some((step) => step.why),
  );
}

import type { DietaryLabel, Recipe } from '../types/content';
import { passoverStatus } from './recipe-helpers';

export const difficultyLabels = { easy: 'קל', medium: 'בינוני', advanced: 'מתקדם' } as const;
export const kashrutLabels = { meat: 'בשרי', dairy: 'חלבי', pareve: 'פרווה' } as const;
export const dietaryLabels: Record<DietaryLabel, string> = {
  vegetarian: 'צמחוני',
  glutenFree: 'ללא גלוטן',
  lactoseFree: 'ללא לקטוז',
};

export function recipeBadges(recipe: Recipe): string[] {
  return [
    ...(recipe.kashrutType ? [kashrutLabels[recipe.kashrutType]] : []),
    ...(recipe.dietaryLabels || []).map((label) => dietaryLabels[label]),
    ...(passoverStatus(recipe) === 'all' ? ['כשר לפסח'] : []),
    ...(passoverStatus(recipe) === 'kitniyot' ? ['לפסח לאוכלי קטניות'] : []),
  ];
}

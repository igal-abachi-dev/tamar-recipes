import type { Ingredient, Recipe } from '../types/content';

export type UnitSystem = 'original' | 'metric' | 'us';
export type IngredientMeasure = Pick<
  Ingredient,
  'amount' | 'quantity' | 'unit' | 'grams' | 'milliliters'
>;

// US customary factors: https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures
// Tamar's household cup, tablespoon, and teaspoon use 240, 15, and 5 mL.
const GRAMS_PER_OUNCE = 28.349523125;
const ML_PER_US_CUP = 236.5882365;
const ML_PER_US_TABLESPOON = 14.7867648;
const ML_PER_US_TEASPOON = 4.92892159;

const massUnits: Record<string, number> = {
  גרם: 1,
  g: 1,
  'ק״ג': 1000,
  קג: 1000,
  kg: 1000,
  oz: GRAMS_PER_OUNCE,
  lb: 453.59237,
};
const volumeUnits: Record<string, number> = {
  'מ״ל': 1,
  מל: 1,
  ml: 1,
  ליטר: 1000,
  l: 1000,
  כפית: 5,
  כפיות: 5,
  tsp: ML_PER_US_TEASPOON,
  כף: 15,
  כפות: 15,
  tbsp: ML_PER_US_TABLESPOON,
  כוס: 240,
  כוסות: 240,
  cup: ML_PER_US_CUP,
  'fl oz': 29.5735296,
};

function numberLabel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Math.abs(rounded - 0.25) < 0.001) return '¼';
  if (Math.abs(rounded - 0.5) < 0.001) return '½';
  if (Math.abs(rounded - 0.75) < 0.001) return '¾';
  return new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(rounded);
}

function joinAmount(quantity: string, unit?: string): string {
  return quantity ? [quantity, unit].filter(Boolean).join(' ') : '';
}

function metricMass(grams: number): string {
  return grams >= 1000
    ? joinAmount(numberLabel(grams / 1000), 'ק״ג')
    : joinAmount(numberLabel(grams), 'גרם');
}

function metricVolume(ml: number): string {
  return ml >= 1000
    ? joinAmount(numberLabel(ml / 1000), 'ליטר')
    : joinAmount(numberLabel(ml), 'מ״ל');
}

function usMass(grams: number): string {
  const ounces = grams / GRAMS_PER_OUNCE;
  return ounces >= 16
    ? joinAmount(numberLabel(ounces / 16), 'lb')
    : joinAmount(numberLabel(ounces), 'oz');
}

function usVolume(ml: number): string {
  if (ml >= ML_PER_US_CUP / 4) return joinAmount(numberLabel(ml / ML_PER_US_CUP), 'US cup');
  if (ml >= ML_PER_US_TABLESPOON) return joinAmount(numberLabel(ml / ML_PER_US_TABLESPOON), 'tbsp');
  return joinAmount(numberLabel(ml / ML_PER_US_TEASPOON), 'tsp');
}

export function formatMeasure(
  item: IngredientMeasure,
  scale = 1,
  system: UnitSystem = 'original',
  gramsFirst = false,
): { primary: string; secondary?: string; scalable: boolean } {
  const scalable =
    item.quantity !== undefined || item.grams !== undefined || item.milliliters !== undefined;
  const quantity = item.quantity !== undefined ? item.quantity * scale : undefined;
  const home =
    quantity === undefined && scale !== 1 && scalable
      ? ''
      : joinAmount(
          quantity !== undefined && scale !== 1
            ? numberLabel(quantity)
            : item.amount || (quantity === undefined ? '' : numberLabel(quantity)),
          item.unit,
        );
  const unit = item.unit?.trim().toLowerCase() || '';
  const grams =
    item.grams !== undefined
      ? item.grams * scale
      : quantity !== undefined && massUnits[unit]
        ? quantity * massUnits[unit]
        : undefined;
  const ml =
    item.milliliters !== undefined
      ? item.milliliters * scale
      : quantity !== undefined && volumeUnits[unit]
        ? quantity * volumeUnits[unit]
        : undefined;

  if (system === 'us') {
    const converted =
      grams !== undefined ? usMass(grams) : ml !== undefined ? usVolume(ml) : undefined;
    return {
      primary: converted || home,
      secondary: converted && home && converted !== home ? home : undefined,
      scalable,
    };
  }
  if (system === 'metric') {
    const converted =
      grams !== undefined ? metricMass(grams) : ml !== undefined ? metricVolume(ml) : undefined;
    return {
      primary: converted || home,
      secondary: converted && home && converted !== home ? home : undefined,
      scalable,
    };
  }
  if (gramsFirst && grams !== undefined) {
    const primary = metricMass(grams);
    return { primary, secondary: home && home !== primary ? home : undefined, scalable };
  }
  const primary =
    home || (grams !== undefined ? metricMass(grams) : ml !== undefined ? metricVolume(ml) : '');
  const secondary =
    item.grams !== undefined && home
      ? metricMass(grams!)
      : item.milliliters !== undefined && home
        ? metricVolume(ml!)
        : undefined;
  return {
    primary,
    secondary: secondary && secondary !== primary ? secondary : undefined,
    scalable,
  };
}

export function ingredientMeasures(
  recipe: Recipe,
): Array<{ id: string; measure: IngredientMeasure }> {
  const entries: Array<{ id: string; measure: IngredientMeasure }> = [];
  const collect = (groups: Recipe['ingredientGroups'], prefix: string) => {
    (groups || []).forEach((group, groupIndex) =>
      (group.items || []).forEach((item, itemIndex) => {
        entries.push({
          id: `${prefix}-${groupIndex}-${itemIndex}`,
          measure: {
            amount: item.amount,
            quantity: item.quantity,
            unit: item.unit,
            grams: item.grams,
            milliliters: item.milliliters,
          },
        });
      }),
    );
  };
  collect(recipe.ingredientGroups, 'flat');
  (recipe.components || []).forEach((component, index) =>
    collect(component.ingredientGroups, `component-${index}`),
  );
  return entries;
}

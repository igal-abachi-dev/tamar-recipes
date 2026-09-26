import assert from 'node:assert/strict';
import { build } from 'esbuild';

async function loadTypescript(entryPoint) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].contents).toString('base64')}`
  );
}

const { formatMeasure, ingredientMeasures } = await loadTypescript('src/lib/measure.ts');
const { timeLabel } = await loadTypescript('src/lib/time.ts');
const { allRecipeSteps, sortedTimeline } = await loadTypescript('src/lib/recipe-helpers.ts');

assert.equal(formatMeasure({ amount: '½', quantity: 0.5, unit: 'כוס' }, 2).primary, '1 כוס');
assert.equal(
  formatMeasure({ amount: '½', quantity: 0.5, unit: 'כוס' }, 1, 'metric').primary,
  '120 מ״ל',
);
assert.match(
  formatMeasure({ amount: '1', quantity: 1, unit: 'ק״ג' }, 1, 'us').primary,
  /^2\.2 lb$/,
);
assert.equal(formatMeasure({ amount: 'לפי הטעם' }, 2, 'us').primary, 'לפי הטעם');
assert.equal(formatMeasure({ quantity: 1, unit: 'כוס' }, 1, 'metric').primary, '240 מ״ל');
assert.equal(
  formatMeasure({ quantity: 1, unit: 'כוס' }, 1, 'metric').primary.includes('גרם'),
  false,
);

assert.equal(timeLabel(2880), 'יומיים');
assert.equal(timeLabel(1500), 'יום ושעה');
assert.equal(timeLabel(90), 'שעה ו־30 דקות');

const recipe = {
  ingredientGroups: [{ items: [{ name: 'מלח', quantity: 1 }] }],
  steps: [{ text: 'מכינים' }],
  components: [
    {
      title: 'רוטב',
      ingredientGroups: [{ items: [{ name: 'שמן', quantity: 2 }] }],
      steps: [{ text: 'מערבבים' }, { text: 'מבשלים' }],
    },
  ],
  timeline: [
    { label: '45 דקות לפני', minutesBeforeServing: 45, tasks: ['מבשלים'] },
    { label: 'יום לפני', minutesBeforeServing: 1440, tasks: ['מכינים'] },
  ],
};
assert.deepEqual(
  ingredientMeasures(recipe).map((item) => item.id),
  ['flat-0-0', 'component-0-0-0'],
);
assert.deepEqual(
  allRecipeSteps(recipe).map((step) => step.localNumber),
  [1, 1, 2],
);
assert.deepEqual(
  sortedTimeline(recipe).map((item) => item.label),
  ['יום לפני', '45 דקות לפני'],
);

console.log('Recipe measurement, numbering, and timeline checks passed');

import type { APIRoute } from 'astro';
import { getSiteContent } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const { recipes, categories, isDemo } = await getSiteContent();
  const lines = [
    '# אתר המתכונים של תמר',
    '',
    '> מתכונים כשרים בעברית, עם מצרכים, הוראות הכנה, זמנים וסיפורים מן המטבח של תמר.',
    '',
    isDemo ? 'זהו אתר הדגמה בלבד; המתכונים והתמונות אינם התוכן הסופי של תמר.' : '',
    'המתכונים המלאים זמינים כעמודי HTML סטטיים וכוללים Recipe JSON-LD.',
    '',
    '## דפים מרכזיים',
    `- [כל המתכונים](${new URL('/recipes', site).href})`,
    `- [קטגוריות](${new URL('/categories', site).href})`,
    `- [על תמר](${new URL('/about', site).href})`,
    '',
    '## קטגוריות',
    ...categories.map(
      (category) =>
        `- [${category.title}](${new URL(`/categories/${category.slug}`, site).href})${category.description ? ` — ${category.description}` : ''}`,
    ),
    '',
    '## מתכונים',
    ...recipes.map(
      (recipe) =>
        `- [${recipe.title}](${new URL(`/recipes/${recipe.slug}`, site).href}) — ${recipe.description}`,
    ),
    '',
  ];
  return new Response(lines.filter((line) => line !== undefined).join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

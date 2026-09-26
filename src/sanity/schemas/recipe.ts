import { defineField, defineType } from 'sanity';
import { slugify } from '../slugify';
import { ovenModes } from './recipe-parts';

export default defineType({
  name: 'recipe',
  title: 'מתכון',
  type: 'document',
  groups: [
    { name: 'basics', title: 'פרטים' },
    { name: 'method', title: 'מצרכים והכנה' },
    { name: 'media', title: 'תמונות ווידאו' },
    { name: 'advanced', title: 'דיוק וטכניקה' },
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value) return true;
      const fields = value as Record<string, unknown>;
      const hasFlat =
        Array.isArray(fields.ingredientGroups) &&
        fields.ingredientGroups.length > 0 &&
        Array.isArray(fields.steps) &&
        fields.steps.length > 0;
      const hasComponents = Array.isArray(fields.components) && fields.components.length > 0;
      if (!hasFlat && !hasComponents) return 'יש למלא מצרכים ושלבים או להוסיף רכיבים למתכון';
      if (Array.isArray(fields.components)) {
        for (const entry of fields.components) {
          const component = entry as Record<string, unknown>;
          if (
            !component.recipeReference &&
            !(Array.isArray(component.steps) && component.steps.length > 0)
          ) {
            return 'לכל רכיב צריך שלבי הכנה או קישור למתכון בסיסי';
          }
        }
      }
      for (const [minimum, maximum] of [
        ['activeMinutes', 'activeMinutesMax'],
        ['elapsedMinutes', 'elapsedMinutesMax'],
      ] as const) {
        const low = fields[minimum];
        const high = fields[maximum];
        if (typeof high === 'number' && typeof low === 'number' && high < low)
          return 'טווח הזמנים אינו תקין';
      }
      return true;
    }),
  fields: [
    defineField({
      name: 'title',
      title: 'שם המתכון',
      type: 'string',
      group: 'basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'כתובת באנגלית',
      type: 'slug',
      group: 'basics',
      options: {
        source: 'title',
        maxLength: 96,
        slugify,
      },
      description: 'יש להזין כתובת קצרה באותיות לטיניות אם השם בעברית',
      validation: (Rule) =>
        Rule.required().custom(
          (value) =>
            !value?.current ||
            /^[a-z0-9-]+$/.test(value.current) ||
            'הכתובת חייבת להכיל רק אותיות לטיניות קטנות, מספרים ומקפים',
        ),
    }),
    defineField({
      name: 'description',
      title: 'פתיח קצר',
      type: 'text',
      rows: 3,
      group: 'basics',
      validation: (Rule) => Rule.required().max(320),
    }),
    defineField({
      name: 'category',
      title: 'קטגוריה',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'תגיות',
      type: 'array',
      of: [
        {
          type: 'string',
          options: { list: ['שבת', 'חגים', 'מהיר', 'אירוח', 'אפייה', 'ארוחה משפחתית'] },
        },
      ],
      group: 'basics',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'featured',
      title: 'להציג במומלצים',
      type: 'boolean',
      initialValue: false,
      group: 'basics',
    }),
    defineField({
      name: 'prepMinutes',
      title: 'זמן הכנה בדקות (רשות)',
      type: 'number',
      group: 'basics',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'cookMinutes',
      title: 'זמן בישול בדקות (רשות)',
      type: 'number',
      group: 'basics',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'servings',
      title: 'מספר מנות',
      type: 'number',
      group: 'basics',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'difficulty',
      title: 'רמת קושי',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'קל', value: 'easy' },
          { title: 'בינוני', value: 'medium' },
          { title: 'מתקדם', value: 'advanced' },
        ],
      },
      initialValue: 'easy',
    }),
    defineField({
      name: 'kashrutType',
      title: 'סיווג כשרות',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'בשרי', value: 'meat' },
          { title: 'חלבי', value: 'dairy' },
          { title: 'פרווה', value: 'pareve' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dietaryLabels',
      title: 'התאמות תזונתיות',
      description: 'יש לסמן רק אחרי בדיקת כל המצרכים ואפשרויות הזיהום הצולב',
      type: 'array',
      group: 'basics',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'צמחוני', value: 'vegetarian' },
              { title: 'ללא גלוטן', value: 'glutenFree' },
              { title: 'ללא לקטוז', value: 'lactoseFree' },
            ],
          },
        },
      ],
      validation: (Rule) =>
        Rule.unique().custom((value, context) => {
          if (context.document?.kashrutType === 'meat' && value?.includes('vegetarian')) {
            return 'מתכון בשרי לא יכול להיות מסומן כצמחוני';
          }
          return true;
        }),
    }),
    defineField({
      name: 'passoverStatus',
      title: 'התאמה לפסח',
      type: 'string',
      group: 'basics',
      initialValue: 'none',
      options: {
        list: [
          { title: 'לא מסומן לפסח', value: 'none' },
          { title: 'כשר לפסח', value: 'all' },
          { title: 'לאוכלי קטניות בלבד', value: 'kitniyot' },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'יש לבדוק את המצרכים, ההכנה ומנהג המשפחה לפני סימון',
    }),
    defineField({
      name: 'passoverNote',
      title: 'הערה לפסח',
      type: 'text',
      rows: 2,
      group: 'advanced',
    }),
    defineField({
      name: 'restMinutes',
      title: 'זמן מנוחה / התפחה מינימלי בדקות',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'activeMinutes',
      title: 'זמן עבודה פעיל בדקות',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'activeMinutesMax',
      title: 'זמן עבודה פעיל מקסימלי',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'elapsedMinutes',
      title: 'זמן כולל עד ההגשה בדקות',
      type: 'number',
      group: 'advanced',
      description: 'כולל המתנות ועבודה במקביל; למשל 4320 = 3 ימים',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'elapsedMinutesMax',
      title: 'זמן כולל מקסימלי',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'yieldText',
      title: 'תפוקה מדויקת (למשל: 2 חלות)',
      type: 'string',
      group: 'advanced',
    }),
    defineField({
      name: 'yieldCount',
      title: 'מספר יחידות בתפוקה',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'yieldUnit',
      title: 'יחידת תפוקה, למשל עוגיות',
      type: 'string',
      group: 'advanced',
    }),
    defineField({ name: 'panSize', title: 'גודל תבנית / מחבת', type: 'string', group: 'advanced' }),
    defineField({
      name: 'gramsFirst',
      title: 'להציג גרמים לפני מידות ביתיות',
      type: 'boolean',
      group: 'advanced',
      description: 'באפייה זו ברירת המחדל; אפשר לשנות כאן.',
    }),
    defineField({
      name: 'equipmentItems',
      title: 'ציוד חובה ואפשרות',
      type: 'array',
      of: [{ type: 'recipeEquipment' }],
      group: 'advanced',
    }),
    defineField({
      name: 'ovenTemperatureC',
      title: 'טמפרטורת תנור ב־°C',
      type: 'number',
      group: 'advanced',
    }),
    defineField({
      name: 'ovenMode',
      title: 'מצב תנור',
      type: 'string',
      options: { list: ovenModes },
      group: 'advanced',
    }),
    defineField({
      name: 'ovenTimerMinutes',
      title: 'זמן לכיוון טיימר התנור בדקות',
      type: 'number',
      group: 'advanced',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'doneness',
      title: 'דרגות עשייה ויעדי בטיחות',
      type: 'array',
      of: [{ type: 'recipeDoneness' }],
      group: 'advanced',
    }),
    defineField({
      name: 'keyRules',
      title: 'עד שלושה דברים שחשוב לדעת מראש',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'method',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'pitfalls',
      title: 'טעויות שכדאי להימנע מהן',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'advanced',
    }),
    defineField({
      name: 'lessonsLearned',
      title: 'מה למדתי כשהכנתי',
      type: 'text',
      rows: 3,
      group: 'advanced',
    }),
    defineField({
      name: 'kosherAdaptation',
      title: 'התאמות למטבח כשר',
      type: 'text',
      rows: 3,
      group: 'advanced',
    }),
    defineField({
      name: 'originStory',
      title: 'הסיפור של המתכון',
      type: 'text',
      rows: 4,
      group: 'advanced',
    }),
    defineField({
      name: 'makeAhead',
      title: 'הכנה מראש',
      type: 'text',
      rows: 2,
      group: 'advanced',
    }),
    defineField({
      name: 'substitutions',
      title: 'תחליפים אפשריים',
      type: 'text',
      rows: 2,
      group: 'advanced',
    }),
    defineField({
      name: 'storageDetails',
      title: 'מקרר, מקפיא וחימום',
      type: 'recipeStorage',
      group: 'advanced',
    }),
    defineField({
      name: 'servedWithText',
      title: 'מה מגישים לצד המנה',
      type: 'text',
      rows: 2,
      group: 'advanced',
    }),
    defineField({
      name: 'servedWith',
      title: 'מתכונים להגשה לצד המנה',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'recipe' }] }],
      group: 'advanced',
    }),
    defineField({
      name: 'sources',
      title: 'מקורות והשראה',
      type: 'array',
      of: [{ type: 'recipeSource' }],
      group: 'advanced',
    }),
    defineField({
      name: 'publishedAt',
      title: 'תאריך פרסום',
      type: 'datetime',
      group: 'basics',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'image',
      title: 'תמונה ראשית',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'תיאור תמונה',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videos',
      title: 'סרטוני YouTube',
      type: 'array',
      of: [{ type: 'recipeVideo' }],
      group: 'media',
    }),
    defineField({
      name: 'video',
      title: 'וידאו Mux (אופציונלי)',
      type: 'mux.video',
      group: 'media',
    }),
    defineField({
      name: 'ingredientGroups',
      title: 'מצרכים למתכון פשוט',
      type: 'array',
      of: [{ type: 'recipeIngredientGroup' }],
      group: 'method',
    }),
    defineField({
      name: 'steps',
      title: 'שלבים למתכון פשוט',
      type: 'array',
      of: [{ type: 'recipeStep' }],
      group: 'method',
    }),
    defineField({
      name: 'components',
      title: 'רכיבים עם מצרכים ושלבים נפרדים',
      type: 'array',
      of: [{ type: 'recipeComponent' }],
      group: 'method',
      description: 'למתכון מורכב: בצק, מילוי, רוטב וכדומה. במתכון פשוט אין צורך.',
    }),
    defineField({
      name: 'timeline',
      title: 'ציר זמן להכנה מראש',
      type: 'array',
      of: [{ type: 'recipeTimelineItem' }],
      group: 'method',
    }),
    defineField({
      name: 'variations',
      title: 'גרסאות ושינויים',
      type: 'array',
      of: [{ type: 'recipeVariation' }],
      group: 'method',
    }),
    defineField({
      name: 'tips',
      title: 'הטיפים של תמר',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'method',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'category.title', media: 'image' } },
  orderings: [
    { title: 'החדשים ביותר', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});

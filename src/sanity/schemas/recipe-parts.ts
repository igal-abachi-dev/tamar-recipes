import { defineField, defineType } from 'sanity';
import { youtubeVideoId } from '../../lib/recipe-helpers';

const ovenModes = [
  { title: 'עליון־תחתון', value: 'conventional' },
  { title: 'טורבו / אוויר חם', value: 'fan' },
  { title: 'טורבו עדין / אפייה חסכונית', value: 'gentleFan' },
  { title: 'גריל', value: 'grill' },
  { title: 'גריל עם מאוורר', value: 'fanGrill' },
  { title: 'חום תחתון', value: 'bottom' },
  { title: 'מצב פיצה', value: 'pizza' },
];

export const recipePartTypes = [
  defineType({
    name: 'recipeIngredient',
    title: 'מצרך',
    type: 'object',
    fields: [
      defineField({ name: 'amount', title: 'כמות כפי שכותבים במתכון', type: 'string' }),
      defineField({
        name: 'quantity',
        title: 'כמות מספרית לשינוי מנות',
        type: 'number',
        description: 'למשל 0.5 עבור חצי כוס. בלי מספר, הכמות נשארת כפי שנכתבה.',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'grams',
        title: 'משקל שקול בגרמים',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'milliliters',
        title: 'נפח שקול במ״ל',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({ name: 'unit', title: 'יחידה', type: 'string' }),
      defineField({
        name: 'name',
        title: 'שם המצרך',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'prepNote', title: 'מצב המצרך, למשל קצוץ דק', type: 'string' }),
      defineField({ name: 'splitNote', title: 'חלוקת הכמות בין השלבים', type: 'string' }),
      defineField({ name: 'note', title: 'הערה, מותג או אזהרה', type: 'string' }),
    ],
    preview: { select: { title: 'name', subtitle: 'amount' } },
  }),
  defineType({
    name: 'recipeIngredientGroup',
    title: 'קבוצת מצרכים',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'כותרת הקבוצה', type: 'string' }),
      defineField({
        name: 'items',
        title: 'מצרכים',
        type: 'array',
        of: [{ type: 'recipeIngredient' }],
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
    preview: { select: { title: 'title' } },
  }),
  defineType({
    name: 'recipeStep',
    title: 'שלב',
    type: 'object',
    fields: [
      defineField({
        name: 'text',
        title: 'הוראה',
        type: 'text',
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'stage', title: 'שלב / רכיב', type: 'string' }),
      defineField({
        name: 'durationMinutes',
        title: 'משך מינימלי בדקות',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'durationMinutesMax',
        title: 'משך מקסימלי בדקות',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({ name: 'temperatureC', title: 'טמפרטורה ב־°C', type: 'number' }),
      defineField({
        name: 'ovenMode',
        title: 'מצב תנור',
        type: 'string',
        options: { list: ovenModes },
      }),
      defineField({
        name: 'ovenTimerMinutes',
        title: 'זמן לכיוון טיימר התנור בדקות',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'flameSelectLevel',
        title: 'Bosch FlameSelect, רמה 1–9',
        type: 'number',
        description:
          'נקודות ייחוס: 3 אש נמוכה, 6 בינונית, 9 גבוהה. בוחרים רמה מדויקת לפי הבדיקה במטבח.',
        validation: (Rule) => Rule.integer().min(1).max(9),
      }),
      defineField({
        name: 'burnerSize',
        title: 'גודל המבער',
        type: 'string',
        options: {
          list: [
            { title: 'קטן', value: 'small' },
            { title: 'בינוני', value: 'medium' },
            { title: 'גדול / חזק', value: 'high' },
            { title: 'ווק', value: 'wok' },
          ],
        },
      }),
      defineField({ name: 'cue', title: 'איך יודעים שמוכן?', type: 'string' }),
      defineField({ name: 'why', title: 'למה עושים כך?', type: 'text', rows: 2 }),
      defineField({
        name: 'image',
        title: 'תמונת שלב',
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'תיאור תמונה', type: 'string' })],
      }),
    ],
    preview: { select: { title: 'text', media: 'image' } },
  }),
  defineType({
    name: 'recipeComponent',
    title: 'רכיב במתכון',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        title: 'שם הרכיב',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'intro', title: 'פתיח קצר', type: 'text', rows: 2 }),
      defineField({
        name: 'recipeReference',
        title: 'מתכון בסיסי קיים (במקום העתקה)',
        type: 'reference',
        to: [{ type: 'recipe' }],
      }),
      defineField({
        name: 'ingredientGroups',
        title: 'מצרכים לרכיב',
        type: 'array',
        of: [{ type: 'recipeIngredientGroup' }],
      }),
      defineField({
        name: 'steps',
        title: 'שלבים לרכיב',
        type: 'array',
        of: [{ type: 'recipeStep' }],
      }),
    ],
    preview: { select: { title: 'title', subtitle: 'recipeReference.title' } },
  }),
  defineType({
    name: 'recipeVariation',
    title: 'גרסה או שינוי',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        title: 'שם הגרסה',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'whenToUse', title: 'מתי לבחור בה', type: 'string' }),
      defineField({
        name: 'changes',
        title: 'מה משתנה',
        type: 'text',
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'linkedRecipe',
        title: 'מתכון נפרד לגרסה מלאה',
        type: 'reference',
        to: [{ type: 'recipe' }],
      }),
    ],
  }),
  defineType({
    name: 'recipeTimelineItem',
    title: 'משימה בציר הזמן',
    type: 'object',
    fields: [
      defineField({
        name: 'label',
        title: 'מתי, למשל יום לפני',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'minutesBeforeServing',
        title: 'דקות לפני ההגשה (למחשבון)',
        type: 'number',
        description: 'למשל 2880 = יומיים; להשאיר ריק אם אין זמן מדויק',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'tasks',
        title: 'מה עושים',
        type: 'array',
        of: [{ type: 'string' }],
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
  }),
  defineType({
    name: 'recipeDoneness',
    title: 'דרגת עשייה',
    type: 'object',
    fields: [
      defineField({
        name: 'level',
        title: 'שם דרגת העשייה',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'takeOutMinC', title: 'טמפרטורת הוצאה מינימלית °C', type: 'number' }),
      defineField({ name: 'takeOutMaxC', title: 'טמפרטורת הוצאה מקסימלית °C', type: 'number' }),
      defineField({ name: 'finalMinC', title: 'טמפרטורה סופית מינימלית °C', type: 'number' }),
      defineField({ name: 'finalMaxC', title: 'טמפרטורה סופית מקסימלית °C', type: 'number' }),
      defineField({
        name: 'isSafetyTarget',
        title: 'שורת יעד בטיחות שנבדקה',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({ name: 'note', title: 'הסבר ואזהרת בטיחות אם צריך', type: 'text', rows: 2 }),
    ],
  }),
  defineType({
    name: 'recipeEquipment',
    title: 'ציוד',
    type: 'object',
    fields: [
      defineField({
        name: 'name',
        title: 'שם הציוד',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: 'required', title: 'חובה', type: 'boolean', initialValue: true }),
    ],
  }),
  defineType({
    name: 'recipeSource',
    title: 'מקור או השראה',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        title: 'כותרת',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'url',
        title: 'קישור',
        type: 'url',
        validation: (Rule) => Rule.uri({ scheme: ['https'] }),
      }),
    ],
  }),
  defineType({
    name: 'recipeVideo',
    title: 'סרטון YouTube',
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'כותרת הסרטון', type: 'string' }),
      defineField({
        name: 'url',
        title: 'קישור לסרטון',
        type: 'url',
        validation: (Rule) =>
          Rule.required()
            .uri({ scheme: ['https'] })
            .custom(
              (value) =>
                !value || Boolean(youtubeVideoId(value)) || 'יש להזין קישור תקין לסרטון YouTube',
            ),
      }),
    ],
  }),
  defineType({
    name: 'recipeStorage',
    title: 'שמירה וחימום',
    type: 'object',
    fields: [
      defineField({ name: 'fridge', title: 'במקרר', type: 'text', rows: 2 }),
      defineField({ name: 'freezer', title: 'במקפיא', type: 'text', rows: 2 }),
      defineField({ name: 'reheat', title: 'חימום חוזר / הגשה', type: 'text', rows: 2 }),
    ],
  }),
];

export { ovenModes };

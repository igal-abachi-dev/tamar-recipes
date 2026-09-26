import { defineField, defineType } from 'sanity';
import { slugify } from '../slugify';

export default defineType({
  name: 'category',
  title: 'קטגוריה',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'שם',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'כתובת',
      type: 'slug',
      options: {
        source: 'title',
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
    defineField({ name: 'description', title: 'תיאור קצר', type: 'text', rows: 3 }),
    defineField({
      name: 'image',
      title: 'תמונה',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'תיאור תמונה', type: 'string' })],
    }),
    defineField({ name: 'order', title: 'סדר תצוגה', type: 'number', initialValue: 10 }),
  ],
});

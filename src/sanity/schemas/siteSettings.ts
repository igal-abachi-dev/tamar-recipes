import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'פרטי האתר',
  type: 'document',
  fields: [
    defineField({
      name: 'homeHeadline',
      title: 'כותרת עמוד הבית',
      type: 'string',
      description:
        'המילה האחרונה תודגש בצבע. לבחירת מילה אחרת, הקיפו אותה בכוכביות, למשל: האוכל מתחיל *בבית.*',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'homeIntro',
      title: 'פתיח עמוד הבית',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'שורת תיאור קצרה',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'footerText', title: 'טקסט בתחתית האתר', type: 'text', rows: 3 }),
    defineField({ name: 'aboutLead', title: 'פתיח על תמר', type: 'text', rows: 3 }),
    defineField({
      name: 'aboutBody',
      title: 'הסיפור של תמר',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'portrait',
      title: 'תמונה של תמר',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'תיאור תמונה',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'פרטי האתר' }) },
});

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { muxInput } from 'sanity-plugin-mux-input';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'tamar-recipes',
  title: 'אתר המתכונים של תמר',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('תוכן האתר')
          .items([
            S.listItem()
              .title('פרטי האתר')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSettings'),
          ]),
    }),
    muxInput(),
    presentationTool({
      title: 'תצוגה מקדימה',
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321',
        previewMode: { enable: '/api/preview/enable' },
      },
      resolve: {
        locations: {
          recipe: defineLocations({
            select: { id: '_id', title: 'title' },
            resolve: (doc) => ({
              locations: doc?.id
                ? [
                    {
                      title: doc.title || 'מתכון ללא שם',
                      href: `/preview/${encodeURIComponent(doc.id.replace(/^drafts\./, ''))}`,
                    },
                  ]
                : [],
            }),
          }),
        },
      },
    }),
  ],
  document: {
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteSettings'),
  },
  schema: { types: schemaTypes },
});

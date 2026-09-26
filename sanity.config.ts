import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
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
  ],
  document: {
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteSettings'),
  },
  schema: { types: schemaTypes },
});

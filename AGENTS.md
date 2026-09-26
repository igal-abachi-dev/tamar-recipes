## Development

This is a Hebrew-first, right-to-left static recipe site. The public site uses Astro for routes, layouts, build-time data loading, SEO and static generation; Svelte 5 supplies reusable UI. Sanity Studio is deployed separately on Sanity's hosting. Do not add a public `/studio` or `/admin` route to Astro.

Keep recipe and category pages server-rendered as static HTML. Hydrate only small controls that need browser state, such as search and kitchen tools. Never pass full recipe documents to a client island; use slim view models. Keep the public page usable without JavaScript wherever practical.

Keep route-level Svelte views in `src/components/pages`, reusable visual pieces in `src/components/ui`, and interactive browser-only controls in `src/components/islands`. Recipe instructions, ingredients, links, sources, and timeline text must remain in static HTML for readers and crawlers. The cooking island receives only the step fields it needs.

Use the CSS tokens in `src/styles/global.css`. Format source with `pnpm format`, then verify with `pnpm check` and `pnpm build`. Demo recipes are placeholders and must stay noindexed until Tamar supplies reviewed content. Content changes in Sanity need a hosting deploy hook because the site is statically generated.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

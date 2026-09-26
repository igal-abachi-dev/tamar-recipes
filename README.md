# אתר המתכונים של תמר

**Tamar Recipes** is a Hebrew-first, right-to-left recipe site built with Astro 7, Svelte 5, and Sanity. It is designed for Tamar to publish her own tested recipes and for readers to use them while cooking: clear ingredients and steps, practical timing, and optional kitchen tools.

> **Project status:** The site and editor schemas are implemented. Without a Sanity project ID, the repository builds with clearly labeled sample recipes. Those pages are `noindex`, and `robots.txt` disallows crawling. A public launch still needs Tamar-approved recipes and photos, a Sanity project, a final domain, and a publish-to-rebuild webhook.

## What is included

- **Recipe discovery:** category pages, a searchable archive, and filters for vegetarian, gluten-free, lactose-free, and Passover recipes. Search includes ingredient names and supports Hebrew substring matching.
- **Cookable recipe pages:** grouped ingredients, component recipes, numbered steps, a short/full reading view, related recipes, print styles, and lazy YouTube embeds. Mux is available as an optional video source.
- **Kitchen tools:** serving scaling, original/metric/US customary measures, multiple timers, a serving-time planner, cooking mode with saved progress, screen Wake Lock where supported, and sharing. Numeric ingredients scale; free-text amounts and notes stay as Tamar wrote them.
- **Detailed editing model:** Sanity fields for time ranges, equipment, oven and burner settings, doneness targets, timelines, variations, storage, sources, kosher adaptations, and Tamar's own cooking notes. Simple recipes can leave advanced fields empty.
- **Static publishing:** crawlable recipe HTML, canonical and social metadata, Recipe and Breadcrumb JSON-LD, `robots.txt`, `llms.txt`, and a sitemap when real content and a live site URL are configured.

The public site has no accounts, comments, contact form, or embedded administration route. Sanity Studio is deployed separately and uses Sanity's editor sign-in.

## How it works

| Layer    | Responsibility                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------- |
| Astro    | Routes, build-time Sanity queries, static pages, metadata, and structured data                    |
| Svelte 5 | Page views and reusable interface components; only search and recipe tools hydrate in the browser |
| Sanity   | Recipe, category, and site settings documents; a separately hosted editing Studio                 |
| Video    | YouTube embeds first; optional Mux video when a recipe has no YouTube video                       |
| Styling  | Project CSS tokens and self-hosted Assistant and Heebo fonts                                      |

Publishing a Sanity document does not change an already deployed static page. A Sanity webhook must call the hosting provider's deploy hook to rebuild the site.

## Run locally

**Requirements:** Node.js 22.12 or newer and pnpm 10.17.0 (the version in `package.json`).

```sh
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env`. You can leave the Sanity project ID empty to review the sample site. Start and manage the Astro development server in background mode:

```sh
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

`astro dev status` shows the local address. The sample recipes are for design review only; they are not Tamar's finished content.

### Connect Sanity

1. Create a Sanity project and dataset. Set the matching `PUBLIC_SANITY_*` and `SANITY_STUDIO_*` values in `.env`.
2. Run `pnpm sanity:dev` to edit locally. Create the site settings document, categories, and Tamar-reviewed recipes.
3. Deploy the editor to Sanity hosting with `pnpm sanity:deploy` after choosing an available Studio hostname. Editors then sign in through Sanity; there is no `/studio` or `/admin` page on the public site.

| Variable                   | Used by           | Purpose                                                                                   |
| -------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`          | Website build     | Final canonical origin and sitemap URL; `https://example.com` is only a local placeholder |
| `PUBLIC_SANITY_PROJECT_ID` | Website build     | Enables real Sanity content instead of sample content                                     |
| `PUBLIC_SANITY_DATASET`    | Website build     | Dataset to fetch, normally `production`                                                   |
| `SANITY_STUDIO_PROJECT_ID` | Studio            | Same Sanity project as the website                                                        |
| `SANITY_STUDIO_DATASET`    | Studio            | Same dataset as the website                                                               |
| `SANITY_STUDIO_HOSTNAME`   | Studio deployment | Optional `*.sanity.studio` hostname prefix                                                |

Treat `PUBLIC_*` values as public and never put secrets in them. When a real Sanity ID is configured, a content fetch error fails the build instead of silently showing sample recipes.

## Commands

| Command              | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `pnpm check`         | Check formatting, Astro and Svelte types, Sanity schemas, and recipe behavior |
| `pnpm build`         | Generate the static site in `dist/`                                           |
| `pnpm preview`       | Preview a completed build locally                                             |
| `pnpm format`        | Format Astro, Svelte, TypeScript, and CSS source                              |
| `pnpm format:check`  | Check formatting without changing files                                       |
| `pnpm sanity:dev`    | Run the Sanity Studio locally                                                 |
| `pnpm sanity:deploy` | Deploy the Studio to Sanity hosting                                           |

## Content and publishing

The core Sanity documents are `recipe`, `category`, and the `siteSettings` singleton. Tamar enters recipes manually from her previous site; this repository does not import the old Ghost content or preserve its URLs. Each published recipe should use Tamar-approved text and photography. See the [editorial guide](docs/editorial.md) for entry rules, tested quantities, dietary and Passover labels, and review before publication.

Serving changes use numeric ingredient quantities and any known gram or milliliter equivalents. Original amounts remain in static HTML for readers and crawlers, and on live recipes they are also used in JSON-LD. Printing works without JavaScript. Converted measures are approximate where household and US customary units differ; the interface does not infer an ingredient's mass from its volume.

For launch, deploy `dist/` to Vercel or Cloudflare Pages, set `PUBLIC_SITE_URL` to the final HTTPS origin, and connect a Sanity publish webhook to the host's deploy hook. Verify the built pages, indexing controls, and video playback on the final domain. The [deployment guide](docs/deployment.md) covers the steps.

## Repository map

```text
src/pages/                 Astro routes and static endpoints
src/layouts/               Document shell, metadata, and JSON-LD output
src/components/pages/      Static Svelte page views
src/components/ui/         Reusable recipe UI
src/components/islands/    Browser search and kitchen controls
src/lib/                   Sanity queries, content loading, and recipe helpers
src/sanity/schemas/        Sanity document and recipe-part schemas
src/styles/                Global CSS tokens and print styles
scripts/                   Schema and recipe behavior checks
docs/                      Editorial and deployment guides
```

## Further reading

- [Product plan](plan.md) — scope, design decisions, and release sequence
- [Editorial guide](docs/editorial.md) — how Tamar enters and checks recipes
- [Deployment guide](docs/deployment.md) — Sanity Studio, hosting, and rebuild webhook
- [Development conventions](AGENTS.md) — Astro/Svelte boundaries and local workflow

English translation is a later editorial stage. Hebrew is the only published language until translations have a reviewer.

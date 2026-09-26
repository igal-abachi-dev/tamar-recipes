# Tamar Recipes — product and implementation plan

## Purpose

Build a Hebrew-first, right-to-left recipe home for Tamar. It should feel personal and welcoming while giving a cook the precision needed to succeed. Astro handles routes, data, static generation and SEO; Svelte owns the page UI. Only the small recipe search and kitchen controls hydrate. Sanity hosts Studio separately, while the public site uses a small build-time Sanity client. YouTube is the primary video option and Mux is an optional second provider. The visual system uses custom CSS tokens and locally hosted Hebrew fonts. English is a later, editorially translated view.

This plan is an upstream decision record. It can later be broken into a specification, epics, stories, subtasks, and technical enablers.

## Confirmed product decisions

- Public name: **אתר המתכונים של תמר**. The exact tagline and Tamar's About story can be finalized with her own words.
- Tamar will manually enter recipes from her existing Ghost site into Sanity. No automated Ghost migration or old-URL redirect work is planned.
- Initial migration candidates: מיונז, לזניה, פאד תאי, לביבות בטטה וכרישה / קציצות פראסה, עוגת גבינה באסקית, חומוס, חמין / טשולנט, וקובה סלק. Tamar chooses the final order and supplies the text and images.
- All published recipes are kosher. Tamar assigns בשרי, חלבי or פרווה. She may also mark a recipe צמחוני, ללא גלוטן, ללא לקטוז and כשר לפסח after checking ingredients and preparation. These are editorial labels, not certification claims.
- No accounts, public comments, social feeds, newsletter or contact form are planned.
- English is low priority. No reviewer is assigned, so English pages stay unpublished until there is a review process.
- Hosting will be chosen later between Vercel and Cloudflare Pages. Keep static output and set the final canonical domain at launch.
- Sanity Studio will be deployed on Sanity hosting with Sanity sign-in. The public site has no `/admin` or `/studio` route.

## Audience and editorial promise

- Primary reader: Hebrew-speaking home cook on a phone, often with hands busy in the kitchen.
- Core jobs: decide what to cook, check time and servings, gather ingredients, follow steps, save or revisit a trusted recipe.
- Voice: Tamar's own explanations and family context. Recipes must be tested and approved by Tamar before publication.
- Scope: Tamar's recipes and stories, with clear provenance for adaptations. The example recipes currently in the repo are labeled demonstration content and are excluded from indexing and Recipe structured data.

## What we learned from the references

| Reference | Useful pattern for Tamar |
| --- | --- |
| [RecipeTin Eats](https://www.recipetineats.com/) | Practical entry points by meal need and category, with a recognizable cook behind the site. |
| [Allrecipes](https://www.allrecipes.com/) | Show time and useful recipe context directly in discovery cards; community features are an expansion, not a launch requirement. |
| [Asif](https://asif.org/he/) | Treat food as culture and memory. Preserve Tamar's story and family context where it adds value. |
| [FERRANDI Paris, Grand Cours de Cuisine](https://www.ferrandi-paris.com/en/our-books/grand-cours-de-cuisine) | Teach through step-by-step technique, photographs and small expert tips. |
| [Le Cordon Bleu, French baking example](https://www.cordonbleu.edu/news/french-baking-in-five-weeks/en) and [flat bread recipe](https://www.cordonbleu.edu/news/recipe-tomato-flat-bread/en) | Group ingredients by component, specify weights, rest and proofing periods, temperatures, and observable outcomes. |
| [CIA online resources](https://www.ciachef.edu/online-resources/) | Explain the “why” behind a key step when it prevents a common mistake. |
| [Tsuji technique page](https://www.tsuji.ac.jp/hp/gihou/seika/pate/feuilletage/recipe.htm) | Pair precise quantities and tools with visual or tactile cues and short explanations. |
| [ENSP at École Ducasse](https://www.ecoleducasse.com/en/campuses/ecole-nationale-superieure-de-patisserie) | Baking deserves optional precision fields and component-based recipes. The school page describes its pastry teaching focus; it is not a source for copied recipes. |
| [San Francisco Baking Institute](https://sfbi.com/) | Treat bread as a distinct workflow with fermentation and dough temperature fields where needed. |
| [CAST](https://castuni.com/en/masterclass/) and [ALMA](https://alma.scuolacucina.it/corsi/cucina/corso-superiore-di-cucina-italiana/) | Balance technique with culinary identity, tradition and ingredient knowledge. Their general teaching pages inform the editorial approach, not specific formulas. |

These are design and content-structure observations. Do not copy photographs, text, formulas, or branding from these publishers.

## Experience design

### Site map

- `/`: Tamar's welcome, featured recipe, four category paths, recent recipes, short personal introduction.
- `/recipes`: searchable recipe archive, category chips, dietary and Passover filters, and useful card metadata.
- `/recipes/[slug]`: cookable page with summary, ingredient checklist, numbered steps, optional components and technique details, video, storage guidance, related recipes, print/share tools, cooking mode, timers, serving-time planner, serving and unit controls, and screen wake control.
- `/categories` and `/categories/[slug]`: browse by a small, maintainable primary taxonomy.
- `/about`: Tamar's story, to be completed in her own words before launch.
- `/404` and `/robots.txt`: Hebrew missing-page help and crawl controls.
- Future: curated collections (Shabbat, holidays, quick dinners), technique guides, English routes, saved recipe lists.

### Visual direction

Warm paper background, deep olive text, clay accent, generous food photography, restrained type and whitespace. The homepage should feel like a modern cookbook. The recipe page should behave like a practical kitchen reference. Use consistent image crops, readable Hebrew line lengths, strong focus states, and mobile spacing. Avoid popups, fake reviews, fabricated ratings, or an empty newsletter form.

### Cooking UX rules

1. Put title, brief promise, active and total time, yield and difficulty above the ingredients; show prep/cook/rest detail when it helps.
2. Give direct anchors to ingredients and method. Keep the ingredient list beside steps on wide screens and in document order on mobile.
3. Group ingredients by component. Use metric grams for precision when important; allow home measures as helpful equivalents.
4. Separate active time from passive time. Do not conceal proofing or chilling in a vague total.
5. Write steps in imperative language with one clear action sequence. Add a readiness cue for timing-sensitive steps.
6. Put equipment, temperature, make-ahead, storage, substitutions and “why” notes where they help rather than forcing every recipe to fill every field.
7. Offer a clean print layout and button. Keep ingredient checks usable without JavaScript; offer an optional screen wake control on supporting devices.
8. Scale only structured numeric amounts. Keep Tamar's original measure as the default, and let readers select metric or US customary equivalents. Label approximations and ask Tamar to check scaled yields, pan sizes and any quantities written in notes.

## Content model

Current Sanity documents are `recipe`, `category` and the `siteSettings` singleton. A recipe has a title, Latin slug, short description, hero image with alt text and hotspot/crop, category, controlled tags, featured flag, active and total time ranges, optional prep/cook/rest detail, yield, servings, difficulty, kosher classification, optional dietary labels and three-way Passover status, ingredient groups, ordered steps, tips, optional YouTube or Mux video, and publication and modification dates. Ingredients can have a numeric quantity and optional gram or milliliter equivalents for serving scaling and unit conversion. `siteSettings` holds Tamar's homepage copy, tagline, footer text, portrait and About story as Portable Text.

Optional professional detail is kept in advanced Studio fields: components with their own ingredients and steps or a reusable recipe reference; versions and backlinks; a multi-day timeline; required and optional equipment; oven temperature, timer and seven common modes; Bosch FlameSelect level 1–9 and burner size per step; several doneness targets; pan size and yield units; sources and videos; serving suggestions; kosher adaptations; structured storage; split ingredient notes; readiness cues, pitfalls, key rules and Tamar's own lessons. These fields stay absent from the page when empty, so a simple salad still reads as a simple recipe. The exact appliance function must be checked against the model Tamar used. See [docs/editorial.md](docs/editorial.md).

Potential later types:

- `collection`: curated holiday, seasonal and occasion pages with editorial introduction and ordered recipes.
- `technique`: reusable explanation of a method, with photos or short video, linked from a step.
- `translation`: English fields or linked localized documents after the editorial process is chosen.

## Data and engineering

- Build as static Astro pages from Sanity. Keep `useCdn: false` for publish-triggered rebuilds.
- When no Sanity ID is configured, use labeled demo data for local review. When an ID is configured, build from real documents and fail visibly on fetch errors.
- Optimize Sanity images through its URL builder. Keep original preview assets in `public/images` until Tamar supplies her photography.
- Use a lazy YouTube iframe with an explicit cross-origin Referer policy, a direct YouTube fallback link, and static video links for additional clips; the [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) is only needed if later features require programmatic playback controls. Mux is an optional fallback. Verify playback on the final HTTPS domain.
- Generate canonical URLs, Open Graph tags, a sitemap for configured live content, `llms.txt`, and `Recipe` plus `BreadcrumbList` JSON-LD only for real recipes. Keep all recipe content in static HTML and escape JSON-LD safely.
- Preserve RTL layout throughout. English later needs translated metadata, ingredient and instruction text, language-specific routes, `hreflang`, and review by a human editor. Do not publish empty or automatic translations as finished pages.
- Keep taxonomy slugs stable and separate from Hebrew display labels after launch.
- The small archive search uses a slim client index of titles, tags and ingredient names; the cards stay static HTML. Revisit search indexing and pagination as the archive grows.
- Connect a Sanity webhook to the selected host's deploy hook so publishing, unpublishing and edits rebuild the static site. The exact steps are in [docs/deployment.md](docs/deployment.md).
- Image rights, final domain, live content, editorial preview workflow and accessibility review are launch enablers. Review privacy copy before using third-party video embeds or analytics.

## Content workflow and quality gate

For every real recipe:

1. Tamar provides or approves the recipe and its origin.
2. Test cook with recorded ingredient quantities, yield, timings and equipment.
3. Check that the image shows the actual finished dish; add alt text and record image rights.
4. Record any important safety or doneness cue from a reliable source (for poultry, see the [USDA safe temperature chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart)). Verify vegetarian, gluten-free, lactose-free and Passover labels ingredient by ingredient, including cross-contact where relevant; avoid unsupported nutrition or allergy claims.
5. Edit Hebrew for clarity and consistency; preview at phone and desktop widths.
6. Publish in Sanity, rebuild, verify the live URL, structured data and links.

Before public launch, replace every demo item, add Tamar's approved About copy and portrait, connect a real Sanity project and final site URL, and test the full archive and recipe flow on mobile.

## Implementation status

The site code now includes the Hebrew routes, static archive cards with a small search island, dietary and Passover filters, a simple or component-based recipe layout, optional YouTube and Mux video, a short/full view, print/share/screen-wake tools, cooking mode with saved progress, parallel timers with sound and vibration where supported, serving-time planning, serving scaling and original/metric/US customary measure views, Sanity schemas, hosted Studio configuration, local fonts, SEO metadata, JSON-LD, `llms.txt`, 404 and robots controls. Automated checks cover formatting, Astro, Svelte, Sanity schema validation and the static build. The demo build is deliberately noindexed.

Deployment still requires external facts and accounts: Tamar's approved content and photographs, the real Sanity project and hosted Studio, a final domain, a Vercel or Cloudflare Pages project, and its deploy hook connected to a Sanity webhook. Those values cannot be safely invented or configured from this repository. Follow [docs/deployment.md](docs/deployment.md), then test the real Sanity build, mobile rendering, publish-to-rebuild flow and live URLs before opening indexing.

Collections, reusable technique pages, saved recipe lists, an optional LLM-assisted paste-to-draft Studio tool, and English translation remain later product stages. The draft importer needs an approved provider and editor review workflow; English needs a reviewer. These are not required for the first recipe publication.

## Suggested release sequence

1. **Foundation:** approved brand direction, photography, Tamar's voice, Sanity project, domain and site settings.
2. **Content launch:** Tamar manually enters and reviews the first migrated recipes; complete About copy and review SEO and accessibility.
3. **Discovery:** curated collections, expanded search and filters, related content rules.
4. **Later cooking tools:** saved recipe lists and further print refinements.
5. **English:** translated editorial workflow, locale routes and metadata.

## Editorial inputs still needed from Tamar

- Final tagline, portrait and personal story.
- Approved recipe text, quantities, original images and migration order.
- Meat/dairy/pareve classification for each recipe and any specific preparation notes needed for a kosher kitchen.

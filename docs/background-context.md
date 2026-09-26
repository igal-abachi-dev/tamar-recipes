# Archived starter context

This is the original conversation about the Olympic starter template. It is retained for historical reference as requested; it does not describe the Tamar Recipes product or its current implementation. See the root `plan.md`, `README.md`, and `docs/deployment.md` for current decisions.

---

do me a new 2027+ Astro content/web project it will be a very large popular Olympic sports site: Astro + Svelte + Sanity + Mux(sanity-plugin-mux-input) for prod site

Astro
+ TypeScript
+ Svelte 5
+ semantic HTML/CSS

And establish these conventions:





.astro = application shell. Routes, layouts, content collections, SEO, data loading, static generation and server composition.



.svelte = reusable UI component language. Header, navigation, cards, filters, forms, search, carousels, dialogs, widgets, etc.



No client:* by default.

i will later use this example for more static sites



Astro and Svelte 5 fit together particularly well:

Astro
├── routing
├── layouts
├── content
├── Markdown/MDX
├── build/static generation
├── server islands/endpoints where needed
│
└── Svelte 5 = UI component system
     ├── static component       → no client: directive
     ├── immediate interaction  → client:load
     ├── deferred interaction   → client:idle
     ├── below-fold widget      → client:visible
     └── responsive widget      → client:media


create-astro olympic-sports --template basics --typescript strict --install --no-git --yes


npm create astro@latest



sanity@latest -- --template sanity-io/sanity-template-astro-clean



The wizard will ask you a series of setup questions: [1, 2]





Where should we create your new project?
Type the name of your target folder (e.g., ./my-astro-site). Note: The folder must be completely empty. [1, 2]



How would you like to start your new project?





Include sample files: (Recommended) Gives you a basic structural skeleton with a couple of functional components and styles.



Use a blog template: Seeds a full markdown/content collection blog structure.



Empty: Dropping into a purely blank workspace (best if you know exactly what boilerplate files you intend to drag over). [1, 2, 3]



Do you plan to write TypeScript?
Select Yes. It will then ask you for strictness; choosing Strict or Strictest is ideal for preventing runtime bugs downstream. [1, 2]





npx astro add svelte



tailwind css shacn ui components if needed



take ideas from themes:

https://www.sanity.io/templates/outkast


https://lexingtonthemes.com



also ghost source theme: so it looks professional



like this for example:

The clean Astro starter only comes with basic fields (like title and body). Ghost has richer structures. Ask Claude or Cursor:



I am using the official Sanity + Astro clean starter. I want to recreate the structural fields of the Ghost "Source" theme.
Can you write a Sanity schema file (post.ts) that includes:
- Title and Slug
- Excerpt (short description for card previews)
- Feature Image (with alt text)
- Featured flag (boolean to stick it to the top grid)
- Reading time (number)
- Author (reference) and Tags (array of references)




Step 2: Ask the AI for the Frontend Components

Once your Sanity backend is holding the right data, you need the visual elements. Ghost Source relies on a distinctive split-grid header for featured posts and a clean list below it. Open your Astro project in Cursor, highlight your components folder, and prompt it:



Using Tailwind CSS/shadcn ui, create an Astro component called `FeaturedGrid.astro`.
It should take an array of Sanity posts and mimic the Ghost "Source" theme header layout:
- One large featured post on the left with a large image and text overlay or side-by-side.
- A column of 3 smaller featured posts on the right (just text/titles and excerpts).
Make it fully responsive and mobile-friendly.




Step 3: Handle the GROQ Query

To feed data into those clean components, Astro needs to fetch the data using Sanity's query language (GROQ). If you aren't familiar with GROQ, let the AI write it:



Write a GROQ query for my Astro `index.astro` page that fetches the 4 most recent "featured" posts, and a separate list of the 10 most recent "regular" posts. Make sure it resolves the image URLs and pulls the author's name and tags.










-------------------------------



Olympic Sports project scaffold is ready at /home/workdir/artifacts/olympic-sports.
Stack & conventions (as requested)

Astro = application shell (routes, layouts, data loading, static generation, SEO, composition)
Svelte 5 = reusable UI components (Header, Footer, PostCard, etc.)
No client:* by default — pure static components; add client:load / idle / visible / media only when interaction is required
TypeScript (strict via Astro preset)
Semantic HTML + modern CSS (design tokens in global.css)
Sanity + Mux (sanity-plugin-mux-input) for production content & video

What’s included
Core config

astro.config.mjs — Svelte + Sanity integration, static output
sanity.config.ts — Studio + Mux plugin
svelte.config.js
.env.example + .env
Updated package.json (Astro 7.x, Svelte 5, Sanity, Mux player, Portable Text, etc.)

Sanity schemas (src/sanity/schemas/) — Ghost Source–inspired + Olympic fields

post.ts — title, slug, excerpt, feature image + alt, featured flag, reading time, author, tags, sport, body, Mux video
author.ts, tag.ts, sport.ts (title, slug, icon/emoji, olympicSince, etc.)

Data layer

src/lib/sanity.ts — client + image URL builder
src/lib/queries.ts — GROQ for featured posts, recent posts, single post, sports, authors

UI (Svelte 5 — static by default)

Header.svelte — sticky nav + mobile menu
Footer.svelte
PostCard.svelte — clean card

Shell (Astro)

Layout.astro — SEO, skip link, Header/Footer
FeaturedGrid.astro — Ghost Source–style split layout (large hero left + 3 smaller posts right)
Pages: /, /news, /news/[slug], /sports
Placeholder dirs for /events, /athletes

Styles

src/styles/global.css — Olympic-blue accent, tokens, prose, post-grid, dark-mode preference, accessibility

Next steps (run locally)
Bashcd olympic-sports
npm install --legacy-peer-deps   # or just npm install once peer ranges settle
cp .env.example .env             # set PUBLIC_SANITY_PROJECT_ID + DATASET
npm run sanity:dev               # or open /studio after dev server
npm run dev

Create a Sanity project → paste project ID into .env.
Add Mux credentials in the Sanity project (for the video field).
Publish a few posts (mark some featured: true) → homepage FeaturedGrid + card list will light up.
Optional later: Tailwind / shadcn-svelte, more Svelte widgets with selective client:*, athlete/event schemas, server islands if needed.

The structure is deliberately reusable for other static content sites. Everything follows the Astro-shell / Svelte-UI split you specified.





------------

unzip olympic-sports.zip
cd olympic-sports
npm install --legacy-peer-deps
cp .env.example .env   # add your Sanity project ID
npm run dev


---------------------


All feedback items are fixed. Here’s the **final reference-ready zip**:




### Fixes applied

| Issue | Fix |
|-------|-----|
| **Header never hydrates** | `<Header client:media="(max-width: 768px)" />` — only ships JS for the mobile menu |
| **Sanity CDN mismatch** | `useCdn: false` in both integration and `src/lib/sanity.ts` (SSG best practice) |
| **Risky `vite.define process.env`** | Removed entirely |
| **Obsolete `output: 'hybrid'` comment** | Removed; documented `prerender = false` pattern instead |
| **Raw image URLs** | All images now go through `urlFor().width().height().fit('crop').auto('format')` |
| **N+1 getStaticPaths** | Posts + sports fetched once and passed via `props` |
| **Silent CMS failures** | Production builds **throw**; dev mode warns and continues |
| **Dead links** | Added `/sports/[slug]`, `/tags/[slug]`, and placeholders for `/events`, `/athletes`, `/about`, `/contact`, `/privacy` |
| **role="dialog" on mobile menu** | Changed to proper `<nav aria-label="Mobile">` |
| **No site / sitemap** | `site: 'https://www.olympicsports.com'` + `@astrojs/sitemap` |
| **FeaturedGrid as .astro** | Converted to `FeaturedGrid.svelte` for consistent architecture |
| **`any` everywhere** | Shared types in `src/types/content.ts` (ready for Sanity TypeGen later) |

### Architecture remains

```
.astro  → pages, layouts, SEO, data loading, static generation
.svelte → all reusable UI (zero client JS unless you add a client:* directive)
```

After unzip:

```bash
cd olympic-sports
npm install --legacy-peer-deps
cp .env.example .env   # set your Sanity project ID
npm run dev
```




------------------


Yes — that is the convention I would use for this stack.

For your Astro + Svelte 5 sites, I would make the boundary:

.astro
→ routing
→ getStaticPaths()
→ Astro.params / Astro.props
→ CMS/data loading
→ SEO / canonical / structured metadata
→ layouts
→ hydration decisions (`client:*`)

.svelte
→ ALL page UI
→ page-specific UI
→ reusable UI
→ styling
→ state / interaction
And importantly:

A Svelte component does not need to be reusable to justify existing.

A HomePage.svelte that is used exactly once is still useful because it establishes Svelte as the single UI language.

Astro officially supports this technically: a framework component without client:* is rendered to static HTML and sends no framework JavaScript to the browser. (Docs)

So this:

<HomePage
  featuredPosts={featuredPosts}
  recentPosts={recentPosts}
/>
does not mean you've made the homepage a client-side Svelte app.

It is effectively:

Svelte compiler
      ↓
build time
      ↓
HTML
      ↓
browser
with no Svelte hydration runtime.

I'd make your pages look like this
Instead of the current index.astro containing the actual page markup:

<Layout ...>
  <header class="page-intro">
    ...
  </header>

  <FeaturedGrid ... />

  <section>
    ...
  </section>
</Layout>
I'd use:

---
// src/pages/index.astro

import Layout from '../layouts/Layout.astro';
import HomePage from '../components/pages/HomePage.svelte';

import { sanityClient } from '../lib/sanity';
import {
  featuredPostsQuery,
  recentPostsQuery,
  sportsQuery
} from '../lib/queries';

import type { Post, Sport } from '../types/content';

const [featuredPosts, recentPosts, sports] = await Promise.all([
  sanityClient.fetch<Post[]>(featuredPostsQuery),
  sanityClient.fetch<Post[]>(recentPostsQuery),
  sanityClient.fetch<Sport[]>(sportsQuery),
]);

const title =
  'Olympic Sports — News, Results & Stories from the Games';

const description =
  'Independent coverage of Olympic sports, athletes, events and culture.';
---

<Layout
  title={title}
  description={description}
  sports={sports}
>
  <HomePage
    {featuredPosts}
    {recentPosts}
  />
</Layout>
And then:

<!-- src/components/pages/HomePage.svelte -->

<script lang="ts">
  import FeaturedGrid from '../cards/FeaturedGrid.svelte';
  import PostCard from '../cards/PostCard.svelte';
  import type { Post } from '../../types/content';

  interface Props {
    featuredPosts: Post[];
    recentPosts: Post[];
  }

  let {
    featuredPosts,
    recentPosts
  }: Props = $props();
</script>

<header class="page-intro">
  <h1>Olympic Sports</h1>

  <p class="lede">
    Independent journalism and storytelling from the Olympic Games —
    results, athletes, history and the culture that surrounds them.
  </p>
</header>

{#if featuredPosts.length > 0}
  <FeaturedGrid posts={featuredPosts} />
{/if}

<section aria-labelledby="latest-heading">
  <h2 id="latest-heading">Latest stories</h2>

  {#if recentPosts.length > 0}
    <div class="post-grid">
      {#each recentPosts as post}
        <PostCard {post} />
      {/each}
    </div>
  {:else}
    <p>No posts published yet.</p>
  {/if}
</section>

<style>
  /* page UI styles here */
</style>
That's cleaner.

I'd even create page-specific components
Your structure could become:

src/
├─ pages/
│  ├─ index.astro
│  ├─ news/
│  │  ├─ index.astro
│  │  └─ [slug].astro
│  ├─ sports/
│  │  ├─ index.astro
│  │  └─ [slug].astro
│  ├─ athletes/
│  │  └─ index.astro
│  └─ ...
│
├─ layouts/
│  └─ Layout.astro
│
├─ components/
│  ├─ pages/
│  │  ├─ HomePage.svelte
│  │  ├─ NewsPage.svelte
│  │  ├─ ArticlePage.svelte
│  │  ├─ SportsPage.svelte
│  │  ├─ SportPage.svelte
│  │  ├─ AthletesPage.svelte
│  │  ├─ EventsPage.svelte
│  │  ├─ AboutPage.svelte
│  │  └─ ContactPage.svelte
│  │
│  ├─ layout/
│  │  ├─ Header.svelte
│  │  └─ Footer.svelte
│  │
│  ├─ cards/
│  │  ├─ PostCard.svelte
│  │  └─ FeaturedGrid.svelte
│  │
│  └─ ui/
│
├─ lib/
├─ types/
└─ styles/
That's a very understandable codebase.

A developer immediately knows:

Where is /sports generated?
→ pages/sports/index.astro

Where is the Sports page UI?
→ components/pages/SportsPage.svelte

Where does its data come from?
→ the .astro route

Where is its CSS?
→ SportsPage.svelte
I prefer that to having some UI in .astro, some in .svelte, some styling attached to routes, and some attached to components.

One important rule: don't make the page Svelte component the hydration boundary
This is the subtle part.

Suppose:

HomePage.svelte
├─ Hero
├─ Stories
├─ Newsletter
└─ InteractiveCarousel
Do not automatically do:

<HomePage client:load />
just because the carousel is interactive.

That would hydrate the entire homepage Svelte tree.

Instead, Astro's client:* directives should remain deliberate island boundaries. Astro documents that these directives are applied to framework components imported into .astro. (Astro Documentation)

For example:

<Layout ...>
  <HomePage
    {featuredPosts}
    {recentPosts}
  />

  <LiveResults client:visible results={results} />
</Layout>
Now:

HomePage
→ server-rendered Svelte
→ zero JS

LiveResults
→ Svelte island
→ client JS
That's excellent.

If an interactive widget naturally belongs visually inside the page component, you can instead split the Astro composition around it.

For example:

<HomeHero data={...} />

<LiveResults client:visible results={results} />

<HomeStories posts={posts} />
All three can still be .svelte.

So you're not abandoning the “Svelte owns UI” rule.

Astro is simply deciding where hydration occurs.

There are two exceptions where I would allow .astro UI markup
I wouldn't turn the convention into dogma.

1. Astro-specific rendering
Astro framework components cannot be imported into Svelte components. Astro explicitly documents this limitation. (Astro Documentation)

For example Astro's:

<Image />
<Picture />
cannot be directly used inside .svelte. Astro's image docs specifically call this out. (Astro Build Previews)

Likewise you're currently using:

<PortableText value={post.body} />
from astro-portabletext.

Sanity currently recommends that renderer for Astro. (Sanity.io)

You have two sensible choices.

Keep a small Astro rendering adapter:

ArticlePage.svelte
        ↑
     data/UI

ArticleBody.astro
        ↑
astro-portabletext
or, if you want the strict Svelte UI convention, switch to the official @portabletext/svelte, which supports Svelte 5. (Sanity.io)

For your architecture, I'd probably use @portabletext/svelte and make ArticlePage.svelte own the article UI too.

2. Tiny Astro-only composition
Something like:

<Layout title={title}>
  <PageView {...data} />
</Layout>
is obviously appropriate.

I wouldn't create a Svelte component merely to eliminate those two lines.

There's also a useful distinction
I agree with:

all actual UI belongs in Svelte

I would not turn that into:

every HTML element deserves its own Svelte component.

Don't create:

PageHeading.svelte
PageParagraph.svelte
PageSection.svelte
PageWrapper.svelte
PageSpacer.svelte
just for consistency.

That's component fragmentation.

Instead:

HomePage.svelte
├─ normal HTML
├─ normal HTML
├─ FeaturedGrid
│  └─ PostCard
└─ normal HTML
is ideal.

The convention is about language ownership, not maximizing component count.

Looking at your olympic-sports-final.zip
Your latest version has already fixed several previous issues, including the Header hydration boundary:

<Header
  sports={sports}
  client:media="(max-width: 768px)"
/>
and your Layout.astro is exactly the kind of code I would keep Astro-owned:

<html>
<head>
SEO
canonical URL
OpenGraph
Astro.url
Header hydration choice
<slot />
Footer
But the individual routes still contain quite a lot of UI.

For example:

pages/index.astro
pages/news/index.astro
pages/news/[slug].astro
pages/sports/index.astro
pages/sports/[slug].astro
still contain headings, grids, empty states, article markup and CSS.

I would make this final refactor.

index.astro
      ↓
HomePage.svelte

news/index.astro
      ↓
NewsPage.svelte

news/[slug].astro
      ↓
ArticlePage.svelte

sports/index.astro
      ↓
SportsPage.svelte

sports/[slug].astro
      ↓
SportPage.svelte
Then you have a very strong rule:

                  ASTRO
                    │
        ┌───────────┴───────────┐
        │                       │
     routing                  layout
        │                       │
 getStaticPaths              SEO/head
 CMS queries                canonical
 params/props             hydration choice
        │                       │
        └───────────┬───────────┘
                    │
                 typed data
                    ▼
               SVELTE 5
                    │
            ┌───────┴───────┐
            │               │
       page views       reusable UI
            │               │
            └───────┬───────┘
                    │
                    ▼
                HTML/CSS
                    │
          client:* only where
             interaction exists
That's the architecture I'd standardize.

Astro's own docs say pages are responsible for routing, data loading and overall page layout, while framework components default to server-rendered static HTML. (Astro Documentation)

So your formulation is excellent:

.astro → pages, layouts, SEO, data loading, static generation and hydration boundaries.
.svelte → all actual UI, including one-off page-specific UI.

For a team using Astro + Svelte as its standard stack, I think that's cleaner and more maintainable than deciding component-by-component whether UI should be Astro or Svelte.


------------------



Final architecture applied. Download:




### The boundary is now strict

```
.astro                          .svelte
────────────────────────────    ────────────────────────────
routing                         ALL page UI (incl. one-offs)
getStaticPaths()                reusable components
Astro.params / props            styling
CMS / data loading              state / interaction
SEO / canonical / OG            (zero JS unless client:*)
layouts
hydration decisions (client:*)
```

### What changed in this pass

| Before | After |
|--------|-------|
| UI markup + CSS lived inside `.astro` routes | All UI moved to `components/pages/*.svelte` |
| Mixed Astro/Svelte page ownership | Every route is data → `<PageComponent />` |
| `astro-portabletext` | `@portabletext/svelte` (body stays in Svelte) |
| One-off page views mixed with reusable cards | Clear `components/pages/` vs `components/cards/` |

### Example route (now ~25 lines)

```astro
---
// src/pages/index.astro  — data + SEO only
import Layout from '../layouts/Layout.astro';
import HomePage from '../components/pages/HomePage.svelte';
// … fetch featuredPosts, recentPosts, sports …
---
<Layout title={…} description={…} sports={sports}>
  <HomePage {featuredPosts} {recentPosts} />
</Layout>
```

`HomePage.svelte` owns the actual markup, empty states, and page styles — and still ships **zero** client JS.

### Page components created

- `HomePage.svelte`
- `NewsPage.svelte`
- `ArticlePage.svelte`
- `SportsPage.svelte`
- `SportPage.svelte`
- `PlaceholderPage.svelte` (about / contact / events / athletes / privacy / tags)

This is the convention I’d standardize for every new Astro + Svelte 5 content site.


-----------------------------------------
-----------------------------------------

new tamar recipes site context:

hi this was a starter template(olymic-site) of astro+svelte+sanity+mux , you can see (background-context.md) about how it was built , now the structure is good , i want you to make/turn it into recipes sites for my mom(tamar) , look at those sites from insights/ideas(schema,pages,designs... and more...) for it to be/look proffesional and good: Here are the top, most popular, and culturally trusted recipe websites across each of these eight countries, including localized giants and premier platforms:


Here are the top, most popular, and culturally trusted recipe websites across each of these eight countries, including localized giants and premier platforms:
## 🇺🇸 United States

* [Allrecipes](https://www.allrecipes.com/): The absolute largest crowd-sourced platform in the country. Millions of user-reviewed everyday recipes.
* [Food Network](https://www.foodnetwork.com/): The digital home of major celebrity chef recipes, instructional videos, and kitchen basics.
* [NYT Cooking](https://cooking.nytimes.com/): A premium, highly curated subscription service known for meticulously developed recipes and a vast digital archive.
* [Serious Eats](https://www.seriouseats.com/): Famous for taking a deeply scientific, technical approach to uncovering the ultimate version of classic dishes.
* [Bon Appétit](https://www.bonappetit.com/): A stylish culinary powerhouse focusing on trendy ingredients, restaurant-style meals, and elegant home entertaining. [1, 2, 3, 4, 5, 6] 

## 🇬🇧 United Kingdom

* [BBC Good Food](https://www.bbcgoodfood.com/): The undisputed #1 food site in the UK. It features thousands of professionally tested, reliable, and family-friendly recipes.
* [RecipeTin Eats](https://www.recipetineats.com/): Though globally popular, it is highly visited by UK home cooks for its incredibly reliable, crowd-pleasing meals.
* [Jamie Oliver](https://www.jamieoliver.com/): The official site of the beloved British chef, featuring straightforward, fresh, and often health-conscious recipes.
* [Delicious Magazine UK](https://www.deliciousmagazine.co.uk/): A premium food hub offering beautiful recipe spreads, food trends, and expert wine-pairing tips.
* [Great British Chefs](https://www.greatbritishchefs.com/): Designed for passionate home cooks looking for upscale, restaurant-caliber recipes directly from Britain's top chefs. [4, 7, 8, 9, 10] 

## 🇮🇹 Italy

* [GialloZafferano](https://www.giallozafferano.it/): Italy’s ultimate culinary platform. It is widely used across the country for both traditional Italian staples and casual everyday meals.
* [Il Cucchiaio d'Argento (The Silver Spoon)](https://www.cucchiaio.it/): The digital expansion of Italy's iconic, prestigious cookbook, highly trusted for flawless technical execution.
* [La Cucina Italiana](https://www.lacucinaitaliana.it/): A sophisticated monthly magazine turned digital hub, praised for upscale, visually stunning gourmet dishes.
* [Fatto in Casa da Benedetta](https://www.fattoincasadabenedetta.it/): Helmed by internet star Benedetta Rossi, this platform is immensely popular for simple, authentic, and cozy Italian home cooking.
* [Dissapore](https://www.dissapore.com/): A widely read food culture and recipe site focused on modern gastronomy, detailed reviews, and high-quality ingredients. [11, 12, 13, 14, 15, 16] 

## 🇫🇷 France

* [Marmiton](https://www.marmiton.org/): The ultimate powerhouse of French home cooking. It is a massive, user-driven database for finding any classic French meal.
* [7Demain / 750g](https://www.750g.com/): A highly popular platform featuring thousands of approachable recipes, professional cooking videos, and community tips.
* [Cuisine Actuelle](https://www.cuisineactuelle.fr/): A leading lifestyle food site that provides quick, casual weeknight dinners, meal-prep tips, and seasonal ideas.
* [Journal des Femmes Cuisine](https://cuisine.journaldesfemmes.fr/): One of France's most heavily trafficked culinary platforms, offering highly accessible, community-vetted recipes.
* [Chef Simon](https://chefsimon.com/): Perfect for dedicated cooks looking to master classic French kitchen techniques, mother sauces, and advanced skills. [12, 13] 

## 🇦🇺 Australia

* [Taste.com.au](https://www.taste.com.au/): Australia's absolute giant for online recipes, housing a massive database of trusted recipes, quick dinners, and baking ideas.
* RecipeTin Eats: Based in Sydney, Nagi Maehashi's site is globally beloved but stands out as an local staple for its highly tested recipes.
* [Good Food Australia](https://www.goodfood.com.au/): The culinary arm of The Sydney Morning Herald and The Age, featuring recipes from top Australian chefs and food writers.
* [Donna Hay](https://www.donnahay.com.au/): The digital home of Australia's premier food stylist and author, known for clean, fast, and visually spectacular meals.
* [Gourmet Traveller](https://www.gourmettraveller.com.au/): Focused on high-end cooking, luxury food travel, and complex recipes designed to impress a crowd.

## 🇩🇪 Germany

* [Chefkoch](https://www.chefkoch.de/): Germany’s massive, undisputed #1 digital recipe community. It contains millions of user-submitted German and European recipes.
* [Essen & Trinken](https://www.essen-und-trinken.de/): A highly respected, premium digital magazine known for its elegant, reliable, and thoroughly tested recipes.
* [Eat Smarter](https://eatsmarter.de/): The top destination for health-conscious German cooks, focusing on clean eating, nutrition facts, and wholesome meals.
* [Lecker](https://www.lecker.de/): A highly trendy and visually appealing platform showcasing modern, fast, and fun everyday comfort food.
* Kitchen Stories: A beautifully designed, internationally loved German startup providing step-by-step video tutorials and sleek layouts. [12, 13, 15] 

## 🇹🇷 Turkey

* [Nefis Yemek Tarifleri](https://www.nefisyemektarifleri.com/): The massive, undisputed leader of home cooking in Turkey. It features millions of user-shared local regional classics.
* [Yemek.com](https://yemek.com/): A highly polished, popular food culture site blending quick video recipes, entertaining street food tours, and Turkish favorites.
* [Kevserin Mutfağı](https://www.kevserinmutfagi.com/): A highly trusted cooking blog featuring approachable, meticulously detailed recipes from both Turkish and international cuisines.
* [Lezzet](https://www.lezzet.com.tr/): The digital face of a major traditional Turkish culinary magazine, focusing on authentic recipes and regional Turkish delicacies.
* [Sahrap Soysal](https://sahrapsoysal.com/): Run by one of Turkey’s most beloved celebrity culinary figures, showcasing deep-rooted Anatolian culture and traditional home recipes. [17] 

## 🇮🇱 Israel

* [Mako Ochles (Foodforward)](https://www.mako.co.il/food): The country's largest digital food portal, hosting recipes from major cooking shows (like MasterChef Israel) and leading local chefs.
* [Ynet Ochel](https://www.ynet.co.il/food): A premier news-portal food hub packed with chef interviews, restaurant reviews, and a highly active database of traditional holidays recipes.
* [Walla! Food](https://food.walla.co.il/): A highly trafficked portal delivering everything from fast weeknight meals to complex baking projects and contemporary Israeli cuisine.
* [Asif (Culinary Center in Israel)](https://asif.org/): A chic culinary institute dedicated to preserving and exploring Israel's diverse food culture with high-quality, historical recipes.
* [Kraus (Cook and Bake / Foody)](https://foody.co.il/): A highly popular video-centric recipe network bringing together a community of Israeli food bloggers, chefs, and internet food influencers. [18]




its a heberw first website [rtl] (with support for english view ltr later)



also for recipies schema,fields,layouts , look at proffessional recipes from those schools and their books:
Ferrandi Paris , Le Cordon Bleu Paris , The Culinary Institute of America (CIA) , École Nationale Supérieure de Pâtisserie ,The San Francisco Baking Institute (SFBI), Cast Alimenti ,ALMA - La Scuola Internazionale di Cucina Italiana ,Tsuji Culinary Institute
maybe they give more insights for us

also i want nice look proffessional design , appealing to view and stay in the site , nice ux , see if we can improve it more to be great
with shadcn ui / tailwindcss add Tailwind for reusable styling and use shadcn-svelte for interaction controls where it help


- Final site name, tagline, portrait and personal story.  = it will be tamar recipes domain , but name אתר המתכונים של תמר
- Actual recipe list, images, and what “family recipes” can be published. = this she will do from sanity (she migrates to this new site from old local ghost cms deployed to surgh.sh , now astro+sanity is better, https://tamar-recipes.surge.sh/) , recipes include: מיונז , לזניה , נודלס(פאד תאי), לביבות בטטה כרישה(קציצות פראסה), עוגת גבינה באסקית, חומוס, חמין/טשולנט , קובה סלק, .... 
- Whether dietary or kosher labels should appear, and who verifies them. = all kosher recipes , so there are not non kosher
- Contact channel, social accounts and privacy/legal copy.  = no accounts only this site , also its static site , not live social comments on recipes, so wont be affected from spam
- English translation priority and who reviews translations. = low priority , no reviewer

i will later host this site on vercel/Cloudflare Pages


------------------------

I turned the starter into a Hebrew-first, RTL recipe site named אתר המתכונים של תמר. It now has a homepage, searchable recipe archive, category pages, an About page, and recipe pages with grouped ingredients, cooking steps, timing, kosher classification, and optional video. The Sanity schema supports both simple family recipes and more precise baking or technique notes.

The research, design decisions, content model, and later release stages are in plan.md. Tamar can enter each recipe manually in Sanity; the plan includes no old-link preservation or automated Ghost migration. The current food images are generated previews, and every sample recipe is labeled and excluded from search indexing until Tamar supplies approved content.

Checks passed: Astro check, Svelte check (0 warnings), production build (12 static pages), and local HTTP checks of the main routes. I also started and stopped the dev server using Astro’s background mode. I could not complete visual browser testing because the in-app browser had no browser available.

Before launch, add Tamar’s recipes and photos, her approved story, a Sanity project ID, and the final domain. Hosting remains open between Vercel and Cloudflare Pages.



# Tamar Recipes — product and implementation plan

## Purpose

Build a Hebrew-first, right-to-left recipe home for Tamar. It should feel personal and welcoming while giving a cook the precision needed to succeed. The existing Astro + Svelte 5 + Sanity + Mux architecture stays, with Tailwind CSS 4 and shadcn-svelte for reusable controls: Astro handles routes, data, static generation and SEO; Svelte owns the page UI; only the recipe archive search needs hydration. The editorial layout uses custom CSS where it gives better control; Tailwind utilities and shadcn-svelte components serve smaller UI patterns. English is a later, editorially translated view.

This plan is an upstream decision record. It can later be broken into a specification, epics, stories, subtasks, and technical enablers.

## Confirmed product decisions

- Public name: **אתר המתכונים של תמר**. The exact tagline and Tamar's About story can be finalized with her own words.
- Tamar will manually enter recipes from her existing Ghost site into Sanity. No automated Ghost migration or old-URL redirect work is planned.
- Initial migration candidates: מיונז, לזניה, פאד תאי, לביבות בטטה וכרישה / קציצות פראסה, עוגת גבינה באסקית, חומוס, חמין / טשולנט, וקובה סלק. Tamar chooses the final order and supplies the text and images.
- All published recipes are kosher. Tamar assigns the useful cooking classification: בשרי, חלבי or פרווה. This is an editorial label, not a certification claim.
- No accounts, public comments, social feeds, newsletter or contact form are planned.
- English is low priority. No reviewer is assigned, so English pages stay unpublished until there is a review process.
- Hosting will be chosen later between Vercel and Cloudflare Pages. Keep static output and set the final canonical domain at launch.

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
- `/recipes`: searchable recipe archive, category chips and useful card metadata.
- `/recipes/[slug]`: cookable page with summary, ingredient checklist, numbered steps, optional technique details, video, storage guidance, and related recipes.
- `/categories` and `/categories/[slug]`: browse by a small, maintainable primary taxonomy.
- `/about`: Tamar's story, to be completed in her own words before launch.
- Future: curated collections (Shabbat, holidays, quick dinners), technique guides, English routes, saved recipes.

### Visual direction

Warm paper background, deep olive text, clay accent, generous food photography, restrained type and whitespace. The homepage should feel like a modern cookbook. The recipe page should behave like a practical kitchen reference. Use consistent image crops, readable Hebrew line lengths, strong focus states, and mobile spacing. Avoid popups, fake reviews, fabricated ratings, or an empty newsletter form.

### Cooking UX rules

1. Put title, brief promise, prep/cook/rest time, yield and difficulty above the ingredients.
2. Give direct anchors to ingredients and method. Keep the ingredient list beside steps on wide screens and in document order on mobile.
3. Group ingredients by component. Use metric grams for precision when important; allow home measures as helpful equivalents.
4. Separate active time from passive time. Do not conceal proofing or chilling in a vague total.
5. Write steps in imperative language with one clear action sequence. Add a readiness cue for timing-sensitive steps.
6. Put equipment, temperature, make-ahead, storage, substitutions and “why” notes where they help rather than forcing every recipe to fill every field.
7. Offer a clean print layout and avoid layout shifts in cooking mode.
8. Do not automate serving scaling until quantities are structured, units are normalized, and Tamar checks the output.

## Content model

Current Sanity documents are `recipe` and `category`. A recipe has a title, stable slug, short description, hero image and alt text, category, tags, featured flag, prep/cook/rest time, yield, servings, difficulty, ingredient groups, ordered steps, tips, optional Mux video, and publication date.

Optional professional detail is kept in an advanced Studio group: equipment, oven temperature, origin story, make-ahead and storage advice, source credit, numeric ingredient quantity and grams, ingredient prep state, step stage, duration, temperature, readiness cue and “why” note. This supports both simple family recipes and precise baking formulas without making every entry form feel like a culinary-school worksheet.

Potential later types:

- `collection`: curated holiday, seasonal and occasion pages with editorial introduction and ordered recipes.
- `technique`: reusable explanation of a method, with photos or short Mux video, linked from a step.
- `siteSettings`: Tamar's bio, portrait, approved tagline and homepage picks.
- `translation`: English fields or linked localized documents after the editorial process is chosen.

## Data and engineering

- Build as static Astro pages from Sanity. Keep `useCdn: false` for publish-triggered rebuilds.
- When no Sanity ID is configured, use labeled demo data for local review. When an ID is configured, build from real documents and fail visibly on fetch errors.
- Optimize Sanity images through its URL builder. Keep original preview assets in `public/images` until Tamar supplies her photography.
- Generate canonical URLs, Open Graph tags, sitemap and `Recipe` JSON-LD only for real recipes.
- Preserve RTL layout throughout. English later needs translated metadata, ingredient and instruction text, language-specific routes, `hreflang`, and review by a human editor. Do not publish empty or automatic translations as finished pages.
- Keep taxonomy slugs stable and separate from Hebrew display labels after launch.
- Current in-page archive search is suitable for a small archive. Revisit search indexing, filtering and pagination as the archive grows.
- Sanity editorial preview, publish webhooks, image rights, final domain and accessibility audit are launch enablers. Review a short privacy notice if third-party media or analytics are enabled.

## Content workflow and quality gate

For every real recipe:

1. Tamar provides or approves the recipe and its origin.
2. Test cook with recorded ingredient quantities, yield, timings and equipment.
3. Check that the image shows the actual finished dish; add alt text and record image rights.
4. Record any important safety or doneness cue from a reliable source (for poultry, see the [USDA safe temperature chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart)); avoid unsupported nutrition, allergy or dietary claims.
5. Edit Hebrew for clarity and consistency; preview at phone and desktop widths.
6. Publish in Sanity, rebuild, verify the live URL, structured data and links.

Before public launch, replace every demo item, add Tamar's approved About copy and portrait, connect a real Sanity project and final site URL, and test the full archive and recipe flow on mobile.

## Suggested release sequence

1. **Foundation:** approved brand direction, photography, Tamar's voice, Sanity project, domain and site settings.
2. **Content launch:** Tamar manually enters and reviews the first migrated recipes; complete About copy and review SEO and accessibility.
3. **Discovery:** curated collections, expanded search and filters, related content rules.
4. **Cooking tools:** validated serving scaling, saved recipes, cooking mode and print refinements.
5. **English:** translated editorial workflow, locale routes and metadata.

## Editorial inputs still needed from Tamar

- Final tagline, portrait and personal story.
- Approved recipe text, quantities, original images and migration order.
- Meat/dairy/pareve classification for each recipe and any specific preparation notes needed for a kosher kitchen.



-----------------

add Vegetarian/Gluten-Free/Lactose-Free to Meat/dairy/pareve classifications avalable to choose for each recipe


search box/bar margins not aligned well on its overlay , it seems like 2 textboxes, instead of 1




got more feedback:
The site is good. The design is well above a typical family recipe site, and the Astro-routes / Svelte-UI split is clean. But there are real bugs, and a few of them only show up once you connect Sanity. That's why the demo looks perfect.

I installed and built it: `astro check` shows 0 errors and the demo build produces 12 pages. I also built it with a fake Sanity project ID to see what changes.

## Fix before launch (bugs)

1. **Hotspot/crop is ignored.** The schema turns on `hotspot: true`, but `queries.ts` only fetches `asset->{_id,url}, alt`. When Tamar sets the focal point in the Studio, the site won't use it. Add `hotspot, crop` to every image projection.
2. **The JSON-LD escape does nothing.** In `Layout.astro`, `.replace(/</g, '\u003c')` swaps `<` for `<`, because in a JS string `'\u003c'` *is* `<`. I checked: it outputs `"</script>"` unchanged. It should be `'\\u003c'`.
3. **The embedded `/studio` is probably broken.** `sanity.config.ts` reads `process.env.PUBLIC_…`, which doesn't exist in the browser. Use `import.meta.env`. For standalone `sanity dev`, the CLI only loads variables that start with `SANITY_STUDIO_`, and there's no `sanity.cli.ts`. Also, `@sanity/astro` requires `@astrojs/react` for the embedded Studio, and it isn't in your integrations. The Sanity-enabled build bundled fine, but I couldn't render `/studio` here, so check it.
4. **The whole `/recipes` page is hydrated.** `<RecipesPage client:idle>` breaks your own rule ("don't make the page component the hydration boundary"). Two effects:
   - Every recipe, including all ingredients, steps and tips, is serialized into the HTML (about 3 KB per recipe, so about 300 KB at 100 recipes).
   - The island imports `imageSrc`, which pulls `@sanity/client` into the browser. The island is 35 KB gzipped, mostly the Sanity client.

   Fix: a small `RecipeSearch.svelte` island that gets a slim index (title, slug, image URL, tags, ingredient names), with the grid rendered statically.
5. **Search doesn't match its own placeholder.** The box says "שם של מנה, **מצרך** או רעיון", but the filter only checks title, description and tags. Add ingredient names. Keep substring matching rather than a word-based engine like Pagefind: Hebrew prefixes (ו/ה/ב/ל/ש) break word matching, and `includes()` handles them.
6. **Slugs can end up in Hebrew.** `source: 'title'` plus Sanity's default slugify keeps Hebrew letters. When Tamar clicks "Generate" she'll get percent-encoded URLs. Add validation `/^[a-z0-9-]+$/`, or a custom `slugify`.
7. **Multi-paragraph text gets flattened.** `originStory`, `makeAhead`, `storage` and step `text` are `text` fields rendered in a single `<p>`, so Tamar's line breaks disappear. Either split on `\n\n` or make `originStory` Portable Text (the package is already installed and unused).
8. **Card link hides its content from screen readers.** `aria-label={recipe.title}` on the card `<a>` replaces everything inside it, so the time, difficulty and kashrut label are never read out. Remove the aria-label.
9. **Smaller visible issues:**
   - "בישול 0 דקות" shows on the salad (it's in your screenshot). Hide fields that are 0.
   - The hero `figcaption` just repeats the alt text, so screen readers hear it twice.
   - "מהמטבח לאחרונה" is really sorted featured-first, not by newest.

## Architecture

The stack fits a static site with a single editor, so keep it. Changes I'd make:

- **Publish → rebuild webhook.** This is the biggest operational gap. With static output, Tamar clicks Publish and nothing happens unless a Sanity webhook calls a Vercel or Cloudflare deploy hook. Set it up on day one, or she'll think the site is broken.
- **Put site copy in Sanity.** The About page, homepage headline and footer text are hardcoded, so Tamar can't edit her own story. Add a `siteSettings` singleton (with About as Portable Text).
- **Tailwind + shadcn is mostly overhead right now.** It amounts to one hand-written `Input` with hardcoded hex colors, while everything else is custom CSS plus Tailwind's preflight. Either use it properly or remove it. I'd remove it; your CSS tokens already work. but if you want to keep it than use it properly its good also
- **The CSS is written as minified one-liners** (`.a{..}.b{..}` in every `<style>` block). That will be painful to maintain. Run Prettier over it; it's already a devDependency and just needs a script.
- **Schema fields the site never renders:** `quantity`, `grams`, `ovenTemperatureC`. Fields that do nothing confuse the editor. Render them or hide them.
- **Tags are free text.** They'll drift ("שבת" vs "לשבת", which is already in the demo). Use a predefined list or references.
- **Label mappings are duplicated.** Difficulty and kashrut labels exist in both `RecipeCard` and `RecipePage`; move them to one `lib/labels.ts`.
- **Fonts.** Google Fonts loads through `@import` inside CSS, which chains render-blocking requests. Self-host with Fontsource or Astro's fonts API. Also, `--font-serif` is Heebo, which is a sans-serif; rename it.
- **Repo hygiene.**
  - `background-context.md` is a chat transcript that still talks about the Olympic site; move it to `docs/`. dont delete
  - `AGENTS.md` is generic Astro boilerplate. Put your actual conventions there (the .astro/.svelte boundary and the hydration rules), since that's what an agent working on this will read.

## Features you're missing

Most of these are small:

- **Keep the screen on (Wake Lock).** Your target user is on a phone with messy hands, and this is the most useful kitchen feature. It's a tiny `client:visible` island.
- **Share to WhatsApp** (Web Share API). In an Israeli family, this is how recipes actually get passed around.
- **Sticky ingredient list** on desktop, so it stays in view while scrolling through the steps.
- **A print button.** You already have print CSS, but nobody finds Ctrl+P.
- **A way to mark Passover recipes.** For a kosher site, "כשר לפסח" is a filter people really need. Add it as a boolean or as part of occasion collections (שבת, חגים), which are already on your roadmap.
- **Better related recipes.** Right now they're same-category only, so a category with one recipe shows nothing. Fall back to shared tags.
- **Basics that are missing:** a Hebrew `404.astro`, `robots.txt`, and JSON-LD `dateModified` (from `_updatedAt`) plus `BreadcrumbList`.
- **Homepage design:** the hero, the featured section and the category tile all show the same recipe photo (three chickens on the home page). The featured section should use a different recipe than the hero.
- **Mux:** it's paid per video. If Tamar will only post a handful of videos, an unlisted YouTube embed costs nothing. Worth a quick look before she uploads. so youtube is better and not paid , as i thought mux is free , so youtube embed support is must

What's already right: static output, the demo recipes are noindexed and excluded from JSON-LD, the build fails loudly on Sanity fetch errors, Mux loads only on recipes that have a video(we need free unlisted YouTube embed support too as main video provider , mux is 2nd as its not free ), the mobile nav uses `<details>` with no JS, and the checkboxes and print styles also work without JS.



Sanity Studio is Tamar’s editing interface. You’re right: it can be hosted by Sanity at a *.sanity.studio address, with Sanity handling sign-in and access. I’ll remove the embedded /studio route and React integration from the Astro site, and keep the Studio schema and deployment config in this repo


--------------

got more feedback:

Yes, it's much better. Every issue from my first review is fixed, and several are fixed better than I suggested. Removing the embedded /studio and deploying the Studio on Sanity's own hosting is the right call.

I ran it: pnpm check passes (0 errors, and the schema check passes), the build produces 13 pages including the 404, and a build with a Sanity project ID gets through bundling. It only stopped at the content fetch, because my sandbox can't reach Sanity.

What improved:

The /recipes search script dropped from 35 KB to 1.7 KB gzipped. It now gets a slim list of recipes instead of the full documents, and the grid is plain HTML that works without JS. The Sanity client no longer ships to the browser.
Earlier bugs are fixed: hotspot/crop in all image queries, the JSON-LD escaping, Latin slugs (Hebrew→Latin slugify plus validation), line breaks in long text fields, the card link's aria-label, the "0 דקות" rows, and the alt text repeated as a caption.
New pieces are all there: the siteSettings singleton (with the Studio structure hiding "create new"), About as Portable Text, sticky ingredients, the Wake Lock / share / WhatsApp / print buttons, the Passover and dietary filters, related recipes that fall back to shared tags, robots.txt that blocks crawlers until a real domain is set, the 404 page, and BreadcrumbList.
Housekeeping: Tailwind and shadcn are gone, Fontsource is self-hosted, Prettier is configured, AGENTS.md is specific to this project, and docs/deployment.md covers the webhook.
Details I liked: a meat recipe can't be marked vegetarian, the Wake Lock turns back on when you return to the tab, and the About page stays noindexed until Tamar writes it.

What's left (all small):

pnpm format:check fails on RecipePage.svelte and scripts/check-schema.mjs. Run pnpm format and add format:check to check so it can't slip again.
The YouTube link check rejects valid links. m.youtube.com/watch?v=… and watch?si=…&v=… both fail, and Tamar copying from her phone is exactly how she'll get those. Your youtubeVideoId() parser already handles them, so use it in the validation instead of the regex.
Multi-word search misses. The whole query is one substring, so "עוף לימון" finds nothing unless those words are adjacent. Split the query on spaces and require every word to match.
The homepage category tile check only works on demo data. It compares localSrc, so with real Sanity images the hero photo can repeat in a category tile. Compare image.asset._id too.
The headline lost its accent colour. homeHeadline is now a plain string, so the orange "בבית." from the design is gone. Accenting the last word automatically, or allowing a simple *word* marker, would bring it back.
Print view: also hide .recipe-video (the iframe prints as an empty box) and .recipe-jump.
check-schema.mjs only fails if a whole schema type is missing. It should also fail when Sanity reports any validation problem with severity error.
Optional: on phones, Share and WhatsApp do the same thing. Showing WhatsApp only when navigator.share isn't available would slim down the fixed bar.

main dishes category has no picture like the rest of categories


and this site should also be good for search crawlers and ai agents to read/fetch , not only users with keyboard/mouse/screen..


None of these block launch. 
What's left is the content work: set up the Sanity project and webhook, have Tamar enter her recipes and photos, and set the domain.


make sure videos work:
https://www.youtube-nocookie.com/embed/440C7o_ZD8Y
no error 153 / https://support.google.com/youtube/answer/171780#zippy=%2Cprovide-a-http-referer-header-to-enable-video-playback

<iframe width="560" height="315" src="https://www.youtube.com/embed/440C7o_ZD8Y?si=wS0HQw5exvjbSST-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

  {#if youtubeId}<div class="recipe-video">
          <h2>צופים ומכינים</h2>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={`וידאו: ${recipe.title}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>



i tested the model with few recipes,
These recipes are a good stress test. There are about 20 of them, from מג׳דרה and crepes up to a 3-day pizza, מילפיי, Wellington, bolognese and פלוב. They break the current model in about eight specific places. The fix is *optional* structure plus a page that hides detail by default, so a simple salad still renders as the clean page it is today.

## Where the current model falls short

| What the recipes do | Example from the file | What the site has today | What to add |
|---|---|---|---|
| **Components with their own ingredients *and* steps** | Wellington: crepe, duxelles, pastry, wine sauce. קובה: shell, filling, soup | Grouped ingredients, but steps are one flat list; `stage` is only a label | `components[]`, each with a title, ingredients, steps and an optional link to another recipe. Put a jump list at the top |
| **Reusable base recipes** | The crepe shows up alone *and* inside Wellington. Pastry cream in מילפיי. Tomato sauce in pizza | Nothing | A component can reference another recipe ("see: קרפ בסיסי") instead of copying it |
| **Versions of the same dish** | Passover pizza on matzah, with or without gelatin, red vs white wine, "classic Tripolitan version" vs "Royal" | One `substitutions` text box | `variations[]`: {title, when to use it, what changes}. Show them as small cards or tabs. A full Passover version gets its own recipe, linked both ways |
| **Work spread over days, with things done in parallel** | Pizza takes 3 days. Vanilla steeps overnight. "Day before: duxelles, crepes, sauce". Crispy onions fry "while the rice cooks" | Prep, cook and rest minutes add up to one total | `timeline[]`: {label like "יום לפני" or "45 דק׳ לפני ההגשה", tasks}. The page shows "active 45 min · total 3 days" instead of "4,380 דקות" |
| **Ranges instead of single numbers** | "3–4 שעות", "38–45 דקות", "550–600 גרם" | Times are single numbers | Time fields become min/max. Amounts are already strings, so they're fine |
| **Oven mode matters** | Cheesecake says "not turbo, it dries it out". Wellington: "200 turbo or 210 regular" | Only a temperature | `ovenMode` (טורבו / עליון-תחתון / גריל), on the recipe and on each step |
| **More than one doneness target, plus carryover** | Wellington: take out at 48–50, rests up to 55–58; medium 56–58; safe 63. Fish: 54–56 chef-style vs 63 safe | One `donenessTemperatureC` | `doneness[]`: {level, take-out temperature, final temperature, note}. Show the safe line next to the chef's line |
| **One ingredient used in several steps** | "50 g butter (25 for frying, 25 for the sauce)", "½ cup oil, split in two" | A free-text note | A "split" note on the ingredient. Optionally, an ingredient reference inside a step that shows just "25 גרם חמאה", not the full ingredient line (see the warning below) |
| **Common mistakes, and the few rules that matter most** | "❌ בשר רזה מדי…", "חוקי ברזל", "הסוד הכי חשוב במנה" | Only `tips` | `pitfalls[]` and `keyRules[]` (at most 3). The key rules go in a "before you start" box above the ingredients |
| **Required vs optional equipment** | מילפיי lists 10 required tools and 7 optional ones. Thermometer "not required but…" | One flat list | `{name, required}` |
| **Storage and reheating** | "fridge 3–4 days, freezer 3 months, flat in bags, reheat with a little stock". Cheesecake: "never serve it cold from the fridge" | Free text | Structured fridge / freezer / reheat fields. Keep the free text as a fallback |
| **What to serve with it** | מג׳דרה with chopped salad and tahini. Which pasta goes with bolognese. Fish with mash and green beans | Related recipes chosen by score | A hand-picked `servedWith[]` of recipe links, plus free text |
| **Pan size and yield in pieces** | 24 cm pan, 30×20 tray, 28–30 cm skillet, 30 kubbe, 36 cookies, 4 balls of 250 g | Servings plus `yieldText` | `panSize` and `yieldCount + yieldUnit`. Later, pan size is also what makes scaling work for baking |
| **Several sources and videos** | Bolognese and pizza cite 4 to 9 sources. Fish has 3 videos to watch before cooking | One `sourceCredit`, one YouTube link | `sources[]` {title, url} and `videos[]` |
| **Kosher adaptation notes** | "What changed: no milk → +150 g meat, more oil. No pancetta → chicken liver". Crepe instead of prosciutto. Pareve margarine in the meat sauce | Nothing | A `kosherAdaptation` text shown as "איך הפכנו את זה לכשר". This is also Tamar's most interesting content |
| **Passover is more than yes/no** | "כשר לפסח **לספרדים**". מג׳דרה is rice and lentils (קטניות). "Cornflour for Passover" | `passover: boolean` | `passover: none / all / kitniyot-only`, plus a short Passover note |
| **Israel-specific warnings and brands** | "Koshered meat is very salty, be careful". Knorr stock turns salty after 3 hours of reducing. Mutti, Maimon's leaves, Tiv Taam | Ingredient `note` | The note is enough. Just use it consistently |

A warning about linking ingredients inside steps: the pizza and shakshuka exports show what goes wrong when ingredient text is inserted automatically. You get "הוסיפו את 2 pieces שיני שום קטנות, פרוסות שקוף כמעט שום פרוס". If you add it, a step should show only a short name and amount, and Tamar should write the sentence herself.



## Recipe page features

1. **A short view and a full view.** In the מילפיי thread you ended up writing "המתכון הסופי בקיצור" yourself. That's the feature. Add a toggle: the short view hides the "why" notes, the pitfalls and the research, and shows only ingredients and plain steps. A simple recipe has no toggle, because there's nothing to hide.
2. **Collapse the "why".** Render each "why" as a `<details>` element. The reasoning in these recipes is valuable, but it can triple the page length.
3. **Cooking mode.** One step at a time, large text, and it keeps the screen on (the Wake Lock you already have). It also remembers your place, stored per recipe in the browser, which matters when you're 2.5 hours into a bolognese.
4. **Several timers at once.** Plov, מג׳דרה and Wellington all have things running in parallel. A step with `durationMinutes` gets a "start timer" button, and several timers can run together. This fits in a small island, a few KB.
5. **"When do I start?"** Enter the serving time and the page works backwards through the timeline: "Serve 20:00 → start the dough Wednesday 21:00". It's cheap to build and changes everything for the pizza, cheesecake (3 h cooling) and Wellington (the "מוצאי שבת" planning in your file).
6. **Jump list by component** in the sticky sidebar for long recipes (Duxelles · Crepe · Wrapping · Baking · Sauce).
7. **Progress checkboxes on steps**, the same idea as the ingredient checkboxes you already have.
8. **Show both units**, e.g. "60 גרם (½ בצל בינוני)", "1 כוס (200 גרם)". The `grams` field already supports this. For baking recipes, put grams first.

## Content workflow

- **The file is research, not a recipe.** It has chat back-and-forth, citation clutter (`[Wikipedia][1]`, `utm_source=chatgpt`), and claims like "ברמת מישלן", "הכי טוב בעולם" and "האקדמיה 2023". Publish only what Tamar actually cooked, in her words. Put the research in `sources[]` and "credit to the inspiration", not in the recipe text. Your own plan's quality gate already says this.
- **Keep what she learned from cooking it.** Notes like "בסוף קצת מוסקט וסומק", "לא להגזים עם השום" and "הבזיליקום אחרי התנור" were added after actually making the dish. That's the most trustworthy content in the file. Give it its own field, "מה למדתי כשהכנתי", separate from tips.
- **Entering these by hand in the Studio will hurt.** Wellington is about 40 ingredients across 4 components. Consider a Studio action that takes pasted text and fills a *draft* with ingredients, steps and components using an LLM, for Tamar to review and fix. She never publishes the raw output. For her this is probably worth more than any feature on the site itself.
- **Keep the language consistent.** Recipes switch between "מערבבים", "ערבב" and "ערבבו", and mix English units ("2 tablespoons"). Pick one voice (the "מערבבים" form you already use) and one set of Hebrew units.

## Suggested order

1. **Schema, all optional:** `components`, `variations`, `timeline`, time ranges, `ovenMode`, `doneness[]`, `pitfalls` and `keyRules`, the 3-level `passover`, `kosherAdaptation`(all recipes in our site are already kosher), `sources[]`, `servedWith[]`.
2. **Page:** the short/full toggle, collapsible "why", jump list by component, units shown both ways.
3. **Interactive tools:** cooking mode with remembered progress, multiple timers, the "when do I start?" calculator.
4. **Studio:** the paste-to-draft import.


see that there are no leftovers from olympic site starter


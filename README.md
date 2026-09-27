# אתר המתכונים של תמר

**Tamar Recipes** is a Hebrew-first, right-to-left recipe site built with Astro 7, Svelte 5, and Sanity. It is designed for Tamar to publish her own tested recipes and for readers to use them while cooking: clear ingredients and steps, practical timing, and optional kitchen tools.

> **Project status:** The site and editor schemas are implemented. Without a Sanity project ID, the repository builds with clearly labeled sample recipes. Those pages are `noindex`, and `robots.txt` disallows crawling. A public launch still needs Tamar-approved recipes and photos, a Sanity project, a final domain, and a publish-to-rebuild webhook.

## What is included

- **Recipe discovery:** category pages, a searchable archive, and filters for vegetarian, gluten-free, lactose-free, and Passover recipes. Search includes ingredient names and supports Hebrew substring matching.
- **Cookable recipe pages:** grouped ingredients, component recipes, numbered steps, a short/full reading view, related recipes, print styles, and lazy YouTube embeds. Mux is available as an optional video source.
- **Kitchen tools:** serving scaling, original/metric/US customary measures, multiple timers, a serving-time planner, cooking mode with saved progress, screen Wake Lock where supported, and sharing. Numeric ingredients scale; free-text amounts and notes stay as Tamar wrote them.
- **Detailed editing model:** Sanity fields for time ranges, equipment, oven and burner settings, doneness targets, timelines, variations, storage, sources, kosher adaptations, and Tamar's own cooking notes. Simple recipes can leave advanced fields empty.
- **Static publishing and draft preview:** crawlable published recipe HTML, canonical and social metadata, Recipe and Breadcrumb JSON-LD, `robots.txt`, `llms.txt`, and a sitemap when real content and a live site URL are configured. An authenticated Vercel function lets Tamar preview saved drafts in Sanity Presentation before publishing.

The public site has no accounts, comments, contact form, or embedded administration route. Sanity Studio is deployed separately and uses Sanity's editor sign-in.

## How it works

| Layer    | Responsibility                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------- |
| Astro    | Routes, build-time Sanity queries, static pages, metadata, and structured data                    |
| Svelte 5 | Page views and reusable interface components; only search and recipe tools hydrate in the browser |
| Sanity   | Recipe, category, and site settings documents; a separately hosted editing Studio                 |
| Video    | YouTube embeds first; optional Mux video when a recipe has no YouTube video                       |
| Styling  | Project CSS tokens and self-hosted Assistant and Heebo fonts                                      |

Publishing a Sanity document does not change an already deployed static page. A Sanity webhook must call the hosting provider's deploy hook to rebuild the site. Draft previews read Sanity on request and do not wait for a rebuild.

## Set up with an agent

For cooks who do not code, open the repository folder in a desktop coding agent and give it one setup request. The agent should install or guide you through installing the prerequisites, connect the accounts, configure this existing project, and deploy it. You handle sign-in, two-factor checks, and approvals on the providers' own pages; you do not need to edit code. See the [agent setup guide](docs/agent-setup.md) for the full flow.

| Agent | Fit for this setup | Trade-off |
| --- | --- | --- |
| **Codex desktop app — recommended** | Free ChatGPT accounts include limited Codex usage. Open the local project folder and let the agent work with its files and terminal; it is a chat-style coding agent, not an IDE you need to use. | Free usage is limited and varies by account and task. |
| **Claude Code Desktop** | Dedicated Code workspace for a local project, with visible changes and approvals. | Claude Code requires a Pro/Max subscription or billed Console access, so it is not the free choice. |
| **Cursor Agent** | Free Hobby tier includes limited Agent requests and no credit card is required. The project skill is discovered automatically. | Cursor is a code editor/IDE, which adds interface non-coders may not want. |
| **Grok Build on web** | Available on Grok plans; describe an app and publish it from chat. | It builds and hosts a Grok app, then can export it to GitHub. It is not the direct path for setting up this existing repo on Vercel with Sanity. |

### Performance, app vs CLI, and context

A same-model comparison is more useful than comparing each vendor's best model. On Composio's 30-task harness benchmark, Codex and Claude Code both ran GPT-6 Astra: Codex passed 21/29 tasks (72.4%) and Claude Code 20/29 (69%). The page does not show matched reasoning effort or repeated trials, so treat this as a near tie rather than proof that one agent is better. It does not compare the free plans or Cursor Hobby. The recommendation above is based mainly on setup fit and access, not a claimed coding-performance win. ([benchmark and method](https://composio.dev/bench/compare/harnesses))

The desktop app is the easiest way to open the project folder, give the prompt, watch progress, and approve changes. A CLI runs in a terminal and is better for developers who want scripts and direct command control; the owner should not have to use it for this setup. The app and CLI can have different session histories and available tools even when they use the same agent. Give either one the repository root so it can find `AGENTS.md`, the setup skill, and project files. The agent's working context comes from that folder, the prompt, the selected skill, and its current conversation; switching to a cloud workspace or another folder changes what it can see.

Copy this prompt into the agent after opening the repository:

> I’m a cook, not a developer. Set up and deploy this recipe site for me by following `docs/agent-setup.md` and using the `recipe-site-setup` skill if available. First inspect the project and tell me what is already done. Check whether Node.js 22.12+, Git, and pnpm 10.17.0 are installed; install or guide me through installing anything missing, using the official instructions for my computer. Then help me create or sign in to GitHub, Vercel, and Sanity, connect them, deploy the public site and its existing Sanity Studio, and verify publishing triggers a site rebuild. Do the file and command work yourself. Explain each step simply and pause only when I need to sign in, approve access, choose an account/hostname, or approve recipe content. I will enter passwords, verification codes, tokens, and deploy-hook URLs directly in the provider's own pages; never ask me to paste them into chat or put secrets in code or scripts. Keep sample content noindexed until I approve the real site for launch. Start with the earliest incomplete step and preserve anything already configured.

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
| `SANITY_STUDIO_PREVIEW_URL` | Studio            | HTTPS origin of the site shown in Sanity Presentation                                      |
| `SANITY_READ_TOKEN`       | Preview function  | Server-only Sanity Viewer token for reading drafts                                        |
| `PREVIEW_SECRET`          | Preview function  | Server-only signing key for short-lived preview sessions                                  |

Treat `PUBLIC_*` values as public and never put secrets in them. When a real Sanity ID is configured, a content fetch error fails the build instead of silently showing sample recipes.

## Commands

| Command              | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `pnpm check`         | Check formatting, Astro and Svelte types, Sanity schemas, and recipe behavior |
| `pnpm build`         | Generate static pages and the Vercel preview function                         |
| `pnpm preview`       | Preview a completed build locally                                             |
| `pnpm format`        | Format Astro, Svelte, TypeScript, and CSS source                              |
| `pnpm format:check`  | Check formatting without changing files                                       |
| `pnpm sanity:dev`    | Run the Sanity Studio locally                                                 |
| `pnpm sanity:deploy` | Deploy the Studio to Sanity hosting                                           |

## Content and publishing

The core Sanity documents are `recipe`, `category`, and the `siteSettings` singleton. Tamar enters recipes manually from her previous site; this repository does not import the old Ghost content or preserve its URLs. Each published recipe should use Tamar-approved text and photography. See the [editorial guide](docs/editorial.md) for entry rules, tested quantities, dietary and Passover labels, and review before publication.

Serving changes use numeric ingredient quantities and any known gram or milliliter equivalents. Original amounts remain in static HTML for readers and crawlers, and on live recipes they are also used in JSON-LD. Printing works without JavaScript. Converted measures are approximate where household and US customary units differ; the interface does not infer an ingredient's mass from its volume.

For launch, deploy with Vercel's Astro preset, set `PUBLIC_SITE_URL` to the final HTTPS origin, and connect a Sanity publish webhook to the host's deploy hook. Configure the server-only preview secrets and Studio preview origin. Verify the built pages, draft preview, indexing controls, and video playback on the final domain. The [deployment guide](docs/deployment.md) covers the steps.

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

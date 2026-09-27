# Set up your recipe site with an AI agent

This guide helps an AI coding agent configure this recipe site for you. It keeps the existing Astro site in the repository root and deploys Sanity Studio separately to Sanity hosting. It does not create a second Studio project or add an admin page to the public site.

You will still need accounts with a Git provider, Vercel, and Sanity. The agent can guide you through each service and do the project setup, but you must sign in and approve account access yourself. Never paste passwords, login codes, API tokens, deploy-hook URLs, or preview secrets into the chat.

## Start with your agent

Open the repository folder in an agent that can read and edit files and run terminal commands. If it supports Agent Skills, ask it to use `recipe-site-setup`. Otherwise paste this request:

> Set up this recipe website for me by following `docs/agent-setup.md`. First inspect the repository and tell me what stage it is at. Use the Sanity schemas and Studio already in this repository. Guide me through account sign-in and dashboard steps in plain language, and handle local setup and commands yourself where possible. Stop when you need my sign-in, an account decision, or editorial approval. Never ask me to paste a password, login code, API token, deploy-hook URL, or preview secret into chat. Do not put secrets in source files or scripts. Keep the sample content noindexed until I have reviewed and approved my real recipes.

The agent should begin by running:

```sh
node scripts/setup-check.mjs
```

This reports setup status without printing environment variable values. It may say a setting is present or missing; it never reveals a token or secret.

## Guided setup flow

The agent should check which steps are already complete and continue from there. You do not need to repeat completed setup.

### 1. Preview the sample site

Install the dependencies and run the Astro site so you can see the design before connecting accounts. The sample recipes are for preview only. Keep them noindexed until you have replaced them with content you approve.

The agent should confirm the Node.js and pnpm requirements from `package.json`, explain any missing prerequisite, then start the local site using the repository's development instructions.

### 2. Put the source in your Git provider

If you already have a GitHub, GitLab, or Bitbucket account and the repository is connected, keep using it. Otherwise the agent can explain how to create an account and put this repository there. You sign in and approve access in the provider's own page.

### 3. Deploy the public website

Import the repository into Vercel with the Astro preset. The Astro app lives at the repository root. Use `pnpm build`; let the Astro Vercel adapter choose its output. Do not set the output directory to `dist`.

The first deployment can use sample content and should remain noindexed. The agent should inspect the current Vercel settings before asking you to add or change anything, and explain which values are public configuration and which are secrets.

### 4. Connect Sanity

Create or select a Sanity project and a public dataset, normally named `production`. Give the agent the project ID and dataset name; these identify the project and dataset and are not access tokens. The agent can set the matching local and Vercel configuration values and make sure the Studio uses the same project and dataset.

This repository already contains the Studio configuration and recipe, category, and site settings schemas. Do not run `npm create sanity`, create a sibling Studio folder, or replace these schemas with a clean starter Studio. The Studio source is in this repository; its deployed editor lives at its separate `*.sanity.studio` URL.

### 5. Deploy the Studio

The agent should check the existing Studio configuration, then use the Sanity CLI from the repository root. It may ask you to sign in through Sanity's own authentication flow and choose an available Studio hostname. The agent should deploy the existing Studio to Sanity hosting and report its URL.

### 6. Connect publishing to rebuilds

Create a Vercel Deploy Hook for the production branch, then a Sanity webhook for the `production` dataset. The Sanity webhook should send `POST` requests for published create, update, and delete events, using this filter:

```groq
_type in ["recipe", "category", "siteSettings"]
```

Leave draft events unchecked. The deploy hook URL is a credential: enter it directly in Sanity's dashboard, not in the agent chat, repository, or script. The agent can tell you exactly where it goes and help verify a test publish.

### 7. Optional: set up draft preview

Published content and editing work without draft preview. If you want to preview saved drafts beside the Studio editor, configure the preview URL and CORS settings as described in the preview section of `docs/deployment.md`.

Create the Sanity Viewer token and `PREVIEW_SECRET` yourself, then enter each directly into the appropriate provider dashboard. Do not send either value to the agent or save them in source files. Redeploy the Vercel site and Sanity Studio after their preview configuration changes.

### 8. Add content and launch

Create **פרטי האתר**, categories, and Tamar-approved recipes in Studio. Add original photos with accurate alt text. Use the editorial guide for recipe entry and review. Publish a test update and confirm it triggers a Vercel build and appears on the public site.

Keep the site noindexed until the owner approves the public content and launch address. Before launch, confirm the canonical URL, `robots.txt`, sitemap, and recipe pages use the intended public domain.

## For developers

The website and Studio are configured in one repository:

| Part                             | Location and hosting                                   |
| -------------------------------- | ------------------------------------------------------ |
| Astro public site                | Repository root; Vercel                                |
| Sanity Studio source and schemas | Repository root; deployed to Sanity hosting            |
| Public recipe data               | Sanity `production` dataset, read at build time        |
| Draft preview                    | Vercel function, enabled only with server-side secrets |

Useful commands are `pnpm install --frozen-lockfile`, `pnpm sanity:dev`, `pnpm sanity:deploy`, `pnpm check`, and `pnpm build`. Read `docs/deployment.md` for provider settings and `docs/editorial.md` for content requirements. This guide is the agent-oriented flow; existing project documentation remains untouched.

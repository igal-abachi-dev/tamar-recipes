# Set up your recipe site with an AI agent

This guide helps an AI coding agent configure this recipe site for you. It keeps the existing Astro site in the repository root and deploys Sanity Studio separately to Sanity hosting. It does not create a second Studio project or add an admin page to the public site.

You will still need accounts with a Git provider, Vercel, and Sanity. The agent can guide you through each service and do the project setup, but you must sign in and approve account access yourself. Never paste passwords, login codes, API tokens, deploy-hook URLs, or preview secrets into the chat.

## Start with your agent

Open the repository folder in a coding agent that can read and edit local files and run terminal commands. For a nontechnical owner, use a desktop app such as Codex, Claude Code Desktop, or Factory App; choose one already covered by your subscription if possible. If it supports Agent Skills, ask it to use `recipe-site-setup`. Otherwise paste this request:

> I’m a cook, not a developer. Set up and deploy this recipe site for me by following `docs/agent-setup.md` and using the `recipe-site-setup` skill if available. First inspect the project and tell me what is already done. Check whether Node.js 22.12+, Git, and the repository's pnpm version are installed; install or guide me through installing anything missing, using the official instructions for my computer. Then help me create or sign in to GitHub, Vercel, and Sanity, connect them, deploy the public site and its existing Sanity Studio, and verify publishing triggers a site rebuild. Do the file and command work yourself. Explain each step simply and pause only when I need to sign in, approve access, choose an account or hostname, or approve recipe content. I will enter passwords, verification codes, tokens, and deploy-hook URLs directly in the provider's own pages; never ask me to paste them into chat or put secrets in code or scripts. Keep sample content noindexed until I approve the real site for launch. Start with the earliest incomplete step and preserve anything already configured.

The agent should first check the operating system and run `node --version`, `git --version`, and `pnpm --version`. If a prerequisite is missing, explain what it does and guide the owner through installing it from its official source. Read the required Node and pnpm versions from `package.json`; do not assume Node is already installed. The owner should only need to sign in and approve access in provider pages, not use the terminal or edit code. Once Node is available, the agent can run:

```sh
node scripts/setup-check.mjs
```

This reports setup status without printing environment variable values. It may say a setting is present or missing; it never reveals a token or secret.

## Guided setup flow

The agent should check which steps are already complete and continue from there. You do not need to repeat completed setup. It should perform the file and command work itself, explain what it is doing in plain language, and leave only sign-in, account choices, and recipe approval to you.

### 1. Prepare your computer

The agent checks Node.js, Git, and pnpm before running project commands. If any are missing or too old, it identifies your operating system and guides you through installing the right version from [nodejs.org](https://nodejs.org/) and [git-scm.com](https://git-scm.com/). It then verifies the versions and installs dependencies. You should not need to type or edit project code yourself.

### 2. Preview the sample site

Install the dependencies and run the Astro site so you can see the design before connecting accounts. The sample recipes are for preview only. Keep them noindexed until you have replaced them with content you approve.

The agent should confirm the Node.js and pnpm requirements from `package.json`, explain any missing prerequisite, then start the local site using the repository's development instructions.

### 3. Put the source in GitHub (or another supported Git provider)

If you already have an account and the repository is connected, keep using it. Otherwise, the agent guides you through creating a GitHub account and repository (or using GitLab/Bitbucket), then handles the Git setup and upload. You complete sign-in and approve access in the provider's own page. The agent should reuse an existing repository when possible instead of asking you to start over.

### 4. Deploy the public website

The agent guides you through creating or signing in to [Vercel](https://vercel.com/), then imports the repository with the Astro preset. The Astro app lives at the repository root. Use `pnpm build`; let the Astro Vercel adapter choose its output. Do not set the output directory to `dist`.

The first deployment can use sample content and should remain noindexed. The agent should inspect the current Vercel settings before asking you to add or change anything, and explain which values are public configuration and which are secrets.

### 5. Connect Sanity

The agent guides you through creating or signing in to [Sanity](https://www.sanity.io/), then creating or selecting a project and public dataset, normally named `production`. Give the agent the project ID and dataset name; these identify the project and dataset and are not access tokens. The agent can set the matching local and Vercel configuration values and make sure the Studio uses the same project and dataset.

This repository already contains the Studio configuration and recipe, category, and site settings schemas. Do not run `npm create sanity`, create a sibling Studio folder, or replace these schemas with a clean starter Studio. The Studio source is in this repository; its deployed editor lives at its separate `*.sanity.studio` URL.

### 6. Deploy the Studio

The agent should check the existing Studio configuration, then use the Sanity CLI from the repository root. It may ask you to sign in through Sanity's own authentication flow and choose an available Studio hostname. The agent should deploy the existing Studio to Sanity hosting and report its URL.

### 7. Connect publishing to rebuilds

Create a Vercel Deploy Hook for the production branch, then a Sanity webhook for the `production` dataset. The Sanity webhook should send `POST` requests for published create, update, and delete events, using this filter:

```groq
_type in ["recipe", "category", "siteSettings"]
```

Leave draft events unchecked. The deploy hook URL is a credential: enter it directly in Sanity's dashboard, not in the agent chat, repository, or script. The agent can tell you exactly where it goes and help verify a test publish.

### 8. Optional: set up draft preview

Published content and editing work without draft preview. If you want to preview saved drafts beside the Studio editor, configure the preview URL and CORS settings as described in the preview section of `docs/deployment.md`.

Create the Sanity Viewer token and `PREVIEW_SECRET` yourself, then enter each directly into the appropriate provider dashboard. Do not send either value to the agent or save them in source files. Redeploy the Vercel site and Sanity Studio after their preview configuration changes.

### 9. Add content and launch

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

### Picking an agent: app, CLI, and context

For this workflow, prefer a coding desktop app that opens the local project and can run terminal commands. Codex and Claude Code Desktop are good choices when the owner already pays for ChatGPT or Claude. Factory App is another local-project desktop option, but currently adds its own $20/month Pro subscription. Amp's web app can reuse a ChatGPT subscription on its free Hobby tier, but its agents run in a remote computer unless a local runner is configured. Cursor is an IDE, Grok Build targets app creation and hosting, and Oh My Pi is a customizable terminal tool; those are less convenient for a first-time cook setting up this existing repo.

The CLI can be better at command-heavy work because shell access makes it easy to run scripts, inspect output, and continue. A desktop app can be just as capable when it provides the same terminal and project tools, while making changes and approvals easier to follow. CLI versus app does not inherently change the model's context-window limit. The model and account plan set that limit; the interface changes which files and tools are available and how much instruction/history overhead is sent. A lean CLI may leave more room for project context, while an app may add useful visual review or browser tools. For either one, open the repository root and ensure terminal access is enabled. Avoid giving a setup agent broad access to personal mail, banking, or messaging accounts; it only needs the project and provider sign-in steps required here.

Do not claim there is a definitive harness winner from vendor coding scores. Available comparisons rarely control the model, reasoning effort, task set, and repeated trials at once. The benchmark linked in the README uses the same model for Codex and Claude Code but is a small run, so it is only a rough signal.

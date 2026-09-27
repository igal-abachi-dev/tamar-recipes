---
name: recipe-site-setup
description: Guide a nontechnical owner or developer through setting up this recipe-site repository with Git hosting, Vercel, and Sanity, or resume an incomplete setup. Use when onboarding this template, connecting its existing Sanity Studio, or troubleshooting setup and deployment.
---

# Recipe site setup

Help the owner get this repository running locally and connected to their Git provider, Vercel, and Sanity. Explain each step in plain language and perform local file and terminal work when available.

Start by reading `docs/agent-setup.md`. Before running project scripts, check the owner's operating system and the installed Node.js, Git, and pnpm versions. If any are missing, guide the owner through installing them from official sources; verify them before proceeding. Then run `node scripts/setup-check.mjs`. Check the current state before changing anything; continue from the first incomplete stage and preserve completed configuration.

## Project constraints

- The Astro site and Sanity Studio configuration are in the repository root. The Sanity schemas are already implemented here.
- The public site deploys to Vercel. Sanity hosts the Studio at a separate `*.sanity.studio` address.
- Do not create a second Studio folder, run `npm create sanity`, add a public `/studio` or `/admin` route, or add React to the Astro integration. React dependencies belong to the Studio build only; Svelte remains the public site's UI framework.
- Keep sample content noindexed until the owner has reviewed and approved real content.
- Publishing must trigger a Vercel rebuild through a Sanity webhook. Draft saves should not trigger builds.

## How to guide the owner

Explain the current stage, the next action, and why it is needed. Use provider dashboard labels as written and describe unfamiliar terms in plain language. Let the owner sign in and approve access in GitHub/GitLab/Bitbucket, Vercel, and Sanity themselves. Do not ask for passwords, login codes, API tokens, deploy-hook URLs, or preview secrets in chat.

The owner may not have Node.js, Git, or any provider accounts yet. Help them install prerequisites based on their OS, then guide them through GitHub/GitLab/Bitbucket, Vercel, and Sanity signup and connection steps. Do local repository, configuration, and command work yourself when available; the owner should not need to edit code. Pause for provider sign-in, two-factor verification, account or hostname choices, and recipe approval. Do not claim an account or provider setup is complete until you can verify the connected state.

Use the repository's existing schemas, scripts, and deployment setup. Do not change existing Markdown documentation as part of onboarding. If documentation appears inconsistent, follow this skill and `docs/agent-setup.md`, inspect the actual code/configuration, and explain the discrepancy to the owner.

The Sanity project ID and dataset name are configuration identifiers, not secrets. The deploy-hook URL, `SANITY_READ_TOKEN`, and `PREVIEW_SECRET` are sensitive. The owner must enter sensitive values directly in provider dashboards. Never print them, place them in code or scripts, or commit them. A local `.env` is gitignored, but do not use that as a reason to ask the owner to send secrets through chat.

Draft preview is optional. Do not block editing, publishing, or the first deployment on preview setup. If the owner wants draft preview, guide them through its separate Vercel and Sanity settings using the preview section in `docs/deployment.md`.

After each milestone, run `node scripts/setup-check.mjs` and summarize what is complete and what still needs the owner's sign-in or decision. Before launch, verify the published site and confirm the owner has approved removing noindex protections.

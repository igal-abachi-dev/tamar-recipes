# Launching אתר המתכונים של תמר

The public recipe and category pages are static. One Vercel function renders authenticated draft recipe previews on request. Sanity hosts the editing Studio separately at a `*.sanity.studio` address; there is no public admin route on the Astro site. Published recipe data is read from Sanity during each site build.

Before launch, Tamar needs to enter approved recipes, photos, and About copy. A real Sanity project, domain(optional, can use vercel), host, and publish-to-rebuild webhook must also be connected.

## Before the first public build

1. Create a Sanity project and public `production` dataset. Add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` to the website's build environment. Use the same values as `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` when deploying Studio.
2. Set `SANITY_STUDIO_HOSTNAME` to an available hostname prefix (for example `tamar-recipes`), or leave it blank and choose one when prompted. Run `pnpm sanity:deploy` from an authenticated Sanity CLI session. Sign-in and editor permissions are managed in Sanity. Do not add `/studio` or `/admin` to the public site.
3. In Studio, create **פרטי האתר** with the approved homepage text, About story and portrait. Create categories and Tamar-approved recipes. Enter Latin slugs, images with alt text, recipe classifications, ingredients and steps. Use **סרטוני YouTube** for videos; Mux remains optional.

4. Choose the final domain and set `PUBLIC_SITE_URL=https://your-domain.example` on the website host. Builds with the placeholder domain remain `noindex` and disallow crawling in `robots.txt`.
5. Build with `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build`. The Vercel adapter packages the static pages and preview function into `.vercel/output`. The project requires Node 22.12 or newer.

An [unlisted YouTube video](https://support.google.com/youtube/answer/157177?hl=en) is suitable for a public recipe page, but anyone with its link can watch and share it. Check that Tamar wants the video publicly viewable before adding it.

The build also writes `llms.txt` as a short map of the public static recipe pages. Full ingredients and instructions remain in each page's HTML and Recipe JSON-LD; the search and cooking controls are optional enhancements.


## step by step:
----
1. Deploy the public site to Vercel using the repo’s deployment guide. The site can go up before you have a Sanity account; it will use the demo content, which the project instructions say should stay noindexed.

2. Create a Sanity account and project. Keep the Studio on Sanity’s hosting; Vercel is only for the public website.

3. Connect the project to Sanity. Add the Sanity project ID and dataset where the deployment guide says, then redeploy the site on Vercel so Astro can build with Sanity content.

4. Deploy the Studio to Sanity’s hosting and use its URL to manage recipes.

5. Set up a Sanity webhook to trigger a Vercel redeploy when published content changes, since the site is statically generated.


## Hosting choice

### Vercel

Connect the repository to a Vercel project using the Astro framework preset. Set the build command to `pnpm build` and let the adapter provide `.vercel/output`; do not override the output directory with `dist`. Set `PUBLIC_SITE_URL`, `PUBLIC_SANITY_PROJECT_ID`, and `PUBLIC_SANITY_DATASET`. In project **Settings → Git → Deploy Hooks**, create a hook for the production branch.

The draft preview uses a Vercel function. A plain Cloudflare Pages static deployment can still serve the published pages, but it cannot serve the draft preview route from this configuration.

## 1. Deploy the public site to Vercel

You can do this before creating a Sanity account. The site will use demo content, which stays noindex until you configure the real domain and launch content.

Push the repository to GitHub if it isn’t there already. Vercel will import the project from GitHub.

Create a Vercel account at vercel.com and choose Add New → Project.

Import the tamar-recipes repository and select the Astro framework preset.

Set the build settings:
Build command: pnpm build
Node.js version: 22.12 or newer
Leave the output directory as Vercel’s default. The Astro adapter creates .vercel/output; don’t set it to dist.

Add the environment variables in the project setup, or afterward under Settings → Environment Variables:
PUBLIC_SITE_URL: leave unset until the real domain is ready.
PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET: leave unset until you create the Sanity project.

You can deploy the demo site without those values. Don’t add a Sanity token yet; it isn’t needed for this first deployment.

Deploy and wait for the build to finish. Vercel will give you a preview URL such as tamar-recipes-….vercel.app.

Open the Vercel URL and check that the site loads. At this stage it is a demo deployment, not the final public launch; it should remain noindex.

In Vercel, open Settings → Git → Deploy Hooks and create a hook for the production branch. Save the hook URL somewhere private. You’ll add it to Sanity later so publishing recipe changes triggers a rebuild.

Once the Sanity project and final domain are ready, add PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, and PUBLIC_SITE_URL in Vercel, then redeploy.


 skip both optional integrations in vercel , and continue with the project setup.

## web hook setup in vercel

The build finished and your site is live at sitename.vercel.app. You can create the hook now and save it for when Sanity is set up.

In Vercel, open the tamar-recipes project.

Go to Settings → Git.

Find Deploy Hooks and choose Create Hook.

Give it a name, such as sanity-production-publish.

Set the branch to main—that’s the branch Vercel built from.

Create the hook and copy its generated URL. Keep it private; because anyone with it can trigger a deployment.

Save the URL somewhere private. not git, and Later, in your Sanity project, create a webhook for the production dataset and paste the Vercel URL as its destination. 
Configure it to use POST and trigger on create, update, and delete for published documents.



## 2. Create your Sanity account and project

Go to sanity.io and create an account. Sign in.



Open the Sanity project dashboard and create a project. 
choose knowledge base,
Give it a name such as Tamar Recipes.,
choose Astro


Are you adding Sanity to an existing site or app?
choose Yes(we have existing schema in code)


Are you migrating from another CMS?
choose, No, starting from scratch

Create a dataset named production and set its visibility to Public. The website needs to read published recipe data during each Vercel build. A public dataset lets it read that content without a token; Sanity explains that public datasets can be queried by anyone. Sanity datasets

In the project settings, copy the Project ID. Keep the project ID and dataset name handy. The dataset name is production.

## 3. Connect the project to Vercel

In Vercel, open the tamar-recipes project.

Go to Settings → Environment Variables.

Add these two variables, with Production selected as the environment:

    Name                        Value
   ━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━
    PUBLIC_SANITY_PROJECT_ID    Your Sanity Project ID
   ──────────────────────────  ────────────────────────
    PUBLIC_SANITY_DATASET       production

Save the variables.

Go to Deployments, open the menu for the latest production deployment, and choose Redeploy. If Vercel asks whether to use the existing build cache, either choice is okay here.

Wait for the redeploy to finish. That connects the website’s build to Sanity. The Studio still needs to be deployed separately in step 4, using the same Project ID and dataset.

Leave PUBLIC_SITE_URL unset until you have the final domain, as your guide instructs; or if domain is vercel.app , then add it, the site should remain noindex in the meantime. Don’t add SANITY_READ_TOKEN now—that is only needed if you later set up draft preview.



---------------
## studio setup:

The Sanity page gives a generic setup for projects where the website and Studio are separate sibling folders. Since your Vercel project is already connected to the tamar-recipes repo, we’ll keep the website where it is and add the Studio as a separate folder inside that repo:

tamar-recipes/
├── Astro website
└── studio-tamar-recipes/

That keeps one GitHub repo. Vercel continues building the Astro site; Sanity hosts the Studio at its own *.sanity.studio address. The Studio folder is its source code, not a second site on Vercel.

The Sanity prompt also asks an agent to configure the Astro app. Since your site already has Sanity environment variables and a deployment setup, we should adapt that prompt: create the Studio and its recipe schemas to fit the existing site, without replacing the existing Astro setup.

One correction: I haven’t verified whether pnpm sanity:deploy exists in your repo, so we should check the scripts before relying on it. The Sanity dashboard’s generic command creates a clean Studio, but the Studio still needs the recipe and category schemas this site expects before Tamar can use it.



Create a Sanity Studio in a folder next to your existing app. Then paste the prompt into your agent to define your schema and set up your app to query and render content from Sanity.
1
Create a new Sanity Studio with Sanity CLI
Run this snippet in your terminal from the folder that contains your app folder — one level above your existing app, not inside it. The Studio is a separate React application, and this command initializes it in its own folder alongside your app.
See the documentation if you are having issues with the CLI.
npm create sanity@latest -- --project id --dataset production --template clean --typescript --output-path studio-tamar-recipes
2
Copy and paste prompt to your agent
Start your AI agent from the parent folder that contains both your app folder and the Studio folder. The agent needs to see and edit both. Then copy and paste this prompt into your agent to define your schema and configure your app.
Folder structure
parent-folder/ # run your agent from here
├── your-existing-app/ # your existing Astro app
└── studio-tamar-recipes/ # your new Sanity Studio



Agent prompt
Set up Sanity using the `sanity-best-practices` skill's `getting-started` reference.

https://github.com/sanity-io/agent-toolkit/blob/main/skills/sanity-best-practices/SKILL.md (has 3 references for it, in How to Use, section)
If the skill can't be found, install it by running `npx skills add sanity-io/agent-toolkit --skill sanity-best-practices -y`. If the install fails, stop and ask me to run it.

Context:
- Project: Tamar Recipes 
- Dataset: production
- Framework: Astro
- Project Type: Knowledge Base
- Connect Sanity to my existing Astro app — the Studio lives in `studio-tamar-recipes`, a sibling folder next to my app folder
- First, confirm `studio-tamar-recipes` and my app folder are both in your working directory. If you only see my app's source code, stop and ask me to restart you from the parent folder.
- If you're not sure which folder is my app, ask me
- Keep the Studio standalone — do not embed it in or move it into my app


---

Keep the repo as it is. Don’t run that npm create sanity command. It would generate a second, clean Studio folder. This repo already has a Studio configuration at its root, its recipe, category, and site settings schemas, and sanity and the sanity:dev and sanity:deploy scripts in package.json.

You also don’t need to rename folders or change Vercel’s root or build settings. Vercel keeps building the Astro site from the repo root. The existing Studio can be deployed separately to Sanity from that same root.


The plan is to use the schemas already in the repo, configure the Studio with your Sanity project ID and production dataset, then run pnpm sanity:dev and pnpm sanity:deploy from the repo root.

about updates:
npm install --global pnpm@10.17.0


pnpm 10.17.0 → 12.6.0: Keep 10.17.0 for this project. Its package.json pins pnpm@10.17.0, and the lockfile was created with pnpm 10. Vercel’s build log also shows it used pnpm 10.17.0, so this update notice doesn’t affect the Vercel deploy.

Sanity CLI 3.99.0 → 8.13.0: Don’t update it as part of setup. The project currently depends on Sanity 3.99.0; a major CLI update could require code or config changes. It doesn’t affect the successful Vercel deployment.

Continue with the installed versions for now.

Those notices don’t mean anything is expiring, and they don’t block the Studio deploy.

pnpm 10.17 → 12.6: Keep 10.17.0 for this project. The repo pins that version, and Vercel used it successfully in your build. Updating pnpm alone on your computer won’t update the repo’s pin or Vercel’s version. Vercel package manager settings

Sanity CLI 3.99 → 8.13: Don’t jump to the new major just to dismiss the notice. Your installed CLI is working; update Sanity packages later as a planned change, then check the Studio and site before deploying. This notice isn’t a deprecation deadline. Sanity CLI docs

There is one separate warning in your Vercel log: engines.node is set to >=22.12.0, so it can match future major Node versions. For predictable builds, set Vercel’s Node.js version to 24.x under Settings → Build and Deployment → Node.js Version. It meets the repo’s minimum and is an available LTS version


pnpm install --frozen-lockfile
pnpm sanity:dev

Open http://localhost:3333 to check the Studio. 
Then stop it with Ctrl+C and deploy it:


do login: 
pnpm exec sanity login

then:
pnpm sanity:deploy

Choose a hostname prefix for the Studio URL, for example:

tamar-recipes


------------


after The Studio deployed successfully

Next:


Connect the Vercel deploy hook in Sanity: 
in Sanity Manage, create a webhook for the production dataset. 

Paste in your private Vercel hook URL, set method to POST, select create, update, and delete, and use this filter:

_type in ["recipe", "category", "siteSettings"]

Leave drafts unchecked so draft edits don’t trigger builds.

Open the Studio URL and create פרטי האתר first, then categories, then Tamar-approved recipes and photos.

Publish a recipe and confirm Sanity triggers a Vercel build and the updated recipe appears on the site.

One launch detail: with PUBLIC_SITE_URL and the Sanity project ID set, the site’s current robots rules allow crawling. Since content is still being prepared, I recommend temporarily removing PUBLIC_SITE_URL from Vercel until the approved content is ready; add it back for launch.

## webhook sanity connection

In Sanity, open sanity.io/manage, select Tamar Recipes, then go to API → Webhooks → Create webhook. Sanity’s docs place webhook management in the project’s API settings. Webhook docs

Fill in:

Name: vercel-production-rebuild

URL: paste the private Deploy Hook URL you saved from Vercel

Dataset: production

HTTP method: POST

Trigger on: Create, Update, and Delete

Filter:

_type in ["recipe", "category", "siteSettings"]

Drafts: leave unchecked/off

Save the webhook. Keep its URL private.

## whats next

now the public site is on Vercel, the Sanity project and dataset are connected, Studio is deployed at name.sanity.studio, and the Sanity webhook is connected


 open your Studio and add content in this order:

פרטי האתר — enter Tamar-approved homepage and About copy, and the portrait with alt text.
Categories — settle each category’s Latin slug before publishing.
Recipes — add Tamar-approved recipes, photos with alt text, ingredients, and steps.



In Studio, fill פרטי האתר first, then categories, then Tamar-approved recipes, photos with alt text, and YouTube links. Publishing those documents should trigger Vercel to rebuild the static site.

Since PUBLIC_SITE_URL is set, the site can be crawled. If the content isn’t ready for search engines, temporarily remove that variable in Vercel and redeploy; restore it when you’re ready to launch.


You don’t need to add the Studio project ID or dataset to Vercel; 
those are for the local Studio build. 
and The webhook URL is stored in Sanity



Sanity automatically gives new projects a 30-day Growth trial. You won’t be charged just because the trial ends. If you don’t upgrade or add payment details, Sanity says the project automatically moves to Free. Growth trial details
The Free plan should work for this site: you have a public production dataset, and Free includes hosted Studio. At the end of the trial, you’ll lose Growth-only features such as scheduled drafts, comments, and private datasets. Regular editing and publishing can continue.
You can leave it as it is and let the trial expire


The two secrets belong in Vercel, but SANITY_STUDIO_PREVIEW_URL must also be present when the Studio is built and deployed to Sanity. I’ll add your Vercel site URL to the local ignored .env; then the Studio needs redeploying to pick it up.


SANITY_READ_TOKEN — use a Sanity token with Viewer access to production.
PREVIEW_SECRET — use a long, random secret.

Keep both server-only; don’t prefix them with PUBLIC_.

SANITY_STUDIO_PREVIEW_URL is different: Vercel setting it doesn’t configure the Studio you deployed on Sanity. I added https://tamar-recipes.vercel.app to your local .env for the Studio build. That file is Git-ignored. Now:

In Sanity Manage, go to Tamar Recipes → Settings → API settings → CORS Origins. Add https://tamar-recipes.vercel.app and enable Allow credentials.

From the repo root, run pnpm sanity:deploy again to publish the Studio with the preview URL.

Redeploy the Vercel production deployment so its server function picks up the new secrets. Vercel environment-variable changes apply to new deployments. Vercel environment variables

In the Studio, test תצוגה מקדימה with a draft recipe.

You also added SANITY_STUDIO_PREVIEW_URL in Vercel. It’s harmless there, but the local .env value is what the Sanity Studio deploy needs. Sanity requires the site origin in CORS for Presentation preview. Sanity Presentation setup, Sanity CORS settings




Those two Vercel fields need actual secrets. I didn’t fill them, and I can’t see their values. Don’t paste either value here.

Create the read token in Sanity: go to Sanity Manage → Tamar Recipes → Settings → API → Tokens → Add API token. Name it something like Vercel draft preview, choose Viewer, and save. Copy the token when Sanity shows it; it’s only displayed once. Sanity token instructions

In Vercel, open Settings → Environment Variables. Set SANITY_READ_TOKEN to that copied token.

Generate a separate random secret in PowerShell:

node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"

Set PREVIEW_SECRET to the output. Don’t use the Sanity token as this secret.

Select Production and Preview for both Vercel variables, save, and redeploy the latest production deployment. Vercel only applies changed variables to new deployments. Vercel environment variables


Sanity doesn’t need this secret. It sends a short-lived preview request to your site; the Vercel function uses PREVIEW_SECRET to sign the temporary preview cookie. Keep it private and out of Git.





 Running pnpm sanity:deploy again updates the existing Studio at name.sanity.studio. It won’t recreate the project, erase content, or reset the webhook or CORS settings.

For draft preview, you only need to apply the new settings:

Deploy the Studio again so it picks up SANITY_STUDIO_PREVIEW_URL from your local .env.

Redeploy Vercel so its server function picks up SANITY_READ_TOKEN and PREVIEW_SECRET. Vercel applies changed environment variables to new deployments only. Vercel environment variables




. Test it end to end: open Sanity Studio, open תצוגה מקדימה, and select a recipe. If there are no recipes yet, create and save a draft first; you don’t need to publish it.

The preview should show that draft on your Vercel site. After editing and saving the draft, use רענון התצוגה to see the latest version. Draft edits shouldn’t trigger a Vercel build because the webhook is set to ignore drafts.


## site details defaults

To match the local site, enter these temporary values in פרטי האתר:

כותרת ראשית: האוכל הכי טוב מתחיל בבית.

פתיח לעמוד הבית: מתכונים כשרים אהובים, טעמים של משפחה, וכל הסיבות הטובות להתכנס שוב סביב השולחן.

שורת תיאור / tagline: פשוט להכין. כיף לחלוק.

פתיח אודות: המקום הזה נולד כדי לאסוף את המתכונים שמחזירים אותנו הביתה — ולתת להם בית שאפשר לחזור אליו בכל פעם שמתחשק לבשל.

תוכן אודות: בקרוב תמר תספר כאן את הסיפור שלה במילים שלה: על המטבח, האנשים והמנות שהיא הכי אוהבת להכין.

The local version shows a star illustration where a portrait would go. Studio currently requires a portrait image and alt text before you can publish פרטי האתר. To keep the same look, you’ll need to leave it as a draft until Tamar’s portrait is ready, or use a temporary image knowing the About page will look different.

Create these four categories. Set סדר to the numbers shown so they appear in the same order:

 שם                Slug           תיאור                                 סדר
━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━
 ארוחות עיקריות    main-dishes    המנות שמרכזות את כולם סביב השולחן.      1
────────────────  ─────────────  ────────────────────────────────────  ─────
 אפייה ולחמים      baking         ריח של בית שיוצא מהתנור.                2
────────────────  ─────────────  ────────────────────────────────────  ─────
 סלטים ותוספות     salads         צבע, רעננות וכל מה שבצד.                3
────────────────  ─────────────  ────────────────────────────────────  ─────
 קינוחים           desserts       משהו מתוק לסיים איתו.                   4

For each category image, use the corresponding local demo image 
if you want the same appearance: category-main-dishes.webp, challah.webp, salad.webp, and cake.webp. Add the matching alt text: לזניה ביתית בתבנית אפייה, חלות טריות, סלט ירקות טרי, and עוגת תפוזים ביתית.

One more thing: these settings and categories alone won’t make the whole homepage match local dev. The homepage also needs the four demo recipes from the local project. Until Tamar reviews the temporary content, keep the site noindexed as the guide specifies.


### Draft preview

1. Create a Sanity API token with **Viewer** access to the dataset. Set it on Vercel as `SANITY_READ_TOKEN` for the server function. It must not start with `PUBLIC_`.
2. Generate a long random value for `PREVIEW_SECRET` and set it on Vercel. Keep it server-only and separate from the Sanity token.
3. Set `SANITY_STUDIO_PREVIEW_URL` to the website's HTTPS origin when building and deploying the Sanity Studio. Add that origin in the Sanity project API CORS settings with credentials allowed for Presentation. Redeploy the Studio after changing this value.
4. In Studio, open **תצוגה מקדימה** and choose the recipe under **Used on**. The Presentation tool validates a short-lived Sanity secret; the site then issues a signed, one-hour, HTTP-only cookie for `/preview/<document-id>`. The preview page reads drafts on request. Use **רענון התצוגה** after edits to see the latest saved draft.

The preview route returns 404 without a valid session, sends `noindex` and `no-store` headers, and is disallowed in `robots.txt`. Published recipe and category pages remain prebuilt. The Studio preview has no click-to-edit overlays; Tamar edits in the Studio form and uses the page preview beside it.

## Publish to rebuild

In the Sanity project management dashboard, create a webhook for the `production` dataset. Use the selected host's deploy hook URL as the destination, `POST` as the method, and trigger it for create, update and delete events. A narrow GROQ filter is:

```groq
_type in ["recipe", "category", "siteSettings"]
```

Keep the deploy hook URL private; anyone with it can trigger builds. Publish a test recipe and confirm that the host starts a build, the updated static page appears, and `robots.txt`, sitemap, canonical URL and structured data use the final domain. Deleting or unpublishing content must also trigger a rebuild.


Leave "drafts" unchecked on the Sanity webhook. The preview function fetches drafts directly, so Studio autosaves do not need a Vercel build. The filter should only fire on published documents.

Settle category slugs before launch. They're in every URL. Enter the siteSettings and categories first, then recipes.

Don't set PUBLIC_SITE_URL until the real domain is ready. Until then the site stays noindex,

upload full-size originals, set the hotspot and fill in the alt text. The demo .webp images in public/images are AI-generated, so delete them once real content is in.

## Video playback check

The recipe iframe uses the [YouTube privacy-enhanced embed address](https://support.google.com/youtube/answer/171780) and `referrerpolicy="strict-origin-when-cross-origin"`. The repository also sets a matching response header for Vercel (`vercel.json`) and Cloudflare Pages (`public/_headers`). Test an actual embedded video **inside a recipe page on the final HTTPS domain**; opening the bare `/embed/...` URL in a new tab does not provide the enclosing page's Referer and can show [YouTube error 153](https://support.google.com/youtube/answer/171780#zippy=%2Cprovide-a-http-referer-header-to-enable-video-playback). The page always includes an ordinary YouTube link as a fallback. Also confirm that the video owner allows embedding and that any unlisted video may be viewed by anyone with its link.

On launch, test one mobile `m.youtube.com/watch?v=…` link and one `watch?si=…&v=…` link in Studio; both are accepted by the same parser used to render embeds. Check the final page with and without JavaScript, the print view, a long component recipe, and a simple recipe. The detailed entry and review guide is [editorial.md](editorial.md).

Official references: [Sanity Studio deployment](https://www.sanity.io/docs/setup-and-deployment), [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks), [Vercel deploy hooks](https://vercel.com/docs/deploy-hooks), [Cloudflare Pages deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/).
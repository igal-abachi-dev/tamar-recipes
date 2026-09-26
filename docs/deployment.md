# Launching אתר המתכונים של תמר

The public Astro site is static. Sanity hosts the editing Studio separately at a `*.sanity.studio` address; there is no public admin route on the Astro site. Tamar's recipe data is read from Sanity during each site build.

Before launch, Tamar needs to enter approved recipes, photos, and About copy. A real Sanity project, domain, host, and publish-to-rebuild webhook must also be connected.

## Before the first public build

1. Create a Sanity project and public `production` dataset. Add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` to the website's build environment. Use the same values as `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` when deploying Studio.
2. Set `SANITY_STUDIO_HOSTNAME` to an available hostname prefix (for example `tamar-recipes`), or leave it blank and choose one when prompted. Run `pnpm sanity:deploy` from an authenticated Sanity CLI session. Sign-in and editor permissions are managed in Sanity. Do not add `/studio` or `/admin` to the public site.
3. In Studio, create **פרטי האתר** with the approved homepage text, About story and portrait. Create categories and Tamar-approved recipes. Enter Latin slugs, images with alt text, recipe classifications, ingredients and steps. Use **סרטוני YouTube** for videos; Mux remains optional.

4. Choose the final domain and set `PUBLIC_SITE_URL=https://your-domain.example` on the website host. Preview builds with the placeholder domain remain `noindex` and disallow crawling in `robots.txt`.
5. Build with `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build`. The output directory is `dist` and the project requires Node 22.12 or newer.

An [unlisted YouTube video](https://support.google.com/youtube/answer/157177?hl=en) is suitable for a public recipe page, but anyone with its link can watch and share it. Check that Tamar wants the video publicly viewable before adding it.

The build also writes `llms.txt` as a short map of the public static recipe pages. Full ingredients and instructions remain in each page's HTML and Recipe JSON-LD; the search and cooking controls are optional enhancements.

## Hosting choice

### Vercel

Connect the repository to a Vercel project. Set the build command to `pnpm build`, output directory to `dist`, and the three public environment variables. In project **Settings → Git → Deploy Hooks**, create a hook for the production branch.

### Cloudflare Pages

Connect the repository to a Cloudflare Pages project. Set the build command to `pnpm build`, output directory to `dist`, Node version to at least 22.12, and the three public environment variables. In **Settings → Builds**, create a deploy hook for the production branch.

## Publish to rebuild

In the Sanity project management dashboard, create a webhook for the `production` dataset. Use the selected host's deploy hook URL as the destination, `POST` as the method, and trigger it for create, update and delete events. A narrow GROQ filter is:

```groq
_type in ["recipe", "category", "siteSettings"]
```

Keep the deploy hook URL private; anyone with it can trigger builds. Publish a test recipe and confirm that the host starts a build, the updated static page appears, and `robots.txt`, sitemap, canonical URL and structured data use the final domain. Deleting or unpublishing content must also trigger a rebuild.


Leave "drafts" unchecked on the Sanity webhook. Otherwise every Studio autosave triggers a Vercel build. The filter should only fire on published documents.

Settle category slugs before launch. They're in every URL. Enter the siteSettings and categories first, then recipes.

Don't set PUBLIC_SITE_URL until the real domain is ready. Until then the site stays noindex,

upload full-size originals, set the hotspot and fill in the alt text. The demo .webp images in public/images are AI-generated, so delete them once real content is in.

## Video playback check

The recipe iframe uses the [YouTube privacy-enhanced embed address](https://support.google.com/youtube/answer/171780) and `referrerpolicy="strict-origin-when-cross-origin"`. The repository also sets a matching response header for Vercel (`vercel.json`) and Cloudflare Pages (`public/_headers`). Test an actual embedded video **inside a recipe page on the final HTTPS domain**; opening the bare `/embed/...` URL in a new tab does not provide the enclosing page's Referer and can show [YouTube error 153](https://support.google.com/youtube/answer/171780#zippy=%2Cprovide-a-http-referer-header-to-enable-video-playback). The page always includes an ordinary YouTube link as a fallback. Also confirm that the video owner allows embedding and that any unlisted video may be viewed by anyone with its link.

On launch, test one mobile `m.youtube.com/watch?v=…` link and one `watch?si=…&v=…` link in Studio; both are accepted by the same parser used to render embeds. Check the final page with and without JavaScript, the print view, a long component recipe, and a simple recipe. The detailed entry and review guide is [editorial.md](editorial.md).

Official references: [Sanity Studio deployment](https://www.sanity.io/docs/setup-and-deployment), [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks), [Vercel deploy hooks](https://vercel.com/docs/deploy-hooks), [Cloudflare Pages deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/).

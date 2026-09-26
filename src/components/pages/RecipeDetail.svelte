<script lang="ts">
  import RecipeCard from '../cards/RecipeCard.svelte';
  import IngredientGroups from '../ui/IngredientGroups.svelte';
  import StepList from '../ui/StepList.svelte';
  import type { Recipe } from '../../types/content';
  import { imageSrc, timeRangeLabel, totalMinutes } from '../../lib/content';
  import { difficultyLabels, recipeBadges } from '../../lib/labels';
  import {
    hasDetailedContent,
    ovenModeLabels,
    paragraphs,
    recipeVideos,
    sortedTimeline,
    temperatureRange,
  } from '../../lib/recipe-helpers';

  let {
    recipe,
    related = [],
    linkedVersions = [],
  }: { recipe: Recipe; related?: Recipe[]; linkedVersions?: Recipe[] } = $props();
  let hero = $derived(imageSrc(recipe.image, 1400, 950));
  let videos = $derived(recipeVideos(recipe));
  let detailsAvailable = $derived(hasDetailedContent(recipe));
  let gramsFirst = $derived(recipe.gramsFirst ?? recipe.category?.slug === 'baking');
  let yieldLabel = $derived(
    recipe.yieldText ||
      (recipe.yieldCount && recipe.yieldUnit ? `${recipe.yieldCount} ${recipe.yieldUnit}` : '') ||
      (recipe.servings ? `${recipe.servings} מנות` : '—'),
  );
</script>

<article class="recipe-page">
  <nav class="breadcrumbs" aria-label="פירורי לחם">
    <a href="/">בית</a><span aria-hidden="true">/</span><a href="/recipes">מתכונים</a>
    {#if recipe.category}<span aria-hidden="true">/</span><a
        href={`/categories/${recipe.category.slug}`}>{recipe.category.title}</a
      >{/if}
  </nav>
  {#if recipe.demo}<div class="demo-label">
      מתכון לדוגמה — יש להחליף בתוכן של תמר לפני פרסום האתר.
    </div>{/if}

  <header class="recipe-heading">
    {#if recipe.category}<a class="eyebrow" href={`/categories/${recipe.category.slug}`}
        >{recipe.category.title}</a
      >{/if}
    <h1>{recipe.title}</h1>
    <p class="recipe-intro">{recipe.description}</p>
    <nav class="recipe-jump" aria-label="קפיצה במתכון">
      <a href="#ingredients-title">למצרכים ↓</a><a href="#method-title">לאופן ההכנה ↓</a>
      {#if recipe.timeline?.length}<a href="#timeline-title">לתכנון ההכנה ↓</a>{/if}
    </nav>
    <div class="recipe-facts">
      {#if recipe.activeMinutes !== undefined}<div>
          <b>עבודה פעילה</b><span
            >{timeRangeLabel(recipe.activeMinutes, recipe.activeMinutesMax)}</span
          >
        </div>{/if}
      {#if recipe.prepMinutes}<div>
          <b>הכנה</b><span>{timeRangeLabel(recipe.prepMinutes)}</span>
        </div>{/if}
      {#if recipe.cookMinutes}<div>
          <b>בישול</b><span>{timeRangeLabel(recipe.cookMinutes)}</span>
        </div>{/if}
      {#if recipe.restMinutes}<div>
          <b>מנוחה / התפחה</b><span>{timeRangeLabel(recipe.restMinutes)}</span>
        </div>{/if}
      {#if totalMinutes(recipe)}<div>
          <b>עד ההגשה</b><span
            >{timeRangeLabel(totalMinutes(recipe), recipe.elapsedMinutesMax)}</span
          >
        </div>{/if}
      <div><b>תפוקה</b><span data-recipe-yield>{yieldLabel}</span></div>
      <div><b>רמת קושי</b><span>{difficultyLabels[recipe.difficulty || 'easy']}</span></div>
      {#if recipeBadges(recipe).length}<div>
          <b>סיווגים</b><span>{recipeBadges(recipe).join(' · ')}</span>
        </div>{/if}
    </div>
    {#if detailsAvailable}<div class="view-toggle">
        <input id="full-view" type="checkbox" />
        <label for="full-view">הצגת הסברים, טעויות ומקורות</label>
        <span>למי שרוצה להעמיק מעבר לשלבי ההכנה</span>
      </div>{/if}
  </header>

  {#if hero}<figure class="hero">
      <img src={hero} alt={recipe.image?.alt || recipe.title} width="1400" height="950" />
    </figure>{/if}

  {#if recipe.originStory}<section class="origin-story" aria-label="מאחורי המתכון">
      <span class="eyebrow">מאחורי המתכון</span>
      {#each paragraphs(recipe.originStory) as paragraph}<p>{paragraph}</p>{/each}
    </section>{/if}

  {#if recipe.keyRules?.length}<section class="key-rules" aria-labelledby="rules-title">
      <span class="eyebrow">לפני שמתחילים</span>
      <h2 id="rules-title">שלושה דברים לזכור</h2>
      <ol>
        {#each recipe.keyRules as rule}<li>{rule}</li>{/each}
      </ol>
    </section>{/if}

  {#if recipe.timeline?.length}<section class="timeline" aria-labelledby="timeline-title">
      <div>
        <span class="eyebrow">לתכנן בלי לחץ</span>
        <h2 id="timeline-title">מתי מתחילים?</h2>
      </div>
      <ol>
        {#each sortedTimeline(recipe) as item}<li>
            <strong>{item.label}</strong>
            <ul>
              {#each item.tasks || [] as task}<li>{task}</li>{/each}
            </ul>
          </li>{/each}
      </ol>
    </section>{/if}

  <div class="recipe-body">
    <aside class="ingredients" aria-labelledby="ingredients-title">
      <h2 id="ingredients-title">מה צריך?</h2>
      <p class="aside-note">אפשר לסמן מצרכים תוך כדי הכנה</p>
      {#if recipe.components?.length}<nav class="component-links" aria-label="רכיבי המתכון">
          <strong>קפיצה לרכיב</strong>
          {#each recipe.components as component, index}<a href={`#component-${index + 1}`}
              >{component.title}</a
            >{/each}
        </nav>{/if}
      {#if recipe.panSize || recipe.ovenTemperatureC || recipe.ovenMode || recipe.ovenTimerMinutes !== undefined}<div
          class="sidebar-note"
        >
          <h3>תבנית ותנור</h3>
          {#if recipe.panSize}<p>תבנית / מחבת: {recipe.panSize}</p>{/if}
          {#if recipe.ovenMode}<p>מצב: {ovenModeLabels[recipe.ovenMode]}</p>{/if}
          {#if recipe.ovenTemperatureC}<p>טמפרטורה: {recipe.ovenTemperatureC}°C</p>{/if}
          {#if recipe.ovenTimerMinutes !== undefined}<p>
              טיימר תנור: {timeRangeLabel(recipe.ovenTimerMinutes)}
            </p>{/if}
        </div>{/if}
      {#if recipe.equipmentItems?.length}<div class="sidebar-note">
          <h3>ציוד</h3>
          <ul class="equipment-list">
            {#each recipe.equipmentItems || [] as item}<li>
                {item.name}{#if item.required === false}<small> · לא חובה</small>{/if}
              </li>{/each}
          </ul>
        </div>{/if}
      {#if recipe.doneness?.length}<div class="sidebar-note">
          <h3>טמפרטורת ליבה</h3>
          {#each recipe.doneness || [] as target}<div class="doneness-target">
              <b
                >{target.level}{#if target.isSafetyTarget}
                  · יעד בטיחות{/if}</b
              >
              {#if temperatureRange(target.takeOutMinC, target.takeOutMaxC)}<p>
                  מוציאים: {temperatureRange(target.takeOutMinC, target.takeOutMaxC)}
                </p>{/if}
              {#if temperatureRange(target.finalMinC, target.finalMaxC)}<p>
                  אחרי מנוחה: {temperatureRange(target.finalMinC, target.finalMaxC)}
                </p>{/if}
              {#if target.note}<p>{target.note}</p>{/if}
            </div>{/each}
        </div>{/if}
      {#if recipe.ingredientGroups?.length}<IngredientGroups
          groups={recipe.ingredientGroups}
          {gramsFirst}
          idPrefix="flat"
        />{/if}
      {#each recipe.components || [] as component, componentIndex}
        <section class="component-ingredients" aria-label={`מצרכים ל${component.title}`}>
          <h3>{component.title}</h3>
          {#if component.recipeReference}<a
              class="base-recipe"
              href={`/recipes/${component.recipeReference.slug}`}
              >למתכון הבסיסי: {component.recipeReference.title} ←</a
            >{/if}
          {#if component.ingredientGroups?.length}<IngredientGroups
              groups={component.ingredientGroups}
              {gramsFirst}
              idPrefix={`component-${componentIndex}`}
            />{/if}
        </section>
      {/each}
    </aside>

    <div class="method">
      <div class="method-heading">
        <span class="eyebrow">צעד אחר צעד</span>
        <h2 id="method-title">איך מכינים?</h2>
      </div>
      {#if recipe.steps?.length}<StepList steps={recipe.steps} />{/if}
      {#each recipe.components || [] as component, index}<section
          class="component-method"
          id={`component-${index + 1}`}
          aria-label={component.title}
        >
          <h3>{component.title}</h3>
          {#if component.intro}{#each paragraphs(component.intro) as paragraph}<p>
                {paragraph}
              </p>{/each}{/if}
          {#if component.recipeReference}<p>
              <a href={`/recipes/${component.recipeReference.slug}`}
                >מכינים לפי המתכון של {component.recipeReference.title} ←</a
              >
            </p>{/if}
          {#if component.steps?.length}<StepList steps={component.steps} />{/if}
        </section>{/each}

      {#if recipe.tips?.length}<section class="note-box" aria-label="הטיפים של תמר">
          <h3>הטיפים של תמר</h3>
          {#each recipe.tips as tip}<p>{tip}</p>{/each}
        </section>{/if}
      {#if recipe.lessonsLearned}<section class="note-box" aria-label="מה למדתי כשהכנתי">
          <h3>מה למדתי כשהכנתי</h3>
          {#each paragraphs(recipe.lessonsLearned) as paragraph}<p>{paragraph}</p>{/each}
        </section>{/if}
      {#if recipe.kosherAdaptation}<section class="note-box" aria-label="התאמות למטבח כשר">
          <h3>התאמות למטבח כשר</h3>
          {#each paragraphs(recipe.kosherAdaptation) as paragraph}<p>{paragraph}</p>{/each}
        </section>{/if}
      {#if recipe.passoverNote}<section class="note-box" aria-label="הערה לפסח">
          <h3>הערה לפסח</h3>
          {#each paragraphs(recipe.passoverNote) as paragraph}<p>{paragraph}</p>{/each}
        </section>{/if}

      {#if recipe.variations?.length}<section class="variations" aria-labelledby="variations-title">
          <h2 id="variations-title">גרסאות ושינויים</h2>
          <div class="variation-grid">
            {#each recipe.variations as variation}<article>
                <h3>{variation.title}</h3>
                {#if variation.whenToUse}<p class="when-to-use">{variation.whenToUse}</p>{/if}
                {#each paragraphs(variation.changes) as paragraph}<p>{paragraph}</p>{/each}
                {#if variation.linkedRecipe}<a href={`/recipes/${variation.linkedRecipe.slug}`}
                    >לגרסה המלאה: {variation.linkedRecipe.title} ←</a
                  >{/if}
              </article>{/each}
          </div>
        </section>{/if}

      {#if recipe.makeAhead || recipe.storageDetails || recipe.substitutions}<section
          class="keeping"
          aria-labelledby="keeping-title"
        >
          <h2 id="keeping-title">להכין ולשמור</h2>
          {#if recipe.makeAhead}{#each paragraphs(recipe.makeAhead) as paragraph}<p>
                <b>מראש:</b>
                {paragraph}
              </p>{/each}{/if}
          {#if recipe.storageDetails?.fridge}{#each paragraphs(recipe.storageDetails.fridge) as paragraph}<p
              >
                <b>במקרר:</b>
                {paragraph}
              </p>{/each}{/if}
          {#if recipe.storageDetails?.freezer}{#each paragraphs(recipe.storageDetails.freezer) as paragraph}<p
              >
                <b>במקפיא:</b>
                {paragraph}
              </p>{/each}{/if}
          {#if recipe.storageDetails?.reheat}{#each paragraphs(recipe.storageDetails.reheat) as paragraph}<p
              >
                <b>לחימום ולהגשה:</b>
                {paragraph}
              </p>{/each}{/if}
          {#if recipe.substitutions}{#each paragraphs(recipe.substitutions) as paragraph}<p>
                <b>תחליפים:</b>
                {paragraph}
              </p>{/each}{/if}
        </section>{/if}

      {#if recipe.servedWithText || recipe.servedWith?.length}<section
          class="serving"
          aria-labelledby="serving-title"
        >
          <h2 id="serving-title">מה מגישים לצד זה?</h2>
          {#if recipe.servedWithText}{#each paragraphs(recipe.servedWithText) as paragraph}<p>
                {paragraph}
              </p>{/each}{/if}
          {#if recipe.servedWith?.length}<ul>
              {#each recipe.servedWith as item}{#if item?.slug}<li>
                    <a href={`/recipes/${item.slug}`}>{item.title}</a>
                  </li>{/if}{/each}
            </ul>{/if}
        </section>{/if}

      {#if videos.length}<section class="recipe-video" aria-labelledby="video-title">
          <h2 id="video-title">צופים ומכינים</h2>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videos[0].id}`}
            title={`וידאו: ${videos[0].title} — ${recipe.title}`}
            width="560"
            height="315"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <p>
            <a
              href={`https://www.youtube.com/watch?v=${videos[0].id}`}
              target="_blank"
              rel="noopener noreferrer">פתיחת הסרטון ב־YouTube ←</a
            >
          </p>
          {#if videos.length > 1}<ul>
              {#each videos.slice(1) as item}<li>
                  <a
                    href={`https://www.youtube.com/watch?v=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer">{item.title} ↗</a
                  >
                </li>{/each}
            </ul>{/if}
        </section>{:else if recipe.video?.asset?.playbackId}<section
          class="recipe-video"
          aria-label="וידאו להכנת המתכון"
        >
          <h2>צופים ומכינים</h2>
          <mux-player
            playback-id={recipe.video.asset.playbackId}
            metadata-video-title={recipe.title}
            stream-type="on-demand"
          ></mux-player>
        </section>{/if}
    </div>
  </div>

  {#if recipe.pitfalls?.length}<section
      class="deep-section full-extra"
      aria-labelledby="pitfalls-title"
    >
      <h2 id="pitfalls-title">טעויות שכדאי להימנע מהן</h2>
      <ul>
        {#each recipe.pitfalls as pitfall}<li>{pitfall}</li>{/each}
      </ul>
    </section>{/if}
  {#if recipe.sources?.length}<section
      class="deep-section full-extra"
      aria-labelledby="sources-title"
    >
      <h2 id="sources-title">מקורות והשראה</h2>
      {#if recipe.sources?.length}<ul>
          {#each recipe.sources as source}<li>
              {#if source.url?.startsWith('https://')}<a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer">{source.title} ↗</a
                >{:else}{source.title}{/if}
            </li>{/each}
        </ul>{/if}
    </section>{/if}
  {#if linkedVersions.length}<section class="linked-versions" aria-label="גרסאות קשורות">
      <h2>גרסאות נוספות של המנה</h2>
      <ul>
        {#each linkedVersions as item}<li>
            <a href={`/recipes/${item.slug}`}>{item.title}</a>
          </li>{/each}
      </ul>
    </section>{/if}
  {#if related.length}<section class="related" aria-labelledby="related-title">
      <span class="eyebrow">עוד משהו טעים</span>
      <h2 id="related-title">אולי תאהבו גם</h2>
      <div class="related-grid">
        {#each related as item}<RecipeCard recipe={item} />{/each}
      </div>
    </section>{/if}
  <div class="recipe-end">
    <span aria-hidden="true">✳</span>
    <p>בתיאבון, ואל תשכחו לשבת יחד.</p>
    <a href="/recipes">לגלות עוד מתכונים ←</a>
  </div>
</article>

<style>
  .recipe-page {
    max-width: var(--max-width);
    margin: auto;
    padding: 32px 28px 0;
  }
  .breadcrumbs {
    display: flex;
    gap: 9px;
    color: #8b8e82;
    font-size: 12px;
  }
  .breadcrumbs a {
    color: inherit;
    text-decoration: none;
  }
  .demo-label {
    margin-top: 24px;
    padding: 10px 15px;
    background: #f4e5c9;
    color: #5b3e22;
    font-size: 12px;
    font-weight: 700;
  }
  .recipe-heading {
    text-align: center;
    max-width: 960px;
    margin: 58px auto 37px;
  }
  .eyebrow {
    color: var(--orange);
    font-size: 12px;
    letter-spacing: 0.1em;
    font-weight: 800;
    text-decoration: none;
  }
  .recipe-heading h1 {
    font: 700 clamp(48px, 5.7vw, 80px)/1.08 var(--font-display);
    letter-spacing: -0.055em;
    margin: 16px 0;
  }
  .recipe-intro {
    font-size: 18px;
    line-height: 1.75;
    color: var(--muted);
    max-width: 670px;
    margin: 0 auto 24px;
  }
  .recipe-jump {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 20px;
    margin: 0 0 27px;
  }
  .recipe-jump a {
    color: var(--orange);
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    padding-bottom: 3px;
  }
  .recipe-facts {
    border-block: 1px solid var(--line);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 17px 0;
  }
  .recipe-facts div {
    padding: 3px 18px;
    border-inline-end: 1px solid var(--line);
    display: grid;
    gap: 4px;
    min-width: 110px;
  }
  .recipe-facts div:last-child {
    border: 0;
  }
  .recipe-facts b {
    font-size: 11px;
    color: var(--muted);
  }
  .recipe-facts span {
    font-size: 14px;
    font-weight: 700;
  }
  .view-toggle {
    margin: 22px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 13px;
  }
  .view-toggle input {
    accent-color: var(--orange);
    width: 17px;
    height: 17px;
  }
  .view-toggle label {
    cursor: pointer;
    font-weight: 700;
  }
  .view-toggle span {
    color: var(--muted);
  }
  .hero {
    margin: 0;
  }
  .hero img {
    width: 100%;
    height: auto;
    max-height: 650px;
    object-fit: cover;
  }
  .origin-story {
    max-width: 750px;
    margin: 48px auto 0;
    text-align: center;
  }
  .origin-story p {
    font: 400 23px/1.7 var(--font-display);
    color: #4f5b4c;
  }
  .key-rules {
    margin: 48px auto 0;
    max-width: 860px;
    padding: 27px 35px;
    background: #eef0e8;
  }
  .key-rules h2,
  .timeline h2 {
    font: 700 28px var(--font-display);
    margin: 7px 0 12px;
  }
  .key-rules ol {
    margin: 0;
    padding-inline-start: 23px;
    line-height: 1.7;
  }
  .key-rules li + li {
    margin-top: 6px;
  }
  .timeline {
    margin-top: 54px;
    padding: 25px 30px;
    background: #f5efe4;
  }
  .timeline > ol {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .timeline > ol > li {
    border-top: 2px solid var(--orange);
    padding-top: 13px;
  }
  .timeline strong {
    font: 700 18px var(--font-display);
  }
  .timeline ul {
    padding-inline-start: 20px;
    margin: 8px 0 0;
    font-size: 14px;
    line-height: 1.65;
  }
  .recipe-body {
    display: grid;
    grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);
    gap: 7%;
    padding-top: 70px;
  }
  .ingredients {
    align-self: start;
    background: #f5f1e9;
    padding: 30px 32px 34px;
  }
  .ingredients h2,
  .method h2 {
    font: 700 36px var(--font-display);
    letter-spacing: -0.04em;
    margin: 0;
  }
  .aside-note {
    font-size: 12px;
    color: var(--muted);
    margin: 7px 0 24px;
  }
  .component-links {
    display: grid;
    gap: 5px;
    margin-bottom: 25px;
    padding-bottom: 18px;
    border-bottom: 1px solid #ded9cd;
    font-size: 13px;
  }
  .component-links a,
  .base-recipe {
    color: var(--orange);
    font-weight: 700;
  }
  .sidebar-note {
    border-top: 1px solid #ded9cd;
    padding-top: 12px;
    margin-bottom: 20px;
  }
  .sidebar-note h3,
  .component-ingredients h3 {
    font: 700 17px var(--font-display);
    margin: 5px 0 9px;
  }
  .sidebar-note p {
    font-size: 13px;
    color: var(--muted);
    margin: 4px 0;
  }
  .equipment-list {
    margin: 0;
    padding-inline-start: 18px;
    font-size: 13px;
    line-height: 1.6;
  }
  .equipment-list small {
    color: var(--muted);
  }
  .doneness-target {
    border-bottom: 1px solid #ded9cd;
    padding: 8px 0;
    font-size: 13px;
  }
  .component-ingredients {
    border-top: 2px solid #d7c8af;
    margin-top: 23px;
    padding-top: 15px;
  }
  .base-recipe {
    font-size: 13px;
    display: block;
    margin-bottom: 8px;
  }
  .method-heading {
    margin-bottom: 24px;
  }
  .method-heading h2 {
    margin-top: 7px;
  }
  .component-method {
    scroll-margin-top: 25px;
    margin-top: 43px;
  }
  .component-method h3 {
    font: 700 30px var(--font-display);
    margin: 0 0 12px;
  }
  .component-method > p {
    color: var(--muted);
    line-height: 1.7;
  }
  .note-box {
    margin-top: 22px;
    padding: 24px 26px;
    background: #eef0e8;
  }
  .note-box h3 {
    font: 700 24px var(--font-display);
    margin: 0 0 8px;
  }
  .note-box p {
    margin: 0 0 8px;
    line-height: 1.7;
    color: #4c594b;
  }
  .variations,
  .keeping,
  .serving {
    margin-top: 32px;
    padding-top: 23px;
    border-top: 1px solid var(--line);
  }
  .variations h2,
  .keeping h2,
  .serving h2,
  .recipe-video h2 {
    font: 700 26px var(--font-display);
    margin: 0 0 15px;
  }
  .variation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }
  .variation-grid article {
    background: #f6f2e9;
    padding: 17px;
  }
  .variation-grid h3 {
    font: 700 18px var(--font-display);
    margin: 0 0 6px;
  }
  .variation-grid p,
  .keeping p,
  .serving p {
    line-height: 1.7;
    color: var(--muted);
    margin: 7px 0;
  }
  .variation-grid .when-to-use {
    color: #8c4e2a;
    font-weight: 700;
  }
  .recipe-video {
    margin-top: 40px;
  }
  .recipe-video iframe,
  .recipe-video mux-player {
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    border: 0;
    margin-top: 16px;
  }
  .recipe-video p,
  .recipe-video ul {
    font-size: 13px;
  }
  .deep-section {
    margin: 50px auto 0;
    max-width: 850px;
    border-top: 1px solid var(--line);
    padding-top: 20px;
  }
  .deep-section h2 {
    font: 700 25px var(--font-display);
  }
  .deep-section li {
    margin: 8px 0;
  }
  .related {
    padding-top: 70px;
    margin-top: 70px;
    border-top: 1px solid var(--line);
  }
  .linked-versions {
    max-width: 850px;
    margin: 45px auto 0;
    padding: 20px;
    background: #f5efe4;
  }
  .linked-versions h2 {
    font: 700 25px var(--font-display);
    margin: 0 0 8px;
  }
  .related h2 {
    font: 700 38px var(--font-display);
    margin: 10px 0 25px;
  }
  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .recipe-end {
    text-align: center;
    margin-top: 70px;
    padding: 37px;
    border-top: 1px solid var(--line);
  }
  .recipe-end span {
    font-size: 35px;
    color: var(--orange);
  }
  .recipe-end p {
    font: 700 26px var(--font-display);
    margin: 10px;
  }
  .recipe-end a {
    color: var(--orange);
    font-size: 13px;
    font-weight: 700;
  }
  @media (min-width: 751px) {
    .ingredients {
      position: sticky;
      top: 24px;
      max-height: calc(100vh - 48px);
      overflow: auto;
    }
    .component-links {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #f5f1e9;
      padding-top: 8px;
    }
  }
  @media (max-width: 750px) {
    .recipe-page {
      padding: 22px 20px 0;
    }
    .recipe-heading {
      margin: 38px auto 27px;
    }
    .recipe-heading h1 {
      font-size: 48px;
    }
    .recipe-intro {
      font-size: 16px;
    }
    .recipe-facts {
      gap: 12px 0;
    }
    .recipe-facts div {
      padding: 0 10px;
      min-width: 75px;
    }
    .recipe-body {
      display: block;
      padding-top: 42px;
    }
    .ingredients {
      padding: 25px;
      margin-bottom: 43px;
    }
    .related-grid {
      grid-template-columns: 1fr;
    }
    .timeline {
      padding: 25px 20px;
    }
  }
</style>

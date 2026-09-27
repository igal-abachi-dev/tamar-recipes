<script lang="ts">
  import RecipeCard from '../cards/RecipeCard.svelte';
  import type { Recipe, Category, SiteSettings, RecipeImage } from '../../types/content';
  import { imageSrc, timeLabel, totalMinutes } from '../../lib/content';
  function headlineParts(value: string) {
    const marked = value.match(/^(.*?)\*([^*]+)\*(.*)$/s);
    if (marked) return { before: marked[1], accent: marked[2], after: marked[3] };
    const last = value.match(/^(.*\s)(\S+)$/s);
    return { before: last?.[1] || '', accent: last?.[2] || value, after: '' };
  }
  function sameImage(left?: RecipeImage, right?: RecipeImage): boolean {
    return Boolean(
      (left?.localSrc && right?.localSrc && left.localSrc === right.localSrc) ||
      (left?.asset?._id && right?.asset?._id && left.asset._id === right.asset._id),
    );
  }
  let {
    recipes,
    categories,
    settings,
    isDemo,
  }: { recipes: Recipe[]; categories: Category[]; settings: SiteSettings; isDemo: boolean } =
    $props();
  let hero = $derived(recipes.find((recipe) => recipe.featured) || recipes[0]);
  let headline = $derived(headlineParts(settings.homeHeadline || 'האוכל הכי טוב מתחיל בבית.'));
  let featured = $derived(
    recipes.find((recipe) => recipe.slug !== hero?.slug && recipe.featured) ||
      recipes.find((recipe) => recipe.slug !== hero?.slug),
  );
  let latest = $derived(
    [...recipes]
      .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
      .filter((recipe) => recipe.slug !== hero?.slug && recipe.slug !== featured?.slug)
      .slice(0, 3),
  );
</script>

{#if isDemo}<div class="demo-note">
    תוכן להמחשה בלבד — המתכונים והתמונות יוחלפו במתכונים של תמר.
  </div>{/if}
<section class="welcome" aria-labelledby="welcome-title">
  <div class="welcome-copy">
    <span class="eyebrow"><span class="small-star">✳</span> ברוכים הבאים למטבח של תמר</span>
    <h1 id="welcome-title">{headline.before}<span>{headline.accent}</span>{headline.after}</h1>
    <p>
      {settings.homeIntro ||
        'מתכונים כשרים אהובים, טעמים של משפחה, וכל הסיבות הטובות להתכנס שוב סביב השולחן.'}
    </p>
    <a href="/recipes" class="button">בואו למצוא משהו טעים <span aria-hidden="true">←</span></a>
    <div class="welcome-signature">{settings.tagline || 'פשוט להכין. כיף לחלוק.'}</div>
  </div>
  <div class="welcome-image">
    <img
      src={imageSrc(hero?.image, 1240, 820) || '/images/hero-roast-chicken.webp'}
      alt={hero?.image?.alt || 'מנה ביתית על שולחן משפחתי'}
      width="1240"
      height="820"
      fetchpriority="high"
    />
    <span class="image-stamp">נפגשים<br />סביב השולחן <b>✳</b></span>
  </div>
</section>

{#if categories.length}
  <section class="category-section section-wrap" aria-labelledby="category-heading">
    <div class="section-heading">
      <div>
        <span class="eyebrow">מה מתחשק היום?</span>
        <h2 id="category-heading">לגלות לפי קטגוריה</h2>
      </div>
      <a href="/categories">לכל הקטגוריות <span aria-hidden="true">←</span></a>
    </div>
    <div class="category-grid">
      {#each categories.slice(0, 4) as category}
        <a class="category-tile" href={`/categories/${category.slug}`}>
          {#if imageSrc(category.image, 580, 530) && !sameImage(category.image, hero?.image)}<img
              src={imageSrc(category.image, 580, 530)}
              alt={category.image?.alt || ''}
              width="580"
              height="530"
              loading="lazy"
            />{:else}<span class="tile-mark" aria-hidden="true">✳</span>{/if}
          <span>{category.title}<b aria-hidden="true">↗</b></span>
        </a>
      {/each}
    </div>
  </section>
{/if}

{#if featured}
  <section class="featured section-wrap" aria-labelledby="featured-heading">
    <div class="featured-image">
      {#if imageSrc(featured.image, 900, 680)}<img
          src={imageSrc(featured.image, 900, 680)}
          alt={featured.image?.alt || featured.title}
          width="900"
          height="680"
          loading="lazy"
        />{/if}
    </div>
    <div class="featured-copy">
      <span class="eyebrow">המתכון שבמרכז השולחן</span>
      <h2 id="featured-heading">{featured.title}</h2>
      <p>{featured.description}</p>
      <div class="featured-meta">
        {timeLabel(totalMinutes(featured))} <span>·</span>
        {featured.servings} מנות
      </div>
      <a href={`/recipes/${featured.slug}`} class="text-link"
        >למתכון המלא <span aria-hidden="true">←</span></a
      >
    </div>
  </section>
{/if}

{#if latest.length}
  <section class="latest section-wrap" aria-labelledby="latest-heading">
    <div class="section-heading">
      <div>
        <span class="eyebrow">שווה להכין</span>
        <h2 id="latest-heading">מהמטבח לאחרונה</h2>
      </div>
      <a href="/recipes">לכל המתכונים <span aria-hidden="true">←</span></a>
    </div>
    <div class="recipe-grid">
      {#each latest as recipe}<RecipeCard {recipe} />{/each}
    </div>
  </section>
{/if}

<section class="about-band section-wrap">
  <div class="about-mark" aria-hidden="true">✳</div>
  <div>
    <span class="eyebrow">נעים להכיר</span>
    <h2>בישול שמרגיש כמו בית</h2>
    <p>
      כאן יישמרו המתכונים של תמר: אלה שחוזרים לשולחן שוב ושוב, ואלה שמזכירים לנו שארוחה טובה מתחילה
      באנשים שסביבה.
    </p>
    <a class="text-link" href="/about">להכיר את תמר <span aria-hidden="true">←</span></a>
  </div>
</section>

<style>
  .demo-note {
    background: #f4e5c9;
    color: #5b3e22;
    text-align: center;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 700;
  }
  .welcome {
    display: grid;
    grid-template-columns: 46% 54%;
    min-height: 620px;
    background: var(--cream);
    overflow: hidden;
  }
  .welcome-copy {
    padding: clamp(65px, 7vw, 116px) clamp(30px, 7vw, 120px) 60px
      max(28px, calc((100vw - var(--max-width)) / 2 + 28px));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .eyebrow {
    font-size: 12px;
    letter-spacing: 0.12em;
    font-weight: 800;
    color: var(--orange);
  }
  .small-star {
    font-size: 18px;
    margin-left: 6px;
  }
  .welcome h1 {
    font-family: var(--font-display);
    font-size: clamp(52px, 6.3vw, 100px);
    letter-spacing: -0.07em;
    line-height: 1.03;
    margin: 31px 0 20px;
    font-weight: 700;
  }
  .welcome h1 span {
    color: var(--orange);
  }
  .welcome p {
    font-size: 18px;
    line-height: 1.8;
    max-width: 410px;
    color: #4d5147;
    margin: 0 0 34px;
  }
  .button {
    display: inline-flex;
    gap: 28px;
    align-items: center;
    background: var(--orange);
    color: white;
    padding: 15px 22px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    border-radius: 3px;
  }
  .button:hover {
    background: #9e512a;
    color: white;
  }
  .welcome-signature {
    margin-top: auto;
    padding-top: 35px;
    font-family: var(--font-display);
    color: #6e7767;
    font-size: 20px;
    font-style: italic;
  }
  .welcome-image {
    position: relative;
    min-height: 550px;
  }
  .welcome-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
  }
  .image-stamp {
    position: absolute;
    bottom: 36px;
    right: 36px;
    background: #f5e5cd;
    color: var(--ink);
    width: 126px;
    height: 126px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.3;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 17px;
    transform: rotate(9deg);
  }
  .image-stamp b {
    position: absolute;
    bottom: 20px;
    color: var(--orange);
  }
  .section-wrap {
    max-width: var(--max-width);
    margin-inline: auto;
    padding-inline: 28px;
  }
  .category-section {
    padding-top: 95px;
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
    margin-bottom: 28px;
  }
  .section-heading h2 {
    font: 700 clamp(34px, 4vw, 48px)/1.2 var(--font-display);
    letter-spacing: -0.04em;
    margin: 9px 0 0;
  }
  .section-heading > a {
    color: var(--orange);
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
  }
  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .category-tile {
    position: relative;
    aspect-ratio: 1.03;
    overflow: hidden;
    background: #e9ddca;
    border-radius: 3px;
    color: white;
  }
  .category-tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .category-tile:hover img {
    transform: scale(1.04);
  }
  .category-tile:after {
    content: '';
    position: absolute;
    inset: 40% 0 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  }
  .category-tile span {
    position: absolute;
    bottom: 20px;
    right: 19px;
    left: 19px;
    z-index: 1;
    font-family: var(--font-display);
    font-size: 23px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
  }
  .category-tile b {
    font: 400 20px var(--font-sans);
  }
  .category-tile .tile-mark {
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 130px;
    color: #b6623750;
    z-index: 0;
  }
  .category-tile:has(.tile-mark) {
    background: #e7eadc;
  }
  .featured {
    margin-top: 105px;
    display: grid;
    grid-template-columns: 56% 44%;
    background: #edf0e5;
    padding-inline: 0;
  }
  .featured-image {
    min-height: 430px;
    background: #d8d9cd;
  }
  .featured-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .featured-copy {
    padding: 50px clamp(32px, 5vw, 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .featured-copy h2 {
    font: 700 clamp(36px, 4vw, 57px)/1.1 var(--font-display);
    letter-spacing: -0.05em;
    margin: 18px 0;
  }
  .featured-copy p {
    font-size: 16px;
    color: #596051;
    line-height: 1.8;
    margin: 0 0 24px;
  }
  .featured-meta {
    font-size: 13px;
    font-weight: 700;
    color: #62705d;
    margin-bottom: 30px;
  }
  .featured-meta span {
    padding: 0 8px;
  }
  .text-link {
    font-size: 14px;
    font-weight: 800;
    color: var(--orange);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    padding-bottom: 5px;
  }
  .text-link span {
    margin-right: 12px;
  }
  .latest {
    padding-top: 105px;
  }
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .about-band {
    margin-top: 105px;
    padding-top: 60px;
    padding-bottom: 60px;
    background: #f5efe4;
    display: grid;
    grid-template-columns: 30% 70%;
    align-items: center;
  }
  .about-mark {
    font-size: 150px;
    line-height: 1;
    color: #b36a40;
    text-align: center;
  }
  .about-band h2 {
    font: 700 42px var(--font-display);
    letter-spacing: -0.04em;
    margin: 10px 0;
  }
  .about-band p {
    font-size: 16px;
    line-height: 1.8;
    color: #5c6157;
    max-width: 650px;
    margin: 0 0 22px;
  }
  @media (max-width: 900px) {
    .welcome {
      grid-template-columns: 1fr 1fr;
      min-height: 530px;
    }
    .welcome-copy {
      padding: 70px 28px;
    }
    .welcome-image {
      min-height: 530px;
    }
    .category-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .featured {
      grid-template-columns: 1fr 1fr;
    }
    .recipe-grid {
      gap: 15px;
    }
  }
  @media (max-width: 650px) {
    .welcome {
      display: flex;
      flex-direction: column-reverse;
    }
    .welcome-image {
      min-height: 320px;
    }
    .welcome-copy {
      padding: 48px 20px 54px;
    }
    .welcome h1 {
      font-size: 56px;
      margin-top: 17px;
    }
    .welcome p {
      font-size: 16px;
    }
    .welcome-signature {
      display: none;
    }
    .image-stamp {
      width: 93px;
      height: 93px;
      font-size: 13px;
      bottom: 20px;
      right: 20px;
    }
    .image-stamp b {
      bottom: 12px;
    }
    .section-wrap {
      padding-inline: 20px;
    }
    .category-section,
    .latest {
      padding-top: 67px;
    }
    .section-heading h2 {
      font-size: 33px;
    }
    .section-heading > a {
      font-size: 12px;
    }
    .category-grid {
      gap: 10px;
    }
    .category-tile span {
      font-size: 17px;
      right: 12px;
      bottom: 11px;
      left: 12px;
    }
    .featured {
      display: block;
      margin-top: 70px;
      padding: 0;
    }
    .featured-image {
      min-height: 280px;
      height: 280px;
    }
    .featured-copy {
      padding: 35px 24px 45px;
    }
    .recipe-grid {
      grid-template-columns: 1fr;
    }
    .about-band {
      display: block;
      margin-top: 70px;
      padding: 40px 25px;
    }
    .about-mark {
      display: none;
    }
    .about-band h2 {
      font-size: 34px;
    }
  }
</style>

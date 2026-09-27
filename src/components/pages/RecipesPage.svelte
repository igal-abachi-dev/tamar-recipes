<script lang="ts">
  import RecipeCard from "../cards/RecipeCard.svelte";
  import type { Recipe, Category } from "../../types/content";
  let {
    recipes,
    categories,
    title = "כל המתכונים",
    description = "מה מתחשק להכין היום? כל המתכונים מחכים כאן, מסודרים בשבילכם.",
    activeSlug,
    isDemo = false,
    variant = "category",
    emptyMessage,
  }: {
    recipes: Recipe[];
    categories: Category[];
    title?: string;
    description?: string;
    activeSlug?: string;
    isDemo?: boolean;
    variant?: "archive" | "category";
    emptyMessage?: string;
  } = $props();
</script>

<div class="listing-page page-wrap" class:archive-page={variant === "archive"}>
  {#if isDemo}<div class="demo-note">
      תוכן להמחשה בלבד — המתכונים והתמונות יוחלפו במתכונים של תמר.
    </div>{/if}
  <header class="listing-header">
    <span class="eyebrow">מהמטבח של תמר</span>
    <h1>{title}</h1>
    <p>{description}</p>
  </header>
  <nav class="category-pills" aria-label="סינון לפי קטגוריה">
    <a href="/recipes" class:active={!activeSlug}>הכול</a>
    {#each categories as category}<a
        href={`/categories/${category.slug}`}
        class:active={activeSlug === category.slug}>{category.title}</a
      >{/each}
  </nav>
  <!-- Astro projects the independently hydrated search island into this legacy Svelte slot. -->
  <!-- svelte-ignore slot_element_deprecated -->
  <slot name="search" />
  <div id="archive-grid">
    <div class="count">{recipes.length} מתכונים</div>
    {#if recipes.length}
      <div class="recipe-grid">
        {#each recipes as recipe}<RecipeCard {recipe} />{/each}
      </div>
    {:else if emptyMessage}
      <div class="empty">{emptyMessage}</div>
    {:else}
      <div class="empty">
        <h2>עדיין אין כאן מתכונים</h2>
        <p>בקרוב יהיו כאן עוד דברים טובים להכין.</p>
        <a href="/recipes">חזרה לכל המתכונים</a>
      </div>
    {/if}
  </div>
</div>

<style>
  .demo-note {
    background: #f4e5c9;
    color: #5b3e22;
    text-align: center;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 35px;
  }
  .page-wrap {
    max-width: var(--max-width);
    margin: auto;
    padding: 72px 28px 50px;
  }
  .eyebrow {
    color: var(--orange);
    font-size: 12px;
    letter-spacing: 0.1em;
    font-weight: 800;
  }
  .listing-header {
    text-align: center;
  }
  .listing-header h1 {
    font: 700 clamp(46px, 6vw, 76px)/1.1 var(--font-display);
    letter-spacing: -0.06em;
    margin: 12px 0;
  }
  .listing-header p {
    color: var(--muted);
    max-width: 570px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.7;
  }
  .category-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 9px;
    margin: 42px 0 34px;
  }
  .category-pills a {
    padding: 10px 17px;
    border: 1px solid var(--line);
    border-radius: 40px;
    text-decoration: none;
    color: var(--ink);
    font-size: 13px;
    font-weight: 700;
  }
  .category-pills a:hover,
  .category-pills a.active {
    background: var(--ink);
    border-color: var(--ink);
    color: white;
  }
  .count {
    font-size: 13px;
    color: var(--muted);
    border-bottom: 1px solid var(--line);
    padding-bottom: 13px;
    margin-bottom: 23px;
  }
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .empty {
    background: var(--cream);
    padding: 45px;
    text-align: center;
  }
  @media (max-width: 850px) {
    .archive-page .recipe-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 560px) {
    .archive-page {
      padding: 50px 20px;
    }
    .archive-page .recipe-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 750px) {
    .listing-page:not(.archive-page) {
      padding: 50px 20px 30px;
    }
    .listing-page:not(.archive-page) .recipe-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .listing-page:not(.archive-page) .category-pills {
      justify-content: flex-start;
      margin: 30px 0;
    }
    .listing-page:not(.archive-page) .category-pills a {
      font-size: 12px;
      padding: 8px 12px;
    }
  }
  @media (max-width: 530px) {
    .listing-page:not(.archive-page) .recipe-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

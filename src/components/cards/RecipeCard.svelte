<script lang="ts">
  import type { Recipe } from '../../types/content';
  import { imageSrc, timeLabel, totalMinutes } from '../../lib/content';
  import { difficultyLabels, recipeBadges } from '../../lib/labels';
  let { recipe }: { recipe: Recipe } = $props();
  let src = $derived(imageSrc(recipe.image, 760, 570));
</script>

<article class="recipe-card">
  <a href={`/recipes/${recipe.slug}`}>
    <div class="card-image">
      {#if src}<img {src} alt="" width="760" height="570" loading="lazy" />{/if}
      {#if recipe.category}<span class="category">{recipe.category.title}</span>{/if}
    </div>
    <div class="card-content">
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <div class="card-meta">
        <span aria-hidden="true">◷</span>
        {timeLabel(totalMinutes(recipe))} <span class="dot">·</span>
        {difficultyLabels[recipe.difficulty || 'easy']}{#each recipeBadges(recipe) as badge}<span
            class="dot">·</span
          >
          {badge}{/each}
      </div>
    </div>
  </a>
</article>

<style>
  .recipe-card {
    min-width: 0;
  }
  .recipe-card a {
    display: block;
    color: var(--ink);
    text-decoration: none;
  }
  .card-image {
    aspect-ratio: 4/3;
    background: #e9dfcf;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
  }
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s;
  }
  .recipe-card:hover img {
    transform: scale(1.035);
  }
  .category {
    position: absolute;
    right: 14px;
    bottom: 14px;
    background: var(--cream);
    color: var(--ink);
    font-size: 12px;
    font-weight: 700;
    padding: 7px 11px;
    border-radius: 2px;
  }
  .card-content {
    padding: 17px 1px;
  }
  .card-content h3 {
    font-family: var(--font-display);
    font-size: 25px;
    line-height: 1.25;
    letter-spacing: -0.025em;
    margin: 0 0 8px;
  }
  .card-content p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
    margin: 0 0 13px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-meta {
    font-size: 12px;
    font-weight: 700;
    color: var(--orange);
  }
  .dot {
    margin: 0 6px;
    color: #a9a397;
  }
</style>

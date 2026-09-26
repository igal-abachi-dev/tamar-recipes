<script lang="ts">
  import type { Category } from '../../types/content';
  import { imageSrc } from '../../lib/content';
  let { categories }: { categories: Category[] } = $props();
</script>

<div class="categories-page">
  <header>
    <span>מה מתחשק היום?</span>
    <h1>לגלות לפי קטגוריה</h1>
    <p>כל אחד מתחיל אחרת. בחרו מה מתאים לכם עכשיו, ואנחנו כבר ניקח אתכם למתכון.</p>
  </header>
  <div class="grid">
    {#each categories as category}
      <a href={`/categories/${category.slug}`}>
        <div class="image">
          {#if imageSrc(category.image, 720, 600)}<img
              src={imageSrc(category.image, 720, 600)}
              alt={category.image?.alt || ''}
              width="720"
              height="600"
              loading="lazy"
            />{/if}
        </div>
        <div class="copy">
          <h2>{category.title} <span aria-hidden="true">↗</span></h2>
          {#if category.description}<p>{category.description}</p>{/if}
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .categories-page {
    max-width: var(--max-width);
    margin: auto;
    padding: 75px 28px 35px;
  }
  .categories-page header {
    text-align: center;
    max-width: 660px;
    margin: 0 auto 45px;
  }
  .categories-page header span {
    color: var(--orange);
    font-size: 12px;
    letter-spacing: 0.1em;
    font-weight: 800;
  }
  .categories-page h1 {
    font: 700 clamp(46px, 5vw, 70px)/1.1 var(--font-display);
    letter-spacing: -0.05em;
    margin: 12px 0;
  }
  .categories-page header p {
    color: var(--muted);
    font-size: 17px;
    line-height: 1.7;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  .grid a {
    color: var(--ink);
    text-decoration: none;
  }
  .image {
    aspect-ratio: 1.55;
    background: #eee6d7;
    overflow: hidden;
  }
  .image img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .grid a:hover img {
    transform: scale(1.03);
  }
  .copy {
    padding: 18px 2px;
  }
  .copy h2 {
    font: 700 29px var(--font-display);
    display: flex;
    justify-content: space-between;
    margin: 0;
  }
  .copy h2 span {
    font: 400 20px var(--font-sans);
    color: var(--orange);
  }
  .copy p {
    color: var(--muted);
    font-size: 14px;
    margin: 6px 0;
  }
  @media (max-width: 650px) {
    .categories-page {
      padding: 50px 20px;
    }
    .grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
</style>

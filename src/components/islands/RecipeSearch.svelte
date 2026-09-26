<script lang="ts">
  import { onMount } from 'svelte';
  import type { DietaryLabel, RecipeSearchItem } from '../../types/content';
  import { dietaryLabels } from '../../lib/labels';

  let { index }: { index: RecipeSearchItem[] } = $props();
  let query = $state('');
  let selected = $state<DietaryLabel[]>([]);
  let passover = $state<'none' | 'all' | 'kitniyot'>('none');
  let ready = $state(false);
  let searching = $derived(Boolean(query.trim() || selected.length || passover !== 'none'));
  let matches = $derived(
    index.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.categoryTitle,
        ...item.tags,
        ...item.ingredients,
      ]
        .join(' ')
        .toLocaleLowerCase('he');
      const words = query.trim().toLocaleLowerCase('he').split(/\s+/).filter(Boolean);
      return (
        words.every((word) => haystack.includes(word)) &&
        selected.every((label) => item.dietaryLabels.includes(label)) &&
        (passover === 'none' ||
          item.passoverStatus === 'all' ||
          (passover === 'kitniyot' && item.passoverStatus === 'kitniyot'))
      );
    }),
  );

  function syncGrid() {
    const grid = document.getElementById('archive-grid');
    if (grid) grid.hidden = Boolean(query.trim() || selected.length || passover !== 'none');
  }
  function toggle(label: DietaryLabel) {
    selected = selected.includes(label)
      ? selected.filter((value) => value !== label)
      : [...selected, label];
    syncGrid();
  }
  onMount(() => {
    ready = true;
    syncGrid();
  });
</script>

<div class="recipe-search">
  <label for="recipe-search">מחפשים משהו מסוים?</label>
  <div class="search-control">
    <span class="search-icon" aria-hidden="true">⌕</span>
    <input
      id="recipe-search"
      type="search"
      placeholder="שם של מנה, מצרך או רעיון..."
      value={query}
      oninput={(event) => {
        query = event.currentTarget.value;
        syncGrid();
      }}
      autocomplete="off"
      disabled={!ready}
    />
  </div>
  <div class="filter-row" role="group" aria-label="התאמות תזונתיות">
    {#each Object.entries(dietaryLabels) as [key, label]}
      <button
        type="button"
        class:active={selected.includes(key as DietaryLabel)}
        aria-pressed={selected.includes(key as DietaryLabel)}
        onclick={() => toggle(key as DietaryLabel)}
        disabled={!ready}>{label}</button
      >
    {/each}
    <button
      type="button"
      class:active={passover === 'all'}
      aria-pressed={passover === 'all'}
      onclick={() => {
        passover = passover === 'all' ? 'none' : 'all';
        syncGrid();
      }}
      disabled={!ready}>כשר לפסח</button
    >
    <button
      type="button"
      class:active={passover === 'kitniyot'}
      aria-pressed={passover === 'kitniyot'}
      onclick={() => {
        passover = passover === 'kitniyot' ? 'none' : 'kitniyot';
        syncGrid();
      }}
      disabled={!ready}>פסח · אוכלי קטניות</button
    >
  </div>
  {#if searching}
    <div class="search-results" aria-live="polite">
      <p class="result-count">{matches.length} מתכונים נמצאו</p>
      {#if matches.length}
        <div class="result-grid">
          {#each matches as item}
            <a class="result-card" href={`/recipes/${item.slug}`}>
              {#if item.imageUrl}<img
                  src={item.imageUrl}
                  alt=""
                  width="360"
                  height="270"
                  loading="lazy"
                />{/if}
              <span
                ><small>{item.categoryTitle || 'מתכון'}</small><strong>{item.title}</strong><em
                  >{item.description}</em
                ></span
              >
            </a>
          {/each}
        </div>
      {:else}<div class="empty">לא מצאנו מתכון מתאים. נסו מילה או סינון אחר.</div>{/if}
    </div>
  {/if}
</div>

<style>
  .recipe-search {
    max-width: var(--max-width);
    margin: 0 auto 32px;
  }
  label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .search-control {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--line);
    border-radius: 4px;
    background: #fff;
    padding: 0 16px;
    min-height: 52px;
  }
  .search-control:focus-within {
    outline: 2px solid var(--orange);
    outline-offset: 2px;
  }
  .search-icon {
    font-size: 27px;
    color: var(--orange);
    line-height: 1;
  }
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 10px 0;
    outline: 0;
    color: var(--ink);
    font: inherit;
  }
  input:focus-visible {
    outline: 0;
  }
  input::placeholder {
    color: var(--muted);
  }
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 13px;
  }
  .filter-row button {
    border: 1px solid var(--line);
    background: var(--paper);
    color: var(--ink);
    border-radius: 25px;
    padding: 7px 13px;
    cursor: pointer;
    font: 700 12px var(--font-sans);
  }
  .filter-row button.active {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  .result-count {
    border-bottom: 1px solid var(--line);
    padding-bottom: 13px;
    color: var(--muted);
    font-size: 13px;
  }
  .result-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .result-card {
    display: block;
    text-decoration: none;
    color: var(--ink);
  }
  .result-card img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 4px;
  }
  .result-card span {
    display: grid;
    gap: 5px;
    padding-top: 12px;
  }
  .result-card small {
    color: var(--orange);
    font-size: 12px;
    font-weight: 700;
  }
  .result-card strong {
    font: 700 23px/1.3 var(--font-display);
  }
  .result-card em {
    font-style: normal;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.55;
  }
  .empty {
    background: var(--cream);
    padding: 30px;
    text-align: center;
    color: var(--muted);
  }
  @media (max-width: 750px) {
    .result-grid {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
  @media (max-width: 500px) {
    .result-grid {
      grid-template-columns: 1fr;
    }
    .result-card {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 13px;
    }
    .result-card img {
      height: 100px;
    }
    .result-card span {
      padding: 0;
    }
    .result-card strong {
      font-size: 19px;
    }
    .result-card em {
      display: none;
    }
  }
</style>

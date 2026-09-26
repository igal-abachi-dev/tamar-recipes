<script lang="ts">
  import type { IngredientGroup } from '../../types/content';
  import { formatMeasure } from '../../lib/measure';

  let {
    groups,
    gramsFirst = false,
    idPrefix = 'flat',
  }: { groups: IngredientGroup[]; gramsFirst?: boolean; idPrefix?: string } = $props();
</script>

{#each groups as group, groupIndex}
  <div class="ingredient-group">
    {#if group.title}<h4>{group.title}</h4>{/if}
    <ul>
      {#each group.items || [] as item, itemIndex}
        <li>
          <label>
            <input type="checkbox" />
            <span>
              {#if formatMeasure(item, 1, 'original', gramsFirst).primary}<strong
                  data-amount-primary={`${idPrefix}-${groupIndex}-${itemIndex}`}
                  >{formatMeasure(item, 1, 'original', gramsFirst).primary}</strong
                >{/if}
              {item.name}
              <small data-amount-secondary={`${idPrefix}-${groupIndex}-${itemIndex}`}
                >{#if formatMeasure(item, 1, 'original', gramsFirst).secondary}({formatMeasure(
                    item,
                    1,
                    'original',
                    gramsFirst,
                  ).secondary}){/if}</small
              >
              {#if item.prepNote}<small> · {item.prepNote}</small>{/if}
              {#if item.splitNote}<small class="split-note">חלוקה: {item.splitNote}</small>{/if}
              {#if item.note}<small class="ingredient-note">{item.note}</small>{/if}
            </span>
          </label>
        </li>
      {/each}
    </ul>
  </div>
{/each}

<style>
  h4 {
    font: 700 15px var(--font-display);
    margin: 17px 0 5px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid #ded9cd;
  }
  label {
    display: flex;
    gap: 11px;
    align-items: start;
    padding: 12px 0;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.55;
  }
  input {
    accent-color: var(--orange);
    margin-top: 4px;
    width: 16px;
    height: 16px;
    flex: none;
  }
  input:checked + span {
    text-decoration: line-through;
    color: #929589;
  }
  strong {
    font-weight: 700;
    margin-inline-end: 4px;
  }
  small {
    color: var(--muted);
  }
  .split-note,
  .ingredient-note {
    display: block;
    font-size: 12px;
  }
  .split-note {
    color: #8c4e2a;
  }
</style>

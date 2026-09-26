<script lang="ts">
  import type { Step } from '../../types/content';
  import { imageSrc, timeRangeLabel } from '../../lib/content';
  import {
    burnerSizeLabels,
    flameSelectLabel,
    ovenModeLabels,
    paragraphs,
  } from '../../lib/recipe-helpers';

  let { steps }: { steps: Step[] } = $props();
</script>

<ol class="steps">
  {#each steps as step, index}
    <li>
      <div class="step-rail">
        <span class="step-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div class="step-copy">
        {#if step.stage}<h4>{step.stage}</h4>{/if}
        {#each paragraphs(step.text) as paragraph}<p>{paragraph}</p>{/each}
        {#if step.durationMinutes !== undefined || step.temperatureC !== undefined || step.ovenMode || step.ovenTimerMinutes !== undefined || step.flameSelectLevel || step.burnerSize}
          <div class="step-settings" aria-label="הגדרות לשלב">
            {#if step.durationMinutes !== undefined}<span
                >משך: {timeRangeLabel(step.durationMinutes, step.durationMinutesMax)}</span
              >{/if}
            {#if step.ovenMode}<span>תנור: {ovenModeLabels[step.ovenMode]}</span>{/if}
            {#if step.temperatureC !== undefined}<span>{step.temperatureC}°C</span>{/if}
            {#if step.ovenTimerMinutes !== undefined}<span
                >טיימר תנור: {timeRangeLabel(step.ovenTimerMinutes)}</span
              >{/if}
            {#if step.flameSelectLevel}<span>{flameSelectLabel(step.flameSelectLevel)}</span>{/if}
            {#if step.burnerSize}<span>מבער: {burnerSizeLabels[step.burnerSize]}</span>{/if}
          </div>
        {/if}
        {#if step.cue}<p class="step-cue"><b>סימן שמוכן:</b> {step.cue}</p>{/if}
        {#if step.why}<details class="step-why full-extra">
            <summary>למה עושים כך?</summary>{#each paragraphs(step.why) as paragraph}<p>
                {paragraph}
              </p>{/each}
          </details>{/if}
        {#if imageSrc(step.image, 720, 480)}<img
            src={imageSrc(step.image, 720, 480)}
            alt={step.image?.alt || ''}
            width="720"
            height="480"
            loading="lazy"
          />{/if}
      </div>
    </li>
  {/each}
</ol>

<style>
  .steps {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: grid;
    grid-template-columns: 58px 1fr;
    gap: 18px;
    padding: 23px 0;
    border-top: 1px solid var(--line);
  }
  .step-rail {
    display: grid;
    align-content: start;
    gap: 8px;
  }
  .step-number {
    font: 700 27px var(--font-display);
    color: var(--orange);
  }
  .step-copy h4 {
    font: 700 20px var(--font-display);
    margin: 0 0 8px;
  }
  .step-copy p {
    font-size: 17px;
    line-height: 1.85;
    margin: 0;
  }
  .step-copy p + p {
    margin-top: 12px;
  }
  .step-copy img {
    margin-top: 18px;
    width: 100%;
    height: auto;
  }
  .step-settings {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-top: 13px;
    color: #8c4e2a;
    font-size: 13px;
    font-weight: 700;
  }
  .step-settings span {
    background: #f6efe6;
    padding: 5px 8px;
    border-radius: 3px;
  }
  .step-copy .step-cue {
    background: #f3f2e9;
    padding: 10px 14px;
    margin-top: 13px;
    font-size: 14px;
  }
  .step-why {
    border-inline-start: 2px solid var(--orange);
    margin-top: 12px;
    padding-inline-start: 12px;
    color: var(--muted);
    font-size: 14px;
  }
  .step-why summary {
    cursor: pointer;
    font-weight: 700;
  }
  .step-why p {
    font-size: 14px;
  }
  @media (max-width: 750px) {
    li {
      grid-template-columns: 40px 1fr;
      gap: 10px;
    }
    .step-copy p {
      font-size: 16px;
    }
  }
  @media print {
    .step-why {
      display: block !important;
    }
  }
</style>

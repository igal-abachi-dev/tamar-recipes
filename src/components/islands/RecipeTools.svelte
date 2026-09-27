<script lang="ts">
  import { onMount } from 'svelte';
  import type { RecipeStepWithComponent } from '../../lib/recipe-helpers';
  import type { RecipeTimelineItem } from '../../types/content';
  import { timeLabel } from '../../lib/time';
  import { formatMeasure, type IngredientMeasure, type UnitSystem } from '../../lib/measure';
  import { burnerSizeLabels, flameSelectLabel, ovenModeLabels } from '../../lib/recipe-helpers';

  interface Timer {
    id: string;
    label: string;
    endAt: number;
  }

  let {
    title,
    url,
    storageKey,
    steps,
    timeline = [],
    baseServings,
    ingredientMeasures = [],
    gramsFirst = false,
  }: {
    title: string;
    url: string;
    storageKey: string;
    steps: RecipeStepWithComponent[];
    timeline?: RecipeTimelineItem[];
    baseServings: number;
    ingredientMeasures?: Array<{ id: string; measure: IngredientMeasure }>;
    gramsFirst?: boolean;
  } = $props();

  let supported = $state(false);
  let canShare = $state(false);
  let awake = $state(false);
  let manualWake = $state(false);
  let modeOpen = $state(false);
  let currentStep = $state(0);
  let timers = $state<Timer[]>([]);
  let now = $state(Date.now());
  let servingAt = $state('');
  let message = $state('');
  let modeDialog: HTMLDialogElement;
  let plannerDialog: HTMLDialogElement;
  let amountsDialog: HTMLDialogElement;
  let desiredServings = $state(0);
  let unitSystem = $state<UnitSystem>('original');
  let lock: WakeLockSentinel | undefined;
  let notified = new Set<string>();
  let timerAudio: AudioContext | undefined;

  let planningRows = $derived.by(() => {
    const serving = new Date(servingAt).getTime();
    if (!servingAt || Number.isNaN(serving)) return [];
    return timeline
      .filter((item) => item.minutesBeforeServing !== undefined)
      .sort((a, b) => (b.minutesBeforeServing || 0) - (a.minutesBeforeServing || 0))
      .map((item) => ({
        label: item.label,
        when: new Intl.DateTimeFormat('he-IL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(serving - (item.minutesBeforeServing || 0) * 60_000)),
        tasks: item.tasks,
      }));
  });

  function saveProgress(index: number) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    try {
      localStorage.setItem(`recipe-progress:${storageKey}`, String(currentStep));
    } catch {
      /* private browsing */
    }
  }
  function saveTimers() {
    try {
      localStorage.setItem(`recipe-timers:${storageKey}`, JSON.stringify(timers));
    } catch {
      /* private browsing */
    }
  }
  function startTimer(
    step: RecipeStepWithComponent,
    index: number,
    minutes: number,
    label = 'שלב',
  ) {
    if (minutes <= 0) return;
    void prepareTimerAudio();
    timers = [
      ...timers,
      {
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        label: `${step.componentTitle ? `${step.componentTitle} · ` : ''}${step.localNumber ? `${label} ${step.localNumber}` : 'מתכון בסיסי'}`,
        endAt: Date.now() + minutes * 60_000,
      },
    ];
    saveTimers();
    message = `הטיימר ל${step.componentTitle ? `${step.componentTitle} · ` : ''}שלב ${step.localNumber} התחיל`;
  }
  async function prepareTimerAudio() {
    try {
      timerAudio ||= new AudioContext();
      if (timerAudio.state === 'suspended') await timerAudio.resume();
    } catch {
      /* sound is optional when the browser blocks audio */
    }
  }
  function alertTimer() {
    navigator.vibrate?.([160, 90, 160]);
    try {
      if (!timerAudio || timerAudio.state !== 'running') return;
      const oscillator = timerAudio.createOscillator();
      const gain = timerAudio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, timerAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, timerAudio.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, timerAudio.currentTime + 0.38);
      oscillator.connect(gain).connect(timerAudio.destination);
      oscillator.start();
      oscillator.stop(timerAudio.currentTime + 0.4);
    } catch {
      /* text alert remains available */
    }
  }
  function updateAmounts(servings = desiredServings, system = unitSystem) {
    if (baseServings <= 0) return;
    desiredServings = Math.max(1, Math.min(100, Math.round(servings) || baseServings));
    unitSystem = system;
    const scale = desiredServings / baseServings;
    for (const entry of ingredientMeasures) {
      const primary = document.querySelector<HTMLElement>(`[data-amount-primary="${entry.id}"]`);
      const secondary = document.querySelector<HTMLElement>(
        `[data-amount-secondary="${entry.id}"]`,
      );
      const formatted = formatMeasure(entry.measure, scale, system, gramsFirst);
      if (primary) primary.textContent = formatted.primary;
      if (secondary) secondary.textContent = formatted.secondary ? `(${formatted.secondary})` : '';
    }
    const yieldElement = document.querySelector<HTMLElement>('[data-recipe-yield]');
    if (yieldElement) {
      const originalYield = yieldElement.dataset.originalYield || yieldElement.textContent || '';
      yieldElement.dataset.originalYield = originalYield;
      yieldElement.textContent =
        desiredServings === baseServings
          ? originalYield
          : `${desiredServings} מנות (תפוקה מקורית: ${originalYield})`;
    }
    try {
      localStorage.setItem(
        `recipe-amounts:${storageKey}`,
        JSON.stringify({ servings: desiredServings, system }),
      );
    } catch {
      /* private browsing */
    }
  }
  function removeTimer(id: string) {
    timers = timers.filter((timer) => timer.id !== id);
    notified.delete(id);
    saveTimers();
  }
  function timerText(endAt: number): string {
    const seconds = Math.max(0, Math.ceil((endAt - now) / 1000));
    if (!seconds) return 'הזמן הסתיים';
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  async function syncWakeLock() {
    if (!manualWake && !modeOpen) {
      await lock?.release();
      lock = undefined;
      awake = false;
      return;
    }
    if (!supported || document.visibilityState !== 'visible' || lock) return;
    try {
      lock = await navigator.wakeLock.request('screen');
      awake = true;
      lock.addEventListener('release', () => {
        lock = undefined;
        awake = false;
      });
    } catch {
      awake = false;
      message = 'לא ניתן להשאיר את המסך דולק בדפדפן הזה';
    }
  }
  function openMode() {
    modeDialog.showModal();
    modeOpen = true;
    void syncWakeLock();
  }
  function closeMode() {
    modeDialog.close();
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* share sheet cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        message = 'הקישור הועתק';
      } catch {
        message = 'אפשר להעתיק את הכתובת מהדפדפן';
      }
    }
  }

  onMount(() => {
    desiredServings = baseServings;
    supported = Boolean(navigator.wakeLock?.request);
    canShare = Boolean(navigator.share);
    try {
      const saved = Number(localStorage.getItem(`recipe-progress:${storageKey}`));
      if (Number.isInteger(saved) && saved >= 0 && saved < steps.length) currentStep = saved;
      const stored = JSON.parse(localStorage.getItem(`recipe-timers:${storageKey}`) || '[]');
      if (Array.isArray(stored))
        timers = stored.filter(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            typeof item.label === 'string' &&
            Number.isFinite(item.endAt),
        );
      const amounts = JSON.parse(localStorage.getItem(`recipe-amounts:${storageKey}`) || 'null');
      if (
        amounts &&
        Number.isFinite(amounts.servings) &&
        ['original', 'metric', 'us'].includes(amounts.system)
      )
        updateAmounts(amounts.servings, amounts.system);
    } catch {
      /* private browsing or old data */
    }
    const interval = window.setInterval(() => {
      now = Date.now();
      for (const timer of timers) {
        if (timer.endAt <= now && !notified.has(timer.id)) {
          notified.add(timer.id);
          message = `${timer.label}: הזמן הסתיים`;
          alertTimer();
        }
      }
    }, 1000);
    const visibility = () => {
      if (document.visibilityState === 'visible') void syncWakeLock();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
      void lock?.release();
      void timerAudio?.close();
    };
  });
</script>

{#if timers.length}<div class="timer-board" role="group" aria-label="טיימרים פעילים">
    {#each timers as timer}<div class:finished={timer.endAt <= now}>
        <span
          >{timer.label}:
          <b role={timer.endAt <= now ? 'alert' : undefined}>{timerText(timer.endAt)}</b></span
        >
        <button
          type="button"
          aria-label={`סגירת הטיימר ${timer.label}`}
          onclick={() => removeTimer(timer.id)}>×</button
        >
      </div>{/each}
  </div>{/if}

<div class="kitchen-tools" role="group" aria-label="כלים למתכון">
  <button type="button" onclick={() => window.print()}>הדפסה</button>
  <button type="button" onclick={share}>שיתוף</button>
  {#if !canShare}<a
      href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
      target="_blank"
      rel="noopener noreferrer">WhatsApp</a
    >{/if}
  {#if steps.length}<button type="button" onclick={openMode}>מצב בישול</button>{/if}
  {#if baseServings > 0 && ingredientMeasures.length}<button
      type="button"
      onclick={() => amountsDialog.showModal()}
      >{desiredServings > 0 && desiredServings !== baseServings
        ? `${desiredServings} מנות · יחידות`
        : 'כמויות ויחידות'}</button
    >{/if}
  {#if timeline.some((item) => item.minutesBeforeServing !== undefined)}<button
      type="button"
      onclick={() => plannerDialog.showModal()}>מתי להתחיל?</button
    >{/if}
  {#if supported}<button
      type="button"
      aria-pressed={manualWake}
      onclick={() => {
        manualWake = !manualWake;
        void syncWakeLock();
      }}>{manualWake ? 'מסך דולק' : 'השאירו מסך דולק'}</button
    >{/if}
  {#if message}<span class="tool-message" role="status">{message}</span>{/if}
</div>

<dialog
  class="recipe-dialog"
  bind:this={modeDialog}
  onclose={() => {
    modeOpen = false;
    void syncWakeLock();
  }}
  aria-labelledby="cooking-title"
>
  <div class="dialog-head">
    <h2 id="cooking-title">מצב בישול</h2>
    <button type="button" onclick={closeMode} aria-label="סגירה">×</button>
  </div>
  {#if steps[currentStep]}
    <p class="progress">
      {#if steps[currentStep].componentTitle}{steps[currentStep].componentTitle} ·
      {/if}{steps[currentStep].localNumber
        ? `שלב ${steps[currentStep].localNumber}`
        : 'מתכון בסיסי'}
      <span>({currentStep + 1} מתוך {steps.length} במתכון)</span>
    </p>
    {#if steps[currentStep].stage}<h3>{steps[currentStep].stage}</h3>{/if}
    <p class="instruction">{steps[currentStep].text}</p>
    {#if steps[currentStep].ovenMode || steps[currentStep].temperatureC !== undefined || steps[currentStep].flameSelectLevel || steps[currentStep].burnerSize}
      <div class="mode-settings">
        {#if steps[currentStep].ovenMode}<span
            >תנור: {ovenModeLabels[steps[currentStep].ovenMode!]}</span
          >{/if}
        {#if steps[currentStep].temperatureC !== undefined}<span
            >{steps[currentStep].temperatureC}°C</span
          >{/if}
        {#if steps[currentStep].flameSelectLevel}<span
            >{flameSelectLabel(steps[currentStep].flameSelectLevel!)}</span
          >{/if}
        {#if steps[currentStep].burnerSize}<span
            >מבער {burnerSizeLabels[steps[currentStep].burnerSize!]}</span
          >{/if}
      </div>
    {/if}
    {#if steps[currentStep].recipeUrl}<p>
        <a href={steps[currentStep].recipeUrl}>לפתיחת מתכון הבסיס ←</a>
      </p>{/if}
    {#if steps[currentStep].cue}<p class="cue"><b>סימן שמוכן:</b> {steps[currentStep].cue}</p>{/if}
    {#if steps[currentStep].durationMinutes}<button
        class="timer-start"
        type="button"
        onclick={() =>
          startTimer(steps[currentStep], currentStep, steps[currentStep].durationMinutes || 0)}
        >טיימר לשלב · {timeLabel(steps[currentStep].durationMinutes || 0)}</button
      >{/if}
    {#if steps[currentStep].durationMinutesMax && steps[currentStep].durationMinutesMax !== steps[currentStep].durationMinutes}<button
        class="timer-start"
        type="button"
        onclick={() =>
          startTimer(steps[currentStep], currentStep, steps[currentStep].durationMinutesMax || 0)}
        >טיימר לקצה הטווח · {timeLabel(steps[currentStep].durationMinutesMax || 0)}</button
      >{/if}
    {#if steps[currentStep].ovenTimerMinutes && steps[currentStep].ovenTimerMinutes !== steps[currentStep].durationMinutes}<button
        class="timer-start"
        type="button"
        onclick={() =>
          startTimer(
            steps[currentStep],
            currentStep,
            steps[currentStep].ovenTimerMinutes || 0,
            'תנור',
          )}>טיימר תנור · {timeLabel(steps[currentStep].ovenTimerMinutes || 0)}</button
      >{/if}
    <div class="mode-nav">
      <button
        type="button"
        disabled={currentStep === 0}
        onclick={() => saveProgress(currentStep - 1)}>הקודם</button
      >
      <button
        type="button"
        disabled={currentStep === steps.length - 1}
        onclick={() => saveProgress(currentStep + 1)}>סיימתי · הבא</button
      >
    </div>
    <p class="saved-note">המקום במתכון נשמר בדפדפן הזה בלבד.</p>
  {/if}
</dialog>

<dialog
  class="recipe-dialog amounts-dialog"
  bind:this={amountsDialog}
  aria-labelledby="amounts-title"
>
  <div class="dialog-head">
    <h2 id="amounts-title">כמויות ויחידות</h2>
    <button type="button" onclick={() => amountsDialog.close()} aria-label="סגירה">×</button>
  </div>
  <p>המתכון המקורי מתאים ל־{baseServings} מנות.</p>
  <label for="servings-count">לכמה מנות מכינים?</label>
  <input
    id="servings-count"
    type="number"
    min="1"
    max="100"
    step="1"
    value={desiredServings}
    oninput={(event) => updateAmounts(Number(event.currentTarget.value), unitSystem)}
  />
  <fieldset>
    <legend>יחידות מידה</legend>
    <label
      ><input
        type="radio"
        name="unit-system"
        checked={unitSystem === 'original'}
        onchange={() => updateAmounts(desiredServings, 'original')}
      /> כמו שתמר כתבה</label
    >
    <label
      ><input
        type="radio"
        name="unit-system"
        checked={unitSystem === 'metric'}
        onchange={() => updateAmounts(desiredServings, 'metric')}
      /> מטרי (גרם, מ״ל)</label
    >
    <label
      ><input
        type="radio"
        name="unit-system"
        checked={unitSystem === 'us'}
        onchange={() => updateAmounts(desiredServings, 'us')}
      /> אמריקאי (oz, lb, cup)</label
    >
  </fieldset>
  <p class="saved-note">
    הכמויות מתעדכנות ברשימת המצרכים. הערות, גודל התבנית ומצרכים בלי כמות מספרית נשארים כפי שנכתבו.
    המידות האמריקאיות מקורבות; באפייה עדיף לשקול בגרמים.
  </p>
  <button class="timer-start" type="button" onclick={() => amountsDialog.close()}
    >חזרה למתכון</button
  >
</dialog>

<dialog
  class="recipe-dialog planner-dialog"
  bind:this={plannerDialog}
  aria-labelledby="planner-title"
>
  <div class="dialog-head">
    <h2 id="planner-title">מתי מתחילים?</h2>
    <button type="button" onclick={() => plannerDialog.close()} aria-label="סגירה">×</button>
  </div>
  <label for="serve-at">מתי רוצים להגיש?</label>
  <input id="serve-at" type="datetime-local" bind:value={servingAt} />
  {#if planningRows.length}<ol>
      {#each planningRows as row}<li>
          <strong>{row.when}</strong><span>{row.label}</span>
          <ul>
            {#each row.tasks || [] as task}<li>{task}</li>{/each}
          </ul>
        </li>{/each}
    </ol>{:else}<p>בחרו שעה ותאריך כדי לראות מתי להתחיל כל משימה.</p>{/if}
</dialog>

<style>
  .kitchen-tools {
    position: fixed;
    bottom: 18px;
    right: 18px;
    z-index: 30;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 7px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: 0 8px 30px #29332924;
  }
  .kitchen-tools button,
  .kitchen-tools a {
    border: 0;
    background: transparent;
    color: var(--ink);
    padding: 9px 12px;
    border-radius: 5px;
    font: 700 12px var(--font-sans);
    cursor: pointer;
    text-decoration: none;
  }
  .kitchen-tools button:hover,
  .kitchen-tools a:hover,
  .kitchen-tools button[aria-pressed='true'] {
    background: var(--ink);
    color: #fff;
  }
  .tool-message {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: var(--ink);
    color: white;
    padding: 7px 11px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
  .timer-board {
    position: fixed;
    bottom: 85px;
    right: 18px;
    z-index: 29;
    background: var(--paper);
    border: 1px solid var(--line);
    box-shadow: 0 8px 30px #29332924;
    border-radius: 8px;
    padding: 8px 12px;
    max-width: min(400px, calc(100vw - 20px));
    max-height: 30vh;
    overflow: auto;
  }
  .timer-board > div {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    font-size: 13px;
    padding: 4px 0;
  }
  .timer-board .finished {
    color: #9f351c;
  }
  .timer-board button {
    border: 0;
    background: none;
    font-size: 18px;
    cursor: pointer;
  }
  .recipe-dialog {
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--paper);
    color: var(--ink);
    box-shadow: 0 20px 70px #29332955;
    width: min(700px, calc(100vw - 24px));
    max-height: min(85vh, 900px);
    padding: 28px;
  }
  .recipe-dialog::backdrop {
    background: #17221ac7;
  }
  .dialog-head {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;
    border-bottom: 1px solid var(--line);
  }
  .dialog-head h2 {
    font: 700 30px var(--font-display);
    margin: 0 0 15px;
  }
  .dialog-head button {
    border: 0;
    background: transparent;
    font-size: 32px;
    cursor: pointer;
    line-height: 1;
  }
  .progress {
    color: var(--orange);
    font-weight: 800;
  }
  .recipe-dialog h3 {
    font: 700 23px var(--font-display);
  }
  .instruction {
    white-space: pre-line;
    font: 500 clamp(24px, 4vw, 35px)/1.6 var(--font-display);
    margin: 22px 0;
  }
  .cue {
    background: #eef0e8;
    padding: 14px;
  }
  .mode-settings {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    color: #8c4e2a;
    font-weight: 700;
    line-height: 1.7;
  }
  .timer-start,
  .mode-nav button {
    border: 0;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    background: var(--ink);
    color: white;
    font-weight: 700;
  }
  .timer-start {
    background: var(--orange);
  }
  .mode-nav {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 35px;
  }
  .mode-nav button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .saved-note {
    color: var(--muted);
    font-size: 12px;
  }
  .planner-dialog label {
    display: block;
    font-weight: 700;
    margin: 20px 0 5px;
  }
  .planner-dialog input {
    width: 100%;
    border: 1px solid var(--line);
    padding: 10px;
    color: var(--ink);
    background: white;
  }
  .amounts-dialog > p {
    color: var(--muted);
    line-height: 1.7;
  }
  .amounts-dialog > label {
    display: block;
    font-weight: 700;
    margin: 18px 0 7px;
  }
  .amounts-dialog > input {
    width: 110px;
    border: 1px solid var(--line);
    background: white;
    padding: 9px;
    font: inherit;
  }
  .amounts-dialog fieldset {
    border: 1px solid var(--line);
    margin: 20px 0;
    padding: 14px;
  }
  .amounts-dialog legend {
    font-weight: 700;
  }
  .amounts-dialog fieldset label {
    display: block;
    margin: 6px 0;
    cursor: pointer;
  }
  .amounts-dialog fieldset input {
    accent-color: var(--orange);
  }
  .planner-dialog ol {
    margin: 20px 0;
    padding-inline-start: 25px;
  }
  .planner-dialog ol > li {
    margin: 15px 0;
  }
  .planner-dialog ol strong,
  .planner-dialog ol span {
    display: block;
  }
  .planner-dialog ol span {
    color: var(--orange);
  }
  @media (max-width: 650px) {
    .kitchen-tools {
      left: 10px;
      right: 10px;
      bottom: 10px;
      justify-content: center;
    }
    .kitchen-tools button,
    .kitchen-tools a {
      padding: 7px;
      font-size: 11px;
    }
    .timer-board {
      left: 10px;
      right: 10px;
      bottom: 95px;
      max-width: none;
    }
    .recipe-dialog {
      padding: 20px;
    }
  }
  @media print {
    .kitchen-tools,
    .timer-board,
    .recipe-dialog {
      display: none !important;
    }
  }
</style>

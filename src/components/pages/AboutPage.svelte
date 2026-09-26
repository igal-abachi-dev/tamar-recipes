<script lang="ts">
  import { PortableText, type InputValue } from '@portabletext/svelte';
  import type { SiteSettings } from '../../types/content';
  import { imageSrc } from '../../lib/content';
  let { settings }: { settings: SiteSettings } = $props();
</script>

<div class="about-page">
  <div class="about-top">
    <span class="eyebrow">הסיפור שמאחורי המתכונים</span>
    <h1>המטבח<br /><em>של תמר.</em></h1>
    <p>
      {settings.aboutLead ||
        'המקום הזה נולד כדי לאסוף את המתכונים שמחזירים אותנו הביתה — ולתת להם בית שאפשר לחזור אליו בכל פעם שמתחשק לבשל.'}
    </p>
  </div>
  <div class="about-content">
    <div class="about-illustration">
      {#if imageSrc(settings.portrait, 760, 850)}<img
          src={imageSrc(settings.portrait, 760, 850)}
          alt={settings.portrait?.alt || 'תמר'}
          width="760"
          height="850"
        />{:else}<span aria-hidden="true">✳</span>{/if}
    </div>
    <div>
      <h2>מתכונים שכיף לחלוק</h2>
      {#if settings.aboutBody?.length}<div class="about-story">
          <PortableText value={settings.aboutBody as InputValue} />
        </div>{:else}<p>
          בקרוב תמר תספר כאן את הסיפור שלה במילים שלה: על המטבח, האנשים והמנות שהיא הכי אוהבת להכין.
        </p>{/if}<a href="/recipes">לכל המתכונים ←</a>
    </div>
  </div>
</div>

<style>
  .about-page {
    max-width: var(--max-width);
    margin: auto;
    padding: 75px 28px 50px;
  }
  .about-top {
    max-width: 800px;
  }
  .eyebrow {
    color: var(--orange);
    font-size: 12px;
    letter-spacing: 0.1em;
    font-weight: 800;
  }
  .about-top h1 {
    font: 700 clamp(58px, 8vw, 105px)/1.05 var(--font-display);
    letter-spacing: -0.06em;
    margin: 20px 0;
  }
  .about-top h1 em {
    font-style: normal;
    color: var(--orange);
    font-weight: 400;
  }
  .about-top p {
    font-size: 20px;
    line-height: 1.75;
    color: var(--muted);
  }
  .about-content {
    margin-top: 75px;
    display: grid;
    grid-template-columns: 42% 1fr;
    background: #eef0e8;
    align-items: center;
  }
  .about-illustration {
    font-size: 230px;
    text-align: center;
    color: var(--orange);
  }
  .about-illustration img {
    width: 100%;
    height: 100%;
    max-height: 650px;
    object-fit: cover;
  }
  .about-content > div:last-child {
    padding: 55px 70px;
  }
  .about-content h2 {
    font: 700 42px var(--font-display);
    letter-spacing: -0.04em;
    margin: 0 0 20px;
  }
  .about-content p,
  .about-story :global(p) {
    line-height: 1.8;
    color: #555e53;
  }
  .about-content a {
    color: var(--orange);
    font-weight: 800;
    text-decoration: none;
  }
  @media (max-width: 650px) {
    .about-page {
      padding: 50px 20px;
    }
    .about-content {
      display: block;
      margin-top: 45px;
    }
    .about-illustration {
      font-size: 120px;
    }
    .about-content > div:last-child {
      padding: 25px;
    }
    .about-content h2 {
      font-size: 32px;
    }
  }
</style>

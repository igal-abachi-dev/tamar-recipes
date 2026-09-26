<script lang="ts">
  const nav = [
    { href: '/recipes', label: 'כל המתכונים' },
    { href: '/categories', label: 'קטגוריות' },
    { href: '/about', label: 'קצת עליי' },
  ];
</script>

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="brand" aria-label="אתר המתכונים של תמר - דף הבית">
      <span class="brand-mark" aria-hidden="true">✳</span>
      <span class="brand-name">אתר המתכונים <em>של תמר</em></span>
    </a>
    <nav class="desktop-nav" aria-label="ניווט ראשי">
      {#each nav as item}<a href={item.href}>{item.label}</a>{/each}
    </nav>
    <a class="header-cta" href="/recipes">למצוא מתכון <span aria-hidden="true">←</span></a>
  </div>
  <details class="mobile-nav">
    <summary>תפריט <span aria-hidden="true">☰</span></summary>
    <nav aria-label="ניווט לנייד">
      {#each nav as item}<a href={item.href}>{item.label}</a>{/each}
    </nav>
  </details>
</header>

<style>
  .site-header {
    background: var(--cream);
    border-bottom: 1px solid var(--line);
    position: relative;
    z-index: 20;
  }
  .header-inner {
    max-width: var(--max-width);
    margin: auto;
    min-height: 86px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    gap: 34px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--ink);
    white-space: nowrap;
  }
  .brand-mark {
    font-size: 38px;
    color: var(--orange);
    line-height: 1;
  }
  .brand-name {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.06em;
  }
  .brand-name em {
    font-weight: 400;
    font-style: normal;
    color: var(--orange);
  }
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 23px;
    margin-inline-start: auto;
  }
  .desktop-nav a {
    font-size: 14px;
    color: var(--ink);
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap;
  }
  .desktop-nav a:hover,
  .desktop-nav a:focus-visible {
    color: var(--orange);
  }
  .header-cta {
    padding: 11px 16px;
    background: var(--ink);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
  }
  .header-cta:hover {
    background: var(--orange);
    color: white;
  }
  .mobile-nav {
    display: none;
  }
  @media (max-width: 1050px) {
    .desktop-nav {
      gap: 13px;
    }
    .desktop-nav a {
      font-size: 12px;
    }
    .header-cta {
      display: none;
    }
  }
  @media (max-width: 760px) {
    .header-inner {
      min-height: 70px;
      padding: 0 18px;
    }
    .brand-name {
      font-size: 23px;
    }
    .brand-mark {
      font-size: 30px;
    }
    .desktop-nav {
      display: none;
    }
    .mobile-nav {
      display: block;
      border-top: 1px solid var(--line);
    }
    .mobile-nav summary {
      padding: 10px 18px;
      cursor: pointer;
      font-weight: 700;
      list-style: none;
      display: flex;
      justify-content: space-between;
    }
    .mobile-nav summary::-webkit-details-marker {
      display: none;
    }
    .mobile-nav nav {
      display: grid;
      padding: 0 18px 14px;
    }
    .mobile-nav a {
      padding: 10px 0;
      color: var(--ink);
      text-decoration: none;
      border-top: 1px solid var(--line);
    }
  }
</style>

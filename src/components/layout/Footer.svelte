<script lang="ts">
  import type { SiteSettings } from '../../types/content';
  let { settings }: { settings: SiteSettings } = $props();
  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-main">
    <div class="footer-intro">
      <div class="footer-brand">אתר המתכונים <em>של תמר</em><span aria-hidden="true">✳</span></div>
      <p>
        {settings.footerText ||
          'מתכונים כשרים של בית, סיפורים של שולחן. מקום לשמור ולחלוק את מה שטעים לנו באמת.'}
      </p>
    </div>
    <nav aria-label="קישורים נוספים">
      <div>
        <h2>לגלות</h2>
        <a href="/recipes">כל המתכונים</a><a href="/categories">קטגוריות</a>
      </div>
      <div>
        <h2>עוד קצת</h2>
        <a href="/about">על תמר</a>
      </div>
    </nav>
  </div>
  <div class="footer-bottom">
    <span>© {year} אתר המתכונים של תמר</span><span>נעשה באהבה, בשביל המטבח של כולנו</span>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: 90px;
    background: #263126;
    color: #f7f2e8;
  }
  .footer-main,
  .footer-bottom {
    max-width: var(--max-width);
    margin: auto;
    padding-inline: 28px;
  }
  .footer-main {
    display: flex;
    justify-content: space-between;
    gap: 50px;
    padding-top: 65px;
    padding-bottom: 55px;
  }
  .footer-brand {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.05em;
  }
  .footer-brand em {
    font-style: normal;
    color: #d6a77a;
    font-weight: 400;
  }
  .footer-brand span {
    color: #d6a77a;
    margin-inline-start: 8px;
  }
  .footer-intro p {
    line-height: 1.9;
    color: #d7ddcf;
    font-size: 15px;
  }
  nav {
    display: flex;
    gap: 75px;
  }
  nav div {
    display: grid;
    align-content: start;
    gap: 12px;
  }
  h2 {
    font-size: 13px;
    margin: 0 0 6px;
    color: #f7f2e8;
  }
  a {
    font-size: 14px;
    color: #d7ddcf;
    text-decoration: none;
  }
  a:hover {
    color: white;
  }
  .footer-bottom {
    padding-top: 20px;
    padding-bottom: 25px;
    border-top: 1px solid #495448;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #c0cbbd;
  }
  @media (max-width: 700px) {
    .footer-main {
      display: block;
      padding: 45px 20px;
    }
    .footer-main nav {
      gap: 40px;
      margin-top: 34px;
    }
    .footer-bottom {
      padding-inline: 20px;
      gap: 15px;
      flex-wrap: wrap;
    }
  }
</style>

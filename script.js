const siteData = window.SITE_DATA;
const app = document.getElementById("app");
const activeSlug = document.body.dataset.page || "home";
const page = siteData.pages[activeSlug] || siteData.pages.home;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugPath(slug) {
  return slug === "home" ? "/" : `/${slug}/`;
}

function pageBySlug(slug) {
  return siteData.pages[slug];
}

function updateMeta() {
  document.title = page.metaTitle || page.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", page.metaDescription || siteData.company.metaDescription);
  }

  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement("link");
    canonicalTag.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalTag);
  }

  const origin = window.location.origin || "http://127.0.0.1:4173";
  canonicalTag.setAttribute("href", `${origin}${slugPath(activeSlug)}`);
}

function renderHeader() {
  return `
    <div class="topbar">
      <div class="container topbar__inner">
        <p>${escapeHtml(siteData.company.addressLine)}</p>
        <div class="topbar__links">
          <a href="tel:${escapeHtml(siteData.company.phoneHref)}">${escapeHtml(siteData.company.phoneDisplay)}</a>
          <a href="mailto:${escapeHtml(siteData.company.email)}">${escapeHtml(siteData.company.email)}</a>
        </div>
      </div>
    </div>

    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="/">
          <img src="/assets/images/logo.png" alt="Autobedrijf Smolders B.V." width="252" height="118">
        </a>

        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-nav"
          aria-label="Open navigatie"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="site-nav" id="site-nav">
          ${siteData.topNav
            .map((slug) => {
              const item = pageBySlug(slug);
              const activeClass = slug === activeSlug ? "is-active" : "";
              return `<a class="${activeClass}" href="${slugPath(slug)}">${escapeHtml(item.navLabel || item.title)}</a>`;
            })
            .join("")}
          <a class="button button--sm" href="mailto:${escapeHtml(siteData.company.email)}?subject=Afspraak%20bij%20Autobedrijf%20Smolders">
            Afspraak maken
          </a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooterGroup(group) {
  return `
    <div class="footer-column">
      <p class="footer-column__title">${escapeHtml(group.label)}</p>
      <div class="footer-column__links">
        ${group.slugs
          .map((slug) => {
            const item = pageBySlug(slug);
            return `<a href="${slugPath(slug)}">${escapeHtml(item.navLabel || item.title)}</a>`;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div class="footer-brand-block">
          <img
            src="/assets/images/logo-white.png"
            alt="Autobedrijf Smolders B.V."
            width="220"
            height="102"
          >
          <p>
            Onderhoud, APK, autobanden, airco, acties en occasions voor personenauto's en lichte
            bedrijfswagens in Tilburg.
          </p>
          <div class="footer-contact">
            <a href="tel:${escapeHtml(siteData.company.phoneHref)}">${escapeHtml(siteData.company.phoneDisplay)}</a>
            <a href="mailto:${escapeHtml(siteData.company.email)}">${escapeHtml(siteData.company.email)}</a>
          </div>
        </div>

        <div class="footer-grid">
          ${siteData.footerGroups.map(renderFooterGroup).join("")}
        </div>
      </div>

      <div class="container site-footer__bottom">
        <p>&copy; <span id="year"></span> Autobedrijf Smolders B.V.</p>
        <p>KvK ${escapeHtml(siteData.company.kvk)} | BTW ${escapeHtml(siteData.company.btw)}</p>
      </div>
    </footer>
  `;
}

function renderFactList(items) {
  return `
    <ul class="fact-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderCard(card) {
  return `
    <article class="content-card" data-reveal>
      <p class="content-card__eyebrow">Detail</p>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `;
}

function renderPageLinkCard(slug, withSummary = true) {
  const item = pageBySlug(slug);

  return `
    <a class="page-link-card" href="${slugPath(slug)}" data-reveal>
      <div>
        <p class="page-link-card__eyebrow">${escapeHtml(item.eyebrow)}</p>
        <h3>${escapeHtml(item.navLabel || item.title)}</h3>
      </div>
      ${withSummary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
      <span>Bekijk pagina</span>
    </a>
  `;
}

function renderFeatureCard(slug) {
  const item = pageBySlug(slug);
  
  // Add premium ribbon to featured services
  const isPremium = ['onderhoud', 'autobanden', 'apk'].includes(slug);

  return `
    <a class="service-card" href="${slugPath(slug)}" data-reveal>
      ${isPremium ? '<div class="premium-ribbon">Premium</div>' : ''}
      <div class="service-card__image-wrap">
        <img class="service-card__image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      </div>
      <div class="service-card__body">
        <p class="service-card__eyebrow">${escapeHtml(item.eyebrow)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <span>Meer informatie</span>
      </div>
    </a>
  `;
}

function renderDirectoryGroup(group) {
  return `
    <article class="directory-card" data-reveal>
      <p class="directory-card__eyebrow">${escapeHtml(group.label)}</p>
      <div class="directory-card__links">
        ${group.slugs
          .map((slug) => {
            const item = pageBySlug(slug);
            return `<a href="${slugPath(slug)}">${escapeHtml(item.navLabel || item.title)}</a>`;
          })
          .join("")}
      </div>
    </article>
  `;
}

function renderValueCard(value, index) {
  return `
    <article class="value-card" data-reveal style="--delay:${index * 0.05}s;">
      <p class="value-card__index">${String(index + 1).padStart(2, "0")}</p>
      <h3>${escapeHtml(value.title)}</h3>
      <p>${escapeHtml(value.text)}</p>
    </article>
  `;
}

function renderPromoCard(slug) {
  const item = pageBySlug(slug);

  return `
    <a class="promo-card" href="${slugPath(slug)}" data-reveal>
      <div>
        <p class="promo-card__eyebrow">${escapeHtml(item.eyebrow)}</p>
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <span>Lees meer</span>
    </a>
  `;
}

function renderContactSection() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">Contact</p>
          <h2>Langskomen, bellen of direct een afspraak plannen.</h2>
          <p>
            Goede communicatie speelt een grote rol in de service van Autobedrijf Smolders B.V.
            Neem contact op voor onderhoud, banden, APK, airco, occasions of gewoon om even te overleggen.
          </p>
        </div>

        <div class="contact-layout">
          <div class="contact-panel" data-reveal>
            <div class="contact-grid">
              <a class="contact-card" href="tel:${escapeHtml(siteData.company.phoneHref)}">
                <span>Telefoon</span>
                <strong>${escapeHtml(siteData.company.phoneDisplay)}</strong>
                <small>Bel direct met de werkplaats</small>
              </a>

              <a class="contact-card" href="mailto:${escapeHtml(siteData.company.email)}">
                <span>E-mail</span>
                <strong>${escapeHtml(siteData.company.email)}</strong>
                <small>Voor vragen en afspraken</small>
              </a>

              <a
                class="contact-card"
                href="https://www.google.com/maps/search/?api=1&amp;query=Spaubeekstraat+95-09+5035+JV+Tilburg"
                target="_blank"
                rel="noreferrer"
              >
                <span>Adres</span>
                <strong>${escapeHtml(siteData.company.addressStreet)}</strong>
                <small>${escapeHtml(siteData.company.addressPostal)}</small>
              </a>
            </div>

            <div class="business-meta">
              <div>
                <span>KvK</span>
                <strong>${escapeHtml(siteData.company.kvk)}</strong>
              </div>
              <div>
                <span>BTW</span>
                <strong>${escapeHtml(siteData.company.btw)}</strong>
              </div>
            </div>
          </div>

          <div class="hours-card" data-reveal>
            <p class="eyebrow eyebrow--light">Openingstijden</p>
            <h3>Werkplaats in Tilburg - Reeshof</h3>
            <table>
              <tbody>
                ${siteData.company.hours
                  .map(
                    (row) => `
                      <tr>
                        <th scope="row">${escapeHtml(row.day)}</th>
                        <td>${escapeHtml(row.hours)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
            <p>Kleine reparaties en APK-keuringen zijn in veel gevallen klaar terwijl u wacht.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHome() {
  const home = siteData.home;

  return `
    <main>
      <section class="hero home-hero">
        <div class="container hero__inner">
          <div class="hero__content" data-reveal>
            <p class="eyebrow">${escapeHtml(home.eyebrow)}</p>
            <h1>${escapeHtml(home.title)}</h1>
            <p class="hero__lead">${escapeHtml(home.lead)}</p>

            <div class="hero__actions">
              <a class="button" href="/contact/">Afspraak maken</a>
              <a class="button button--secondary" href="/onderhoud/">Bekijk diensten</a>
            </div>

            <div class="hero__stats">
              ${home.stats
                .map(
                  (item) => `
                    <article class="stat-card">
                      <span>${escapeHtml(item.label)}</span>
                      <strong>${escapeHtml(item.value)}</strong>
                      <small>${escapeHtml(item.note)}</small>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>

          <div class="showcase" data-reveal>
            <article class="showcase__primary">
              <div class="premium-badge">
                <span>✓</span>
                <span>Erkend Specialist</span>
              </div>
              <img src="/assets/images/hero-1.jpg" alt="Werkplaatsfoto van Autobedrijf Smolders">
              <div class="showcase__overlay">
                <p class="eyebrow eyebrow--light">Betrouwbare autoservice</p>
                <h2>Vakwerk dat helder uitgelegd wordt.</h2>
                <p>
                  Professioneel onderhoud, reparaties en advies voor uw auto in Tilburg.
                  Transparant, betrouwbaar en met persoonlijke aandacht.
                </p>
              </div>
            </article>

            <div class="showcase__stack">
              <img src="/assets/images/hero-2.jpg" alt="Monteur in werkplaats">
              <img src="/assets/images/hero-3.jpg" alt="Technische inspectie in de werkplaats">
            </div>
          </div>
        </div>
      </section>

      <!-- Premium Trust Banner -->
      <section class="section section--tight">
        <div class="container">
          <div class="trust-banner" data-reveal>
            <div class="trust-banner__content">
              <div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--ink);">Premium autoservice in Tilburg</h3>
                <p style="color: var(--muted); max-width: 600px;">Erkend vakmanschap met hoogwaardige service voor al uw auto-onderhoud</p>
              </div>
              <div class="trust-banner__badges">
                <div class="trust-badge">
                  <div class="trust-badge__icon">⚡</div>
                  <span class="trust-badge__label">Snelle Service</span>
                </div>
                <div class="trust-badge">
                  <div class="trust-badge__icon">✓</div>
                  <span class="trust-badge__label">Erkend</span>
                </div>
                <div class="trust-badge">
                  <div class="trust-badge__icon">★</div>
                  <span class="trust-badge__label">Top Kwaliteit</span>
                </div>
                <div class="trust-badge">
                  <div class="trust-badge__icon">🔧</div>
                  <span class="trust-badge__label">Vakkundig</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Counter Section -->
      <section class="section" style="padding: 2rem 0;">
        <div class="container">
          <div class="stats-counter" data-reveal>
            <div class="stats-counter__item">
              <span class="stats-counter__number" data-count="1000">0</span>
              <span class="stats-counter__label">Tevreden Klanten</span>
            </div>
            <div class="stats-counter__item">
              <span class="stats-counter__number" data-count="15">0</span>
              <span class="stats-counter__label">Jaar Ervaring</span>
            </div>
            <div class="stats-counter__item">
              <span class="stats-counter__number" data-count="5000">0</span>
              <span class="stats-counter__label">Services per Jaar</span>
            </div>
            <div class="stats-counter__item">
              <span class="stats-counter__number" data-count="100">0</span>
              <span class="stats-counter__label">% Betrouwbaar</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--tight">
        <div class="container">
          <div class="trust-strip" data-reveal>
            <p>Compleet dienstenpakket voor uw auto: van dagelijks onderhoud tot seizoensgebonden service en verkoop.</p>
            <div class="pill-row">
              <span>Onderhoud</span>
              <span>APK</span>
              <span>Bandenservice</span>
              <span>Airco</span>
              <span>Occasions</span>
              <span>Acties</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Hoofdservices</p>
            <h2>De belangrijkste diensten van Autobedrijf Smolders overzichtelijk bij elkaar.</h2>
            <p>
              Van onderhoud en APK tot banden, airco en occasions: hier vindt u snel de informatie
              die u nodig heeft voor uw auto.
            </p>
          </div>

          <div class="service-grid">
            ${home.featuredSlugs.map((slug) => renderFeatureCard(slug)).join("")}
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- Premium Features Grid -->
      <section class="section">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Premium Service</p>
            <h2>Waarom kiezen voor Autobedrijf Smolders?</h2>
            <p>Hoogwaardige service met persoonlijke aandacht en professioneel vakmanschap</p>
          </div>

          <div class="feature-grid">
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">🏆</div>
              <h3 class="feature-card__title">Erkend Vakmanschap</h3>
              <p class="feature-card__text">Gecertificeerde monteurs met jarenlange ervaring in autoservice</p>
            </div>
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">⚡</div>
              <h3 class="feature-card__title">Snelle Service</h3>
              <p class="feature-card__text">Veel reparaties klaar terwijl u wacht, zonder lange wachttijden</p>
            </div>
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">💎</div>
              <h3 class="feature-card__title">Premium Kwaliteit</h3>
              <p class="feature-card__text">Alleen hoogwaardige onderdelen en materialen voor uw auto</p>
            </div>
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">💰</div>
              <h3 class="feature-card__title">Eerlijke Prijzen</h3>
              <p class="feature-card__text">Transparante prijzen zonder verborgen kosten of verrassingen</p>
            </div>
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">📋</div>
              <h3 class="feature-card__title">Duidelijke Communicatie</h3>
              <p class="feature-card__text">U weet altijd precies wat er gebeurt met uw auto</p>
            </div>
            <div class="feature-card" data-reveal>
              <div class="feature-card__icon">🤝</div>
              <h3 class="feature-card__title">Persoonlijke Benadering</h3>
              <p class="feature-card__text">Geen nummertje maar persoonlijk contact met uw monteur</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--tinted">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Alle diensten</p>
            <h2>Al onze services overzichtelijk bij elkaar.</h2>
            <p>
              Van autobanden en onderhoud tot verkoop, acties en contact: alles wat u nodig heeft
              voor uw auto vindt u hier duidelijk georganiseerd.
            </p>
          </div>

          <div class="directory-grid">
            ${siteData.footerGroups.map((group) => renderDirectoryGroup(group)).join("")}
          </div>
        </div>
      </section>

      <!-- Premium Testimonials Section -->
      <section class="testimonials">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Klantbeoordelingen</p>
            <h2>Wat onze klanten zeggen</h2>
            <p>Ontdek waarom klanten kiezen voor de betrouwbare service van Autobedrijf Smolders</p>
          </div>

          <div class="testimonials__grid">
            <article class="testimonial-card" data-reveal>
              <div class="testimonial-card__quote">
                Uitstekende service! De monteurs nemen de tijd om alles duidelijk uit te leggen. 
                Mijn auto rijdt weer perfect en de prijzen zijn eerlijk.
              </div>
              <div class="testimonial-card__author">
                <div class="testimonial-card__avatar">JV</div>
                <div class="testimonial-card__info">
                  <div class="testimonial-card__name">Jan van der Berg</div>
                  <div class="testimonial-card__rating">★★★★★</div>
                </div>
              </div>
            </article>

            <article class="testimonial-card" data-reveal>
              <div class="testimonial-card__quote">
                Heel tevreden over de APK-keuring en het onderhoud. Snelle afhandeling en 
                persoonlijke benadering. Zeker een aanrader!
              </div>
              <div class="testimonial-card__author">
                <div class="testimonial-card__avatar">MD</div>
                <div class="testimonial-card__info">
                  <div class="testimonial-card__name">Maria Dekker</div>
                  <div class="testimonial-card__rating">★★★★★</div>
                </div>
              </div>
            </article>

            <article class="testimonial-card" data-reveal>
              <div class="testimonial-card__quote">
                Professionele werkplaats met vakkundige monteurs. De bandenservice is top 
                en de prijzen zijn scherp. Kom hier al jaren!
              </div>
              <div class="testimonial-card__author">
                <div class="testimonial-card__avatar">PJ</div>
                <div class="testimonial-card__info">
                  <div class="testimonial-card__name">Peter Janssen</div>
                  <div class="testimonial-card__rating">★★★★★</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Waarom Smolders</p>
            <h2>Waarom klanten voor Autobedrijf Smolders kiezen.</h2>
            <p>
              Voor onderhoud, reparatie, banden, airco en occasions staan persoonlijk contact,
              duidelijke afspraken en betrouwbare service centraal.
            </p>
          </div>

          <div class="value-grid">
            ${home.values.map((value, index) => renderValueCard(value, index)).join("")}
          </div>
        </div>
      </section>

      <section class="section section--tight">
        <div class="container">
          <div class="cta-banner" data-reveal>
            <div>
              <p class="eyebrow eyebrow--light">Acties & controles</p>
              <h2>Seizoenschecks en handige controlemomenten blijven gewoon onderdeel van het aanbod.</h2>
            </div>
            <div class="promo-grid">
              ${home.seasonalSlugs.map((slug) => renderPromoCard(slug)).join("")}
            </div>
          </div>
        </div>
      </section>

      ${renderContactSection()}
    </main>
  `;
}

function renderBreadcrumbs(currentPage) {
  if (!currentPage.parent) {
    return `<div class="breadcrumbs"><a href="/">Home</a><span>${escapeHtml(currentPage.title)}</span></div>`;
  }

  const parent = pageBySlug(currentPage.parent);

  return `
    <div class="breadcrumbs">
      <a href="/">Home</a>
      <a href="${slugPath(currentPage.parent)}">${escapeHtml(parent.title)}</a>
      <span>${escapeHtml(currentPage.title)}</span>
    </div>
  `;
}

function relatedSlugs(currentPage) {
  if (currentPage.childSlugs && currentPage.childSlugs.length) {
    return currentPage.childSlugs;
  }

  if (currentPage.parent) {
    return pageBySlug(currentPage.parent).childSlugs.filter((slug) => slug !== activeSlug).slice(0, 6);
  }

  return siteData.topNav.filter((slug) => slug !== activeSlug && slug !== "home").slice(0, 4);
}

function renderContentPage() {
  const related = relatedSlugs(page);

  return `
    <main>
      <section class="page-hero">
        <div class="container page-hero__inner">
          <div class="page-hero__content" data-reveal>
            ${renderBreadcrumbs(page)}
            <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
            <h1>${escapeHtml(page.title)}</h1>
            <p class="page-hero__lead">${escapeHtml(page.lead)}</p>
            ${renderFactList(page.facts)}
          </div>

          <div class="page-hero__media" data-reveal>
            <img src="${escapeHtml(page.image)}" alt="${escapeHtml(page.title)}">
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container content-layout">
          <div class="content-main">
            <article class="section-card section-card--lead" data-reveal>
              <p class="section-card__eyebrow">Over deze pagina</p>
              ${page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </article>

            <div class="content-card-grid">
              ${page.cards.map((card) => renderCard(card)).join("")}
            </div>

            ${
              page.childSlugs && page.childSlugs.length
                ? `
                  <section class="subpage-section" data-reveal>
                    <div class="subpage-section__heading">
                      <p class="eyebrow">Gerelateerde pagina's</p>
                      <h2>Bekijk de onderliggende diensten van ${escapeHtml(page.title)}.</h2>
                    </div>
                    <div class="page-link-grid">
                      ${page.childSlugs.map((slug) => renderPageLinkCard(slug)).join("")}
                    </div>
                  </section>
                `
                : ""
            }
          </div>

          <aside class="content-side">
            <article class="aside-card" data-reveal>
              <p class="aside-card__eyebrow">Snel regelen</p>
              <h3>Direct contact met Smolders</h3>
              <p>
                Bel of mail gerust als u wilt overleggen over ${escapeHtml(page.title.toLowerCase())},
                een afspraak wilt plannen of meer wilt weten over uw auto.
              </p>
              <a class="button" href="/contact/">Naar contact</a>
            </article>

            ${
              related.length
                ? `
                  <article class="aside-card aside-card--list" data-reveal>
                    <p class="aside-card__eyebrow">Meer bekijken</p>
                    <h3>Handige vervolgpagina's</h3>
                    <div class="aside-links">
                      ${related.map((slug) => renderPageLinkCard(slug, false)).join("")}
                    </div>
                  </article>
                `
                : ""
            }
          </aside>
        </div>
      </section>

      ${activeSlug === "contact" ? renderContactSection() : ""}
    </main>
  `;
}

function bindMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!menuToggle || !nav) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function bindReveals() {
  const targets = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  targets.forEach((target) => observer.observe(target));
}

function addScrollEffects() {
  // Add smooth parallax effect to hero images
  const showcaseImages = document.querySelectorAll('.showcase__primary, .showcase__stack img, .page-hero__media');
  
  if (showcaseImages.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    showcaseImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const speed = 0.15;
        const yPos = -(scrolled * speed);
        img.style.transform = `translateY(${yPos}px)`;
      }
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  updateParallax();
}

function enhanceSiteHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScroll = 0;
  let ticking = false;
  
  function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 8px 32px rgba(18, 36, 61, 0.12)';
    } else {
      header.style.boxShadow = '0 4px 24px rgba(18, 36, 61, 0.04)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

// Premium Features: Stats Counter Animation
function animateStatsCounter() {
  const counters = document.querySelectorAll('.stats-counter__number');
  
  if (counters.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// Premium Features: Staggered Card Animations
function addStaggeredAnimations() {
  const grids = document.querySelectorAll('.service-grid, .value-grid, .testimonials__grid, .feature-grid');
  
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('[data-reveal]');
    cards.forEach((card, index) => {
      card.style.setProperty('--delay', `${index * 0.08}s`);
    });
  });
}

// Premium Features: Enhanced Header Scrolling
function enhancePremiumHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let ticking = false;
  
  function updateHeaderStyle() {
    const scrollY = window.pageYOffset;
    
    if (scrollY > 100) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 12px 48px rgba(18, 36, 61, 0.14), 0 0 0 1px rgba(212, 175, 55, 0.1)';
      header.style.borderBottomColor = 'rgba(212, 175, 55, 0.25)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = '0 4px 24px rgba(18, 36, 61, 0.04)';
      header.style.borderBottomColor = 'rgba(212, 175, 55, 0.15)';
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeaderStyle);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  updateHeaderStyle();
}

// Premium Features: Parallax Enhancement
function addPremiumParallax() {
  const parallaxElements = document.querySelectorAll('.showcase__primary, .showcase__overlay, .premium-badge, .trust-banner');
  
  if (parallaxElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const speed = element.classList.contains('showcase__overlay') ? 0.05 : 0.12;
        const yPos = -(scrolled * speed);
        
        if (element.classList.contains('premium-badge')) {
          element.style.transform = `translateY(${yPos * 0.5}px) translateX(-50%)`;
        } else {
          element.style.transform = `translateY(${yPos}px)`;
        }
      }
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  updateParallax();
}

// Premium Features: Card Hover 3D Effect
function add3DCardEffect() {
  const cards = document.querySelectorAll('.service-card, .value-card, .testimonial-card, .feature-card');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Premium Features: Smooth Scroll Enhancement
function enhanceSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Cookie Consent Management
function initCookieConsent() {
  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  if (cookieConsent === null) {
    // Show cookie banner after a short delay
    setTimeout(() => {
      showCookieBanner();
    }, 1000);
  }
}

function showCookieBanner() {
  const banner = document.createElement('div');
  banner.className = 'cookie-consent';
  banner.innerHTML = `
    <div class="cookie-consent__container">
      <div class="cookie-consent__content">
        <div class="cookie-consent__title">
          <span class="cookie-consent__icon">🍪</span>
          <span>Cookies & Privacy</span>
        </div>
        <p class="cookie-consent__text">
          Wij gebruiken cookies om uw ervaring op onze website te verbeteren en om onze diensten te analyseren. 
          Door op "Accepteren" te klikken, stemt u in met ons gebruik van cookies. 
          Lees ons <a href="/cookie-policy-eu/" class="cookie-consent__link">cookiebeleid</a> en 
          <a href="/privacy-policy/" class="cookie-consent__link">privacybeleid</a> voor meer informatie.
        </p>
      </div>
      <div class="cookie-consent__actions">
        <button class="cookie-consent__button cookie-consent__button--decline" onclick="handleCookieDecline()">
          Weigeren
        </button>
        <button class="cookie-consent__button cookie-consent__button--accept" onclick="handleCookieAccept()">
          Accepteren
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Trigger animation
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

function handleCookieAccept() {
  localStorage.setItem('cookieConsent', 'accepted');
  localStorage.setItem('cookieConsentDate', new Date().toISOString());
  hideCookieBanner();
  
  // Here you can initialize analytics or other cookie-dependent features
  console.log('Cookies accepted');
}

function handleCookieDecline() {
  localStorage.setItem('cookieConsent', 'declined');
  localStorage.setItem('cookieConsentDate', new Date().toISOString());
  hideCookieBanner();
  
  console.log('Cookies declined');
}

function hideCookieBanner() {
  const banner = document.querySelector('.cookie-consent');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      banner.remove();
    }, 500);
  }
}

// Make functions globally available
window.handleCookieAccept = handleCookieAccept;
window.handleCookieDecline = handleCookieDecline;

updateMeta();
app.innerHTML = `${renderHeader()}${activeSlug === "home" ? renderHome() : renderContentPage()}${renderFooter()}`;
bindMenu();
bindReveals();
addScrollEffects();
enhanceSiteHeader();
setYear();

// Initialize Premium Features
addStaggeredAnimations();
animateStatsCounter();
enhancePremiumHeader();
addPremiumParallax();
add3DCardEffect();
enhanceSmoothScroll();

// Initialize Cookie Consent
initCookieConsent();

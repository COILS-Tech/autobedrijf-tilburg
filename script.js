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

  return `
    <a class="service-card" href="${slugPath(slug)}" data-reveal>
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
              <img src="/assets/images/hero-1.jpg" alt="Werkplaatsfoto van Autobedrijf Smolders">
              <div class="showcase__overlay">
                <p class="eyebrow eyebrow--light">Betrouwbare autoservice</p>
                <h2>Vakwerk dat helder uitgelegd wordt.</h2>
                <p>
                  De nieuwe site bundelt alle pagina's van de huidige website in een rustiger,
                  moderner en overzichtelijker geheel.
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

      <section class="section section--tight">
        <div class="container">
          <div class="trust-strip" data-reveal>
            <p>Het volledige dienstenpakket van de huidige Smolders website, opnieuw opgebouwd voor een sterkere eerste indruk.</p>
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
            <h2>De belangrijkste Smolders pagina's, opnieuw vormgegeven.</h2>
            <p>
              De site is nu opgebouwd rond duidelijke servicepagina's met een betere hiërarchie,
              consistente uitstraling en sneller te begrijpen informatie.
            </p>
          </div>

          <div class="service-grid">
            ${home.featuredSlugs.map((slug) => renderFeatureCard(slug)).join("")}
          </div>
        </div>
      </section>

      <section class="section section--tinted">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Alle pagina's</p>
            <h2>De volledige inhoud van de huidige website, logisch gegroepeerd.</h2>
            <p>
              Autobanden, onderhoud, verkoop, acties en contact hebben nu ieder een duidelijke plek,
              inclusief alle onderliggende servicepagina's uit de bestaande site.
            </p>
          </div>

          <div class="directory-grid">
            ${siteData.footerGroups.map((group) => renderDirectoryGroup(group)).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Waarom Smolders</p>
            <h2>Een moderne website mag nog steeds nuchter en vertrouwd voelen.</h2>
            <p>
              De inhoud blijft dicht bij wat Autobedrijf Smolders nu al uitstraalt: vakmanschap,
              bereikbaarheid, duidelijke uitleg en service waar klanten voor terugkomen.
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

function setYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

updateMeta();
app.innerHTML = `${renderHeader()}${activeSlug === "home" ? renderHome() : renderContentPage()}${renderFooter()}`;
bindMenu();
bindReveals();
setYear();

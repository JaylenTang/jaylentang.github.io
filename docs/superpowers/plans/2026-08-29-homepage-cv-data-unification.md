# Homepage And CV Data Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/cv/` visually consistent with the current homepage, render selected publications from `_publications`, and remove manually maintained footer dates.

**Architecture:** Publication documents become the authoritative content source. Separate Liquid includes render that shared data as visual homepage rows and compact CV entries, while shared V2 shell includes provide navigation, social links, footer, and common interactions to both routes.

**Tech Stack:** Jekyll 3.10, Liquid, SCSS, vanilla JavaScript, Node.js built-in test runner, GitHub Pages.

---

## File Map

- Create `_includes/selected-publication.html`: render one selected homepage publication from a publication document.
- Create `_includes/v2-header.html`: shared responsive header with route-specific links.
- Create `_includes/v2-social.html`: shared protected-email and academic-profile controls.
- Create `_includes/v2-footer.html`: shared copyright-only footer.
- Create `_includes/v2-common-script.html`: shared mobile-menu and protected-email interactions.
- Create `_layouts/cv-v2.html`: lightweight CV page shell matching the homepage.
- Create `test/homepage-cv-unification.test.mjs`: contracts for shared publication data, CV shell, and footer.
- Modify `_publications/2026-01-04-hypermode.md`: add normalized selected-publication metadata.
- Modify `_publications/2025-01-01-hypereast.md`: add normalized selected-publication metadata.
- Modify `_publications/2026-01-01-mas-llava.md`: add normalized selected-publication metadata.
- Modify `_includes/archive-single-cv.html`: render normalized authors and venue metadata with legacy fallbacks.
- Modify `_layouts/home-v2.html`: load the shared V2 interaction include.
- Modify `_pages/home-v2.md`: use shared shell includes and iterate over selected publications.
- Modify `_pages/cv.md`: use the new layout and semantic V2 section markup.
- Modify `assets/css/main.scss`: add scoped CV styles and shared shell adjustments.
- Modify `test/homepage-v2.test.mjs`: replace static publication-markup assertions with data-driven contracts.

### Task 1: Add Failing Data And Layout Contracts

**Files:**
- Create: `test/homepage-cv-unification.test.mjs`
- Modify: `test/homepage-v2.test.mjs`

- [ ] **Step 1: Write the shared-data contract tests**

Create `test/homepage-cv-unification.test.mjs` with tests that read the source files directly:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");
const selectedPublications = [
  "_publications/2026-01-04-hypermode.md",
  "_publications/2025-01-01-hypereast.md",
  "_publications/2026-01-01-mas-llava.md",
];

test("selected publications contain complete homepage metadata", () => {
  for (const path of selectedPublications) {
    const publication = read(path);
    assert.match(publication, /^selected: true$/m, path);
    assert.match(publication, /^publication_year: 20\d{2}$/m, path);
    assert.match(publication, /^venue_name: /m, path);
    assert.match(publication, /^venue_short: /m, path);
    assert.match(publication, /^authors:$/m, path);
    assert.match(publication, /^featured_image: /m, path);
    assert.match(publication, /^featured_thumbnail: /m, path);
    assert.match(publication, /^featured_image_alt: /m, path);
    assert.match(publication, /^summary: /m, path);
  }
});

test("homepage renders selected publications from the collection", () => {
  const page = read("_pages/home-v2.md");
  const include = read("_includes/selected-publication.html");

  assert.match(page, /site\.publications\s*\|\s*where:\s*"selected",\s*true/);
  assert.match(page, /include selected-publication\.html publication=publication/);
  assert.doesNotMatch(page, /<article class="v2-publication">/);
  assert.match(include, /include\.publication\.title/);
  assert.match(include, /include\.publication\.paperurl/);
  assert.match(include, /include\.publication\.authors/);
});

test("CV uses the shared V2 shell without the legacy author sidebar", () => {
  const page = read("_pages/cv.md");
  const layout = read("_layouts/cv-v2.html");

  assert.match(page, /^layout: cv-v2$/m);
  assert.doesNotMatch(page, /^author_profile: true$/m);
  assert.match(layout, /<body class="homepage-v2 cv-v2">/);
  assert.match(layout, /include v2-header\.html/);
  assert.match(layout, /include v2-social\.html/);
  assert.match(layout, /include v2-footer\.html/);
  assert.doesNotMatch(layout, /include masthead\.html|include sidebar\.html/);
});

test("shared footer omits manually maintained update dates", () => {
  const footer = read("_includes/v2-footer.html");
  const homepage = read("_pages/home-v2.md");

  assert.match(footer, /site\.time\s*\|\s*date:\s*"%Y"/);
  assert.doesNotMatch(footer, /Last updated|Site last updated/i);
  assert.doesNotMatch(homepage, /Last updated|August 23, 2026/i);
});
```

- [ ] **Step 2: Update the existing homepage publication test**

Replace the static three-article assertions in `test/homepage-v2.test.mjs` with checks for the collection loop, the selected-publication include, canonical URLs in the matching publication documents, and the absence of separately typed publication articles in `_pages/home-v2.md`.

```js
test("V2 includes real news, data-driven publications, and services", () => {
  const page = read("_pages/home-v2.md");
  const publicationInclude = read("_includes/selected-publication.html");
  const hypermode = read("_publications/2026-01-04-hypermode.md");
  const hypereast = read("_publications/2025-01-01-hypereast.md");
  const masLlava = read("_publications/2026-01-01-mas-llava.md");

  assert.match(page, /where: "selected", true/);
  assert.match(page, /include selected-publication\.html publication=publication/);
  assert.doesNotMatch(page, /<article class="v2-publication">/);
  assert.match(publicationInclude, />Paper<\/a>/);
  assert.match(hypermode, /10\.1109\/JSTARS\.2026\.3705708/);
  assert.match(hypereast, /ieeexplore\.ieee\.org\/document\/11129658/);
  assert.match(masLlava, /ieeexplore\.ieee\.org\/document\/11468028/);
  assert.match(hypermode, /github\.com\/JaylenTang\/HyperMODE/);
  assert.match(hypereast, /github\.com\/JaylenTang\/HyperEAST/);
  assert.match(page, /Conference on Neural Information Processing Systems \(NeurIPS\) 2026/);
  assert.match(page, /Conference on Artificial Intelligence \(AAAI\) 2027/);
});
```

- [ ] **Step 3: Run the tests and confirm the new contracts fail**

Run:

```bash
node --test test/homepage-v2.test.mjs test/homepage-cv-unification.test.mjs
```

Expected: failures for missing normalized fields, includes, and `cv-v2` layout.

- [ ] **Step 4: Commit the failing contracts**

```bash
git add test/homepage-v2.test.mjs test/homepage-cv-unification.test.mjs
git commit -m "Test homepage and CV data unification"
```

### Task 2: Normalize Selected Publication Data

**Files:**
- Modify: `_publications/2026-01-04-hypermode.md`
- Modify: `_publications/2025-01-01-hypereast.md`
- Modify: `_publications/2026-01-01-mas-llava.md`
- Create: `_includes/selected-publication.html`
- Modify: `_pages/home-v2.md`

- [ ] **Step 1: Add normalized fields to all three selected publication documents**

Add `selected: true`, `publication_year`, `venue_name`, `venue_short`, an ordered `authors` array containing `name`, `short_name`, and `self`, plus the approved visual metadata. Use these exact paper-specific values:

```yaml
# HyperMODE
selected: true
publication_year: 2026
venue_name: 'IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing'
venue_short: 'JSTARS'
volume: 19
authors:
  - name: 'Jialin Tang'
    short_name: 'J Tang'
    self: true
  - name: 'Yunduan Lou'
    short_name: 'Y Lou'
  - name: 'Yanhui Guo'
    short_name: 'Y Guo'
  - name: 'Yu Bai'
    short_name: 'Y Bai'
codeurl: 'https://github.com/JaylenTang/HyperMODE'
featured_image: '/images/research-hypermode.png'
featured_thumbnail: '/images/research-hypermode-thumb.webp'
featured_image_alt: 'HyperMODE hyperspectral modeling diagram'
summary: 'Continuous-depth spectral-spatial modeling that combines sequence modeling with neural ODE dynamics.'
```

```yaml
# HyperEAST
selected: true
publication_year: 2025
venue_name: 'IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing'
venue_short: 'JSTARS'
volume: 18
authors:
  - name: 'Jialin Tang'
    short_name: 'J Tang'
    self: true
  - name: 'Nan Ma'
    short_name: 'N Ma'
  - name: 'Chen Jia'
    short_name: 'C Jia'
  - name: 'Rui Tian'
    short_name: 'R Tian'
  - name: 'Yanhui Guo'
    short_name: 'Y Guo'
codeurl: 'https://github.com/JaylenTang/HyperEAST'
featured_image: '/images/research-hypereast.png'
featured_thumbnail: '/images/research-hypereast-thumb.webp'
featured_image_alt: 'HyperEAST hyperspectral image classification diagram'
summary: 'Self-supervised spectral-spatial representation learning for hyperspectral image classification.'
```

```yaml
# MAS-LLaVA
selected: true
publication_year: 2026
venue_name: 'IEEE International Conference on Artificial Intelligence, Computer, Data Sciences and Applications'
venue_short: 'ACDSA'
authors:
  - name: 'Jialin Tang'
    short_name: 'J Tang'
    self: true
  - name: 'Yu Bai'
    short_name: 'Y Bai'
featured_image: '/images/research-mas-llava.png'
featured_thumbnail: '/images/research-mas-llava-thumb.webp'
featured_image_alt: 'MAS-LLaVA motion-aware video sampling diagram'
summary: 'Motion-aware token and frame sampling for efficient training-free video large language model inference.'
```

- [ ] **Step 2: Create the homepage publication renderer**

Create `_includes/selected-publication.html` to render the badge, preview image, linked title, full author names with the self-author emphasized, venue/year/volume, and only real Paper/Code actions. All content must be read from `include.publication`.

```liquid
{% assign publication = include.publication %}
<article class="v2-publication">
  <div class="v2-publication__visual">
    <span class="v2-venue-tag">{{ publication.venue_short }}</span>
    <button class="v2-publication__figure" type="button" data-full="{{ publication.featured_image }}?v={{ site.asset_version }}" aria-label="Open {{ publication.title | escape }} figure">
      <img src="{{ publication.featured_thumbnail }}?v={{ site.asset_version }}" width="720" height="405" loading="lazy" decoding="async" alt="{{ publication.featured_image_alt }}">
    </button>
  </div>
  <div class="v2-publication__content">
    <h3><a href="{{ publication.paperurl }}">{{ publication.title }}</a></h3>
    <p class="v2-publication__authors">
      {% for author in publication.authors %}{% if author.self %}<strong>{{ author.name }}</strong>{% else %}{{ author.name }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}
    </p>
    <p class="v2-publication__venue"><em>{{ publication.venue_name }}</em>, {{ publication.publication_year }}{% if publication.volume %}, Volume {{ publication.volume }}{% endif %}</p>
    <div class="v2-publication__actions">
      <a href="{{ publication.paperurl }}">Paper</a>
      {% if publication.codeurl %}<a href="{{ publication.codeurl }}">Code</a>{% endif %}
    </div>
    <p class="v2-publication__summary">{{ publication.summary }}</p>
  </div>
</article>
```

- [ ] **Step 3: Replace static homepage publication cards with a collection loop**

Use this Liquid block inside the existing `selected publications` section:

```liquid
{% assign selected_publications = site.publications | where: "selected", true | sort: "sort_order" %}
{% for publication in selected_publications %}
  {% include selected-publication.html publication=publication %}
{% endfor %}
```

- [ ] **Step 4: Run the homepage-focused tests**

Run:

```bash
node --test test/homepage-v2.test.mjs
```

Expected: all homepage V2 tests pass.

- [ ] **Step 5: Commit the data-driven homepage**

```bash
git add _publications _includes/selected-publication.html _pages/home-v2.md test/homepage-v2.test.mjs
git commit -m "Render homepage publications from collection data"
```

### Task 3: Build The Shared V2 Shell And CV Layout

**Files:**
- Create: `_includes/v2-header.html`
- Create: `_includes/v2-social.html`
- Create: `_includes/v2-footer.html`
- Create: `_includes/v2-common-script.html`
- Create: `_layouts/cv-v2.html`
- Modify: `_layouts/home-v2.html`
- Modify: `_pages/home-v2.md`
- Modify: `_pages/cv.md`
- Modify: `_includes/archive-single-cv.html`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Extract the shared header, social links, footer, and common script**

The header must render `about`, `research`, and `cv` on the homepage, but `homepage` and an `aria-current="page"` CV link on `/cv/`. Keep the existing hamburger button, theme toggle, protected-email decoding, profile URLs, and current-year Liquid value. Move menu and protected-email behavior from `_pages/home-v2.md` into `_includes/v2-common-script.html`; leave the publication modal behavior on the homepage.

Create `_includes/v2-header.html`:

```liquid
<header class="v2-header">
  <div class="v2-header__inner">
    <button class="v2-menu-toggle" type="button" aria-expanded="false" aria-controls="v2-navigation" aria-label="Open navigation">
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>
    <nav id="v2-navigation" class="v2-navigation" aria-label="Primary navigation">
      {% if page.url == "/cv/" %}
        <a href="/">homepage</a>
        <a href="/cv/" aria-current="page">cv</a>
      {% else %}
        <a href="#about">about</a>
        <a href="#research">research</a>
        <a href="/cv/">cv</a>
      {% endif %}
      {% include theme-toggle.html %}
    </nav>
  </div>
</header>
```

Create `_includes/v2-social.html`:

```liquid
<nav class="v2-social" aria-label="Academic profiles">
  <button type="button" data-v2-email-icon aria-label="Reveal email address" title="Reveal email address"><i class="fas fa-envelope" aria-hidden="true"></i></button>
  <a href="https://scholar.google.com/citations?user=tOytfmwAAAAJ&amp;hl=en" aria-label="Google Scholar" title="Google Scholar"><i class="ai ai-google-scholar" aria-hidden="true"></i></a>
  <a href="https://github.com/jaylentang" aria-label="GitHub" title="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a>
  <a href="https://www.linkedin.com/in/jtang0516/" aria-label="LinkedIn" title="LinkedIn"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
</nav>
```

Create `_includes/v2-footer.html`:

```liquid
<footer class="v2-footer">
  <p>&copy; {{ site.time | date: "%Y" }} Jialin (Jaylen) Tang.</p>
</footer>
```

Create `_includes/v2-common-script.html` by moving the existing menu and email blocks unchanged into one guarded IIFE:

```html
<script>
  (function () {
    var menuButton = document.querySelector(".v2-menu-toggle");
    var navigation = document.getElementById("v2-navigation");

    function setMenuOpen(isOpen) {
      if (!menuButton || !navigation) return;
      navigation.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    }

    if (menuButton && navigation) {
      menuButton.addEventListener("click", function () {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
      });
      navigation.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (link && link.getAttribute("href").charAt(0) === "#") setMenuOpen(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setMenuOpen(false);
      });
    }

    var emailTarget = document.getElementById("v2-email");
    var emailButton = document.querySelector("[data-v2-email]");
    var emailIcon = document.querySelector("[data-v2-email-icon]");
    var revealedEmail = null;

    function revealEmail() {
      if (revealedEmail) return revealedEmail;
      var encoded = [125, 46, 109, 55, 79, 99, 112, 76, 46, 69, 126, 105, 105, 63, 83];
      var key = [23, 71, 12, 91, 38];
      revealedEmail = encoded.map(function (value, index) {
        return String.fromCharCode(value ^ key[index % key.length]);
      }).join("");

      if (emailTarget) {
        var link = document.createElement("a");
        link.href = "mailto:" + revealedEmail;
        link.textContent = revealedEmail;
        emailTarget.textContent = "";
        emailTarget.appendChild(link);
      }
      if (emailButton) emailButton.remove();
      if (emailIcon) {
        var iconLink = document.createElement("a");
        iconLink.href = "mailto:" + revealedEmail;
        iconLink.setAttribute("aria-label", "Email Jialin Tang");
        iconLink.setAttribute("title", "Email Jialin Tang");
        iconLink.innerHTML = emailIcon.innerHTML;
        emailIcon.replaceWith(iconLink);
        emailIcon = iconLink;
      }
      return revealedEmail;
    }

    if (emailButton) emailButton.addEventListener("click", revealEmail);
    if (emailIcon) emailIcon.addEventListener("click", function (event) {
      if (!revealedEmail) {
        event.preventDefault();
        revealEmail();
      }
    });
  }());
</script>
```

- [ ] **Step 2: Create the lightweight CV layout**

Create `_layouts/cv-v2.html` with the same theme initialization used by `_layouts/home-v2.html`, a `<body class="homepage-v2 cv-v2">`, the shared header/social/footer includes, and `scripts.html skip_main=true`. Render a single `Curriculum Vitae` H1 before `{{ content }}`.

```liquid
---
layout: compress
---

{% include base_path %}
<!doctype html>
<html lang="{{ site.locale | slice: 0,2 }}" class="no-js">
  <head>
    {% include head.html %}
    <script>
      (function () {
        try {
          if (!localStorage.getItem("jaylen-theme")) {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.style.colorScheme = "dark";
          }
        } catch (error) {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.style.colorScheme = "dark";
        }
      }());
    </script>
    {% include head/custom.html %}
  </head>
  <body class="homepage-v2 cv-v2">
    {% include browser-upgrade.html %}
    {% include v2-header.html %}
    <main class="v2-main cv-v2-main">
      <header class="cv-v2-intro">
        <h1>Curriculum Vitae</h1>
        <p>Jialin (Jaylen) Tang</p>
      </header>
      {{ content }}
      {% include v2-social.html %}
    </main>
    {% include v2-footer.html %}
    {% include v2-common-script.html %}
    {% include scripts.html skip_main=true %}
  </body>
</html>
```

Replace the inline homepage header, social row, and footer with their shared includes. Add `{% include v2-common-script.html %}` in `_layouts/home-v2.html` immediately before `scripts.html`, and remove the now-shared menu/email blocks from the homepage's inline modal script.

- [ ] **Step 3: Convert the CV page to semantic V2 sections**

Change its front matter to `layout: cv-v2`, remove `author_profile` and `hide_title`, preserve `/cv/` and `/resume`, and render Education, Publications, and Services as `.v2-section.cv-v2-section` elements. Keep the existing journal/conference/manuscript grouping loops and reviewer wording unchanged.

Use this structure in `_pages/cv.md`:

```liquid
---
layout: cv-v2
title: "CV"
permalink: /cv/
redirect_from:
  - /resume
---

<section class="v2-section cv-v2-section" aria-labelledby="cv-education-title">
  <h2 id="cv-education-title">Education</h2>
  <ul class="cv-v2-education">
    <li>Ph.D. in Computational Science, University of California, Irvine, 2030 (Expected)</li>
    <li>M.S. in Computer Science, California State University, Fullerton, 2026</li>
    <li>B.M. in Information Management and Information Systems, Shandong University of Finance and Economics, 2022</li>
  </ul>
</section>

<section class="v2-section cv-v2-section" aria-labelledby="cv-publications-title">
  <h2 id="cv-publications-title">Publications</h2>
  {% assign ordered_publications = site.publications | sort: "sort_order" %}
  {% assign journal_publications = ordered_publications | where: "category", "journals" %}
  {% assign conference_publications = ordered_publications | where: "category", "conferences" %}
  {% assign manuscript_publications = ordered_publications | where: "category", "manuscripts" %}
  {% if journal_publications.size > 0 %}
    <h3>Journal Articles</h3>
    <ul class="cv-publications">{% for post in journal_publications %}{% include archive-single-cv.html %}{% endfor %}</ul>
  {% endif %}
  {% if conference_publications.size > 0 %}
    <h3>Conference Papers</h3>
    <ul class="cv-publications">{% for post in conference_publications %}{% include archive-single-cv.html %}{% endfor %}</ul>
  {% endif %}
  {% if manuscript_publications.size > 0 %}
    <h3>Preprints / Manuscripts</h3>
    <ul class="cv-publications">{% for post in manuscript_publications %}{% include archive-single-cv.html %}{% endfor %}</ul>
  {% endif %}
</section>

<section class="v2-section cv-v2-section" aria-labelledby="cv-services-title">
  <h2 id="cv-services-title">Services</h2>
  <h3>Invited Reviewer</h3>
  <ul>
    <li>Reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
    <li>Reviewer for the <a href="https://aaai.org/conference/aaai/aaai-27/">Conference on Artificial Intelligence (AAAI) 2027</a>.</li>
  </ul>
</section>
```

- [ ] **Step 4: Render normalized CV authors and venues**

Update `_includes/archive-single-cv.html` so normalized publications loop over `post.authors`, display `short_name`, and emphasize the entry with `self: true`. Use `venue_name`, `publication_year`, and optional `volume`; retain current `scholar_authors` and `scholar_venue` fallbacks for the two older conference papers.

```liquid
{% include base_path %}
{% if post.id %}
  {% assign title = post.title | markdownify | remove: "<p>" | remove: "</p>" %}
{% else %}
  {% assign title = post.title %}
{% endif %}
{% if post.publication_year %}
  {% assign publication_year = post.publication_year %}
{% else %}
  {% assign publication_year = post.date | date: "%Y" %}
{% endif %}
{% assign citation_authors = post.citation | split: ". (" | first %}

<li class="cv-publication" itemscope itemtype="http://schema.org/CreativeWork">
  <h3 class="cv-publication-title" itemprop="headline">
    {% if post.paperurl %}<a href="{{ post.paperurl }}">{{ title }}</a>{% elsif post.link %}<a href="{{ post.link }}">{{ title }}</a>{% else %}<a href="{{ base_path }}{{ post.url }}" rel="permalink">{{ title }}</a>{% endif %}
  </h3>
  <p class="cv-publication-meta cv-publication-authors">
    {% if post.authors %}{% for author in post.authors %}{% if author.self %}<strong>{{ author.short_name | default: author.name }}</strong>{% else %}{{ author.short_name | default: author.name }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}{% else %}{{ post.scholar_authors | default: citation_authors }}{% endif %}
  </p>
  <p class="cv-publication-meta cv-publication-venue">
    {% if post.venue_name %}{{ post.venue_name }}, {{ publication_year }}{% if post.volume %}, Volume {{ post.volume }}{% endif %}{% elsif post.scholar_venue %}{{ post.scholar_venue }}{% elsif post.category == "manuscripts" %}Available at {{ post.venue }}, {{ publication_year }}{% else %}{{ publication_year }} {{ post.venue }}{% endif %}
  </p>
</li>
```

- [ ] **Step 5: Add scoped CV styles**

Append styles under `.homepage-v2.cv-v2` for a compact page introduction, section spacing, education list, publication list, responsive wrapping, and shared footer. Reuse existing V2 color variables and widths; do not introduce a new palette, card treatment, fixed sidebar, or viewport-scaled font sizes.

```scss
.homepage-v2.cv-v2 .cv-v2-main {
  padding-top: 4.5rem;
}

.homepage-v2.cv-v2 .cv-v2-intro {
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--v2-border);
}

.homepage-v2.cv-v2 .cv-v2-intro h1 {
  margin: 0;
  color: var(--v2-text);
  font-size: 2.4rem;
  font-weight: 600;
  line-height: 1.15;
}

.homepage-v2.cv-v2 .cv-v2-intro p {
  margin: 0.5rem 0 0;
  color: var(--v2-muted);
}

.homepage-v2.cv-v2 .cv-v2-section {
  margin-top: 4rem;
}

.homepage-v2.cv-v2 .cv-v2-section > h2 {
  margin-bottom: 1.5rem;
}

.homepage-v2.cv-v2 .cv-v2-section > h3 {
  margin: 2rem 0 0.85rem;
  color: var(--v2-text);
  font-size: 1.2rem;
  font-weight: 600;
}

.homepage-v2.cv-v2 .cv-v2-education {
  display: grid;
  gap: 0.65rem;
  padding-left: 1.2rem;
  margin: 0;
}

.homepage-v2.cv-v2 .cv-publications {
  max-width: none;
  margin: 0;
}

.homepage-v2.cv-v2 .cv-publication {
  margin-bottom: 1.25rem;
}

.homepage-v2.cv-v2 .cv-publication-title {
  font-size: 1rem;
  line-height: 1.35;
}

.homepage-v2.cv-v2 .cv-publication-title a,
.homepage-v2.cv-v2 .cv-publication-title a:visited {
  color: var(--v2-link);
}

.homepage-v2.cv-v2 .cv-publication-meta {
  color: var(--v2-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.homepage-v2.cv-v2 .cv-publication-authors {
  color: var(--v2-text);
}

@media (max-width: 760px) {
  .homepage-v2.cv-v2 .cv-v2-main {
    padding-top: 3.25rem;
  }

  .homepage-v2.cv-v2 .cv-v2-intro h1 {
    font-size: 2rem;
  }

  .homepage-v2.cv-v2 .cv-v2-section {
    margin-top: 3rem;
  }
}
```

- [ ] **Step 6: Run all source-contract tests**

Run:

```bash
node --test test/*.test.mjs
```

Expected: every test passes.

- [ ] **Step 7: Commit the unified CV shell**

```bash
git add _includes _layouts/home-v2.html _layouts/cv-v2.html _pages/home-v2.md _pages/cv.md assets/css/main.scss test
git commit -m "Unify homepage and CV presentation"
```

### Task 4: Production Build And Visual Verification

**Files:**
- Verify: `_site/index.html`
- Verify: `_site/cv/index.html`

- [ ] **Step 1: Build with the GitHub Pages dependency set**

Run:

```bash
bundle exec jekyll build
```

Expected: exit code 0 and generated pages at `_site/index.html` and `_site/cv/index.html`.

- [ ] **Step 2: Verify generated publication content and footer**

Run focused searches against the generated pages to confirm all five CV publications, exactly three homepage selected-publication rows, canonical paper links, and no `Last updated` label.

- [ ] **Step 3: Start the local Jekyll server**

Run:

```bash
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Expected: the server remains available at `http://127.0.0.1:4000/`.

- [ ] **Step 4: Inspect desktop and mobile views**

Use browser automation at `1440 x 900` and `390 x 844` for `/` and `/cv/` in both themes. Confirm no horizontal overflow, broken images, clipped text, or browser errors. Exercise the mobile menu, theme toggle, email reveal, homepage image modal, Escape behavior, and focus restoration.

- [ ] **Step 5: Run the final regression suite**

Run:

```bash
node --test test/*.test.mjs
bundle exec jekyll build
git status --short
```

Expected: tests and build pass; only the unrelated existing `docs/superpowers/.DS_Store` remains untracked.

### Task 5: Publish And Confirm GitHub Pages

**Files:**
- No additional source files expected.

- [ ] **Step 1: Push the verified commits**

```bash
git push origin main
```

Expected: `main` advances on `origin` using the repository's configured SSH identity.

- [ ] **Step 2: Confirm deployment and inspect the live routes**

Wait for GitHub Pages to publish, then inspect `https://jaylentang.github.io/` and `https://jaylentang.github.io/cv/` at desktop and mobile widths. Confirm the shared styling, selected-publication data, compact CV list, and copyright-only footer are live.

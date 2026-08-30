# Al-Folio-Inspired Academic Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Jekyll homepage, publications page, and web CV with an al-folio-inspired information architecture while retaining Jialin Tang's purple identity, current content, tested interactions, and GitHub Pages deployment.

**Architecture:** `_publications` remains the authoritative web-publication source and `_data/news.yml` becomes the authoritative news source. Shared V2 layouts and includes render a compact shell, news rows, publication rows, BibTeX disclosures, a full publications route, and a structured CV; a reproducible ReportLab script creates a telephone-free public PDF.

**Tech Stack:** Jekyll 3.10, Liquid, SCSS, vanilla JavaScript, Node.js built-in test runner, Python 3 with ReportLab and pypdf, Sharp, GitHub Pages.

---

## File Map

- Create `_data/news.yml`: ordered homepage news records.
- Create `_includes/v2-news-list.html`: semantic two-column news renderer.
- Create `_includes/v2-publication-row.html`: reusable compact publication row with optional image, Code, and Bib actions.
- Create `_includes/v2-publication-modal.html`: shared accessible figure preview dialog.
- Create `_includes/cv-v2-toc.html`: one reusable CV section-navigation list for desktop and mobile.
- Create `_layouts/v2-page.html`: shared inner-page shell for `/publications/`.
- Create `scripts/build-public-cv.py`: reproducibly generate the public telephone-free CV PDF.
- Create `test/al-folio-inspired-site.test.mjs`: data, rendering, privacy, and route contracts.
- Create `files/Jialin_Tang_CV.pdf`: generated visitor-safe downloadable CV.
- Modify `_includes/v2-header.html`: route-aware brand and `about / publications / cv` navigation.
- Modify `_includes/v2-common-script.html`: Bib copy and CV mobile-table-of-contents interactions alongside the existing menu/email behavior.
- Modify `_includes/selected-publication.html`: delegate to the shared publication-row include.
- Modify `_layouts/cv-v2.html`: CV heading/PDF action, desktop TOC, mobile TOC, and shared page shell.
- Modify `_pages/home-v2.md`: data-driven news and shared publication/modal rendering.
- Modify `_pages/publications.html`: V2 all-publications page containing only web-visible journal and conference work.
- Modify `_pages/cv.md`: General Information, Education, Research Interests, web-visible Publications, and Service.
- Modify all five `_publications/*.md` documents: normalize web visibility, authors, venue metadata, pages, imagery, summaries, and BibTeX.
- Modify `scripts/generate-homepage-assets.cjs`: generate ASO and EV publication thumbnails.
- Modify `assets/css/main.scss`: al-folio-inspired shared shell, compact rows, CV TOC, light/dark, and responsive behavior.
- Modify existing `test/homepage-v2.test.mjs`, `test/homepage-optimization.test.mjs`, and `test/homepage-cv-unification.test.mjs` only where old structure assertions need to point at the new shared components.

### Task 1: Add Failing Redesign Contracts

**Files:**
- Create: `test/al-folio-inspired-site.test.mjs`
- Modify: `test/homepage-cv-unification.test.mjs`

- [ ] **Step 1: Write source and data contracts**

Create `test/al-folio-inspired-site.test.mjs` with helpers matching the existing test style and these contracts:

```js
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const publicTitles = ["HyperMODE:", "HyperEAST:", "MAS-LLaVA:",
  "Regression-Based Modeling of Antisense Oligonucleotide Efficacy",
  "Optimizing Energy Management Strategy for EV Wireless Charging"];
const privateTitles = ["PRISM-MAP:", "Multimodal Mammography", "Dynamic Network Biomarkers"];

test("homepage news is sourced from structured data", () => {
  const homepage = read("_pages/home-v2.md");
  assert.ok(existsSync(new URL("_data/news.yml", root)));
  assert.match(homepage, /include v2-news-list\.html news=site\.data\.news/);
  assert.doesNotMatch(homepage, /<li class="v2-news-item">/);
});

test("every web publication declares visibility and approved page metadata", () => {
  const expectedPages = new Map([
    ["2026-01-04-hypermode.md", "21474-21491"],
    ["2025-01-01-hypereast.md", "22241-22255"],
    ["2026-01-03-aso-efficacy.md", "458-461"],
    ["2026-01-02-ev-wireless-charging.md", "454-457"],
  ]);
  for (const [file, pages] of expectedPages) {
    const source = read(`_publications/${file}`);
    assert.match(source, /^web_visible: true$/m);
    assert.match(source, new RegExp(`^pages: ["']?${pages}["']?$`, "m"));
  }
  assert.match(read("_publications/2026-01-01-mas-llava.md"), /^web_visible: true$/m);
});

test("shared publication rows support optional Code and Bib actions", () => {
  const include = read("_includes/v2-publication-row.html");
  assert.match(include, /publication\.paperurl/);
  assert.match(include, /if publication\.codeurl/);
  assert.match(include, /if publication\.bibtex/);
  assert.match(include, /data-v2-bib-copy/);
  assert.match(include, /if publication\.featured_thumbnail/);
});

test("the V2 header exposes the approved route set", () => {
  const header = read("_includes/v2-header.html");
  assert.match(header, /href="\/"/);
  assert.match(header, /href="\/publications\/"/);
  assert.match(header, /href="\/cv\/"/);
  assert.doesNotMatch(header, />research<\/a>/);
});
```

- [ ] **Step 2: Add rendered route and privacy contracts**

Append one production-build test that builds into a temporary directory and verifies:

```js
test("rendered V2 routes share the shell and exclude unpublished work", () => {
  const destination = mkdtempSync(join(tmpdir(), "al-folio-inspired-site-"));
  try {
    execFileSync("bundle", ["exec", "jekyll", "build", "--quiet", "--destination", destination], {
      cwd: rootPath, encoding: "utf8", stdio: "pipe",
    });
    const home = readFileSync(join(destination, "index.html"), "utf8");
    const publications = readFileSync(join(destination, "publications", "index.html"), "utf8");
    const cv = readFileSync(join(destination, "cv", "index.html"), "utf8");

    assert.equal((home.match(/class="v2-publication"/g) || []).length, 3);
    assert.equal((publications.match(/class="v2-publication"/g) || []).length, 5);
    for (const title of publicTitles) assert.match(`${publications}\n${cv}`, new RegExp(title));
    for (const title of privateTitles) assert.doesNotMatch(`${home}\n${publications}\n${cv}`, new RegExp(title));
    for (const page of [home, publications, cv]) {
      assert.match(page, /class="v2-header"/);
      assert.match(page, /class="v2-footer"/);
      assert.match(page, /class="theme-toggle"/);
    }
    assert.match(cv, /href="\/files\/Jialin_Tang_CV\.pdf"/);
  } finally {
    rmSync(destination, { recursive: true, force: true });
  }
});
```

- [ ] **Step 3: Update old structural expectations**

Change existing tests that require `_includes/selected-publication.html` to contain literal article markup so they instead require delegation. Read `_includes/v2-publication-row.html` into `publicationRow` and move the existing field, escaping, author, action, image, and optional-volume assertions from `selectedPublication` to `publicationRow`:

```js
assert.match(selectedPublication, /include v2-publication-row\.html publication=publication/);
```

Keep all existing exact title, author, canonical URL, email focus, modal Escape, heading hierarchy, SEO, theme, and asset assertions.

- [ ] **Step 4: Run the contracts and confirm RED**

Run:

```bash
node --test test/al-folio-inspired-site.test.mjs test/homepage-cv-unification.test.mjs
```

Expected: failures for missing news data/include, normalized fields, shared publication row, inner-page layout, and public PDF.

- [ ] **Step 5: Commit the failing contracts**

```bash
git add test/al-folio-inspired-site.test.mjs test/homepage-cv-unification.test.mjs
git commit -m "Test al-folio inspired site structure"
```

### Task 2: Normalize News And Publication Data

**Files:**
- Create: `_data/news.yml`
- Create: `_includes/v2-news-list.html`
- Modify: `_pages/home-v2.md`
- Modify: `_publications/2025-01-01-hypereast.md`
- Modify: `_publications/2026-01-01-mas-llava.md`
- Modify: `_publications/2026-01-02-ev-wireless-charging.md`
- Modify: `_publications/2026-01-03-aso-efficacy.md`
- Modify: `_publications/2026-01-04-hypermode.md`
- Modify: `scripts/generate-homepage-assets.cjs`
- Create: `images/research-aso-regression-thumb.webp`
- Create: `images/research-ev-charging-thumb.webp`

- [ ] **Step 1: Move the nine approved news items into YAML**

Use one record per existing item, preserving its exact date, display date, wording, and links:

```yaml
- date: 2026-06-17
  display_date: Jun 17, 2026
  content: >-
    [HyperMODE](https://doi.org/10.1109/JSTARS.2026.3705708) was accepted for publication in
    [_IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing_](https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/) (JSTARS).
```

Continue with the current May 16, May 15, April 8, March 27, January 5, November 17, November 14, and August 14 entries in the same order.

- [ ] **Step 2: Render semantic news rows**

Create `_includes/v2-news-list.html`:

```liquid
{% assign news = include.news %}
<div class="v2-news-list" role="list">
  {% for item in news %}
    <article class="v2-news-item" role="listitem">
      <time datetime="{{ item.date | date: '%Y-%m-%d' }}">{{ item.display_date | escape }}</time>
      <div class="v2-news-item__content">{{ item.content | markdownify }}</div>
    </article>
  {% endfor %}
</div>
```

Replace the literal homepage news `<ol>` with:

```liquid
{% include v2-news-list.html news=site.data.news %}
```

- [ ] **Step 3: Normalize all five web publications**

Add `web_visible: true`, normalized `publication_year`, `venue_name`, `venue_short`, ordered `authors`, `summary`, and `bibtex` to every document. Add these exact page fields:

```yaml
# HyperMODE
pages: "21474-21491"
# HyperEAST
pages: "22241-22255"
# ASO
pages: "458-461"
location: "Las Vegas, NV, USA"
# EV
pages: "454-457"
location: "Las Vegas, NV, USA"
```

Use valid BibTeX literal blocks. Example:

```yaml
bibtex: |-
  @article{tang2026hypermode,
    title={HyperMODE: A Continuous-Depth Spectral-Spatial Modeling Framework with Mamba and Neural Ordinary Differential Equations for Hyperspectral Image Classification},
    author={Tang, Jialin and Lou, Yunduan and Guo, Yanhui and Bai, Yu},
    journal={IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing},
    volume={19},
    pages={21474--21491},
    year={2026},
    doi={10.1109/JSTARS.2026.3705708}
  }
```

Give ASO and EV their existing full images plus new thumbnail paths. Do not create publication documents for PRISM-MAP or either manuscript.

- [ ] **Step 4: Generate the two new thumbnails**

Change:

```js
const researchImages = ["hypermode", "hypereast", "mas-llava", "aso-regression", "ev-charging"];
```

Run:

```bash
node scripts/generate-homepage-assets.cjs
```

Expected: five WebP thumbnails exist, including the new ASO and EV files.

- [ ] **Step 5: Run the data-focused tests**

```bash
node --test test/al-folio-inspired-site.test.mjs test/homepage-v2.test.mjs
```

Expected: news and publication-data tests pass; component and route tests remain RED.

- [ ] **Step 6: Commit the normalized content**

```bash
git add _data/news.yml _includes/v2-news-list.html _pages/home-v2.md _publications scripts/generate-homepage-assets.cjs images/*-thumb.webp
git commit -m "Normalize academic site content data"
```

### Task 3: Build The Shared Compact Publication Component

**Files:**
- Create: `_includes/v2-publication-row.html`
- Create: `_includes/v2-publication-modal.html`
- Modify: `_includes/selected-publication.html`
- Modify: `_includes/v2-common-script.html`
- Modify: `_pages/home-v2.md`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Render one reusable publication row**

Create `_includes/v2-publication-row.html` using `include.publication` and `include.heading_level`. The resulting structure must be:

```liquid
{% assign publication = include.publication %}
{% assign heading_level = include.heading_level | default: "h3" %}
<article class="v2-publication">
  {% if publication.featured_thumbnail %}
    <div class="v2-publication__visual">
      <span class="v2-venue-tag">{{ publication.venue_short | escape }}</span>
      <button class="v2-publication__figure" type="button" data-full="{{ publication.featured_image | append: '?v=' | append: site.asset_version | escape }}" aria-label="Open {{ publication.title | split: ':' | first | escape }} figure">
        <img src="{{ publication.featured_thumbnail | append: '?v=' | append: site.asset_version | escape }}" alt="{{ publication.featured_image_alt | escape }}" width="720" height="405" loading="lazy" decoding="async">
      </button>
    </div>
  {% endif %}
  <div class="v2-publication__content">
    <{{ heading_level }} class="v2-publication__title"><a href="{{ publication.paperurl | escape }}">{{ publication.title | escape }}</a></{{ heading_level }}>
    <p class="v2-publication__authors">{% for author in publication.authors %}{% if author.self %}<strong>{{ author.name | escape }}</strong>{% else %}{{ author.name | escape }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
    <p class="v2-publication__venue"><em>{{ publication.venue_name | escape }}</em>, {{ publication.publication_year | escape }}{% if publication.volume %}, vol. {{ publication.volume | escape }}{% endif %}{% if publication.pages %}, pp. {{ publication.pages | replace: '-', '&ndash;' }}{% endif %}</p>
    <div class="v2-publication__actions">
      <a href="{{ publication.paperurl | escape }}">Paper</a>
      {% if publication.codeurl %}<a href="{{ publication.codeurl | escape }}">Code</a>{% endif %}
      {% if publication.bibtex %}<details class="v2-bib"><summary>Bib</summary><div class="v2-bib__panel"><pre><code>{{ publication.bibtex | escape }}</code></pre><button type="button" data-v2-bib-copy>Copy</button><span class="v2-bib__status" aria-live="polite"></span></div></details>{% endif %}
    </div>
    {% if publication.summary %}<p class="v2-publication__summary">{{ publication.summary | escape }}</p>{% endif %}
  </div>
</article>
```

Use a Liquid `capture` for the image URL if the chained `append` form does not pass escaping tests; every output and URL must remain escaped.

- [ ] **Step 2: Delegate the selected-publication include**

Replace its article markup with:

```liquid
{% assign publication = include.publication %}
{% include v2-publication-row.html publication=publication heading_level="h3" %}
```

- [ ] **Step 3: Extract the shared modal markup and controller**

Move the existing dialog into `_includes/v2-publication-modal.html` and include it once after homepage main content. Move the existing modal controller from `_pages/home-v2.md` into `_includes/v2-common-script.html`, guarded by `if (modal)`, so both the homepage and publications page receive the same behavior. Keep `role="dialog"`, `aria-modal="true"`, close button labeling, image alt propagation, focus trapping, Escape handling, and focus restoration.

- [ ] **Step 4: Add Bib copy behavior without breaking existing interactions**

Append to `_includes/v2-common-script.html` inside its IIFE:

```js
document.querySelectorAll("[data-v2-bib-copy]").forEach(function (button) {
  button.addEventListener("click", function () {
    var panel = button.closest(".v2-bib__panel");
    var code = panel && panel.querySelector("code");
    var status = panel && panel.querySelector(".v2-bib__status");
    if (!code || !navigator.clipboard) {
      if (status) status.textContent = "Select and copy the citation above.";
      return;
    }
    navigator.clipboard.writeText(code.textContent).then(function () {
      if (status) status.textContent = "Copied.";
    }, function () {
      if (status) status.textContent = "Select and copy the citation above.";
    });
  });
});
```

- [ ] **Step 5: Add compact row and Bib styles**

Keep the existing `170px / 1fr` desktop grid but reduce vertical gaps to match the reference density. Style `<summary>` like existing Paper/Code actions, position the Bib panel below the actions, constrain `<pre>` overflow, and use neutral surfaces with purple focus/active states. Add no new card background around the entire row.

- [ ] **Step 6: Run component and interaction tests**

```bash
node --test test/al-folio-inspired-site.test.mjs test/homepage-cv-unification.test.mjs test/homepage-v2.test.mjs
```

Expected: publication-component, homepage rendering, modal, and email tests pass.

- [ ] **Step 7: Commit the shared publication component**

```bash
git add _includes/v2-publication-row.html _includes/v2-publication-modal.html _includes/selected-publication.html _includes/v2-common-script.html _pages/home-v2.md assets/css/main.scss test
git commit -m "Build compact shared publication rows"
```

### Task 4: Build The Shared Inner Shell And Publications Page

**Files:**
- Create: `_layouts/v2-page.html`
- Modify: `_includes/v2-header.html`
- Modify: `_pages/publications.html`
- Modify: `assets/css/main.scss`
- Test: `test/al-folio-inspired-site.test.mjs`

- [ ] **Step 1: Create the inner-page layout**

Create `_layouts/v2-page.html` with the same theme initialization and head/script loading as `cv-v2.html`. Its body must include the shared header, a `<main class="v2-main v2-page-main">{{ content }}</main>`, shared footer, shared publication modal, common script, and `scripts.html skip_main=true`.

- [ ] **Step 2: Make the header route-aware**

Render a homepage-only empty brand spacer and an inner-page brand link:

```liquid
{% assign is_home = page.url == "/" %}
<header class="v2-header">
  <div class="v2-header__inner">
    {% unless is_home %}<a class="v2-brand" href="/">Jialin (Jaylen) Tang</a>{% endunless %}
    <button class="v2-menu-toggle" type="button" aria-expanded="false" aria-controls="v2-navigation" aria-label="Open navigation"><i class="fas fa-bars" aria-hidden="true"></i></button>
    <nav id="v2-navigation" class="v2-navigation" aria-label="Primary navigation">
      <a href="/{% if is_home %}#about{% endif %}"{% if is_home %} aria-current="page"{% endif %}>about</a>
      <a href="/publications/"{% if page.url == "/publications/" %} aria-current="page"{% endif %}>publications</a>
      <a href="/cv/"{% if page.url == "/cv/" %} aria-current="page"{% endif %}>cv</a>
      {% include theme-toggle.html %}
    </nav>
  </div>
</header>
```

Ensure the mobile menu button stays at the right when the inner-page brand is present.

- [ ] **Step 3: Rebuild `/publications/`**

Use `layout: v2-page` and render only `web_visible: true` records:

```liquid
<header class="v2-page-intro"><h1>Publications</h1><p>Published and accepted research.</p></header>
{% assign visible_publications = site.publications | where: "web_visible", true | sort: "sort_order" %}
{% assign journals = visible_publications | where: "category", "journals" %}
{% assign conferences = visible_publications | where: "category", "conferences" %}
<section class="v2-section v2-publication-group" aria-labelledby="journal-articles"><h2 id="journal-articles">Journal Articles</h2>{% for publication in journals %}{% include v2-publication-row.html publication=publication heading_level="h3" %}{% endfor %}</section>
<section class="v2-section v2-publication-group" aria-labelledby="conference-papers"><h2 id="conference-papers">Conference Papers</h2>{% for publication in conferences %}{% include v2-publication-row.html publication=publication heading_level="h3" %}{% endfor %}</section>
```

- [ ] **Step 4: Run route tests**

```bash
node --test test/al-folio-inspired-site.test.mjs test/homepage-v2.test.mjs
```

Expected: shared-header and five-publication route tests pass.

- [ ] **Step 5: Commit the inner shell**

```bash
git add _layouts/v2-page.html _includes/v2-header.html _pages/publications.html assets/css/main.scss test
git commit -m "Add al-folio inspired publications page"
```

### Task 5: Rebuild The Web CV And Generate The Public PDF

**Files:**
- Modify: `_layouts/cv-v2.html`
- Modify: `_pages/cv.md`
- Modify: `_includes/archive-single-cv.html`
- Create: `_includes/cv-v2-toc.html`
- Create: `scripts/build-public-cv.py`
- Create: `files/Jialin_Tang_CV.pdf`
- Modify: `assets/css/main.scss`
- Test: `test/al-folio-inspired-site.test.mjs`

- [ ] **Step 1: Add a semantic CV heading and TOC**

In `_layouts/cv-v2.html`, keep one H1 and add the PDF action, desktop aside, and mobile details navigation:

```html
<header class="cv-v2-intro">
  <div><h1>Curriculum Vitae</h1><p class="cv-v2-subtitle">Jialin (Jaylen) Tang</p></div>
  <a class="cv-pdf-link" href="/files/Jialin_Tang_CV.pdf" aria-label="Download Jialin Tang curriculum vitae as PDF"><i class="fas fa-file-pdf" aria-hidden="true"></i><span>PDF</span></a>
</header>
<details class="cv-toc-mobile"><summary>On this page</summary>{% include cv-v2-toc.html %}</details>
<div class="cv-v2-grid"><aside class="cv-v2-toc">{% include cv-v2-toc.html %}</aside><div class="cv-v2-content">{{ content }}</div></div>
```

Create `_includes/cv-v2-toc.html` to avoid duplicating links to `#general-information`, `#education`, `#research-interests`, `#publications`, and `#service`.

- [ ] **Step 2: Structure CV content**

Replace the current page body with five H2 sections. General Information must not contain a phone number. Education keeps all three current degrees. Research Interests reuses the homepage sentence. Publications filters `web_visible: true`, groups journals/conferences, and invokes `archive-single-cv.html`. Service retains the two approved reviewer entries.

Update CV venue rendering to append:

```liquid
{% if post.volume %}, vol. {{ post.volume | escape }}{% endif %}{% if post.pages %}, pp. {{ post.pages | replace: '-', '&ndash;' }}{% endif %}
```

- [ ] **Step 3: Create a reproducible public-PDF generator**

Create `scripts/build-public-cv.py` using ReportLab `BaseDocTemplate`, `Paragraph`, `Table`, `KeepTogether`, and `PageTemplate`. Store the approved CV text as structured Python lists, deliberately omit every telephone field, and include active `mailto:jialit7@uci.edu` and `https://jaylentang.github.io/` links. Use letter size, 34-point margins, Times body typography, compact section rules, and numbered publication paragraphs.

The script must end with a privacy assertion:

```python
from pathlib import Path
from pypdf import PdfReader

OUTPUT = Path(__file__).resolve().parents[1] / "files" / "Jialin_Tang_CV.pdf"

# build_document(OUTPUT) is defined above and contains no telephone field.
build_document(OUTPUT)
text = "\n".join((page.extract_text() or "") for page in PdfReader(OUTPUT).pages)
for forbidden in ("+1 (949)", "949-979", "979-3861"):
    if forbidden in text:
        raise RuntimeError(f"public CV contains forbidden telephone text: {forbidden}")
print(f"Created {OUTPUT} with {len(PdfReader(OUTPUT).pages)} page(s); telephone check passed.")
```

Keep the supplied PDF's complete journal, manuscript, conference, education, research-interest, and service content in this generated download, except for its phone number.

- [ ] **Step 4: Generate and inspect the PDF**

Run:

```bash
python3 scripts/build-public-cv.py
pdfinfo files/Jialin_Tang_CV.pdf
pdftotext -layout files/Jialin_Tang_CV.pdf -
```

Expected: the PDF opens, contains no telephone number, preserves email/homepage links, and fits without clipped text. If `pdftotext` is unavailable, use pypdf text extraction in the bundled Python runtime.

- [ ] **Step 5: Run CV and PDF tests**

```bash
node --test test/al-folio-inspired-site.test.mjs test/homepage-cv-unification.test.mjs
python3 scripts/build-public-cv.py
```

Expected: CV route, heading hierarchy, publication filtering, page metadata, protected email, and telephone-removal checks pass.

- [ ] **Step 6: Commit CV and PDF work**

```bash
git add _layouts/cv-v2.html _pages/cv.md _includes/archive-single-cv.html _includes/cv-v2-toc.html scripts/build-public-cv.py files/Jialin_Tang_CV.pdf assets/css/main.scss test
git commit -m "Rebuild web CV and public PDF"
```

### Task 6: Finish The Responsive Al-Folio-Inspired Visual System

**Files:**
- Modify: `assets/css/main.scss`
- Modify: `test/homepage-v2.test.mjs`
- Modify: `test/homepage-optimization.test.mjs`

- [ ] **Step 1: Tune shared neutral and purple tokens**

Keep the existing neutral `#1c1c1d` dark background and light neutral background. Use purple only for `--v2-link`, `--v2-link-hover`, `--v2-accent`, focus outlines, current navigation, and venue strips. Do not add purple-tinted page backgrounds or gradients.

- [ ] **Step 2: Match the reference density without sacrificing readability**

Set the inner width to `min(1170px, calc(100% - 3rem))`, body text to 16px/1.5, desktop name to approximately 2.5rem, section headings to 2rem, publication titles to 1rem, publication images to 170px, and row gaps near 1.5rem. Use borders and spacing rather than outer publication cards.

- [ ] **Step 3: Style inner pages and CV TOC**

Use a desktop CV grid near `220px minmax(0, 1fr)`. Make `.cv-v2-toc` sticky below the fixed header. Use restrained section borders and year/metadata labels. Style `.cv-toc-mobile` as `display: none` on desktop and visible below 760px; hide the desktop aside at that breakpoint.

- [ ] **Step 4: Finish mobile behavior**

At `max-width: 760px`:

```scss
.homepage-v2 .v2-header__inner,
.homepage-v2 .v2-main { width: min(100% - 2rem, 1170px); }
.homepage-v2 .v2-publication { grid-template-columns: 112px minmax(0, 1fr); gap: 0.85rem; }
.homepage-v2 .v2-publication__summary { grid-column: 1 / -1; }
.homepage-v2.cv-v2 .cv-v2-grid { display: block; }
.homepage-v2.cv-v2 .cv-v2-toc { display: none; }
.homepage-v2.cv-v2 .cv-toc-mobile { display: block; }
```

At `max-width: 520px`, stack each publication image above its content only if the 112px row cannot preserve title readability. Verify rather than assume this breakpoint.

- [ ] **Step 5: Run all source and rendering tests**

```bash
node --test test/*.test.mjs
```

Expected: all tests pass with no skipped or cancelled tests.

- [ ] **Step 6: Commit the visual system**

```bash
git add assets/css/main.scss test
git commit -m "Polish responsive academic site styling"
```

### Task 7: Production Build And Browser Verification

**Files:**
- Verify all changed files.
- Modify only files required by defects found during verification.

- [ ] **Step 1: Run clean automated verification**

```bash
node --test test/*.test.mjs
bundle exec jekyll build --destination /tmp/jaylen-al-folio-build
git diff --check
```

Expected: all tests pass, Jekyll exits 0, and `git diff --check` produces no output.

- [ ] **Step 2: Start the local production preview**

```bash
python3 -m http.server 4001 --bind 127.0.0.1 --directory /tmp/jaylen-al-folio-build
```

Open `/`, `/publications/`, and `/cv/`.

- [ ] **Step 3: Verify desktop light and dark modes at 1440x900**

Check header/brand alignment, portrait framing, news columns, three selected homepage rows, five full-publication rows, CV sticky TOC, PDF link, page metadata, footer, and absence of clipping or overlap.

- [ ] **Step 4: Verify mobile light and dark modes at 390x844**

Check menu opening/closing, brand fit, portrait ordering, news stacking, publication row wrapping, mobile CV TOC, PDF action, and zero horizontal overflow. Confirm the reference site's mobile TOC/title overlap is not reproduced.

- [ ] **Step 5: Exercise interactions and accessibility**

Test keyboard navigation, theme toggle, email reveal focus, Bib open/copy, image modal focus trap/Escape/focus restoration, CV anchors, reduced-motion behavior, and ordinary Paper/Code/PDF links. Inspect browser console errors and image requests.

- [ ] **Step 6: Re-run tests after any browser-found fixes**

```bash
node --test test/*.test.mjs
bundle exec jekyll build --destination /tmp/jaylen-al-folio-build-final
```

Expected: both commands exit 0 after the final code state.

- [ ] **Step 7: Commit verification fixes**

```bash
git add assets/css/main.scss _includes/v2-common-script.html _includes/v2-publication-row.html _includes/v2-publication-modal.html _includes/cv-v2-toc.html _layouts/cv-v2.html _layouts/v2-page.html _pages/home-v2.md _pages/publications.html _pages/cv.md test/al-folio-inspired-site.test.mjs
git commit -m "Finish al-folio inspired site verification"
```

Skip this commit when verification required no code changes.

### Task 8: Review, Integrate, And Publish

**Files:**
- Review the complete feature-branch diff.

- [ ] **Step 1: Review the branch against the approved design**

Confirm every design requirement has a corresponding implementation and test. Verify no unrelated generated `_site`, Sass cache, lockfile platform, or `.DS_Store` changes are included.

- [ ] **Step 2: Run final branch verification**

```bash
node --test test/*.test.mjs
bundle exec jekyll build --destination /tmp/jaylen-al-folio-release
git diff --check main...HEAD
```

Expected: tests and build pass; diff check is empty.

- [ ] **Step 3: Merge to `main` and verify again**

Use a fast-forward merge when possible, then repeat the complete test suite and production build on `main` before deleting the feature worktree/branch.

- [ ] **Step 4: Push and confirm GitHub Pages**

Push `main`, wait for `pages-build-deployment` to succeed for the new head SHA, then verify live `/`, `/publications/`, `/cv/`, and `/files/Jialin_Tang_CV.pdf` responses.

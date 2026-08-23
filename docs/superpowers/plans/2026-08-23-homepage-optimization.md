# Homepage Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve homepage discoverability, mobile theme access, image delivery, and page weight without changing the approved visual composition or biography.

**Architecture:** Keep Jekyll as the rendering layer and add static contract tests around the Liquid templates and generated assets. Reuse the original research PNGs for zoom views, serve generated WebP thumbnails in cards, and generate one deterministic social card from the existing portrait and calligraphy assets.

**Tech Stack:** Jekyll/Liquid, SCSS, vanilla JavaScript, Node.js built-in test runner, Sharp for generated raster assets, in-app browser for responsive verification.

---

### Task 1: Add Failing Optimization Contracts

**Files:**
- Create: `test/homepage-optimization.test.mjs`

- [ ] **Step 1: Create the contract test file**

The test must read the current source files, assert the approved Liquid/JavaScript/SCSS contracts, inspect generated asset sizes, and parse the JPEG social-card dimensions. Split assertions into tests named `SEO metadata is complete`, `mobile theme controls remain available`, `research cards use lightweight thumbnails`, and `homepage skips unused resources`.

Use Node's built-in `node:test`, `node:assert/strict`, and `node:fs`; do not introduce a test framework dependency. The expected asset paths are:

```js
const thumbnails = [
  "images/research-hypermode-thumb.webp",
  "images/research-hypereast-thumb.webp",
  "images/research-mas-llava-thumb.webp",
];
const socialCard = "images/social-card.jpg";
```

The test must require:

```js
assert.match(seo, /page\.title != site\.title/);
assert.match(seo, /<meta name="description"/);
assert.match(seo, /<meta property="og:description"/);
assert.match(seo, /<meta name="twitter:card"/);
assert.match(config, /og_image\s*:\s*"social-card\.jpg"/);
assert.match(navigation, /\$\('#site-nav > button'\)/);
assert.doesNotMatch(navigation, /\$\('#site-nav button'\)/);
assert.match(homeLayout, /include scripts\.html skip_main=true/);
assert.match(scripts, /unless include\.skip_main/);
assert.match(customHead, /if page\.mathjax/);
```

For each research thumbnail, require that it exists and is smaller than `200_000` bytes. Require the combined thumbnail size to be less than 35% of the combined original PNG size. Parse `images/social-card.jpg` and require exactly `1200 x 630` pixels.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
/Users/jaylenttt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test test/homepage-optimization.test.mjs
```

Expected: FAIL because the social card, WebP thumbnails, conditional includes, and corrected navigation selector do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add test/homepage-optimization.test.mjs
git commit -m "Add homepage optimization contracts"
```

### Task 2: Complete SEO Metadata And Generate The Social Card

**Files:**
- Modify: `_includes/seo.html`
- Modify: `_config.yml`
- Modify: `package.json`
- Create: `scripts/generate-homepage-assets.cjs`
- Create: `images/social-card.jpg`

- [ ] **Step 1: Add deterministic asset generation**

Add `sharp` version `^0.35.3` to `devDependencies` and this package script:

```json
"assets:homepage": "node scripts/generate-homepage-assets.cjs"
```

The CommonJS generator must:

```js
const sharp = require("sharp");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const images = path.join(root, "images");

async function generateSocialCard() {
  const portrait = await sharp(path.join(images, "profile-photo-2026.jpg"))
    .resize(390, 390, { fit: "cover", position: "north" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
  const calligraphy = await sharp(path.join(images, "name-calligraphy-transparent.png"))
    .resize({ width: 300 })
    .png()
    .toBuffer();
  const base = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f7f8fa"/>
    <rect width="12" height="630" fill="#0066cc"/>
    <rect x="732" y="112" width="406" height="406" fill="#ffffff" stroke="#d8dde5" stroke-width="2"/>
    <text x="72" y="145" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#111315">Jialin (Jaylen) Tang</text>
    <text x="72" y="350" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#20252b">Ph.D. Student in Computational Science</text>
    <text x="72" y="398" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4650">University of California, Irvine</text>
    <text x="72" y="530" font-family="Arial, Helvetica, sans-serif" font-size="25" fill="#0066cc">jaylentang.github.io</text>
  </svg>`);
  await sharp(base)
    .composite([
      { input: calligraphy, left: 80, top: 190 },
      { input: portrait, left: 740, top: 120 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(path.join(images, "social-card.jpg"));
}

generateSocialCard().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

The same script will generate thumbnails in Task 4. Run the script with the bundled Sharp module exposed through `NODE_PATH`.

- [ ] **Step 2: Make SEO output complete**

In `_includes/seo.html`, use the site title alone when `page.title == site.title`; emit separate standard, Open Graph, and Twitter descriptions whenever `seo_description` exists. Emit Twitter card metadata without requiring a Twitter username, and use `site.og_image` as the fallback image for both Open Graph and Twitter.

In `_config.yml`, set:

```yaml
og_image                 : "social-card.jpg"
social:
  type                   : Person
  name                   : "Jialin (Jaylen) Tang"
  links:
    - "https://scholar.google.com/citations?user=tOytfmwAAAAJ&hl=en"
    - "https://www.linkedin.com/in/jtang0516/"
    - "https://github.com/jaylentang"
```

- [ ] **Step 3: Generate the social card and inspect it**

Run:

```bash
NODE_PATH=/Users/jaylenttt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules /Users/jaylenttt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/generate-homepage-assets.cjs
```

Expected: `images/social-card.jpg` is `1200 x 630`, text remains inside the left content area, and the portrait is not distorted.

- [ ] **Step 4: Run the SEO test subset**

Run the full contract test. Expected: SEO assertions pass; remaining theme, thumbnail, and resource assertions still fail.

- [ ] **Step 5: Commit SEO and social-card work**

```bash
git add _includes/seo.html _config.yml package.json scripts/generate-homepage-assets.cjs images/social-card.jpg
git commit -m "Improve homepage SEO sharing metadata"
```

### Task 3: Fix Mobile Theme Controls

**Files:**
- Modify: `assets/js/plugins/jquery.greedy-navigation.js`
- Modify: `assets/js/main.min.js`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Correct the root selector**

Change the source selector from:

```js
var $btn = $('#site-nav button');
```

to:

```js
var $btn = $('#site-nav > button');
```

Rebuild `assets/js/main.min.js` using the existing `npm run build:js` inputs in a temporary dependency directory so generated dependency folders are not left in the repository.

- [ ] **Step 2: Improve narrow-screen touch sizing**

Inside the existing `@media (max-width: 520px)` block, add:

```scss
.theme-toggle {
  width: 44px;
  min-width: 44px;
  height: 44px;
}

.theme-toggle--floating {
  top: 0.65rem;
  right: 0.75rem;
}

.roger-intro h1 {
  min-height: 44px;
  padding-right: 3.25rem;
}
```

- [ ] **Step 3: Run contracts and browser reproduction**

Expected: selector and CSS assertions pass. At `390 x 844`, the CV nav theme button is visible and clickable, and the homepage name does not intersect the floating button.

- [ ] **Step 4: Commit the theme fix**

```bash
git add assets/js/plugins/jquery.greedy-navigation.js assets/js/main.min.js assets/css/main.scss
git commit -m "Fix mobile theme controls"
```

### Task 4: Add Lightweight Research Thumbnails And Conditional Resources

**Files:**
- Modify: `scripts/generate-homepage-assets.cjs`
- Create: `images/research-hypermode-thumb.webp`
- Create: `images/research-hypereast-thumb.webp`
- Create: `images/research-mas-llava-thumb.webp`
- Modify: `_pages/about.md`
- Modify: `_includes/head/custom.html`
- Modify: `_includes/scripts.html`
- Modify: `_layouts/home.html`

- [ ] **Step 1: Extend the asset generator**

For each `research-*.png`, generate a corresponding `research-*-thumb.webp` with:

```js
await sharp(source)
  .resize(720, 405, { fit: "contain", background: "#ffffff" })
  .webp({ quality: 84, effort: 6, smartSubsample: true })
  .toFile(destination);
```

Call thumbnail generation and `generateSocialCard()` from one async `main()` and fail the process on errors.

- [ ] **Step 2: Use thumbnails in research cards**

Wrap each research image in `<picture>`, put the WebP path in a `source`, and keep the original PNG as the fallback and `data-full` zoom target. Each `img` must include:

```html
width="720" height="405" loading="lazy" decoding="async"
```

- [ ] **Step 3: Make shared resources conditional**

Wrap the MathJax polyfill and MathJax script in `_includes/head/custom.html` with `{% if page.mathjax %}`. Wrap `main.min.js` in `_includes/scripts.html` with `{% unless include.skip_main %}`, and call the include from `_layouts/home.html` as:

```liquid
{% include scripts.html skip_main=true %}
```

- [ ] **Step 4: Run all static contracts**

Run the Node test. Expected: all tests PASS and the combined WebP thumbnails are less than 35% of the original PNG total.

- [ ] **Step 5: Commit image and resource optimization**

```bash
git add scripts/generate-homepage-assets.cjs images/*-thumb.webp _pages/about.md _includes/head/custom.html _includes/scripts.html _layouts/home.html
git commit -m "Optimize homepage images and resources"
```

### Task 5: Verify And Publish

**Files:**
- Verify all modified files and generated assets.

- [ ] **Step 1: Run local checks**

Run the Node contract test, `git diff --check`, and a Jekyll build if the local bundle exposes the Jekyll executable. If Jekyll remains unavailable, record that limitation and rely on GitHub Pages deployment plus live browser verification.

- [ ] **Step 2: Inspect generated imagery**

Open `images/social-card.jpg` and all three WebP thumbnails. Confirm exact text, clean edges, correct portrait crop, readable research diagrams, and no image distortion.

- [ ] **Step 3: Run responsive browser checks**

Check homepage and CV at `1440 x 900` and `390 x 844` in light and dark themes. Verify no horizontal overflow, visible theme controls, no name/button collision, working theme persistence, working email reveal, working research zoom/close behavior, and no console warnings or errors.

- [ ] **Step 4: Push and verify deployment**

Push `main`, wait for GitHub Pages to publish, and verify the live title, description, Open Graph image, Twitter card, structured data links, image URLs, CV mobile toggle, and browser logs.

- [ ] **Step 5: Report the outcome**

Provide the live URL, the social-card preview, the measured thumbnail reduction, the verification results, and any build limitation.

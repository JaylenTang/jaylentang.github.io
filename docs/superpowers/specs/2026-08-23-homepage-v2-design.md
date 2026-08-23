# Homepage V2 High-Fidelity Reference Design

## Objective

Create a second homepage at `/v2/` that closely follows the visual structure and interaction patterns of `https://siwensun.github.io/` while using only Jialin Tang's existing content, imagery, links, and independently written code. The current homepage at `/` and the existing CV at `/cv/` remain behaviorally and visually unchanged.

The V2 page is a comparison preview rather than an immediate replacement. It must be usable as a complete homepage, but it will not be linked from the current homepage and will carry a `noindex, nofollow` robots directive until the user chooses whether to promote it.

## Visual Direction

- Use a dark-first editorial presentation modeled closely on the reference site's proportions: a near-black page background, off-white text, restrained cyan-blue links, light font weights, generous page margins, and compact information density.
- Use a wide centered content column with an approximately `1170px` maximum width on desktop.
- Avoid floating cards and decorative gradients. Sections are unframed and separated through spacing, typography, and subtle rules.
- Preserve Jialin Tang's identity through the current portrait, transparent Chinese calligraphy, publication imagery, and academic content.
- Use the existing site font stack and icon assets where practical. Typography should approximate the reference's clean Roboto-like character without introducing a network-hosted font dependency.
- Dark mode is the default only when the visitor has no saved theme preference. An existing saved light or dark choice remains authoritative.
- Light mode uses an off-white background, near-black type, and the same cyan-blue accent hierarchy.

## Page Structure

### Navigation

- Add a compact sticky header with links for `about`, `research`, and `cv`, plus the existing theme control.
- `about` and `research` are anchors within `/v2/`; `cv` links to the unchanged `/cv/` page.
- Desktop navigation aligns to the upper right and uses the same understated lowercase treatment as the reference.
- At narrow widths, replace the visible link row with a real hamburger button. The button exposes the same links, updates `aria-expanded`, closes after an anchor is chosen, and can be dismissed with Escape.
- Do not add the reference site's command palette or search icons because no equivalent search feature exists in this site.

### Profile Introduction

- Display `Jialin (Jaylen) Tang` as the sole H1, with `Jialin` visually emphasized in a heavier weight.
- Place the transparent Chinese calligraphy near the name as a compact identity mark rather than as a separate oversized hero image.
- Use `Ph.D. Student at UC Irvine` as the short line directly below the name.
- On desktop, place the biography in the left content area and the current portrait as a large circular image on the right, closely matching the reference's balance.
- Preserve the current biography wording, advisor links, research interests, location, affiliation, protected-email reveal, and academic profile links.
- On mobile, use the order: name, calligraphy, subtitle, circular portrait, biography, profile metadata, email, and social links.

### News

- Render the existing 2025 and 2026 news items in a compact two-column list styled like the reference site's table.
- The first column contains the date in `Mon DD, YYYY` form; the second contains the existing news text and links.
- Dates use a stable desktop column width. On mobile, each row stacks the date above the content without causing horizontal overflow.
- Keep every current news item and external URL; only presentation and date formatting change.

### Selected Publications

- Rename the visible section to `selected publications`, matching the reference's lowercase editorial headings.
- Render the three currently selected works: HyperMODE, HyperEAST, and MAS-LLaVA.
- Each publication is an unframed row with a fixed-format visual column and a flexible metadata column.
- The visual column contains a slim venue label above the existing `720 x 405` WebP thumbnail. Labels are `JSTARS`, `JSTARS`, and `ACDSA` respectively.
- The metadata column contains a linked paper title, authors with `Jialin Tang` emphasized, venue and year, available resource buttons, and the existing one-sentence summary.
- Resource controls use compact rectangular buttons. Display only real destinations: `Paper`, `Code`, and `DOI` where applicable. Do not render disabled or placeholder controls, and do not show separate controls that resolve to the same URL.
- The title and `Paper` control open the canonical paper destination. `Code` appears only for repositories that currently exist. `DOI` appears only when a DOI URL is available.
- Keep the existing image-preview interaction: selecting a thumbnail opens the original PNG in an accessible modal.

### Services And Footer

- Present `services` beneath publications using the existing NeurIPS 2026 and AAAI 2027 reviewer entries.
- Place icon-only email, Google Scholar, GitHub, and LinkedIn links in a compact social row with accessible labels and tooltips.
- Add a normal-flow footer containing the name, current year, and a short `Last updated` date.
- The footer must never be fixed over page content.

## Architecture

- Add a dedicated `_layouts/home-v2.html` layout based on the lightweight current home layout. It includes the shared head, shared theme behavior, analytics hook, and no legacy `main.min.js` bundle.
- Add `_pages/home-v2.md` with the `/v2/` permalink and all V2-specific semantic markup.
- Scope all new styling under a V2 body or page class in `assets/css/main.scss` so the current homepage and CV cannot inherit the redesign.
- Use a small V2-only script for the mobile menu, email reveal, and image preview. Reuse the shared theme script rather than creating a second theme implementation.
- Reuse the current portrait, calligraphy, research WebP thumbnails, original research PNGs, and Font Awesome/Academicons assets. No copied assets, JavaScript, CSS, or text from the reference site are permitted.
- Keep V2 content local to the preview page for this iteration. Do not refactor the current homepage into shared data, because that would expand risk without improving the comparison preview. If V2 is later promoted, content deduplication becomes a separate follow-up.

## Responsive Behavior

- Desktop target: `1280 x 720` and wider, with the profile text and circular portrait side by side and publication rows using two columns.
- Tablet target: collapse the profile and publication grids before either becomes cramped.
- Mobile target: `390 x 844`, with no horizontal scrolling, a `44 x 44` hamburger and theme target, the portrait placed before the biography, and publication imagery using the full available width.
- Long publication titles wrap naturally and never overlap buttons or images.
- Header height and media dimensions remain stable while controls, fonts, and images load.

## Accessibility And Interaction

- Preserve one H1 followed by logical H2/H3 section hierarchy.
- Give the mobile menu button, theme control, image-preview controls, and icon-only social links explicit accessible names.
- Trap keyboard focus inside the open image modal, close it with Escape or backdrop selection, and restore focus to the thumbnail that opened it.
- Use visible focus indicators in both themes.
- Mark the calligraphy image as decorative because the adjacent H1 already communicates the name.
- Respect `prefers-reduced-motion`; no essential interaction depends on animation.

## SEO Isolation

- Emit `<meta name="robots" content="noindex, nofollow">` on `/v2/` only.
- Retain the site's existing title, description, Open Graph image, and `Person` structured data.
- Do not add `/v2/` to the current navigation or sitemap manually. Jekyll may generate the URL in its sitemap, but the robots directive remains authoritative for the preview.

## Verification

- Add focused contract tests for the `/v2/` permalink, robots directive, scoped layout and styles, real publication links, responsive controls, and absence of the legacy main bundle.
- Run the existing homepage optimization tests to prove the current homepage contracts remain unchanged.
- Build with the same `github-pages 232 / Jekyll 3.10` environment used by GitHub Pages.
- Verify `/`, `/v2/`, and `/cv/` at desktop and `390 x 844` mobile widths.
- Exercise the hamburger menu, theme persistence, email reveal, publication links, thumbnail modal, Escape handling, focus restoration, and both color modes.
- Check for horizontal overflow, overlapping text or controls, broken assets, and browser errors or warnings.
- Push only after local verification, then confirm the GitHub Pages workflow succeeds and inspect the live `/v2/` page.

## Non-Goals

- Do not replace or restyle the current homepage.
- Do not redesign the CV.
- Do not copy source code or assets from the reference website.
- Do not add a command palette, site search, analytics provider, publication filtering, or new biographical claims.
- Do not fabricate paper, code, DOI, BibTeX, or project-page destinations.

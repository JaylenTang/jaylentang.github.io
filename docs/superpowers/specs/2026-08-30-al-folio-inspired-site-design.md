# Al-Folio-Inspired Academic Site Design

## Objective

Redesign the production homepage, publications page, and web CV so they adopt the strongest visual and information-architecture patterns from Shanlin Sun's al-folio site while preserving Jialin Tang's existing Jekyll repository, purple identity, publication data, public URLs, dark/light theme support, and GitHub Pages deployment flow.

The result should feel like the same family of academic site as the reference: compact, research-first, easy to scan, and consistent across routes. It must not copy the reference author's content, assets, branding, or mobile layout defects.

## Chosen Approach

Rebuild the presentation inside the current Jekyll project instead of migrating the repository to al-folio.

- Keep the current AcademicPages/Jekyll dependency stack and GitHub Pages configuration.
- Reuse the existing V2 shell, theme persistence, publication collection, images, and tested interactions.
- Introduce al-folio-inspired shared components for navigation, news rows, publication rows, CV sections, and the CV table of contents.
- Retain purple as the sole accent family while using neutral black, white, and gray surfaces.
- Preserve the existing `v1` branch as the prior design.

This approach reaches the desired visual result without replacing configuration, deployment, redirects, content collections, or working test coverage.

## Reference Patterns To Adopt

The reference site's useful patterns are:

- A fixed, compact navigation bar with a name/brand on inner pages.
- A wide but restrained reading column with Roboto-style sans-serif typography.
- A short identity line under the main name.
- A desktop introduction with prose on the left and a circular portrait on the right.
- A two-column news table with fixed-width dates.
- Compact horizontal publication rows with venue labels, research images, metadata, action buttons, and one-sentence summaries.
- A separate all-publications route.
- A CV with a desktop table of contents, a clear PDF action, and strongly separated information sections.

The implementation will improve rather than reproduce the reference site's narrow-screen CV behavior: the table of contents must never overlap the title or content.

## Shared Site Shell

The homepage, `/publications/`, and `/cv/` will use one shared shell.

- The header remains fixed and compact.
- Homepage navigation contains `about`, `publications`, `cv`, and the theme icon.
- Inner routes show `Jialin (Jaylen) Tang` at the left and the same navigation at the right.
- The current accessible mobile menu remains the small-screen navigation mechanism.
- Dark mode remains the default for first-time visitors; the saved preference continues to take precedence.
- The footer remains `© <year> Jialin (Jaylen) Tang.` with no manually maintained update date.

Search and a command palette are intentionally excluded. The site's content volume does not justify their interaction or maintenance cost.

## Homepage

The homepage will retain its current facts and sections but use denser al-folio-inspired composition.

### Introduction

- Display the name, calligraphy, and `Ph.D. Student at UC Irvine` identity line at the top.
- Keep the biography and advisor links unchanged.
- Place the portrait to the right on desktop.
- Place the portrait before the biography on mobile.
- Retain protected email reveal and profile links.

### News

- Move news content into `_data/news.yml`.
- Render each item as a semantic two-column row with the date on the left and linked prose on the right.
- Preserve the existing news order and links.
- Stack dates above prose on narrow screens.

### Selected Publications

- Continue selecting documents with `selected: true` and sorting by `sort_order`.
- Use a compact shared publication-row include.
- Place a fixed-format thumbnail and purple venue strip at the left.
- Place title, authors, venue, year, volume/pages, actions, and summary at the right.
- Keep the image lightbox interaction.
- Offer `Paper`, optional `Code`, and optional `Bib` actions.
- Expand BibTeX inline and provide an accessible copy button.

### Services

Keep the NeurIPS 2026 and AAAI 2027 reviewer entries in a compact final section.

## Publications Page

The existing `/publications/` route will become a first-class page using the shared shell and publication-row component.

- List every published or accepted publication from `_publications`.
- Group entries into `Journal Articles` and `Conference Papers`.
- Do not render rejected, submitted, in-preparation, or manuscript-only work.
- Use the same title, author, venue, page, image, Paper/Code/Bib behavior as the homepage.
- Selected status controls homepage inclusion only; it does not affect the full publications page.

## Publication Data Model

`_publications` remains the single authoritative source for all web publication facts. Each web-visible publication will support:

- `title`
- `category`
- `sort_order`
- `web_visible`
- `selected`
- `publication_year`
- `venue_name`
- `venue_short`
- `volume`
- `pages`
- `location`
- `authors`
- `paperurl`
- `codeurl`
- `featured_image`
- `featured_thumbnail`
- `featured_image_alt`
- `summary`
- `bibtex`

Optional fields must degrade cleanly. Missing code or BibTeX data hides that action rather than rendering an empty control.

The accepted publication page ranges from the supplied CV are:

- HyperMODE: 21474-21491
- HyperEAST: 22241-22255
- Regression-Based Modeling of Antisense Oligonucleotide Efficacy: 458-461
- EV Wireless Charging: 454-457

PRISM-MAP and the two manuscript-in-preparation entries from the supplied PDF will not be added to `_publications` or rendered on the website.

## Web CV

The web CV will use the shared shell while adopting the reference site's document structure.

### Header And Navigation

- Show `Curriculum Vitae` and the visitor-safe PDF action at the top.
- Add a desktop sticky table of contents for General Information, Education, Research Interests, Publications, and Service.
- Replace the sticky table of contents with a compact disclosure/navigation control on narrow screens.

### Sections

- General Information: full name, protected email, Irvine location, and profile links; no telephone number.
- Education: retain UCI Ph.D., CSU Fullerton M.S., and the existing bachelor's record.
- Research Interests: reuse the approved homepage research-interest sentence.
- Publications: include only published or accepted journal and conference papers, generated from `_publications`.
- Service: retain NeurIPS 2026 and AAAI 2027 reviewer service.

The CV will remain an HTML page rather than embedding the PDF, so it is accessible, responsive, indexable, and easy to maintain.

## Public PDF

Create a public downloadable PDF from the supplied `CV (1).pdf` content with the telephone number removed from both the visible page and the searchable text layer.

- Keep the attachment's complete academic content, including submitted and manuscript entries, because the user's web-only exclusion does not change the private/full CV content.
- Preserve email and homepage links.
- Publish the sanitized file at a stable path such as `/files/Jialin_Tang_CV.pdf`.
- Link it from the CV heading with an icon and accessible text.
- Verify the final file by extracting its text and asserting that no telephone number remains.

## Visual System

- Use neutral near-black and white backgrounds rather than a purple-tinted page.
- Use purple only for links, current navigation, venue strips, focus accents, and restrained metadata highlights.
- Use a clean sans-serif type stack with approximately 16px body text and compact 1.5 line height.
- Keep headings light and editorial; publication titles remain compact rather than hero-sized.
- Use borders and spacing to separate sections, not decorative nested cards.
- Keep card corner radii at or below 6px.
- Maintain stable image dimensions and aspect ratios to prevent layout shift.

## Interaction And Accessibility

- Keep all content usable when JavaScript is unavailable.
- Preserve semantic heading order and landmark labels.
- Maintain visible keyboard focus and minimum 44px mobile menu/theme targets.
- Theme, menu, Bib disclosure, Bib copy, image modal, and CV table of contents must work by keyboard.
- Escape closes the active modal or menu and restores focus to the initiating control.
- Respect `prefers-reduced-motion`.
- Avoid horizontal overflow at 390px width.

## Data Flow And Failure Behavior

- `_data/news.yml` feeds the homepage news include.
- `_publications` feeds selected homepage rows, the full publications page, and the web CV.
- Publication rendering checks optional fields before rendering actions or metadata.
- Missing thumbnail data falls back to a text-only publication row rather than a broken image.
- External destinations remain ordinary links; the static site has no runtime API dependency.
- The PDF action remains absent until a sanitized file passes content verification.

## Testing And Verification

- Add source contract tests for news data, publication visibility, page ranges, Bib behavior, shared shell usage, and unpublished-title exclusion.
- Verify the homepage includes exactly the selected published/accepted papers.
- Verify `/publications/` includes all five published/accepted papers.
- Verify the web CV excludes PRISM-MAP and both manuscript titles.
- Verify extracted public-PDF text contains no telephone number.
- Run the complete Node test suite and a production Jekyll build.
- Perform browser checks at 1440x900 and 390x844 in light and dark modes.
- Exercise the mobile menu, theme toggle, image modal, Bib disclosure/copy, CV table of contents, and PDF link.
- Check browser console errors, image loading, heading hierarchy, focus restoration, clipped text, and horizontal overflow.

## Non-Goals

- Do not migrate the repository to al-folio.
- Do not copy the reference author's source files, content, profile image, or branding.
- Do not publish a telephone number on the HTML site or in the downloadable PDF.
- Do not add search, a command palette, blog, projects, analytics, publication filters, or new backend services.
- Do not add rejected, submitted, in-preparation, or manuscript-only work to the web publication collection.

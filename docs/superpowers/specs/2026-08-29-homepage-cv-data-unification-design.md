# Homepage And CV Data Unification Design

## Objective

Finish the current homepage redesign by making `/cv/` feel like part of the same site, making publication metadata authoritative in `_publications`, and removing the manually maintained footer update date. Preserve the approved homepage content, dark-first presentation, purple accent, responsive behavior, and existing public URLs.

## Chosen Approach

Use one publication data source with two purpose-built presentations:

- The homepage keeps its visual selected-publication rows.
- The CV keeps its compact Google Scholar-style publication list.
- Both views read titles, authors, venues, paper URLs, and ordering from `_publications`.
- Homepage-only presentation fields, such as imagery, summary text, venue badge, and code URL, also live in the matching publication document.

This avoids forcing one HTML component to serve two different information densities while removing duplicated publication facts.

## Publication Data Model

The three selected publication documents will define the following normalized fields:

- `selected`: whether the work appears on the homepage.
- `sort_order`: the shared display order.
- `authors`: an ordered YAML list containing each author's display name and whether that author is Jialin Tang.
- `paperurl`: the canonical paper destination.
- `venue_name`: the unabbreviated venue name.
- `venue_short`: the compact homepage badge.
- `publication_year`: the display year, independent of the file date used for Jekyll ordering.
- `volume`: optional journal volume.
- `codeurl`: optional repository destination.
- `featured_image`, `featured_thumbnail`, and `featured_image_alt`: homepage visual assets.
- `summary`: the one-sentence homepage summary.

Existing citation-oriented fields may remain for compatibility, but the homepage and CV must not contain separately typed copies of the selected papers' titles, author lists, venues, years, or paper URLs.

## Shared Rendering

Use two small includes that consume the same publication object:

- A selected-publication include renders the homepage visual row, image preview trigger, emphasized self-author, venue metadata, and available Paper/Code actions.
- The existing CV publication include is updated to render the normalized author list and venue fields, with fallbacks for older publication entries that have not yet been normalized.

The homepage assigns `site.publications`, filters for `selected: true`, sorts by `sort_order`, and invokes the selected-publication include. The CV continues grouping publications into journal, conference, and manuscript sections.

## CV Presentation

Create a lightweight CV layout that reuses the homepage's shared head, theme initialization, theme toggle, and script loading without the legacy AcademicPages masthead or author sidebar.

The `/cv/` page will contain:

- A compact sticky navigation matching the homepage, with `Homepage` and `CV` links plus the theme toggle.
- A centered content column using the homepage width, typography, background, text colors, purple link treatment, and focus styles.
- A restrained `Curriculum Vitae` page heading followed by Education, Publications, and Services.
- The existing Google Scholar-style publication hierarchy and compact metadata.
- The existing NeurIPS 2026 and AAAI 2027 reviewer entries.
- A matching social-links row and footer.

The CV will not repeat the homepage portrait or restore a separate profile sidebar. This keeps the document focused and removes the visual jump between routes.

## Footer

Both pages will show only:

`© <current year> Jialin (Jaylen) Tang.`

The hardcoded `Last updated` text and the legacy CV build-date line will not appear in the new layouts.

## Responsive And Accessibility Requirements

- Preserve the existing homepage desktop and mobile behavior.
- Keep the CV readable at desktop and `390 x 844` mobile widths with no horizontal overflow.
- Long publication titles and venue names must wrap without clipping.
- Retain semantic heading order, navigation labels, visible keyboard focus, and accessible theme controls.
- Continue respecting saved theme preference and `prefers-reduced-motion`.

## Testing And Verification

- Add contract tests proving the homepage iterates over selected publication documents instead of embedding paper metadata.
- Validate that every selected publication supplies the homepage fields required by the include.
- Add CV layout tests for the shared visual shell, navigation, theme control, publication grouping, and absence of the legacy author sidebar.
- Assert that neither page contains a `Last updated` label.
- Run all Node tests and the production Jekyll build.
- Inspect homepage and CV in light and dark modes at desktop and mobile widths.
- Exercise mobile navigation, theme switching, email reveal, and publication image previews.
- Check for broken images, browser errors, horizontal overflow, and clipped text before publishing.

## Non-Goals

- Do not migrate the repository to al-folio.
- Do not change publication claims, biography wording, education records, news items, or reviewer entries.
- Do not redesign the homepage again.
- Do not add publication search, filters, BibTeX controls, or new external dependencies.

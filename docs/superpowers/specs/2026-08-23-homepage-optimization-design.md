# Homepage Optimization Design

## Scope

Optimize the existing personal homepage without changing its content strategy or visual composition. The approved work covers SEO metadata, mobile theme controls, research-image loading, and removal of unnecessary page resources. The biography wording and research descriptions remain unchanged.

## SEO And Social Sharing

- Prevent the homepage title from rendering as `Jialin (Jaylen) Tang - Jialin (Jaylen) Tang` when the page title and site title are identical.
- Emit the configured site description as both the standard meta description and Open Graph description, even when a page has no excerpt.
- Populate `Person` structured data with the existing Google Scholar, LinkedIn, and GitHub profile URLs.
- Add a dedicated `1200 x 630` JPEG social card and configure it as the default Open Graph image.
- The social card uses a neutral light background, black text, a restrained blue accent, the current portrait, and the transparent Chinese calligraphy. It contains the name, `Ph.D. Student in Computational Science`, and `University of California, Irvine`; it does not contain publication details.

## Theme Controls

- Fix the greedy-navigation selector so it controls only the navigation overflow button. The current broad selector also selects the theme button and gives it the `hidden` class on the mobile CV page.
- Keep the theme button visible on the CV page at mobile widths.
- Use a `44 x 44` touch target on narrow screens and reserve sufficient title space on the homepage so the floating control cannot crowd the name.
- Preserve the current light and dark palettes and the existing saved-theme behavior.

## Research Images

- Preserve the original PNG diagrams for the click-to-zoom view.
- Generate `720 x 405` WebP thumbnails for the three research cards. The thumbnails should remain legible at the cards' maximum rendered width and be visually checked against the originals.
- Use a `<picture>` fallback to the original PNG for browsers without WebP support.
- Add explicit dimensions, `loading="lazy"`, and `decoding="async"` to prevent layout shifts and defer below-the-fold downloads.
- Clicking a thumbnail continues to load and display the original full-resolution PNG.

## Resource Loading

- Load MathJax and its compatibility polyfill only when a page explicitly sets `mathjax: true`; no current public page requires them.
- Allow the shared scripts include to skip the legacy `main.min.js` bundle on the custom homepage. The theme script remains loaded, and the homepage's email and research-preview behavior remains in its page script.
- Continue loading the legacy bundle on CV and other Academic Pages layouts because it powers their navigation and sidebar interactions.

## Verification

- Add focused static contract tests for the SEO template, navigation selector, image references and attributes, resource-loading conditions, asset dimensions, and expected size reductions.
- Verify the tests fail before implementation and pass afterward.
- Check the homepage and CV at desktop and mobile widths, in both light and dark themes.
- Confirm the CV mobile theme control is visible, the homepage has no horizontal overflow or title collision, research previews still open, and browser logs contain no errors.
- After deployment, verify the live title, description, Open Graph image, structured data, and responsive behavior.

## Non-Goals

- No biography rewrite.
- No publication, news, education, or services content changes.
- No redesign of the hero, research cards, CV layout, typography, or color palette.

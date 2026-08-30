import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");
const readExpectedFile = (relativePath) => {
  const file = new URL(relativePath, root);
  assert.ok(existsSync(file), `${relativePath} should exist`);
  return readFileSync(file, "utf8");
};
const assertMatches = (source, pattern, message = `content should match ${pattern}`) => {
  assert.ok(pattern.test(source), message);
};
const assertDoesNotMatch = (
  source,
  pattern,
  message = `content should not match ${pattern}`,
) => {
  assert.ok(!pattern.test(source), message);
};
const selectedPublicationAssignment =
  /{%\s*assign\s+selected_publications\s*=\s*site\.publications\s*\|\s*where:\s*"selected",\s*true\s*\|\s*sort:\s*"sort_order"\s*%}/;

test("V2 is the indexable production homepage", () => {
  const config = read("_config.yml");
  const layout = read("_layouts/home-v2.html");
  const page = read("_pages/home-v2.md");

  assertMatches(page, /^layout: home-v2$/m);
  assertMatches(page, /^permalink: \/$/m);
  assertMatches(page, /^  - \/v2\/$/m);
  assertMatches(page, /^  - \/about\/$/m);
  assertMatches(page, /^  - \/about\.html$/m);
  assertMatches(config, /^\s+- jekyll-redirect-from$/m);
  assertDoesNotMatch(layout, /<meta name="robots" content="noindex, nofollow">/);
  assertMatches(layout, /<body class="homepage-v2">/);
  assertMatches(layout, /include scripts\.html skip_main=true/);
  assertDoesNotMatch(layout, /main\.min\.js/);
});

test("V2 uses the shared header and approved profile", () => {
  const page = read("_pages/home-v2.md");
  const header = readExpectedFile("_includes/v2-header.html");

  assertMatches(
    page,
    /{%\s*include\s+v2-header\.html\b/,
    "homepage should render the shared V2 header include",
  );
  assertMatches(header, /<header class="v2-header"/, "V2 header should render header markup");
  assertMatches(
    header,
    /class="v2-brand" href="\/">Jialin \(Jaylen\) Tang<\/a>/,
    "inner pages should link the name back to the homepage",
  );
  assertMatches(
    header,
    /href="{% if page\.url == "\/" %}#about{% else %}\/#about{% endif %}"/,
    "the about link should work on both homepage and inner pages",
  );
  assertMatches(
    header,
    /href="\/publications\/"/,
    "header should link to the full publications page",
  );
  assertMatches(
    header,
    /href="\/cv\/"/,
    "header should link to the CV page",
  );
  assertMatches(
    header,
    /page\.url == "\/publications\/"/,
    "header should expose the publications current-page state",
  );
  assertMatches(
    header,
    /page\.url == "\/cv\/"/,
    "header should expose the CV current-page state",
  );
  assertMatches(
    header,
    /aria-controls="v2-navigation"/,
    "V2 menu control should reference the primary navigation",
  );
  assertMatches(
    header,
    /aria-label="Primary navigation"/,
    "V2 header should label its primary navigation",
  );
  assertMatches(
    header,
    /aria-expanded=/,
    "V2 menu control should expose its expanded state",
  );
  assertMatches(
    header,
    /{%\s*include\s+theme-toggle\.html\b/,
    "V2 header should include the shared theme toggle",
  );
  assertMatches(page, /Jialin \(Jaylen\) Tang/, "homepage should render the approved name");
  assertMatches(
    page,
    /name-calligraphy-transparent\.png/,
    "homepage should render the approved calligraphy asset",
  );
  assertMatches(
    page,
    /profile-photo-2026\.jpg/,
    "homepage should render the approved profile photo",
  );
});

test("V2 renders selected publication data and retains services", () => {
  const page = read("_pages/home-v2.md");
  const selectedPublicationPath = "_includes/selected-publication.html";
  const publicationRowPath = "_includes/v2-publication-row.html";
  const publications = [
    {
      path: "_publications/2026-01-04-hypermode.md",
      paperUrl: "https://doi.org/10.1109/JSTARS.2026.3705708",
      codeUrl: "https://github.com/JaylenTang/HyperMODE",
    },
    {
      path: "_publications/2025-01-01-hypereast.md",
      paperUrl: "https://ieeexplore.ieee.org/document/11129658",
      codeUrl: "https://github.com/JaylenTang/HyperEAST",
    },
    {
      path: "_publications/2026-01-01-mas-llava.md",
      paperUrl: "https://ieeexplore.ieee.org/document/11468028",
    },
  ];

  assertMatches(
    page,
    selectedPublicationAssignment,
    "homepage should filter selected publications and sort them by sort_order",
  );
  assertMatches(
    page,
    /{%\s*for\s+publication\s+in\s+selected_publications\s*%}/,
    "homepage should iterate over selected_publications",
  );
  assertMatches(
    page,
    /{%\s*include\s+selected-publication\.html\s+publication=publication\s*%}/,
    "homepage should render each publication through selected-publication.html",
  );
  assertDoesNotMatch(
    page,
    /<article class="v2-publication">/,
    "homepage should not retain literal publication article markup",
  );

  const selectedPublication = readExpectedFile(selectedPublicationPath);
  const publicationRow = readExpectedFile(publicationRowPath);
  assertMatches(
    publicationRow,
    /<a\b[^>]*>\s*Paper\s*<\/a>/,
    "shared publication row should render a Paper action",
  );
  assertDoesNotMatch(
    `${selectedPublication}\n${publicationRow}`,
    />\s*DOI\s*<\/a>/,
    "publication components should not label their paper action DOI",
  );

  for (const publication of publications) {
    const source = read(publication.path);
    assert.ok(
      source.includes(publication.paperUrl),
      `${publication.path} keeps its paper URL`,
    );
    if (publication.codeUrl) {
      assert.ok(
        source.includes(publication.codeUrl),
        `${publication.path} keeps its code URL`,
      );
    }
  }

  assertMatches(
    page,
    /Conference on Neural Information Processing Systems \(NeurIPS\) 2026/,
    "homepage should retain NeurIPS 2026 service text",
  );
  assertMatches(
    page,
    /Conference on Artificial Intelligence \(AAAI\) 2027/,
    "homepage should retain AAAI 2027 service text",
  );
});

test("V2 styles and interactions are scoped and accessible", () => {
  const page = read("_pages/home-v2.md");
  const css = read("assets/css/main.scss");
  const script = read("_includes/v2-common-script.html");
  const modal = read("_includes/v2-publication-modal.html");

  assertMatches(css, /\.homepage-v2\s*\{/);
  assertMatches(css, /\.homepage-v2\s*\{[^}]*padding:\s*0;/s);
  assertMatches(css, /\.v2-profile-photo[^}]*border-radius:\s*50%/s);
  assertMatches(css, /\.v2-publication\s*\{[^}]*grid-template-columns:/s);
  assertMatches(css, /@media \(max-width: 760px\)[\s\S]*\.v2-menu-toggle/);
  assertMatches(css, /@media \(prefers-reduced-motion: reduce\)/);
  assertMatches(script, /event\.key === "Escape"/);
  assertMatches(script, /lastModalTrigger\.focus/);
  assertMatches(modal, /data-v2-modal/);
  assertMatches(page, /include v2-publication-modal\.html/);
});

test("V2 uses the approved purple accent palette", () => {
  const css = read("assets/css/main.scss");
  const v2Css = css.split("/* Homepage V2 reference-inspired preview */")[1];

  assert.ok(v2Css, "V2 stylesheet section should exist");
  assertMatches(v2Css, /--v2-link:\s*#a78bfa;/);
  assertMatches(v2Css, /--v2-link-hover:\s*#c4b5fd;/);
  assertMatches(v2Css, /--v2-accent:\s*#7654c5;/);
  assertMatches(v2Css, /html\[data-theme="light"\][^}]*--v2-link:\s*#6d28d9;/s);
  assertMatches(v2Css, /html\[data-theme="dark"\] \.homepage-v2 \.v2-about__copy a/);
  assertMatches(v2Css, /\.v2-venue-tag[^}]*background:\s*var\(--v2-accent\);/s);
  assertDoesNotMatch(v2Css, /#4d9cbb|#75bfdc|#3b94b7|#176f91|#0d536e/i);
});

test("the production homepage and CV remain present", () => {
  const homepage = read("_pages/home-v2.md");

  assertMatches(homepage, /^permalink: \/$/m);
  assert.equal(existsSync(new URL("_pages/about.md", root)), false);
  assertMatches(read("_pages/cv.md"), /^permalink: \/cv\/$/m);
});

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

const selectedPublications = [
  ["HyperMODE", "_publications/2026-01-04-hypermode.md"],
  ["HyperEAST", "_publications/2025-01-01-hypereast.md"],
  ["MAS-LLaVA", "_publications/2026-01-01-mas-llava.md"],
];
const selectedPublicationAssignment =
  /{%\s*assign\s+selected_publications\s*=\s*site\.publications\s*\|\s*where:\s*"selected",\s*true\s*\|\s*sort:\s*"sort_order"\s*%}/;

for (const [name, path] of selectedPublications) {
  test(`${name} exposes the selected-publication fields`, () => {
    const source = read(path);
    const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];

    assert.ok(frontMatter, `${path} should have YAML front matter`);
    assertMatches(
      frontMatter,
      /^selected:[ \t]*true[ \t]*$/m,
      `${path} should set selected: true`,
    );
    assertMatches(
      frontMatter,
      /^publication_year:[ \t]*\d{4}[ \t]*$/m,
      `${path} should define publication_year as a four-digit year`,
    );

    const authorsBlock = frontMatter.match(
      /^authors:[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))*)/m,
    )?.[1];
    assert.ok(authorsBlock, `${path} should define authors as a YAML block list`);

    const authorEntries = authorsBlock
      .split(/(?=^[ \t]+-[ \t]+name:)/m)
      .filter((entry) => /^[ \t]+-[ \t]+name:/m.test(entry));
    assert.ok(authorEntries.length > 0, `${path} should define at least one author`);
    for (const [index, author] of authorEntries.entries()) {
      assertMatches(
        author,
        /^[ \t]+-[ \t]+name:[ \t]*\S.*$/m,
        `${path} author ${index + 1} should define name`,
      );
      assertMatches(
        author,
        /^[ \t]+short_name:[ \t]*\S.*$/m,
        `${path} author ${index + 1} should define short_name`,
      );
    }
    assertMatches(
      authorsBlock,
      /^[ \t]+self:[ \t]*true[ \t]*$/m,
      `${path} should identify at least one author with self: true`,
    );

    for (const field of [
      "venue_name",
      "venue_short",
      "featured_image",
      "featured_thumbnail",
      "featured_image_alt",
      "summary",
    ]) {
      assertMatches(
        frontMatter,
        new RegExp(`^${field}:[ \\t]*\\S.*$`, "m"),
        `${path} should define a non-empty ${field}`,
      );
    }
  });
}

test("the selected publication registry covers every selected document", () => {
  const registeredPaths = new Set(selectedPublications.map(([, path]) => path));
  const unregisteredSelectedPaths = readdirSync(new URL("_publications/", root), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `_publications/${entry.name}`)
    .filter((path) => {
      const frontMatter = read(path).match(
        /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
      )?.[1];
      return frontMatter && /^selected:[ \t]*true[ \t]*$/m.test(frontMatter);
    })
    .filter((path) => !registeredPaths.has(path))
    .sort();

  assert.deepEqual(
    unregisteredSelectedPaths,
    [],
    `selected publication registry is missing: ${unregisteredSelectedPaths.join(", ")}`,
  );
});

test("the homepage renders the selected publication collection", () => {
  const homepage = read("_pages/home-v2.md");

  assertMatches(
    homepage,
    selectedPublicationAssignment,
    "homepage should filter selected publications and sort them by sort_order",
  );
  assertMatches(
    homepage,
    /{%\s*for\s+publication\s+in\s+selected_publications\s*%}/,
    "homepage should iterate over selected_publications",
  );
  assertMatches(
    homepage,
    /{%\s*include\s+selected-publication\.html\s+publication=publication\s*%}/,
    "homepage should render each publication through selected-publication.html",
  );
  assertDoesNotMatch(
    homepage,
    /<article class="v2-publication">/,
    "homepage should not retain literal publication article markup",
  );
});

test("the selected publication include renders aliased publication data", () => {
  const selectedPublication = readExpectedFile("_includes/selected-publication.html");

  assertMatches(
    selectedPublication,
    /{%\s*assign\s+publication\s*=\s*include\.publication\s*%}/,
    "selected publication include should alias include.publication",
  );
  for (const [field, pattern] of [
    ["title", /publication\.title\b/],
    ["paperurl", /publication\.paperurl\b/],
    ["authors", /publication\.authors\b/],
    ["venue_name", /publication\.venue_name\b/],
    ["venue_short", /publication\.venue_short\b/],
    ["publication_year", /publication\.publication_year\b/],
    ["featured_image", /publication\.featured_image\b/],
    ["featured_thumbnail", /publication\.featured_thumbnail\b/],
    ["featured_image_alt", /publication\.featured_image_alt\b/],
    ["summary", /publication\.summary\b/],
  ]) {
    assertMatches(
      selectedPublication,
      pattern,
      `selected publication include should consume publication.${field}`,
    );
  }
  assertMatches(
    selectedPublication,
    /{%\s*for\s+author\s+in\s+publication\.authors\s*%}/,
    "selected publication include should iterate over publication.authors",
  );
  assertMatches(
    selectedPublication,
    /{%\s*if\s+author\.self\s*%}/,
    "selected publication include should identify the self author",
  );
  assertMatches(
    selectedPublication,
    /author\.name\b/,
    "selected publication include should render each author name",
  );
  assertMatches(
    selectedPublication,
    /{%\s*if\s+publication\.volume\s*%}[\s\S]*{{\s*publication\.volume\s*}}[\s\S]*{%\s*endif\s*%}/,
    "selected publication include should conditionally render publication.volume",
  );
  assertMatches(
    selectedPublication,
    /<a\b[^>]*href="{{\s*publication\.paperurl\s*}}"[^>]*>\s*Paper\s*<\/a>/,
    "selected publication include should bind Paper href to publication.paperurl",
  );
  assertMatches(
    selectedPublication,
    /{%\s*if\s+publication\.codeurl\s*%}[\s\S]*<a\b[^>]*href="{{\s*publication\.codeurl\s*}}"[^>]*>\s*Code\s*<\/a>[\s\S]*{%\s*endif\s*%}/,
    "selected publication include should conditionally bind Code href to publication.codeurl",
  );
  assertDoesNotMatch(
    selectedPublication,
    />\s*DOI\s*<\/a>/,
    "selected publication include should not label its paper action DOI",
  );
});

test("the CV page opts into the V2 layout without an author sidebar", () => {
  const cv = read("_pages/cv.md");

  assertMatches(cv, /^layout: cv-v2$/m, "CV page should use the cv-v2 layout");
  assertDoesNotMatch(
    cv,
    /^author_profile:[ \t]*true[ \t]*$/m,
    "CV page should not enable the legacy author profile sidebar",
  );
});

test("the CV V2 layout uses the shared homepage shell", () => {
  const layout = readExpectedFile("_layouts/cv-v2.html");

  assertMatches(
    layout,
    /<body class="homepage-v2 cv-v2">/,
    "CV layout should expose homepage-v2 and cv-v2 body classes",
  );
  assertMatches(layout, /{{\s*content\s*}}/, "CV layout should render page content");
  assertMatches(
    layout,
    /<h1\b[^>]*>\s*Curriculum Vitae\s*<\/h1>/,
    "CV layout should render a Curriculum Vitae heading",
  );
  assertMatches(
    layout,
    /if\s*\(\s*!localStorage\.getItem\(["']jaylen-theme["']\)\s*\)/,
    "CV layout should default to dark only without a stored theme preference",
  );
  assertMatches(
    layout,
    /document\.documentElement\.setAttribute\(["']data-theme["'],\s*["']dark["']\)/,
    "CV layout should initialize the default dark theme",
  );
  assertMatches(
    layout,
    /document\.documentElement\.style\.colorScheme\s*=\s*["']dark["']/,
    "CV layout should initialize the dark color scheme",
  );
  assertMatches(layout, /{%\s*include\s+v2-header\.html\b/, "CV layout should use v2-header");
  assertMatches(layout, /{%\s*include\s+v2-social\.html\b/, "CV layout should use v2-social");
  assertMatches(layout, /{%\s*include\s+v2-footer\.html\b/, "CV layout should use v2-footer");
  assertMatches(
    layout,
    /{%\s*include\s+v2-common-script\.html\b/,
    "CV layout should use the shared V2 script include",
  );
  assertMatches(
    layout,
    /{%\s*include\s+scripts\.html\s+skip_main=true\s*%}/,
    "CV layout should load scripts without main.min.js",
  );
  assertDoesNotMatch(
    layout,
    /{%\s*include\s+(?:masthead|sidebar)(?:\.html)?\b/,
    "CV layout should not use legacy masthead or sidebar includes",
  );
});

test("the V2 footer derives its year without update copy", () => {
  const footer = readExpectedFile("_includes/v2-footer.html");
  const yearPattern = /{{-?\s*site\.time\s*\|\s*date:\s*["']%Y["']\s*-?}}/;

  assertMatches(
    footer,
    yearPattern,
    "V2 footer should derive its year from site.time",
  );
  const visibleCopy = footer
    .replace(yearPattern, "YEAR")
    .replace(/{%[\s\S]*?%}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(
    visibleCopy,
    "&copy; YEAR Jialin (Jaylen) Tang.",
    "V2 footer should contain only the copyright, year, and owner sentence",
  );
  assertDoesNotMatch(
    footer,
    /(?:Site[ \t]+)?Last updated/i,
    "V2 footer should not contain update copy",
  );
  assertDoesNotMatch(
    footer,
    /August 23, 2026/,
    "V2 footer should not contain a hardcoded update date",
  );
});

test("the homepage delegates footer rendering without update copy", () => {
  const homepage = read("_pages/home-v2.md");

  assertMatches(
    homepage,
    /{%\s*include\s+v2-footer\.html\b/,
    "homepage should render the shared V2 footer include",
  );
  assertDoesNotMatch(
    homepage,
    /<footer\b[^>]*class=["'][^"']*\bv2-footer\b/,
    "homepage should not retain inline V2 footer markup",
  );
  assertDoesNotMatch(homepage, /Last updated/i, "homepage should not contain update copy");
  assertDoesNotMatch(
    homepage,
    /August 23, 2026/,
    "homepage should not contain a hardcoded update date",
  );
});

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
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
  {
    name: "HyperMODE",
    path: "_publications/2026-01-04-hypermode.md",
    figureAriaLabel: "Open HyperMODE figure",
    metadata: {
      title:
        "HyperMODE: A Continuous-Depth Spectral-Spatial Modeling Framework with Mamba and Neural Ordinary Differential Equations for Hyperspectral Image Classification",
      selected: true,
      sortOrder: 1,
      publicationYear: 2026,
      venueName:
        "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
      venueShort: "JSTARS",
      volume: 19,
      authors: [
        { name: "Jialin Tang", shortName: "J Tang", self: true },
        { name: "Yunduan Lou", shortName: "Y Lou" },
        { name: "Yanhui Guo", shortName: "Y Guo" },
        { name: "Yu Bai", shortName: "Y Bai" },
      ],
      paperUrl: "https://doi.org/10.1109/JSTARS.2026.3705708",
      codeUrl: "https://github.com/JaylenTang/HyperMODE",
      featuredImage: "/images/research-hypermode.png",
      featuredThumbnail: "/images/research-hypermode-thumb.webp",
      featuredImageAlt: "HyperMODE hyperspectral modeling thumbnail",
      summary:
        "Continuous-depth spectral-spatial modeling that combines sequence modeling with neural ODE dynamics.",
    },
  },
  {
    name: "HyperEAST",
    path: "_publications/2025-01-01-hypereast.md",
    figureAriaLabel: "Open HyperEAST figure",
    metadata: {
      title:
        "HyperEAST: An Enhanced Attention-Based Spectral-Spatial Transformer with Self-Supervised Pretraining for Hyperspectral Image Classification",
      selected: true,
      sortOrder: 2,
      publicationYear: 2025,
      venueName:
        "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
      venueShort: "JSTARS",
      volume: 18,
      authors: [
        { name: "Jialin Tang", shortName: "J Tang", self: true },
        { name: "Nan Ma", shortName: "N Ma" },
        { name: "Chen Jia", shortName: "C Jia" },
        { name: "Rui Tian", shortName: "R Tian" },
        { name: "Yanhui Guo", shortName: "Y Guo" },
      ],
      paperUrl: "https://ieeexplore.ieee.org/document/11129658",
      codeUrl: "https://github.com/JaylenTang/HyperEAST",
      featuredImage: "/images/research-hypereast.png",
      featuredThumbnail: "/images/research-hypereast-thumb.webp",
      featuredImageAlt: "HyperEAST hyperspectral image classification thumbnail",
      summary:
        "Self-supervised spectral-spatial representation learning for hyperspectral image classification.",
    },
  },
  {
    name: "MAS-LLaVA",
    path: "_publications/2026-01-01-mas-llava.md",
    figureAriaLabel: "Open MAS-LLaVA figure",
    metadata: {
      title: "MAS-LLaVA: Motion-Aware Adaptive Sampling for Training-Free Video Large Language Models",
      selected: true,
      sortOrder: 3,
      publicationYear: 2026,
      venueName:
        "IEEE International Conference on Artificial Intelligence, Computer, Data Sciences and Applications",
      venueShort: "ACDSA",
      volume: undefined,
      authors: [
        { name: "Jialin Tang", shortName: "J Tang", self: true },
        { name: "Yu Bai", shortName: "Y Bai" },
      ],
      paperUrl: "https://ieeexplore.ieee.org/document/11468028",
      codeUrl: undefined,
      featuredImage: "/images/research-mas-llava.png",
      featuredThumbnail: "/images/research-mas-llava-thumb.webp",
      featuredImageAlt: "MAS-LLaVA video sampling thumbnail",
      summary:
        "Motion-aware token and frame sampling for efficient training-free video large language model inference.",
    },
  },
];
const selectedPublicationAssignment =
  /{%\s*assign\s+selected_publications\s*=\s*site\.publications\s*\|\s*where:\s*"selected",\s*true\s*\|\s*sort:\s*"sort_order"\s*%}/;

const unquoteYaml = (value) => {
  const trimmed = value.trim();
  const quote = trimmed[0];
  return (quote === '"' || quote === "'") && trimmed.at(-1) === quote
    ? trimmed.slice(1, -1)
    : trimmed;
};
const frontMatterFor = (path) => {
  const frontMatter = read(path).match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  assert.ok(frontMatter, `${path} should have YAML front matter`);
  return frontMatter;
};
const yamlScalar = (frontMatter, field, required = true) => {
  const match = frontMatter.match(new RegExp(`^${field}:[ \\t]*(.*?)[ \\t]*$`, "m"));
  if (!match) {
    assert.ok(!required, `front matter should define ${field}`);
    return undefined;
  }
  return unquoteYaml(match[1]);
};
const yamlAuthors = (frontMatter) => {
  const block = frontMatter.match(/^authors:[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))*)/m)?.[1];
  assert.ok(block, "front matter should define authors as a YAML block list");

  return block
    .split(/(?=^[ \t]+-[ \t]+name:)/m)
    .filter((entry) => /^[ \t]+-[ \t]+name:/m.test(entry))
    .map((entry) => {
      const name = entry.match(/^[ \t]+-[ \t]+name:[ \t]*(.*)$/m)?.[1];
      const shortName = entry.match(/^[ \t]+short_name:[ \t]*(.*)$/m)?.[1];
      const self = entry.match(/^[ \t]+self:[ \t]*(.*)$/m)?.[1];
      assert.ok(name && shortName, "each author should define name and short_name");

      return {
        name: unquoteYaml(name),
        shortName: unquoteYaml(shortName),
        ...(self === undefined ? {} : { self: unquoteYaml(self) === "true" }),
      };
    });
};

for (const { name, path, metadata } of selectedPublications) {
  test(`${name} exposes exact selected-publication metadata`, () => {
    const frontMatter = frontMatterFor(path);
    const volume = yamlScalar(frontMatter, "volume", false);

    assert.deepEqual(
      {
        title: yamlScalar(frontMatter, "title"),
        selected: yamlScalar(frontMatter, "selected") === "true",
        sortOrder: Number(yamlScalar(frontMatter, "sort_order")),
        publicationYear: Number(yamlScalar(frontMatter, "publication_year")),
        venueName: yamlScalar(frontMatter, "venue_name"),
        venueShort: yamlScalar(frontMatter, "venue_short"),
        volume: volume === undefined ? undefined : Number(volume),
        authors: yamlAuthors(frontMatter),
        paperUrl: yamlScalar(frontMatter, "paperurl"),
        codeUrl: yamlScalar(frontMatter, "codeurl", false),
        featuredImage: yamlScalar(frontMatter, "featured_image"),
        featuredThumbnail: yamlScalar(frontMatter, "featured_thumbnail"),
        featuredImageAlt: yamlScalar(frontMatter, "featured_image_alt"),
        summary: yamlScalar(frontMatter, "summary"),
      },
      metadata,
    );
  });
}

test("selected publications use unique approved sort orders", () => {
  const sortOrders = selectedPublications.map(({ path }) =>
    Number(yamlScalar(frontMatterFor(path), "sort_order")),
  );

  assert.deepEqual(sortOrders, selectedPublications.map(({ metadata }) => metadata.sortOrder));
  assert.equal(new Set(sortOrders).size, sortOrders.length);
});

test("the selected publication registry covers every selected document", () => {
  const registeredPaths = new Set(selectedPublications.map(({ path }) => path));
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
    /{%\s*if\s+publication\.volume\s*%}[\s\S]*{{\s*publication\.volume\s*\|\s*escape\s*}}[\s\S]*{%\s*endif\s*%}/,
    "selected publication include should conditionally render publication.volume",
  );
  assertMatches(
    selectedPublication,
    /<a\b[^>]*href="{{\s*publication\.paperurl\s*\|\s*escape\s*}}"[^>]*>\s*Paper\s*<\/a>/,
    "selected publication include should escape the Paper href",
  );
  assertMatches(
    selectedPublication,
    /{%\s*if\s+publication\.codeurl\s*%}[\s\S]*<a\b[^>]*href="{{\s*publication\.codeurl\s*\|\s*escape\s*}}"[^>]*>\s*Code\s*<\/a>[\s\S]*{%\s*endif\s*%}/,
    "selected publication include should conditionally escape the Code href",
  );
  assertMatches(
    selectedPublication,
    /{%\s*assign\s+asset_query\s*=\s*["']\?v=["']\s*\|\s*append:\s*site\.asset_version\s*%}/,
    "selected publication include should build a shared asset query",
  );
  assertMatches(
    selectedPublication,
    /{%\s*assign\s+featured_image_url\s*=\s*publication\.featured_image\s*\|\s*append:\s*asset_query\s*%}/,
    "selected publication include should build the full image URL before output",
  );
  assertMatches(
    selectedPublication,
    /{%\s*assign\s+featured_thumbnail_url\s*=\s*publication\.featured_thumbnail\s*\|\s*append:\s*asset_query\s*%}/,
    "selected publication include should build the thumbnail URL before output",
  );
  assertMatches(
    selectedPublication,
    /{%\s*assign\s+figure_name\s*=\s*publication\.title\s*\|\s*split:\s*["']:["']\s*\|\s*first\s*\|\s*strip\s*%}/,
    "selected publication include should derive the concise figure name from the title",
  );
  assertMatches(
    selectedPublication,
    /{%\s*assign\s+figure_aria_label\s*=\s*["']Open ["']\s*\|\s*append:\s*figure_name\s*\|\s*append:\s*["'] figure["']\s*%}/,
    "selected publication include should build the concise figure label",
  );

  const outputs = [...selectedPublication.matchAll(/{{([\s\S]*?)}}/g)];
  assert.ok(outputs.length > 0, "selected publication include should render Liquid outputs");
  for (const [, expression] of outputs) {
    assertMatches(
      expression,
      /\|\s*escape\s*$/,
      `Liquid output {{${expression}}} should be escaped`,
    );
  }
  assertDoesNotMatch(
    selectedPublication,
    />\s*DOI\s*<\/a>/,
    "selected publication include should not label its paper action DOI",
  );
});

test("the rendered homepage preserves exact selected publication cards", () => {
  const destination = mkdtempSync(join(tmpdir(), "homepage-cv-unification-"));

  try {
    execFileSync(
      "bundle",
      ["exec", "jekyll", "build", "--quiet", "--destination", destination],
      { cwd: rootPath, encoding: "utf8", stdio: "pipe" },
    );
    const homepage = readFileSync(join(destination, "index.html"), "utf8");
    const articles = [
      ...homepage.matchAll(/<article class="v2-publication">[\s\S]*?<\/article>/g),
    ].map(([article]) => article);
    const extract = (source, pattern, message) => {
      const match = source.match(pattern);
      assert.ok(match, message);
      return match[1].replace(/\s+/g, " ").trim();
    };
    const attribute = (tag, name) =>
      extract(tag, new RegExp(`\\b${name}="([^"]*)"`), `${name} should be present`);

    assert.equal(articles.length, 3, "homepage should render exactly three publications");
    assert.deepEqual(
      articles.map((article) =>
        extract(article, /<h3><a\b[^>]*>([\s\S]*?)<\/a><\/h3>/, "title should render"),
      ),
      selectedPublications.map(({ metadata }) => metadata.title),
    );

    for (const [index, publication] of selectedPublications.entries()) {
      const article = articles[index];
      const { metadata } = publication;
      const titleLink = article.match(/<h3><a href="([^"]+)">([\s\S]*?)<\/a><\/h3>/);
      assert.ok(titleLink, `${publication.name} should render its title link`);
      assert.deepEqual(titleLink.slice(1), [metadata.paperUrl, metadata.title]);

      const expectedAuthors = metadata.authors
        .map(({ name, self }) => (self ? `<strong>${name}</strong>` : name))
        .join(", ");
      assert.equal(
        extract(
          article,
          /<p class="v2-publication__authors">([\s\S]*?)<\/p>/,
          `${publication.name} authors should render`,
        ),
        expectedAuthors,
      );

      const expectedVenue = `<em>${metadata.venueName}</em>, ${metadata.publicationYear}${
        metadata.volume === undefined ? "" : `, Volume ${metadata.volume}`
      }`;
      assert.equal(
        extract(
          article,
          /<p class="v2-publication__venue">([\s\S]*?)<\/p>/,
          `${publication.name} venue should render`,
        ),
        expectedVenue,
      );
      assert.equal(
        extract(
          article,
          /<p class="v2-publication__summary">([\s\S]*?)<\/p>/,
          `${publication.name} summary should render`,
        ),
        metadata.summary,
      );

      const button = article.match(/<button class="v2-publication__figure"[^>]*>/)?.[0];
      const image = article.match(/<img\b[^>]*>/)?.[0];
      assert.ok(button && image, `${publication.name} figure should render`);
      assert.equal(attribute(button, "aria-label"), publication.figureAriaLabel);
      assert.equal(attribute(image, "alt"), metadata.featuredImageAlt);

      const actionsHtml = extract(
        article,
        /<div class="v2-publication__actions">([\s\S]*?)<\/div>/,
        `${publication.name} actions should render`,
      );
      const actions = [...actionsHtml.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(
        ([, href, label]) => ({ label: label.trim(), href }),
      );
      assert.deepEqual(actions, [
        { label: "Paper", href: metadata.paperUrl },
        ...(metadata.codeUrl ? [{ label: "Code", href: metadata.codeUrl }] : []),
      ]);
    }

    assertDoesNotMatch(homepage, />\s*DOI\s*<\/a>/, "homepage should not render a DOI action");
  } finally {
    rmSync(destination, { recursive: true, force: true });
  }
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

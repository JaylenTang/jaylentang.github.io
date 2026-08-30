import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");
const readExpectedFile = (relativePath) => {
  const file = new URL(relativePath, root);
  assert.ok(existsSync(file), `${relativePath} should exist`);
  return readFileSync(file, "utf8");
};
const pathFor = (relativePath) => fileURLToPath(new URL(relativePath, root));
const assertMatches = (source, pattern, message) => {
  assert.ok(pattern.test(source), message);
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const yamlImagePath = (field, relativePath) =>
  new RegExp(
    `^${field}:[ \\t]*["']?/${escapeRegExp(relativePath)}["']?[ \\t]*$`,
    "m",
  );

function jpegDimensions(relativePath) {
  const buffer = readFileSync(pathFor(relativePath));
  assert.equal(buffer[0], 0xff, `${relativePath} is not a JPEG`);
  assert.equal(buffer[1], 0xd8, `${relativePath} is not a JPEG`);

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;

  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd8 || marker === 0xd9) continue;
    if (marker === 0xda || offset + 7 >= buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (startOfFrameMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }

  assert.fail(`Unable to read JPEG dimensions from ${relativePath}`);
}

test("SEO metadata is complete", () => {
  const seo = read("_includes/seo.html");
  const config = read("_config.yml");

  assert.match(seo, /page\.title != site\.title/);
  assert.match(seo, /<meta name="description"/);
  assert.match(seo, /<meta property="og:description"/);
  assert.match(seo, /<meta name="twitter:card"/);
  assert.match(seo, /site\.og_image/);
  assert.match(config, /og_image\s*:\s*"social-card\.jpg"/);
  assert.match(config, /type\s*:\s*Person/);
  assert.match(config, /https:\/\/scholar\.google\.com\/citations\?user=tOytfmwAAAAJ&hl=en/);
  assert.match(config, /https:\/\/www\.linkedin\.com\/in\/jtang0516\//);
  assert.match(config, /https:\/\/github\.com\/jaylentang/);

  assert.ok(existsSync(pathFor("images/social-card.jpg")), "social card is missing");
  assert.deepEqual(jpegDimensions("images/social-card.jpg"), { width: 1200, height: 630 });
});

test("mobile theme controls remain available", () => {
  const navigation = read("assets/js/plugins/jquery.greedy-navigation.js");
  const minifiedNavigation = read("assets/js/main.min.js");
  const css = read("assets/css/main.scss");
  const mobileCss = css.slice(css.indexOf("@media (max-width: 520px)"));

  assert.match(navigation, /\$\('#site-nav > button'\)/);
  assert.doesNotMatch(navigation, /\$\('#site-nav button'\)/);
  assert.match(minifiedNavigation, /#site-nav > button/);
  assert.doesNotMatch(minifiedNavigation, /#site-nav button/);
  assert.match(mobileCss, /\.theme-toggle\s*\{[^}]*min-width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(mobileCss, /\.roger-intro h1\s*\{[^}]*padding-right:\s*3\.25rem;/s);
});

test("research cards use lightweight thumbnails", () => {
  const selectedPublication = readExpectedFile("_includes/selected-publication.html");
  const publications = [
    {
      source: "_publications/2026-01-04-hypermode.md",
      thumbnail: "images/research-hypermode-thumb.webp",
      original: "images/research-hypermode.png",
    },
    {
      source: "_publications/2025-01-01-hypereast.md",
      thumbnail: "images/research-hypereast-thumb.webp",
      original: "images/research-hypereast.png",
    },
    {
      source: "_publications/2026-01-01-mas-llava.md",
      thumbnail: "images/research-mas-llava-thumb.webp",
      original: "images/research-mas-llava.png",
    },
  ];
  let thumbnailBytes = 0;
  let originalBytes = 0;

  assertMatches(
    selectedPublication,
    /class="v2-publication__figure"/,
    "selected publication include should render figure controls",
  );
  assertMatches(
    selectedPublication,
    /<img\b(?=[^>]*loading="lazy")(?=[^>]*decoding="async")(?=[^>]*width="720")(?=[^>]*height="405")[^>]*>/,
    "selected publication image should be lazy, async, and dimensioned",
  );

  for (const publication of publications) {
    const source = read(publication.source);
    assertMatches(
      source,
      yamlImagePath("featured_thumbnail", publication.thumbnail),
      `${publication.source} should bind its lightweight featured_thumbnail`,
    );
    assertMatches(
      source,
      yamlImagePath("featured_image", publication.original),
      `${publication.source} should bind its full featured_image`,
    );
    assert.ok(
      existsSync(pathFor(publication.thumbnail)),
      `${publication.thumbnail} is missing`,
    );
    assert.ok(existsSync(pathFor(publication.original)), `${publication.original} is missing`);
    assert.ok(
      statSync(pathFor(publication.thumbnail)).size < 200_000,
      `${publication.thumbnail} is too large`,
    );
    thumbnailBytes += statSync(pathFor(publication.thumbnail)).size;
    originalBytes += statSync(pathFor(publication.original)).size;
  }

  assert.ok(thumbnailBytes < originalBytes * 0.35, "thumbnail payload was not reduced enough");
});

test("homepage skips unused resources", () => {
  const customHead = read("_includes/head/custom.html");
  const scripts = read("_includes/scripts.html");
  const homeLayout = read("_layouts/home.html");

  assert.match(customHead, /\{% if page\.mathjax %\}[\s\S]*MathJax[\s\S]*\{% endif %\}/);
  assert.match(scripts, /\{% unless include\.skip_main %\}[\s\S]*main\.min\.js[\s\S]*\{% endunless %\}/);
  assert.match(homeLayout, /include scripts\.html skip_main=true/);
});

test("internal project documentation is excluded from GitHub Pages", () => {
  const config = read("_config.yml");

  assert.match(config, /^\s*- docs\s*$/m);
});

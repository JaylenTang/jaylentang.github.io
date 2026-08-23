import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");
const pathFor = (relativePath) => fileURLToPath(new URL(relativePath, root));

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
  const about = read("_pages/about.md");
  const names = ["hypermode", "hypereast", "mas-llava"];
  let thumbnailBytes = 0;
  let originalBytes = 0;

  assert.equal((about.match(/<picture>/g) || []).length, 3);
  assert.equal((about.match(/loading="lazy"/g) || []).length, 3);
  assert.equal((about.match(/decoding="async"/g) || []).length, 3);
  assert.equal((about.match(/width="720" height="405"/g) || []).length, 3);

  for (const name of names) {
    const thumbnail = `images/research-${name}-thumb.webp`;
    const original = `images/research-${name}.png`;

    assert.match(about, new RegExp(`/images/research-${name}-thumb\\.webp`));
    assert.match(about, new RegExp(`data-full="/images/research-${name}\\.png`));
    assert.ok(existsSync(pathFor(thumbnail)), `${thumbnail} is missing`);
    assert.ok(statSync(pathFor(thumbnail)).size < 200_000, `${thumbnail} is too large`);
    thumbnailBytes += statSync(pathFor(thumbnail)).size;
    originalBytes += statSync(pathFor(original)).size;
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

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");

test("V2 is an isolated noindex preview", () => {
  const layout = read("_layouts/home-v2.html");
  const page = read("_pages/home-v2.md");

  assert.match(page, /^layout: home-v2$/m);
  assert.match(page, /^permalink: \/v2\/$/m);
  assert.match(layout, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(layout, /<body class="homepage-v2">/);
  assert.match(layout, /include scripts\.html skip_main=true/);
  assert.doesNotMatch(layout, /main\.min\.js/);
});

test("V2 contains the approved profile and navigation", () => {
  const page = read("_pages/home-v2.md");

  assert.match(page, /<header class="v2-header"/);
  assert.match(page, /href="#about"/);
  assert.match(page, /href="#research"/);
  assert.match(page, /href="\/cv\/"/);
  assert.match(page, /aria-controls="v2-navigation"/);
  assert.match(page, /Jialin \(Jaylen\) Tang/);
  assert.match(page, /name-calligraphy-transparent\.png/);
  assert.match(page, /profile-photo-2026\.jpg/);
});

test("V2 includes real news, publications, and services", () => {
  const page = read("_pages/home-v2.md");

  assert.equal((page.match(/class="v2-publication"/g) || []).length, 3);
  assert.match(page, /10\.1109\/JSTARS\.2026\.3705708/);
  assert.match(page, /ieeexplore\.ieee\.org\/document\/11129658/);
  assert.match(page, /ieeexplore\.ieee\.org\/document\/11468028/);
  assert.match(page, /github\.com\/JaylenTang\/HyperMODE/);
  assert.match(page, /github\.com\/JaylenTang\/HyperEAST/);
  assert.match(page, /research-hypermode-thumb\.webp/);
  assert.match(page, /Conference on Neural Information Processing Systems \(NeurIPS\) 2026/);
  assert.match(page, /Conference on Artificial Intelligence \(AAAI\) 2027/);
});

test("V2 styles and interactions are scoped and accessible", () => {
  const page = read("_pages/home-v2.md");
  const css = read("assets/css/main.scss");

  assert.match(css, /\.homepage-v2\s*\{/);
  assert.match(css, /\.homepage-v2\s*\{[^}]*padding:\s*0;/s);
  assert.match(css, /\.v2-profile-photo[^}]*border-radius:\s*50%/s);
  assert.match(css, /\.v2-publication\s*\{[^}]*grid-template-columns:/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.v2-menu-toggle/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /lastModalTrigger\.focus/);
  assert.match(page, /aria-expanded/);
  assert.match(page, /data-v2-modal/);
});

test("V2 uses the approved purple accent palette", () => {
  const css = read("assets/css/main.scss");
  const v2Css = css.split("/* Homepage V2 reference-inspired preview */")[1];

  assert.ok(v2Css, "V2 stylesheet section should exist");
  assert.match(v2Css, /--v2-link:\s*#a78bfa;/);
  assert.match(v2Css, /--v2-link-hover:\s*#c4b5fd;/);
  assert.match(v2Css, /--v2-accent:\s*#7654c5;/);
  assert.match(v2Css, /html\[data-theme="light"\][^}]*--v2-link:\s*#6d28d9;/s);
  assert.match(v2Css, /html\[data-theme="dark"\] \.homepage-v2 \.v2-about__copy a/);
  assert.match(v2Css, /\.v2-venue-tag[^}]*background:\s*var\(--v2-accent\);/s);
  assert.doesNotMatch(v2Css, /#4d9cbb|#75bfdc|#3b94b7|#176f91|#0d536e/i);
});

test("V1 homepage and CV remain present", () => {
  assert.match(read("_pages/about.md"), /^permalink: \/$/m);
  assert.match(read("_pages/cv.md"), /^permalink: \/cv\/$/m);
});

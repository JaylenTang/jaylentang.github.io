import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const publicTitles = [
  "HyperMODE:",
  "HyperEAST:",
  "MAS-LLaVA:",
  "Regression-Based Modeling of Antisense Oligonucleotide Efficacy",
  "Optimizing Energy Management Strategy for EV Wireless Charging",
];
const privateTitles = [
  "PRISM-MAP:",
  "Multimodal Mammography",
  "Dynamic Network Biomarkers",
];

test("homepage news is sourced from structured data", () => {
  const homepage = read("_pages/home-v2.md");
  assert.ok(existsSync(new URL("_data/news.yml", root)));
  assert.match(homepage, /include v2-news-list\.html news=site\.data\.news/);
  assert.doesNotMatch(homepage, /<li class="v2-news-item">/);
});

test("every web publication declares visibility and approved page metadata", () => {
  const expectedPages = new Map([
    ["2026-01-04-hypermode.md", "21474-21491"],
    ["2025-01-01-hypereast.md", "22241-22255"],
    ["2026-01-03-aso-efficacy.md", "458-461"],
    ["2026-01-02-ev-wireless-charging.md", "454-457"],
  ]);
  for (const [file, pages] of expectedPages) {
    const source = read(`_publications/${file}`);
    assert.match(source, /^web_visible: true$/m);
    assert.match(source, new RegExp(`^pages: ["']?${pages}["']?$`, "m"));
  }
  assert.match(
    read("_publications/2026-01-01-mas-llava.md"),
    /^web_visible: true$/m,
  );
});

test("shared publication rows support optional Code and Bib actions", () => {
  const include = read("_includes/v2-publication-row.html");
  assert.match(include, /publication\.paperurl/);
  assert.match(include, /if publication\.codeurl/);
  assert.match(include, /if publication\.bibtex/);
  assert.match(include, /data-v2-bib-copy/);
  assert.match(include, /if publication\.featured_thumbnail/);
});

test("the V2 header exposes the approved route set", () => {
  const header = read("_includes/v2-header.html");
  assert.match(header, /href="\/"/);
  assert.match(header, /href="\/publications\/"/);
  assert.match(header, /href="\/cv\/"/);
  assert.doesNotMatch(header, />research<\/a>/);
});

test("rendered V2 routes share the shell and exclude unpublished work", () => {
  const destination = mkdtempSync(join(tmpdir(), "al-folio-inspired-site-"));
  try {
    execFileSync(
      "bundle",
      ["exec", "jekyll", "build", "--quiet", "--destination", destination],
      {
        cwd: rootPath,
        encoding: "utf8",
        stdio: "pipe",
      },
    );
    const home = readFileSync(join(destination, "index.html"), "utf8");
    const publications = readFileSync(
      join(destination, "publications", "index.html"),
      "utf8",
    );
    const cv = readFileSync(join(destination, "cv", "index.html"), "utf8");

    assert.equal((home.match(/class="v2-publication"/g) || []).length, 3);
    assert.equal(
      (publications.match(/class="v2-publication"/g) || []).length,
      5,
    );
    for (const title of publicTitles) {
      assert.match(`${publications}\n${cv}`, new RegExp(title));
    }
    for (const title of privateTitles) {
      assert.doesNotMatch(`${home}\n${publications}\n${cv}`, new RegExp(title));
    }
    for (const page of [home, publications, cv]) {
      assert.match(page, /class="v2-header"/);
      assert.match(page, /class="v2-footer"/);
      assert.match(page, /class="theme-toggle"/);
    }
    assert.match(cv, /href="\/files\/Jialin_Tang_CV\.pdf"/);
  } finally {
    rmSync(destination, { recursive: true, force: true });
  }
});

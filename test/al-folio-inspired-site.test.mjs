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
    ["2026-01-01-mas-llava.md", "1-6"],
    ["2026-01-03-aso-efficacy.md", "458-461"],
    ["2026-01-02-ev-wireless-charging.md", "454-457"],
  ]);
  for (const [file, pages] of expectedPages) {
    const source = read(`_publications/${file}`);
    assert.match(source, /^web_visible: true$/m);
    assert.match(source, new RegExp(`^pages: ["']?${pages}["']?$`, "m"));
  }
});

test("conference publications expose official IEEE bibliographic metadata", () => {
  const expected = [
    [
      "2026-01-01-mas-llava.md",
      "10.1109/ACDSA67686.2026.11468028",
    ],
    [
      "2026-01-03-aso-efficacy.md",
      "10.1109/CCWC67433.2026.11393870",
    ],
    [
      "2026-01-02-ev-wireless-charging.md",
      "10.1109/CCWC67433.2026.11393703",
    ],
  ];

  for (const [file, doi] of expected) {
    const source = read(`_publications/${file}`);
    assert.match(source, new RegExp(`^doi: ["']?${doi.replaceAll(".", "\\.")}["']?$`, "mi"));
    assert.match(source, new RegExp(`doi=\\{${doi.replaceAll(".", "\\.")}\\}`, "i"));
  }

  const mas = read("_publications/2026-01-01-mas-llava.md");
  assert.match(mas, /^location: "Boracay Island, Philippines"$/m);
  assert.match(mas, /^paperurl: 'https:\/\/ieeexplore\.ieee\.org\/document\/11468028'$/m);

  const hypermode = read("_publications/2026-01-04-hypermode.md");
  assert.match(hypermode, /^citation: .*21474-21491.*$/m);

  const generator = read("scripts/build-public-cv.py");
  assert.match(generator, /Boracay Island, Philippines/);
  assert.match(generator, /pp\. 1-6/);

  const row = read("_includes/v2-publication-row.html");
  assert.doesNotMatch(row, /publication\.doi/);
});

test("shared publication rows support optional Paper, Code and Bib resources", () => {
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

test("the web CV uses the approved public sections and navigation", () => {
  const layout = read("_layouts/cv-v2.html");
  const page = read("_pages/cv.md");
  const publication = read("_includes/archive-single-cv.html");
  const styles = read("assets/css/main.scss");

  assert.match(layout, /href="\/files\/Jialin_Tang_CV\.pdf"/);
  assert.match(layout, /include cv-v2-toc\.html/);
  assert.match(layout, /class="cv-toc-mobile"/);
  assert.match(layout, /class="cv-v2-grid"/);

  for (const id of [
    "general-information",
    "education",
    "research-interests",
    "publications",
    "service",
  ]) {
    assert.match(page, new RegExp(`id="${id}"`));
  }
  assert.match(page, /where:\s*"web_visible",\s*true/);
  assert.doesNotMatch(page, /Preprints \/ Manuscripts|category", "manuscripts"/);
  assert.match(publication, /post\.pages/);
  assert.match(publication, /pp\./);
  assert.match(
    styles,
    /\.cv-v2-section\s*>\s*h2\s*\{[^}]*scroll-margin-top:\s*5rem;/s,
  );
});

test("the public CV generator contains explicit privacy checks", () => {
  const generator = read("scripts/build-public-cv.py");
  assert.ok(existsSync(new URL("files/Jialin_Tang_CV.pdf", root)));
  assert.match(generator, /forbidden_fragments|Telephone number found/);
  assert.doesNotMatch(generator, /href=['"]tel:|"telephone"\s*:/i);
  assert.match(generator, /mailto:jialit7@uci\.edu/);
  assert.match(generator, /https:\/\/jaylentang\.github\.io\//);
});

test("the public CV uses the compact resume-class layout", () => {
  const generator = read("scripts/build-public-cv.py");

  assert.match(generator, /PAGE_MARGIN\s*=\s*0\.40\s*\*\s*inch/);
  assert.match(generator, /RULE\s*=\s*colors\.black/);
  assert.match(generator, /Paragraph\("Jialin Tang", STYLES\["name"\]\)/);
  assert.doesNotMatch(generator, /CVFooter|def draw_page\(/);
});

test("rendered V2 routes separate preprints from published work", () => {
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

    const newsSection = home.match(/<section class="v2-section v2-news"[\s\S]*?<\/section>/)?.[0];
    const newsArchive = newsSection?.match(/<details class="v2-news-archive">([\s\S]*?)<\/details>/)?.[1];
    assert.ok(newsArchive, "older news should be collapsed in a native disclosure by default");
    const recentNews = newsSection.slice(0, newsSection.indexOf('<details class="v2-news-archive">'));
    assert.equal((recentNews.match(/class="v2-news-item"/g) || []).length, 5);
    assert.equal((newsArchive.match(/class="v2-news-item"/g) || []).length, 6);
    assert.match(recentNews, /datetime="2026-10-16"/);
    assert.match(newsArchive, /datetime="2025-08-14"/);
    assert.match(newsArchive, /<summary>/);

    const selectedSection = home.match(/<section id="research"[\s\S]*?<\/section>/)?.[0];
    const preprintsSection = home.match(/<section id="preprints"[\s\S]*?<\/section>/)?.[0];
    assert.ok(selectedSection, "selected publications should render separately");
    assert.ok(preprintsSection, "preprints should render separately");
    assert.equal((selectedSection.match(/class="v2-publication"/g) || []).length, 3);
    assert.equal((preprintsSection.match(/class="v2-publication"/g) || []).length, 2);
    for (const title of ["TRACE-Stain:", "PRISM-MAP:"]) {
      assert.ok(preprintsSection.includes(title));
      assert.ok(!selectedSection.includes(title));
      assert.ok(!`${publications}\n${cv}`.includes(title));
    }
    assert.equal((preprintsSection.match(/<em>Preprint<\/em>, 2026/g) || []).length, 2);
    assert.doesNotMatch(preprintsSection, /<a\b/);
    assert.equal(
      (preprintsSection.match(/<button\b[^>]*\bdisabled[^>]*>(?:Paper|Code|Bib)<\/button>/g) || []).length,
      6,
      "both preprints should display three disabled resource buttons",
    );
    for (const page of [home, publications]) {
      const actionGroups = [...page.matchAll(/<div class="v2-publication__actions">([\s\S]*?)<\/div>/g)];
      assert.equal(actionGroups.length, 5, "every paper should have a resource button group");
      for (const [, actions] of actionGroups) {
        const labels = [...actions.matchAll(/<(?:a|button|summary)\b[^>]*>(Paper|Code|Bib)<\/(?:a|button|summary)>/g)]
          .map(([, label]) => label);
        assert.deepEqual(labels, ["Paper", "Code", "Bib"]);
      }
    }
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
    assert.doesNotMatch(home, /class="v2-brand"/);
    assert.match(publications, /class="v2-brand" href="\/"/);
    assert.match(cv, /class="v2-brand" href="\/"/);
    assert.match(home, /href="#about" aria-current="page">About<\/a>/);
    assert.match(publications, /href="\/#about">About<\/a>/);
    assert.match(cv, /href="\/#about">About<\/a>/);
    assert.match(cv, /href="\/files\/Jialin_Tang_CV\.pdf"/);
  } finally {
    rmSync(destination, { recursive: true, force: true });
  }
});

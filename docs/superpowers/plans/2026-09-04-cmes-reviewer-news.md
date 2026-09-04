# CMES Reviewer News Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the September 4, 2026 CMES reviewer announcement to the homepage news and list the role in the homepage and web CV service sections.

**Architecture:** Extend the existing YAML-backed news feed and the two static service lists without changing templates or layout. Use the same official journal URL and italicized journal name in all three locations.

**Tech Stack:** Jekyll, YAML, Markdown, HTML

---

### Task 1: Add the CMES reviewer content

**Files:**
- Modify: `_data/news.yml`
- Modify: `_pages/home-v2.md`
- Modify: `_pages/cv.md`

- [ ] **Step 1: Add the dated news item**

Insert this entry at the beginning of `_data/news.yml`:

```yaml
- date: 2026-09-04
  display_date: Sep 04, 2026
  content: >-
    Invited to serve as a reviewer for
    [_Computer Modeling in Engineering & Sciences_ (CMES)](https://www.techscience.com/cmes/).
```

- [ ] **Step 2: Add the homepage service item**

Add this list item after the existing conference reviewer entries in `_pages/home-v2.md`:

```html
<li>Reviewer for <a href="https://www.techscience.com/cmes/"><em>Computer Modeling in Engineering &amp; Sciences</em> (CMES)</a>.</li>
```

- [ ] **Step 3: Add the CV service item**

Add the same list item after the existing conference reviewer entries in `_pages/cv.md`:

```html
<li>Reviewer for <a href="https://www.techscience.com/cmes/"><em>Computer Modeling in Engineering &amp; Sciences</em> (CMES)</a>.</li>
```

- [ ] **Step 4: Verify source consistency**

Run:

```bash
rg -n "Computer Modeling in Engineering|2026-09-04|Sep 04, 2026" _data/news.yml _pages/home-v2.md _pages/cv.md
```

Expected: one CMES reference in each of the three files, with the date present in `_data/news.yml`.

- [ ] **Step 5: Build the site**

Run:

```bash
bundle exec jekyll build --destination /tmp/jaylen-homepage-cmes-verify
```

Expected: exit code 0 and `done` in the output.

- [ ] **Step 6: Verify rendered pages**

Run:

```bash
rg -n "Sep 04, 2026|Computer Modeling in Engineering" /tmp/jaylen-homepage-cmes-verify/index.html /tmp/jaylen-homepage-cmes-verify/cv/index.html
```

Expected: the dated announcement appears on the homepage, and the reviewer role appears on both the homepage and CV.

- [ ] **Step 7: Commit the content update**

```bash
git add _data/news.yml _pages/home-v2.md _pages/cv.md
git commit -m "Add CMES reviewer announcement"
```

### Task 2: Publish and verify

- [ ] **Step 1: Push the main branch**

Run:

```bash
git push origin main
```

Expected: the local `main` commit is pushed to `origin/main`.

- [ ] **Step 2: Verify GitHub Pages deployment**

Open the repository Actions page and confirm the new `pages-build-deployment` run completes successfully.

- [ ] **Step 3: Verify the live site**

Open `https://jaylentang.github.io/` and `https://jaylentang.github.io/cv/`. Confirm the September 4 news item is first, the service entry appears on both pages, the journal title is italicized, and each CMES link points to `https://www.techscience.com/cmes/`.

# CMES Reviewer News Design

## Goal

Record Jialin Tang's new reviewer role for *Computer Modeling in Engineering & Sciences* (CMES) consistently across the homepage news and service sections and the web CV.

## Content

Add a new first item to `_data/news.yml` dated September 4, 2026:

> Invited to serve as a reviewer for *Computer Modeling in Engineering & Sciences* (CMES).

Add the following item under "Invited Reviewer" on both the homepage and CV:

> Reviewer for *Computer Modeling in Engineering & Sciences* (CMES).

In every location, italicize the journal title and link it to the official journal page at `https://www.techscience.com/cmes/`.

## Scope

- Update `_data/news.yml`.
- Update the homepage service list in `_pages/home-v2.md`.
- Update the CV service list in `_pages/cv.md`.
- Keep the existing "Invited Reviewer" heading and current layout unchanged.
- Do not change the downloadable PDF CV in this update.

## Verification

- Build the Jekyll site successfully.
- Confirm the new item is first in the news list.
- Confirm the journal entry appears on both the homepage and `/cv/`.
- Confirm all three links use the official CMES URL.

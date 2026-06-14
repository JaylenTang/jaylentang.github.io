---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
hide_title: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======

* Ph.D. in Computational Science, University of California, Irvine, 2030 (Expected)
* M.S. in Computer Science, California State University, Fullerton, 2026
* B.M. in Information Management and Information Systems, Shandong University of Finance and Economics, 2022

Publications
======
{% assign ordered_publications = site.publications | sort: "sort_order" %}
{% assign journal_publications = ordered_publications | where: "category", "journals" %}
{% assign conference_publications = ordered_publications | where: "category", "conferences" %}
{% assign manuscript_publications = ordered_publications | where: "category", "manuscripts" %}

{% if journal_publications.size > 0 %}
Journal Articles
------
  <ul class="cv-publications">{% for post in journal_publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
{% endif %}

{% if conference_publications.size > 0 %}
Conference Papers
------
  <ul class="cv-publications">{% for post in conference_publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
{% endif %}

{% if manuscript_publications.size > 0 %}
Preprints / Manuscripts
------
  <ul class="cv-publications">{% for post in manuscript_publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
{% endif %}

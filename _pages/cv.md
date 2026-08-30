---
layout: cv-v2
title: "CV"
permalink: /cv/
redirect_from:
  - /resume
---

<section class="v2-section cv-v2-section" aria-labelledby="cv-education-title">
  <h2 id="cv-education-title">Education</h2>
  <ul class="cv-v2-education">
    <li>Ph.D. in Computational Science, University of California, Irvine, 2030 (Expected)</li>
    <li>M.S. in Computer Science, California State University, Fullerton, 2026</li>
    <li>B.M. in Information Management and Information Systems, Shandong University of Finance and Economics, 2022</li>
  </ul>
</section>

<section class="v2-section cv-v2-section" aria-labelledby="cv-publications-title">
  <h2 id="cv-publications-title">Publications</h2>
  {% assign ordered_publications = site.publications | sort: "sort_order" %}
  {% assign journal_publications = ordered_publications | where: "category", "journals" %}
  {% assign conference_publications = ordered_publications | where: "category", "conferences" %}
  {% assign manuscript_publications = ordered_publications | where: "category", "manuscripts" %}

  {% if journal_publications.size > 0 %}
    <h3>Journal Articles</h3>
    <ul class="cv-publications">
      {% for post in journal_publications %}
        {% include archive-single-cv.html %}
      {% endfor %}
    </ul>
  {% endif %}

  {% if conference_publications.size > 0 %}
    <h3>Conference Papers</h3>
    <ul class="cv-publications">
      {% for post in conference_publications %}
        {% include archive-single-cv.html %}
      {% endfor %}
    </ul>
  {% endif %}

  {% if manuscript_publications.size > 0 %}
    <h3>Preprints / Manuscripts</h3>
    <ul class="cv-publications">
      {% for post in manuscript_publications %}
        {% include archive-single-cv.html %}
      {% endfor %}
    </ul>
  {% endif %}
</section>

<section class="v2-section cv-v2-section" aria-labelledby="cv-services-title">
  <h2 id="cv-services-title">Services</h2>
  <h3>Invited Reviewer</h3>
  <ul class="cv-v2-services">
    <li>Reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
    <li>Reviewer for the <a href="https://aaai.org/conference/aaai/aaai-27/">Conference on Artificial Intelligence (AAAI) 2027</a>.</li>
  </ul>
</section>

---
layout: cv-v2
title: "CV"
permalink: /cv/
redirect_from:
  - /resume
---

<section class="v2-section cv-v2-section" aria-labelledby="general-information">
  <h2 id="general-information">General Information</h2>
  <dl class="cv-general-info">
    <div><dt>Name</dt><dd>Jialin (Jaylen) Tang</dd></div>
    <div><dt>Location</dt><dd>Irvine, CA, USA</dd></div>
    <div><dt>Affiliation</dt><dd>University of California, Irvine</dd></div>
    <div>
      <dt>Email</dt>
      <dd class="cv-v2-email" data-v2-cv-email aria-live="polite"><span id="v2-email">protected</span> <button type="button" data-v2-email>reveal</button></dd>
    </div>
    <div><dt>Website</dt><dd><a href="https://jaylentang.github.io/">jaylentang.github.io</a></dd></div>
  </dl>
</section>

<section class="v2-section cv-v2-section" aria-labelledby="education">
  <h2 id="education">Education</h2>
  <div class="cv-v2-education">
    <article class="cv-education-entry">
      <div><p class="cv-education-entry__institution">University of California, Irvine</p><p>Ph.D. in Computational Science</p></div>
      <p>Expected 2030</p>
    </article>
    <article class="cv-education-entry">
      <div><p class="cv-education-entry__institution">California State University, Fullerton</p><p>M.S. in Computer Science</p></div>
      <p>2026</p>
    </article>
    <article class="cv-education-entry">
      <div><p class="cv-education-entry__institution">Shandong University of Finance and Economics</p><p>B.M. in Information Management and Information Systems</p></div>
      <p>2022</p>
    </article>
  </div>
</section>

<section class="v2-section cv-v2-section" aria-labelledby="research-interests">
  <h2 id="research-interests">Research Interests</h2>
  <p>Deep learning, image processing, Vision Large Language Models and diffusion.</p>
</section>

<section class="v2-section cv-v2-section" aria-labelledby="publications">
  <h2 id="publications">Publications</h2>
  {% assign visible_publications = site.publications | where: "web_visible", true | sort: "sort_order" %}
  {% assign journal_publications = visible_publications | where: "category", "journals" %}
  {% assign conference_publications = visible_publications | where: "category", "conferences" %}

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

</section>

<section class="v2-section cv-v2-section" aria-labelledby="service">
  <h2 id="service">Service</h2>
  <h3>Invited Reviewer</h3>
  <ul class="cv-v2-services">
    <li>Reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
    <li>Reviewer for the <a href="https://aaai.org/conference/aaai/aaai-27/">Conference on Artificial Intelligence (AAAI) 2027</a>.</li>
    <li>Reviewer for <a href="https://www.techscience.com/cmes/"><em>Computer Modeling in Engineering &amp; Sciences</em> (CMES)</a>.</li>
  </ul>
</section>

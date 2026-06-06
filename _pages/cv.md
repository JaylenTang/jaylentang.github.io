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
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

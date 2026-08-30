---
layout: home-v2
permalink: /
title: "Jialin (Jaylen) Tang"
redirect_from:
  - /v2/
  - /about/
  - /about.html
---

{% include v2-header.html %}

<main class="v2-main">
  <section id="about" class="v2-section v2-about" aria-labelledby="v2-name">
    <div class="v2-about__heading">
      <h1 id="v2-name"><strong>Jialin</strong> (Jaylen) Tang</h1>
      <img class="v2-calligraphy" src="/images/name-calligraphy-transparent.png?v={{ site.asset_version }}" width="2508" height="627" alt="">
      <p class="v2-subtitle">Ph.D. Student at UC Irvine</p>
    </div>

    <div class="v2-about__grid">
      <div class="v2-about__copy">
        <p>I am a Ph.D. student in Computational Science at the University of California, Irvine.</p>
        <p>I am advised by <a href="https://ecsicl.github.io/team/">Prof. Yu Bai</a> and co-advised by <a href="https://aicps.eng.uci.edu/people-2/">Prof. Mohammad Abdullah Al Faruque</a> and <a href="https://smile.sdsu.edu/biography.html">Prof. Junfei Xie</a>.</p>
        <p>Before that I received my M.S. degree in Computer Science from California State University, Fullerton in 2026.</p>
        <p>My research interests include <strong>deep learning, image processing, Vision Large Language Models and diffusion</strong>.</p>

        <ul class="v2-profile-meta" aria-label="Profile details">
          <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span>Irvine, CA, USA</span></li>
          <li><i class="fas fa-university" aria-hidden="true"></i><span>University of California, Irvine</span></li>
        </ul>

        <p class="v2-email"><strong>Email:</strong> <span id="v2-email">protected</span> <button type="button" data-v2-email>reveal</button></p>

        <nav class="v2-profile-links" aria-label="Profile links">
          <a href="https://scholar.google.com/citations?user=tOytfmwAAAAJ&amp;hl=en">Google Scholar</a>
          <a href="https://www.linkedin.com/in/jtang0516/">LinkedIn</a>
          <a href="https://github.com/jaylentang">GitHub</a>
          <a href="/cv/">CV</a>
        </nav>
      </div>

      <figure class="v2-about__media">
        <img class="v2-profile-photo" src="/images/profile-photo-2026.jpg?v={{ site.asset_version }}" width="460" height="460" alt="Jialin Tang">
      </figure>
    </div>
  </section>

  <section class="v2-section v2-news" aria-labelledby="v2-news-title">
    <h2 id="v2-news-title">news</h2>
    <ol class="v2-news-list">
      <li class="v2-news-item">
        <time datetime="2026-06-17">Jun 17, 2026</time>
        <p><a href="https://doi.org/10.1109/JSTARS.2026.3705708">HyperMODE</a> was accepted for publication in <a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS).</p>
      </li>
      <li class="v2-news-item">
        <time datetime="2026-05-16">May 16, 2026</time>
        <p>PRISM-Stain received the 3rd-place poster award at the SABPA OC/LA 18th Annual Biomedical Forum Poster Competition. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7463034204185083904/">post</a></p>
      </li>
      <li class="v2-news-item">
        <time datetime="2026-05-15">May 15, 2026</time>
        <p>Received the M.S. degree in Computer Science from California State University, Fullerton, with Graduate Academic Honors.</p>
      </li>
      <li class="v2-news-item">
        <time datetime="2026-04-08">Apr 08, 2026</time>
        <p>Received the <a href="https://grad.sdsu.edu/financial-support/pgrf">Presidential Graduate Research Fellowship</a> for the 2026&ndash;2027 academic year.</p>
      </li>
      <li class="v2-news-item">
        <time datetime="2026-03-27">Mar 27, 2026</time>
        <p>Defended my M.S. thesis at California State University, Fullerton.</p>
      </li>
      <li class="v2-news-item">
        <time datetime="2026-01-05">Jan 05, 2026</time>
        <p>Presented our EV wireless charging optimization and ASO efficacy modeling work at the <a href="https://ieee-ccwc.org/">IEEE 16th Annual Computing and Communication Workshop and Conference (CCWC) 2026</a>. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7414165378937044993/">post</a></p>
      </li>
      <li class="v2-news-item">
        <time datetime="2025-11-17">Nov 17, 2025</time>
        <p><a href="https://ieeexplore.ieee.org/document/11468028">MAS-LLaVA</a> was accepted by the <a href="https://acdsa.org/2026/">IEEE International Conference on Artificial Intelligence, Computer, Data Sciences and Applications (ACDSA) 2026</a>.</p>
      </li>
      <li class="v2-news-item">
        <time datetime="2025-11-14">Nov 14, 2025</time>
        <p>Invited guest speaker at The 6th Workshop on Enhanced Open Networked Airborne Computing Platform, University of Nevada-Reno, NV. Topic: <em>HyperEAST: A Lightweight Spectral-Spatial Transformer for UAV-Based Hyperspectral Image Classification</em>. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7397103743579688960/">post</a></p>
      </li>
      <li class="v2-news-item">
        <time datetime="2025-08-14">Aug 14, 2025</time>
        <p><a href="https://doi.org/10.1109/JSTARS.2025.3599855">HyperEAST</a> was accepted for publication in <a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS).</p>
      </li>
    </ol>
  </section>

  <section id="research" class="v2-section v2-publications" aria-labelledby="v2-publications-title">
    <h2 id="v2-publications-title">selected publications</h2>

    {% assign selected_publications = site.publications | where: "selected", true | sort: "sort_order" %}
    {% for publication in selected_publications %}
      {% include selected-publication.html publication=publication %}
    {% endfor %}
  </section>

  <section class="v2-section v2-services" aria-labelledby="v2-services-title">
    <h2 id="v2-services-title">services</h2>
    <h3>Invited Reviewer</h3>
    <ul>
      <li>Reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
      <li>Reviewer for the <a href="https://aaai.org/conference/aaai/aaai-27/">Conference on Artificial Intelligence (AAAI) 2027</a>.</li>
    </ul>
  </section>

  {% include v2-social.html %}
</main>

{% include v2-footer.html %}

<div class="v2-modal" data-v2-modal hidden role="dialog" aria-modal="true" aria-label="Research figure preview">
  <button class="v2-modal__close" type="button" aria-label="Close research figure"><i class="fas fa-times" aria-hidden="true"></i></button>
  <img alt="">
</div>

<script>
  (function () {
    var modal = document.querySelector("[data-v2-modal]");
    if (!modal) return;

    var modalImage = modal.querySelector("img");
    var closeButton = modal.querySelector(".v2-modal__close");
    var lastModalTrigger = null;

    function getFocusableModalElements() {
      return Array.prototype.slice.call(modal.querySelectorAll("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
    }

    function openModal(button) {
      var thumbnail = button.querySelector("img");
      lastModalTrigger = button;
      modalImage.src = button.getAttribute("data-full");
      modalImage.alt = thumbnail ? thumbnail.alt : "";
      modal.hidden = false;
      document.body.classList.add("v2-modal-open");
      closeButton.focus({ preventScroll: true });
    }

    function closeModal() {
      if (modal.hidden) return;

      modal.hidden = true;
      modalImage.removeAttribute("src");
      document.body.classList.remove("v2-modal-open");
      if (lastModalTrigger) lastModalTrigger.focus({ preventScroll: true });
    }

    document.querySelectorAll(".v2-publication__figure").forEach(function (button) {
      button.addEventListener("click", function () {
        openModal(button);
      });
    });

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (!modal.hidden) {
          closeModal();
          return;
        }
      }

      if (event.key === "Tab" && !modal.hidden) {
        var focusable = getFocusableModalElements();
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }());
</script>

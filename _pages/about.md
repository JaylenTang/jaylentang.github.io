---
layout: home
permalink: /
title: "Jialin (Jaylen) Tang"
redirect_from:
  - /about/
  - /about.html
---

<main class="roger-page">
  <section class="roger-hero" aria-label="Profile">
    <div class="roger-intro">
      <h1>Jialin (Jaylen) Tang</h1>
      <img class="roger-calligraphy" src="/images/name-calligraphy.png?v={{ site.asset_version }}" alt="Jialin Tang Chinese calligraphy">

      <p>
        I am a Ph.D. student in Computational Science at the University of California, Irvine.
        I am advised by <a href="https://ecsicl.github.io/team/">Prof. Yu Bai</a> and co-advised by
        <a href="https://aicps.eng.uci.edu/people-2/">Prof. Mohammad Abdullah Al Faruque</a> and
        <a href="https://smile.sdsu.edu/biography.html">Prof. Junfei Xie</a>. Before that I received my M.S. degree in
        Computer Science from California State University, Fullerton in 2026. My
        research interests include deep learning, image processing, Vision Large
        Language Models and diffusion.
      </p>

      <ul class="roger-profile-meta" aria-label="Profile details">
        <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span>Irvine, CA, USA</span></li>
        <li><i class="fas fa-university" aria-hidden="true"></i><span>University of California, Irvine</span></li>
      </ul>

      <p class="roger-email">
        <strong>Email:</strong>
        <span id="email">protected</span>
        <button class="email-unscramble" type="button" data-unscramble-email>reveal</button>
      </p>

      <nav class="roger-profile-links" aria-label="Profile links">
        <a href="https://scholar.google.com/citations?user=tOytfmwAAAAJ&hl=en"><i class="ai ai-google-scholar" aria-hidden="true"></i><span>Google Scholar</span></a>
        <a href="https://www.linkedin.com/in/jtang0516/"><i class="fab fa-linkedin" aria-hidden="true"></i><span>LinkedIn</span></a>
        <a href="https://github.com/jaylentang"><i class="fab fa-github" aria-hidden="true"></i><span>Github</span></a>
        <a href="/cv/"><i class="fas fa-file-alt" aria-hidden="true"></i><span>CV</span></a>
      </nav>
    </div>

    <img class="roger-photo" src="/images/profile-photo-2026.jpg?v={{ site.asset_version }}" alt="Jialin Tang profile photo">
  </section>

  <section class="roger-section">
    <h2>News</h2>
    <ul class="roger-news">
      <li>[06/2026] HyperMODE was published in <a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS). <a href="https://doi.org/10.1109/JSTARS.2026.3705708">doi</a></li>
      <li>[05/2026] PRISM-Stain received the 3rd-place poster award at the SABPA OC/LA 18th Annual Biomedical Forum Poster Competition. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7463034204185083904/">post</a></li>
      <li>[05/2026] Invited to serve as a reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
      <li>[04/2026] MAS-LLaVA was published at the <a href="https://acdsa.org/2026/">IEEE International Conference on Artificial Intelligence, Computer, Data Sciences and Applications (ACDSA) 2026</a>.</li>
      <li>[03/2026] Defended my M.S. thesis at California State University, Fullerton.</li>
      <li>[01/2026] Presented my EV wireless charging optimization and ASO efficacy modeling work at the <a href="https://ieee-ccwc.org/">IEEE 16th Annual Computing and Communication Workshop and Conference (CCWC) 2026</a>. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7414165378937044993/">post</a></li>
      <li>[12/2025] Invited to serve as a reviewer for <a href="https://www.grss-ieee.org/publications/transactions-on-geoscience-remote-sensing/"><em>IEEE Transactions on Geoscience and Remote Sensing</em> (TGRS)</a>.</li>
      <li>[11/2025] Invited guest speaker at The 6th Workshop on Enhanced Open Networked Airborne Computing Platform, University of Nevada-Reno, NV. Topic: <em>HyperEAST: A Lightweight Spectral-Spatial Transformer for UAV-Based Hyperspectral Image Classification</em>. <a href="https://www.linkedin.com/feed/update/urn:li:activity:7397103743579688960/">post</a></li>
      <li>[08/2025] HyperEAST was published in <a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS).</li>
    </ul>
  </section>

  <section class="roger-section">
    <h2>Selected Research</h2>

    <article class="research-card">
      <button class="research-figure" type="button" data-full="/images/research-hypermode.png?v={{ site.asset_version }}" aria-label="Open HyperMODE figure">
        <img src="/images/research-hypermode.png?v={{ site.asset_version }}" alt="HyperMODE hyperspectral modeling thumbnail">
      </button>
      <div>
        <h3>HyperMODE: A Continuous-Depth Spectral-Spatial Modeling Framework with Mamba and Neural Ordinary Differential Equations for Hyperspectral Image Classification</h3>
        <p class="research-authors"><strong>Jialin Tang</strong>, Yunduan Lou, Yanhui Guo, Yu Bai</p>
        <p class="research-venue"><a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS), 2026, Volume 19</p>
        <p class="research-links"><a href="https://doi.org/10.1109/JSTARS.2026.3705708">paper</a> / <a href="https://github.com/JaylenTang/HyperMODE">code</a></p>
        <p class="research-note">Continuous-depth spectral-spatial modeling that combines sequence modeling with neural ODE dynamics.</p>
      </div>
    </article>

    <article class="research-card">
      <button class="research-figure" type="button" data-full="/images/research-hypereast.png?v={{ site.asset_version }}" aria-label="Open HyperEAST figure">
        <img src="/images/research-hypereast.png?v={{ site.asset_version }}" alt="HyperEAST hyperspectral image classification thumbnail">
      </button>
      <div>
        <h3>HyperEAST: An Enhanced Attention-Based Spectral-Spatial Transformer with Self-Supervised Pretraining for Hyperspectral Image Classification</h3>
        <p class="research-authors"><strong>Jialin Tang</strong>, Nan Ma, Chen Jia, Rui Tian, Yanhui Guo</p>
        <p class="research-venue"><a href="https://www.grss-ieee.org/publications/journal-of-selected-topics-in-applied-earth-observations-and-remote-sensing/"><em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em></a> (JSTARS), 2025, Volume 18</p>
        <p class="research-links"><a href="https://ieeexplore.ieee.org/document/11129658">paper</a> / <a href="https://github.com/JaylenTang/HyperEAST">code</a></p>
        <p class="research-note">Self-supervised spectral-spatial representation learning for hyperspectral image classification.</p>
      </div>
    </article>

    <article class="research-card">
      <button class="research-figure" type="button" data-full="/images/research-mas-llava.png?v={{ site.asset_version }}" aria-label="Open MAS-LLaVA figure">
        <img src="/images/research-mas-llava.png?v={{ site.asset_version }}" alt="MAS-LLaVA video sampling thumbnail">
      </button>
      <div>
        <h3>MAS-LLaVA: Motion-Aware Adaptive Sampling for Training-Free Video Large Language Models</h3>
        <p class="research-authors"><strong>Jialin Tang</strong>, Yu Bai</p>
        <p class="research-venue"><a href="https://acdsa.org/2026/">IEEE International Conference on Artificial Intelligence, Computer, Data Sciences and Applications (ACDSA)</a>, 2026</p>
        <p class="research-links"><a href="https://ieeexplore.ieee.org/document/11468028">paper</a></p>
        <p class="research-note">Motion-aware token and frame sampling for efficient training-free video large language model inference.</p>
      </div>
    </article>

  </section>

  <section class="roger-section">
    <h2>Services</h2>
    <div class="roger-service-group">
      <h3>Invited Reviewer</h3>
      <ul class="roger-services">
        <li>Reviewer for the <a href="https://neurips.cc/">Conference on Neural Information Processing Systems (NeurIPS) 2026</a>.</li>
      </ul>
    </div>
  </section>
</main>

<div class="research-zoom" data-research-zoom hidden role="dialog" aria-modal="true" aria-label="Research figure preview">
  <button class="research-zoom-close" type="button">Close</button>
  <img alt="">
</div>

<script>
  (function () {
    var emailTarget = document.getElementById("email");
    var emailButton = document.querySelector("[data-unscramble-email]");

    if (emailTarget && emailButton) {
      emailButton.addEventListener("click", function () {
        var encoded = [125, 46, 109, 55, 79, 99, 112, 76, 46, 69, 126, 105, 105, 63, 83];
        var key = [23, 71, 12, 91, 38];
        var email = encoded.map(function (value, index) {
          return String.fromCharCode(value ^ key[index % key.length]);
        }).join("");
        var link = document.createElement("a");
        link.href = "mailto:" + email;
        link.textContent = email;
        emailTarget.textContent = "";
        emailTarget.appendChild(link);
        emailButton.remove();
      });
    }

    var modal = document.querySelector("[data-research-zoom]");
    if (!modal) return;

    var modalImage = modal.querySelector("img");
    var closeButton = modal.querySelector(".research-zoom-close");

    function closeModal() {
      modal.hidden = true;
      modalImage.removeAttribute("src");
      document.body.classList.remove("research-zoom-open");
    }

    document.querySelectorAll(".research-figure").forEach(function (button) {
      button.addEventListener("click", function () {
        var image = button.querySelector("img");
        modalImage.src = button.getAttribute("data-full");
        modalImage.alt = image ? image.alt : "";
        modal.hidden = false;
        document.body.classList.add("research-zoom-open");
        closeButton.focus({ preventScroll: true });
      });
    });

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }());
</script>

(() => {
  // A measurement ID identifies the Analytics property; it is not a secret key.
  const analytics = document.createElement("script");
  analytics.async = true;
  analytics.src = "https://www.googletagmanager.com/gtag/js?id=G-5NLJTLQR4S";
  document.head.appendChild(analytics);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "G-5NLJTLQR4S");
  const siteFooter = document.querySelector("footer");
  if (siteFooter) {
    const analyticsNotice = document.createElement("small");
    analyticsNotice.textContent = "This site uses Google Analytics to understand visits.";
    siteFooter.appendChild(analyticsNotice);
  }

  const doc = document.documentElement;
  const progress = document.querySelector("#reading-progress");
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numberMetrics = [...document.querySelectorAll(".chapter-points b, .detail-facts b")];
  const rollNumber = (element) => {
    if (!motionAllowed || element.dataset.rolled === "true") return;
    const original = element.dataset.rollTarget || element.textContent.trim();
    const numberPattern = /[\d,]+(?:\.\d+)?/g;
    const rawNumbers = original.match(numberPattern);
    if (!rawNumbers) return;
    const targets = rawNumbers.map((value) => Number(value.replaceAll(",", "")));
    if (targets.some((value) => !Number.isFinite(value))) return;
    const parts = original.split(numberPattern);
    element.dataset.rollTarget = original;
    element.dataset.rolled = "true";
    const formats = rawNumbers.map((rawNumber) => {
      const decimals = (rawNumber.split(".")[1] || "").length;
      return (number) => {
      const fixed = number.toFixed(decimals);
      const [whole, fraction] = fixed.split(".");
      return `${Number(whole).toLocaleString("en-US")}${fraction ? `.${fraction}` : ""}`;
      };
    });
    const start = performance.now();
    const render = (progress) => parts.map((part, index) => `${part}${index < targets.length ? formats[index](targets[index] * progress) : ""}`).join("");
    element.textContent = render(0);
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 200);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = render(eased);
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = original;
    };
    requestAnimationFrame(step);
  };

  const metricsByChapter = new Map();
  numberMetrics.forEach((metric) => {
    const chapter = metric.closest(".chapter");
    if (!chapter) return;
    if (!metricsByChapter.has(chapter)) metricsByChapter.set(chapter, []);
    metricsByChapter.get(chapter).push(metric);
  });

  const loadingImages = [...document.querySelectorAll(".detail-photo img, .story-visual img, .frc-season-logo")];
  loadingImages.forEach((image) => {
    const container = image.closest(".detail-photo, .scene-art, .frc-season-heading");
    if (!container) return;
    const finishLoading = () => container.classList.remove("is-image-loading");
    container.classList.add("is-image-loading");
    image.addEventListener("load", finishLoading, { once: true });
    image.addEventListener("error", finishLoading, { once: true });
    if (image.complete) finishLoading();
  });

  let ticking = false;
  const updateProgress = () => {
    const scrollable = doc.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    doc.style.setProperty("--progress", String(Math.max(0, Math.min(1, amount))));
    if (progress) progress.style.transform = `scaleX(${amount})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  const visual = document.querySelector("#story-visual");
  const chapters = [...document.querySelectorAll(".chapter")];
  const label = document.querySelector("#scene-label");
  const index = document.querySelector(".scene-index");
  const visualProgress = document.querySelector("#visual-progress");
  if (visual && chapters.length) {
    const setActive = (chapter) => {
      chapters.forEach((item) => item.classList.toggle("is-active", item === chapter));
      (metricsByChapter.get(chapter) || []).forEach(rollNumber);
      visual.dataset.scene = chapter.dataset.scene;
      if (label) label.textContent = chapter.dataset.label;
      if (index) index.innerHTML = `${chapter.dataset.index} <i>/ ${String(chapters.length).padStart(2, "0")}</i>`;
      const activeIndex = chapters.indexOf(chapter);
      if (visualProgress) visualProgress.style.transform = `translateX(${activeIndex * 100}%)`;
    };

    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target);
      }, { rootMargin: "-38% 0px -38% 0px", threshold: [0, .2, .45, .7, 1] });
      chapters.forEach((chapter) => observer.observe(chapter));
    } else {
      chapters.forEach((chapter) => chapter.classList.add("is-active"));
    }

    chapters.forEach((chapter) => {
      chapter.addEventListener("focusin", () => setActive(chapter));
    });
  }

  const factMetrics = [...document.querySelectorAll(".detail-facts b")];
  if (factMetrics.length && motionAllowed && "IntersectionObserver" in window) {
    const factObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        rollNumber(entry.target);
        factObserver.unobserve(entry.target);
      });
    }, { threshold: 0.65 });
    factMetrics.forEach((metric) => factObserver.observe(metric));
  } else {
    factMetrics.forEach(rollNumber);
  }

  const outreachStory = document.querySelector(".outreach-story-layout");
  if (outreachStory && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    outreachStory.classList.add("is-scroll-reveal");
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          storyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    storyObserver.observe(outreachStory);
  }
  const munPhotos = [...document.querySelectorAll(".mun-gallery .detail-photo")];
  if (munPhotos.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    munPhotos.forEach((photo, index) => {
      photo.style.setProperty("--photo-reveal-delay", `${Math.min(index, 5) * 85}ms`);
      photo.classList.add("is-scroll-reveal");
    });
    const photoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          photoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    munPhotos.forEach((photo) => photoObserver.observe(photo));
  }
  const heroArt = document.querySelector(".hero-art");
  if (heroArt && window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / window.innerHeight - .5) * 2;
      heroArt.style.setProperty("--pointer-x", `${x * 4}px`);
      heroArt.style.setProperty("--pointer-y", `${y * 4}px`);
    }, { passive: true });
    heroArt.addEventListener("pointerleave", () => {
      heroArt.style.setProperty("--pointer-x", "0px");
      heroArt.style.setProperty("--pointer-y", "0px");
    });
  }

})();

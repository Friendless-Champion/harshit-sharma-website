(() => {
  const nav = document.querySelector(".gear-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll(".gear-link")];
  const status = nav.querySelector(".gear-nav-status");
  if (status) status.setAttribute("aria-live", "off");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const labels = ["DESIGN LEAD", "ADVOCACY", "ROBOTICS OUTREACH"];

  for (const teeth of nav.querySelectorAll(".gear-teeth")) {
    const count = Number(teeth.dataset.teeth) || 16;
    const points = [];
    for (let tooth = 0; tooth < count; tooth += 1) {
      for (const [step, radius] of [[0, 43], [1, 43], [2, 50], [3, 50]]) {
        const angle = -Math.PI / 2 + (tooth * 4 + step) * (Math.PI * 2) / (count * 4);
        points.push(`${(50 + Math.cos(angle) * radius).toFixed(2)},${(50 + Math.sin(angle) * radius).toFixed(2)}`);
      }
    }
    teeth.setAttribute("d", `M${points.join(" L")} Z`);
  }

  const currentFile = window.location.pathname.split("/").pop();
  const currentLink = links.find((link) => link.getAttribute("href") === currentFile);
  if (currentLink) currentLink.setAttribute("aria-current", "page");

  let activeIndex = Math.max(0, links.indexOf(currentLink));
  let timer;
  const spotlight = (index) => {
    activeIndex = index % links.length;
    links.forEach((link, linkIndex) => link.classList.toggle("is-spotlight", linkIndex === activeIndex));
    if (status) status.textContent = `16:12 · 4:3  /  ${String(activeIndex + 1).padStart(2, "0")} / 03 · ${labels[activeIndex]}`;
  };

  spotlight(activeIndex);
  if (!prefersReducedMotion.matches) {
    timer = window.setInterval(() => spotlight(activeIndex + 1), 3600);
  }
  prefersReducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      window.clearInterval(timer);
      spotlight(Math.max(0, links.indexOf(currentLink)));
    } else {
      timer = window.setInterval(() => spotlight(activeIndex + 1), 3600);
    }
  });
})();

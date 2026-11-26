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
    const hub = teeth.parentElement.querySelector(".gear-hub");
    const radius = Number(hub?.getAttribute("r")) || 24;
    const hole = `M${50-radius},50 a${radius},${radius} 0 1,0 ${radius*2},0 a${radius},${radius} 0 1,0 ${-radius*2},0 Z`;
    teeth.setAttribute("fill-rule", "evenodd");
    teeth.setAttribute("d", `M${points.join(" L")} Z ${hole}`);
  }

  const currentFile = window.location.pathname.split("/").pop();
  const currentLink = links.find((link) => link.getAttribute("href") === currentFile);
  if (currentLink) currentLink.setAttribute("aria-current", "page");

  // Only the current page is highlighted; the gears retain their own motion.
  links.forEach((link) => link.classList.toggle("is-spotlight", link === currentLink));
})();

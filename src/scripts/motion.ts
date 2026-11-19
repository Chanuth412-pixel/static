// One-time motion: sections fade in as they enter the viewport, and each illustration
// ([data-play]) plays its sequence once. With reduced motion everything shows its final state.
export function initPortfolioMotion() {
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>(".site-header");

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  root.classList.add("js-anim");

  // Stagger the direct children of grids/lists inside revealed sections.
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--i", String(index));
    });
  });

  const once = (selector: string, className: string, threshold: number) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      });
    }, { threshold, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(selector).forEach((element) => observer.observe(element));
  };

  once(".reveal", "is-visible", 0.08);
  once("[data-play]", "is-playing", 0.4);
}

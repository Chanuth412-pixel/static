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

  countUp();

  if (window.matchMedia("(pointer: fine)").matches) {
    spotlight();
    tilt();
  }
}

// Numbers in the credibility strip count up once when they come into view.
function countUp() {
  const counters = document.querySelectorAll<HTMLElement>("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const element = entry.target as HTMLElement;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix ?? "";
      const started = performance.now();
      const duration = 900 + target * 60;
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(eased * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      element.textContent = `0${suffix}`;
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => observer.observe(counter));
}

// Cards light up around the cursor ([data-spotlight]).
function spotlight() {
  document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--sy", `${event.clientY - bounds.top}px`);
    });
  });
}

// The hero console leans slightly towards the cursor ([data-tilt]).
function tilt() {
  const element = document.querySelector<HTMLElement>("[data-tilt]");
  const area = element?.closest<HTMLElement>(".hero");
  if (!element || !area) return;

  let frame = 0;
  area.addEventListener("pointermove", (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - (bounds.left + bounds.width / 2)) / window.innerWidth;
      const y = (event.clientY - (bounds.top + bounds.height / 2)) / window.innerHeight;
      element.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      element.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    });
  });
  area.addEventListener("pointerleave", () => {
    element.style.setProperty("--ry", "0deg");
    element.style.setProperty("--rx", "0deg");
  });
}

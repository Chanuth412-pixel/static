
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {

    const context = gsap.context(() => {

      // HERO TEXT
      gsap.timeline({
        defaults: { ease: "power3.out" },
      })
        .from(".hero-eyebrow", {
          y: 15,
          autoAlpha: 0,
          duration: 0.5,
        })
        .from(".hero-title", {
          y: 35,
          autoAlpha: 0,
          duration: 0.85,
        }, "-=0.2")
        .from(".hero-description", {
          y: 18,
          autoAlpha: 0,
          duration: 0.6,
        }, "-=0.4")
        .from(".hero-actions", {
          y: 12,
          autoAlpha: 0,
          duration: 0.5,
        }, "-=0.3");

      // ENGINEERING MAP
      gsap.from(".scene-core", {
        scale: 0.7,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.5)",
        delay: 0.3,
      });

      gsap.from(".scene-node", {
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.13,
        ease: "power3.out",
        delay: 0.5,
      });

      // SCROLL REVEAL HELPER
      function reveal(
        selector: string,
        trigger: string,
        stagger = 0
      ) {
        const elements =
          gsap.utils.toArray<HTMLElement>(selector);

        if (!elements.length) return;

        gsap.from(elements, {
          y: 30,
          autoAlpha: 0,
          duration: 0.75,
          stagger,
          ease: "power2.out",

          scrollTrigger: {
            trigger,
            start: "top 85%",
            once: true,
          },
        });
      }

      reveal(".proof-item", ".proof-strip", 0.1);
      reveal(".intro-copy", ".intro-section");
      reveal(".project-card", ".project-grid", 0.12);
      reveal(".contribution-row", ".contribution-list", 0.12);
      reveal(".skill-card", ".skills-grid", 0.1);
      reveal(".achievement-card", ".achievement-grid", 0.12);

      // CONTACT
      gsap.from(".contact-panel", {
        y: 35,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".contact-panel",
          start: "top 85%",
          once: true,
        },
      });

    }, document.body);

    window.addEventListener(
      "load",
      () => ScrollTrigger.refresh(),
      { once: true }
    );

    return () => context.revert();
  });

  return () => media.revert();
}

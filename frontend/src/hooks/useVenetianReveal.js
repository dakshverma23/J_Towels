import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export function useVenetianReveal(deps = []) {
  const rootRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".ven-reveal").forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: i * 0.04,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
      });

      gsap.utils.toArray(".ven-parallax-img").forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.15, y: 40 },
          {
            scale: 1,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              scrub: 1.2,
              start: "top bottom",
              end: "bottom top"
            }
          }
        );
      });

      gsap.utils.toArray(".ven-line-reveal").forEach((el) => {
        const lines = el.querySelectorAll(".ven-line");
        gsap.fromTo(
          lines,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, deps);

  return rootRef;
}

export function useHeroEntrance(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const lines = ref.current.querySelectorAll(".hero-line");
    const extras = ref.current.querySelectorAll(".hero-fade");
    gsap.fromTo(lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.2, stagger: 0.14, ease: "power4.out", delay: 0.2 });
    gsap.fromTo(extras, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.7 });
  }, [ref]);
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const {
    selector,
    y = 40,
    duration = 0.9,
    start = 'top 80%',
    stagger = 0.08,
  } = options;

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const targets = selector ? el.querySelectorAll(selector) : [el];

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [duration, selector, stagger, start, y]);

  return ref;
}

export { gsap, ScrollTrigger };

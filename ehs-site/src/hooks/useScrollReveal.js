import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const targets = options.selector ? el.querySelectorAll(options.selector) : [el];

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: options.y ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.9,
        ease: 'power3.out',
        stagger: options.stagger ?? 0.08,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };

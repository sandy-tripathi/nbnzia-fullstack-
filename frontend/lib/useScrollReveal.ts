'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

function ensureRegistered() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function useScrollReveal() {
  useEffect(() => {
    ensureRegistered();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]');
      groups.forEach((group) => {
        const children = group.querySelectorAll('[data-reveal-item]');
        gsap.fromTo(
          children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);
}

export function useCardStackScroll(selector: string, deps: unknown[] = []) {
  useEffect(() => {
    ensureRegistered();

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(selector);

      slides.forEach((slide, i) => {
        if (i === slides.length - 1) return;

        ScrollTrigger.create({
          trigger: slide,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const rotate = self.progress * -3;
            const scale = 1 - self.progress * 0.04;
            gsap.set(slide, {
              rotate,
              scale,
              transformOrigin: 'center top',
            });
          },
        });
      });
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...deps]);
}
'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/lib/useScrollReveal';
import LoadingScreen from './LoadingScreen';
import Navbar       from './Navbar';
import Hero         from './Hero';
import StatsBanner  from './StatsBanner';
import About        from './About';
import InnerCTA     from './InnerCTA';
import SectionDivider from './SectionDivider';
import Work         from './Work';
import Process      from './Process';
import Services     from './Services';
import Footer       from './Footer';

const LOADER_DURATION = 2400;
const LOADER_FADE     = 600;

export default function PageClient() {
  const [phase, setPhase] = useState<'loading' | 'hiding' | 'done'>('loading');
  useScrollReveal();

  // Loader timing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hiding'), LOADER_DURATION);
    const t2 = setTimeout(() => setPhase('done'),   LOADER_DURATION + LOADER_FADE);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Lenis smooth scroll, synced with GSAP ScrollTrigger
  useEffect(() => {
    if (phase !== 'done') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });

    // Keep ScrollTrigger's calculations in sync with Lenis's virtual scroll
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(refreshTimer);
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, [phase]);

  return (
    <>
      {phase !== 'done' && <LoadingScreen hiding={phase === 'hiding'} />}

      <div
        style={{
          opacity: phase === 'done' ? 1 : 0,
          transition: phase === 'done' ? 'opacity 0.5s ease' : 'none',
        }}
      >
        <Navbar />
        <Hero />
        <StatsBanner />
        <About />
        <InnerCTA />

        <SectionDivider
          label="WORK"
          curvedText="Every trick leaves evidence. Here is what remains."
        />
        <Work />

        <SectionDivider
          label="PROCESS"
          curvedText="Behind the illusion there are three acts."
        />
        <Process />

        <Services />

        <Footer />
      </div>
    </>
  );
}
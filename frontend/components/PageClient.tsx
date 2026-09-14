'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
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

  // Loader timing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hiding'), LOADER_DURATION);
    const t2 = setTimeout(() => setPhase('done'),   LOADER_DURATION + LOADER_FADE);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Lenis smooth scroll (init after load completes so it doesn't fight the loader)
  useEffect(() => {
    if (phase !== 'done') return;

    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
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

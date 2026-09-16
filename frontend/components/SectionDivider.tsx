'use client';

import { useEffect, useRef } from 'react';

interface SectionDividerProps {
  label: string;
  curvedText: string;
  dark?: boolean;
}

export default function SectionDivider({ label, curvedText, dark = false }: SectionDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    const textPathEl = textPathRef.current;
    if (!svgEl || !textPathEl) return;

    svgEl.style.transform = 'translate(0, 100%) scale(1.1)';

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) { ticking = false; return; }

        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const totalScroll = container.offsetHeight - vh;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        // Vertical slide-in (unchanged)
        const yPercent = 100 - progress * 160;
        const scale = 1.1 - progress * 0.1;
        svgEl.style.transform = `translate(0, ${yPercent}%) scale(${scale})`;

        // NEW: horizontal slide along the curve — text moves from right (90%) to left (10%)
        const startOffset = 95 - progress * 90; // 95% → 5%
        textPathEl.setAttribute('startOffset', `${startOffset}%`);

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pathId = `divider-path-${label.replace(/\s/g, '')}`;
  const bg = dark ? '#0f0f0f' : 'var(--bg)';
  const textColor = dark ? '#f5f2f3' : 'var(--text)';

  return (
    <div
      className="mwg032"
      style={{ background: bg, color: textColor, position: 'relative' }}
    >
      <div className="mwg032-pin-height" ref={containerRef}>
        <div className="mwg032-container">
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              fontSize: 'clamp(10px, 0.85vw, 13px)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 400,
              color: dark ? 'rgba(245,242,243,0.5)' : 'rgba(31,31,31,0.4)',
            }}
          >
            <span>{'{'}</span>
            <span>{label}</span>
            <span>{'·'}</span>
            <span>{label}</span>
            <span>{'}'}</span>
          </div>

          <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
            <svg
              ref={svgRef}
              width="1516"
              height="300"
              viewBox="0 -208 1516 300"
              fill="none"
              overflow="visible"
              style={{
                width: '100%',
                height: 'auto',
                overflow: 'visible',
                display: 'block',
                willChange: 'transform',
              }}
            >
              <path
                d="M -700 252 C -470 200 -230 145 0 92.0674 C 528.5 -28.9327 977.5 -32.4328 1516.5 92.0674 C 1745 145 1980 200 2216 252"
                fill="none"
                stroke="none"
                id={pathId}
              />
              <text>
                <textPath
                  ref={textPathRef}
                  startOffset="50%"
                  textAnchor="middle"
                  href={`#${pathId}`}
                  style={{
                    fill: 'currentColor',
                    fontSize: '9vw',
                    fontFamily: 'Bdogrotesk, Arial, sans-serif',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {curvedText}
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
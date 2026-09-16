'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, ApiRequestError } from '@/lib/api';
import { useCardStackScroll } from '@/lib/useScrollReveal';
import type { Project } from '@/lib/types';



function WorkSkeleton() {
  return (
    <section style={{ background: '#fff' }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            height: '100vh',
            background: i % 2 ? '#f4f4f4' : '#ececec',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1440,
              margin: '0 auto',
              padding: '5rem 1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ width: '40%', height: 24, background: '#ddd', borderRadius: 4, marginBottom: '2rem' }} />
              <div style={{ width: '100%', height: 14, background: '#ddd', borderRadius: 4, marginBottom: '0.75rem' }} />
              <div style={{ width: '90%', height: 14, background: '#ddd', borderRadius: 4, marginBottom: '0.75rem' }} />
              <div style={{ width: '70%', height: 14, background: '#ddd', borderRadius: 4 }} />
            </div>
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 12, background: '#ddd' }} />
          </div>
        </div>
      ))}
    </section>
  );
}

export default function Work() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  useCardStackScroll('.case-slide', [projects]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    api
      .get<Project[]>('/api/projects')
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ApiRequestError ? err.message : 'Failed to load work.';
        setError(message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Loading state
  if (projects === null && !error) {
    return <WorkSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <section id="work" style={{ background: '#fff', padding: '6rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(31,31,31,0.6)', fontSize: 16 }}>Couldn&apos;t load recent work right now. ({error})</p>
      </section>
    );
  }

  // Empty state
  if (projects && projects.length === 0) {
    return (
      <section id="work" style={{ background: '#fff', padding: '6rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(31,31,31,0.5)', fontSize: 16 }}>New case studies are on the way — check back soon.</p>
      </section>
    );
  }

  return (
    <section id="work" style={{ position: 'relative', background: '#fff' }}>
      {(projects as Project[]).map((c, i) => {
        const textColor = c.textDark ? 'rgba(31,31,31,0.9)' : 'rgba(245,242,243,0.92)';
        const mutedColor = c.textDark ? 'rgba(31,31,31,0.55)' : 'rgba(245,242,243,0.55)';
        const borderColor = c.textDark ? 'rgba(31,31,31,0.15)' : 'rgba(245,242,243,0.2)';

        return (
          <div
            key={c._id}
            className="case-slide"
            data-reveal
            style={{
              height: '100vh',
              background: c.bg,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderTop: i > 0 ? `1px solid ${borderColor}` : 'none',
            }}
          >
            {/* Box shadow layer */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 120px rgba(0,0,0,0.08)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <div
              style={{
                width: '100%',
                maxWidth: 1440,
                margin: '0 auto',
                padding: '5rem 1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Left: content */}
              <div>
                {/* Hat: name + number */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    borderBottom: `1px solid ${borderColor}`,
                    paddingBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(16px, 1.4vw, 24px)',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: textColor,
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(11px, 0.85vw, 13px)',
                      color: mutedColor,
                      letterSpacing: '0.06em',
                    }}
                  >
                    ({String(i + 1).padStart(2, '0')})
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 'clamp(14px, 1.1vw, 18px)',
                    lineHeight: 1.6,
                    color: mutedColor,
                    marginBottom: '2.5rem',
                    maxWidth: '52ch',
                  }}
                >
                  {c.description}
                </p>

                {/* Visit link */}
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 'clamp(10px, 0.82vw, 12px)',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: textColor,
                    borderBottom: `1px solid ${borderColor}`,
                    paddingBottom: '2px',
                  }}
                >
                  Visit Website ↗
                </a>
              </div>

              {/* Right: image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mobile: stack */}
            <style>{`
              @media (max-width: 767px) {
                .case-slide > div > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
              }
            `}</style>
          </div>
        );
      })}
    </section>
  );
}

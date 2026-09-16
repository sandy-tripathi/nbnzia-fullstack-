'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, ApiRequestError } from '@/lib/api';
import type { Service } from '@/lib/types';

function ServicesSkeleton() {
  return (
    <section style={{ background: '#0f0f0f', padding: '6rem 0' }}>
      <div className="u-container">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderTop: '1px solid #333', padding: '1.4rem 0' }}>
            <div style={{ width: '35%', height: 28, background: '#2a2a2a', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Services() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    api
      .get<Service[]>('/api/services')
      .then((data) => {
        if (!cancelled) setServices(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ApiRequestError ? err.message : 'Failed to load services.';
        setError(message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (services === null && !error) {
    return <ServicesSkeleton />;
  }

  return (
    <section
      id="services"
      className="mwg035"
      style={{
        color: '#f5f2f3',
        background: '#0f0f0f',
        borderBottom: '1px solid #000',
        padding: '6rem 0',
        position: 'relative',
      }}
    >
      <div className="u-container">
        {/* Section label marquee */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            fontSize: 'clamp(10px, 0.85vw, 13px)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 400,
            color: 'rgba(245,242,243,0.5)',
          }}
        >
          <span>{'{ WHAT I DO '}</span>
          <span>{'♥'}</span>
          <span>{'WHAT I DO }'}</span>
        </div>

        {error && (
          <p style={{ color: 'rgba(245,242,243,0.5)', fontSize: 15, padding: '2rem 0' }}>
            Couldn&apos;t load services right now. ({error})
          </p>
        )}

        {!error && services && services.length === 0 && (
          <p style={{ color: 'rgba(245,242,243,0.5)', fontSize: 15, padding: '2rem 0' }}>
            Services are being updated — check back soon.
          </p>
        )}

        {!error && services && services.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderBottom: '1px solid #333', position: 'relative' }} data-reveal-group>
            {services.map((svc, i) => {
              const isOpen = openIndex === i;
              return (
                <li
                  key={svc._id}
                  className="mwg035-li"
                  data-revea-item
                  style={{
                    borderTop: '1px solid #333',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '0 0',
                  }}
                >
                  {/* Accordion trigger */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.4rem 0',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      gap: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                      <span
                        style={{
                          fontSize: 'clamp(10px, 0.8vw, 12px)',
                          letterSpacing: '0.08em',
                          color: 'rgba(245,242,243,0.4)',
                          fontWeight: 400,
                          flexShrink: 0,
                        }}
                      >
                        [ {String(i + 1).padStart(2, '0')} ]
                      </span>
                      <span
                        style={{
                          fontSize: 'clamp(20px, 2.4vw, 40px)',
                          fontWeight: 500,
                          letterSpacing: '-0.02em',
                          lineHeight: 1.05,
                        }}
                      >
                        {svc.title}
                      </span>
                    </div>
                    {/* Toggle icon */}
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '1px solid rgba(245,242,243,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.35s ease',
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1v9M1 5.5h9" stroke="rgba(245,242,243,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>

                  {/* Accordion body */}
                  <div
                    style={{
                      maxHeight: isOpen ? 500 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '3rem',
                        paddingBottom: '2.5rem',
                        paddingLeft: 'calc(clamp(10px,0.8vw,12px)*3 + 1.5rem + 3rem)',
                      }}
                    >
                      {/* Description */}
                      <p
                        style={{
                          flex: 1,
                          fontSize: 'clamp(14px, 1.05vw, 17px)',
                          lineHeight: 1.65,
                          color: 'rgba(245,242,243,0.6)',
                          maxWidth: 520,
                        }}
                      >
                        {svc.description}
                      </p>

                      {/* Image */}
                      <div
                        style={{
                          width: 'clamp(180px, 20vw, 320px)',
                          aspectRatio: '4/3',
                          borderRadius: 10,
                          overflow: 'hidden',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={svc.imageUrl}
                          alt={svc.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

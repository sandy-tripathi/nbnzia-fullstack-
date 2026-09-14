'use client';

import { useState, useEffect, FormEvent } from 'react';
import { api, ApiRequestError } from '@/lib/api';

const EMOJIS = ['🎩', '🃏', '✨', '⭐', '🌟', '💫', '🎭', '🎪', '🔮', '🪄'];

interface EmojiItem {
  id: number;
  char: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export default function Footer() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [msg, setMsg]           = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emojis, setEmojis]     = useState<EmojiItem[]>([]);

  useEffect(() => {
    setEmojis(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        char: EMOJIS[i % EMOJIS.length],
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 7 + Math.random() * 6,
        size: 14 + Math.random() * 22,
        opacity: 0.1 + Math.random() * 0.3,
      }))
    );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !msg.trim()) {
      setFormError('Please fill in your name, email, and a short message.');
      return;
    }
    if (msg.trim().length < 10) {
      setFormError('Message should be at least 10 characters — give me a bit more to go on.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/contact', { name: name.trim(), email: email.trim(), message: msg.trim() });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : 'Something went wrong sending your message. Please try again.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      id="contact"
      className="mwg044"
      style={{ background: '#0f0f0f', color: '#f5f2f3', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Emoji rain ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 90% 55% at 50% 0%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 55% at 50% 0%, black 20%, transparent 80%)',
        }}
      >
        <style>{`
          @keyframes emoji-fall {
            0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
            8%   { opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translateY(110vh) rotate(420deg); opacity: 0; }
          }
        `}</style>
        {emojis.map(e => (
          <span
            key={e.id}
            style={{
              position: 'absolute',
              top: 0,
              left: `${e.x}%`,
              fontSize: e.size,
              opacity: e.opacity,
              animation: `emoji-fall ${e.duration}s linear ${e.delay}s infinite`,
              userSelect: 'none',
            }}
          >
            {e.char}
          </span>
        ))}
      </div>

      {/* ── CTA section ────────────────────────────────────────── */}
      <section style={{ padding: '9rem 0 6rem', position: 'relative', zIndex: 1 }}>
        <div className="u-container">
          {/* Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: 'clamp(10px, 0.85vw, 13px)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,243,0.38)',
              marginBottom: '3.5rem',
            }}
          >
            <span>{'{'}</span>
            <span>LET&apos;S TALK</span>
            <span>&middot;</span>
            <span>LET&apos;S TALK</span>
            <span>{'}'}</span>
          </div>

          {/* Grid: heading | form+photos */}
          <div className="footer-grid">
            {/* Big heading */}
            <h2
              style={{
                fontSize: 'clamp(56px, 8.5vw, 130px)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                lineHeight: 0.92,
                textTransform: 'uppercase',
                color: '#f5f2f3',
                margin: 0,
              }}
            >
              READY
              <br />
              FOR YOUR
              <br />
              PRESTIGE
              <br />
              MOMENT?
            </h2>

            {/* Right: photo cards + form */}
            <div>
              {/* Polaroid-style photo cards */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '3rem',
                  alignItems: 'flex-start',
                }}
              >
                {[
                  { rotate: -4, label: 'YN ✦' },
                  { rotate: 2,  label: 'Magic ✦' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="mwg044-photo"
                    style={{
                      background: 'rgba(245,242,243,0.06)',
                      borderRadius: '0.5rem',
                      width: 'clamp(100px, 10vw, 155px)',
                      aspectRatio: '3/4',
                      transform: `rotate(${card.rotate}deg)`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '0.5rem',
                      border: '1px solid rgba(245,242,243,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        color: 'rgba(245,242,243,0.28)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              {submitted ? (
                <p style={{ fontSize: 'clamp(16px, 1.5vw, 24px)', fontWeight: 400, color: 'rgba(245,242,243,0.7)' }}>
                  Thanks! I&apos;ll be in touch soon. ✦
                </p>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { type: 'text',  placeholder: 'Name',    value: name,  onChange: (v: string) => setName(v)  },
                    { type: 'email', placeholder: 'Email',   value: email, onChange: (v: string) => setEmail(v) },
                    { type: 'text',  placeholder: 'Message', value: msg,   onChange: (v: string) => setMsg(v)   },
                  ].map(field => (
                    <input
                      key={field.placeholder}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      required
                      disabled={submitting}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(245,242,243,0.15)',
                        color: '#f5f2f3',
                        fontFamily: 'Bdogrotesk, Arial, sans-serif',
                        fontSize: 'clamp(13px, 1vw, 16px)',
                        padding: '1rem 0',
                        outline: 'none',
                        width: '100%',
                        opacity: submitting ? 0.6 : 1,
                      }}
                    />
                  ))}

                  {formError && (
                    <p style={{ color: '#ff8a8a', fontSize: 13, marginTop: '0.85rem' }}>{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '1.5rem',
                      background: 'transparent',
                      border: '1px solid rgba(245,242,243,0.22)',
                      borderRadius: '100px',
                      color: '#f5f2f3',
                      fontFamily: 'Bdogrotesk, Arial, sans-serif',
                      fontSize: 'clamp(9px, 0.78vw, 11px)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      padding: '0.8rem 1.8rem',
                      cursor: submitting ? 'default' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {submitting ? 'Sending…' : 'Submit ↗'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive grid */}
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: flex-start;
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(245,242,243,0.08)',
          padding: '1.25rem 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="u-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: 'clamp(9px, 0.75vw, 11px)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,243,0.35)',
          }}
        >
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="https://www.instagram.com/nbnzia/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Follow
            </a>
            <a href="mailto:hey@nbnzia.com" style={{ color: 'inherit', textDecoration: 'none' }}>
              Write
            </a>
          </div>
          <a
            href="mailto:hey@nbnzia.com"
            style={{ color: 'rgba(245,242,243,0.6)', textDecoration: 'none' }}
          >
            HEY@NBNZIA.COM
          </a>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>© Yevhenii Nebenzia, 2026</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work'     },
  { label: 'Process',  href: '#process'  },
];

function LogoSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 254 48" fill="none" style={{ display: 'block' }}>
      <g clipPath="url(#nbn-clip)">
        <g>
          <path d="M206.285 48L225.446 0H234.532L253.693 48H245.396L232.359 14.3539C231.876 13.1248 231.394 11.8738 230.911 10.6008C230.472 9.28395 229.989 7.83539 229.462 6.25515H230.384C229.857 7.83539 229.352 9.28395 228.87 10.6008C228.431 11.8738 227.992 13.1248 227.553 14.3539L214.384 48H206.285ZM217.939 36.3457L220.573 29.6955H239.207L241.775 36.3457H217.939Z" fill="currentColor"/>
          <path d="M201.253 48H193.418V0H201.253V48Z" fill="currentColor"/>
          <path d="M146.784 48V41.6132L175.492 6.91358H147.706V0H186.356V6.25515L157.319 41.0206H187.344V48H146.784Z" fill="currentColor"/>
          <path d="M98.7979 48V0H108.938L133.893 38.1893H133.037V0H140.741V48H131.523L105.58 8.7572H106.568V48H98.7979Z" fill="currentColor"/>
          <path d="M52.0684 48V0H74.9819C79.7666 0 83.4538 1.14129 86.0437 3.42387C88.6335 5.70645 89.9284 8.64746 89.9284 12.2469C89.9284 14.8807 89.1822 17.1852 87.6898 19.1605C86.1973 21.1358 83.783 22.6063 80.447 23.572V22.8477C84.0903 23.594 86.7899 25.0425 88.5457 27.1934C90.3455 29.3443 91.2453 31.8464 91.2453 34.6996C91.2453 37.4211 90.5649 39.7915 89.2042 41.8107C87.8434 43.786 85.912 45.3224 83.4099 46.4198C80.9518 47.4733 78.0108 48 74.5869 48H52.0684ZM59.9038 42.4033L58.7844 41.284H73.7968C75.9038 41.284 77.6376 40.9986 78.9984 40.428C80.3592 39.8134 81.3468 38.9575 81.9614 37.8601C82.6198 36.7627 82.949 35.4678 82.949 33.9753C82.949 31.6488 82.1809 29.8711 80.6445 28.642C79.152 27.369 76.8695 26.7325 73.7968 26.7325H58.8503V20.214H73.5334C76.3866 20.214 78.4717 19.5995 79.7885 18.3704C81.1493 17.1413 81.8297 15.5171 81.8297 13.4979C81.8297 11.2154 81.0615 9.50343 79.5252 8.36214C78.0327 7.22085 76.0354 6.65021 73.5334 6.65021H58.7844L59.9038 5.59671V42.4033Z" fill="currentColor"/>
          <path d="M0 48V0H10.1399L35.0947 38.1893H34.2387V0H41.9424V48H32.7243L6.78189 8.7572H7.76955V48H0Z" fill="currentColor"/>
        </g>
      </g>
      <defs>
        <clipPath id="nbn-clip">
          <rect width="254" height="48" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const logoColor = scrolled ? 'var(--text)' : '#f4f4f4';

  return (
    <>
      {/* ── Fixed bar: logo + hamburger ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 2.5rem',
          pointerEvents: 'none',
          transition: 'color 0.3s ease',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            color: menuOpen ? 'var(--text)' : logoColor,
            textDecoration: 'none',
            pointerEvents: 'all',
            width: 'clamp(80px, 8vw, 130px)',
            display: 'block',
            transition: 'color 0.3s ease',
          }}
          aria-label="NBNZIA home"
        >
          <LogoSVG />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            pointerEvents: 'all',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '3em',
            height: '3em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '0.5em',
            color: menuOpen ? 'var(--text)' : (scrolled ? 'var(--text)' : '#f4f4f4'),
            transition: 'color 0.3s ease',
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'currentColor',
                borderRadius: '2px',
                transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
                transform:
                  i === 0 && menuOpen ? 'translateY(6.5px) rotate(45deg)' :
                  i === 2 && menuOpen ? 'translateY(-6.5px) rotate(-45deg)' :
                  'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Full-screen overlay menu ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '6rem 2.5rem 3rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: 'clamp(40px, 8vw, 90px)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                padding: '0.1em 0',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.4s ease ${i * 0.06 + 0.1}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06 + 0.1}s`,
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '2.5rem',
            right: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(31,31,31,0.12)',
            paddingTop: '1.5rem',
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(31,31,31,0.5)' }}>
            Global Community
          </span>
          <a
            href="https://calendly.com/hey-nbnzia/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(31,31,31,0.5)', textDecoration: 'none' }}
          >
            Let&apos;s talk ↗
          </a>
        </div>
      </div>
    </>
  );
}

import Image from 'next/image';

const CDN = 'https://cdn.prod.website-files.com/6a71a3264c012e91819a93fc';

const IMAGES = {
  main:   `${CDN}/6a71a37dce7ff540de3569f5_Hero.avif`,
  extra1: `${CDN}/6a79eb0446a2391d750e7585_image.webp`,
  extra2: `${CDN}/6a7596d37918d0434b661527_IMG_9732.avif`,
  extra3: `${CDN}/6a7d89d916001d6ab0da35ac_6a79ebded6ce599c967bb98b_6a7596d40b5395bfde60da0f_IMG_9674%201.avif`,
};

const NAV_LINKS = ['About', 'Services', 'Work', 'Process'];

export default function Hero() {
  return (
    <section
      className="willem-header"
      style={{
        position: 'relative',
        overflow: 'hidden',
        color: '#f4f4f4',
      }}
    >
      {/* ── Hero content wrapper ── */}
      <div
        className="willem-header__content"
        style={{
          width: '100%',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2.5rem',
          position: 'relative',
          zIndex: 4,
        }}
      >
        {/* ── Top: nav links (mix-blend-mode difference) ── */}
        <div
          className="willem-header__top hidden md:flex"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.25rem',
            mixBlendMode: 'difference',
            color: '#fff',
            paddingTop: '0.5rem',
          }}
        >
          {NAV_LINKS.map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                fontSize: 'clamp(10px, 0.82vw, 13px)',
                letterSpacing: '0.08em',
                fontWeight: 400,
                textTransform: 'uppercase',
                padding: '6px 14px',
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ── Bottom: tagline ── */}
        <div
          className="willem-header__bottom"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(44px, 6.5vw, 100px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              color: 'rgba(244,244,244,0.95)',
              textTransform: 'uppercase',
              paddingBottom: '0.5rem',
            }}
          >
            Every great trick
            <br />
            has three parts.
            <br />
            Your website is
            <br />
            the Prestige.
          </p>
        </div>
      </div>

      {/* ── Background: main hero image ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src={IMAGES.main}
          alt="Yevhenii Nebenzia – Webflow Developer & Designer"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          style={{ display: 'block' }}
        />
      </div>

      {/* ── Gradient overlay for tagline readability ── */}
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0',
          height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Decorative: top-right pair ── */}
      <div
        className="hidden lg:block"
        style={{
          position: 'absolute',
          top: '4.5rem',
          right: 'clamp(100px, 11vw, 180px)',
          width: 'clamp(65px, 7vw, 112px)',
          aspectRatio: '3/4',
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <Image src={IMAGES.extra1} alt="" fill unoptimized className="object-cover" />
      </div>
      <div
        className="hidden lg:block"
        style={{
          position: 'absolute',
          top: '4.5rem',
          right: 'clamp(18px, 2.2vw, 36px)',
          width: 'clamp(65px, 7vw, 112px)',
          aspectRatio: '3/4',
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <Image src={IMAGES.extra2} alt="" fill unoptimized className="object-cover" />
      </div>

      {/* ── Decorative: bottom-left ── */}
      <div
        className="hidden lg:block"
        style={{
          position: 'absolute',
          bottom: '5.5rem',
          left: 'clamp(18px, 2.2vw, 36px)',
          width: 'clamp(75px, 8vw, 128px)',
          aspectRatio: '3/4',
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <Image src={IMAGES.extra3} alt="" fill unoptimized className="object-cover" />
      </div>
    </section>
  );
}

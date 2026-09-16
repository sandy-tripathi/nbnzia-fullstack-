const STEPS = [
  {
    num: 'Step 01',
    title: 'The Pledge',
    desc: 'We start with discovery. I dig into your business, your audience, and your goals. No fluff. Just clarity on what the site needs to do and who it needs to impress.',
    deliverables: ['Discovery call', 'Project brief', 'Sitemap', 'Timeline', 'Content plan'],
  },
  {
    num: 'Step 02',
    title: 'The Turn',
    desc: 'Design, development, and animation come together. My team and I build your site piece by piece — every layout intentional, every interaction purposeful. You see progress in real time, not after weeks of silence.',
    deliverables: ['Wireframes', 'UI design', 'Development', 'Animations', 'CMS setup', 'Content integration'],
  },
  {
    num: 'Step 03',
    title: 'The Prestige',
    desc: "Launch day. Your site goes live, polished, fast, and ready to perform. But the trick isn't over — I stick around to make sure everything works exactly as promised.",
    deliverables: ['QA testing', 'Performance optimization', 'Launch', 'Post-launch support', 'Documentation'],
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="mwg043"
      style={{
        background: 'var(--bg)',
        padding: '8rem 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Giant faded background text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '2%',
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {['EVERY GREAT', 'TRICK HAS THREE', 'PARTS.'].map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 'clamp(80px, 12vw, 200px)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              color: 'var(--text)',
              opacity: 0.08,
              whiteSpace: 'nowrap',
              transform: `rotate(-4deg) translateX(${i === 0 ? '-5%' : i === 1 ? '2%' : '-3%'})`,
              marginBottom: '0.5rem',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="u-container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
        data-reveal
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="mwg043-card"
              data-reveal-item
              style={{
                transform: `rotate(${[-3, 1, -2][i % 3]}deg)`,
                background: '#fff',
                borderRadius: '1.25rem',
                width: '22.5rem',
                minHeight: '31.63rem',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '3px 3px 30px rgba(0,0,0,0.09)',
                flexShrink: 0,
              }}
            >
              {/* Top */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: 'rgba(31,31,31,0.45)',
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(28px, 3vw, 48px)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: 'var(--text)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(13px, 1vw, 16px)',
                    lineHeight: 1.65,
                    color: 'rgba(31,31,31,0.55)',
                  }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Deliverables */}
              <div style={{ marginTop: '2rem' }}>
                <div
                  style={{
                    borderTop: '1px solid rgba(31,31,31,0.1)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  {step.deliverables.map(d => (
                    <span
                      key={d}
                      style={{
                        fontSize: 'clamp(9px, 0.75vw, 11px)',
                        letterSpacing: '0.1em',
                        fontWeight: 500,
                        color: 'rgba(31,31,31,0.45)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

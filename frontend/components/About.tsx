export default function About() {
  return (
    <section
      id="about"
      className="c-section"
      style={{ background: 'var(--bg)', padding: '6rem 0 5rem' }}
    >
      <div className="u-container">
        <div className="about-grid" data-reveal>
          {/* Left: tags */}
          <div className="about-tags u-copy-xxxs u-text-transform-uppercase">
            <p>
              Certified Webflow Partner.<br />
              7+ years.<br />
              Custom everything.<br />
              Make sites that perform.
            </p>
          </div>

          {/* Right: bio */}
          <div className="about-bio">
            <h3
              className="u-h3"
              style={{ color: 'var(--text)', marginBottom: '1.5rem' }}
            >
              Webflow developer with 7+ years of experience, a team of designers, animators, and
              strategists behind me, and a past life as a professional illusionist.
            </h3>
            <p
              style={{
                fontSize: 'clamp(15px, 1.2vw, 20px)',
                fontWeight: 400,
                lineHeight: 1.55,
                color: 'rgba(31,31,31,0.45)',
                maxWidth: '72ch',
                letterSpacing: '-0.01em',
              }}
            >
              I don&apos;t do templates. I build digital experiences that convert visitors into believers.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.25rem;
          width: 100%;
        }
        .about-tags { grid-column: 1 / 3; padding-top: 0.15em; line-height: 1.7; }
        .about-bio  { grid-column: 3 / 9; }
        @media (max-width: 767px) {
          .about-grid { display: flex; flex-direction: column; gap: 2.5rem; }
          .about-tags, .about-bio { grid-column: auto; }
        }
      `}</style>
    </section>
  );
}

'use client';

export default function InnerCTA() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="w-full"
      style={{ padding: '64px 0', background: 'var(--bg)' }}
    >
      <div className="c flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href="https://calendly.com/hey-nbnzia/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ color: 'var(--text)', borderColor: 'rgba(31,31,31,0.3)' }}
        >
          Let&apos;s talk
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <button
          onClick={() => scrollTo('work')}
          className="btn-primary"
          style={{ color: 'var(--text)', borderColor: 'rgba(31,31,31,0.3)', background: 'transparent' }}
        >
          See the work
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

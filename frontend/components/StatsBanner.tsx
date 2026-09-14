const STATS = [
  '7+ years in Webflow',
  'Certified Webflow Partner',
  'Clients in 15+ countries',
  '10 years as a pro illusionist',
  '117+ projects delivered',
];

export default function StatsBanner() {
  const doubled = [...STATS, ...STATS, ...STATS, ...STATS];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderTop: '1px solid rgba(31,31,31,0.1)',
        borderBottom: '1px solid rgba(31,31,31,0.1)',
        padding: '14px 0',
        background: 'var(--bg)',
      }}
    >
      <div className="marquee-track">
        {doubled.map((stat, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6"
            style={{ fontSize: 'clamp(11px, 0.85vw, 13px)', fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)' }}
          >
            <span style={{ color: 'var(--text)', opacity: 0.6 }}>♣</span>
            {stat}
          </span>
        ))}
      </div>
    </div>
  );
}

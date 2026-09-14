interface SectionMarqueeProps {
  label: string;
  icon?: string;
  dark?: boolean;
}

export default function SectionMarquee({ label, icon = '♣', dark = false }: SectionMarqueeProps) {
  const items = Array(8).fill(null);

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderTop: dark ? '1px solid rgba(245,242,243,0.1)' : '1px solid rgba(31,31,31,0.1)',
        borderBottom: dark ? '1px solid rgba(245,242,243,0.1)' : '1px solid rgba(31,31,31,0.1)',
        padding: '12px 0',
        background: dark ? 'var(--dark-bg)' : 'var(--bg)',
      }}
    >
      <div className="marquee-track">
        {[...items, ...items].map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6"
            style={{
              fontSize: 'clamp(10px, 0.82vw, 12px)',
              letterSpacing: '0.12em',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: dark ? 'rgba(245,242,243,0.5)' : 'rgba(31,31,31,0.5)',
            }}
          >
            <span style={{ color: dark ? 'rgba(245,242,243,0.3)' : 'rgba(31,31,31,0.3)' }}>{'{' }</span>
            <span>{label}</span>
            <span style={{ opacity: 0.5, fontSize: '0.9em' }}>{icon}</span>
            <span>{label}</span>
            <span style={{ color: dark ? 'rgba(245,242,243,0.3)' : 'rgba(31,31,31,0.3)' }}>{' }'}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

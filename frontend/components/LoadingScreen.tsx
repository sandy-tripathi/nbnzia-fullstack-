'use client';

const LETTERS = ['N', 'B', 'N', 'Z', 'I', 'A'];

interface LoadingScreenProps {
  hiding: boolean;
}

export default function LoadingScreen({ hiding }: LoadingScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hiding ? 0 : 1,
        pointerEvents: hiding ? 'none' : 'all',
        transition: hiding ? 'opacity 0.5s ease 0.1s' : 'none',
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', alignItems: 'center', letterSpacing: '-0.04em' }}>
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(80px, 12vw, 180px)',
              fontWeight: 500,
              lineHeight: 1,
              color: 'var(--text)',
              opacity: 0,
              transform: 'translateY(50px)',
              animation: `ldrIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.08 + 0.1}s forwards, ldrOut 0.4s ease-in ${i * 0.05 + 1.1}s forwards`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ldrIn  { to { opacity: 1; transform: translateY(0); } }
        @keyframes ldrOut { to { opacity: 0; transform: translateY(-50px); } }
      `}</style>
    </div>
  );
}

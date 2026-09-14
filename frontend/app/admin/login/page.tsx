'use client';

import { FormEvent, useEffect, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { status, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (result.ok) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#f5f2f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '1.5rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          border: '1px solid rgba(245,242,243,0.12)',
          borderRadius: 12,
          padding: '2.5rem 2rem',
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,243,0.4)',
            marginBottom: '0.5rem',
          }}
        >
          NBNZIA
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: '2rem' }}>Admin sign in</h1>

        <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'rgba(245,242,243,0.6)' }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          style={inputStyle}
        />

        <label style={{ display: 'block', fontSize: 12, margin: '1.25rem 0 6px', color: 'rgba(245,242,243,0.6)' }}>
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          style={inputStyle}
        />

        {error && <p style={{ color: '#ff8a8a', fontSize: 13, marginTop: '1rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            marginTop: '2rem',
            background: '#f5f2f3',
            color: '#0f0f0f',
            border: 'none',
            borderRadius: 100,
            padding: '0.85rem 1rem',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: submitting ? 'default' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(245,242,243,0.05)',
  border: '1px solid rgba(245,242,243,0.15)',
  borderRadius: 8,
  color: '#f5f2f3',
  padding: '0.7rem 0.85rem',
  fontSize: 14,
  outline: 'none',
};

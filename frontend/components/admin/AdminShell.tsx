'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/useAdminAuth';

const styles = {
  wrap: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#f5f2f3',
    fontFamily: 'Arial, sans-serif',
  } as const,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid rgba(245,242,243,0.1)',
  } as const,
  brand: {
    fontSize: 14,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'rgba(245,242,243,0.9)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(245,242,243,0.25)',
    borderRadius: 100,
    color: '#f5f2f3',
    fontSize: 12,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    padding: '0.5rem 1.1rem',
    cursor: 'pointer',
  },
  body: { padding: '2rem' },
};

/**
 * Wraps every /admin/dashboard-family page. Redirects to /admin/login
 * if there's no valid session; otherwise renders a small header (with
 * logout) plus whatever page content is passed in.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, admin, logout } = useAdminAuth();

  if (status === 'checking') {
    return (
      <div style={{ ...styles.wrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(245,242,243,0.5)' }}>Checking session…</p>
      </div>
    );
  }

  if (status === 'guest') {
    router.replace('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <span style={styles.brand}>NBNZIA · Admin</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: 12, color: 'rgba(245,242,243,0.5)' }}>{admin?.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <div style={styles.body}>{children}</div>
    </div>
  );
}

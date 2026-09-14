'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminRootPage() {
  const router = useRouter();
  const { status } = useAdminAuth();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/admin/dashboard');
    if (status === 'guest') router.replace('/admin/login');
  }, [status, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ color: 'rgba(245,242,243,0.5)', fontFamily: 'Arial, sans-serif' }}>Loading…</p>
    </div>
  );
}

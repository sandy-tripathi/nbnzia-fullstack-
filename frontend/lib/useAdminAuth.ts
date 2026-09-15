'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiRequestError } from './api';
import type { AdminUser } from './types';

type Status = 'checking' | 'authenticated' | 'guest';

/**
 * Client-side admin session hook. Backed by an httpOnly cookie set by the
 * Express backend — this hook just asks /api/auth/me whether that cookie
 * is currently valid, so there's nothing sensitive stored in the browser
 * beyond the cookie itself.
 */
export function useAdminAuth() {
  const [status, setStatus] = useState<Status>('checking');
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.get<AdminUser>('/api/auth/me');
      setAdmin(data);
      setStatus('authenticated');
    } catch {
      setAdmin(null);
      setStatus('guest');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

    const login = useCallback(async (email: string, password: string) => {
    try {
      await api.post('/api/auth/login', { email, password });
      return { ok: true as const };
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : 'Login failed';
      return { ok: false as const, message };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      const data = await api.post<AdminUser>('/api/auth/verify-otp', { email, otp });
      setAdmin(data);
      setStatus('authenticated');
      return { ok: true as const };
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : 'OTP verification failed';
      return { ok: false as const, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setAdmin(null);
      setStatus('guest');
    }
  }, []);

    return { status, admin, login, logout, refresh, verifyOtp };
}

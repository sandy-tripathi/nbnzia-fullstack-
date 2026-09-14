'use client';

import { useEffect, useState } from 'react';
import { api, ApiRequestError } from '@/lib/api';
import type { ContactStatus, ContactSubmission } from '@/lib/types';

const STATUS_FILTERS: Array<{ value: ContactStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

export default function LeadsInbox() {
  const [items, setItems] = useState<ContactSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ContactStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const load = () => {
    setError(null);
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search.trim()) params.set('search', search.trim());

    api
      .get<ContactSubmission[]>(`/api/contact?${params.toString()}`)
      .then(setItems)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : 'Failed to load submissions'));
  };

  useEffect(load, [status, search]);

  const setItemStatus = async (id: string, next: ContactStatus) => {
    try {
      await api.patch(`/api/contact/${id}`, { status: next });
      load();
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : 'Failed to update status');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      load();
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : 'Failed to delete message');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Leads</h2>
        <input
          placeholder="Search name, email, message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(245,242,243,0.05)',
            border: '1px solid rgba(245,242,243,0.15)',
            borderRadius: 8,
            color: '#f5f2f3',
            padding: '0.5rem 0.75rem',
            fontSize: 13,
            outline: 'none',
            minWidth: 220,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            style={{
              background: status === f.value ? '#f5f2f3' : 'transparent',
              color: status === f.value ? '#0f0f0f' : '#f5f2f3',
              border: '1px solid rgba(245,242,243,0.25)',
              borderRadius: 100,
              padding: '0.4rem 0.9rem',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p style={{ color: '#ff8a8a' }}>{error}</p>}

      {items === null && !error && <p style={{ color: 'rgba(245,242,243,0.5)' }}>Loading…</p>}

      {items && items.length === 0 && (
        <p style={{ color: 'rgba(245,242,243,0.5)' }}>No messages match this filter.</p>
      )}

      {items && items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {items.map((sub) => (
            <div
              key={sub._id}
              style={{
                border: '1px solid rgba(245,242,243,0.1)',
                borderLeft: sub.status === 'unread' ? '3px solid #f5f2f3' : '3px solid transparent',
                borderRadius: 8,
                padding: '1rem 1.1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{sub.name}</p>
                  <a href={`mailto:${sub.email}`} style={{ fontSize: 12, color: 'rgba(245,242,243,0.55)' }}>
                    {sub.email}
                  </a>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(245,242,243,0.4)' }}>
                  {new Date(sub.createdAt).toLocaleString()}
                </span>
              </div>

              <p style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(245,242,243,0.75)', margin: '0.75rem 0' }}>
                {sub.message}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={sub.status}
                  onChange={(e) => setItemStatus(sub._id, e.target.value as ContactStatus)}
                  style={{
                    background: '#1a1a1a',
                    color: '#f5f2f3',
                    border: '1px solid rgba(245,242,243,0.2)',
                    borderRadius: 6,
                    padding: '0.35rem 0.6rem',
                    fontSize: 12,
                  }}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={() => remove(sub._id)}
                  style={{
                    background: 'transparent',
                    color: '#ff8a8a',
                    border: '1px solid rgba(255,138,138,0.3)',
                    borderRadius: 100,
                    padding: '0.35rem 0.9rem',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

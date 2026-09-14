'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, ApiRequestError } from '@/lib/api';
import type { Service } from '@/lib/types';

const EMPTY_FORM = {
  title: '',
  description: '',
  imageUrl: '',
  order: 0,
  published: true,
};

type FormState = typeof EMPTY_FORM;

export default function ServicesManager() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoadError(null);
    api
      .get<Service[]>('/api/services')
      .then(setServices)
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : 'Failed to load services'));
  };

  useEffect(load, []);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const startEdit = (s: Service) => {
    setEditingId(s._id);
    setForm({
      title: s.title,
      description: s.description,
      imageUrl: s.imageUrl,
      order: s.order,
      published: s.published,
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingId === 'new') {
        await api.post('/api/services', form);
      } else if (editingId) {
        await api.put(`/api/services/${editingId}`, form);
      }
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    try {
      await api.delete(`/api/services/${id}`);
      load();
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : 'Failed to delete service');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Services</h2>
        {editingId === null && (
          <button onClick={startCreate} style={primaryBtn}>
            + New service
          </button>
        )}
      </div>

      {loadError && <p style={{ color: '#ff8a8a' }}>{loadError}</p>}

      {editingId && (
        <form onSubmit={handleSave} style={panel}>
          <h3 style={{ fontSize: 15, marginBottom: '1rem', color: 'rgba(245,242,243,0.7)' }}>
            {editingId === 'new' ? 'New service' : 'Edit service'}
          </h3>

          <Field label="Title">
            <input style={input} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              style={{ ...input, minHeight: 90, resize: 'vertical' }}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Image URL">
            <input
              style={input}
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </Field>
          <Field label="Order">
            <input
              style={input}
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, margin: '0.75rem 0 1rem' }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on the live site)
          </label>

          {formError && <p style={{ color: '#ff8a8a', fontSize: 13, marginBottom: '0.75rem' }}>{formError}</p>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={saving} style={primaryBtn}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={cancelEdit} style={secondaryBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {services === null && !loadError && <p style={{ color: 'rgba(245,242,243,0.5)' }}>Loading…</p>}

      {services && services.length === 0 && (
        <p style={{ color: 'rgba(245,242,243,0.5)' }}>No services yet — add your first one above.</p>
      )}

      {services && services.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {services.map((s) => (
            <div key={s._id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  {s.title} {!s.published && <span style={{ color: 'rgba(245,242,243,0.4)' }}>(hidden)</span>}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(245,242,243,0.5)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.description}
                </p>
              </div>
              <button onClick={() => startEdit(s)} style={secondaryBtn}>
                Edit
              </button>
              <button onClick={() => handleDelete(s._id)} style={dangerBtn}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <label style={{ display: 'block', fontSize: 12, color: 'rgba(245,242,243,0.6)', marginBottom: 4 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const panel: React.CSSProperties = {
  border: '1px solid rgba(245,242,243,0.12)',
  borderRadius: 10,
  padding: '1.25rem',
  marginBottom: '1.5rem',
  maxWidth: 520,
};

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(245,242,243,0.05)',
  border: '1px solid rgba(245,242,243,0.15)',
  borderRadius: 6,
  color: '#f5f2f3',
  padding: '0.55rem 0.7rem',
  fontSize: 13,
  outline: 'none',
};

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.7rem 0.9rem',
  border: '1px solid rgba(245,242,243,0.08)',
  borderRadius: 8,
};

const primaryBtn: React.CSSProperties = {
  background: '#f5f2f3',
  color: '#0f0f0f',
  border: 'none',
  borderRadius: 100,
  padding: '0.5rem 1.1rem',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  background: 'transparent',
  color: '#f5f2f3',
  border: '1px solid rgba(245,242,243,0.25)',
  borderRadius: 100,
  padding: '0.5rem 1.1rem',
  fontSize: 12,
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  background: 'transparent',
  color: '#ff8a8a',
  border: '1px solid rgba(255,138,138,0.3)',
  borderRadius: 100,
  padding: '0.5rem 1.1rem',
  fontSize: 12,
  cursor: 'pointer',
};

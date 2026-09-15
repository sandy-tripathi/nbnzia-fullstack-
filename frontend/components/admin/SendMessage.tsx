'use client';

import { FormEvent, useState, type CSSProperties } from 'react';
import { api, ApiRequestError } from '@/lib/api';

export function SendMessage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      await api.post('/api/messages/send', { to, subject, message });
      setStatus('sent');
      setTo('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof ApiRequestError ? err.message : 'Failed to send');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 18, marginBottom: '1.5rem', color: '#f5f2f3' }}>Send a Message</h2>

      <label style={labelStyle}>Recipient Email</label>
      <input
        type="email"
        required
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="someone@example.com"
        style={inputStyle}
      />

      <label style={labelStyle}>Subject</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Message subject"
        style={inputStyle}
      />

      <label style={labelStyle}>Message</label>
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ ...inputStyle, resize: 'vertical' as const }}
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          marginTop: '0.5rem',
          background: '#f5f2f3',
          color: '#0f0f0f',
          border: 'none',
          borderRadius: 100,
          padding: '0.75rem 1.5rem',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
          cursor: status === 'sending' ? 'default' : 'pointer',
          opacity: status === 'sending' ? 0.6 : 1,
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'sent' && <p style={{ color: '#4ade80', marginTop: '1rem' }}>Message sent!</p>}
      {status === 'error' && <p style={{ color: '#f87171', marginTop: '1rem' }}>{error}</p>}
    </form>
  );
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  marginBottom: 6,
  marginTop: '1.25rem',
  color: 'rgba(245,242,243,0.6)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(245,242,243,0.05)',
  border: '1px solid rgba(245,242,243,0.15)',
  borderRadius: 8,
  color: '#f5f2f3',
  padding: '0.7rem 0.85rem',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
};
'use client';

import { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ProjectsManager from '@/components/admin/ProjectsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import LeadsInbox from '@/components/admin/LeadsInbox';
import { SendMessage } from '@/components/admin/SendMessage';

type Tab = 'projects' | 'services' | 'leads' | 'message';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'leads', label: 'Leads' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'message', label: 'Send Message' },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('leads');

  return (
    <AdminShell>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(245,242,243,0.1)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: tab === t.id ? '#f5f2f3' : 'rgba(245,242,243,0.45)',
              fontSize: 13,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.75rem 0.25rem',
              marginRight: '1.5rem',
              cursor: 'pointer',
              borderBottom: tab === t.id ? '2px solid #f5f2f3' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'leads' && <LeadsInbox />}
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'services' && <ServicesManager />}
      {tab === 'message' && <SendMessage />}
    </AdminShell>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { events as calendarEvents } from '@/lib/events';

// Same session key as the gallery admin, so one login covers both pages.
const PW_KEY = 'pp-gallery-admin-pw';

const card: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '1.25rem',
  marginBottom: '2rem',
};

const button = (bg: string, disabled = false): React.CSSProperties => ({
  backgroundColor: disabled ? '#9ca3af' : bg,
  color: 'white',
  padding: '0.6rem 1.1rem',
  borderRadius: '8px',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 'bold',
  fontSize: '0.95rem',
});

const input: React.CSSProperties = {
  padding: '0.6rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  minWidth: 0,
};

// "Send me a test" for the Save the Date / reminder event emails. The server
// sends it to the site admin only; nothing goes to members or is marked as sent.
export default function EventEmailTest() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const upcoming = calendarEvents.filter((e) => (e.endDate ?? e.date) >= today);
  const options = upcoming.length ? upcoming : calendarEvents;

  const [password, setPassword] = useState('');
  const [eventId, setEventId] = useState(options[0]?.id);
  const [sending, setSending] = useState<'invite' | 'reminder' | null>(null);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PW_KEY);
      if (saved) setPassword(saved);
    } catch {}
  }, []);

  const send = async (kind: 'invite' | 'reminder') => {
    setSending(kind);
    setResult(null);
    try {
      const res = await fetch('/api/events/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ test: true, eventId, kind }),
      });
      const data = await res.json();
      if (res.status === 401) throw new Error('Wrong admin password');
      if (!data.success) throw new Error(data.error || data.message || 'Send failed');
      try { sessionStorage.setItem(PW_KEY, password); } catch {}
      setResult({
        ok: true,
        text: `Sent "${data.test.title}" (${kind === 'reminder' ? 'reminder' : 'Save the Date'}) to ${data.test.to}, from ${data.test.from}.`,
      });
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : 'Send failed' });
    } finally {
      setSending(null);
    }
  };

  const disabled = !!sending || !password || eventId === undefined;

  return (
    <div style={card}>
      <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}>📧 Event emails – send me a test</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <select
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
          style={{ ...input, flex: '1 1 240px' }}
        >
          {options.map((e) => (
            <option key={e.id} value={e.id}>
              {e.date} · {e.title}
            </option>
          ))}
        </select>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          style={{ ...input, flex: '0 1 180px' }}
        />
        <button onClick={() => send('invite')} disabled={disabled} style={button('#10b981', disabled)}>
          {sending === 'invite' ? 'Sending…' : 'Send me Save the Date'}
        </button>
        <button onClick={() => send('reminder')} disabled={disabled} style={button('#0d9488', disabled)}>
          {sending === 'reminder' ? 'Sending…' : 'Send me the reminder'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: '0.6rem', color: result.ok ? '#065f46' : '#dc2626' }}>
          {result.ok ? '✅ ' : 'Error: '}
          {result.text}
        </div>
      )}
    </div>
  );
}

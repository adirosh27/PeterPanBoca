'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface GalleryFile {
  path: string;
  name: string;
  url: string;
  size: number;
  type: 'image' | 'video';
}

interface GalleryEvent {
  key: string;
  year: string;
  event: string;
  files: GalleryFile[];
  totalSize: number;
}

type Mode = 'github' | 'local' | 'unconfigured';

const PW_KEY = 'pp-gallery-admin-pw';

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const card: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '1.25rem',
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

export default function GalleryAdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [mode, setMode] = useState<Mode | null>(null);
  const [eventKey, setEventKey] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ text: string; link?: string } | null>(null);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gallery-admin', { headers: { 'x-admin-password': pw }, cache: 'no-store' });
      const data = await res.json();
      if (res.status === 401) {
        setAuthed(false);
        try { sessionStorage.removeItem(PW_KEY); } catch {}
        setError('Wrong admin password');
        return;
      }
      setMode(data.mode ?? null);
      if (!data.success) {
        setAuthed(true);
        setError(data.message || 'Failed to load photos');
        return;
      }
      setAuthed(true);
      try { sessionStorage.setItem(PW_KEY, pw); } catch {}
      setEvents(data.events);
      setEventKey((k) => (data.events.some((e: GalleryEvent) => e.key === k) ? k : data.events[0]?.key ?? ''));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(PW_KEY); } catch {}
    if (saved) {
      setPassword(saved);
      load(saved);
    }
  }, [load]);

  const current = useMemo(() => events.find((e) => e.key === eventKey), [events, eventKey]);
  const totalSize = useMemo(() => events.reduce((s, e) => s + e.totalSize, 0), [events]);
  const totalCount = useMemo(() => events.reduce((s, e) => s + e.files.length, 0), [events]);
  const selectedSize = useMemo(() => {
    let s = 0;
    for (const ev of events) for (const f of ev.files) if (selected.has(f.path)) s += f.size;
    return s;
  }, [events, selected]);

  const toggle = (p: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  const selectAllInEvent = (on: boolean) => {
    if (!current) return;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const f of current.files) {
        if (on) next.add(f.path);
        else next.delete(f.path);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    const paths = [...selected];
    if (paths.length === 0) return;
    const ok = window.confirm(
      `Permanently delete ${paths.length} file${paths.length === 1 ? '' : 's'} (${formatSize(selectedSize)}) from the gallery?\n\n` +
        (mode === 'github'
          ? 'This commits the deletion to GitHub and the site will redeploy in a few minutes.'
          : 'The files will be deleted from this computer. Commit and push to update the live site.')
    );
    if (!ok) return;

    setDeleting(true);
    setError('');
    setNotice(null);
    try {
      const res = await fetch('/api/gallery-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ paths }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      setNotice(
        data.mode === 'github'
          ? { text: `Deleted ${data.deleted} file(s), saving ${formatSize(selectedSize)}. The site will redeploy shortly.`, link: data.commitUrl }
          : { text: `Deleted ${data.deleted} file(s) locally, saving ${formatSize(selectedSize)}. Commit and push to publish.` }
      );
      setSelected(new Set());
      await load(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const page: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f0f9ff',
    padding: '1.5rem 1rem 6rem',
    fontFamily: 'system-ui',
  };

  if (!authed) {
    return (
      <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(password);
          }}
          style={{ ...card, width: '100%', maxWidth: '380px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗑️📸</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
            Gallery Admin
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.75rem' }}
          />
          <button type="submit" disabled={loading || !password} style={{ ...button('#2563eb', loading || !password), width: '100%' }}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
          {error && <div style={{ color: '#dc2626', marginTop: '0.75rem' }}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
          🗑️ Gallery Admin – Delete Photos
        </h1>
        <p style={{ color: '#475569', marginBottom: '1rem' }}>
          {totalCount} files · {formatSize(totalSize)} total
          {mode === 'github' && ' · deletions are committed to GitHub'}
          {mode === 'local' && ' · local mode: deletes files on this computer'}
        </p>

        {error && (
          <div style={{ ...card, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', marginBottom: '1rem' }}>
            <strong>Error:</strong> {error}
            {mode === 'unconfigured' && (
              <div style={{ marginTop: '0.5rem', color: '#7f1d1d' }}>
                Add a <code>GITHUB_TOKEN</code> environment variable in Vercel (a fine-grained token with
                Contents: read &amp; write on this repo), then redeploy.
              </div>
            )}
          </div>
        )}

        {notice && (
          <div style={{ ...card, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', marginBottom: '1rem' }}>
            ✅ {notice.text}{' '}
            {notice.link && (
              <a href={notice.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                View commit
              </a>
            )}
          </div>
        )}

        {events.length > 0 && (
          <div style={{ ...card, marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={eventKey}
              onChange={(e) => setEventKey(e.target.value)}
              style={{ flex: '1 1 280px', minWidth: 0, padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              {events.map((ev) => (
                <option key={ev.key} value={ev.key}>
                  {ev.year} · {ev.event} — {ev.files.length} files, {formatSize(ev.totalSize)}
                </option>
              ))}
            </select>
            <button onClick={() => selectAllInEvent(true)} style={button('#475569')}>Select all</button>
            <button onClick={() => selectAllInEvent(false)} style={button('#94a3b8')}>Clear</button>
            <button onClick={() => load(password)} disabled={loading} style={button('#0ea5e9', loading)}>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        )}

        {current && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {current.files.map((f) => {
              const isSel = selected.has(f.path);
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => toggle(f.path)}
                  title={f.name}
                  style={{
                    position: 'relative',
                    padding: 0,
                    border: isSel ? '3px solid #dc2626' : '3px solid transparent',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1 / 1', backgroundColor: '#e2e8f0' }}>
                    {f.type === 'image' ? (
                      <Image
                        src={f.url}
                        alt={f.name}
                        fill
                        sizes="160px"
                        style={{ objectFit: 'cover', opacity: isSel ? 0.55 : 1 }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        🎬
                      </div>
                    )}
                    <input
                      type="checkbox"
                      checked={isSel}
                      readOnly
                      tabIndex={-1}
                      style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, pointerEvents: 'none' }}
                    />
                  </div>
                  <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: '#334155' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div style={{ color: '#64748b' }}>{formatSize(f.size)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.12)',
            padding: '0.85rem 1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {selected.size} selected · {formatSize(selectedSize)}
          </span>
          <button onClick={() => setSelected(new Set())} style={button('#94a3b8')}>Deselect</button>
          <button onClick={handleDelete} disabled={deleting} style={button('#dc2626', deleting)}>
            {deleting ? 'Deleting…' : `Delete ${selected.size}`}
          </button>
        </div>
      )}
    </div>
  );
}

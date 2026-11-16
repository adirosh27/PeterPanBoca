'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { EVENT_TYPES, TBA, type Event } from '@/lib/events';
import { useEvents } from '@/lib/use-events';
import { getWeekBirthdays } from '@/lib/birthdays';

// ---------- types ----------

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventName: string;
  eventDate?: string;
  adults: number;
  children: number;
  childrenAges?: string;
  specialRequests?: string;
  totalCost?: string;
  registrationDate: string;
  serverTimestamp?: string;
}

interface Poll {
  id: string;
  question: string;
  eventDate?: string | null;
  deadline?: string | null;
  allowMultipleAnswers?: boolean;
  options: { id: string; text: string; votes: number }[];
  createdAt: string;
  isActive: boolean;
}

interface Payment {
  id: string;
  payerNameRaw: string;
  memberName: string | null;
  amount: number;
  date: string;
  memo: string;
  category: 'event' | 'quarterly' | 'other';
  needsReview: boolean;
}

interface SentReport {
  eventId: number;
  title: string;
  delivered: number;
  failed: string[];
}

interface EmailRunResult {
  baseline: boolean;
  dryRun: boolean;
  invites: SentReport[];
  reminders: SentReport[];
}

type Section = 'overview' | 'registrations' | 'events' | 'polls' | 'payments' | 'gallery' | 'tools';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'registrations', label: 'Registrations', icon: '📋' },
  { id: 'events', label: 'Events & Emails', icon: '📅' },
  { id: 'polls', label: 'Polls', icon: '🗳️' },
  { id: 'payments', label: 'Payments', icon: '💵' },
  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  { id: 'tools', label: 'Site Tools', icon: '🧰' },
];

// Same key as /admin/photos, so one login covers both pages.
const PW_KEY = 'pp-gallery-admin-pw';

// ---------- helpers ----------

const known = (v?: string) => (v && v !== TBA ? v : '');

function todayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function daysUntil(date: string) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${todayStr()}T00:00:00Z`)) / 86_400_000);
}

function fmtDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fmtDateTime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

const money = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

function regTime(r: Registration) {
  return new Date(r.serverTimestamp || r.registrationDate).getTime() || 0;
}

const shown = (v?: string) => (v && v !== 'N/A' ? v : '');

// ---------- page ----------

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [section, setSection] = useState<Section>('overview');

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);

  const notify = useCallback((text: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ text, kind });
    window.setTimeout(() => setToast((t) => (t?.text === text ? null : t)), 5000);
  }, []);

  // ----- auth -----

  const verify = useCallback(async (pw: string) => {
    const res = await fetch(`/api/payments/admin?password=${encodeURIComponent(pw)}`, { cache: 'no-store' });
    const data = await res.json();
    return !!data.valid;
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PW_KEY);
    } catch {}
    const hash = window.location.hash.slice(1) as Section;
    if (SECTIONS.some((s) => s.id === hash)) setSection(hash);
    if (!saved) {
      setChecking(false);
      return;
    }
    verify(saved)
      .then((ok) => {
        if (ok) {
          setPassword(saved!);
          setAuthed(true);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [verify]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setChecking(true);
    try {
      if (await verify(pwInput)) {
        try {
          sessionStorage.setItem(PW_KEY, pwInput);
        } catch {}
        setPassword(pwInput);
        setAuthed(true);
      } else {
        setLoginError('Wrong admin password');
      }
    } catch {
      setLoginError('Could not reach the server');
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(PW_KEY);
    } catch {}
    setPassword('');
    setPwInput('');
    setAuthed(false);
  };

  const go = (s: Section) => {
    setSection(s);
    history.replaceState(null, '', `#${s}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ----- data -----

  const loadAll = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    const errors: Record<string, string> = {};
    const headers = { 'x-admin-password': password };
    await Promise.all([
      fetch('/api/register', { headers, cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => (d.success ? setRegistrations(d.registrations || []) : (errors.registrations = d.message || 'Failed')))
        .catch((e) => (errors.registrations = String(e))),
      fetch('/api/polls', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => (d.success ? setPolls(d.polls || []) : (errors.polls = d.message || 'Failed')))
        .catch((e) => (errors.polls = String(e))),
      fetch('/api/payments/results', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => (d.success ? setPayments(d.payments || []) : (errors.payments = d.message || 'Failed')))
        .catch((e) => (errors.payments = String(e))),
    ]);
    setLoadErrors(errors);
    setLoading(false);
  }, [password]);

  useEffect(() => {
    if (authed) loadAll();
  }, [authed, loadAll]);

  const { events: loadedEvents, reload: reloadEvents } = useEvents();
  const allEvents = useMemo(() => loadedEvents ?? [], [loadedEvents]);

  // ----- derived -----

  const today = todayStr();
  const upcomingEvents = useMemo(
    () =>
      allEvents
        .filter((e) => (e.endDate ?? e.date) >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [today, allEvents]
  );
  const activePoll = polls.find((p) => p.isActive);
  const needsReview = payments.filter((p) => p.needsReview);
  const yearTotal = payments
    .filter((p) => p.date.startsWith(today.slice(0, 4)))
    .reduce((s, p) => s + p.amount, 0);
  const birthdays = useMemo(() => getWeekBirthdays(), []);

  // ---------- render ----------

  if (!authed) {
    return (
      <div className="adm-root adm-center">
        <style>{CSS}</style>
        <form className="adm-card adm-login" onSubmit={login}>
          <div className="adm-login-icon">🔐</div>
          <h1>Admin</h1>
          <p className="adm-muted">Enter the site admin password to manage registrations, events, polls, payments and the gallery.</p>
          <input
            type="password"
            className="adm-input"
            placeholder="Admin password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            autoFocus
          />
          {loginError && <div className="adm-alert adm-alert-err">{loginError}</div>}
          <button className="adm-btn adm-btn-primary adm-btn-block" disabled={checking || !pwInput}>
            {checking ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-root">
      <style>{CSS}</style>
      <div className="adm-shell">
        <aside className="adm-nav">
          <div className="adm-brand">
            <span>🧚</span>
            <div>
              <strong>Peter Pan Admin</strong>
              <small>Control panel</small>
            </div>
          </div>
          <nav>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`adm-nav-item ${section === s.id ? 'is-active' : ''}`}
                onClick={() => go(s.id)}
              >
                <span className="adm-nav-icon">{s.icon}</span>
                <span>{s.label}</span>
                {s.id === 'payments' && needsReview.length > 0 && <span className="adm-badge-dot">{needsReview.length}</span>}
              </button>
            ))}
          </nav>
          <div className="adm-nav-foot">
            <button className="adm-btn adm-btn-ghost adm-btn-block" onClick={loadAll} disabled={loading}>
              {loading ? 'Refreshing…' : '↻ Refresh data'}
            </button>
            <button className="adm-btn adm-btn-ghost adm-btn-block" onClick={logout}>
              Sign out
            </button>
          </div>
        </aside>

        <main className="adm-main">
          {Object.entries(loadErrors).map(([k, v]) => (
            <div key={k} className="adm-alert adm-alert-err">
              Could not load {k}: {v}
            </div>
          ))}

          {section === 'overview' && (
            <Overview
              registrations={registrations}
              upcomingEvents={upcomingEvents}
              activePoll={activePoll}
              pollsCount={polls.length}
              needsReview={needsReview.length}
              yearTotal={yearTotal}
              birthdays={birthdays}
              go={go}
            />
          )}
          {section === 'registrations' && (
            <Registrations password={password} registrations={registrations} reload={loadAll} notify={notify} />
          )}
          {section === 'events' && (
            <Events
              password={password}
              allEvents={allEvents}
              upcoming={upcomingEvents}
              loaded={loadedEvents !== null}
              reload={reloadEvents}
              notify={notify}
            />
          )}
          {section === 'polls' && <Polls password={password} polls={polls} reload={loadAll} notify={notify} />}
          {section === 'payments' && (
            <Payments password={password} payments={payments} reload={loadAll} notify={notify} />
          )}
          {section === 'gallery' && <Gallery />}
          {section === 'tools' && <Tools />}
        </main>
      </div>

      {toast && <div className={`adm-toast ${toast.kind === 'err' ? 'is-err' : ''}`}>{toast.text}</div>}
    </div>
  );
}

// ---------- shared bits ----------

function Header({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="adm-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="adm-muted">{subtitle}</p>}
      </div>
      {children && <div className="adm-actions">{children}</div>}
    </div>
  );
}

function Stat({ label, value, hint, onClick, tone }: { label: string; value: React.ReactNode; hint?: string; onClick?: () => void; tone?: 'warn' }) {
  return (
    <button className={`adm-card adm-stat ${tone === 'warn' ? 'is-warn' : ''}`} onClick={onClick} disabled={!onClick}>
      <span className="adm-stat-label">{label}</span>
      <span className="adm-stat-value">{value}</span>
      {hint && <span className="adm-stat-hint">{hint}</span>}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="adm-empty">{children}</div>;
}

type Notify = (text: string, kind?: 'ok' | 'err') => void;

// ---------- overview ----------

function Overview(props: {
  registrations: Registration[];
  upcomingEvents: Event[];
  activePoll?: Poll;
  pollsCount: number;
  needsReview: number;
  yearTotal: number;
  birthdays: ReturnType<typeof getWeekBirthdays>;
  go: (s: Section) => void;
}) {
  const { registrations, upcomingEvents, activePoll, needsReview, yearTotal, birthdays, go } = props;
  const next = upcomingEvents[0];
  const recent = [...registrations].sort((a, b) => regTime(b) - regTime(a)).slice(0, 5);
  const activeVotes = activePoll?.options.reduce((s, o) => s + o.votes, 0) ?? 0;

  return (
    <>
      <Header title="Overview" subtitle="Everything that needs attention, at a glance." />
      <div className="adm-stats">
        <Stat label="Registrations" value={registrations.length} hint="View all →" onClick={() => go('registrations')} />
        <Stat
          label="Next event"
          value={next ? (daysUntil(next.date) <= 0 ? 'Today' : `${daysUntil(next.date)} days`) : '—'}
          hint={next ? next.title : 'No upcoming events'}
          onClick={() => go('events')}
        />
        <Stat
          label="Active poll"
          value={activePoll ? `${activeVotes} votes` : 'None'}
          hint={activePoll ? activePoll.question : `${props.pollsCount} polls total`}
          onClick={() => go('polls')}
        />
        <Stat
          label={`Payments ${new Date().getFullYear()}`}
          value={money(yearTotal)}
          hint={needsReview ? `${needsReview} need review` : 'All reviewed'}
          tone={needsReview ? 'warn' : undefined}
          onClick={() => go('payments')}
        />
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Upcoming events</h2>
          {upcomingEvents.length === 0 ? (
            <Empty>No upcoming events in the calendar.</Empty>
          ) : (
            <ul className="adm-list">
              {upcomingEvents.slice(0, 4).map((e) => (
                <li key={`${e.id}-${e.date}`}>
                  <div>
                    <strong dir="auto">{e.title}</strong>
                    <small>{fmtDate(e.date)}{known(e.time) && ` · ${e.time}`}</small>
                  </div>
                  <span className="adm-pill">{daysUntil(e.date) <= 0 ? 'today' : `in ${daysUntil(e.date)}d`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2>Latest registrations</h2>
          {recent.length === 0 ? (
            <Empty>No registrations yet.</Empty>
          ) : (
            <ul className="adm-list">
              {recent.map((r) => (
                <li key={r.id}>
                  <div>
                    <strong dir="auto">{r.firstName} {r.lastName}</strong>
                    <small dir="auto">{r.eventName}</small>
                  </div>
                  <span className="adm-muted adm-small">{fmtDateTime(r.serverTimestamp || r.registrationDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2>🎂 Birthdays this week</h2>
          {birthdays.length === 0 ? (
            <Empty>No birthdays this week.</Empty>
          ) : (
            <ul className="adm-list">
              {birthdays.map((b) => (
                <li key={b.name}>
                  <strong>{b.name}</strong>
                  <span className="adm-muted adm-small">
                    {b.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2>Quick actions</h2>
          <div className="adm-quick">
            <a className="adm-btn" href="/polls/create">➕ New poll</a>
            <button className="adm-btn" onClick={() => go('events')}>✉️ Event emails</button>
            <a className="adm-btn" href="/admin/photos">🖼️ Manage photos</a>
            <a className="adm-btn" href="/payments">💵 Payments page</a>
          </div>
        </section>
      </div>
    </>
  );
}

// ---------- registrations ----------

function Registrations({ password, registrations, reload, notify }: { password: string; registrations: Registration[]; reload: () => Promise<void>; notify: Notify }) {
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const eventNames = useMemo(() => [...new Set(registrations.map((r) => r.eventName).filter(Boolean))].sort(), [registrations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations
      .filter((r) => !eventFilter || r.eventName === eventFilter)
      .filter((r) => !q || [r.firstName, r.lastName, r.email, r.phone, r.eventName].join(' ').toLowerCase().includes(q))
      .sort((a, b) => regTime(b) - regTime(a));
  }, [registrations, query, eventFilter]);

  const totals = useMemo(
    () => filtered.reduce((t, r) => ({ adults: t.adults + (Number(r.adults) || 0), children: t.children + (Number(r.children) || 0) }), { adults: 0, children: 0 }),
    [filtered]
  );

  const exportExcel = async () => {
    const XLSX = await import('xlsx');
    const rows = filtered.map((r) => ({
      'First Name': r.firstName,
      'Last Name': r.lastName,
      Email: r.email,
      Phone: r.phone,
      Event: r.eventName,
      Adults: r.adults,
      Children: r.children,
      'Children Ages': shown(r.childrenAges),
      'Special Requests': shown(r.specialRequests),
      Total: r.totalCost ?? '',
      Registered: fmtDateTime(r.serverTimestamp || r.registrationDate),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, `registrations-${todayStr()}.xlsx`);
  };

  const copyEmails = async () => {
    const emails = [...new Set(filtered.map((r) => r.email).filter(Boolean))].join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      notify(`Copied ${emails.split(', ').length} email addresses`);
    } catch {
      notify('Could not copy to clipboard', 'err');
    }
  };

  const remove = async (r: Registration) => {
    if (!confirm(`Delete the registration of ${r.firstName} ${r.lastName} for "${r.eventName}"? This cannot be undone.`)) return;
    setBusy(r.id);
    try {
      const res = await fetch(`/api/register?id=${encodeURIComponent(r.id)}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      notify('Registration deleted');
      await reload();
    } catch (e) {
      notify(`Delete failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Header title="Registrations" subtitle={`${registrations.length} total · showing ${filtered.length} · ${totals.adults} adults, ${totals.children} children`}>
        <button className="adm-btn" onClick={copyEmails} disabled={!filtered.length}>📋 Copy emails</button>
        <button className="adm-btn adm-btn-primary" onClick={exportExcel} disabled={!filtered.length}>📥 Export Excel</button>
      </Header>

      <div className="adm-card adm-toolbar">
        <input className="adm-input" placeholder="Search name, email, phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="adm-input" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All events</option>
          {eventNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Empty>{registrations.length ? 'No registrations match your filters.' : 'No registrations yet. They will appear here once people sign up.'}</Empty>
      ) : (
        <div className="adm-card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Event</th>
                <th>Contact</th>
                <th>Guests</th>
                <th>Registered</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const extra = shown(r.childrenAges) || shown(r.specialRequests);
                return (
                  <Fragment key={r.id}>
                    <tr>
                      <td dir="auto"><strong>{r.firstName} {r.lastName}</strong></td>
                      <td dir="auto">{r.eventName}</td>
                      <td>
                        <a href={`mailto:${r.email}`}>{r.email}</a>
                        {r.phone && <div><a href={`tel:${r.phone}`}>{r.phone}</a></div>}
                      </td>
                      <td>
                        {r.adults}A · {r.children}C
                        {r.totalCost && <div className="adm-muted adm-small">{r.totalCost}</div>}
                      </td>
                      <td className="adm-small">{fmtDateTime(r.serverTimestamp || r.registrationDate)}</td>
                      <td><div className="adm-row-actions">
                        {extra && (
                          <button className="adm-btn adm-btn-sm" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                            {expanded === r.id ? 'Hide' : 'Notes'}
                          </button>
                        )}
                        <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(r)} disabled={busy === r.id}>
                          {busy === r.id ? '…' : 'Delete'}
                        </button>
                      </div></td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="adm-subrow">
                        <td colSpan={6} dir="auto">
                          {shown(r.childrenAges) && <div><strong>Children ages:</strong> {r.childrenAges}</div>}
                          {shown(r.specialRequests) && <div><strong>Special requests:</strong> {r.specialRequests}</div>}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ---------- events & emails ----------

function Events(props: {
  password: string;
  allEvents: Event[];
  upcoming: Event[];
  loaded: boolean;
  reload: () => Promise<void>;
  notify: Notify;
}) {
  const { password, allEvents, upcoming, loaded, reload, notify } = props;
  const [editing, setEditing] = useState<Event | 'new' | null>(null);
  const [running, setRunning] = useState<'' | 'preview' | 'send' | 'test'>('');
  const [result, setResult] = useState<EmailRunResult | null>(null);
  const [testEvent, setTestEvent] = useState<number>(upcoming[0]?.id ?? 0);
  const [testKind, setTestKind] = useState<'invite' | 'reminder'>('invite');
  const [testTo, setTestTo] = useState('');
  const pastCount = allEvents.length - upcoming.length;
  const past = allEvents
    .filter((e) => !upcoming.includes(e))
    .sort((a, b) => b.date.localeCompare(a.date));

  useEffect(() => {
    if (!upcoming.some((e) => e.id === testEvent) && upcoming[0]) setTestEvent(upcoming[0].id);
  }, [upcoming, testEvent]);

  const call = async (params: Record<string, string>) => {
    const qs = new URLSearchParams({ password, ...params });
    const res = await fetch(`/api/events/send-invites?${qs}`, { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || data.message || 'Request failed');
    return data;
  };

  const preview = async () => {
    setRunning('preview');
    try {
      setResult(await call({ dryRun: '1' }));
    } catch (e) {
      notify(`Preview failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setRunning('');
    }
  };

  const sendNow = async () => {
    if (!confirm('Send every due Save the Date and reminder email to all active members now? (The daily cron would otherwise send these automatically.)')) return;
    setRunning('send');
    try {
      const data: EmailRunResult = await call({});
      setResult(data);
      const n = data.invites.length + data.reminders.length;
      notify(n ? `Sent emails for ${n} event(s)` : 'Nothing was due — no emails sent');
    } catch (e) {
      notify(`Send failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setRunning('');
    }
  };

  const [sendingAll, setSendingAll] = useState<number | null>(null);
  const sendToEveryone = async (ev: Event) => {
    if (!confirm(`Send the Save the Date for "${ev.title}" (${ev.date}) to ALL active members now?\n\nEach member gets their own email. This can't be undone.`)) return;
    setSendingAll(ev.id);
    try {
      let data;
      try {
        data = await call({ sendAll: '1', eventId: String(ev.id) });
      } catch (err) {
        if (!(err instanceof Error && err.message.startsWith('ALREADY_SENT'))) throw err;
        if (!confirm(`The Save the Date for "${ev.title}" was already sent to everyone.\n\nSend it to everyone AGAIN?`)) return;
        data = await call({ sendAll: '1', eventId: String(ev.id), force: '1' });
      }
      const s = data.sent;
      notify(`Save the Date sent: ${s.delivered} delivered${s.failed.length ? `, ${s.failed.length} failed (${s.failed.join(', ')})` : ''}`, s.failed.length ? 'err' : undefined);
    } catch (err) {
      notify(`Send failed: ${err instanceof Error ? err.message : err}`, 'err');
    } finally {
      setSendingAll(null);
    }
  };

  const sendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning('test');
    try {
      await call({ eventId: String(testEvent), testTo: testTo.trim(), kind: testKind });
      notify(`Test ${testKind} sent to ${testTo.trim()}`);
    } catch (err) {
      notify(`Test failed: ${err instanceof Error ? err.message : err}`, 'err');
    } finally {
      setRunning('');
    }
  };

  return (
    <>
      <Header title="Events & Emails" subtitle={`${upcoming.length} upcoming · ${pastCount} past. Changes show on the calendar and home page right away.`}>
        <a className="adm-btn" href="/calendar">Open calendar →</a>
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing('new')} disabled={!loaded}>+ New event</button>
      </Header>

      <section className="adm-card">
        <h2>Upcoming events</h2>
        {!loaded ? (
          <Empty>Loading events…</Empty>
        ) : upcoming.length === 0 ? (
          <Empty>No upcoming events.</Empty>
        ) : (
          <div className="adm-events">
            {upcoming.map((e) => {
              const d = daysUntil(e.date);
              return (
                <div key={`${e.id}-${e.date}`} className="adm-event">
                  <div className="adm-event-date">
                    <span>{new Date(`${e.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <strong>{new Date(`${e.date}T12:00:00`).getDate()}</strong>
                  </div>
                  <div className="adm-event-body">
                    <strong dir="auto">{e.title}</strong>
                    <small dir="auto">
                      {[known(e.time), known(e.location), known(e.price)].filter(Boolean).join(' · ') || 'Details TBA'}
                    </small>
                  </div>
                  <div className="adm-event-tags">
                    <span className="adm-pill">{d <= 0 ? 'today' : `in ${d}d`}</span>
                    {d >= 1 && d <= 7 && <span className="adm-pill is-warn">reminder window</span>}
                    <span className="adm-muted adm-small">#{e.id}</span>
                    <button className="adm-btn adm-btn-sm" onClick={() => setEditing(e)}>Edit</button>
                    <button
                      className="adm-btn adm-btn-sm"
                      onClick={() => sendToEveryone(e)}
                      disabled={sendingAll !== null || !!running}
                      title="Email this event's Save the Date to every active member now"
                    >
                      {sendingAll === e.id ? 'Sending…' : '✉️ Send to everyone'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <details className="adm-card adm-past">
          <summary>Past events ({past.length})</summary>
          <div className="adm-events">
            {past.map((e) => (
              <div key={`${e.id}-${e.date}`} className="adm-event">
                <div className="adm-event-body">
                  <strong dir="auto">{e.title}</strong>
                  <small>{fmtDate(e.date)}</small>
                </div>
                <div className="adm-event-tags">
                  <span className="adm-muted adm-small">#{e.id}</span>
                  <button className="adm-btn adm-btn-sm" onClick={() => setEditing(e)}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {editing && (
        <EventEditor
          event={editing === 'new' ? null : editing}
          password={password}
          onClose={() => setEditing(null)}
          onSaved={async (text) => {
            setEditing(null);
            notify(text);
            await reload();
          }}
          notify={notify}
        />
      )}

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Member emails</h2>
          <p className="adm-muted">
            A daily job emails all active members a <b>Save the Date</b> for new events and a <b>reminder</b> one week before.
            Preview what it would send now, or send it right away after adding an event.
          </p>
          <div className="adm-actions">
            <button className="adm-btn" onClick={preview} disabled={!!running}>{running === 'preview' ? 'Checking…' : '👀 Preview due emails'}</button>
            <button className="adm-btn adm-btn-primary" onClick={sendNow} disabled={!!running}>{running === 'send' ? 'Sending…' : '✉️ Send due emails now'}</button>
          </div>
          {result && (
            <div className="adm-result">
              <strong>{result.dryRun ? 'Preview (nothing sent)' : 'Sent'}</strong>
              {result.baseline && <div className="adm-muted adm-small">First run: existing events were recorded without a Save the Date.</div>}
              {result.invites.length + result.reminders.length === 0 ? (
                <div className="adm-muted">Nothing is due right now.</div>
              ) : (
                <ul>
                  {result.invites.map((r) => (
                    <li key={`i${r.eventId}`} dir="auto">Save the Date — {r.title}{!result.dryRun && ` (${r.delivered} delivered${r.failed.length ? `, ${r.failed.length} failed` : ''})`}</li>
                  ))}
                  {result.reminders.map((r) => (
                    <li key={`r${r.eventId}`} dir="auto">Reminder — {r.title}{!result.dryRun && ` (${r.delivered} delivered${r.failed.length ? `, ${r.failed.length} failed` : ''})`}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        <section className="adm-card">
          <h2>Send a test email</h2>
          <p className="adm-muted">Sends one event email to one member address. Nothing is marked as sent.</p>
          <form className="adm-form" onSubmit={sendTest}>
            <label>
              Event
              <select className="adm-input" value={testEvent} onChange={(e) => setTestEvent(Number(e.target.value))}>
                {(upcoming.length ? upcoming : allEvents).map((e: Event) => (
                  <option key={`${e.id}-${e.date}`} value={e.id}>#{e.id} · {e.title} ({e.date})</option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select className="adm-input" value={testKind} onChange={(e) => setTestKind(e.target.value as 'invite' | 'reminder')}>
                <option value="invite">Save the Date</option>
                <option value="reminder">Reminder</option>
              </select>
            </label>
            <label>
              Member email
              <input className="adm-input" type="email" required value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="member@example.com" />
            </label>
            <button className="adm-btn adm-btn-primary" disabled={!!running || !testTo}>{running === 'test' ? 'Sending…' : 'Send test'}</button>
          </form>
        </section>
      </div>

      <EmailActivity password={password} upcoming={upcoming} allEvents={allEvents} />
    </>
  );
}

// ---------- event editor ----------

const TYPE_LABELS: Record<Event['type'], string> = {
  special: '👑 Special (orange)',
  adventure: '⭐ Adventure (green)',
  fairy: '🧚 Fairy (purple)',
  pirate: '🏴‍☠️ Pirate (red)',
};

const AUDIENCES = ['כל המשפחה', 'חברים בלבד', 'גברים בלבד', 'נשים בלבד', 'ילדים'];

function EventEditor(props: {
  event: Event | null;
  password: string;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
  notify: Notify;
}) {
  const { event, password, onClose, onSaved, notify } = props;
  const [form, setForm] = useState(() => ({
    title: event?.title ?? '',
    date: event?.date ?? '',
    endDate: event?.endDate ?? '',
    time: known(event?.time),
    location: known(event?.location),
    description: event?.description ?? '',
    ageGroup: event?.ageGroup ?? 'כל המשפחה',
    price: event?.price ?? '',
    type: event?.type ?? ('special' as Event['type']),
  }));
  const [busy, setBusy] = useState<'' | 'save' | 'delete'>('');
  const [error, setError] = useState('');
  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('save');
    setError('');
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ ...(event && { id: event.id, spotsLeft: event.spotsLeft }), ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Save failed');
      await onSaved(event ? `Saved “${data.event.title}”` : `Added “${data.event.title}” to the calendar`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy('');
    }
  };

  const remove = async () => {
    if (!event || !confirm(`Delete “${event.title}” (${fmtDate(event.date)}) from the calendar? This can't be undone.`)) return;
    setBusy('delete');
    try {
      const res = await fetch(`/api/events?id=${event.id}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      await onSaved(`Deleted “${event.title}”`);
    } catch (err) {
      notify(`Delete failed: ${err instanceof Error ? err.message : err}`, 'err');
      setBusy('');
    }
  };

  return (
    <div className="adm-modal" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="adm-card adm-modal-box adm-form" onSubmit={save}>
        <div className="adm-modal-head">
          <h2>{event ? `Edit event #${event.id}` : 'New event'}</h2>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={onClose} disabled={!!busy} aria-label="Close">✕</button>
        </div>

        <label>
          Title
          <input className="adm-input" dir="auto" required value={form.title} onChange={set('title')} placeholder="🏇 יום במרוצים" autoFocus />
          <small className="adm-muted">Start with an emoji — it shows on the calendar on phones.</small>
        </label>

        <div className="adm-form-row">
          <label>
            Date
            <input className="adm-input" type="date" required value={form.date} onChange={set('date')} />
          </label>
          <label>
            Last day <span className="adm-muted">(multi-day only)</span>
            <input className="adm-input" type="date" min={form.date || undefined} value={form.endDate} onChange={set('endDate')} />
          </label>
        </div>

        <div className="adm-form-row">
          <label>
            Time
            <input className="adm-input" value={form.time} onChange={set('time')} placeholder="19:30 or 16:00-18:00" />
            <small className="adm-muted">Empty = “{TBA}”</small>
          </label>
          <label>
            Type / color
            <select className="adm-input" value={form.type} onChange={set('type')}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Location
          <input className="adm-input" dir="auto" value={form.location} onChange={set('location')} placeholder="Venue name, street, city" />
          <small className="adm-muted">Venue first, then the address, separated by commas. Empty = “{TBA}”</small>
        </label>

        <label>
          Description
          <textarea className="adm-input" dir="auto" rows={3} value={form.description} onChange={set('description')} />
        </label>

        <div className="adm-form-row">
          <label>
            Who is invited
            <input className="adm-input" dir="auto" list="adm-audiences" value={form.ageGroup} onChange={set('ageGroup')} />
            <datalist id="adm-audiences">
              {AUDIENCES.map((a) => <option key={a} value={a} />)}
            </datalist>
          </label>
          <label>
            Price <span className="adm-muted">(optional)</span>
            <input className="adm-input" dir="auto" value={form.price} onChange={set('price')} placeholder="חינם / $40" />
          </label>
        </div>

        {!event && (
          <div className="adm-alert adm-alert-warn">
            All active members get a <b>Save the Date</b> email for a new upcoming event on the next daily email run
            (or right away with “Send due emails now”).
          </div>
        )}
        {error && <div className="adm-alert adm-alert-err">{error}</div>}

        <div className="adm-modal-actions">
          {event && (
            <button type="button" className="adm-btn adm-btn-danger" onClick={remove} disabled={!!busy}>
              {busy === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <span style={{ flex: 1 }} />
          <button type="button" className="adm-btn" onClick={onClose} disabled={!!busy}>Cancel</button>
          <button className="adm-btn adm-btn-primary" disabled={!!busy}>
            {busy === 'save' ? 'Saving…' : event ? 'Save changes' : 'Add event'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------- email activity ----------

interface ActivityRow {
  name: string;
  email: string;
  sentAt?: string;
  error?: string;
  opens: number;
  lastOpen?: string;
  clicks: number;
  lastClick?: string;
  links: string[];
}

interface ActivityData {
  summary: { sent: number; failed: number; opened: number; clicked: number };
  rows: ActivityRow[];
}

function EmailActivity({ password, upcoming, allEvents }: { password: string; upcoming: Event[]; allEvents: Event[] }) {
  const options = [...upcoming, ...allEvents.filter((e) => !upcoming.includes(e)).reverse()];
  const [eventId, setEventId] = useState<number>(options[0]?.id ?? 0);
  // Events load after the first render; pick the first one once they arrive
  const firstId = options[0]?.id;
  useEffect(() => {
    if (!eventId && firstId) setEventId(firstId);
  }, [eventId, firstId]);
  const [kind, setKind] = useState<'invite' | 'reminder' | 'test'>('invite');
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/events/activity?eventId=${eventId}&kind=${kind}`, {
        headers: { 'x-admin-password': password },
        cache: 'no-store',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || json.message || 'Failed to load');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [password, eventId, kind]);

  useEffect(() => {
    if (eventId) load();
  }, [load, eventId]);

  const s = data?.summary;
  const pct = (n: number) => (s && s.sent ? ` (${Math.round((n / s.sent) * 100)}%)` : '');

  return (
    <section className="adm-card adm-table-wrap">
      <div style={{ padding: '1rem 1rem 0' }}>
        <h2>Email activity</h2>
        <p className="adm-muted adm-small">
          Who got each email, opened it and clicked a link. Opens are approximate: some email apps hide images
          (counted once they click), and Apple Mail can load images on its own. Emails sent before tracking was added show as not sent.
        </p>
        <div className="adm-actions">
          <select className="adm-input" value={eventId} onChange={(e) => setEventId(Number(e.target.value))}>
            {options.map((e) => (
              <option key={`${e.id}-${e.date}`} value={e.id}>#{e.id} · {e.title} ({e.date})</option>
            ))}
          </select>
          <select className="adm-input" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="invite">Save the Date</option>
            <option value="reminder">Reminder</option>
            <option value="test">Test sends</option>
          </select>
          <button className="adm-btn" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
        {error && <div className="adm-alert adm-alert-warn">{error}</div>}
        {s && (
          <div className="adm-actions">
            <span className="adm-pill">✉️ Sent {s.sent}</span>
            <span className="adm-pill">👀 Opened {s.opened}{pct(s.opened)}</span>
            <span className="adm-pill">🔗 Clicked {s.clicked}{pct(s.clicked)}</span>
            {s.failed > 0 && <span className="adm-pill is-warn">⚠️ Failed {s.failed}</span>}
          </div>
        )}
      </div>
      {data && (
        data.rows.length === 0 ? (
          <Empty>Nothing sent yet.</Empty>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Member</th><th>Sent</th><th>Opened</th><th>Clicked</th></tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.email}>
                  <td dir="auto">{r.name}<div className="adm-muted adm-small">{r.email}</div></td>
                  <td className="adm-small">
                    {r.error ? <span className="adm-pill is-warn" title={r.error}>failed</span> : r.sentAt ? fmtDateTime(r.sentAt) : <span className="adm-muted">—</span>}
                  </td>
                  <td className="adm-small">
                    {r.opens ? <>✅ {fmtDateTime(r.lastOpen)}{r.opens > 1 && <span className="adm-muted"> · {r.opens}×</span>}</> : <span className="adm-muted">—</span>}
                  </td>
                  <td className="adm-small">
                    {r.clicks ? <>🔗 {r.links.join(', ')}{r.clicks > 1 && <span className="adm-muted"> · {r.clicks}×</span>}</> : <span className="adm-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </section>
  );
}

// ---------- polls ----------

function Polls({ password, polls, reload, notify }: { password: string; polls: Poll[]; reload: () => Promise<void>; notify: Notify }) {
  const [busy, setBusy] = useState<string | null>(null);
  const sorted = [...polls].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const toggle = async (p: Poll) => {
    setBusy(p.id);
    try {
      const res = await fetch('/api/polls/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ pollId: p.id, active: !p.isActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      notify(p.isActive ? 'Poll closed' : 'Poll opened (other polls closed)');
      await reload();
    } catch (e) {
      notify(`Update failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (p: Poll) => {
    if (!confirm(`Delete the poll "${p.question}" and all its votes? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/polls/delete?pollId=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      notify('Poll deleted');
      await reload();
    } catch (e) {
      notify(`Delete failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Header title="Polls" subtitle={`${polls.length} polls · only one can be open at a time`}>
        <a className="adm-btn adm-btn-primary" href="/polls/create">➕ New poll</a>
      </Header>
      {sorted.length === 0 ? (
        <Empty>No polls yet.</Empty>
      ) : (
        <div className="adm-stack">
          {sorted.map((p) => {
            const total = p.options.reduce((s, o) => s + o.votes, 0);
            const max = Math.max(1, ...p.options.map((o) => o.votes));
            return (
              <section key={p.id} className="adm-card">
                <div className="adm-poll-head">
                  <div>
                    <h2 dir="auto">{p.question}</h2>
                    <small className="adm-muted">
                      Created {fmtDateTime(p.createdAt)}
                      {p.deadline && ` · deadline ${p.deadline}`}
                      {p.allowMultipleAnswers && ' · multiple answers'}
                      {` · ${total} votes`}
                    </small>
                  </div>
                  <span className={`adm-pill ${p.isActive ? 'is-ok' : ''}`}>{p.isActive ? 'Open' : 'Closed'}</span>
                </div>
                <div className="adm-bars">
                  {p.options.map((o) => (
                    <div key={o.id} className="adm-bar">
                      <span dir="auto">{o.text}</span>
                      <div className="adm-bar-track"><div style={{ width: `${(o.votes / max) * 100}%` }} /></div>
                      <span className="adm-bar-n">{o.votes}</span>
                    </div>
                  ))}
                </div>
                <div className="adm-actions">
                  <a className="adm-btn adm-btn-sm" href={`/polls/results?pollId=${p.id}`}>Results & voters</a>
                  <a className="adm-btn adm-btn-sm" href={`/polls/vote?pollId=${p.id}`}>Vote page</a>
                  <button className="adm-btn adm-btn-sm" onClick={() => toggle(p)} disabled={busy === p.id}>
                    {p.isActive ? 'Close poll' : 'Open poll'}
                  </button>
                  <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(p)} disabled={busy === p.id}>Delete</button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

// ---------- payments ----------

const CATEGORY_LABEL: Record<Payment['category'], string> = { event: 'Event', quarterly: 'Quarterly dues', other: 'Other' };

function Payments({ password, payments, reload, notify }: { password: string; payments: Payment[]; reload: () => Promise<void>; notify: Notify }) {
  const [syncing, setSyncing] = useState(false);
  const year = new Date().getFullYear().toString();
  const thisYear = payments.filter((p) => p.date.startsWith(year));
  const byCategory = (['event', 'quarterly', 'other'] as const).map((c) => ({
    c,
    total: thisYear.filter((p) => p.category === c).reduce((s, p) => s + p.amount, 0),
  }));
  const review = payments.filter((p) => p.needsReview);
  const recent = [...payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  const sync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/payments/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || data.error);
      notify(data.message || 'Sync complete');
      await reload();
    } catch (e) {
      notify(`Sync failed: ${e instanceof Error ? e.message : e}`, 'err');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <Header title="Payments" subtitle="Zelle payments synced from the group Gmail.">
        <button className="adm-btn" onClick={sync} disabled={syncing}>{syncing ? 'Syncing…' : '↻ Sync from Gmail'}</button>
        <a className="adm-btn adm-btn-primary" href="/payments">Review & edit →</a>
      </Header>
      <div className="adm-stats">
        <Stat label={`Total ${year}`} value={money(thisYear.reduce((s, p) => s + p.amount, 0))} hint={`${thisYear.length} payments`} />
        {byCategory.map(({ c, total }) => (
          <Stat key={c} label={CATEGORY_LABEL[c]} value={money(total)} hint={year} />
        ))}
      </div>
      {review.length > 0 && (
        <div className="adm-alert adm-alert-warn">
          ⚠️ {review.length} payment(s) need review (unknown member or category). <a href="/payments">Fix them on the payments page →</a>
        </div>
      )}
      <section className="adm-card adm-table-wrap">
        <h2>Recent payments</h2>
        {recent.length === 0 ? (
          <Empty>No payments synced yet.</Empty>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Date</th><th>Member</th><th>Amount</th><th>Category</th><th>Memo</th></tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td className="adm-small">{p.date}</td>
                  <td dir="auto">{p.memberName || <span className="adm-muted">{p.payerNameRaw}</span>}</td>
                  <td><strong>{money(p.amount)}</strong></td>
                  <td>
                    {CATEGORY_LABEL[p.category]}
                    {p.needsReview && <span className="adm-pill is-warn" style={{ marginInlineStart: 6 }}>review</span>}
                  </td>
                  <td dir="auto" className="adm-small">{p.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

// ---------- gallery & tools ----------

function Gallery() {
  return (
    <>
      <Header title="Gallery" subtitle="Photo albums are stored in the repository under public/images." />
      <div className="adm-grid-2">
        <a className="adm-card adm-link-card" href="/admin/photos">
          <span className="adm-link-icon">🗑️</span>
          <strong>Manage gallery photos</strong>
          <small className="adm-muted">Browse every album with file sizes and delete photos or videos in bulk.</small>
        </a>
        <a className="adm-card adm-link-card" href="/galleries">
          <span className="adm-link-icon">🖼️</span>
          <strong>View public galleries</strong>
          <small className="adm-muted">See the albums the way members see them.</small>
        </a>
      </div>
    </>
  );
}

function Tools() {
  const links = [
    { href: '/worldcup', icon: '⚽', title: 'World Cup voting', desc: 'Votes and admin mode (same admin password).' },
    { href: '/payments', icon: '💵', title: 'Payments page', desc: 'Assign members and categories, delete payments, enable push alerts.' },
    { href: '/polls/create', icon: '🗳️', title: 'Create poll', desc: 'Start a new poll; it becomes the active one.' },
    { href: '/calendar', icon: '📅', title: 'Calendar', desc: 'Public event calendar and birthdays.' },
    { href: '/takanon', icon: '📜', title: 'Bylaws (Takanon)', desc: 'Group rules page.' },
    { href: '/api/health', icon: '🩺', title: 'Health check', desc: 'Pings the database (also runs daily).' },
  ];
  return (
    <>
      <Header title="Site Tools" subtitle="Shortcuts to the other admin areas of the site." />
      <div className="adm-grid-3">
        {links.map((l) => (
          <a key={l.href} className="adm-card adm-link-card" href={l.href}>
            <span className="adm-link-icon">{l.icon}</span>
            <strong>{l.title}</strong>
            <small className="adm-muted">{l.desc}</small>
          </a>
        ))}
      </div>
    </>
  );
}

// ---------- styles ----------

const CSS = `
.adm-root{--bg:#f4f6fb;--card:#fff;--text:#1f2937;--muted:#6b7280;--line:#e5e7eb;--brand:#0f766e;--brand-soft:#ccfbf1;--danger:#dc2626;--warn:#b45309;--warn-soft:#fef3c7;--ok:#047857;--ok-soft:#d1fae5;
  background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;min-height:100vh;font-size:15px;line-height:1.45}
.adm-root *{box-sizing:border-box}
.adm-root h1,.adm-root h2{font-family:inherit;color:inherit}
.adm-center{display:flex;align-items:center;justify-content:center;padding:2rem 1rem}
.adm-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:1.1rem 1.2rem;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.adm-card h2{font-size:1rem;font-weight:700;margin:0 0 .75rem}
.adm-login{width:100%;max-width:380px;text-align:center;display:flex;flex-direction:column;gap:.8rem;padding:2rem}
.adm-login h1{margin:0;font-size:1.5rem}
.adm-login-icon{font-size:2.4rem}
.adm-muted{color:var(--muted)}
.adm-small{font-size:.82rem}
.adm-input{width:100%;padding:.6rem .75rem;border:1px solid #d1d5db;border-radius:9px;font:inherit;background:#fff;color:inherit}
.adm-input:focus{outline:2px solid var(--brand-soft);border-color:var(--brand)}
.adm-btn{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.55rem .95rem;border-radius:9px;border:1px solid var(--line);background:#fff;color:var(--text);font:inherit;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap}
.adm-btn:hover:not(:disabled){border-color:#cbd5e1;background:#f9fafb}
.adm-btn:disabled{opacity:.55;cursor:not-allowed}
.adm-btn-primary{background:var(--brand);border-color:var(--brand);color:#fff}
.adm-btn-primary:hover:not(:disabled){background:#115e59;border-color:#115e59}
.adm-btn-danger{color:var(--danger);border-color:#fecaca}
.adm-btn-danger:hover:not(:disabled){background:#fef2f2}
.adm-btn-ghost{background:transparent;border-color:transparent;color:#cbd5e1;justify-content:flex-start}
.adm-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.08);border-color:transparent}
.adm-btn-sm{padding:.3rem .6rem;font-size:.82rem}
.adm-btn-block{width:100%}
.adm-shell{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
.adm-nav{background:#0f172a;color:#e2e8f0;padding:1.2rem .8rem;display:flex;flex-direction:column;gap:1rem;position:sticky;top:0;height:100vh}
.adm-brand{display:flex;gap:.6rem;align-items:center;padding:0 .4rem .6rem;border-bottom:1px solid rgba(255,255,255,.08);font-size:1.6rem}
.adm-brand strong{display:block;font-size:.98rem}
.adm-brand small{display:block;font-size:.75rem;color:#94a3b8}
.adm-nav nav{display:flex;flex-direction:column;gap:2px;flex:1}
.adm-nav-item{display:flex;align-items:center;gap:.6rem;padding:.6rem .7rem;border-radius:9px;border:0;background:transparent;color:#cbd5e1;font:inherit;font-weight:500;cursor:pointer;text-align:start}
.adm-nav-item:hover{background:rgba(255,255,255,.06);color:#fff}
.adm-nav-item.is-active{background:rgba(45,212,191,.15);color:#5eead4}
.adm-nav-icon{width:1.4rem;text-align:center}
.adm-badge-dot{margin-inline-start:auto;background:#f59e0b;color:#111;border-radius:999px;font-size:.72rem;padding:0 .45rem;font-weight:700}
.adm-nav-foot{display:flex;flex-direction:column;gap:2px}
.adm-main{padding:1.6rem 2rem 3rem;max-width:1200px;width:100%;display:flex;flex-direction:column;gap:1rem;min-width:0}
.adm-header{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap;margin-bottom:.25rem}
.adm-header h1{font-size:1.55rem;margin:0}
.adm-header p{margin:.2rem 0 0}
.adm-actions{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem}
.adm-header .adm-actions{margin-top:0}
.adm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:.8rem}
.adm-stat{display:flex;flex-direction:column;gap:.15rem;text-align:start;font:inherit;color:inherit;cursor:pointer}
.adm-stat:disabled{cursor:default}
.adm-stat:hover:not(:disabled){border-color:var(--brand)}
.adm-stat.is-warn{border-color:#fcd34d;background:#fffbeb}
.adm-stat-label{font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}
.adm-stat-value{font-size:1.6rem;font-weight:800}
.adm-stat-hint{font-size:.82rem;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.adm-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.adm-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.adm-stack{display:flex;flex-direction:column;gap:1rem}
.adm-list{list-style:none;margin:0;padding:0}
.adm-list li{display:flex;justify-content:space-between;align-items:center;gap:.75rem;padding:.55rem 0;border-top:1px solid var(--line)}
.adm-list li:first-child{border-top:0}
.adm-list small{display:block;color:var(--muted);font-size:.8rem}
.adm-pill{display:inline-block;padding:.15rem .55rem;border-radius:999px;background:#eef2f7;color:#334155;font-size:.75rem;font-weight:600;white-space:nowrap}
.adm-pill.is-ok{background:var(--ok-soft);color:var(--ok)}
.adm-pill.is-warn{background:var(--warn-soft);color:var(--warn)}
.adm-quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.5rem}
.adm-quick .adm-btn{white-space:normal;min-width:0}
.adm-empty{padding:1.5rem;text-align:center;color:var(--muted);background:#fafbfc;border:1px dashed var(--line);border-radius:12px}
.adm-alert{padding:.75rem 1rem;border-radius:10px;font-size:.92rem}
.adm-alert-err{background:#fef2f2;color:var(--danger);border:1px solid #fecaca}
.adm-alert-warn{background:var(--warn-soft);color:#78350f;border:1px solid #fcd34d}
.adm-alert-warn a{color:inherit;font-weight:700}
.adm-toolbar{display:grid;grid-template-columns:2fr 1fr;gap:.6rem;padding:.75rem}
.adm-table-wrap{overflow-x:auto;padding:0}
.adm-table-wrap h2{padding:1.1rem 1.2rem 0}
.adm-table{width:100%;border-collapse:collapse;font-size:.9rem}
.adm-table th{text-align:start;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);padding:.7rem 1rem;border-bottom:1px solid var(--line);background:#fafbfc}
.adm-table td{padding:.7rem 1rem;border-bottom:1px solid var(--line);vertical-align:top}
.adm-table tr:last-child td{border-bottom:0}
.adm-table a{color:var(--brand);text-decoration:none}
.adm-row-actions{display:flex;gap:.35rem;justify-content:flex-end}
.adm-subrow td{background:#fafbfc;font-size:.88rem}
.adm-events{display:flex;flex-direction:column}
.adm-event{display:flex;align-items:center;gap:.9rem;padding:.7rem 0;border-top:1px solid var(--line)}
.adm-event:first-child{border-top:0}
.adm-event-date{width:52px;flex:none;text-align:center;border-radius:10px;background:var(--brand-soft);color:var(--brand);padding:.3rem 0;line-height:1.1}
.adm-event-date span{display:block;font-size:.7rem;text-transform:uppercase;font-weight:700}
.adm-event-date strong{font-size:1.25rem}
.adm-event-body{flex:1;min-width:0}
.adm-event-body small{display:block;color:var(--muted)}
.adm-event-tags{display:flex;gap:.35rem;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.adm-result{margin-top:.9rem;padding:.8rem 1rem;background:#f8fafc;border:1px solid var(--line);border-radius:10px}
.adm-result ul{margin:.4rem 0 0;padding-inline-start:1.2rem}
.adm-form{display:flex;flex-direction:column;gap:.6rem}
.adm-form label{display:flex;flex-direction:column;gap:.25rem;font-size:.85rem;font-weight:600}
.adm-poll-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}
.adm-poll-head h2{margin:0 0 .2rem}
.adm-bars{display:flex;flex-direction:column;gap:.4rem;margin:.9rem 0 .2rem}
.adm-bar{display:grid;grid-template-columns:minmax(0,1.2fr) 2fr 2.5rem;gap:.6rem;align-items:center;font-size:.88rem}
.adm-bar-track{height:8px;background:#eef2f7;border-radius:999px;overflow:hidden}
.adm-bar-track div{height:100%;background:var(--brand);border-radius:999px}
.adm-bar-n{text-align:end;font-weight:700}
.adm-link-card{display:flex;flex-direction:column;gap:.3rem;text-decoration:none;color:inherit}
.adm-link-card:hover{border-color:var(--brand)}
.adm-link-icon{font-size:1.6rem}
.adm-modal{position:fixed;inset:0;z-index:1000;background:rgba(15,23,42,.5);display:flex;align-items:flex-start;justify-content:center;padding:4vh 1rem;overflow-y:auto}
.adm-modal-box{width:100%;max-width:620px;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.adm-modal-head{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.adm-modal-head h2{margin:0}
.adm-modal-actions{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.4rem}
.adm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.adm-form label small{font-weight:400}
.adm-form textarea{resize:vertical;font:inherit}
.adm-past summary{cursor:pointer;font-weight:700}
.adm-past[open] summary{margin-bottom:.4rem}
@media (max-width:600px){.adm-form-row{grid-template-columns:1fr}}
.adm-toast{position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:.7rem 1.1rem;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:50;max-width:calc(100% - 2rem)}
.adm-toast.is-err{background:var(--danger)}
@media (max-width:900px){
  .adm-shell{grid-template-columns:1fr}
  .adm-nav{position:static;height:auto;flex-direction:row;align-items:center;padding:.4rem;gap:.5rem;overflow-x:auto}
  .adm-brand{display:none}
  .adm-nav-foot{flex-direction:row}
  .adm-nav-foot .adm-btn{width:auto}
  .adm-nav nav{flex-direction:row;gap:.25rem}
  .adm-nav-item{white-space:nowrap;padding:.45rem .65rem}
  .adm-main{padding:1rem 1rem 3rem}
  .adm-grid-2,.adm-grid-3{grid-template-columns:1fr}
  .adm-toolbar{grid-template-columns:1fr}
}
`;

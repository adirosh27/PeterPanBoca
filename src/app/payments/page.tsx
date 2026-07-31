'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { teamMembers } from '@/lib/members';
import type { Payment, PaymentCategory } from '@/lib/payments-db';

const CATEGORY_META: Record<PaymentCategory, { label: string; icon: string; color: string }> = {
  event: { label: 'אירוע', icon: '🎫', color: '#f59e0b' },
  quarterly: { label: 'דמי רבעון', icon: '📅', color: '#10b981' },
  other: { label: 'אחר', icon: '💵', color: '#6b7280' },
};

const formatUSD = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState<'all' | PaymentCategory>('all');

  const [adminPassword, setAdminPassword] = useState('');
  const adminMode = adminPassword !== '';
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
    const saved = localStorage.getItem('payments-admin-pw');
    if (saved) setAdminPassword(saved);
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments/results');
      const data = await res.json();
      if (data.success) setPayments(data.payments || []);
      else setError(data.message || 'שגיאה בטעינת התשלומים');
    } catch {
      setError('שגיאה בטעינת התשלומים');
    } finally {
      setIsLoaded(true);
    }
  };

  const enterAdminMode = async () => {
    const input = prompt('הזן סיסמת מנהל:');
    if (!input) return;
    try {
      const res = await fetch(`/api/payments/admin?password=${encodeURIComponent(input)}`);
      const data = await res.json();
      if (data.valid) {
        setAdminPassword(input);
        localStorage.setItem('payments-admin-pw', input);
        setError('');
      } else {
        alert('סיסמת מנהל שגויה');
      }
    } catch {
      alert('שגיאה באימות סיסמה');
    }
  };

  const exitAdminMode = () => {
    setAdminPassword('');
    setEditingId(null);
    localStorage.removeItem('payments-admin-pw');
  };

  const runSync = async () => {
    setSyncing(true);
    setNotice('');
    setError('');
    try {
      const res = await fetch('/api/payments/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(data.message || 'הסנכרון הושלם');
        await fetchPayments();
      } else {
        setError(data.message || 'הסנכרון נכשל');
      }
    } catch {
      setError('הסנכרון נכשל');
    } finally {
      setSyncing(false);
    }
  };

  const saveEdit = async (id: string, memberName: string | null, category: PaymentCategory) => {
    try {
      const res = await fetch('/api/payments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, memberName, category, adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        await fetchPayments();
      } else {
        alert(data.message || 'העדכון נכשל');
      }
    } catch {
      alert('העדכון נכשל');
    }
  };

  const deletePaymentRow = async (id: string) => {
    if (!confirm('למחוק את התשלום הזה?')) return;
    try {
      const res = await fetch(
        `/api/payments/update?id=${encodeURIComponent(id)}&adminPassword=${encodeURIComponent(adminPassword)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) await fetchPayments();
      else alert(data.message || 'המחיקה נכשלה');
    } catch {
      alert('המחיקה נכשלה');
    }
  };

  const sorted = useMemo(
    () => [...payments].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [payments]
  );
  const visible = useMemo(
    () => (filter === 'all' ? sorted : sorted.filter((p) => p.category === filter)),
    [sorted, filter]
  );

  const totals = useMemo(() => {
    const t = { all: 0, event: 0, quarterly: 0, other: 0 } as Record<'all' | PaymentCategory, number>;
    for (const p of payments) {
      t.all += p.amount;
      t[p.category] += p.amount;
    }
    return t;
  }, [payments]);

  const needsReview = useMemo(() => payments.filter((p) => p.needsReview), [payments]);

  // Who has paid (within the active category filter): member name -> total & count.
  const paidByMember = useMemo(() => {
    const src = filter === 'all' ? payments : payments.filter((p) => p.category === filter);
    const map = new Map<string, { total: number; count: number }>();
    for (const p of src) {
      if (!p.memberName) continue;
      const cur = map.get(p.memberName) || { total: 0, count: 0 };
      cur.total += p.amount;
      cur.count += 1;
      map.set(p.memberName, cur);
    }
    return map;
  }, [payments, filter]);

  const roster = useMemo(
    () =>
      [...teamMembers]
        .map((m) => ({ name: m.name, icon: m.icon, paid: paidByMember.get(m.name) }))
        .sort((a, b) => (a.paid ? 0 : 1) - (b.paid ? 0 : 1)),
    [paidByMember]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: '1rem',
        fontFamily: 'system-ui',
        direction: 'rtl',
      }}
    >
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>
            ← חזרה לדף הבית
          </Link>
          <button
            onClick={adminMode ? exitAdminMode : enterAdminMode}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              border: adminMode ? '2px solid #f59e0b' : '2px solid #e5e7eb',
              background: adminMode ? '#fffbeb' : 'white',
              color: adminMode ? '#92400e' : '#6b7280',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {adminMode ? '🔓 מצב מנהל פעיל — יציאה' : '🔒 מצב מנהל'}
          </button>
        </div>

        {/* Header */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              fontWeight: 800,
              margin: 0,
              background: 'linear-gradient(45deg, #10b981, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            תשלומי הקבוצה
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#374151', marginTop: '0.75rem', marginBottom: 0 }}>
            תשלומים שהתקבלו ב-Zelle עבור אירועים ודמי הרבעון
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', textAlign: 'center', color: '#991b1b', fontWeight: 700 }}>
            {error}
          </div>
        )}
        {notice && (
          <div style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', textAlign: 'center', color: '#065f46', fontWeight: 700 }}>
            {notice}
          </div>
        )}

        {/* Admin sync */}
        {adminMode && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <button
              onClick={runSync}
              disabled={syncing}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                border: 'none',
                background: syncing ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: syncing ? 'default' : 'pointer',
              }}
            >
              {syncing ? '⏳ מסנכרן…' : '🔄 סנכרן תשלומים מ-Gmail'}
            </button>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.75rem', marginBottom: 0 }}>
              קורא את הודעות ה-Zelle מתיבת המייל של הקבוצה ומעדכן את הרשימה.
            </p>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <SummaryCard label="סה״כ התקבל" value={formatUSD(totals.all)} icon="💰" color="#111827" big />
          {(['event', 'quarterly', 'other'] as PaymentCategory[]).map((c) => (
            <SummaryCard key={c} label={CATEGORY_META[c].label} value={formatUSD(totals[c])} icon={CATEGORY_META[c].icon} color={CATEGORY_META[c].color} />
          ))}
        </div>

        {/* Needs-review (admin only) */}
        {adminMode && needsReview.length > 0 && (
          <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '0.5rem' }}>
              ⚠️ {needsReview.length} תשלומים דורשים בדיקה (חבר או קטגוריה לא זוהו)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#92400e' }}>
              לחצו על ✏️ ליד תשלום כדי לשייך חבר ולקבוע קטגוריה.
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center' }}>
          {(['all', 'event', 'quarterly', 'other'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: filter === c ? '2px solid #10b981' : '1px solid #e5e7eb',
                background: filter === c ? '#ecfdf5' : 'white',
                color: filter === c ? '#065f46' : '#6b7280',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {c === 'all' ? 'הכול' : `${CATEGORY_META[c].icon} ${CATEGORY_META[c].label}`}
            </button>
          ))}
        </div>

        {/* Who paid — member roster */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
              👥 מי שילם{filter !== 'all' ? ` · ${CATEGORY_META[filter].label}` : ''}
            </h3>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
              {paidByMember.size} מתוך {teamMembers.length} שילמו
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.5rem' }}>
            {roster.map((m) => (
              <div
                key={m.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  background: m.paid ? '#ecfdf5' : '#f9fafb',
                  border: `1px solid ${m.paid ? '#a7f3d0' : '#e5e7eb'}`,
                  opacity: m.paid ? 1 : 0.7,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: m.paid ? '#065f46' : '#6b7280' }}>
                  <span>{m.paid ? '✅' : '⭕'}</span>
                  {m.name}
                </span>
                {m.paid ? (
                  <span style={{ fontWeight: 800, color: '#059669', direction: 'ltr', fontSize: '0.85rem' }}>
                    {formatUSD(m.paid.total)}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>טרם שילם</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payments list */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
              {isLoaded ? 'אין תשלומים להצגה עדיין.' : 'טוען…'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {visible.map((p) => (
                <PaymentRow
                  key={p.id}
                  payment={p}
                  adminMode={adminMode}
                  isEditing={editingId === p.id}
                  onEdit={() => setEditingId(p.id)}
                  onCancel={() => setEditingId(null)}
                  onSave={saveEdit}
                  onDelete={deletePaymentRow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color, big }: { label: string; value: string; icon: string; color: string; big?: boolean }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontSize: big ? '1.5rem' : '1.2rem', fontWeight: 800, color, marginTop: '0.25rem', direction: 'ltr' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>{label}</div>
    </div>
  );
}

function PaymentRow({
  payment,
  adminMode,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  payment: Payment;
  adminMode: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (id: string, memberName: string | null, category: PaymentCategory) => void;
  onDelete: (id: string) => void;
}) {
  const meta = CATEGORY_META[payment.category];
  const [memberName, setMemberName] = useState<string>(payment.memberName || '');
  const [category, setCategory] = useState<PaymentCategory>(payment.category);

  useEffect(() => {
    setMemberName(payment.memberName || '');
    setCategory(payment.category);
  }, [payment, isEditing]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        background: payment.needsReview && adminMode ? '#fffbeb' : '#f9fafb',
        border: `1px solid ${payment.needsReview && adminMode ? '#fde68a' : '#e5e7eb'}`,
      }}
    >
      <div style={{ minWidth: '160px', flex: '1 1 200px' }}>
        <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '1rem' }}>
          {payment.memberName || payment.payerNameRaw}
          {!payment.memberName && (
            <span style={{ fontSize: '0.7rem', color: '#b45309', marginInlineStart: '0.4rem' }}>({payment.payerNameRaw})</span>
          )}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>
          {formatDate(payment.date)}
          {payment.memo ? ` · ${payment.memo}` : ''}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'white',
            background: meta.color,
            borderRadius: '999px',
            padding: '0.2rem 0.6rem',
            whiteSpace: 'nowrap',
          }}
        >
          {meta.icon} {meta.label}
        </span>
        <span style={{ fontWeight: 800, color: '#111827', direction: 'ltr', fontSize: '1rem', minWidth: '80px', textAlign: 'left' }}>
          {formatUSD(payment.amount)}
        </span>
        {adminMode && !isEditing && (
          <button onClick={onEdit} title="ערוך" style={iconBtn}>✏️</button>
        )}
      </div>

      {adminMode && isEditing && (
        <div style={{ flexBasis: '100%', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #e5e7eb' }}>
          <select value={memberName} onChange={(e) => setMemberName(e.target.value)} style={selectStyle}>
            <option value="">— לא משויך —</option>
            {teamMembers.map((m) => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value as PaymentCategory)} style={selectStyle}>
            <option value="event">🎫 אירוע</option>
            <option value="quarterly">📅 דמי רבעון</option>
            <option value="other">💵 אחר</option>
          </select>
          <button onClick={() => onSave(payment.id, memberName || null, category)} style={{ ...actionBtn, background: '#10b981', color: 'white' }}>💾 שמור</button>
          <button onClick={onCancel} style={{ ...actionBtn, background: '#e5e7eb', color: '#374151' }}>ביטול</button>
          <button onClick={() => onDelete(payment.id)} style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b', marginInlineStart: 'auto' }}>🗑️ מחק</button>
        </div>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0.2rem',
};
const selectStyle: React.CSSProperties = {
  padding: '0.4rem 0.6rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.85rem',
  background: 'white',
};
const actionBtn: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer',
};

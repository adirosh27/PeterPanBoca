'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { teamMembers } from '@/lib/members';
import {
  worldCupTeams,
  worldCupTeamsByCode,
  confederationOrder,
  confederationNamesHe,
  formatWinChance,
} from '@/lib/worldcup';

interface WorldCupVote {
  voterName: string;
  voterEmail: string;
  teamCode: string;
  votedAt: string;
  wasChanged?: boolean;
}

const emailFor = (memberName: string) => `${memberName}@peterpan.com`;

// Final of the 2026 FIFA World Cup (MetLife Stadium, New Jersey), 15:00 ET kickoff
const FINAL_DATE = '2026-07-19';
const FINAL_KICKOFF_TIME = new Date('2026-07-19T15:00:00-04:00').getTime();
// Opening match of the 2026 FIFA World Cup (Estadio Azteca, Mexico City), 20:00 Mexico City time (UTC-6)
const KICKOFF_TIME = new Date('2026-06-11T20:00:00-06:00').getTime();
// Voting/prediction changes are locked once the field is down to the semifinalists.
const VOTING_OPEN = false;
// Team code of the 2026 World Cup champion, once decided.
const CHAMPION_TEAM_CODE = 'ESP';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

const getCountdownTo = (targetTime: number): Countdown => {
  const diff = targetTime - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    started: false,
  };
};

const getCountdown = (): Countdown => getCountdownTo(KICKOFF_TIME);
const getFinalCountdown = (): Countdown => getCountdownTo(FINAL_KICKOFF_TIME);

export default function WorldCupPage() {
  const [votes, setVotes] = useState<WorldCupVote[]>([]);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingMember, setSavingMember] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const adminMode = adminPassword !== '';
  // The member this device already voted as (one vote per device).
  const [myVote, setMyVote] = useState<string | null>(null);
  // Live countdown to the opening match (null until mounted, to avoid SSR hydration mismatch).
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  // Live countdown to the final, shown once the tournament is underway.
  const [finalCountdown, setFinalCountdown] = useState<Countdown | null>(null);
  // The member whose row should play the flip+glow animation right after voting.
  const [justVoted, setJustVoted] = useState<string | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    setFinalCountdown(getFinalCountdown());
    const interval = setInterval(() => {
      setCountdown(getCountdown());
      setFinalCountdown(getFinalCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('worldcup-admin-pw');
    if (saved) setAdminPassword(saved);
    const savedVote = localStorage.getItem('worldcup-my-vote');
    if (savedVote) setMyVote(savedVote);
  }, []);

  // If this device's vote was removed (e.g. by an admin), release the lock.
  useEffect(() => {
    if (myVote && votes.length > 0 && !votes.some((v) => v.voterName === myVote)) {
      setMyVote(null);
      localStorage.removeItem('worldcup-my-vote');
    }
  }, [votes, myVote]);

  const enterAdminMode = async () => {
    const input = prompt('הזן סיסמת מנהל:');
    if (!input) return;
    try {
      const res = await fetch(`/api/worldcup/admin?password=${encodeURIComponent(input)}`);
      const data = await res.json();
      if (data.valid) {
        setAdminPassword(input);
        localStorage.setItem('worldcup-admin-pw', input);
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
    localStorage.removeItem('worldcup-admin-pw');
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/worldcup/results');
      const data = await response.json();
      if (data.success) {
        setVotes(data.votes || []);
        setTally(data.tally || {});
      }
    } catch (err) {
      console.error('Error loading results:', err);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleVote = async (memberName: string, teamCode: string) => {
    if (!teamCode) return;
    setSavingMember(memberName);
    setError('');
    try {
      const response = await fetch('/api/worldcup/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterName: memberName,
          voterEmail: emailFor(memberName),
          teamCode,
          adminPassword: adminMode ? adminPassword : undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Remember this device's own vote (skip when an admin is editing)
        if (!adminMode) {
          setMyVote(memberName);
          localStorage.setItem('worldcup-my-vote', memberName);
        }
        await fetchResults();
        // Trigger the celebratory flip+glow on this member's row.
        setJustVoted(memberName);
        setTimeout(() => setJustVoted((m) => (m === memberName ? null : m)), 1000);
      } else {
        alert(data.message || 'לא ניתן לשמור את הניחוש');
        setError(data.message || 'לא ניתן לשמור את הניחוש');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'אירעה שגיאה';
      alert(message);
      setError(message);
    } finally {
      setSavingMember(null);
    }
  };

  const handleDelete = async (memberName: string) => {
    if (!confirm(`למחוק את הניחוש של ${memberName}?`)) return;
    try {
      const response = await fetch(
        `/api/worldcup/vote?voterEmail=${encodeURIComponent(emailFor(memberName))}&adminPassword=${encodeURIComponent(adminPassword)}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (data.success) {
        await fetchResults();
      } else {
        setError(data.message || 'לא ניתן למחוק');
      }
    } catch (err) {
      setError('שגיאה במחיקה: ' + (err instanceof Error ? err.message : 'לא ידוע'));
    }
  };

  const voteMap = new Map<string, WorldCupVote>();
  votes.forEach((vote) => voteMap.set(vote.voterName, vote));

  const totalMembers = teamMembers.length;
  const votedMembers = votes.length;
  const progressPercentage = totalMembers > 0 ? Math.round((votedMembers / totalMembers) * 100) : 0;

  // Leaderboard - teams sorted by number of predictions
  const leaderboard = Object.entries(tally)
    .map(([code, count]) => ({ team: worldCupTeamsByCode[code], count }))
    .filter((entry) => entry.team)
    .sort((a, b) => b.count - a.count);

  const finalDateLabel = (() => {
    const [year, month, day] = FINAL_DATE.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  })();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: '1rem',
        fontFamily: 'system-ui',
      }}
    >
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes flagPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes voteFlip {
          0% { transform: perspective(900px) rotateY(0deg); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          50% { box-shadow: 0 0 28px 6px rgba(16, 185, 129, 0.55); }
          100% { transform: perspective(900px) rotateY(360deg); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @media (min-width: 640px) {
          .wc-container { padding: 2rem !important; }
        }
      `}</style>

      <div
        className="wc-container"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            ← חזרה לדף הבית
          </Link>
          {adminMode ? (
            <button
              onClick={exitAdminMode}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                border: '2px solid #f59e0b',
                background: '#fffbeb',
                color: '#92400e',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🔓 מצב מנהל פעיל — יציאה
            </button>
          ) : (
            <button
              onClick={enterAdminMode}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🔒 מצב מנהל
            </button>
          )}
        </div>

        {/* Header */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚽🏆</div>
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
            תחרות הניחושים - מונדיאל 2026
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#374151', marginTop: '1rem', marginBottom: 0 }}>
            כל חבר מנחש <strong>פעם אחת</strong> מי יזכה בגביע העולם 🏆
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              padding: '0.6rem 1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '2px solid #10b981',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            📅 הגמר: {finalDateLabel}
          </div>
        </div>

        {/* Countdown to kickoff */}
        {countdown && (
          <div
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              borderRadius: '24px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {!countdown.started ? (
              <>
                <div style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.9, marginBottom: '1rem' }}>
                  ⏳ עד פתיחת מונדיאל 2026 נותרו
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    direction: 'ltr',
                  }}
                >
                  {[
                    { value: countdown.days, label: 'ימים' },
                    { value: countdown.hours, label: 'שעות' },
                    { value: countdown.minutes, label: 'דקות' },
                    { value: countdown.seconds, label: 'שניות' },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        padding: '0.75rem 0.5rem',
                        minWidth: '70px',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.85, marginTop: '0.25rem' }}>
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : finalCountdown && !finalCountdown.started ? (
              <>
                <div style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.9, marginBottom: '1rem' }}>
                  🏆 עד הגמר נותרו
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    direction: 'ltr',
                  }}
                >
                  {[
                    { value: finalCountdown.days, label: 'ימים' },
                    { value: finalCountdown.hours, label: 'שעות' },
                    { value: finalCountdown.minutes, label: 'דקות' },
                    { value: finalCountdown.seconds, label: 'שניות' },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        padding: '0.75rem 0.5rem',
                        minWidth: '70px',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.85, marginTop: '0.25rem' }}>
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                🏆 {worldCupTeamsByCode[CHAMPION_TEAM_CODE]?.nameHe} אלופת העולם! 🎉
              </div>
            )}
          </div>
        )}

        {/* Winners of the prediction contest */}
        {countdown?.started && finalCountdown?.started && (() => {
          const champion = worldCupTeamsByCode[CHAMPION_TEAM_CODE];
          const winners = votes.filter((v) => v.teamCode === CHAMPION_TEAM_CODE);
          return (
            <div
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '24px',
                padding: '1.75rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                textAlign: 'center',
                color: '#78350f',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                🏅 מנצחי תחרות הניחושים
              </div>
              {winners.length > 0 ? (
                <>
                  <p style={{ margin: '0 0 1rem', fontWeight: 600 }}>
                    ניחשו נכון: <span className="flag-emoji">{champion?.flag}</span> {champion?.nameHe} תזכה בגביע!
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
                    {winners.map((w) => (
                      <span
                        key={w.voterEmail}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '999px',
                          padding: '0.4rem 1rem',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                        }}
                      >
                        🎉 {w.voterName}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, fontWeight: 600 }}>
                  אף אחד לא ניחש את <span className="flag-emoji">{champion?.flag}</span> {champion?.nameHe} 😅
                </p>
              )}
            </div>
          );
        })()}

        {/* Voting-closed notice */}
        {!VOTING_OPEN && !adminMode && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: '#991b1b',
              fontWeight: 700,
            }}
          >
            🔒 ההצבעה נסגרה - נותרו רק 4 נבחרות בתחרות. לא ניתן להוסיף או לשנות ניחושים יותר.
          </div>
        )}

        {/* This-device already-voted notice */}
        {VOTING_OPEN && myVote && !adminMode && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: '#065f46',
              fontWeight: 700,
            }}
          >
            ✅ הצבעת מהמכשיר הזה בתור <strong>{myVote}</strong>. לא ניתן להצביע עבור חברים אחרים.
          </div>
        )}

        {/* Progress Bar */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '2px solid #10b981',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#059669' }}>
              📊 התקדמות הניחושים
            </h3>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>
              {votedMembers} / {totalMembers}
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#f0fdf4',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #d1fae5',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {progressPercentage}%
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 1rem', color: '#111827' }}>
              🥇 הנבחרות המובילות בניחושים
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {leaderboard.map((entry, index) => {
                const pct = votedMembers > 0 ? Math.round((entry.count / votedMembers) * 100) : 0;
                return (
                  <div key={entry.team.code} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '1.5rem', fontWeight: 'bold', color: '#6b7280', textAlign: 'center' }}>
                      {index + 1}
                    </div>
                    <div className="flag-emoji" style={{ fontSize: '1.5rem', opacity: entry.team.eliminated ? 0.5 : 1 }}>{entry.team.flag}</div>
                    <div style={{ minWidth: '150px', fontWeight: 600, color: entry.team.eliminated ? '#9ca3af' : 'inherit' }}>
                      {entry.team.nameHe}
                      {entry.team.eliminated ? (
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#ef4444', marginInlineStart: '0.35rem' }}>
                          ❌ הודחה
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#f59e0b', marginInlineStart: '0.35rem' }}>
                          🏆 {formatWinChance(entry.team.winChance)}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: '20px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: entry.team.eliminated
                            ? 'linear-gradient(90deg, #d1d5db, #9ca3af)'
                            : 'linear-gradient(90deg, #10b981, #34d399)',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <div style={{ width: '3rem', textAlign: 'left', fontWeight: 'bold', color: '#10b981' }}>
                      {entry.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Members list */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: 'clamp(1rem, 4vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 1.25rem', textAlign: 'center', color: '#111827' }}>
            הניחוש שלי
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {teamMembers.map((member) => {
              const memberVote = voteMap.get(member.name);
              const hasVoted = !!memberVote;
              const votedTeam = memberVote ? worldCupTeamsByCode[memberVote.teamCode] : undefined;
              // This device already voted as someone else -> can't vote here
              const lockedForMe = !adminMode && !!myVote && myVote !== member.name;
              const disabled = savingMember === member.name || (hasVoted && !adminMode) || lockedForMe || (!adminMode && !VOTING_OPEN);

              return (
                <div
                  key={member.name}
                  style={{
                    backgroundColor: hasVoted ? '#f0fdf4' : '#f9fafb',
                    border: hasVoted ? '2px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    transition: 'all 0.3s ease',
                    animation: justVoted === member.name ? 'voteFlip 0.9s ease-in-out' : undefined,
                  }}
                >
                  <div
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        backgroundColor: `${member.color}20`,
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${member.color}40`,
                        flexShrink: 0,
                      }}
                    >
                      {member.icon}
                    </div>
                    {hasVoted && votedTeam && (
                      <div
                        className="flag-emoji"
                        title={votedTeam.nameHe}
                        style={{
                          fontSize: '2.4rem',
                          lineHeight: 1,
                          flexShrink: 0,
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                          animation: 'flagPop 0.4s ease-out',
                        }}
                      >
                        {votedTeam.flag}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{member.name}</div>
                      <div
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '12px',
                          marginTop: '0.25rem',
                          backgroundColor: hasVoted ? (votedTeam?.eliminated ? '#fee2e2' : '#d1fae5') : '#fef3c7',
                          color: hasVoted ? (votedTeam?.eliminated ? '#991b1b' : '#065f46') : '#92400e',
                          border: hasVoted ? `1px solid ${votedTeam?.eliminated ? '#ef4444' : '#10b981'}` : '1px solid #f59e0b',
                        }}
                      >
                        {hasVoted && votedTeam ? (
                          <>
                            {adminMode ? '' : '🔒 '}
                            <span className="flag-emoji">{votedTeam.flag}</span>{' '}
                            {votedTeam.nameHe}
                            {votedTeam.eliminated && ' — הודחה ❌'}
                          </>
                        ) : (
                          '⏳ טרם ניחש'
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={memberVote?.teamCode || ''}
                      disabled={disabled}
                      onChange={(e) => handleVote(member.name, e.target.value)}
                      style={{
                        minHeight: '44px',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: hasVoted ? '2px solid #10b981' : '2px solid #e5e7eb',
                        backgroundColor: disabled ? '#f3f4f6' : 'white',
                        color: disabled ? '#9ca3af' : 'inherit',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        minWidth: '200px',
                        direction: 'rtl',
                      }}
                    >
                      <option value="" disabled>
                        בחר נבחרת...
                      </option>
                      {confederationOrder.map((conf) => (
                        <optgroup key={conf} label={confederationNamesHe[conf]}>
                          {worldCupTeams
                            .filter((t) => t.confederation === conf)
                            .map((team) => (
                              <option
                                key={team.code}
                                value={team.code}
                                disabled={team.eliminated && memberVote?.teamCode !== team.code}
                              >
                                {team.flag} {team.nameHe} {team.eliminated ? '(❌ הודחה)' : `(${formatWinChance(team.winChance)})`}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>

                    {hasVoted && adminMode && (
                      <button
                        onClick={() => handleDelete(member.name)}
                        style={{
                          minHeight: '44px',
                          padding: '0.5rem 1rem',
                          border: '2px solid #ef4444',
                          borderRadius: '8px',
                          background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

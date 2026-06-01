'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { teamMembers } from '@/lib/members';
import {
  worldCupTeams,
  worldCupTeamsByCode,
  confederationOrder,
  confederationNamesHe,
} from '@/lib/worldcup';

interface WorldCupVote {
  voterName: string;
  voterEmail: string;
  teamCode: string;
  votedAt: string;
  wasChanged?: boolean;
}

const emailFor = (memberName: string) => `${memberName}@peterpan.com`;

// Final of the 2026 FIFA World Cup (MetLife Stadium, New Jersey)
const FINAL_DATE = '2026-07-19';

export default function WorldCupPage() {
  const [votes, setVotes] = useState<WorldCupVote[]>([]);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingMember, setSavingMember] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

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
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchResults();
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
        `/api/worldcup/vote?voterEmail=${encodeURIComponent(emailFor(memberName))}`,
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
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: '1rem',
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← חזרה לדף הבית
        </Link>

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
                    <div style={{ fontSize: '1.5rem' }}>{entry.team.flag}</div>
                    <div style={{ minWidth: '110px', fontWeight: 600 }}>{entry.team.nameHe}</div>
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
                          background: 'linear-gradient(90deg, #10b981, #34d399)',
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
                          backgroundColor: hasVoted ? '#d1fae5' : '#fef3c7',
                          color: hasVoted ? '#065f46' : '#92400e',
                          border: hasVoted ? '1px solid #10b981' : '1px solid #f59e0b',
                        }}
                      >
                        {hasVoted && votedTeam ? `${votedTeam.flag} ${votedTeam.nameHe}` : '⏳ טרם ניחש'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={memberVote?.teamCode || ''}
                      disabled={savingMember === member.name}
                      onChange={(e) => handleVote(member.name, e.target.value)}
                      style={{
                        minHeight: '44px',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: hasVoted ? '2px solid #10b981' : '2px solid #e5e7eb',
                        backgroundColor: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
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
                              <option key={team.code} value={team.code}>
                                {team.flag} {team.nameHe}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>

                    {hasVoted && (
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

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  eventDate?: string | null;
  deadline?: string | null;
  options: PollOption[];
  createdAt: string;
  isActive: boolean;
}

interface Vote {
  pollId: string;
  voterId: string;
  voterName: string;
  voterEmail: string;
  optionId: string;
  votedAt: string;
  wasChanged?: boolean;
  comment?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('pollId');

  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [votesByOption, setVotesByOption] = useState<Record<string, Vote[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allPolls, setAllPolls] = useState<Poll[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    fetchAllPolls();
  }, []);

  useEffect(() => {
    if (pollId) {
      fetchResults();
    } else if (allPolls.length > 0) {
      // If no pollId, show the most recent active poll
      const activePoll = allPolls.find(p => p.isActive) || allPolls[0];
      if (activePoll) {
        window.history.replaceState({}, '', `/polls/results?pollId=${activePoll.id}`);
        fetchResults(activePoll.id);
      }
    }
  }, [pollId, allPolls]);

  const fetchAllPolls = async () => {
    try {
      const response = await fetch('/api/polls?active=false');
      const data = await response.json();

      if (data.success && data.polls) {
        setAllPolls(data.polls);
      }
    } catch (err) {
      console.error('Error loading polls:', err);
    }
  };

  const fetchResults = async (targetPollId?: string) => {
    const id = targetPollId || pollId;
    if (!id) return;

    try {
      setLoading(true);
      setAnimateBars(false);
      const response = await fetch(`/api/polls/results?pollId=${id}`);
      const data = await response.json();

      if (data.success) {
        setPoll(data.poll);
        setVotes(data.votes || []);
        setVotesByOption(data.votesByOption || {});
        // Trigger animation after a short delay
        setTimeout(() => setAnimateBars(true), 100);
      } else {
        setError(data.message || 'Failed to load results');
      }
    } catch (err) {
      setError('Error loading results');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (pollIdToDelete: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הסקר הזה? פעולה זו לא ניתנת לביטול.')) {
      return;
    }

    setDeleting(pollIdToDelete);

    try {
      const response = await fetch(`/api/polls/delete?pollId=${pollIdToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh polls list
        await fetchAllPolls();

        // If we deleted the currently viewed poll, redirect to create page
        if (pollIdToDelete === pollId) {
          window.location.href = '/polls/create';
        }
      } else {
        setError(data.message || 'Failed to delete poll');
      }
    } catch (err) {
      setError('Error deleting poll');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui'
      }}>
        <style jsx global>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>טוען תוצאות...</div>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p>{error || 'סקר לא נמצא'}</p>
          <Link
            href="/polls/create"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #fbbf24)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            צור סקר חדש
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = votes.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            ← דף הבית
          </Link>
          <Link
            href="/polls/create"
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            ➕ צור סקר חדש
          </Link>
          <Link
            href={`/polls/vote?pollId=${poll.id}`}
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            🗳️ הצבע בסקר זה
          </Link>
        </div>

        {/* Poll selector if multiple polls exist */}
        {allPolls.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>בחר סקר:</label>
              {poll && (
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  disabled={deleting === poll.id}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: deleting === poll.id ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: deleting === poll.id ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {deleting === poll.id ? '🗑️ מוחק...' : '🗑️ מחק סקר זה'}
                </button>
              )}
            </div>
            <select
              value={poll.id}
              onChange={(e) => {
                window.location.href = `/polls/results?pollId=${e.target.value}`;
              }}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                width: '100%'
              }}
            >
              {allPolls.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.question.substring(0, 60)}... ({new Date(p.createdAt).toLocaleDateString('he-IL')})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📊 תוצאות הסקר
          </h1>

          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            whiteSpace: 'pre-wrap',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            {poll.question}
            <div style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              נוצר: {new Date(poll.createdAt).toLocaleString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            color: '#10b981'
          }}>
            סך הכל הצבעות: {totalVotes}
          </div>

          {/* Results by option */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {poll.options.map((option, optionIndex) => {
              const optionVotes = votesByOption[option.id] || [];
              const percentage = totalVotes > 0 ? (optionVotes.length / totalVotes * 100).toFixed(1) : '0';

              // Color scheme for each option (matching vote page)
              const optionColors = [
                { main: '#10b981', light: '#34d399', shadow: 'rgba(16, 185, 129, 0.4)' }, // Green
                { main: '#3b82f6', light: '#60a5fa', shadow: 'rgba(59, 130, 246, 0.4)' }, // Blue
                { main: '#f59e0b', light: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.4)' }, // Amber
                { main: '#8b5cf6', light: '#a78bfa', shadow: 'rgba(139, 92, 246, 0.4)' }, // Purple
                { main: '#ec4899', light: '#f472b6', shadow: 'rgba(236, 72, 153, 0.4)' }, // Pink
                { main: '#06b6d4', light: '#22d3ee', shadow: 'rgba(6, 182, 212, 0.4)' }, // Cyan
              ];
              const color = optionColors[optionIndex % optionColors.length];

              return (
                <div
                  key={option.id}
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      {option.text === 'מגיע' ? '✅' : '❌'} {option.text}
                    </h3>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: color.main
                    }}>
                      {optionVotes.length} ({percentage}%)
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '24px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      width: animateBars ? `${percentage}%` : '0%',
                      height: '100%',
                      background: `linear-gradient(90deg, ${color.main}, ${color.light}, ${color.main})`,
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 2px 8px ${color.shadow}`
                    }} />
                  </div>

                  {/* Voters list */}
                  {optionVotes.length > 0 && (
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: '#6b7280'
                      }}>
                        מצביעים:
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {optionVotes.map((vote) => (
                          <div
                            key={vote.voterId}
                            style={{
                              backgroundColor: 'white',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{vote.voterName}</div>
                              {vote.comment && (
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: '#4b5563',
                                  marginTop: '0.25rem',
                                  fontStyle: 'italic',
                                  direction: 'rtl'
                                }}>
                                  💬 {vote.comment}
                                </div>
                              )}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: '#9ca3af'
                            }}>
                              {new Date(vote.votedAt).toLocaleString('he-IL')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Share poll link */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>שתף קישור להצבעה:</h3>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '0.75rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            wordBreak: 'break-all'
          }}>
            {typeof window !== 'undefined' && `${window.location.origin}/polls/vote?pollId=${poll.id}`}
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(`${window.location.origin}/polls/vote?pollId=${poll.id}`);
                alert('הקישור הועתק!');
              }
            }}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #fbbf24)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            📋 העתק קישור
          </button>
        </div>
      </div>
    </div>
  );
}

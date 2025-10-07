'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { teamMembers } from '@/lib/members';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
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
}

export default function VotePage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('pollId');

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [existingVotes, setExistingVotes] = useState<Vote[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      fetchVotes();
    } else {
      fetchActivePoll();
    }
  }, [pollId, refreshTrigger]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls?active=false`);
      const data = await response.json();

      if (data.success && data.polls) {
        const targetPoll = data.polls.find((p: Poll) => p.id === pollId);
        setPoll(targetPoll || null);
      }
    } catch (err) {
      setError('Error loading poll');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePoll = async () => {
    try {
      const response = await fetch('/api/polls?active=true');
      const data = await response.json();

      if (data.success && data.poll) {
        setPoll(data.poll);
        if (data.poll?.id) {
          fetchVotes(data.poll.id);
        }
      }
    } catch (err) {
      setError('Error loading poll');
    } finally {
      setLoading(false);
    }
  };

  const fetchVotes = async (targetPollId?: string) => {
    try {
      const id = targetPollId || pollId;
      if (!id) return;

      const response = await fetch(`/api/polls/results?pollId=${id}`);
      const data = await response.json();

      if (data.success) {
        setExistingVotes(data.votes || []);
      }
    } catch (err) {
      console.error('Error loading votes:', err);
    }
  };

  const handleVote = async (memberName: string, optionId: string) => {
    try {
      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll?.id,
          voterName: memberName,
          voterEmail: `${memberName}@peterpan.com`,
          optionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh votes to show updated list
        setRefreshTrigger(prev => prev + 1);
      } else {
        setError(data.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('Error submitting vote: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
          <div>טוען סקר...</div>
        </div>
      </div>
    );
  }

  if (!poll) {
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ marginBottom: '1rem' }}>אין סקר פעיל כרגע</h2>
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
            <Link
              href="/polls/create"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              ➕ צור סקר חדש
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate voting progress
  const totalMembers = teamMembers.length;
  const votedMembers = existingVotes.length;
  const progressPercentage = (votedMembers / totalMembers * 100).toFixed(0);

  // Create a map of member votes
  const voteMap = new Map<string, Vote>();
  existingVotes.forEach(vote => {
    voteMap.set(vote.voterName, vote);
  });

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
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: '1rem',
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← חזרה לדף הבית
        </Link>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
              התקדמות הצבעה
            </h3>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>
              {votedMembers} / {totalMembers}
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '30px',
            backgroundColor: '#e5e7eb',
            borderRadius: '15px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {progressPercentage}%
            </div>
          </div>

          {/* Vote Totals */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {poll?.options.map((option) => {
              const optionVotes = existingVotes.filter(v => v.optionId === option.id).length;
              return (
                <div
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: option.text === 'מגיע' ? '#f0fdf4' : '#fef2f2',
                    border: option.text === 'מגיע' ? '2px solid #10b981' : '2px solid #ef4444',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {option.text === 'מגיע' ? '✅' : '❌'}
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {option.text}:
                  </span>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: option.text === 'מגיע' ? '#10b981' : '#ef4444'
                  }}>
                    {optionVotes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
            📊 הצבעה
          </h1>

          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            whiteSpace: 'pre-wrap',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            textAlign: 'center'
          }}>
            {poll.question}
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div style={{
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            הצבע פה
          </div>

          {/* Members List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {teamMembers.map((member) => {
              const memberVote = voteMap.get(member.name);
              const hasVoted = !!memberVote;

              return (
                <div
                  key={member.name}
                  style={{
                    backgroundColor: hasVoted ? '#f0fdf4' : '#f9fafb',
                    border: hasVoted ? '2px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    flex: '1',
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      backgroundColor: `${member.color}20`,
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {member.icon}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {member.name}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    {hasVoted ? (
                      <div style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {poll.options.find(o => o.id === memberVote.optionId)?.text === 'מגיע' ? '✅' : '❌'}
                        {poll.options.find(o => o.id === memberVote.optionId)?.text}
                      </div>
                    ) : (
                      poll.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleVote(member.name, option.id)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {option.text === 'מגיע' ? '✅' : '❌'} {option.text}
                        </button>
                      ))
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

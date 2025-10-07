'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function VotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pollId = searchParams.get('pollId');

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Store votes for each member: { memberName: optionId }
  const [memberVotes, setMemberVotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pollId) {
      fetchPoll();
    } else {
      fetchActivePoll();
    }
  }, [pollId]);

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

      if (data.success) {
        setPoll(data.poll);
      }
    } catch (err) {
      setError('Error loading poll');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberVote = (memberName: string, optionId: string) => {
    setMemberVotes(prev => ({
      ...prev,
      [memberName]: optionId
    }));
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Submit votes for all members who have a selection
      const votesToSubmit = Object.entries(memberVotes).filter(([_, optionId]) => optionId);

      if (votesToSubmit.length === 0) {
        setError('אנא סמן לפחות חבר אחד');
        setSubmitting(false);
        return;
      }

      // Submit each vote
      for (const [memberName, optionId] of votesToSubmit) {
        const response = await fetch('/api/polls/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pollId: poll?.id,
            voterName: memberName,
            voterEmail: `${memberName}@peterpan.com`, // Generate unique email
            optionId
          }),
        });

        const data = await response.json();
        if (!data.success) {
          console.log(`Failed to submit vote for ${memberName}:`, data.message);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/polls/results?pollId=' + poll?.id);
      }, 2000);
    } catch (err) {
      setError('Error submitting votes: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
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

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            lineHeight: '1.6'
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

          {success && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              ✅ ההצבעות נשמרו בהצלחה! מעביר לתוצאות...
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              סמן את התשובה של כל חבר:
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
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
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    {poll.options.map((option) => (
                      <label
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          border: memberVotes[member.name] === option.id
                            ? '2px solid #10b981'
                            : '2px solid #d1d5db',
                          borderRadius: '8px',
                          cursor: submitting || success ? 'not-allowed' : 'pointer',
                          backgroundColor: memberVotes[member.name] === option.id
                            ? '#f0fdf4'
                            : 'white',
                          transition: 'all 0.2s',
                          fontWeight: memberVotes[member.name] === option.id ? 'bold' : 'normal'
                        }}
                      >
                        <input
                          type="radio"
                          name={`vote-${member.name}`}
                          value={option.id}
                          checked={memberVotes[member.name] === option.id}
                          onChange={() => handleMemberVote(member.name, option.id)}
                          disabled={submitting || success}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: submitting || success ? 'not-allowed' : 'pointer'
                          }}
                        />
                        <span>
                          {option.text === 'מגיע' ? '✅' : '❌'} {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmitAll}
            disabled={submitting || success || Object.keys(memberVotes).length === 0}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
              background: submitting || success || Object.keys(memberVotes).length === 0
                ? '#9ca3af'
                : 'linear-gradient(135deg, #10b981, #fbbf24)',
              border: 'none',
              borderRadius: '10px',
              cursor: submitting || success || Object.keys(memberVotes).length === 0
                ? 'not-allowed'
                : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!submitting && !success && Object.keys(memberVotes).length > 0) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {submitting ? '⏳ שולח...' : success ? '✅ נשמר!' : `🗳️ שלח ${Object.keys(memberVotes).length} הצבעות`}
          </button>
        </div>
      </div>
    </div>
  );
}

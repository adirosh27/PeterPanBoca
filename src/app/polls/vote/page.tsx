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

interface Vote {
  pollId: string;
  voterId: string;
  voterName: string;
  voterEmail: string;
  optionId: string;
  votedAt: string;
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
  const [existingVotes, setExistingVotes] = useState<Vote[]>([]);

  const [selectedMember, setSelectedMember] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      fetchVotes();
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

  const handleSubmit = async () => {
    if (!selectedMember || !selectedOption) {
      setError('אנא בחר את שמך ואת תשובתך');
      return;
    }

    // Check if this member already voted
    const alreadyVoted = existingVotes.some(v => v.voterName === selectedMember);
    if (alreadyVoted) {
      setError('כבר הצבעת בסקר זה');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll?.id,
          voterName: selectedMember,
          voterEmail: `${selectedMember}@peterpan.com`,
          optionId: selectedOption
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/polls/results?pollId=' + poll?.id);
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('Error submitting vote: ' + (err instanceof Error ? err.message : 'Unknown error'));
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

  // Calculate voting progress
  const totalMembers = teamMembers.length;
  const votedMembers = existingVotes.length;
  const progressPercentage = (votedMembers / totalMembers * 100).toFixed(0);

  // Get list of members who already voted
  const votedMemberNames = new Set(existingVotes.map(v => v.voterName));
  const availableMembers = teamMembers.filter(m => !votedMemberNames.has(m.name));

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

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            ← חזרה לדף הבית
          </Link>
          <Link
            href={`/polls/results?pollId=${poll.id}`}
            style={{
              display: 'inline-block',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            📊 צפה בתוצאות
          </Link>
        </div>

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
              ✅ ההצבעה נשמרה בהצלחה! מעביר לתוצאות...
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              fontSize: '1.1rem'
            }}>
              בחר את שמך:
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              disabled={submitting || success}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: submitting || success ? '#f3f4f6' : 'white',
                cursor: submitting || success ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">-- בחר שם --</option>
              {availableMembers.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.icon} {member.name}
                </option>
              ))}
            </select>
            {availableMembers.length === 0 && (
              <p style={{ color: '#10b981', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                ✅ כל החברים כבר הצביעו!
              </p>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              התשובה שלך:
            </label>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: selectedOption === option.id
                      ? '3px solid #10b981'
                      : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: submitting || success ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedOption === option.id ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={submitting || success}
                    style={{
                      marginLeft: '1rem',
                      width: '20px',
                      height: '20px',
                      cursor: submitting || success ? 'not-allowed' : 'pointer'
                    }}
                  />
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: selectedOption === option.id ? 'bold' : 'normal'
                  }}>
                    {option.text === 'מגיע' ? '✅' : '❌'} {option.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || success || !selectedMember || !selectedOption}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
              background: submitting || success || !selectedMember || !selectedOption
                ? '#9ca3af'
                : 'linear-gradient(135deg, #10b981, #fbbf24)',
              border: 'none',
              borderRadius: '10px',
              cursor: submitting || success || !selectedMember || !selectedOption
                ? 'not-allowed'
                : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!submitting && !success && selectedMember && selectedOption) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {submitting ? '⏳ שולח...' : success ? '✅ נשמר!' : '🗳️ הצבע'}
          </button>
        </div>
      </div>
    </div>
  );
}

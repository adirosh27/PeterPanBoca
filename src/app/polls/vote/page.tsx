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
  eventDate?: string | null;
  deadline?: string | null;
  allowMultipleAnswers?: boolean;
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
  optionIds?: string[];
  votedAt: string;
  wasChanged?: boolean;
  comment?: string;
}

export default function VotePage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('pollId');

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [existingVotes, setExistingVotes] = useState<Vote[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [memberComments, setMemberComments] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [deadlineExpired, setDeadlineExpired] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [recentActivity, setRecentActivity] = useState<{voterName: string, timestamp: number}[]>([]);

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      fetchVotes();
    } else {
      fetchActivePoll();
    }
  }, [pollId, refreshTrigger]);

  // Poll for new votes every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (pollId || poll?.id) {
        fetchVotes(pollId || poll?.id);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [pollId, poll?.id]);

  // Auto-dismiss old activity notifications
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setRecentActivity(prev => prev.filter(activity => now - activity.timestamp < 5000));
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!poll?.deadline) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(poll.deadline!).getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        setDeadlineExpired(false);
      } else {
        setDeadlineExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll?.deadline]);

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
      setTimeout(() => setIsDataLoaded(true), 100);
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
      setTimeout(() => setIsDataLoaded(true), 100);
    }
  };

  const fetchVotes = async (targetPollId?: string) => {
    try {
      const id = targetPollId || pollId;
      if (!id) return;

      const response = await fetch(`/api/polls/results?pollId=${id}`);
      const data = await response.json();

      if (data.success) {
        const newVotes = data.votes || [];

        // Detect new votes for activity notifications
        if (existingVotes.length > 0) {
          const oldVoteEmails = new Set(existingVotes.map(v => v.voterEmail));
          const newlyVotedPeople = newVotes.filter((v: Vote) => !oldVoteEmails.has(v.voterEmail));

          if (newlyVotedPeople.length > 0) {
            const now = Date.now();
            const newActivities = newlyVotedPeople.map((v: Vote) => ({
              voterName: v.voterName,
              timestamp: now
            }));
            setRecentActivity(prev => [...newActivities, ...prev].slice(0, 5)); // Keep last 5
          }
        }

        setExistingVotes(newVotes);
      }
    } catch (err) {
      console.error('Error loading votes:', err);
    }
  };

  const handleVote = async (memberName: string, optionId?: string) => {
    try {
      // Get comment - allow empty string to clear comment
      const comment = memberComments[memberName] !== undefined
        ? (memberComments[memberName] || undefined)
        : undefined;

      // For multiple answers, use selectedOptions, otherwise use single optionId
      let voteOptionId: string | string[];
      if (poll?.allowMultipleAnswers) {
        voteOptionId = selectedOptions[memberName] || [];
        if (voteOptionId.length === 0) {
          setError('אנא בחר לפחות אפשרות אחת');
          return;
        }
      } else {
        if (!optionId) return;
        voteOptionId = optionId;
      }

      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll?.id,
          voterName: memberName,
          voterEmail: `${memberName}@peterpan.com`,
          optionId: voteOptionId,
          comment
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh votes to show updated list
        setRefreshTrigger(prev => prev + 1);
        setError('');
      } else {
        setError(data.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('Error submitting vote: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const toggleOption = (memberName: string, optionId: string) => {
    setSelectedOptions(prev => {
      const current = prev[memberName] || [];
      const isSelected = current.includes(optionId);

      if (isSelected) {
        return { ...prev, [memberName]: current.filter(id => id !== optionId) };
      } else {
        return { ...prev, [memberName]: [...current, optionId] };
      }
    });
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
      padding: '1rem',
      fontFamily: 'system-ui'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hapticTap {
          0% { transform: scale(1); }
          50% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes hapticPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .haptic-button {
          transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .haptic-button:active {
          animation: hapticTap 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 640px) {
          .responsive-container {
            padding: 2rem !important;
          }
        }
      `}</style>

      <div
        className="responsive-container"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: isDataLoaded ? 1 : 0,
          transform: isDataLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
        }}
      >
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
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>
              התקדמות הצבעה
            </h3>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
              {votedMembers} / {totalMembers}
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e5e7eb',
            borderRadius: '12px',
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
              fontSize: '0.8rem'
            }}>
              {progressPercentage}%
            </div>
          </div>

          {/* Vote Totals */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {poll?.options.map((option) => {
              // Count votes that include this option (for multiple answer support)
              const optionVotes = existingVotes.filter(v => {
                const selectedOptions = v.optionIds || [v.optionId];
                return selectedOptions.includes(option.id);
              }).length;
              return (
                <div
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    backgroundColor: option.text === 'מגיע' ? '#f0fdf4' : '#fef2f2',
                    border: option.text === 'מגיע' ? '2px solid #10b981' : '2px solid #ef4444',
                    borderRadius: '6px'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>
                    {option.text === 'מגיע' ? '✅' : '❌'}
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {option.text}:
                  </span>
                  <span style={{
                    fontSize: '1rem',
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

        {/* Live Activity Notifications */}
        <div style={{
          position: 'fixed',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none'
        }}>
          {recentActivity.map((activity, index) => {
            const age = Date.now() - activity.timestamp;
            const opacity = Math.max(0, 1 - age / 5000);

            return (
              <div
                key={activity.timestamp}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.95)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  opacity,
                  transform: `translateY(${index * 60}px)`,
                  transition: 'all 0.3s ease',
                  animation: 'slideIn 0.3s ease',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                🎉 {activity.voterName} הצביע עכשיו!
              </div>
            );
          })}
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            📊 הצבעה
          </h1>

          {/* Question Box */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.5',
              color: '#111827',
              textAlign: 'center',
              whiteSpace: 'pre-wrap'
            }}>
              {poll.question}
            </div>
          </div>

          {/* Event Date Box */}
          {poll.eventDate && (
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}>
                📅
              </div>
              <div style={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: '700',
                lineHeight: '1.4'
              }}>
                {(() => {
                  const [year, month, day] = poll.eventDate.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  return date.toLocaleDateString('he-IL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                })()}
              </div>
            </div>
          )}
            {poll.deadline && (
              <>
                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  ⏰ מועד אחרון להצבעה: {new Date(poll.deadline).toLocaleString('he-IL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>

                {/* Countdown Timer */}
                {!deadlineExpired ? (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    textAlign: 'center',
                    direction: 'rtl'
                  }}>
                    ⏳ נותרו להצבעה: {timeLeft.days > 0 && `${timeLeft.days} ימים, `}{timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                ) : (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    textAlign: 'center'
                  }}>
                    ⚠️ המועד להצבעה עבר
                  </div>
                )}
              </>
            )}
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
            marginBottom: '1rem',
            fontSize: '0.95rem',
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
                    borderRadius: '10px',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    flex: '1',
                    minWidth: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      backgroundColor: `${member.color}20`,
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${member.color}40`
                    }}>
                      {member.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {member.name}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        marginTop: '0.25rem',
                        backgroundColor: hasVoted ? '#d1fae5' : '#fef3c7',
                        color: hasVoted ? '#065f46' : '#92400e',
                        border: hasVoted ? '1px solid #10b981' : '1px solid #f59e0b'
                      }}>
                        {hasVoted ? '✅ הצביע' : '⏳ ממתין'}
                      </div>
                    </div>
                  </div>

                  {hasVoted && memberVote && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#6b7280',
                      flex: '0 0 auto'
                    }}>
                      {memberVote.wasChanged ? 'Changed:' : 'Voted:'} {new Date(memberVote.votedAt).toLocaleString('he-IL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    {poll.allowMultipleAnswers ? (
                      // Multiple selection mode - checkboxes
                      <>
                        {poll.options.map((option, optionIndex) => {
                          const currentSelections = selectedOptions[member.name] || (memberVote?.optionIds || []);
                          const isChecked = currentSelections.includes(option.id);

                          // Color scheme for each option
                          const optionColors = [
                            { main: '#10b981', dark: '#059669', light: '#d1fae5', shadow: 'rgba(16, 185, 129, 0.3)', hover: 'rgba(16, 185, 129, 0.2)' }, // Green
                            { main: '#3b82f6', dark: '#2563eb', light: '#dbeafe', shadow: 'rgba(59, 130, 246, 0.3)', hover: 'rgba(59, 130, 246, 0.2)' }, // Blue
                            { main: '#f59e0b', dark: '#d97706', light: '#fef3c7', shadow: 'rgba(245, 158, 11, 0.3)', hover: 'rgba(245, 158, 11, 0.2)' }, // Amber
                            { main: '#8b5cf6', dark: '#7c3aed', light: '#ede9fe', shadow: 'rgba(139, 92, 246, 0.3)', hover: 'rgba(139, 92, 246, 0.2)' }, // Purple
                            { main: '#ec4899', dark: '#db2777', light: '#fce7f3', shadow: 'rgba(236, 72, 153, 0.3)', hover: 'rgba(236, 72, 153, 0.2)' }, // Pink
                            { main: '#06b6d4', dark: '#0891b2', light: '#cffafe', shadow: 'rgba(6, 182, 212, 0.3)', hover: 'rgba(6, 182, 212, 0.2)' }, // Cyan
                          ];
                          const color = optionColors[optionIndex % optionColors.length];

                          return (
                            <button
                              key={option.id}
                              className="haptic-button"
                              onClick={() => toggleOption(member.name, option.id)}
                              style={{
                                minHeight: '44px',
                                padding: '0.6rem 1rem',
                                border: isChecked ? `2px solid ${color.main}` : '2px solid #e5e7eb',
                                borderRadius: '6px',
                                backgroundColor: isChecked ? color.main : 'white',
                                color: isChecked ? 'white' : 'black',
                                cursor: 'pointer',
                                fontWeight: isChecked ? 'bold' : '500',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: isChecked
                                  ? `inset 0 3px 8px rgba(0, 0, 0, 0.2), 0 2px 4px ${color.shadow}`
                                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: isChecked ? 'translateY(2px)' : 'translateY(0)',
                                background: isChecked
                                  ? `linear-gradient(145deg, ${color.main}, ${color.dark})`
                                  : 'linear-gradient(145deg, #ffffff, #f9fafb)'
                              }}
                              onMouseEnter={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.boxShadow = `0 4px 8px ${color.hover}`;
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isChecked) {
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }
                              }}
                            >
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: isChecked ? '2px solid white' : '2px solid #9ca3af',
                                backgroundColor: isChecked ? color.main : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s'
                              }}>
                                {isChecked && (
                                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ display: 'block' }}>
                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              {option.text}
                            </button>
                          );
                        })}
                        <button
                          className="haptic-button"
                          onClick={() => handleVote(member.name)}
                          style={{
                            minHeight: '44px',
                            padding: '0.6rem 1.2rem',
                            border: '2px solid #10b981',
                            borderRadius: '6px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            background: 'linear-gradient(145deg, #10b981, #059669)',
                            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 6px 10px rgba(16, 185, 129, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.4)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translateY(1px)';
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 10px rgba(16, 185, 129, 0.5)';
                          }}
                        >
                          💾 שמור
                        </button>
                      </>
                    ) : (
                      // Single selection mode - radio buttons
                      poll.options.map((option) => {
                        const isSelected = hasVoted && memberVote.optionId === option.id;
                        return (
                          <button
                            key={option.id}
                            className="haptic-button"
                            onClick={() => handleVote(member.name, option.id)}
                            style={{
                              minHeight: '44px',
                              padding: '0.6rem 1rem',
                              border: isSelected ? '2px solid #10b981' : '2px solid #e5e7eb',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? '#10b981' : 'white',
                              color: isSelected ? 'white' : 'black',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 'bold' : '500',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              boxShadow: isSelected
                                ? 'inset 0 3px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(16, 185, 129, 0.3)'
                                : '0 2px 4px rgba(0, 0, 0, 0.1)',
                              transform: isSelected ? 'translateY(2px)' : 'translateY(0)',
                              background: isSelected
                                ? 'linear-gradient(145deg, #10b981, #059669)'
                                : 'linear-gradient(145deg, #ffffff, #f9fafb)'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = 'linear-gradient(145deg, #f0fdf4, #dcfce7)';
                                e.currentTarget.style.borderColor = '#10b981';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = 'linear-gradient(145deg, #ffffff, #f9fafb)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            {option.text === 'מגיע' ? '✅' : '❌'} {option.text}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Comment input */}
                  <div style={{ width: '100%', marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="הוסף הערה (אופציונלי)"
                      value={
                        memberComments[member.name] !== undefined
                          ? memberComments[member.name]
                          : (hasVoted && memberVote?.comment) || ''
                      }
                      onChange={(e) => setMemberComments(prev => ({
                        ...prev,
                        [member.name]: e.target.value
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        textAlign: 'right',
                        direction: 'rtl'
                      }}
                    />
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

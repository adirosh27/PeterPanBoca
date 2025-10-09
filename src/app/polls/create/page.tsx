'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [options, setOptions] = useState(['מגיע', 'לא מסתדר לי']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty options
    const validOptions = options.filter(opt => opt.trim() !== '');

    if (validOptions.length < 2) {
      setError('חייב להיות לפחות 2 אפשרויות הצבעה');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          eventDate: eventDate || null,
          deadline: deadline || null,
          allowMultipleAnswers,
          options: validOptions
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/polls/results?pollId=' + data.poll.id);
        }, 1500);
      } else {
        setError(data.message || 'Failed to create poll');
      }
    } catch (err) {
      setError('Error creating poll: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
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

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link
          href="/polls/results"
          style={{
            display: 'inline-block',
            marginBottom: '1rem',
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          חזרה לתוצאות ←
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
            יצירת סקר חדש
          </h1>

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
              ✅ הסקר נוצר בהצלחה! מעביר לעמוד התוצאות...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                שאלת הסקר:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={4}
                placeholder="לדוגמה: חבר'ה, האירוע הבא שלנו – Top Golf!&#10;תאריך מוצע: 19 באוקטובר.⛳&#10;שמרו את התאריך ונתעדכן לפרטים נוספים!"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'system-ui',
                  resize: 'vertical',
                  textAlign: 'right',
                  direction: 'rtl'
                }}
                disabled={loading || success}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                תאריך אירוע (אופציונלי):
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'system-ui'
                }}
                disabled={loading || success}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                מועד אחרון להצבעה (אופציונלי):
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'system-ui'
                }}
                disabled={loading || success}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                <input
                  type="checkbox"
                  checked={allowMultipleAnswers}
                  onChange={(e) => setAllowMultipleAnswers(e.target.checked)}
                  disabled={loading || success}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: loading || success ? 'not-allowed' : 'pointer'
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>אפשר מספר תשובות (חבר יכול לבחור יותר מאפשרות אחת)</span>
              </label>
            </div>

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #bfdbfe',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>אפשרויות הצבעה:</p>
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={loading || success}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading || success ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  ➕ הוסף אפשרות
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`אפשרות ${index + 1}`}
                      disabled={loading || success}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: loading || success ? '#f3f4f6' : 'white',
                        textAlign: 'right',
                        direction: 'rtl'
                      }}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        disabled={loading || success}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: loading || success ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success || !question.trim()}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                background: loading || success || !question.trim()
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #10b981, #fbbf24)',
                border: 'none',
                borderRadius: '10px',
                cursor: loading || success || !question.trim() ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading && !success && question.trim()) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? '⏳ יוצר סקר...' : success ? '✅ הסקר נוצר!' : '🚀 צור סקר'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

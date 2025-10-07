'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options: ['מגיע', 'לא מסתדר לי']
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
          ← חזרה לתוצאות
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
            📊 יצירת סקר חדש
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
                  resize: 'vertical'
                }}
                disabled={loading || success}
              />
            </div>

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #bfdbfe',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>אפשרויות הצבעה:</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #10b981'
                }}>
                  ✅ מגיע
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #ef4444'
                }}>
                  ❌ לא מסתדר לי
                </div>
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

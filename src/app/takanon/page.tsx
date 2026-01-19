'use client';

export default function TakanonPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: 'clamp(2rem, 6vw, 3rem) clamp(1rem, 4vw, 2rem)'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite'
          }}>
            📜 תקנון הקבוצה
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            כללים והנחיות לפעילות קבוצת פיטר פן בבוקה רטון
          </p>
        </div>

        {/* Regulations Content */}
        <div
          data-card
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 5vw, 3rem)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{
            direction: 'rtl',
            textAlign: 'right',
            lineHeight: '2',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: '#1f2937'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(251, 191, 36, 0.1))',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              borderRight: '4px solid #10b981'
            }}>
              <p style={{ margin: 0 }}>
                <strong>שינויים בתקנון:</strong> שינוי או הוספה לתקנון מצריכים העלאה להצבעה בקבוצה על ידי חברי הוועד, ואישור ברוב קולות.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(16, 185, 129, 0.1))',
              borderRadius: '15px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              borderRight: '4px solid #fbbf24'
            }}>
              <p style={{ margin: 0 }}>
                <strong>15.</strong> תתקיים פגישה דו-שנתית של כלל חברי הקבוצה, במסגרתה נדון בדרכי התייעלות ועדכון התקנון.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#6b7280',
          fontSize: '0.9rem'
        }}>
          <p>📌 התקנון עודכן לאחרונה: ינואר 2026</p>
        </div>
      </div>
    </div>
  );
}

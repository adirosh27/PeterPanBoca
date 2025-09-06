'use client';

import { useState } from 'react';

// Define the gallery structure based on the actual folder structure
const galleryData = {
  2025: [
    { name: 'Karting - April 26th, 2025', folder: 'Karting - April 26th, 2025' },
    { name: 'Orlando - January 2025', folder: 'Orlando - January 2025' },
    { name: 'חיפוש המטמון - אוגוסט 2025', folder: 'חיפוש המטמון - אוגוסט 2025' },
    { name: 'שייט - מרץ 2025', folder: 'שייט - מרץ 2025' }
  ],
  2024: [
    { name: 'טרקטורונים - מרץ 2024', folder: 'טרקטורונים - מרץ 2024' },
    { name: 'על האש בפארק - פברואר 2024', folder: 'על האש בפארק - פברואר 2024' },
    { name: 'עצמאות - מאי 2024', folder: 'עצמאות - מאי 2024' },
    { name: 'ערב ציור - יולי 2024', folder: 'ערב ציור - יולי 2024' },
    { name: 'שישי ישראלי - ינואר 2024', folder: 'שישי ישראלי - ינואר 2024' }
  ],
  2023: [
    { name: 'חנוכה 2023', folder: 'חנוכה 2023' },
    { name: 'טופ גולף - אוגוסט 2023', folder: 'טופ גולף - אוגוסט 2023' },
    { name: 'טעימות וויסקי - ספטמבר 2023', folder: 'טעימות וויסקי - ספטמבר 2023' },
    { name: 'מסיבת בריכה - מאי 2023', folder: 'מסיבת בריכה - מאי 2023' },
    { name: 'ספא 2023', folder: 'ספא 2023' }
  ],
  2022: [
    { name: 'באולינג - יולי 2022', folder: 'באולינג - יולי 2022' },
    { name: 'גמר מונדיאל - דצמבר 2022', folder: 'גמר מונדיאל - דצמבר 2022' },
    { name: 'זריקת גרזנים - ינואר 2022', folder: 'זריקת גרזנים - ינואר 2022' },
    { name: 'מסעדה יוונית - 2022', folder: 'מסעדה יוונית - 2022' },
    { name: 'ערב זוגות - מאי 2022', folder: 'ערב זוגות - מאי 2022' }
  ],
  2021: [
    { name: 'שייט - אוקטובר 2021', folder: 'שייט - אוקטובר 2021' }
  ]
};

export default function GalleriesPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const years = Object.keys(galleryData).map(Number).sort((a, b) => b - a); // Sort years descending

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem'
    }}>
      <style>{`
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

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            📸✨🎭
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite'
          }}>
            📸 גלריית הזכרונות הקסומה
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            מסע בזמן דרך השנים - צפו בכל האירועים המיוחדים שלנו מאורגנים לפי שנים
          </p>
        </div>

        {/* Year Selection */}
        {!selectedYear && (
          <div>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '2rem', 
              marginBottom: '3rem',
              color: '#1f2937',
              fontWeight: 'bold'
            }}>
              🗓️ בחרו שנה לצפייה
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    animation: `float 3s ease-in-out infinite ${year * 0.2}s`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {year === 2025 ? '🌟' : year === 2024 ? '🎊' : year === 2023 ? '🎭' : year === 2022 ? '🎪' : '⚡'}
                  </div>
                  <h3 style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: '#10b981',
                    margin: '0 0 1rem 0'
                  }}>
                    {year}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '1rem',
                    margin: '0 0 1rem 0'
                  }}>
                    {galleryData[year as keyof typeof galleryData].length} אירועים
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    צפו בתמונות ←
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events for Selected Year */}
        {selectedYear && !selectedEvent && (
          <div>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={() => setSelectedYear(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #10b981',
                  borderRadius: '15px',
                  padding: '0.8rem 1.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                  transition: 'all 0.3s'
                }}
              >
                ← חזור לבחירת שנה
              </button>
              <h2 style={{ 
                fontSize: '2.5rem', 
                color: '#1f2937',
                fontWeight: 'bold',
                margin: '0'
              }}>
                🎭 אירועי {selectedYear}
              </h2>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem'
            }}>
              {galleryData[selectedYear as keyof typeof galleryData].map((event, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedEvent(event.folder)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    animation: `float 3s ease-in-out infinite ${index * 0.3}s`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(251, 191, 36, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #fbbf24, #10b981)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    🎪
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.4'
                  }}>
                    {event.name}
                  </h3>
                  <div style={{
                    background: 'linear-gradient(135deg, #fbbf24, #10b981)',
                    color: 'white',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    פתח גלריה →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Photos Gallery */}
        {selectedEvent && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              marginBottom: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #10b981',
                  borderRadius: '15px',
                  padding: '0.8rem 1.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#10b981'
                }}
              >
                ← חזור לאירועים
              </button>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
                color: '#1f2937',
                fontWeight: 'bold',
                margin: '0'
              }}>
                📸 {selectedEvent}
              </h2>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '2rem'
              }}>
                🎭✨
              </div>
              <p style={{ 
                fontSize: '1.2rem',
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                התמונות נטענות... בקרוב תוכלו לצפות בכל התמונות מהאירוע!
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                🔄 בפיתוח...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
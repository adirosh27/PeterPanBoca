'use client';

import { useEffect, useState } from 'react';

const hebrewMonths = [
  { name: 'ינואר', icon: '❄️', color: '#60a5fa' },
  { name: 'פברואר', icon: '💝', color: '#f472b6' },
  { name: 'מרץ', icon: '🌸', color: '#a78bfa' },
  { name: 'אפריל', icon: '🌷', color: '#34d399' },
  { name: 'מאי', icon: '🌻', color: '#fbbf24' },
  { name: 'יוני', icon: '☀️', color: '#fb923c' },
  { name: 'יולי', icon: '🏖️', color: '#38bdf8' },
  { name: 'אוגוסט', icon: '🌴', color: '#4ade80' },
  { name: 'ספטמבר', icon: '🍂', color: '#f97316' },
  { name: 'אוקטובר', icon: '🎃', color: '#fb7185' },
  { name: 'נובמבר', icon: '🍁', color: '#a855f7' },
  { name: 'דצמבר', icon: '🎄', color: '#10b981' }
];

type Team = { month: string; members: string[] };

const teams2026: Team[] = [
  { month: 'ינואר', members: ['עופר גלעדי', 'שלום מולדבסקי'] },
  { month: 'פברואר', members: ['אדיר חזן', 'רועי וגנר'] },
  { month: 'מרץ', members: ['אבי לוי', 'דני קרן'] },
  { month: 'אפריל', members: ['דודי אמסלם', 'ליאור טמיר', 'מומי שושן'] },
  { month: 'מאי', members: ['נדב חורי', 'רם אלמוג', 'עמית תירוש'] },
  { month: 'יוני', members: ['אורן בנבנישתי', 'משה מרקו'] },
  { month: 'יולי', members: ['טל שקד', 'שי זיידנברג', 'אורי פייגין'] },
  { month: 'אוגוסט', members: ['סהר אביאני', 'ספי בר'] },
  { month: 'ספטמבר', members: ['שלום ספיר', 'רון דיקסון'] },
  { month: 'אוקטובר', members: ['שולי מייקלס', 'יוסי חכם'] },
  { month: 'נובמבר', members: ['יוסי עוז־סיני', 'אייל בישרי'] },
  { month: 'דצמבר', members: ['רועי וולקן', 'איתמר אנקוריון'] }
];

// 2027: everyone reshuffled - no one repeats a 2026 teammate or their 2026 month
const teams2027: Team[] = [
  { month: 'ינואר', members: ['ליאור טמיר', 'ספי בר'] },
  { month: 'פברואר', members: ['אורן בנבנישתי', 'יוסי חכם'] },
  { month: 'מרץ', members: ['שי זיידנברג', 'יוסי עוז־סיני'] },
  { month: 'אפריל', members: ['שלום מולדבסקי', 'רועי וולקן', 'רועי וגנר'] },
  { month: 'מאי', members: ['אבי לוי', 'טל שקד', 'מומי שושן'] },
  { month: 'יוני', members: ['עופר גלעדי', 'אייל בישרי'] },
  { month: 'יולי', members: ['דודי אמסלם', 'עמית תירוש', 'סהר אביאני'] },
  { month: 'אוגוסט', members: ['נדב חורי', 'משה מרקו'] },
  { month: 'ספטמבר', members: ['דני קרן', 'איתמר אנקוריון'] },
  { month: 'אוקטובר', members: ['רון דיקסון', 'אורי פייגין'] },
  { month: 'נובמבר', members: ['אדיר חזן', 'שלום ספיר'] },
  { month: 'דצמבר', members: ['שולי מייקלס', 'רם אלמוג'] }
];

const teamsByYear: Record<number, Team[]> = {
  2026: teams2026,
  2027: teams2027
};

const years = Object.keys(teamsByYear).map(Number).sort((a, b) => a - b);

function defaultYear(): number {
  const current = new Date().getFullYear();
  if (teamsByYear[current]) return current;
  return current > years[years.length - 1] ? years[years.length - 1] : years[0];
}

export default function TzvatimPage() {
  const [year, setYear] = useState<number>(years[0]);

  // Pick the current year on the client so the page rolls over to 2027 on Jan 1
  useEffect(() => {
    setYear(defaultYear());
  }, []);

  const teams = teamsByYear[year];

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

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            👥 צוותי אירועים
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto',
            direction: 'rtl'
          }}>
            חלוקת הצוותים לארגון 12 האירועים השנתיים
          </p>

          {/* Year selector */}
          <div style={{
            display: 'inline-flex',
            gap: '0.5rem',
            marginTop: '1.5rem',
            padding: '0.4rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '999px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
          }}>
            {years.map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  aria-pressed={active}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.55rem 1.5rem',
                    borderRadius: '999px',
                    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                    fontWeight: 'bold',
                    color: active ? '#ffffff' : '#047857',
                    background: active ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                    boxShadow: active ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teams Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1rem, 3vw, 1.5rem)'
        }}>
          {teams.map((team, index) => {
            const monthData = hebrewMonths.find(m => m.name === team.month);
            return (
              <div
                key={`${year}-${index}`}
                data-card
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                  borderRadius: '20px',
                  padding: 'clamp(1.25rem, 4vw, 1.75rem)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  border: `3px solid ${monthData?.color || '#10b981'}`,
                  transition: 'all 0.3s ease',
                  direction: 'rtl'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 15px 35px ${monthData?.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Month Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `2px dashed ${monthData?.color}40`
                }}>
                  <span style={{ fontSize: '1.75rem' }}>{monthData?.icon}</span>
                  <h2 style={{
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.5rem)',
                    fontWeight: 'bold',
                    color: monthData?.color,
                    margin: 0
                  }}>
                    {team.month}
                  </h2>
                </div>

                {/* Team Members */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  {team.members.map((member, memberIndex) => (
                    <div
                      key={memberIndex}
                      style={{
                        background: `linear-gradient(135deg, ${monthData?.color}15, ${monthData?.color}25)`,
                        padding: '0.6rem 1.25rem',
                        borderRadius: '25px',
                        fontWeight: '600',
                        fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                        color: '#1f2937',
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '200px'
                      }}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          color: '#6b7280',
          fontSize: '0.9rem',
          direction: 'rtl'
        }}>
          <p>📌 כל צוות אחראי על ארגון אירוע אחד בחודש המיועד</p>
        </div>
      </div>
    </div>
  );
}

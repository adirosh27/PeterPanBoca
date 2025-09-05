'use client';

import Image from 'next/image';

const teamMembers = [
  { name: 'אדיר חזן', role: 'מפיק ראשי', icon: '🎭', color: '#10b981' },
  { name: 'עמית תירוש', role: 'במאי אירועים', icon: '🎪', color: '#f59e0b' },
  { name: 'אבי לוי', role: 'מנהל הפקה', icon: '🎬', color: '#dc2626' },
  { name: 'דני קרן', role: 'אמן בידור', icon: '🎨', color: '#a855f7' },
  { name: 'דודי אמסלם', role: 'מוזיקאי', icon: '🎵', color: '#22d3ee' },
  { name: 'ליאור תמיר', role: 'כוריאוגרף', icon: '💃', color: '#ec4899' },
  { name: 'מומי שושן', role: 'מעצב תחפושות', icon: '👗', color: '#8b5cf6' },
  { name: 'משה מרקו', role: 'טכנאי סאונד', icon: '🎧', color: '#14b8a6' },
  { name: 'נדב חורי', role: 'מנהל במה', icon: '🎯', color: '#f97316' },
  { name: 'עופר גלעדי', role: 'מאמן פעלולים', icon: '🤸‍♂️', color: '#84cc16' },
  { name: 'אורן בנבנישתי', role: 'מעצב תפאורה', icon: '🏰', color: '#6366f1' },
  { name: 'רם אלמוג', role: 'מנהל ייצור', icon: '⚙️', color: '#ef4444' },
  { name: 'רועי וגנר', role: 'צלם ראשי', icon: '📸', color: '#06b6d4' },
  { name: 'רון דיקסון', role: 'מוביל קבוצה', icon: '👥', color: '#84cc16' },
  { name: 'שגיא שנון', role: 'מאפר ראשי', icon: '🎨', color: '#f59e0b' },
  { name: 'סהר אביאני', role: 'מעצבת שיער', icon: '💇‍♀️', color: '#ec4899' },
  { name: 'ספי בר', role: 'רכז בטיחות', icon: '🛡️', color: '#10b981' },
  { name: 'שלום מולדבסקי', role: 'מנהל לוגיסטיקה', icon: '🚛', color: '#8b5cf6' },
  { name: 'שלום ספיר', role: 'מנהל קהל', icon: '🎤', color: '#f97316' },
  { name: 'שי זיידנברג', role: 'מתכנת פעילויות', icon: '🎯', color: '#22d3ee' },
  { name: 'שולי מייקלס', role: 'רכזת ילדים', icon: '🧸', color: '#a855f7' },
  { name: 'טל שקד', role: 'מעצב גרפי', icon: '🖼️', color: '#14b8a6' },
  { name: 'יוסי חכם', role: 'יועץ יצירתי', icon: '💡', color: '#84cc16' },
  { name: 'יוסי עוז־סיני', role: 'רכז התנדבות', icon: '🤝', color: '#ef4444' },
  { name: 'אייל בישרי', role: 'מנהל קשרי קהילה', icon: '🌟', color: '#06b6d4' },
  { name: 'רועי וולקן', role: 'מתאמן חדש', icon: '🌱', color: '#10b981' }
];


export default function CharactersPage() {

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '3rem 2rem'
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

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            🎭 פגשו את חברי פיטר פן
          </h1>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '1rem' }}>
            עודכן: {new Date().toLocaleString('he-IL')}
          </div>
        </div>


        {/* Team Members Section */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '3rem',
            marginTop: '4rem'
          }}
        >
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem'
          }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                  border: `2px solid ${member.color}`,
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 10px 25px ${member.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1rem',
                  background: `${member.color}20`,
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  {member.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold', 
                  color: member.color,
                  marginBottom: '0.5rem'
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
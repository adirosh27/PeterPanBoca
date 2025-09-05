'use client';

import { useState } from 'react';
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

const characters = [
  {
    id: 'peter-pan',
    name: 'פיטר פן',
    englishName: 'Peter Pan',
    icon: '🧚‍♂️',
    description: 'הילד שלעולם לא גדל, מנהיג הילדים האבודים ומומחה טיסה!',
    fullDescription: 'פיטר פן הוא הדמות הראשית של הסיפור - ילד קסום שמסרב לגדול ומתגורר בנברלנד. הוא יודע לטוס, נלחם בפיראטים ומוביל את הילדים האבודים בהרפתקאות מרגשות. פיטר הוא אמיץ, משחקן ומלא בדמיון.',
    traits: ['מנהיג טבעי', 'יודע לטוס', 'תמיד מוכן להרפתקה', 'מגן על הילדים האבודים'],
    catchphrase: '"כדי לטוס, תחשבו על דברים שמחים!"',
    image: '/characters/peter-pan.jpg',
    color: '#10b981'
  },
  {
    id: 'captain-hook',
    name: 'קפטן הוק',
    englishName: 'Captain Hook',
    icon: '🏴‍☠️',
    description: 'הקפטן הפיראט הידוע לשמצה עם היד החסרה והווי החד!',
    fullDescription: 'קפטן הוק הוא האויב המושבע של פיטר פן. הוא קפטן אוניית הפיראטים "הנקמה הנצחית" ומנהיג להקת פיראטים מפחידה. למרות היותו הנבל של הסיפור, הוא גם דמות קומית וצבעונית שילדים אוהבים.',
    traits: ['קפטן פיראטים מנוסה', 'תכנון אסטרטגי', 'אלגנטי ומתוחכם', 'תמיד רוצה נקמה'],
    catchphrase: '"אני אתפוס אותך, פיטר פן!"',
    image: '/characters/captain-hook.jpg',
    color: '#dc2626'
  },
  {
    id: 'tinker-bell',
    name: 'טינקר בל',
    englishName: 'Tinker Bell',
    icon: '🧚‍♀️',
    description: 'הפיה הקטנה והנאמנה עם אבק הפיות הקסום!',
    fullDescription: 'טינקר בל היא הפיה הקטנה והחכמה של פיטר פן. היא מומחית בתיקון דברים ויוצרת אבק פיות קסום שעוזר לאנשים לטוס. למרות שהיא קטנה, יש לה אישיות חזקה ותמיד מוכנה לעזור לחברים.',
    traits: ['מומחית תיקונים', 'יוצרת אבק פיות', 'נאמנה ואכפתית', 'אמיצה למרות הגודל'],
    catchphrase: '"עם קצת אמונה ואבק פיות, הכל אפשרי!"',
    image: '/characters/tinker-bell.jpg',
    color: '#a855f7'
  },
  {
    id: 'wendy',
    name: 'וונדי',
    englishName: 'Wendy Darling',
    icon: '👧',
    description: 'הילדה החכמה והאמיצה שמצטרפת להרפתקאות בנברלנד!',
    fullDescription: 'וונדי דארלינג היא ילדה חכמה ואכפתית מלונדון שמגיעה לנברלנד עם אחיה. היא משמשת כמעין אמא לילדים האבודים ומביאה חכמה ושכל ישר להרפתקאות הפרועות.',
    traits: ['חכמה ומבוגרת', 'דואגת לאחרים', 'מספרת סיפורים נהדרים', 'אמיצה בזמן הצורך'],
    catchphrase: '"סיפור טוב יכול לרפא כל לב"',
    image: '/characters/wendy.jpg',
    color: '#ec4899'
  }
];

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

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
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            🎭✨👑
          </div>
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
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            הכירו את הדמויות הקסומות והצוות המדהים שמביאים את סיפור פיטר פן לחיים באירועים שלנו
          </p>
        </div>

        {/* Character Selector */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              style={{
                background: selectedCharacter.id === character.id 
                  ? `linear-gradient(135deg, ${character.color}, ${character.color}dd)` 
                  : 'rgba(255, 255, 255, 0.9)',
                color: selectedCharacter.id === character.id ? 'white' : character.color,
                border: `3px solid ${character.color}`,
                borderRadius: '20px',
                padding: '1rem 1.5rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: selectedCharacter.id === character.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selectedCharacter.id === character.id 
                  ? `0 10px 25px ${character.color}40` 
                  : '0 5px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = selectedCharacter.id === character.id ? 'scale(1.05)' : 'scale(1)'}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{character.icon}</span>
              {character.name}
            </button>
          ))}
        </div>

        {/* Selected Character Display */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Character Image */}
          <div 
            data-card
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '3/4',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${selectedCharacter.color}20, ${selectedCharacter.color}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              opacity: 0.8
            }}>
              {selectedCharacter.icon}
            </div>
            
            {/* Character placeholder - replace with actual images */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: selectedCharacter.color,
                margin: '0'
              }}>
                {selectedCharacter.englishName}
              </h3>
            </div>
          </div>

          {/* Character Info */}
          <div 
            data-card
            style={{
              borderRadius: '20px',
              padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', marginLeft: '1rem' }}>{selectedCharacter.icon}</span>
              <div>
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: selectedCharacter.color,
                  margin: '0'
                }}>
                  {selectedCharacter.name}
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#666', margin: '0' }}>
                  {selectedCharacter.englishName}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {selectedCharacter.fullDescription}
            </p>

            {/* Traits */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: selectedCharacter.color }}>
                ✨ תכונות מיוחדות:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {selectedCharacter.traits.map((trait, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: `${selectedCharacter.color}20`,
                    borderRadius: '10px'
                  }}>
                    <span style={{ color: selectedCharacter.color, marginLeft: '0.5rem' }}>⭐</span>
                    <span style={{ fontSize: '0.9rem' }}>{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catchphrase */}
            <div style={{
              background: `linear-gradient(135deg, ${selectedCharacter.color}20, ${selectedCharacter.color}10)`,
              borderLeft: `4px solid ${selectedCharacter.color}`,
              borderRadius: '10px',
              padding: '1.5rem',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              lineHeight: '1.5'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💬</div>
              {selectedCharacter.catchphrase}
            </div>
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
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>👥</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              הצוות המקסים שלנו
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              פגשו את הצוות המדהים שמביא את הקסם לכל אירוע ואירוע
            </p>
          </div>
          
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

        {/* Fun Facts Section */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            marginTop: '4rem'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🎪</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            פגשו את הדמויות באירועים שלנו!
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            כל הדמויות מגיעות לחיים באירועים שלנו עם תחפושות מדהימות, פעילויות אינטראקטיביות וחוויות בלתי נשכחות!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              data-button
              style={{
                padding: '1rem 2rem',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🎫 הרשמה לאירועים
            </button>
            <button
              data-button
              style={{
                padding: '1rem 2rem',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              📸 גלריית תמונות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
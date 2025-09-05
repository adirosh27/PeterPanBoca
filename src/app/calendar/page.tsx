'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'pirate' | 'fairy' | 'adventure' | 'special';
  price: string;
  ageGroup: string;
  spotsLeft: number;
}

const events: Event[] = [
  {
    id: 1,
    date: '2025-09-13',
    title: 'הרמת כוסית לראש השנה',
    description: 'חגיגת ראש השנה מיוחדת עם פיטר פן והחבורה! ערב חגיגי עם הרמת כוסית, ברכות לשנה החדשה ופעילויות משפחתיות קסומות.',
    time: '20:00-22:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$45',
    ageGroup: 'כל המשפחה',
    spotsLeft: 30
  },
  {
    id: 2,
    date: '2024-01-15',
    title: 'הרפתקת הפיראטים הגדולה',
    description: 'צאו למסע פיראטים מרגש עם קפטן הוק והצוות! חיפוש אוצרות, משחקים ופעילויות ימיות.',
    time: '16:00-18:00',
    location: 'פארק בוקה רטון',
    type: 'pirate',
    price: '$35',
    ageGroup: '4-12',
    spotsLeft: 15
  },
  {
    id: 2,
    date: '2024-01-22',
    title: 'נשף הפיות הקסום',
    description: 'ערב קסום עם טינקר בל! יצירת אבק פיות, מסיבת תחפושות והרבה קסמים.',
    time: '17:00-19:00', 
    location: 'אולם האירועים המרכזי',
    type: 'fairy',
    price: '$40',
    ageGroup: '3-10',
    spotsLeft: 8
  },
  {
    id: 3,
    date: '2024-01-29',
    title: 'טיסה לנברלנד',
    description: 'הרפתקה מלאה עם פיטר פן! נלמד לטוס (בבטחה!), נפגש את הילדים האבודים ונחיה חוויה בלתי נשכחת.',
    time: '15:30-17:30',
    location: 'מרכז הקהילה',
    type: 'adventure',
    price: '$45',
    ageGroup: '5-14',
    spotsLeft: 12
  },
  {
    id: 4,
    date: '2024-02-05',
    title: 'יום הולדת מיוחד עם פיטר פן',
    description: 'חגיגת יום הולדת פרטית עם כל הדמויות! כולל עוגה, משחקים ותמונות זכרון.',
    time: '14:00-16:00',
    location: 'לפי בחירה',
    type: 'special',
    price: '$120',
    ageGroup: '2-16',
    spotsLeft: 3
  },
  {
    id: 5,
    date: '2024-02-12',
    title: 'ורקשוף יצירה עם וונדי',
    description: 'ורקשוף יצירה מיוחד עם וונדי! נכין תמונות זכרון, נצייר את נברלנד ונשמע סיפורים מדהימים.',
    time: '10:00-12:00',
    location: 'סטודיו האמנות',
    type: 'fairy',
    price: '$25',
    ageGroup: '6-12',
    spotsLeft: 20
  },
  {
    id: 6,
    date: '2024-02-19',
    title: 'מסיבת קרנבל פיטר פן',
    description: 'מסיבת קרנבל גדולה עם כל הדמויות! תחפושות, ריקודים, משחקים והרבה כיף!',
    time: '16:00-19:00',
    location: 'פארק בוקה רטון',
    type: 'special',
    price: '$50',
    ageGroup: '2-99',
    spotsLeft: 25
  },
  {
    id: 7,
    date: '2025-10-12',
    title: 'יום כיפור עם פיטר פן',
    description: 'יום רוחני ומיוחד עם פיטר פן והחבורה. פעילויות משפחתיות, זמן למחשבה ויצירת חוויות משמעותיות.',
    time: '19:00-21:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$40',
    ageGroup: 'כל המשפחה',
    spotsLeft: 40
  },
  {
    id: 8,
    date: '2025-10-17',
    title: 'חג סוכות בנברלנד',
    description: 'בניית סוכה קסומה עם פיטר פן! נלמד על החג, נבנה סוכה יחד ונהנה מפעילויות חגיגיות.',
    time: '16:00-18:30',
    location: 'פארק בוקה רטון',
    type: 'special',
    price: '$38',
    ageGroup: '3-16',
    spotsLeft: 35
  },
  {
    id: 9,
    date: '2025-12-25',
    title: 'חנוכה עם אור קסום',
    description: 'חגיגת חנוכה מיוחדת עם הדלקת נרות קסומים! סביבונים, לביבות וחוויות אור מרהיבות עם הדמויות.',
    time: '17:30-20:00',
    location: 'מרכז הקהילה',
    type: 'special',
    price: '$42',
    ageGroup: 'כל הגילאים',
    spotsLeft: 50
  },
  {
    id: 10,
    date: '2026-02-13',
    title: 'ט״ו בשבט - חגיגת העצים',
    description: 'חגיגת ט״ו בשבט עם פיטר פן! נטיעת עצים, יצירות טבע והכרת הטבע הקסום של נברלנד.',
    time: '10:00-13:00',
    location: 'פארק בוקה רטון',
    type: 'adventure',
    price: '$32',
    ageGroup: '4-14',
    spotsLeft: 25
  },
  {
    id: 11,
    date: '2026-03-14',
    title: 'מסיבת פורים בנברלנד',
    description: 'מסיבת תחפושות פורים עם כל הדמויות! תחרות תחפושות, אזני המן וחגיגה ענקית של שמחה.',
    time: '15:00-18:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$48',
    ageGroup: '2-99',
    spotsLeft: 60
  },
  {
    id: 12,
    date: '2026-04-13',
    title: 'פסח בנברלנד',
    description: 'סדר פסח קסום עם פיטר פן! סיפור יציאת מצרים בגרסת נברלנד, משחקים ופעילויות חגיגיות.',
    time: '18:00-21:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$55',
    ageGroup: 'כל המשפחה',
    spotsLeft: 45
  },
  {
    id: 13,
    date: '2026-05-18',
    title: 'ל״ג בעומר - יום הרפתקאות',
    description: 'חגיגת ל״ג בעומר עם פיטר פן! מדורות, חץ וקשת, משחקי שדה והרפתקאות בטבע.',
    time: '16:00-20:00',
    location: 'פארק בוקה רטון',
    type: 'adventure',
    price: '$35',
    ageGroup: '5-16',
    spotsLeft: 30
  },
  {
    id: 14,
    date: '2026-06-02',
    title: 'שבועות - חג הקציר',
    description: 'חגיגת שבועות עם פיטר פן! למידה על החג, קציר פירות וירקות בגינה הקסומה של נברלנד.',
    time: '09:00-12:00',
    location: 'מרכז הקהילה',
    type: 'adventure',
    price: '$28',
    ageGroup: '3-12',
    spotsLeft: 20
  },
  {
    id: 15,
    date: '2026-01-20',
    title: 'שבת מיוחדת עם פיטר פן',
    description: 'שבת משפחתית קסומה עם פיטר פן! הדלקת נרות, קידוש, סעודת שבת ופעילויות רוחניות מיוחדות.',
    time: '17:00-20:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$35',
    ageGroup: 'כל המשפחה',
    spotsLeft: 40
  },
  {
    id: 16,
    date: '2025-09-21',
    title: 'הושענא רבה - יום השופר',
    description: 'חגיגת הושענא רבה עם פיטר פן! תקיעות שופר קסומות, מעגלי הושענות ופעילויות חגיגיות.',
    time: '16:30-19:00',
    location: 'פארק בוקה רטון',
    type: 'special',
    price: '$40',
    ageGroup: '4-16',
    spotsLeft: 35
  },
  {
    id: 17,
    date: '2025-09-22',
    title: 'שמחת תורה בנברלנד',
    description: 'חגיגת שמחת תורה עם פיטר פן! ריקודים עם ספרי תורה, דגלים צבעוניים ושמחה רבה.',
    time: '15:00-18:00',
    location: 'מרכז הקהילה',
    type: 'special',
    price: '$42',
    ageGroup: 'כל הגילאים',
    spotsLeft: 50
  },
  {
    id: 18,
    date: '2026-07-29',
    title: 'תשעה באב - יום זכרון',
    description: 'יום זכרון ומחשבה עם פיטר פן. פעילויות רגישות, סיפורים היסטוריים וזמן לרפלקציה.',
    time: '19:00-21:00',
    location: 'אולם האירועים המרכזי',
    type: 'special',
    price: '$30',
    ageGroup: '8+',
    spotsLeft: 25
  },
  {
    id: 19,
    date: '2026-08-15',
    title: 'ט״ו באב - חגיגת האהבה',
    description: 'חגיגת ט״ו באב עם פיטר פן! יום האהבה היהודי, פעילויות זוגיות ומשפחתיות וחגיגה מיוחדת.',
    time: '17:00-20:00',
    location: 'פארק בוקה רטון',
    type: 'special',
    price: '$45',
    ageGroup: 'כל המשפחה',
    spotsLeft: 30
  },
  {
    id: 20,
    date: '2025-12-07',
    title: 'חנוכת הבית עם פיטר פן',
    description: 'חנוכת בית חדש עם ברכות ופיטר פן! טקס חנוכה מיוחד, ברכות לבית החדש ואירוח קסום.',
    time: '18:00-20:30',
    location: 'לפי בחירה',
    type: 'special',
    price: '$85',
    ageGroup: 'כל המשפחה',
    spotsLeft: 15
  },
  {
    id: 21,
    date: '2026-03-01',
    title: 'ראש חודש אדר - חודש השמחה',
    description: 'חגיגת ראש חודש אדר עם פיטר פן! תחילת חודש השמחה, הכנות לפורים ופעילויות שמחה.',
    time: '16:00-18:00',
    location: 'מרכז הקהילה',
    type: 'special',
    price: '$25',
    ageGroup: '3-14',
    spotsLeft: 40
  }
];

const typeColors = {
  pirate: '#dc2626',
  fairy: '#a855f7', 
  adventure: '#10b981',
  special: '#f59e0b'
};

const typeIcons = {
  pirate: '🏴‍☠️',
  fairy: '🧚‍♀️',
  adventure: '⭐',
  special: '👑'
};

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          style={{
            minHeight: '80px',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            backgroundColor: isToday ? '#fef3c7' : '#ffffff',
            borderRadius: '8px',
            cursor: dayEvents.length > 0 ? 'pointer' : 'default',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (dayEvents.length > 0) {
              e.currentTarget.style.backgroundColor = '#f0fdf4';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (dayEvents.length > 0) {
              e.currentTarget.style.backgroundColor = isToday ? '#fef3c7' : '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <div style={{ 
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? '#92400e' : '#374151',
            marginBottom: '0.25rem'
          }}>
            {day}
          </div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                fontSize: '0.75rem',
                padding: '2px 4px',
                borderRadius: '4px',
                backgroundColor: typeColors[event.type],
                color: 'white',
                marginBottom: '2px',
                cursor: 'pointer'
              }}
            >
              {typeIcons[event.type]} {event.title.substring(0, 15)}...
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

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
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            📅✨🎪
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
            📅 לוח האירועים הקסום
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            גלו את כל האירועים המיוחדים שלנו והזמינו את המקום שלכם בהרפתקאות הקסומות
          </p>
        </div>

        {/* Calendar Navigation */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ←
            </button>
            
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #10b981, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {months[selectedMonth]} {selectedYear}
            </h2>
            
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              →
            </button>
          </div>

          {/* Days of week header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px',
            marginBottom: '1rem'
          }}>
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
              <div key={day} style={{ 
                textAlign: 'center', 
                fontWeight: 'bold',
                padding: '1rem',
                background: '#f3f4f6',
                borderRadius: '8px'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px'
          }}>
            {renderCalendar()}
          </div>
        </div>

        {/* Event Types Legend */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            סוגי אירועים
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: color,
                  borderRadius: '4px'
                }} />
                <span>{typeIcons[type as keyof typeof typeIcons]}</span>
                <span>
                  {type === 'pirate' && 'הרפתקאות פיראטים'}
                  {type === 'fairy' && 'קסמי פיות'}
                  {type === 'adventure' && 'הרפתקאות כלליות'}
                  {type === 'special' && 'אירועים מיוחדים'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '2rem'
          }}
        >
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            🎪 האירועים הקרובים
          </h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                  border: `2px solid ${typeColors[event.type]}`,
                  borderRadius: '15px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{typeIcons[event.type]}</span>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: typeColors[event.type], margin: 0 }}>
                        {event.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '1rem', color: '#666', margin: '0 0 0.5rem 0' }}>
                      {event.description}
                    </p>
                  </div>
                  <div style={{ 
                    background: typeColors[event.type],
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {event.price}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <div>📅 {new Date(event.date).toLocaleDateString('he-IL')}</div>
                  <div>⏰ {event.time}</div>
                  <div>📍 {event.location}</div>
                  <div>👶 גילאי {event.ageGroup}</div>
                  <div style={{ color: event.spotsLeft < 10 ? '#dc2626' : '#10b981' }}>
                    🎟️ נשארו {event.spotsLeft} מקומות
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={() => setSelectedEvent(null)}
        >
          <div
            data-card
            style={{
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: typeColors[selectedEvent.type], margin: 0 }}>
                {typeIcons[selectedEvent.type]} {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {selectedEvent.description}
            </p>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div><strong>📅 תאריך:</strong> {new Date(selectedEvent.date).toLocaleDateString('he-IL')}</div>
              <div><strong>⏰ שעה:</strong> {selectedEvent.time}</div>
              <div><strong>📍 מקום:</strong> {selectedEvent.location}</div>
              <div><strong>👶 גילאים:</strong> {selectedEvent.ageGroup}</div>
              <div><strong>💰 מחיר:</strong> {selectedEvent.price}</div>
              <div style={{ color: selectedEvent.spotsLeft < 10 ? '#dc2626' : '#10b981' }}>
                <strong>🎟️ מקומות פנויים:</strong> {selectedEvent.spotsLeft}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                data-button
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🎫 הרשמה לאירוע
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
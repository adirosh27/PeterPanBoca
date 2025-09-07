'use client';

import React, { useState, useEffect } from 'react';

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

interface Holiday {
  date: string;
  name: string;
  emoji: string;
  color: string;
}

const birthdays = [
  { name: 'Oren Benvenisti', month: 8, day: 30 },
  { name: 'Eyal Bishri', month: 12, day: 10 },
  { name: 'Ron Dickson', month: 11, day: 1 },
  { name: 'Yossi Chaham', month: 10, day: 29 },
  { name: 'Ofer Gilady', month: 1, day: 21 },
  { name: 'Adir Hazan', month: 10, day: 27 },
  { name: 'Nadav Houri', month: 5, day: 13 },
  { name: 'Daniel Kern', month: 3, day: 3 },
  { name: 'Avi Levi', month: 7, day: 8 },
  { name: 'Steven (Shuly) Michaels', month: 12, day: 3 },
  { name: 'Tal Shaked', month: 7, day: 25 },
  { name: 'Sagie Shanun', month: 2, day: 21 },
  { name: 'Momy Shoshan', month: 1, day: 3 },
  { name: 'Lior Tamir', month: 12, day: 6 },
  { name: 'Amit Tirosh', month: 12, day: 15 },
  { name: 'Roee Vulkan', month: 10, day: 6 },
  { name: 'Roei Wagner', month: 7, day: 21 },
  { name: 'Shay Zaidenberg', month: 12, day: 24 },
  { name: 'Shalom Sapir', month: 12, day: 24 },
  { name: 'Dudi Amsalem', month: 6, day: 29 },
  { name: 'Shalom Moldavski', month: 9, day: 17 },
];

// Generate birthday events for multiple years
const generateBirthdays = (startYear: number, endYear: number): Holiday[] => {
  const birthdayEvents: Holiday[] = [];
  for (let year = startYear; year <= endYear; year++) {
    birthdays.forEach(birthday => {
      const date = `${year}-${birthday.month.toString().padStart(2, '0')}-${birthday.day.toString().padStart(2, '0')}`;
      birthdayEvents.push({
        date,
        name: `יום הולדת ${birthday.name}`,
        emoji: '🎂',
        color: '#ec4899'
      });
    });
  }
  return birthdayEvents;
};

const holidays: Holiday[] = [
  // 2024-2025 Jewish Holidays
  { date: '2024-12-25', name: 'חנוכה - יום 1', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-26', name: 'חנוכה - יום 2', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-27', name: 'חנוכה - יום 3', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-28', name: 'חנוכה - יום 4', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-29', name: 'חנוכה - יום 5', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-30', name: 'חנוכה - יום 6', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2024-12-31', name: 'חנוכה - יום 7', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-01-01', name: 'חנוכה - יום 8', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-02-13', name: 'ט״ו בשבט', emoji: '🌳', color: '#22c55e' },
  { date: '2025-03-14', name: 'פורים', emoji: '🎭', color: '#f97316' },
  { date: '2025-04-13', name: 'פסח - יום 1', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-14', name: 'פסח - יום 2', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-15', name: 'חול המועד פסח', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-16', name: 'חול המועד פסח', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-17', name: 'חול המועד פסח', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-18', name: 'חול המועד פסח', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-19', name: 'פסח - יום 7', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-20', name: 'פסח - יום 8', emoji: '🍞', color: '#eab308' },
  { date: '2025-04-27', name: 'יום השואה', emoji: '🕯️', color: '#6b7280' },
  { date: '2025-05-05', name: 'יום הזכרון', emoji: '🇮🇱', color: '#6b7280' },
  { date: '2025-05-06', name: 'יום העצמאות', emoji: '🇮🇱', color: '#3b82f6' },
  { date: '2025-05-18', name: 'ל״ג בעומר', emoji: '🏹', color: '#84cc16' },
  { date: '2025-05-25', name: 'יום ירושלים', emoji: '🏛️', color: '#f59e0b' },
  { date: '2025-06-02', name: 'שבועות - יום 1', emoji: '🌾', color: '#06b6d4' },
  { date: '2025-06-03', name: 'שבועות - יום 2', emoji: '🌾', color: '#06b6d4' },
  { date: '2025-07-13', name: 'תשעה באב', emoji: '😢', color: '#6b7280' },
  { date: '2025-08-09', name: 'ט״ו באב', emoji: '💕', color: '#f43f5e' },
  { date: '2025-09-23', name: 'ראש השנה - יום 1', emoji: '🍯', color: '#f59e0b' },
  { date: '2025-09-24', name: 'ראש השנה - יום 2', emoji: '🍯', color: '#f59e0b' },
  { date: '2025-10-02', name: 'יום כיפור', emoji: '🕊️', color: '#6b7280' },
  { date: '2025-10-07', name: 'סוכות - יום 1', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-08', name: 'סוכות - יום 2', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-09', name: 'חול המועד סוכות', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-10', name: 'חול המועד סוכות', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-11', name: 'חול המועד סוכות', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-12', name: 'חול המועד סוכות', emoji: '🌿', color: '#10b981' },
  { date: '2025-10-13', name: 'הושענא רבה', emoji: '📯', color: '#8b5cf6' },
  { date: '2025-10-14', name: 'שמחת תורה', emoji: '📜', color: '#3b82f6' },
  { date: '2025-12-15', name: 'חנוכה - יום 1', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-16', name: 'חנוכה - יום 2', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-17', name: 'חנוכה - יום 3', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-18', name: 'חנוכה - יום 4', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-19', name: 'חנוכה - יום 5', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-20', name: 'חנוכה - יום 6', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-21', name: 'חנוכה - יום 7', emoji: '🕯️', color: '#0ea5e9' },
  { date: '2025-12-22', name: 'חנוכה - יום 8', emoji: '🕯️', color: '#0ea5e9' },
  // Add birthdays for multiple years (2024-2030)
  ...generateBirthdays(2024, 2030)
];

const events: Event[] = [
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

  // Get today's birthdays - memoized to avoid recalculation
  const todaysBirthdays = React.useMemo(() => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const birthdaysToday = birthdays.filter(birthday => 
      birthday.month === todayMonth && birthday.day === todayDay
    );
    return birthdaysToday.map(birthday => ({
      date: today.toISOString().split('T')[0],
      name: `יום הולדת ${birthday.name}`,
      emoji: '🎂',
      color: '#ec4899'
    }));
  }, []);

  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getHolidaysForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Get birthdays for this date
    const birthdaysToday = birthdays.filter(birthday => 
      birthday.month === month && birthday.day === day
    ).map(birthday => ({
      date: dateString,
      name: `יום הולדת ${birthday.name}`,
      emoji: '🎂',
      color: '#ec4899'
    }));
    
    // Get regular holidays
    const regularHolidays = holidays.filter(holiday => holiday.date === dateString);
    
    return [...regularHolidays, ...birthdaysToday];
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
      const dayHolidays = getHolidaysForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          style={{
            minHeight: 'clamp(60px, 15vw, 80px)',
            padding: 'clamp(0.25rem, 1vw, 0.5rem)',
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
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {day}
            {dayHolidays.map(holiday => (
              <span
                key={holiday.name}
                style={{
                  fontSize: '0.8rem',
                  color: holiday.color
                }}
                title={holiday.name}
              >
                {holiday.emoji}
              </span>
            ))}
          </div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
                padding: 'clamp(1px, 0.5vw, 2px) clamp(2px, 1vw, 4px)',
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
          {dayHolidays.length > 0 && (
            <div style={{
              fontSize: '0.7rem',
              color: '#666',
              marginTop: '0.25rem'
            }}>
              {dayHolidays.map(holiday => holiday.name).join(', ')}
            </div>
          )}
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

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Birthday Notification */}
        {todaysBirthdays.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '100px',
            left: '20px',
            zIndex: 999,
            background: 'linear-gradient(135deg, #ec4899, #f97316)',
            color: 'white',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)',
            animation: 'bounce 2s infinite',
            maxWidth: 'clamp(200px, 25vw, 300px)',
            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>🎂</span>
              <strong>יום הולדת היום!</strong>
            </div>
            {todaysBirthdays.map((birthday, index) => {
              const displayName = birthday.name.replace('יום הולדת ', '');
              return (
                <div key={`birthday-${index}`} style={{ 
                  fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
                  marginBottom: index < todaysBirthdays.length - 1 ? '0.25rem' : '0' 
                }}>
                  {displayName}
                </div>
              );
            })}
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
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
            padding: 'clamp(1.5rem, 4vw, 2rem)',
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
            padding: 'clamp(1.5rem, 4vw, 2rem)',
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
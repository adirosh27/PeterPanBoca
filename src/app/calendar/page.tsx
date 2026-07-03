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
  { name: 'Moshe Marcu', month: 12, day: 8 },
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
  { name: 'Itamar Ankorion', month: 10, day: 4 },
  { name: 'Safi Bar', month: 2, day: 23 },
  { name: 'Ori Feigin', month: 5, day: 6 },
];


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
  { date: '2025-12-22', name: 'חנוכה - יום 8', emoji: '🕯️', color: '#0ea5e9' }
];

const events: Event[] = [
  {
    id: 1,
    date: '2026-01-30',
    title: 'ארוחת שישי משפחות',
    description: 'ארוחת שישי משפחתית - כל משפחה מביאה אוכל לשיתוף.',
    time: '19:30',
    location: 'Boca Falls Club House',
    type: 'special',
    price: 'חינם',
    ageGroup: 'כל המשפחה',
    spotsLeft: 50
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
    date: '2026-06-14',
    title: '🎤 חאפלת הקריוקי הגדולה',
    description: 'ערב קריוקי גדול לכל המשפחה! שירים, ריקודים והרבה כיף.',
    time: '19:30',
    location: 'Boca Falls Club House',
    type: 'special',
    price: 'חינם',
    ageGroup: 'כל המשפחה',
    spotsLeft: 50
  },
  {
    id: 8,
    date: '2026-07-19',
    title: '🏆 גמר מונדיאל 2026™',
    description: 'צפייה משותפת בגמר FIFA World Cup 2026™! בואו לחגוג את הרגע הגדול ביותר בכדורגל העולמי יחד עם כל הקהילה.',
    time: '15:00',
    location: 'Saturnia Clubhouse - 19350 Saturnia Lakes Dr, Boca Raton, FL 33498',
    type: 'special',
    price: 'חינם',
    ageGroup: 'כל המשפחה',
    spotsLeft: 50
  },
  {
    id: 9,
    date: '2026-07-30',
    title: '📋 מפגש דיון חצי שנתי',
    description: 'מפגש דיון חצי שנתי להתנהלות ותקנון הקבוצה.',
    time: '20:00',
    location: 'Boca Falls Club House',
    type: 'special',
    price: 'חינם',
    ageGroup: 'כל המשפחה',
    spotsLeft: 50
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

const typeLabels = {
  pirate: 'הרפתקאות פיראטים',
  fairy: 'קסמי פיות',
  adventure: 'הרפתקאות כלליות',
  special: 'אירועים מיוחדים'
};

// Rich two-tone gradients used for the event modal's hero banner
const typeGradients: Record<Event['type'], string> = {
  pirate: 'linear-gradient(135deg, #f87171 0%, #dc2626 45%, #7c2d12 100%)',
  fairy: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 50%, #6d28d9 100%)',
  adventure: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 50%, #047857 100%)',
  special: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #b45309 100%)'
};

// Floating decorative emoji scattered across the hero banner, per event type
const typeDecor: Record<Event['type'], string[]> = {
  pirate: ['🏴‍☠️', '⚓', '💀', '🗺️'],
  fairy: ['🧚‍♀️', '✨', '🌟', '🦋'],
  adventure: ['⭐', '🧭', '🗺️', '🌟'],
  special: ['👑', '🎉', '✨', '🎊']
};

const SPARKLES = ['✨', '⭐', '🌟', '💫'];

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
            minHeight: 'clamp(60px, 15vw, 84px)',
            padding: 'clamp(0.35rem, 1.2vw, 0.6rem)',
            border: isToday ? '2px solid #f59e0b' : '1px solid rgba(16, 185, 129, 0.15)',
            backgroundColor: isToday ? 'rgba(254, 243, 199, 0.85)' : 'rgba(255, 255, 255, 0.75)',
            borderRadius: '12px',
            cursor: dayEvents.length > 0 ? 'pointer' : 'default',
            transition: 'all 0.25s ease',
            boxShadow: isToday ? '0 0 0 3px rgba(245, 158, 11, 0.15)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (dayEvents.length > 0) {
              e.currentTarget.style.backgroundColor = 'rgba(240, 253, 244, 0.95)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (dayEvents.length > 0) {
              e.currentTarget.style.backgroundColor = isToday ? 'rgba(254, 243, 199, 0.85)' : 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = isToday ? '0 0 0 3px rgba(245, 158, 11, 0.15)' : 'none';
            }
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginBottom: '0.25rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isToday ? 'clamp(1.3rem, 4vw, 1.6rem)' : 'auto',
              height: isToday ? 'clamp(1.3rem, 4vw, 1.6rem)' : 'auto',
              borderRadius: '50%',
              background: isToday ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'transparent',
              color: isToday ? 'white' : '#374151',
              fontWeight: isToday ? 'bold' : 'normal',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)'
            }}>
              {day}
            </span>
            {dayHolidays.map(holiday => (
              <span
                key={holiday.name}
                style={{
                  fontSize: '0.75rem',
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
                fontSize: 'clamp(0.6rem, 2vw, 0.72rem)',
                padding: 'clamp(2px, 0.6vw, 3px) clamp(5px, 1.2vw, 7px)',
                borderRadius: '999px',
                background: `linear-gradient(135deg, ${typeColors[event.type]}, ${typeColors[event.type]}cc)`,
                color: 'white',
                marginBottom: '3px',
                cursor: 'pointer',
                boxShadow: `0 2px 6px ${typeColors[event.type]}55`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {typeIcons[event.type]} {event.title.length > 14 ? `${event.title.substring(0, 14)}…` : event.title}
            </div>
          ))}
          {dayHolidays.length > 0 && (
            <div style={{
              fontSize: '0.65rem',
              color: '#6b7280',
              marginTop: '0.2rem',
              fontStyle: 'italic'
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
      position: 'relative',
      overflow: 'hidden',
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

        @keyframes sparkleDrift {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
          50% { transform: translateY(-18px) rotate(15deg); opacity: 0.7; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
        }

        @keyframes modalPopIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
      `}</style>

      {/* Ambient floating sparkles */}
      {[...Array(10)].map((_, i) => (
        <span
          key={`sparkle-${i}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            opacity: 0.4,
            pointerEvents: 'none',
            animation: `sparkleDrift ${4 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            zIndex: 0
          }}
        >
          {SPARKLES[i % SPARKLES.length]}
        </span>
      ))}

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>
            ✨ 📅 ✨
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
            לוח האירועים הקסום
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', color: '#374151' }}>
            גלו את כל האירועים המיוחדים שלנו והזמינו את המקום שלכם בהרפתקאות הקסומות
          </p>
        </div>

        {/* Calendar Navigation */}
        <div
          data-card
          style={{
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.12)'
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
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
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
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
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
            gap: '4px',
            marginBottom: '0.75rem'
          }}>
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
              <div key={day} style={{
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(251, 191, 36, 0.12))',
                borderRadius: '10px',
                color: '#059669'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px'
          }}>
            {renderCalendar()}
          </div>
        </div>

        {/* Event Types Legend */}
        <div
          data-card
          style={{
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.12)'
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.25rem', textAlign: 'center', color: '#374151' }}>
            סוגי אירועים
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {(Object.keys(typeColors) as Array<keyof typeof typeColors>).map((type) => (
              <div
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '999px',
                  background: `${typeColors[type]}14`,
                  border: `1.5px solid ${typeColors[type]}44`,
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '1.1rem' }}>{typeIcons[type]}</span>
                <span style={{ color: '#374151', fontWeight: 500 }}>{typeLabels[type]}</span>
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
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}
        onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'rgba(255, 255, 255, 0.97)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
              animation: 'modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero banner */}
            <div style={{
              position: 'relative',
              height: 'clamp(150px, 30vw, 210px)',
              background: typeGradients[selectedEvent.type],
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Scattered decorative emoji */}
              {typeDecor[selectedEvent.type].map((emoji, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: `${[15, 65, 20, 70][i % 4]}%`,
                    left: `${[10, 15, 85, 80][i % 4]}%`,
                    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                    opacity: 0.5,
                    animation: `sparkleDrift ${3 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  {emoji}
                </span>
              ))}

              {/* Big centered type icon */}
              <span style={{
                fontSize: 'clamp(3.5rem, 9vw, 5rem)',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
                animation: 'heroFloat 3s ease-in-out infinite'
              }}>
                {typeIcons[selectedEvent.type]}
              </span>

              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                aria-label="סגור"
                style={{
                  position: 'absolute',
                  top: '0.9rem',
                  insetInlineEnd: '0.9rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  color: '#374151',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                ✕
              </button>

              {/* Title scrim */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem 1.5rem 1rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#374151', marginBottom: '1.5rem', borderInlineStart: `3px solid ${typeColors[selectedEvent.type]}`, paddingInlineStart: '0.9rem' }}>
                {selectedEvent.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                {[
                  { icon: '📅', label: 'תאריך', value: new Date(selectedEvent.date + 'T12:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' }) },
                  { icon: '⏰', label: 'שעה', value: selectedEvent.time },
                  { icon: '💰', label: 'מחיר', value: selectedEvent.price },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: `${typeColors[selectedEvent.type]}0f`,
                    border: `1px solid ${typeColors[selectedEvent.type]}33`,
                    borderRadius: '14px',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.95rem' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 1.1rem',
                  borderRadius: '14px',
                  background: `${typeColors[selectedEvent.type]}0f`,
                  border: `1px solid ${typeColors[selectedEvent.type]}33`,
                  textDecoration: 'none',
                  color: '#1f2937',
                  marginBottom: '1.25rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${typeColors[selectedEvent.type]}22`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${typeColors[selectedEvent.type]}0f`}
              >
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <span style={{ fontWeight: 500 }}>{selectedEvent.location}</span>
              </a>

              {selectedEvent.spotsLeft <= 10 && (
                <div style={{
                  textAlign: 'center',
                  padding: '0.7rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #fca5a5, #f87171)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  🔥 נשארו רק {selectedEvent.spotsLeft} מקומות!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

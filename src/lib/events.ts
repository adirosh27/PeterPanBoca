// Calendar events, shared by the calendar page (client) and the event-invite
// emails (server). Adding an event here emails an invite to every active member
// on the next run of /api/events/send-invites (daily cron).

export interface Event {
  id: number;
  date: string;
  endDate?: string; // last day of a multi-day event (inclusive)
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'pirate' | 'fairy' | 'adventure' | 'special';
  price: string;
  ageGroup: string;
  spotsLeft: number;
}

// Placeholder for details that haven't been announced yet
export const TBA = 'יפורסם בהמשך';

export const events: Event[] = [
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
  {
    id: 10,
    date: '2026-11-14',
    endDate: '2026-11-15',
    title: '🤠 סופ״ש בריבר ראנץ׳',
    description: 'סוף שבוע בריזורט וחוות הרודאו ריבר ראנץ׳ - לחברי הקבוצה בלבד.',
    time: 'שבת-ראשון, 14-15 בנובמבר',
    location: 'Westgate River Ranch Resort & Rodeo, 3200 River Ranch Blvd, River Ranch, FL',
    type: 'adventure',
    price: '',
    ageGroup: 'חברים בלבד',
    spotsLeft: 50
  },
  {
    id: 11,
    date: '2026-12-19',
    title: '🏇 יום במרוצים',
    description: 'יום במרוצים עם כל הקבוצה! פרטים נוספים יפורסמו בהמשך.',
    time: TBA,
    location: 'Gulfstream Park, 901 S Federal Hwy, Hallandale Beach, FL 33009',
    type: 'special',
    price: '',
    ageGroup: 'גברים בלבד',
    spotsLeft: 50
  },
];

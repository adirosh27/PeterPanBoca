'use client';

const regulations = [
  {
    title: 'מטרת הקבוצה',
    content: 'מטרת הקבוצה היא גיבוש וחיזוק קשרי החברות באמצעות מפגשים ופעילויות מגוונות.',
    icon: '🎯'
  },
  {
    title: 'התנהגות',
    content: 'החברים מתחייבים לשמור על שיח מכבד ונאות כלפי כלל חברי הקבוצה.',
    icon: '🤝'
  },
  {
    title: 'מספר חברים',
    content: 'מספר חברי הקבוצה לא יעלה על 27 חברים.',
    icon: '👥'
  },
  {
    title: 'השתתפות באירועים',
    content: 'במידה וחבר לא יגיע לכל הפחות ל-50% מהמפגשים במהלך 12 חודשים הוא יוצא מהקבוצה. הספירה תחל מאוגוסט, ותכלול מפגשי דיון חצי שנתיים לתקנון ופעילות הקבוצה.',
    icon: '📅'
  },
  {
    title: 'מעורבות בארגון',
    content: 'כל חבר מחויב להיות מעורב באופן פעיל בארגון אירוע, הן באופן עצמאי והן בשיתוף עם חבר אחד או יותר.',
    icon: '🎪'
  },
  {
    title: 'בדיקת ספקים',
    content: 'במידה והאירוע מתקיים במקום המספק שירותים, על מארגן האירוע לבדוק מראש את תנאי הספק, ובכלל זה:',
    subItems: [
      'כמות משתתפים (מינימום הזמנה)',
      'סכום ההשתתפות כולל מיסים',
      'תנאים נוספים שעל החברים לדעת'
    ],
    icon: '📋'
  },
  {
    title: 'תיאום עם הוועד',
    content: 'כל אירוע יתואם עם חברי הוועד לפני הצגתו לחברי הקבוצה. על המארגן לתאם עם אחד מחברי הוועד כבר בשלב התכנון ולעדכן בהתקדמות.',
    icon: '✅'
  },
  {
    title: 'קבוצת וואטסאפ לאירוע',
    content: 'לכל פעילות חודשית הצוות המוציא לפועל יפתח צ\'אט וואטסאפ שדרכו תנוהל ההיערכות, ושיחות הנוגעות למפגש. זאת על מנת להשאיר את הצ\'אט העיקרי פנוי ולאפשר למשתתפים במפגש להתעדכן ללא בעיה וצורך לחפש מידע על המפגש בסבך ההתכתבויות השונות.',
    icon: '💬'
  },
  {
    title: 'מחויבות תשלום',
    content: 'כל חבר שהתחייב להגיע לאירוע מחויב בתשלום עבורו, גם אם נאלץ לבטל לאחר סגירת האירוע, אלא אם מצא מחליף שיגיע במקומו.',
    icon: '💰'
  },
  {
    title: 'הצטרפות מאוחרת',
    content: 'הצטרפות לאירוע לאחר התאריך שפורסם תתאפשר על בסיס מקום פנוי בלבד ובאישור מארגן האירוע.',
    icon: '⏰'
  },
  {
    title: 'הבאת אורחים',
    content: 'הבאת אורח שאינו חבר בקבוצה למפגש חודשי תתאפשר רק באישור מראש של חברי הוועד, ובכפוף למגבלה של אורח אחד בלבד למפגש. בקשה להבאת אורח תתאפשר רק במצב של: "יש לי אורח שמבקר אותי ואני לא רוצה להשאיר אותו לבד."',
    icon: '🎫'
  },
  {
    title: 'אחריות מארגן',
    content: 'חבר שלקח על עצמו לתכנן מפגש אחראי להוציאו לפועל. אי הוצאה לפועל של המפגש מהווה עילה להוצאה מהקבוצה.',
    icon: '⚠️'
  },
  {
    title: 'מועמד לחברות בקבוצה',
    content: 'תהליך ההצטרפות לקבוצה:',
    subItems: [
      'הצטרפות תתאפשר על בסיס מקום פנוי בלבד',
      'המועמד יתבקש להגיע למפגש אחד כאורח',
      'לאחר מכן יצטרף לצוות להפקת פעילות',
      'נדרשות המלצות מלפחות 50% מחברי הקבוצה, בהצבעה אנונימית'
    ],
    icon: '🆕'
  },
  {
    title: 'חבר במילואים',
    content: 'חבר פיטר פן שהעתיק את מקום מגוריו מחוץ לאזור, אך ממשיך להגיע לביקורים:',
    subItems: [
      'אינו תופס מקום בקבוצה',
      'אינו מחויב לפעילויות',
      'בעת ביקורו – מוזמן להצטרף לפעילויות'
    ],
    icon: '🏠'
  },
  {
    title: 'שינוי תקנון',
    content: 'הצעה לשינוי או הוספת כללים תוצג בפני חברי הוועד, אשר יעלו אותה להצבעה בקבוצה. שינוי או הוספה מחייבים רוב.',
    icon: '📝'
  },
  {
    title: 'פגישה דו-שנתית',
    content: 'תתקיים פגישה דו-שנתית של כלל חברי הקבוצה, במסגרתה יידונו דרכי התייעלות ועדכון התקנון.',
    icon: '🗓️'
  }
];

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
            📜 תקנון פיטר פן
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

        {/* Committee Section */}
        <div
          data-card
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '20px',
            padding: 'clamp(1.5rem, 5vw, 2rem)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(251, 191, 36, 0.3)',
            marginBottom: '2rem',
            direction: 'rtl',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
            fontWeight: 'bold',
            color: '#d97706',
            marginBottom: '1rem'
          }}>
            👑 וועד הקבוצה
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            color: '#4b5563',
            marginBottom: '1.25rem'
          }}>
            וועד הקבוצה מונה 5 חברים, ויהיה וועד מנהל בהתאם למסגרת התקנון:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            {['עופר גלעדי', 'משה מרקו', 'רון דיקסון', 'טל שקד', 'אבי לוי'].map((name, index) => (
              <span
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1f2937',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Regulations Content */}
        <div
          data-card
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '20px',
            padding: 'clamp(1.5rem, 5vw, 3rem)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{
            direction: 'rtl',
            textAlign: 'right',
            lineHeight: '1.8',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            color: '#1f2937'
          }}>
            {regulations.map((reg, index) => (
              <div
                key={index}
                style={{
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(251, 191, 36, 0.08))'
                    : 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(16, 185, 129, 0.08))',
                  borderRadius: '15px',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  marginBottom: '1rem',
                  borderRight: `4px solid ${index % 2 === 0 ? '#10b981' : '#fbbf24'}`
                }}
              >
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                  fontWeight: 'bold',
                  color: index % 2 === 0 ? '#10b981' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{reg.icon}</span>
                  <span>{index + 1}. {reg.title}</span>
                </h3>
                <p style={{ margin: 0 }}>{reg.content}</p>
                {reg.subItems && (
                  <ul style={{
                    margin: '0.75rem 0 0 0',
                    paddingRight: '1.5rem',
                    listStyleType: 'disc'
                  }}>
                    {reg.subItems.map((item, subIndex) => (
                      <li key={subIndex} style={{ marginBottom: '0.25rem' }}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#6b7280',
          fontSize: '0.9rem',
          direction: 'rtl'
        }}>
          <p>📌 התקנון עודכן לאחרונה: ינואר 2026</p>
        </div>
      </div>
    </div>
  );
}

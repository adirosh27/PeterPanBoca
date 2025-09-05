'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  event: string;
  date: string;
  childAge?: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'שרה כהן',
    location: 'בוקה רטון',
    rating: 5,
    review: 'חוויה פשוט מדהימה! הילדים שלי לא הפסיקו לדבר על האירוע כבר שבוע. פיטר פן היה כל כך אמיתי ומרתק. הארגון היה מושלם וכל פרט היה מתוכנן בצורה יפה. בהחלט נחזור!',
    event: 'טיסה לנברלנד',
    date: '2023-12-15',
    childAge: 'גיל 6 ו-8',
    avatar: '👩‍🦱'
  },
  {
    id: 2,
    name: 'דוד לוי',
    location: 'דלריי ביץ׳',
    rating: 5,
    review: 'יום הולדת בלתי נשכח לבת שלי! כל הדמויות היו פנטסטיות, במיוחד טינקר בל שעשתה עם הילדים אבק פיות אמיתי. השירות היה מקצועי והילדים נהנו כל רגע.',
    event: 'יום הולדת מיוחד',
    date: '2023-11-28',
    childAge: 'גיל 5',
    avatar: '👨‍🦲'
  },
  {
    id: 3,
    name: 'מיכל אברמס',
    location: 'פומפנו ביץ׳',
    rating: 5,
    review: 'הבנות שלי (גיל 4 ו-7) פשוט התלהבו מנשף הפיות! האווירה הייתה קסומה, הפעילויות מגוונות ומעניינות. המארגנים היו סבלניים ואוהבי ילדים. המחיר הגון לחוויה כזו מיוחדת.',
    event: 'נשף הפיות הקסום',
    date: '2023-11-20',
    childAge: 'גיל 4 ו-7',
    avatar: '👩‍🦰'
  },
  {
    id: 4,
    name: 'יוסי ברק',
    location: 'בוקה רטון',
    rating: 4,
    review: 'אירוע הפיראטים היה מדהים! הילד שלי אוהב הרפתקאות והוא פשוט נהנה מכל רגע. קפטן הוק היה מצחיק ומפחיד בדיוק במידה הנכונה. יש לי רק הערה קטנה על הזמינות של החנייה, אבל זה לא פגע בחוויה.',
    event: 'הרפתקת הפיראטים',
    date: '2023-11-10',
    childAge: 'גיל 9',
    avatar: '👨'
  },
  {
    id: 5,
    name: 'רונית גולדברג',
    location: 'דיירפילד ביץ׳',
    rating: 5,
    review: 'ורקשוף היצירה עם וונדי היה פשוט מושלם! הילדים יצרו זכרונות יפים ולמדו דברים חדשים. המדריכה הייתה מקסימה וסבלנית. הילדים חזרו הביתה עם יצירות מדהימות וחיוכים ענקיים על הפנים.',
    event: 'ורקשוף יצירה',
    date: '2023-10-25',
    childAge: 'גיל 6, 8 ו-10',
    avatar: '👩‍🦳'
  },
  {
    id: 6,
    name: 'עמית רוזן',
    location: 'בוקה רטון',
    rating: 5,
    review: 'מסיבת הקרנבל הייתה אירוע משפחתי מושלם! גם הילדים וגם המבוגרים נהנו. האוכל היה טעים, הבידור מגוון והאווירה חמה ומזמינה. זה בדיוק מה שחיפשנו לאירוע משפחתי.',
    event: 'מסיבת קרנבל',
    date: '2023-10-15',
    childAge: 'כל המשפחה',
    avatar: '👨‍💼'
  },
  {
    id: 7,
    name: 'נויה שמעון',
    location: 'וסט פאלם ביץ׳',
    rating: 5,
    review: 'פעם שנייה שאנחנו מגיעים לאירועים שלכם ושוב לא מאכזבים! הרמה הגבוהה, תשומת הלב לפרטים והאהבה לילדים - זה מה שעושה את ההבדל. ממליצה בחום לכל המשפחות באזור!',
    event: 'טיסה לנברלנד',
    date: '2023-09-30',
    childAge: 'גיל 5 ו-7',
    avatar: '👩‍💼'
  },
  {
    id: 8,
    name: 'אלון כץ',
    location: 'בוקה רטון',
    rating: 4,
    review: 'חוויה נהדרת לכל המשפחה! הילדים שלי עדיין מדברים על פיטר פן וטינקר בל. המחיר קצת יקר אבל שווה את זה לחוויה כזו מיוחדת. התמונות שיצאו מדהימות ויהיו לנו זכרון לכל החיים.',
    event: 'יום הולדת מיוחד',
    date: '2023-09-15',
    childAge: 'גיל 3 ו-6',
    avatar: '👨‍🦱'
  }
];

export default function TestimonialsPage() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ 
        color: i < rating ? '#fbbf24' : '#e5e7eb',
        fontSize: '1.2rem'
      }}>
        ⭐
      </span>
    ));
  };

  const getAverageRating = () => {
    const total = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
    return (total / testimonials.length).toFixed(1);
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

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>
            ⭐💬🎭
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
            ⭐ מה אומרות המשפחות שלנו
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            קראו חוויות אמיתיות של משפחות שחוו את הקסם שלנו
          </p>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div 
            data-card
            style={{
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {getAverageRating()}
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>דירוג ממוצע</div>
          </div>

          <div 
            data-card
            style={{
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {testimonials.length}
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>משפחות מרוצות</div>
          </div>

          <div 
            data-card
            style={{
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              50+
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>אירועים מוצלחים</div>
          </div>

          <div 
            data-card
            style={{
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😊</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ec4899' }}>
              100%
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>שביעות רצון</div>
          </div>
        </div>

        {/* Featured Testimonial */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '4rem',
            animation: 'slideIn 0.8s ease-out'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            {testimonials[currentTestimonialIndex].avatar}
          </div>
          <div style={{ marginBottom: '2rem' }}>
            {renderStars(testimonials[currentTestimonialIndex].rating)}
          </div>
          <p style={{ 
            fontSize: '1.3rem', 
            lineHeight: '1.6', 
            fontStyle: 'italic',
            maxWidth: '800px',
            margin: '0 auto 2rem auto',
            color: '#374151'
          }}>
            "{testimonials[currentTestimonialIndex].review}"
          </p>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
            {testimonials[currentTestimonialIndex].name}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            📍 {testimonials[currentTestimonialIndex].location}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            🎭 {testimonials[currentTestimonialIndex].event} • {testimonials[currentTestimonialIndex].childAge}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '3rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            💬 כל החוות דעת
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                onClick={() => setSelectedTestimonial(testimonial)}
                data-card
                style={{
                  borderRadius: '15px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.border = '2px solid #10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '2px solid transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', marginLeft: '1rem' }}>{testimonial.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>📍 {testimonial.location}</div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  {renderStars(testimonial.rating)}
                </div>
                
                <p style={{ 
                  lineHeight: '1.5', 
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {testimonial.review}
                </p>
                
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>
                  🎭 {testimonial.event}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  👶 {testimonial.childAge} • {new Date(testimonial.date).toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div 
          data-card
          style={{
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎭</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            רוצים להצטרף למשפחות המאושרות?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            הזמינו את האירוע הבא שלכם וצרו זכרונות קסומים שיישארו לכל החיים!
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
              📅 לוח אירועים
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
              📞 צרו קשר
            </button>
          </div>
        </div>
      </div>

      {/* Testimonial Modal */}
      {selectedTestimonial && (
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
        onClick={() => setSelectedTestimonial(null)}
        >
          <div
            data-card
            style={{
              borderRadius: '20px',
              padding: '3rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '3rem', marginLeft: '1rem' }}>{selectedTestimonial.avatar}</span>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
                    {selectedTestimonial.name}
                  </h3>
                  <div style={{ fontSize: '1rem', color: '#666' }}>📍 {selectedTestimonial.location}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTestimonial(null)}
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
            
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              {renderStars(selectedTestimonial.rating)}
            </div>
            
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              "{selectedTestimonial.review}"
            </p>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #10b98120, #fbbf2420)',
              borderRadius: '10px',
              padding: '1.5rem'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>🎭 אירוע:</strong> {selectedTestimonial.event}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>👶 גילאי ילדים:</strong> {selectedTestimonial.childAge}
              </div>
              <div>
                <strong>📅 תאריך:</strong> {new Date(selectedTestimonial.date).toLocaleDateString('he-IL')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
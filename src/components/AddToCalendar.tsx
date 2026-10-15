'use client';

import { downloadIcs, googleCalendarUrl, type CalendarEventInfo } from '@/lib/calendar-links';

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.35rem',
  padding: '0.6rem 1rem',
  borderRadius: '999px',
  border: '1px solid rgba(16, 185, 129, 0.35)',
  background: 'white',
  color: '#065f46',
  fontWeight: 'bold',
  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
  fontFamily: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)'
};

// "Add to my calendar" buttons: Google Calendar, or an .ics file for Apple/Outlook
export default function AddToCalendar({ event }: { event: CalendarEventInfo }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: '#6b7280', marginBottom: '0.5rem' }}>
        📅 הוסיפו ליומן האישי
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
        >
          Google Calendar
        </a>
        <button type="button" onClick={() => downloadIcs(event)} style={buttonStyle}>
          Apple / Outlook
        </button>
      </div>
    </div>
  );
}

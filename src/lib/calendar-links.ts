// Links for opening an event's place in Google Maps and saving the event to a
// personal calendar (Google Calendar link, or an .ics file for Apple/Outlook).

export interface CalendarEventInfo {
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD, last day of a multi-day event (inclusive)
  time?: string; // "19:30" or "16:00-18:00"; anything else means all-day
  location?: string;
  description?: string;
}

const TIME_ZONE = 'America/New_York';
const DEFAULT_DURATION_HOURS = 2;

export function googleMapsUrl(place: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}

const compactDate = (date: string) => date.replace(/-/g, '');

function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Returns local start/end stamps (YYYYMMDDTHHMMSS), or null for all-day events
function parseTimes(event: CalendarEventInfo) {
  const match = event.time?.match(/^\s*(\d{1,2}):(\d{2})(?:\s*-\s*(\d{1,2}):(\d{2}))?\s*$/);
  if (!match || event.endDate) return null;

  const [, sh, sm, eh, em] = match;
  const startMinutes = Number(sh) * 60 + Number(sm);
  const endMinutes = eh ? Number(eh) * 60 + Number(em) : startMinutes + DEFAULT_DURATION_HOURS * 60;
  const endDate = endMinutes >= 24 * 60 ? addDays(event.date, 1) : event.date;
  const stamp = (date: string, minutes: number) => {
    const m = minutes % (24 * 60);
    return `${compactDate(date)}T${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}00`;
  };

  return { start: stamp(event.date, startMinutes), end: stamp(endDate, endMinutes) };
}

function allDayRange(event: CalendarEventInfo) {
  // Calendar all-day ranges end on the day *after* the last day
  return { start: compactDate(event.date), end: compactDate(addDays(event.endDate ?? event.date, 1)) };
}

export function googleCalendarUrl(event: CalendarEventInfo) {
  const { start, end } = parseTimes(event) ?? allDayRange(event);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    ctz: TIME_ZONE
  });
  if (event.location) params.set('location', event.location);
  if (event.description) params.set('details', event.description);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export function icsContent(event: CalendarEventInfo) {
  const times = parseTimes(event);
  const { start, end } = times ?? allDayRange(event);
  const dateLines = times
    ? [`DTSTART;TZID=${TIME_ZONE}:${start}`, `DTEND;TZID=${TIME_ZONE}:${end}`]
    : [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`];

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Peter Pan Boca//Events//HE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${compactDate(event.date)}-${encodeURIComponent(event.title).slice(0, 40)}@peterpanboca`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    ...dateLines,
    `SUMMARY:${escapeIcs(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeIcs(event.location)}`] : []),
    ...(event.description ? [`DESCRIPTION:${escapeIcs(event.description)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// Opens the .ics file, which Apple Calendar / Outlook offer to add
export function downloadIcs(event: CalendarEventInfo) {
  const blob = new Blob([icsContent(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^\p{L}\p{N} _-]/gu, '').trim() || 'event'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

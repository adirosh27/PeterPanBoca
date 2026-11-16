// Calendar events storage. SERVER-SIDE ONLY.
// Events live in Redis as one list under EVENTS_KEY, edited from the admin page.
// Until the first edit, reads return defaultEvents from src/lib/events.ts.
// Without Redis (local dev with no credentials) edits are kept in memory only.
import { Redis } from '@upstash/redis';
import { defaultEvents, EVENT_TYPES, TBA, type Event } from '@/lib/events';

const EVENTS_KEY = 'peter-pan-calendar-events';
// Highest id ever given out, so a deleted event's id is never reused (the
// invite emails remember which ids already got their Save the Date).
const LAST_ID_KEY = 'peter-pan-calendar-events-last-id';

// Only when credentials are set: Redis.fromEnv() would build a client that
// fails on every call, and reads must fall back to defaultEvents instead.
const redis = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
})();

let memoryEvents: Event[] | null = null;
let memoryLastId = 0;

export async function getEvents(): Promise<Event[]> {
  if (!redis) return memoryEvents ?? defaultEvents;
  return (await redis.get<Event[]>(EVENTS_KEY)) ?? defaultEvents;
}

async function saveEvents(events: Event[]) {
  if (redis) {
    await redis.set(EVENTS_KEY, events);
  } else if (process.env.VERCEL) {
    throw new Error('Event storage (Redis) is not configured');
  } else {
    memoryEvents = events;
  }
}

export class EventValidationError extends Error {}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

// Checks and cleans an event coming from the admin form. Empty time or
// location become TBA ("to be announced"), like the existing events.
export function parseEventInput(input: Record<string, unknown>): Omit<Event, 'id'> {
  const date = text(input.date);
  const endDate = text(input.endDate);
  const title = text(input.title);
  const type = text(input.type) as Event['type'];

  if (!title) throw new EventValidationError('Title is required');
  if (!DATE_RE.test(date) || isNaN(Date.parse(date))) throw new EventValidationError('Start date is required');
  if (endDate && (!DATE_RE.test(endDate) || isNaN(Date.parse(endDate)))) throw new EventValidationError('End date is not a valid date');
  if (endDate && endDate < date) throw new EventValidationError('End date is before the start date');
  if (!EVENT_TYPES.includes(type)) throw new EventValidationError('Unknown event type');

  const spotsLeft = Number(input.spotsLeft);
  return {
    date,
    ...(endDate && endDate !== date && { endDate }),
    title,
    description: text(input.description),
    time: text(input.time) || TBA,
    location: text(input.location) || TBA,
    type,
    price: text(input.price),
    ageGroup: text(input.ageGroup),
    spotsLeft: Number.isFinite(spotsLeft) && spotsLeft >= 0 ? Math.floor(spotsLeft) : 50,
  };
}

async function nextId(events: Event[]) {
  const last = redis ? Number(await redis.get(LAST_ID_KEY)) || 0 : memoryLastId;
  const id = Math.max(last, ...events.map((e) => e.id)) + 1;
  if (redis) await redis.set(LAST_ID_KEY, id);
  else memoryLastId = id;
  return id;
}

// Creates an event (no id) or replaces the event with that id.
export async function upsertEvent(id: number | null, input: Record<string, unknown>): Promise<Event> {
  const fields = parseEventInput(input);
  const events = await getEvents();

  if (id === null) {
    const event: Event = { id: await nextId(events), ...fields };
    await saveEvents([...events, event]);
    return event;
  }

  if (!events.some((e) => e.id === id)) throw new EventValidationError(`Event #${id} not found`);
  const event: Event = { id, ...fields };
  await saveEvents(events.map((e) => (e.id === id ? event : e)));
  return event;
}

export async function deleteEvent(id: number): Promise<void> {
  const events = await getEvents();
  if (!events.some((e) => e.id === id)) throw new EventValidationError(`Event #${id} not found`);
  await saveEvents(events.filter((e) => e.id !== id));
}

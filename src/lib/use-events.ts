'use client';

import { useCallback, useEffect, useState } from 'react';
import { defaultEvents, type Event } from '@/lib/events';

// Calendar events from /api/events (edited on the admin page).
// `events` is null until the first load; if the request fails the original
// event list is used so the calendar never comes up empty.
export function useEvents() {
  const [events, setEvents] = useState<Event[] | null>(null);

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setEvents(data.events);
    } catch (error) {
      console.error('Could not load events:', error);
      setEvents((current) => current ?? defaultEvents);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { events, reload };
}

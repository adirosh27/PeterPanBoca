import { NextRequest, NextResponse } from 'next/server';
import { isPaymentsAdmin } from '@/lib/payments-db';
import { deleteEvent, EventValidationError, getEvents, upsertEvent } from '@/lib/events-store';

// Calendar events.
//   GET                      list all events (used by the calendar and home page)
//   POST   { id?, ...event } create an event, or update the one with that id (admin)
//   DELETE ?id=<id>          delete an event (admin)
// Admin calls send the admin password in the x-admin-password header.
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ success: false, message: 'Wrong admin password' }, { status: 401 });
}

function failure(error: unknown) {
  if (error instanceof EventValidationError) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
  console.error('events API error:', error);
  return NextResponse.json(
    { success: false, message: error instanceof Error ? error.message : 'Request failed' },
    { status: 500 }
  );
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, events: await getEvents() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }
  const id = body.id === undefined || body.id === null ? null : Number(body.id);
  if (id !== null && !Number.isInteger(id)) {
    return NextResponse.json({ success: false, message: 'Invalid event id' }, { status: 400 });
  }
  try {
    const event = await upsertEvent(id, body);
    return NextResponse.json({ success: true, event, created: id === null });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isPaymentsAdmin(request.headers.get('x-admin-password'))) return unauthorized();
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ success: false, message: 'Invalid event id' }, { status: 400 });
  }
  try {
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return failure(error);
  }
}

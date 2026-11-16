// Sends one "Save the Date" test email for one event to one member.
// Sent from peterpenboca@gmail.com. Needs EVENT_INVITES_GMAIL_USER and
// EVENT_INVITES_GMAIL_APP_PASSWORD (an app password for that account) in .env.local.
//   npx tsx --env-file=.env.local scripts/send-test-invite.ts <eventId> <member email>
import { sendTestInvite } from '../src/lib/event-invites';

const [eventId, to] = process.argv.slice(2);
if (!eventId || !to) {
  console.error('Usage: npx tsx --env-file=.env.local scripts/send-test-invite.ts <eventId> <member email>');
  process.exit(1);
}
sendTestInvite(Number(eventId), to)
  .then((r) => console.log(`Sent "${r.title}" to ${r.to}`))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });

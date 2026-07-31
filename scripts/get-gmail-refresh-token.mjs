// One-time helper to generate a Gmail OAuth refresh token for the payments
// push integration. Run locally (NOT on the server):
//
//   node scripts/get-gmail-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
//
// Prereqs:
//   1. In Google Cloud, create an OAuth 2.0 Client of type "Desktop app".
//   2. Enable the Gmail API for the project.
//   3. Add peterpenboca@gmail.com as a test user on the OAuth consent screen
//      (or publish the app).
//
// The script opens a local loopback server, prints an authorization URL, and
// after you approve as peterpenboca@gmail.com it prints the refresh token to
// paste into Vercel as GMAIL_OAUTH_REFRESH_TOKEN.
import http from 'node:http';
import { google } from 'googleapis';

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error('Usage: node scripts/get-gmail-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}

const PORT = 53682;
const redirectUri = `http://localhost:${PORT}`;
const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // force a refresh_token every time
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, redirectUri);
    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400).end('Missing ?code');
      return;
    }
    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('Done. You can close this tab and return to the terminal.');
    console.log('\n=== SUCCESS ===');
    console.log('GMAIL_OAUTH_REFRESH_TOKEN =', tokens.refresh_token);
    if (!tokens.refresh_token) {
      console.log('\n(No refresh_token returned — revoke prior access at');
      console.log(' https://myaccount.google.com/permissions and re-run.)');
    }
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500).end('Error: ' + err.message);
    console.error(err);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('Authorize as peterpenboca@gmail.com by opening this URL in your browser:\n');
  console.log(authUrl);
  console.log(`\nWaiting for the redirect on ${redirectUri} ...`);
});

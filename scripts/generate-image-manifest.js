// Builds public/image-manifest.json from the gallery photos stored in Vercel Blob.
//
// Gallery photos live in the "peter-pan-boca-photos" Blob store under
// images/<year>/<event>/<file>, not in the repo, so every deployment stays
// small. The manifest is committed; regenerate it after uploading photos
// (scripts/upload-photos.js does this for you).
//
// Needs BLOB_READ_WRITE_TOKEN (run `vercel env pull .env.local` once).

const fs = require('fs');
const path = require('path');
const { list } = require('@vercel/blob');

loadEnvLocal();

const publicDir = path.join(__dirname, '..', 'public');

// Extra videos served from public/videos (ASCII filenames) instead of living
// alongside their event's photos. Vercel's .vercelignore negation doesn't
// reliably re-include files under a non-ASCII (Hebrew) directory path, so
// these clips are placed in an ASCII-safe location and merged in here.
const extraVideosByEvent = {
  '2026/גמר מונדיאל - יולי 2026': [
    { name: 'worldcup-final-2026-clip-1.mp4', url: '/videos/worldcup-final-2026-clip-1.mp4', type: 'video' },
    { name: 'worldcup-final-2026-clip-2.mp4', url: '/videos/worldcup-final-2026-clip-2.mp4', type: 'video' }
  ]
};

const MEDIA = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i;
const VIDEO = /\.(mp4|mov|webm)$/i;

async function listAllBlobs(prefix) {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function generateManifest() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` first.');
  }

  const blobs = await listAllBlobs('images/');
  const manifest = {};

  for (const blob of blobs) {
    // images/<year>/<event>/<file>
    const parts = blob.pathname.split('/');
    if (parts.length !== 4) continue;
    const [, year, event, file] = parts;
    if (!MEDIA.test(file)) continue;

    const key = `${year}/${event}`;
    manifest[key] ??= { urlPrefix: 'blob', images: [] };
    manifest[key].images.push({
      name: file,
      url: blob.url,
      type: VIDEO.test(file) ? 'video' : 'image'
    });
  }

  for (const entry of Object.values(manifest)) {
    entry.images.sort((a, b) => a.name.localeCompare(b.name));
  }

  for (const [key, extraVideos] of Object.entries(extraVideosByEvent)) {
    if (manifest[key]) manifest[key].images.push(...extraVideos);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  const outPath = path.join(publicDir, 'image-manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(sorted));
  console.log(`Generated image manifest with ${Object.keys(sorted).length} events, ${blobs.length} files`);
  return sorted;
}

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
}

module.exports = { generateManifest, loadEnvLocal };

if (require.main === module) {
  generateManifest().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}

// Uploads gallery photos to Vercel Blob and regenerates the image manifest.
//
// Usage:
//   node scripts/upload-photos.js <folder> [<folder> ...]
//
// Each <folder> is an event folder laid out as  .../<year>/<event name>/
// (for example "photos-to-upload/2026/שייט - אפריל 2026"), or a parent folder
// that contains such year/event folders. Photos are stored in Blob at
// images/<year>/<event name>/<file>. Files already in Blob are skipped.
//
// Don't put gallery photos in public/images: they would be copied into every
// Vercel deployment again. Keep the source folders outside the repo, or in
// photos-to-upload/ (git-ignored).

const fs = require('fs');
const path = require('path');
const { put, list } = require('@vercel/blob');
const { generateManifest, loadEnvLocal } = require('./generate-image-manifest');

loadEnvLocal();

const MEDIA = /\.(jpg|jpeg|png|gif|webp)$/i;
const CONCURRENCY = 6;

function collectFiles(root) {
  const abs = path.resolve(root);
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (MEDIA.test(entry.name)) files.push(full);
    }
  };
  visit(abs);

  return files.map(file => {
    const parts = file.split(path.sep);
    const [year, event, name] = parts.slice(-3);
    if (!/^\d{4}$/.test(year)) {
      throw new Error(`Expected .../<year>/<event>/<file>, got: ${file}`);
    }
    return { file, pathname: `images/${year}/${event}/${name}` };
  });
}

async function existingPathnames() {
  const seen = new Set();
  let cursor;
  do {
    const page = await list({ prefix: 'images/', cursor, limit: 1000 });
    page.blobs.forEach(b => seen.add(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return seen;
}

async function main() {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error('Usage: node scripts/upload-photos.js <folder> [<folder> ...]');
    process.exit(1);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` first.');
    process.exit(1);
  }

  const all = roots.flatMap(collectFiles);
  const seen = await existingPathnames();
  const todo = all.filter(f => !seen.has(f.pathname));
  console.log(`${all.length} photos found, ${all.length - todo.length} already in Blob, ${todo.length} to upload`);

  let done = 0;
  const failed = [];
  const queue = [...todo];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        await put(item.pathname, fs.readFileSync(item.file), {
          access: 'public',
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000
        });
        done++;
        if (done % 50 === 0 || done === todo.length) console.log(`  uploaded ${done}/${todo.length}`);
      } catch (err) {
        failed.push({ ...item, error: err.message });
      }
    }
  }));

  if (failed.length) {
    console.error(`${failed.length} uploads failed:`);
    failed.forEach(f => console.error(`  ${f.pathname}: ${f.error}`));
  }

  await generateManifest();
  if (failed.length) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

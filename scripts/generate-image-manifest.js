const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imagesDirs = ['images', 'Photos'];
const manifest = {};

for (const dirName of imagesDirs) {
  const baseDir = path.join(publicDir, dirName);
  if (!fs.existsSync(baseDir)) continue;

  const years = fs.readdirSync(baseDir).filter(f =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  );

  for (const year of years) {
    const yearDir = path.join(baseDir, year);
    const events = fs.readdirSync(yearDir).filter(f =>
      fs.statSync(path.join(yearDir, f)).isDirectory()
    );

    for (const event of events) {
      const eventDir = path.join(yearDir, event);
      const files = fs.readdirSync(eventDir);
      const mediaFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i.test(file)
      );

      const key = `${year}/${event}`;
      manifest[key] = {
        urlPrefix: dirName,
        images: mediaFiles.map(file => ({
          name: file,
          url: `/${dirName}/${year}/${event}/${file}`,
          type: /\.(mp4|mov|webm)$/i.test(file) ? 'video' : 'image'
        }))
      };
    }
  }
}

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

for (const [key, extraVideos] of Object.entries(extraVideosByEvent)) {
  if (manifest[key]) {
    manifest[key].images.push(...extraVideos);
  }
}

const outPath = path.join(publicDir, 'image-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest));
console.log(`Generated image manifest with ${Object.keys(manifest).length} events`);

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
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      const key = `${year}/${event}`;
      manifest[key] = {
        urlPrefix: dirName,
        images: imageFiles.map(file => ({
          name: file,
          url: `/${dirName}/${year}/${event}/${file}`
        }))
      };
    }
  }
}

const outPath = path.join(publicDir, 'image-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest));
console.log(`Generated image manifest with ${Object.keys(manifest).length} events`);

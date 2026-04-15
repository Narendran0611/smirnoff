const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'client', 'public', 'gallery');
const jsonPath = path.join(__dirname, 'client', 'src', 'galleryImages.json');

const files = fs.readdirSync(galleryDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));

const fileSizes = files.map(f => {
  const stat = fs.statSync(path.join(galleryDir, f));
  return { name: f, size: stat.size };
});

// Sort by size ascending (smallest images first)
fileSizes.sort((a, b) => a.size - b.size);

// Keep top 100
const toKeep = fileSizes.slice(0, 100);
const toDelete = fileSizes.slice(100);

// Delete the rest to save massive upload time
for (const val of toDelete) {
  fs.unlinkSync(path.join(galleryDir, val.name));
}

// Write the new JSON array
const newJson = toKeep.map(val => `/gallery/${val.name}`);
fs.writeFileSync(jsonPath, JSON.stringify(newJson, null, 2));

console.log(`Deleted ${toDelete.length} mega-sized files. Kept the ${toKeep.length} smallest files. JSON updated. ready to push!`);

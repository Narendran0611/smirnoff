/**
 * SMIRNOFF ICE — Image Optimization & Curation Script
 * 
 * This script does 3 things:
 * 1. Reduces gallery to 50 smallest images (for fast git push)
 * 2. Copies the best client event photos for the homepage carousel
 * 3. Updates galleryImages.json
 */

const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'client', 'public', 'gallery');
const jsonPath = path.join(__dirname, 'client', 'src', 'galleryImages.json');
const carouselDestDir = path.join(__dirname, 'client', 'public', 'carousel');

// ===== STEP 1: Reduce gallery to 50 smallest images =====
console.log('\n🎯 STEP 1: Reducing gallery to 50 images...');

const galleryFiles = fs.readdirSync(galleryDir)
  .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

const fileSizes = galleryFiles.map(f => {
  const stat = fs.statSync(path.join(galleryDir, f));
  return { name: f, size: stat.size };
});

// Sort by size ascending (smallest first)
fileSizes.sort((a, b) => a.size - b.size);

const toKeep = fileSizes.slice(0, 50);
const toDelete = fileSizes.slice(50);

for (const val of toDelete) {
  fs.unlinkSync(path.join(galleryDir, val.name));
}

// Update JSON
const newJson = toKeep.map(val => `/gallery/${val.name}`);
fs.writeFileSync(jsonPath, JSON.stringify(newJson, null, 2));

console.log(`   ✅ Deleted ${toDelete.length} images. Kept ${toKeep.length} smallest.`);
console.log(`   📊 Total gallery size: ${(toKeep.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB`);

// ===== STEP 2: Copy best client event photos for homepage carousel =====
console.log('\n🎯 STEP 2: Curating best photos for homepage carousel...');

if (!fs.existsSync(carouselDestDir)) {
  fs.mkdirSync(carouselDestDir, { recursive: true });
}

// Hand-picked best carousel images based on visual analysis:
// - Images with strong Smirnoff branding visible
// - Product shots (bottles, cans)
// - Party/event atmosphere shots
// - High visual impact for wide carousel format
const carouselPicks = [
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice @ bb9ja grand finale', 'Edited', 'C2168T01 (35).jpg'),
    dest: 'carousel_bottles_lineup.jpg',
    description: 'Smirnoff Ice bottles lineup at BB9ja - perfect product showcase'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice @ bb9ja grand finale', 'Edited', 'C2168T01 (42).jpg'),
    dest: 'carousel_bottle_closeup.jpg',
    description: 'Pineapple Punch bottle close-up with neon bokeh - premium feel'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice @ bb9ja grand finale', 'Edited', 'C2168T01 (50).jpg'),
    dest: 'carousel_double_black_banner.jpg',
    description: 'Double Black can banner with all products - hero brand shot'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice  @ black dave and friends', 'Edited', 'C2168T01 (1).jpg'),
    dest: 'carousel_brand_ambassador.jpg',
    description: 'Brand ambassador with Smirnoff Ice branding - lifestyle shot'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice  @ black dave and friends', 'Edited', 'C2168T01 (34).jpg'),
    dest: 'carousel_party_sip.jpg',
    description: 'Woman sipping from Smirnoff cup at party - event atmosphere'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice  @ black dave and friends', 'Edited', 'C2168T01 (28).jpg'),
    dest: 'carousel_smirnoff_cups.jpg',
    description: 'Smirnoff branded cups with party crowd - social vibe'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice  @ black dave and friends', 'Edited', 'C2168T01 (33).jpg'),
    dest: 'carousel_branded_cup_bar.jpg',
    description: 'Orange Smirnoff cup at bar with bottles - product placement'
  },
  {
    src: path.join(__dirname, 'clientassets', 'Smirnoff ice  @ black dave and friends', 'Edited', 'C2168T01 (5).jpg'),
    dest: 'carousel_ice_naira.jpg',
    description: 'Ice Naira promotional currency - unique brand element'
  }
];

let copiedCount = 0;
for (const pick of carouselPicks) {
  if (fs.existsSync(pick.src)) {
    fs.copyFileSync(pick.src, path.join(carouselDestDir, pick.dest));
    console.log(`   ✅ ${pick.dest} — ${pick.description}`);
    copiedCount++;
  } else {
    console.log(`   ⚠️  MISSING: ${pick.src}`);
  }
}

console.log(`\n🎉 DONE! Copied ${copiedCount} curated images for carousel.`);
console.log('📁 Carousel images saved to: client/public/carousel/');
console.log('\n🚀 Next: Update Home.jsx to use these real event photos in the carousel!');

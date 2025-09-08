#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🖼️  Starting image optimization...\n');

const imagesDir = path.join(process.cwd(), 'public/images');
const largeImages = [
  'buildings/tirana.jpg',
  'buildings/elbasan.jpg', 
  'buildings/pristina.jpg',
  'products/specialty.jpg',
  'products/rupes-bigfoot-lhr21.jpg',
  'products/professional.jpg',
  'products/premium.jpg',
  'products/satajet-5000b.jpg',
  'products/roberlo-custom-system.jpg',
  'aston-martin-f1-hero-bg.jpg',
  'partners/fiac.jpg',
  'partners/hempel.jpg'
];

async function optimizeImage(imagePath) {
  const fullPath = path.join(imagesDir, imagePath);
  const originalSize = fs.statSync(fullPath).size;
  
  try {
    // Create optimized version
    const optimizedPath = fullPath.replace('.jpg', '_optimized.jpg');
    
    await sharp(fullPath)
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .resize(1920, 1080, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(optimizedPath);
    
    const optimizedSize = fs.statSync(optimizedPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${imagePath}: ${(originalSize/1024).toFixed(0)}KB → ${(optimizedSize/1024).toFixed(0)}KB (${savings}% saved)`);
    
    // Replace original with optimized version
    fs.renameSync(optimizedPath, fullPath);
    
    return { originalSize, optimizedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`❌ Failed to optimize ${imagePath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  
  for (const imagePath of largeImages) {
    const result = await optimizeImage(imagePath);
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      successCount++;
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n📊 Optimization Summary:`);
  console.log(`   Images processed: ${successCount}/${largeImages.length}`);
  console.log(`   Total size: ${(totalOriginalSize/1024/1024).toFixed(1)}MB → ${(totalOptimizedSize/1024/1024).toFixed(1)}MB`);
  console.log(`   Total savings: ${totalSavings}%`);
  console.log(`   Space saved: ${((totalOriginalSize - totalOptimizedSize)/1024/1024).toFixed(1)}MB\n`);
}

optimizeAllImages().catch(console.error);
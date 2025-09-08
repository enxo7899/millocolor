#!/usr/bin/env node

/**
 * Performance monitoring script for MilloColor
 * Run with: node scripts/performance-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting performance check...\n');

// Check if build exists
const buildPath = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildPath)) {
  console.log('❌ Build not found. Running build first...\n');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Check bundle size
console.log('📦 Checking bundle sizes...\n');
try {
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
  console.log('✅ Bundle analysis complete. Check the generated report.\n');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
}

// Check for common performance issues
console.log('🔍 Checking for performance issues...\n');

const issues = [];

// Check for large images
const publicImages = path.join(process.cwd(), 'public/images');
if (fs.existsSync(publicImages)) {
  const files = fs.readdirSync(publicImages, { recursive: true });
  const largeFiles = files.filter(file => {
    const filePath = path.join(publicImages, file);
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 500000; // > 500KB
  });
  
  if (largeFiles.length > 0) {
    issues.push(`Large images found: ${largeFiles.join(', ')}`);
  }
}

// Check for unoptimized imports
const srcFiles = fs.readdirSync(path.join(process.cwd(), 'app'), { recursive: true });
const tsxFiles = srcFiles.filter(file => file.endsWith('.tsx'));

let hasUnoptimizedImports = false;
tsxFiles.forEach(file => {
  const filePath = path.join(process.cwd(), 'app', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("import * from '@react-three/drei'") || 
      content.includes("import * from 'gsap'")) {
    hasUnoptimizedImports = true;
  }
});

if (hasUnoptimizedImports) {
  issues.push('Unoptimized imports detected. Consider importing specific modules.');
}

// Report issues
if (issues.length > 0) {
  console.log('⚠️  Performance issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('✅ No major performance issues detected!');
}

console.log('\n🎯 Performance check complete!');
console.log('\nTo monitor errors in production:');
console.log('1. Set up Sentry account at https://sentry.io');
console.log('2. Add NEXT_PUBLIC_SENTRY_DSN to your .env.local');
console.log('3. Deploy and monitor errors in Sentry dashboard');
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const __root = process.cwd();
const inputDir = path.join(__root, 'public', 'images', 'partners');
const outputDir = path.join(inputDir, 'normalized');

const TARGET_W = 300; // similar to Supabase strip width
const TARGET_H = 120; // similar to Supabase strip height
const INNER_W = Math.floor(TARGET_W * 0.86);
const INNER_H = Math.floor(TARGET_H * 0.62);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

function outPathFor(file) {
  const base = path.basename(file).replace(/\.[^.]+$/, '.png');
  return path.join(outputDir, base);
}

async function processFile(file) {
  const inputPath = path.join(inputDir, file);
  const outputPath = outPathFor(file);
  try {
    const img = sharp(inputPath);
    const meta = await img.metadata();
    if (!meta.width || !meta.height) throw new Error('Invalid image');

    // Trim uniform borders (usually white)
    const trimmed = img.trim({ threshold: 10 });
    const trimmedMeta = await trimmed.metadata();
    const cropW = trimmedMeta.width ?? meta.width;
    const cropH = trimmedMeta.height ?? meta.height;

    // Compute fit scale
    const scale = Math.min(INNER_W / cropW, INNER_H / cropH);
    const drawW = Math.max(1, Math.round(cropW * scale));
    const drawH = Math.max(1, Math.round(cropH * scale));
    const offsetX = Math.round((TARGET_W - drawW) / 2);
    const offsetY = Math.round((TARGET_H - drawH) / 2);

    const canvas = sharp({
      create: {
        width: TARGET_W,
        height: TARGET_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    const resized = await trimmed
      .resize({ width: drawW, height: drawH, fit: 'contain' })
      .png()
      .toBuffer();

    await canvas
      .composite([{ input: resized, left: offsetX, top: offsetY }])
      .png()
      .toFile(outputPath);

    console.log(`Normalized: ${file} -> ${path.relative(__root, outputPath)}`);
  } catch (err) {
    console.warn(`Skip ${file}: ${err.message}`);
  }
}

async function main() {
  await ensureDir(outputDir);
  const files = await fs.promises.readdir(inputDir);
  const images = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  for (const f of images) {
    // eslint-disable-next-line no-await-in-loop
    await processFile(f);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


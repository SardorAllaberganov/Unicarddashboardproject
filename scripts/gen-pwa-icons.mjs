// One-shot script to rasterize PWA icons from public/favicon.svg.
// Run: node scripts/gen-pwa-icons.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const publicDir = path.join(root, 'public');
const svg = await fs.readFile(path.join(publicDir, 'favicon.svg'));

// Flat (non-maskable) SVG — has rounded rect bg, safe to rasterize directly.
const flatTargets = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon-180.png', size: 180 },
];

// Maskable SVG — safe zone 80% — wrap the mark in larger bg so OS mask doesn't clip.
const maskableSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#2563EB"/>
  <g transform="translate(22 22) scale(0.875)">
    <path d="M16 46 V22 L24 22 L32 36 L40 22 L48 22 V46 L42 46 V32 L34 44 H30 L22 32 V46 Z"
          fill="#FFFFFF"/>
  </g>
</svg>
`);

for (const t of flatTargets) {
  await sharp(svg).resize(t.size, t.size).png().toFile(path.join(publicDir, t.name));
  console.log('wrote', t.name);
}

await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512-maskable.png'));
console.log('wrote pwa-512x512-maskable.png');

// Basic 32×32 ICO-fallback PNG (named .ico so browsers accept)
await sharp(svg).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));
console.log('wrote favicon.ico');

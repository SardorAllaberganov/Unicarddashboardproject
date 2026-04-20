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

// Maskable SVG — safe zone 80% (80×80 centered in 100×100). The OS may mask
// to a circle or squircle; only the inner 80 % is guaranteed visible. We put
// the card silhouette + "M" mark inside the safe zone and extend the blue
// fill to the edges so masking never reveals transparency.
const maskableSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#2563EB"/>
  <g transform="translate(18 18) scale(1.04)">
    <rect x="10" y="20" width="44" height="28" rx="4"
          fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.5"/>
    <rect x="10" y="26" width="44" height="4" fill="#FFFFFF" fill-opacity="0.18"/>
    <path d="M17 44 V24 L23.5 24 L32 36.5 L40.5 24 L47 24 V44 L41.5 44 V31 L34 42 H30 L22.5 31 V44 Z"
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

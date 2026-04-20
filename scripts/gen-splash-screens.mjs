// One-shot script to rasterize iOS PWA launch images from public/favicon.svg.
// Run: node scripts/gen-splash-screens.mjs
//
// Produces light + dark variants for the most common iPhone portrait + landscape
// viewports. Paired <link rel="apple-touch-startup-image"> entries in index.html
// reference these files via device-specific `media` queries.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const publicDir = path.join(root, 'public');
const splashDir = path.join(publicDir, 'splash');
await fs.mkdir(splashDir, { recursive: true });

const svgIcon = await fs.readFile(path.join(publicDir, 'favicon.svg'));

// Apple launch-image devices (device-independent pixel × dpr).
// Sizes in device pixels. Portrait orientation only — iOS handles rotation.
const DEVICES = [
  // name          widthPx heightPx  deviceWidth deviceHeight dpr
  ['iphone-5',      640,  1136,  320,  568, 2], // iPhone 5/SE (1st gen)
  ['iphone-6',      750,  1334,  375,  667, 2], // iPhone 6/7/8/SE (2/3)
  ['iphone-plus',  1242,  2208,  414,  736, 3], // iPhone 6+/7+/8+
  ['iphone-x',     1125,  2436,  375,  812, 3], // iPhone X/XS/11 Pro
  ['iphone-xr',     828,  1792,  414,  896, 2], // iPhone XR/11
  ['iphone-xs-max',1242,  2688,  414,  896, 3], // iPhone XS Max/11 Pro Max
  ['iphone-12',    1170,  2532,  390,  844, 3], // iPhone 12/13/14
  ['iphone-12-pm', 1284,  2778,  428,  926, 3], // iPhone 12/13 Pro Max, 14 Plus
  ['iphone-14-pro',1179,  2556,  393,  852, 3], // iPhone 14 Pro, 15, 15 Pro, 16
  ['iphone-14-pm', 1290,  2796,  430,  932, 3], // iPhone 14 Pro Max, 15 Pro Max, 16 Plus
];

const LIGHT_BG = { r: 249, g: 250, b: 251, alpha: 1 }; // #F9FAFB
const DARK_BG  = { r: 11,  g: 13,  b: 20,  alpha: 1 }; // #0B0D14

async function makeSplash(device, bg, theme) {
  const [name, w, h] = device;
  // Icon occupies ~22 % of the shorter side (iPad-style proportions).
  const iconSize = Math.round(Math.min(w, h) * 0.22);
  const iconBuf = await sharp(svgIcon).resize(iconSize, iconSize).png().toBuffer();
  const out = path.join(splashDir, `${name}-${theme}.png`);
  await sharp({
    create: { width: w, height: h, channels: 4, background: bg },
  })
    .composite([{ input: iconBuf, gravity: 'center' }])
    .png({ quality: 90 })
    .toFile(out);
  console.log('wrote', path.relative(root, out));
}

for (const d of DEVICES) {
  await makeSplash(d, LIGHT_BG, 'light');
  await makeSplash(d, DARK_BG, 'dark');
}

// Emit the <link> tags for index.html — print them to stdout. Paste into
// index.html once after running the script.
console.log('\n--- Paste the following into <head> of index.html ---\n');
for (const [name, w, h, dw, dh, dpr] of DEVICES) {
  const common = `(device-width: ${dw}px) and (device-height: ${dh}px) and (-webkit-device-pixel-ratio: ${dpr})`;
  console.log(`<link rel="apple-touch-startup-image" href="/splash/${name}-light.png" media="${common} and (prefers-color-scheme: light)" />`);
  console.log(`<link rel="apple-touch-startup-image" href="/splash/${name}-dark.png"  media="${common} and (prefers-color-scheme: dark)" />`);
}

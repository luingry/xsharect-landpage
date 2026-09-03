#!/usr/bin/env node
/** Generate and verify public Xsharect icon rasteres from the canonical SVG. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const source = join(root, 'public', 'xsharect-mark.svg');
const outputs = [
  ['favicon-32.png', 32], ['favicon-192.png', 192],
  ['apple-touch-icon.png', 180], ['icon-512.png', 512],
].map(([name, size]) => ({ path: join(root, 'public', name), size }));

function pngSize(buffer) {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('not a PNG');
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}
const svg = await readFile(source, 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 1 });
  for (const { path, size } of outputs) {
    await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent;overflow:hidden}svg{display:block;width:${size * .88}px;height:${size * .88}px}</style>${svg}`);
    const expected = await page.screenshot({ clip: { x: 0, y: 0, width: size, height: size }, omitBackground: true });
    if (check) {
      const actual = await readFile(path);
      const [width, height] = pngSize(actual);
      if (width !== size || height !== size || !actual.equals(expected)) throw new Error(`${path}: stale generated icon; run node scripts/gen-brand-icons.mjs`);
    } else {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, expected);
    }
  }
  console.log(`${check ? 'Verified' : 'Generated'} ${outputs.length} public brand icons.`);
} finally { await browser.close(); }

#!/usr/bin/env node
/**
 * Smoke test for built marketing site.
 * Usage: npm run build && node scripts/smoke.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SCREENS = path.join(DIST, 'screens');

const required = [
  'index.html',
  'demo/xsharect-demo.mp4',
  'screens/app-host.png',
  'screens/viewer-desktop.png',
  'icon-512.png',
];

let failed = false;

for (const rel of required) {
  const full = path.join(DIST, rel);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: ${rel}`);
    failed = true;
  } else {
    const stat = fs.statSync(full);
    console.log(`OK: ${rel} (${stat.size} bytes)`);
  }
}

const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!indexHtml.includes('/xsharect-landpage/')) {
  console.error('FAIL: index.html missing base path /xsharect-landpage/');
  failed = true;
}

const assetsDir = path.join(DIST, 'assets');
if (fs.existsSync(assetsDir)) {
  let hasApkLookup = false;
  for (const file of fs.readdirSync(assetsDir)) {
    if (!file.endsWith('.js')) continue;
    const bundle = fs.readFileSync(path.join(assetsDir, file), 'utf8');
    if (bundle.includes('api.github.com/repos/luingry/xsharect/releases')) {
      console.error(`FAIL: ${file} still references private GitHub releases API`);
      failed = true;
    }
    if (bundle.includes('apk/latest.json')) {
      hasApkLookup = true;
    }
  }
  if (!hasApkLookup) {
    console.error('FAIL: built bundles missing public apk/latest.json lookup');
    failed = true;
  }
}

if (fs.existsSync(SCREENS)) {
  for (const f of fs.readdirSync(SCREENS)) {
    if (f.endsWith('.png') && fs.statSync(path.join(SCREENS, f)).size < 1000) {
      console.error(`FAIL: ${f} too small — likely corrupt`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('\nSmoke test passed.');

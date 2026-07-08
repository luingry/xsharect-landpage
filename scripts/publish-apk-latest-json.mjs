#!/usr/bin/env node
/**
 * Writes public/apk/latest.json for in-app update checks without GitHub API.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const version = (process.env.VERSION ?? '').trim();
const notes = (process.env.RELEASE_NOTES ?? '').trim();
const outputPath = process.argv[2] ?? 'public/apk/latest.json';

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Invalid VERSION: ${version}`);
  process.exit(1);
}

const parts = version.split('.').map((part) => Number(part));
const versionCode = parts[0] * 10000 + parts[1] * 100 + parts[2];

const payload = {
  version_name: version,
  version_code: versionCode,
  apk_download_url: `https://luingry.github.io/xsharect-landpage/apk/xsharect-v${version}.apk`,
  release_notes: notes,
};

const absolute = resolve(outputPath);
mkdirSync(dirname(absolute), { recursive: true });
writeFileSync(absolute, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${outputPath} for v${version} (${versionCode})`);

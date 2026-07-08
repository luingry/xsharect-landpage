#!/usr/bin/env node
/**
 * Capture frames for Remotion demo (app + viewer tabs).
 * Usage: node scripts/capture-demo-frames.mjs [--password=secret]
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.resolve(__dirname, '../public/demo/frames');
const LOCAL_PORT = 19240;
const ADB_ENV = { ...process.env, MSYS_NO_PATHCONV: '1' };

const passwordArg = process.argv.find((a) => a.startsWith('--password='));
const PASSWORD = passwordArg ? passwordArg.split('=')[1] : '';

const TABS = [
  { id: 'stream', file: 'viewer-stream.png' },
  { id: 'photos', file: 'viewer-photos.png' },
  { id: 'videos', file: 'viewer-videos.png' },
  { id: 'upload', file: 'viewer-upload.png' },
];

function adb(...args) {
  const proc = spawnSync('adb', args, { encoding: 'utf8', env: ADB_ENV });
  if (proc.status !== 0) throw new Error(`adb failed: ${proc.stderr}`);
  return proc.stdout;
}

function adbPng(...args) {
  const proc = spawnSync('adb', args, { encoding: 'buffer', maxBuffer: 25 * 1024 * 1024, env: ADB_ENV });
  if (proc.status !== 0 || !proc.stdout?.length) throw new Error('adb screencap failed');
  return proc.stdout;
}

async function connectViewer(page) {
  await page.goto(`http://127.0.0.1:${LOCAL_PORT}/`, { waitUntil: 'networkidle', timeout: 30000 });
  if (PASSWORD) {
    const pwd = page.locator('#password');
    if (await pwd.count()) await pwd.fill(PASSWORD);
  }
  await page.locator('#connectBtn').click({ timeout: 8000 });
  await page.waitForFunction(
    () => {
      const panel = document.getElementById('viewerPanel');
      return panel && !panel.classList.contains('hidden');
    },
    { timeout: 20000 },
  );
  await page.evaluate(() => {
    const v = document.querySelector('video');
    if (v) {
      v.muted = true;
      void v.play();
    }
  });
  await page.waitForFunction(
    () => {
      const v = document.querySelector('video');
      return v && v.videoWidth > 0;
    },
    { timeout: 20000 },
  ).catch(() => {});
  await delay(1500);
}

async function main() {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const devices = adb('devices').split('\n').filter((l) => l.includes('\tdevice'));
  if (!devices.length) throw new Error('No adb device connected.');

  try {
    adb('forward', '--remove', `tcp:${LOCAL_PORT}`);
  } catch {
    /* ignore */
  }
  adb('forward', `tcp:${LOCAL_PORT}`, 'tcp:9240');

  adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
  adb('shell', 'am', 'start', '-n', 'com.xsharect.app/.MainActivity');
  await delay(2000);
  fs.writeFileSync(path.join(FRAMES_DIR, 'app-start.png'), adbPng('exec-out', 'screencap', '-p'));
  console.log('Saved app-start.png');

  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await connectViewer(page);

  for (const tab of TABS) {
    await page.locator(`[data-tab="${tab.id}"]`).click();
    await delay(tab.id === 'photos' || tab.id === 'videos' ? 3500 : 1200);
    await page.locator('#app').screenshot({ path: path.join(FRAMES_DIR, tab.file) });
    console.log(`Saved ${tab.file}`);
  }

  await browser.close();
  console.log(`\nFrames ready in ${FRAMES_DIR}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

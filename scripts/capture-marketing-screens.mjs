#!/usr/bin/env node
/**
 * Capture marketing screenshots for public/screens/
 *
 * Usage:
 *   node scripts/capture-marketing-screens.mjs
 *   node scripts/capture-marketing-screens.mjs --password=secret
 *   node scripts/capture-marketing-screens.mjs --skip-stream
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'screens');
const DEVICE_PORT = 9240;
const LOCAL_PORT = 19240;
const PACKAGE = 'com.xsharect.app';
const ACTIVITY = `${PACKAGE}/.MainActivity`;
const ADB_ENV = { ...process.env, MSYS_NO_PATHCONV: '1' };

const passwordArg = process.argv.find((a) => a.startsWith('--password='));
const PASSWORD = passwordArg ? passwordArg.split('=')[1] : '';
const SKIP_STREAM = process.argv.includes('--skip-stream');

async function sleep(ms) {
  await delay(ms);
}

function adb(...args) {
  const proc = spawnSync('adb', args, { encoding: 'utf8', env: ADB_ENV });
  if (proc.status !== 0) {
    throw new Error(`adb ${args.join(' ')} failed: ${proc.stderr || proc.stdout}`);
  }
  return (proc.stdout || '').trim();
}

function adbBuffer(...args) {
  const proc = spawnSync('adb', args, { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024, env: ADB_ENV });
  if (proc.status !== 0 || !proc.stdout?.length) {
    throw new Error(`adb ${args.join(' ')} failed`);
  }
  return proc.stdout;
}

function ensureDevice() {
  const out = adb('devices');
  const lines = out.split('\n').filter((l) => l.includes('\tdevice'));
  if (lines.length === 0) {
    throw new Error('No adb device in "device" state.');
  }
  console.log(`Device: ${lines[0].split('\t')[0]}`);
}

function setupForward() {
  try {
    adb('forward', '--remove', `tcp:${LOCAL_PORT}`);
  } catch {
    /* ignore */
  }
  adb('forward', `tcp:${LOCAL_PORT}`, `tcp:${DEVICE_PORT}`);
  console.log(`Forward: localhost:${LOCAL_PORT} -> device:${DEVICE_PORT}`);
}

function enableAccessibility() {
  adb(
    'shell', 'settings', 'put', 'secure', 'enabled_accessibility_services',
    `${PACKAGE}/${PACKAGE}.XSharectAccessibilityService`,
  );
  adb('shell', 'settings', 'put', 'secure', 'accessibility_enabled', '1');
}

function wakeDevice() {
  adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
}

function getUiDump() {
  const dumpPath = '/sdcard/xsharect_cap.xml';
  adb('shell', 'uiautomator', 'dump', dumpPath);
  return adb('exec-out', 'cat', dumpPath);
}

function parseBounds(bounds) {
  const m = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
  if (!m) return null;
  const x1 = Number(m[1]);
  const y1 = Number(m[2]);
  const x2 = Number(m[3]);
  const y2 = Number(m[4]);
  return { x: Math.floor((x1 + x2) / 2), y: Math.floor((y1 + y2) / 2) };
}

function findTapTarget(xml, matchers) {
  const nodeRe = /<node\b[^>]*\/>/g;
  let match;
  while ((match = nodeRe.exec(xml)) !== null) {
    const node = match[0];
    const clickable = /clickable="true"/.test(node);
    if (!clickable) continue;
    const ok = matchers.every(({ attr, value, includes }) => {
      const re = new RegExp(`${attr}="([^"]*)"`);
      const m = node.match(re);
      if (!m) return false;
      return includes ? m[1].includes(value) : m[1] === value;
    });
    if (!ok) continue;
    const boundsM = node.match(/bounds="(\[[^\]]+\]\[[^\]]+\])"/);
    if (!boundsM) continue;
    const center = parseBounds(boundsM[1]);
    if (center) return center;
  }
  return null;
}

function tap(x, y) {
  adb('shell', 'input', 'tap', String(x), String(y));
}

async function dismissDialogs(maxRounds = 6) {
  const labels = [
    'Iniciar agora', 'Start now', 'Começar agora', 'Comecar agora',
    'Atualizar', 'Instalar', 'OK', 'Aceitar', 'Allow',
  ];
  for (let i = 0; i < maxRounds; i++) {
    const xml = getUiDump();
    let tapped = false;
    for (const label of labels) {
      const target = findTapTarget(xml, [{ attr: 'text', value: label, includes: true }]);
      if (target) {
        console.log(`Tap dialog: "${label}" at ${target.x},${target.y}`);
        tap(target.x, target.y);
        await sleep(1200);
        tapped = true;
        break;
      }
    }
    if (!tapped) break;
  }
}

async function tryStartStreaming() {
  wakeDevice();
  adb('shell', 'am', 'start', '-n', ACTIVITY);
  await sleep(2000);
  await dismissDialogs();

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(1500);
    const xml = getUiDump();
    const streamBtn = findTapTarget(xml, [
      { attr: 'resource-id', value: `${PACKAGE}:id/btnToggleServer` },
    ]) || findTapTarget(xml, [{ attr: 'text', value: 'Iniciar', includes: true }]);

    if (streamBtn) {
      console.log(`Tap Iniciar at ${streamBtn.x},${streamBtn.y}`);
      tap(streamBtn.x, streamBtn.y);
      await sleep(1500);
      await dismissDialogs(4);
    }

    const confirmXml = getUiDump();
    const live = confirmXml.includes('Parar') || confirmXml.includes('Ao vivo') || confirmXml.includes('Live');
    if (live) {
      console.log('Streaming UI detected.');
      return true;
    }
  }
  return false;
}

async function launchApp() {
  wakeDevice();
  adb('shell', 'am', 'force-stop', PACKAGE);
  adb('shell', 'am', 'start', '-n', ACTIVITY);
  await sleep(2500);
  await dismissDialogs();
}

function captureDeviceScreen(filename) {
  const outPath = path.join(OUT_DIR, filename);
  const buf = adbBuffer('exec-out', 'screencap', '-p');
  fs.writeFileSync(outPath, buf);
  console.log(`Saved ${outPath} (${buf.length} bytes)`);
}

async function isViewerUp() {
  try {
    const res = await fetch(`http://127.0.0.1:${LOCAL_PORT}/`, {
      signal: AbortSignal.timeout(4000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForViewer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isViewerUp()) return true;
    await sleep(1000);
  }
  return false;
}

async function captureViewer(filename) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const url = `http://127.0.0.1:${LOCAL_PORT}/`;

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  if (PASSWORD) {
    const pwd = page.locator('#password');
    if (await pwd.count()) await pwd.fill(PASSWORD);
  }

  const connectBtn = page.locator('#connectBtn');
  await connectBtn.click({ timeout: 8000 }).catch(() => {});

  await page.waitForFunction(
    () => {
      const panel = document.getElementById('viewerPanel');
      return panel && !panel.classList.contains('hidden');
    },
    { timeout: 20000 },
  );

  await page.waitForFunction(
    () => {
      const text = document.querySelector('.badge-text')?.textContent ?? '';
      return /transmitindo|vivo|live/i.test(text);
    },
    { timeout: 20000 },
  ).catch(() => {
    console.warn('Viewer: live badge not detected — continuing.');
  });

  await page.evaluate(() => {
    const v = document.querySelector('video');
    if (v) {
      v.muted = true;
      void v.play();
    }
  });

  await page
    .waitForFunction(() => {
      const v = document.querySelector('video');
      return v && v.videoWidth > 0;
    }, { timeout: 20000 })
    .catch(() => {
      console.warn('Viewer: no live video frame — saving web UI anyway.');
    });

  await page.waitForTimeout(1200);

  const app = page.locator('#app');
  await app.screenshot({ path: path.join(OUT_DIR, filename) });
  await browser.close();
  console.log(`Saved ${path.join(OUT_DIR, filename)} (full viewer web UI)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  ensureDevice();
  enableAccessibility();
  setupForward();
  await launchApp();

  if (!SKIP_STREAM) {
    const streaming = await tryStartStreaming();
    if (!streaming) {
      console.warn('Could not auto-start stream. Approve projection on device and re-run.');
    } else {
      await sleep(2000);
    }
  }

  captureDeviceScreen('app-host.png');

  const viewerUp = await waitForViewer(20000);
  if (!viewerUp) {
    throw new Error(
      'Viewer HTTP not reachable on :9240. Start transmission manually, then re-run capture.',
    );
  }

  await captureViewer('viewer-desktop.png');
  console.log('\nDone. Screenshots in public/screens/');
}

main().catch((err) => {
  console.error('capture-marketing-screens failed:', err.message);
  process.exit(1);
});

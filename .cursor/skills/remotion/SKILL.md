---
name: remotion
description: Create and render programmatic videos with Remotion for xsharect landpage. Use when building product demos, hero videos, tab walkthroughs, or exporting MP4/WebM from React compositions.
---

# Remotion — xsharect landpage

## Project layout

- Compositions: `remotion/src/`
- Captured frames: `public/demo/frames/`
- Render output: `public/demo/xsharect-demo.mp4`
- Capture script: `scripts/capture-demo-frames.mjs`

## Workflow

1. Device streaming + `adb forward tcp:19240 tcp:9240` (app no repo privado `xsharect`)
2. `npm run capture:demo` — screenshots app + viewer tabs
3. `npm run demo:render` — Remotion render to `public/demo/`
4. Hero embeds MP4 via `<video autoPlay muted loop playsInline>`

## Render commands

```bash
cd remotion
npm install
npm run render
```

From repo root:

```bash
npm run capture:demo
npm run demo:render
```

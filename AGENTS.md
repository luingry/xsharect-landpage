# AGENTS.md — xsharect-landpage

Repositório público do site de divulgação do xsharect (Vite 6 + React 19).

## Dev / build

- `npm install` → `npm run dev` → `http://localhost:5173/xsharect-landpage/`
- Build: `npm run build` (tsc + vite)
- Smoke: `npm run smoke` (após build)

## Subprojetos

- `remotion/` — npm separado para vídeos demo

## Capturas (precisa device + adb)

Scripts em `scripts/capture-*.mjs` exigem app Android transmitindo (repo privado `xsharect`).

## Deploy

Push na `main` → GitHub Pages em `https://luingry.github.io/xsharect-landpage/`

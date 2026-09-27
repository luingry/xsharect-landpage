# AGENTS.md — xsharect-landpage

Site público do xSharect (Vite 8 + TypeScript, sem framework; GSAP + Lenis) e
espelho público dos APKs do app. Leia `README.md` › Deploy antes de mexer.

## Regras

- **Não toque em `public/apk/`**: é escrito pelo pipeline de release do app
  (`xsharect/.github/workflows/release-app.yml`) e servido ao app instalado via
  GitHub Pages. O mesmo vale para `public/vercel.json`, `vercel.json` e
  `.github/workflows/release-web.yml`.
- A base do Vite é relativa (`./`): o mesmo build funciona na raiz (Vercel) e em
  `/xsharect-landpage/` (Pages). Antes de publicar mudança de base/caminhos, rode
  `npm run build` e `npm run build -- --base=/` e confira os caminhos gerados.
- Registre erros não triviais em `ERRORS.md`.

## Dev / build

- `npm install` → `npm run dev` → `http://localhost:5173/`
- `npm run build` (tsc + vite). Node 22.
- No Windows, pare o `vite preview` antes de buildar (ver `ERRORS.md`).

## Deploy

Push em `main` → Vercel (`xsharect.luingry.com.br`) e GitHub Pages
(`https://luingry.github.io/xsharect-landpage/`, via `release-web.yml`).

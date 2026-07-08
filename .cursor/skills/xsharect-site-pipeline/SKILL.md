---
name: xsharect-site-pipeline
description: >-
  CI/CD do site xsharect no GitHub Pages (build Vite + deploy). Use ao trabalhar
  neste repo, abrir/mergear PR develop→main com (web) no título e nos commits,
  ou quando o dev pedir publicar o website.
---

# Pipeline do site — GitHub Pages

## O que faz

Workflow: [`.github/workflows/release-web.yml`](../../.github/workflows/release-web.yml)

| Job | Função |
|-----|--------|
| **validate** | Valida commits `(web)` em PR mergeado |
| **build** | `npm ci` + `npm run build` |
| **deploy** | Publica `dist` no GitHub Pages |

URL: `https://luingry.github.io/xsharect-landpage/`

## Quando roda

- Push na `main` → build + deploy
- PR mergeado `develop` → `main` com `(web)` no título → valida commits `(web)`

## Convenção de commits `(web)`

```
feat(site): hero e showcase (web)
fix(site): contraste do footer (web)
```

## Build local

```bash
npm install && npm run dev
npm run build
```

## APK público

O app privado (`luingry/xsharect`) publica APKs em `public/apk/` via pipeline de release `(app)`.

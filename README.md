# xsharect-landpage

Site de divulgação do [xsharect](https://github.com/luingry/xsharect) — compartilhe a tela do Android na LAN e controle o dispositivo pelo navegador.

Repositório **público** para GitHub Pages. O app Android e o visualizador web ficam no repositório privado `xsharect`.

## URL publicada

https://luingry.github.io/xsharect-landpage/

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/xsharect-landpage/`.

## Build e smoke test

```bash
npm run build
npm run smoke
```

## Capturas e vídeo demo

Requer dispositivo Android com o app transmitindo e `adb` conectado:

```bash
npm run capture:screens   # screenshots → public/screens/
npm run capture:demo      # frames → public/demo/frames/
npm run demo:render       # MP4 hero → public/demo/xsharect-demo.mp4
npm run viewer:render     # MP4 tabs → public/demo/viewer-tabs.mp4
```

## APK público

O pipeline de release do app (`xsharect`) publica APKs em `public/apk/` neste repositório para download direto e checagem de update in-app.

## Release

Merge na `main` via PR `develop` → `main` com `(web)` no título dispara [`.github/workflows/release-web.yml`](.github/workflows/release-web.yml).

# xsharect-landpage

Site público do xSharect (Vite + TypeScript, sem framework) e espelho público dos
APKs que o app usa para se atualizar.

- Produção: <https://xsharect.luingry.com.br> (Vercel, branch `main`)
- Espelho: <https://luingry.github.io/xsharect-landpage/> (GitHub Pages, branch `gh-pages`)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ (base relativa: funciona na raiz e em /xsharect-landpage/)
```

Requer Node 22 (Vite 8 pede ≥ 22.12; `engines` fixa `22.x` no Vercel).

## Deploy (não quebre isto)

| Destino | Como | Detalhe |
|---|---|---|
| Vercel (domínio `xsharect.luingry.com.br`) | build de cada push em `main` | `vercel.json` roda `npm run build -- --base=/` e **pula** a branch `gh-pages` |
| GitHub Pages | `.github/workflows/release-web.yml` publica `dist/` em `gh-pages` a cada push em `main` | `clean: true`: o que não estiver em `dist/` some do Pages |

**`public/apk/` é do pipeline do app** (`xsharect/.github/workflows/release-app.yml`):
a cada release ele commita `public/apk/xsharect-vX.Y.Z.apk` e `public/apk/latest.json`
aqui em `main`. O app instalado baixa atualizações de
`https://luingry.github.io/xsharect-landpage/apk/…`, então essa pasta precisa sempre
ir para o `dist/`. Nunca apague nem mova `public/apk/`, `public/vercel.json`
(impede o Vercel de tentar buildar `gh-pages`) ou o workflow.

## Estrutura

- `index.html`: todo o conteúdo (pt-BR).
- `src/main.ts`: Lenis (scroll suave) + GSAP ScrollTrigger (reveals reversíveis,
  portal da visão geral, palavras do manifesto, títulos com reveal por palavra,
  passos, clip do filme, marquee (velocidade constante, direita p/ esquerda, independente do scroll),
  FAQ e "Novidades desta versão" com expansão/retração animada, troca de primeiro
  plano entre os previews do hero (celular/desktop, vídeos sincronizados), ícones
  de fundo com parallax (um por seção, nunca dois na tela),
  física de hover, scrollbar customizada (marcas de seção clicáveis), download.
- `src/shader.ts`: fundo líquido WebGL do hero/download (baixa resolução + blur CSS,
  reage ao ponteiro, pausa fora da tela).
- `src/release.ts`: lê `apk/latest.json` do próprio deploy (mesma origem), depois a
  cópia do GitHub Pages (CORS aberto) e, por fim, `src/latest.seed.json`.
- `src/icons.ts`: ícones Phosphor inlinados (`<i class="ph ph-NOME">`) e os ícones
  grandes de fundo (`data-bgicon`, Phosphor Bold).
- `public/videos/`: filmes S1–S4 + `hero-phone.mp4` e `hero-desktop.mp4` (gerados em
  `xsharect/marketing/demo-videos`, Remotion, repo privado).
- `public/shots/`: renders das telas reais (réplicas fiéis do app/visualizador).
- `public/brand/`: marca atual do app ("Shared Window", raster aprovado).

## Acessibilidade e movimento

`prefers-reduced-motion` desliga Lenis, scrubs, marquee e parallax (o shader
renderiza um quadro estático). Scrollbar nativa oculta, mas teclado/roda/touch
funcionam normalmente; em touch a barra customizada vira um indicador discreto.

## Histórico

A versão anterior (React 19 + framer-motion, com o subprojeto `remotion/`) está
preservada na branch `backup/landpage-react-2026-09-27`.

# Setup do repositório remoto

O conteúdo do landpage está pronto localmente. Crie o repo público no GitHub e publique:

## 1. Criar repo no GitHub

Em https://github.com/new:

- **Name:** `xsharect-landpage`
- **Visibility:** Public
- **Não** inicialize com README (repo vazio)

## 2. Push (manual ou CI)

### CI automático (recomendado)

No repo `xsharect`, adicione secret **`XSHARECT_LANDPAGE_PUSH_TOKEN`**: PAT fine-grained em `luingry/xsharect-landpage` com:

- **Contents:** Read and write
- **Workflows:** Read and write *(obrigatório para subir `release-web.yml` via CI)*

Depois rode Actions → **Bootstrap landpage** → Run workflow.

Se o PAT tiver só Contents, o bootstrap envia o site mas **pula** o workflow — aí cole `.github/workflows/release-web.yml` manualmente no landpage ou atualize o PAT e rode de novo.

### Push manual

```bash
cd xsharect-landpage
git remote add origin https://github.com/luingry/xsharect-landpage.git  # se ainda não tiver
git push -u origin main
git push -u origin develop
```

## 3. GitHub Pages

Settings → Pages → Build and deployment → **Deploy from a branch**

- Branch: **`gh-pages`**
- Folder: **`/ (root)`**

O workflow `release-web.yml` publica o build na branch `gh-pages`. URL: `https://luingry.github.io/xsharect-landpage/`

## Import via bundle (alternativa)

Se o clone local não existir:

```bash
git clone xsharect-landpage.bundle xsharect-landpage
cd xsharect-landpage
git remote add origin https://github.com/luingry/xsharect-landpage.git
git push -u origin main develop
```

# Checkmate Partners — Landing Page

## Como rodar localmente

1. Instale o Node.js (https://nodejs.org) se ainda não tiver
2. Abra o terminal na pasta do projeto
3. Execute:

```bash
npm install
npm run dev
```

4. Acesse http://localhost:5173

## Como subir no Vercel (sem terminal)

1. Crie uma conta em https://vercel.com (gratuito)
2. Clique em "Add New Project"
3. Faça upload da pasta do projeto **ou** conecte via GitHub:
   - Crie um repositório no GitHub (https://github.com/new)
   - Faça upload dos arquivos
   - No Vercel, importe o repositório
4. O Vercel detecta Vite automaticamente — clique em **Deploy**
5. Em ~1 minuto seu site estará no ar com URL pública

## Como subir no Vercel via terminal

```bash
npm install
npm run build
npx vercel --prod
```

## Estrutura do projeto

```
checkmate-partners/
├── public/
│   ├── favicon.svg
│   ├── videos/     ← coloque vídeos aqui se quiser hospedar localmente
│   └── images/     ← coloque imagens aqui
├── src/
│   ├── App.tsx     ← todo o código da landing page
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

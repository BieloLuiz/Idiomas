# Idiomas — app de inglês e francês (A1 a C1) para o Gabriel e o marido

App web instalável (PWA) publicado em https://bieloluiz.github.io/Idiomas/ (GitHub Pages, branch `main`, raiz).
Servidor: Google Apps Script sobre a planilha "Idiomas – dados" (perfis/progresso na aba Perfis, uso da IA na aba Uso).
Textos do app e conversas com o usuário: português do Brasil, linguagem simples.

## O que fica onde
- `index.html` — o app pronto (gerado; não editar à mão). `sw.js` (offline), `sync.js` (sincroniza com a planilha),
  `config.js` (URL /exec do Apps Script), `manifest.webmanifest`, ícones, `audio/` (um MP3 por unidade, 120 arquivos).
- `apps-script/Code.gs` — servidor. Cada push na `main` que mexe em `apps-script/` publica sozinho
  (`.github/workflows/publicar.yml`, clasp 2.4.2, segredo `CLASPRC_JSON`, mesmo link /exec). Não versionar `appsscript.json`.
- `fonte/` — tudo para gerar o `index.html` de novo:
  - `design/design.html` — design atual (Claude Design / GPT). Um design novo substitui este arquivo.
  - `src/build-app.py <design.html> <saida.html>` — injeta o curso (`COURSE`) e o áudio (`AUDIO`) no design e aplica os
    encaixes (`rep(...)`, que param o build se o design mudar). Usa `adapter.js` (monta lições, guias, áudio),
    `som.js` (sons), `ia.js` + `ia-telas.js` (Eco com IA: dúvidas, redação, pronúncia, ditado, revisão dos erros,
    conversa por turnos e ao vivo). Imagens PNG grandes do módulo Descobrir viram WebP no build.
  - `curso/<nível>/<en|fr>-<nível>.json` — unidades A2–C1 (A1 está em `src/base.json`, `src/en.js`, `src/fr.js`).
    Formato e regras nos prompts do kit; conferência com `src/check_*.py`.
  - `src/sprites*.json` — trecho [início, fim] de cada frase dentro do MP3 da unidade. Chave `idioma|índice` (A1 0–11,
    A2 12–23, B1 24–35, B2 36–47, C1 48–59).
  - `pwa/build-pwa.py` — gera a pasta do site a partir do `index` montado (manifest, sw com versão, ícones, áudio).
  - `testes/` — Playwright com IA simulada (`mockapi.mjs` na porta 8790; site de teste na 8766).
  - `elevenlabs/` — script PowerShell que gera o áudio no PC do usuário (a chave fica em `chave.txt` no PC; nunca pedir).
- Kits de conteúdo e áudio ficam no PC: `Downloads\APP - IDIOMAS\` (kit-a2…kit-c1, audio-curso\elevenlabs).

## Fluxos
- Conteúdo novo: GPT escreve (3 unidades por vez) → Gemini revisa → conferir formato → manifest → áudio no PC
  (ElevenLabs eleven_v4_turbo, mp3_24000_48; vozes em `fonte/elevenlabs/config.json`; Claire/Inès/Lucas/Antoine no
  francês, Sarah/Emma/Lucas/Daniel no inglês) → montar sprites → build → publicar.
- IA (Apps Script, propriedades do script): GROQ_API_KEY, GITHUB_MODELS_TOKEN, GEMINI_API_KEY. Ordem de reserva em
  `ROTAS` no Code.gs. Conversa ao vivo: Apps Script gera token temporário (`v1beta/auth_tokens`) e o navegador conecta
  ao `gemini-3.8-live`. As chaves nunca vão para o app nem para o chat.
- Antes de publicar: rodar `fonte/testes/apptest.mjs` (todos os botões de áudio com gravação, sem erros) e os testes da IA.

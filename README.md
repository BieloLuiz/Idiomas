# Idiomas

Curso de inglês e francês (A1 a C1) para estudar a dois. App web instalável (PWA).

## Desenvolvimento

```sh
python -m pip install -r requirements.txt
npm ci
python fonte/build.py
npm test
npx playwright install chromium
npm run test:browser
```

Não editar os arquivos publicados diretamente: eles são gerados de `fonte/`. Os recursos ficam em `assets/`, com nomes determinados pelo conteúdo. O laboratório 3D carrega ao ser aberto.

Veja [ativação da entrada Google](docs/ATIVACAO.md) antes de publicar esta versão e [tratamento dos achados](docs/CORRECOES-AUDITORIA.md). A lista de contas permitidas pertence às propriedades privadas do Apps Script.

- `index.html` e `assets/`: interface, conteúdo, lições e recursos gerados.
- `audio/`: uma gravação por unidade (ElevenLabs).
- `config.js`: endereço do Apps Script que guarda perfis e progresso na planilha.
- `auth.js`: entrada com Google; `sync.js`: fila persistente de perfis e reconciliação com a planilha. `sw.js`: interface e unidades baixadas sem internet.

## Servidor (Apps Script)

O código em `apps-script/` é publicado sozinho no Google Apps Script a cada mudança na branch `main`
(veja `.github/workflows/publicar.yml`). O link `/exec` continua o mesmo.
Precisa do segredo `CLASPRC_JSON` no repositório (o mesmo usado no Cofrinho).

# Idiomas — inglês e francês A1 a C1

Aplicativo pessoal para estudar a dois, publicado em GitHub Pages. Interface e explicações em português do Brasil, com linguagem simples.

## Arquivos e contratos

- `fonte/design/design.html`: design e telas. Nunca editar somente o artefato publicado.
- `fonte/src/build-app.py`: incorpora conteúdo e módulos ao design. Os encaixes `rep(...)` verificam a contagem esperada e precisam ser atualizados quando um alvo muda.
- `fonte/src/adapter.js`: descritores de curso, lições preparadas sob demanda, revisão de expressões e áudio.
- `fonte/src/profile-core.js`: regras puras de normalização, reconciliação, dias e revisão; o build copia esse módulo para `apps-script/ProfileCore.gs`.
- `fonte/src/discovery.js`: atividades baseadas na unidade e idioma, com eventos declarados. Não reintroduzir execução de HTML por eval/new Function.
- `fonte/src/ia.js` e `ia-telas.js`: pedidos identificados e telas de IA. Toda operação assíncrona mantém o perfil proprietário. Toda captação precisa de uma função registrada em `studioCleanup`.
- `fonte/curso/<nível>/`: conteúdo A2–C1. A1 fica em `src/base.json`, `en.js` e `fr.js`. `sprites*.json` mapeiam os trechos dos 120 MP3.
- `fonte/pwa/`: autenticação, sincronização, service worker e empacotamento dos recursos.
- `apps-script/Code.gs` e `Security.gs`: servidor sobre a planilha. As chaves ficam nas propriedades privadas do script; não pedir nem versionar as chaves. O ID do cliente Google e a lista das duas contas têm padrão no código (`Security.gs`, escolha do dono) e podem ser substituídos pelas propriedades `GOOGLE_CLIENT_ID` e `ALLOWED_EMAILS`.
- `apps-script/Orcamento.gs`: orçamento da IA (US$ 5 por mês para os dois, US$ 4 operacionais + US$ 1 de reserva). Toda chamada de IA passa por `reservar_` e `confirmar_` em `pedidoIA_`. Preços, teto e cotas nas propriedades `PRECOS`, `ORCAMENTO`, `COTAS` e `ORCAMENTO_MODO`; detalhe na aba Custos. Valores são estimativas.
- `index.html`, `assets/`, `auth.js`, `sync.js`, `sw.js`, `manifest.webmanifest`: saídas geradas.
- `fonte/testes/regression.test.cjs` e `browser.cjs`: verificações canônicas. Os demais scripts antigos são diagnósticos históricos, sem garantia de portabilidade.

## Montagem e verificações

Requer Python com as versões de `requirements.txt` e Node com `npm ci`.

```
python fonte/build.py
npm test
npx playwright install chromium
npm run test:browser
```

`sh fonte/montar.sh` chama o mesmo build em sistemas com sh. No Linux de CI, instalar o navegador com `--with-deps`. Não usar caminhos de dependências de outra máquina nos testes.

Os testes devem usar serviços simulados e dados fictícios. Não consumir cotas ou alterar perfis reais para validar mudanças.

## Revisão e publicação

Preparar mudanças em branch e proposta de revisão. Não integrar na `main` nem publicar sem autorização do usuário. A integração na `main` publica o site; mudanças em `apps-script/` publicam o servidor no mesmo `/exec`, depois das verificações. Não versionar `appsscript.json`, `.clasprc.json` ou segredos.

Ler `docs/ATIVACAO.md` antes da implantação: a entrada Google exige `GOOGLE_CLIENT_ID` e `ALLOWED_EMAILS` privados. A ausência de configuração precisa bloquear a API, nunca habilitar acesso anônimo aos dados.

Manter AGENTS.md, CLAUDE.md e GEMINI.md com o mesmo conteúdo. Registrar limites e verificações reais em `docs/CORRECOES-AUDITORIA.md`; não apresentar integração simulada como teste de produção.


## Videoaulas

Videoaulas são feitas inteiramente pelo Claude, sem ChatGPT. Quando o usuário pedir um vídeo (por exemplo, "faz o vídeo da unidade 2"):
1. Escreva você mesmo o roteiro de inglês e de francês daquela unidade, seguindo as regras e a lista de frases que `node fonte/videos/pedido-roteiro.mjs <nível> <unidade>` imprime (as falas dos personagens só podem usar as frases listadas, com o personagem indicado). Use `fonte/videos/roteiros/piloto-v2.json` como modelo de formato e de tom; salve em `fonte/videos/roteiros/<nível>-u<unidade>.json`.
2. Depois siga `fonte/videos/PROMPT-CLAUDE.md` do passo 2 em diante (conferir, narração, gerar, conferir os quadros, mostrar o vídeo).
Se o usuário mandar um roteiro pronto, use-o a partir do passo 1 do PROMPT-CLAUDE.md. O usuário não é programador: fale em passos simples, não peça que ele copie nada e faça você mesmo tudo o que puder (inclusive rodar a narração no PC, quando estiver nele). Publicar no app (videos/ e lista.json) só com o OK dele.

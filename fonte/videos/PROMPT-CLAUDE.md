# Tarefa: gerar videoaulas do app Idiomas a partir de um roteiro

Você vai produzir videoaulas verticais (MP4 720x1280) para o app **Idiomas**. O repositório é o GitHub `BieloLuiz/Idiomas` e o app (PWA) está em https://bieloluiz.github.io/Idiomas/. Converse e escreva os textos em português do Brasil, com linguagem simples.

O gerador já existe e foi aprovado no piloto: visual, ritmo, vozes e "Repita comigo". **Não mude o visual nem a lógica do gerador.** Corrija só o que impedir a geração e explique ao usuário o que mudou.

O roteiro está anexado a esta mensagem: um JSON gerado pelo ChatGPT.

## Antes de começar

1. Clone o repositório e mude para a branch `videos`. Não trabalhe na `main`.
2. Leia `CLAUDE.md` na raiz e siga as regras dele. Elas valem acima deste prompt.
3. Prepare o ambiente com os comandos abaixo. Também é preciso ter `ffmpeg`/`ffprobe` e Playwright com Chromium; se o Chromium estiver em outro caminho, use `CHROMIUM_PATH=<caminho>`.
   ```
   npm ci
   pip install -r requirements.txt
   python3 fonte/build.py        # gera assets/ com os áudios do curso (var AUDIO), que o gerador usa
   ```

## Regra principal: nenhum áudio novo em inglês ou francês

As falas dos personagens só podem usar frases **que já têm áudio gravado no curso**, e com uma voz do mesmo personagem ou, pelo menos, do mesmo gênero. Não se gera áudio novo no idioma.

- A lista de frases disponíveis por unidade sai deste comando:
  ```
  node fonte/videos/frases-por-unidade.mjs en A1     # ou fr, A2, B1…
  ```
  Cada linha mostra a frase e quem a fala na gravação.
- Personagens:
  - **Inglês:** Sarah, Emma (mulheres); Lucas, Daniel (homens).
  - **Francês:** Claire, Inès (mulheres); Lucas, Antoine (homens).
- O comando `--manifesto` confere tudo isso. Se ele parar com "sem áudio no curso" ou "só existe na voz de X", troque a frase por outra da lista ou troque o personagem. Faça isso no roteiro, nunca gerando áudio.
- Um personagem não pode dizer o nome de outro como se fosse o dele. Por exemplo, a voz da Emma não diz "I'm Lucas.".

## Arquivos (branch `videos`)

- `fonte/videos/limpar-roteiro.py`: conserta o JSON do ChatGPT (aspas curvas, `\[`, `\_`, e "tela"/"falas" fora de colchetes).
- `fonte/videos/roteiros/`: roteiros limpos. `piloto-v2.json` é a referência aprovada.
- `fonte/videos/cena.html`: o layout. Fica nesta ordem:
  - legenda do Eco no alto;
  - exemplos abaixo;
  - balões de diálogo;
  - fórmulas;
  - desafios;
  - "Repita comigo";
  - encerramento.
- `fonte/videos/gerar-video.mjs`: monta a linha do tempo, grava, mistura o áudio e gera o MP4.
- `fonte/videos/frases-por-unidade.mjs`: a lista de frases com áudio.
- `fonte/videos/narracao/`: os MP3 do narrador em português (`<id>-NN.mp3`) e o `manifest-video.json`.

## Formato do roteiro

```json
{ "aulas": [ { "id": "en-a1-u02", "titulo": "...", "idioma": "en|fr", "nivel": "A1", "unidade": 2,
  "cenas": [ { "parte": "gancho|explicacao|erro|desafio|fechamento",
    "eco": "wave|speaking|happy|confused|thinking|celebrate|neutral",
    "tela": ["linha 1", "linha 2"],
    "falas": [ { "voz": "narrador", "texto": "..." }, { "voz": "Sarah", "texto": "Hi! I'm Sarah." } ],
    "pausa_segundos": 0 } ] } ] }
```

O gerador entende estas linhas da `tela` sozinho:

| Linha da tela | Como aparece |
|---|---|
| frase no idioma seguida da tradução na linha de baixo | cartão |
| `Nome: frase` | balão de diálogo (até 3 na tela, rolando) |
| `A = B`, `A + B`, `A → B` (curtas) | fórmula em blocos; as palavras delas ficam destacadas nos exemplos |
| `✗ …` e `✓ …` | cartão de erro (riscado) e cartão de acerto |
| `Resposta: B` logo antes de `✓ …` | selo no cartão verde |
| `___`, `A) …`, `B) …` numa cena com `pausa_segundos` | desafio com lacuna, opções e contagem |
| no `gancho`, uma linha de contexto | etiqueta pequena; linhas que terminam com `:` são ignoradas |

O "Repita comigo" (a primeira frase de cada explicação, mais devagar e com pausa) e o resumo do final são gerados sozinhos. Não coloque nada disso no roteiro.

O `id` segue o padrão `<idioma>-<nível minúsculo>-u<unidade com 2 dígitos>`.

## Passo a passo

1. **Limpe o roteiro.**
   ```
   python3 fonte/videos/limpar-roteiro.py <anexo.txt> fonte/videos/roteiros/<nome>.json
   ```
   Revise o texto no idioma: gramática, acentos e os espaços antes de `! ? :` no francês. Mostre ao usuário o que você mudou.

2. **Confira as falas e gere o manifesto do narrador.**
   ```
   node fonte/videos/gerar-video.mjs fonte/videos/roteiros/<nome>.json --manifesto
   ```
   Repita até passar, ajustando o roteiro conforme a regra principal. Depois informe ao usuário quantas falas do narrador e quantos caracteres saíram.

3. **Narração em português (ElevenLabs).**
   - **Se você está rodando no PC do usuário (Windows):** copie `fonte\videos\narracao\manifest-video.json` para `C:\Users\biels\Downloads\APP - IDIOMAS\audio-curso\elevenlabs\` e execute o `gerar-video.bat` dessa pasta (ele usa a chave da conta 2). Quando terminar, copie os MP3 da pasta `audio-video` dali para `fonte\videos\narracao\`. **Nunca abra os arquivos de chave.**
   - **Se você está na nuvem:** peça ao usuário para fazer esse mesmo passo e mandar os MP3.
   - A voz do narrador é o papel `pt_narrador` em `fonte/elevenlabs/config.json`. Se ela estiver vazia, peça ao usuário o **ID da voz**, nunca a chave.
   - **Nunca peça, leia ou guarde chaves de API.** Não abra `chave.txt` nem `chave-conta2.txt`.

4. **Gere o vídeo.**
   ```
   node fonte/videos/gerar-video.mjs fonte/videos/roteiros/<nome>.json <pasta-de-saída>
   ```
   Sem os MP3, o narrador fica mudo e aparece só na legenda. O aviso "narração ainda não gravada" é esperado nesse caso. Já os avisos "sem áudio" ou "voz trocada" **não podem** aparecer.

5. **Confira o resultado (obrigatório).** Tire de 10 a 12 quadros de cada vídeo com `ffmpeg -ss <s> -frames:v 1` e olhe as imagens. Verifique:
   - nada cortado, sobreposto ou encostado na legenda;
   - o nome no cartão corresponde a quem fala;
   - as cores de ✗/✓ estão certas;
   - a duração, com `ffprobe`, fica normalmente entre 80 e 120 s.

6. **Entregue.**
   - Envie os MP4 com uma linha por vídeo: o ID, a duração e se é prévia (sem narrador) ou versão final.
   - Faça commit na branch `videos`. Inclua o roteiro limpo. Os MP3 entram só se o usuário concordar. **Os MP4 não entram.**
   - Abra ou atualize o PR. **Não integre na `main` nem publique sem o OK explícito do usuário.**

## Regras

- Não versione `Segredo.gs`, `appsscript.json`, `.clasprc.json` nem nenhuma chave.
- Não altere o app (`fonte/src`, `apps-script/`) para esta tarefa.
- Gere uma aula, confira e só depois gere as demais.
- Quando algo depender do usuário (voz, MP3, aprovação), diga exatamente o que ele precisa fazer.

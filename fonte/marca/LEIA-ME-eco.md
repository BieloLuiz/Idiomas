# Eco · Idiomas — pacote completo

Tudo o que foi feito para a Eco e a marca do Idiomas, pronto para entrar no app.

## O que tem em cada pasta

| Pasta | O que é | Vai no app? |
| --- | --- | --- |
| `componente/` | `eco.js` (legível) e `eco.min.js` (o mesmo, compactado, 28 KB). A Eco inteira em SVG: todos os estados, a **entrada**, a voz, a versão plana e a 2.5D. | Sim, **só um** dos dois (use o `.min`). |
| `abertura/` | `idiomas-abertura.svg`: abertura animada de 3,6 s com a Eco **e o nome "idiomas"** (as letras surgem e o pingo dourado cai). Só SVG + CSS, 20 KB, toca uma vez. | Opcional: para uma tela de abertura com o nome. |
| `marca/` | Logo: assinatura (Eco + nome), nome sozinho e a Eco sozinha, nos temas claro, escuro e uma cor. | Sim, no cabeçalho e onde precisar do nome. |
| `icones/` | Ícones do PWA (192, 512, maskable), ícone do iPhone (180), favicons e o bloco `icons` do manifesto. | Sim. |
| `paginas-de-teste/` | `eco-estados.html` (testar todos os estados, plana × 2.5D) e `marca-idiomas.html` (todas as versões do logo). Abra no navegador. | Não. Só para conferir. |

O arquivo do Blender **não está aqui**: ele fica no seu computador em
`Downloads\Eco-3D-Editavel\Eco-3D\Eco_Expressoes_v1.blend`. Ele é a referência de movimento (todas as animações em 3D) e **não vai no app**.

## Duas formas de abertura

1. **Só a Eco** (dentro do app, sem tela extra):
   `eco.estado('entrada')` — chega da esquerda crescendo, quica ao frear, pisca, sorri e acena (3 s). Depois fica em `neutral`.
2. **Tela de abertura com o nome** (splash):
   mostrar `abertura/idiomas-abertura.svg` em tela cheia por ~3,6 s e depois abrir o app.

Use uma ou outra, não as duas seguidas.

## Como colocar no Google Apps Script

Apps Script não aceita arquivos `.js` soltos. Então:

1. Crie um arquivo HTML chamado `eco` e cole dentro:
   ```html
   <script>
   /* conteúdo inteiro do eco.min.js aqui */
   </script>
   ```
2. No arquivo `Code.gs`, se ainda não existir:
   ```js
   function include(nome) {
     return HtmlService.createHtmlOutputFromFile(nome).getContent();
   }
   ```
3. No HTML principal (que deve ser servido com `createTemplateFromFile(...).evaluate()`), antes do script do app:
   ```html
   <?!= include('eco'); ?>
   ```
4. Os SVGs da marca podem ser colados direto no HTML. **Os PNG dos ícones e o manifesto precisam ficar hospedados fora do Apps Script** (por exemplo, GitHub Pages), porque o Apps Script não serve arquivos de imagem.

## Como usar a Eco (API)

```html
<div id="eco"></div>
<script>
  const eco = Eco.criar(document.getElementById('eco'), { estilo: '2.5d' });
  eco.seguirPonteiro(true);        // olhos seguem o dedo/mouse

  // abertura conforme a hora (depois das 22h ela abre com sono)
  const ab = Eco.abertura({ nome: 'Gabriel' });   // { estado, frase }
  eco.estado(ab.estado === 'sleepy' ? 'sleepy' : 'entrada');
  mostrarFrase(ab.frase);
</script>
```

| Chamada | Quando usar |
| --- | --- |
| `Eco.criar(el, { estilo: '2.5d' })` | Cria a Eco. Sem `estilo`, é a versão plana. `{ justo: true }` para ícones pequenos (24–48 px). |
| `eco.estado('neutral')` | Tela Hoje, cabeçalhos, boas-vindas. |
| `eco.estado('entrada')` | Ao abrir o app. |
| `eco.estado('happy')` | Acerto na lição. |
| `eco.estado('confused')` | Erro ("hmm", nunca triste). |
| `eco.estado('celebrate')` | Fim de lição. `{ grande: true }` no fim de nível (com confete). |
| `eco.estado('thinking')` | IA processando. |
| `eco.estado('reading')` | Correção de redação. |
| `eco.estado('listening')` + `eco.conectarAudio(streamDoMicrofone)` | A pessoa fala; o anel da antena pulsa com a voz. |
| `eco.estado('speaking')` + `eco.conectarAudio(elementoDeAudio)` | A Eco fala; a boca acompanha o volume. |
| `eco.estado('surprise')` | A pessoa interrompe a Eco; "opa" de 0,5 s. |
| `eco.estado('wave')` | Cumprimento. |
| `eco.estado('sleepy')` | À noite ou parada. |
| `eco.pausar()` / `eco.retomar()` | Pausar enquanto a pessoa lê ou escreve. |
| `eco.sequencia(dias)` | Estrela da sequência de dias (0 esconde). |
| `Eco.frase('dupla', { nomes: [a, b] })` | Os dois estudaram hoje: `{ estado: 'happy', frase }`. |

Comportamentos automáticos:
- **Fila:** uma animação por vez; reações iguais seguidas viram uma só; `surprise` interrompe.
- **Bateria:** parada, a Eco não gasta processamento; para quando o app vai para segundo plano.
- **Reduzir movimento:** se o celular estiver com essa opção, ela só troca de expressão, sem se mexer.
- **Microações:** em `neutral`, a cada 30–60 s olha para os lados, mexe a antena ou se espreguiça.
- **Toque:** tocada, dá uma apertadinha e sorri.
- **Cor da antena por estado:** dourada (neutral), verde (acerto), caramelo (erro), lilás (pensando), azul-claro (lendo), azul (ouvindo), verde-água (falando), apagada (sono).

Cores: variáveis CSS (`--eco-corpo`, `--eco-viseira`, `--eco-rosto`, `--eco-dourado`, `--eco-luz-<estado>`…) podem ser trocadas no CSS do app.

## Ícones (no `<head>` do app)

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#5366C7">
```
No `manifest.webmanifest`, use o bloco `icons` de `icones/manifest-icones.json` (os caminhos devem apontar para onde os PNG estiverem hospedados).

## Prompt para pedir a integração a outra IA

```
Quero integrar a mascote Eco no meu app (Google Apps Script, HtmlService, PWA).
Anexei o eco.min.js, o LEIA-ME.md e os arquivos do app.

REGRAS
- NÃO altere o eco.js. Só use a API descrita no LEIA-ME.md.
- Siga a seção "Como colocar no Google Apps Script" do LEIA-ME.
- Remova a Eco 3D atual e tudo que carrega ela.
- Antes de mudar qualquer coisa, diga em quais arquivos e linhas vai mexer.

Faça em etapas: 1) a Eco aparecendo na tela Hoje com eco.estado('entrada')
na abertura; 2) acerto/erro/fim de lição; 3) conversa por voz;
4) redação, sequência e "os dois estudaram hoje". Eu testo entre as etapas.
```

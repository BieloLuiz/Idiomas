
/* =====================================================================
   PERSONAGEM DO PERFIL
   Quatro estilos de desenho, todos de código aberto, sem nenhuma arte do Duolingo:
   - Traço: Humation · MIT License (c) 2026 Humation contributors · https://github.com/humation-labs/humation
   - Clássico: estilo Avataaars, de Pablo Stanley, livre para uso pessoal e comercial · https://avataaars.com
   - Toon: estilo Toon Head, de Johan Melin, CC BY 4.0 · https://www.figma.com/community/file/1589627891082866389
   - Personas: estilo Personas, de Draftbit, CC BY 4.0 · https://personas.draftbit.com
   Os três últimos são desenhados pela biblioteca DiceBear (MIT License (c) Florian Körner · https://www.dicebear.com).
   Alteração feita aqui: só a escolha de cores e combinações das peças; os desenhos não foram modificados.
   O pacote com as bibliotecas fica em window.AVLIB (gerado por avlib/entry.js com esbuild).
   ===================================================================== */
var AV_CORES = {
  pele: [['ffdbb4', 'Clara'], ['f1c3a5', 'Clara rosada'], ['edb98a', 'Média clara'], ['d08b5b', 'Média'], ['ae5d29', 'Morena'], ['8d5a3b', 'Escura'], ['614335', 'Retinta']],
  cabelo: [['2c1b18', 'Preto'], ['4a312c', 'Castanho escuro'], ['724133', 'Castanho'], ['a55728', 'Ruivo'], ['b58143', 'Mel'], ['d6b370', 'Loiro'], ['e8e1e1', 'Grisalho'], ['e86aa6', 'Rosa'], ['4f78c9', 'Azul'], ['3fae8f', 'Verde']],
  roupa: [['087a6c', 'Verde-mar'], ['3fc2ab', 'Menta'], ['2f6fc4', 'Azul'], ['7a55cc', 'Roxo'], ['ffb020', 'Âmbar'], ['e0604f', 'Coral'], ['ec4899', 'Rosa'], ['0e141b', 'Preto'], ['56616e', 'Grafite'], ['e8e9e6', 'Off-white']],
  detalhe: [['262e33', 'Preto'], ['e6e6e6', 'Prata'], ['5199e4', 'Azul'], ['ff5c5c', 'Vermelho'], ['ffdeb5', 'Dourado'], ['a7ffc4', 'Menta'], ['ff488e', 'Rosa']],
  fundo: [['cdeee6', 'Menta'], ['cfe3fb', 'Céu'], ['e4dcfb', 'Lavanda'], ['ffe3a8', 'Âmbar'], ['ffd6cc', 'Pêssego'], ['e3e8ee', 'Névoa'], ['26313f', 'Noite']]
};

/* lista de peças: [valor, nome]; o nome vai para o leitor de tela e para a dica do mouse */
function avNum(lista, prefixo) { return lista.map(function (v, i) { return [v, prefixo + ' ' + (i + 1)]; }); }

var AV_ESTILOS = {
  traco: {
    nome: 'Traço', credito: 'Humation (MIT)',
    abas: [
      ['Cabelo', [['head', 'Corte', 'partes'], ['cabelo', 'Cor do cabelo', 'cor']]],
      ['Pele', [['pele', 'Tom de pele', 'cor']]],
      ['Roupa', [['body', 'Peça', 'partes'], ['roupa', 'Cor da roupa', 'cor']]],
      ['Na cabeça', [['item', 'Bichinho ou objeto', 'partes']]],
      ['Óculos', [['glasses', 'Óculos', 'partes']]],
      ['Fundo', [['fundo', 'Cor de fundo', 'cor']]]
    ],
    partes: function () {
      var L = window.AVLIB;
      var nomesItem = { 'none': 'Nada', 'santa-hat': 'Gorro de Natal', 'duck': 'Patinho', 'ice-cream': 'Sorvete', 'flower': 'Flor', 'crown': 'Coroa', 'halo': 'Auréola', 'bunny-ears': 'Orelhas de coelho', 'antennae': 'Anteninhas', 'crab-headband': 'Tiara de caranguejo', 'tuna-sushi': 'Sushi de atum', 'sprout': 'Brotinho', 'beer': 'Caneca', 'camera': 'Câmera', 'shrimp-sushi': 'Sushi de camarão', 'wind-chime': 'Sininho de vento', 'frog-alt': 'Sapinho', 'ramune': 'Garrafinha', 'takoyaki': 'Takoyaki', 'chocolate-banana': 'Banana com chocolate', 'yoyo': 'Ioiô', 'beach-ball': 'Bola de praia', 'sunflower': 'Girassol', 'eggplant': 'Berinjela', 'shark': 'Tubarão', 'fox-mask': 'Máscara de raposa', 'banana': 'Banana', 'watermelon': 'Melancia', 'pineapple': 'Abacaxi', 'candied-apple': 'Maçã do amor', 'sunglasses': 'Óculos escuros', 'goggles': 'Óculos de natação' };
      var itens = L.humationPartes('item').filter(function (v) { return v !== 'beer'; });
      return {
        head: avNum(L.humationPartes('head'), 'Corte'),
        body: [['cropped-shirt', 'Blusa curta'], ['tank-top', 'Regata'], ['drape-tee', 'Bata'], ['polo', 'Polo'], ['tee', 'Camiseta'], ['shirt', 'Camisa'], ['jacket', 'Jaqueta'], ['hoodie', 'Moletom']],
        item: itens.map(function (v) { return [v, nomesItem[v] || (/cat/.test(v) ? 'Gatinho' : v)]; }),
        glasses: [['none', 'Sem óculos'], ['round', 'Redondos'], ['tiny', 'Pequenos']]
      };
    },
    padrao: { head: 'curly-short', body: 'hoodie', item: 'none', glasses: 'none' },
    desenhar: function (c, p) {
      return window.AVLIB.humation({
        selections: { head: p.head, body: p.body, item: p.item, glasses: p.glasses, bottom: 'wide-pants' },
        colors: { hair: c.cabelo, skin: c.pele, clothes: c.roupa, bottom: '0e141b', stroke: '1b1b1d' },
        background: c.fundo
      }).toDataUri();
    }
  },
  classico: {
    nome: 'Clássico', credito: 'Avataaars, de Pablo Stanley',
    abas: [
      ['Cabelo', [['top', 'Cabelo ou chapéu', 'partes'], ['cabelo', 'Cor do cabelo', 'cor']]],
      ['Pele', [['pele', 'Tom de pele', 'cor']]],
      ['Rosto', [['eyes', 'Olhos', 'partes'], ['eyebrows', 'Sobrancelhas', 'partes'], ['mouth', 'Boca', 'partes']]],
      ['Barba', [['facialHair', 'Barba e bigode', 'partes']]],
      ['Roupa', [['clothing', 'Peça', 'partes'], ['roupa', 'Cor da roupa', 'cor'], ['clothingGraphic', 'Estampa (na camiseta estampada)', 'partes']]],
      ['Óculos', [['accessories', 'Óculos', 'partes'], ['detalhe', 'Cor dos óculos e do chapéu', 'cor']]],
      ['Fundo', [['fundo', 'Cor de fundo', 'cor']]]
    ],
    partes: function () {
      var tops = window.AVLIB.estilos.avataaars.schema.properties.top.items.enum;
      var chapeus = { hat: 'Chapéu', hijab: 'Hijab', turban: 'Turbante', winterHat1: 'Gorro 1', winterHat02: 'Gorro 2', winterHat03: 'Gorro 3', winterHat04: 'Gorro 4' };
      var cab = tops.filter(function (v) { return !chapeus[v]; }), chap = tops.filter(function (v) { return chapeus[v]; });
      return {
        top: [['nenhum', 'Careca']].concat(avNum(cab, 'Cabelo'), chap.map(function (v) { return [v, chapeus[v]]; })),
        eyes: [['default', 'Normais'], ['happy', 'Sorrindo'], ['wink', 'Piscando'], ['squint', 'Apertados'], ['side', 'De lado'], ['surprised', 'Surpresos'], ['hearts', 'Corações'], ['closed', 'Fechados']],
        eyebrows: [['default', 'Normais'], ['defaultNatural', 'Naturais'], ['raisedExcited', 'Animadas'], ['raisedExcitedNatural', 'Animadas naturais'], ['flatNatural', 'Retas'], ['upDown', 'Uma levantada'], ['unibrowNatural', 'Monocelha']],
        mouth: [['smile', 'Sorriso'], ['default', 'Leve'], ['twinkle', 'Sorriso de canto'], ['tongue', 'Língua'], ['serious', 'Séria'], ['eating', 'Comendo'], ['disbelief', 'Espanto']],
        facialHair: [['nenhuma', 'Sem barba'], ['beardLight', 'Barba rala'], ['beardMedium', 'Barba média'], ['beardMajestic', 'Barba cheia'], ['moustacheFancy', 'Bigode fino'], ['moustacheMagnum', 'Bigodão']],
        clothing: [['shirtCrewNeck', 'Camiseta'], ['shirtVNeck', 'Gola V'], ['shirtScoopNeck', 'Gola canoa'], ['graphicShirt', 'Camiseta estampada'], ['hoodie', 'Moletom'], ['collarAndSweater', 'Suéter com gola'], ['blazerAndShirt', 'Blazer e camisa'], ['blazerAndSweater', 'Blazer e suéter'], ['overall', 'Macacão']],
        clothingGraphic: [['bear', 'Urso'], ['deer', 'Cervo'], ['diamond', 'Diamante'], ['pizza', 'Pizza'], ['hola', 'Hola'], ['bat', 'Morcego'], ['cumbia', 'Cumbia']],
        accessories: [['nenhum', 'Sem óculos'], ['prescription01', 'Grau 1'], ['prescription02', 'Grau 2'], ['round', 'Redondos'], ['kurt', 'Retrô'], ['wayfarers', 'Clássicos'], ['sunglasses', 'De sol']]
      };
    },
    padrao: { top: 'shortFlat', eyes: 'default', eyebrows: 'default', mouth: 'smile', facialHair: 'nenhuma', clothing: 'hoodie', clothingGraphic: 'bear', accessories: 'nenhum' },
    feliz: { eyes: 'happy', mouth: 'smile', eyebrows: 'raisedExcited' },
    desenhar: function (c, p) {
      var L = window.AVLIB;
      return L.dicebear(L.estilos.avataaars, {
        seed: 'av', top: [p.top === 'nenhum' ? 'shortFlat' : p.top], topProbability: p.top === 'nenhum' ? 0 : 100,
        hairColor: [c.cabelo], hatColor: [c.detalhe], skinColor: [c.pele],
        eyes: [p.eyes], eyebrows: [p.eyebrows], mouth: [p.mouth],
        facialHair: [p.facialHair === 'nenhuma' ? 'beardLight' : p.facialHair], facialHairProbability: p.facialHair === 'nenhuma' ? 0 : 100, facialHairColor: [c.cabelo],
        clothing: [p.clothing], clothesColor: [c.roupa], clothingGraphic: [p.clothingGraphic],
        accessories: [p.accessories === 'nenhum' ? 'round' : p.accessories], accessoriesProbability: p.accessories === 'nenhum' ? 0 : 100, accessoriesColor: [c.detalhe],
        backgroundColor: [c.fundo], translateY: 4
      }).toDataUri();
    }
  },
  toon: {
    nome: 'Toon', credito: 'Toon Head, de Johan Melin (CC BY 4.0)',
    abas: [
      ['Cabelo', [['hair', 'Topo', 'partes'], ['rearHair', 'Comprimento', 'partes'], ['cabelo', 'Cor do cabelo', 'cor']]],
      ['Pele', [['pele', 'Tom de pele', 'cor']]],
      ['Rosto', [['eyes', 'Olhos', 'partes'], ['eyebrows', 'Sobrancelhas', 'partes'], ['mouth', 'Boca', 'partes']]],
      ['Barba', [['beard', 'Barba e bigode', 'partes']]],
      ['Roupa', [['clothes', 'Peça', 'partes'], ['roupa', 'Cor da roupa', 'cor']]],
      ['Fundo', [['fundo', 'Cor de fundo', 'cor']]]
    ],
    partes: function () {
      return {
        hair: [['nenhum', 'Careca'], ['sideComed', 'Penteado de lado'], ['undercut', 'Undercut'], ['spiky', 'Espetado'], ['bun', 'Coque']],
        rearHair: [['nenhum', 'Curto'], ['neckHigh', 'Até o pescoço'], ['shoulderHigh', 'Até o ombro'], ['longStraight', 'Longo liso'], ['longWavy', 'Longo ondulado']],
        eyes: [['happy', 'Sorrindo'], ['wide', 'Abertos'], ['humble', 'Tranquilos'], ['wink', 'Piscando'], ['bow', 'Fechados']],
        eyebrows: [['neutral', 'Normais'], ['happy', 'Alegres'], ['raised', 'Levantadas'], ['sad', 'Preocupadas']],
        mouth: [['smile', 'Sorriso'], ['laugh', 'Risada'], ['agape', 'Boca aberta']],
        beard: [['nenhuma', 'Sem barba'], ['chin', 'Cavanhaque'], ['chinMoustache', 'Cavanhaque e bigode'], ['moustacheTwirl', 'Bigode enrolado'], ['fullBeard', 'Barba cheia'], ['longBeard', 'Barba longa']],
        clothes: [['tShirt', 'Camiseta'], ['shirt', 'Camisa'], ['turtleNeck', 'Gola alta'], ['openJacket', 'Jaqueta aberta'], ['dress', 'Vestido']]
      };
    },
    padrao: { hair: 'sideComed', rearHair: 'nenhum', eyes: 'happy', eyebrows: 'neutral', mouth: 'smile', beard: 'nenhuma', clothes: 'tShirt' },
    feliz: { eyes: 'happy', mouth: 'laugh', eyebrows: 'happy' },
    desenhar: function (c, p) {
      var L = window.AVLIB;
      return L.dicebear(L.estilos.toonHead, {
        seed: 'av', hair: [p.hair === 'nenhum' ? 'undercut' : p.hair], hairProbability: p.hair === 'nenhum' ? 0 : 100,
        rearHair: [p.rearHair === 'nenhum' ? 'neckHigh' : p.rearHair], rearHairProbability: p.rearHair === 'nenhum' ? 0 : 100,
        hairColor: [c.cabelo], skinColor: [c.pele], eyes: [p.eyes], eyebrows: [p.eyebrows], mouth: [p.mouth],
        beard: [p.beard === 'nenhuma' ? 'chin' : p.beard], beardProbability: p.beard === 'nenhuma' ? 0 : 100,
        clothes: [p.clothes], clothesColor: [c.roupa], backgroundColor: [c.fundo]
      }).toDataUri();
    }
  },
  personas: {
    nome: 'Personas', credito: 'Personas, de Draftbit (CC BY 4.0)',
    abas: [
      ['Cabelo', [['hair', 'Cabelo ou chapéu', 'partes'], ['cabelo', 'Cor do cabelo', 'cor']]],
      ['Pele', [['pele', 'Tom de pele', 'cor']]],
      ['Rosto', [['eyes', 'Olhos', 'partes'], ['mouth', 'Boca', 'partes'], ['nose', 'Nariz', 'partes']]],
      ['Barba', [['facialHair', 'Barba e bigode', 'partes']]],
      ['Roupa', [['body', 'Peça', 'partes'], ['roupa', 'Cor da roupa', 'cor']]],
      ['Fundo', [['fundo', 'Cor de fundo', 'cor']]]
    ],
    partes: function () {
      return {
        hair: [['shortCombover', 'Curto de lado'], ['shortComboverChops', 'Curto com costeletas'], ['fade', 'Degradê'], ['buzzcut', 'Raspado'], ['curlyHighTop', 'Black power alto'], ['curly', 'Cacheado'], ['mohawk', 'Moicano'], ['sideShave', 'Raspado de um lado'], ['bobCut', 'Chanel'], ['bobBangs', 'Chanel com franja'], ['long', 'Longo'], ['extraLong', 'Bem longo'], ['pigtails', 'Maria-chiquinha'], ['curlyBun', 'Coque cacheado'], ['straightBun', 'Coque liso'], ['bunUndercut', 'Coque com undercut'], ['balding', 'Entradas'], ['bald', 'Careca'], ['cap', 'Boné'], ['beanie', 'Gorro']],
        eyes: [['open', 'Abertos'], ['happy', 'Sorrindo'], ['wink', 'Piscando'], ['sleep', 'Fechados'], ['glasses', 'De óculos'], ['sunglasses', 'Óculos escuros']],
        mouth: [['smile', 'Sorriso'], ['bigSmile', 'Sorrisão'], ['smirk', 'De canto'], ['lips', 'Lábios'], ['surprise', 'Surpresa'], ['frown', 'Sério']],
        nose: [['mediumRound', 'Médio'], ['smallRound', 'Pequeno'], ['wrinkles', 'Marcado']],
        facialHair: [['nenhuma', 'Sem barba'], ['shadow', 'Por fazer'], ['goatee', 'Cavanhaque'], ['soulPatch', 'Mosca'], ['beardMustache', 'Barba e bigode'], ['pyramid', 'Bigode largo'], ['walrus', 'Bigodão']],
        body: [['rounded', 'Camiseta'], ['squared', 'Gola reta'], ['small', 'Regata'], ['checkered', 'Xadrez']]
      };
    },
    padrao: { hair: 'shortCombover', eyes: 'open', mouth: 'smile', nose: 'mediumRound', facialHair: 'nenhuma', body: 'rounded' },
    feliz: { eyes: 'happy', mouth: 'bigSmile' },
    desenhar: function (c, p) {
      var L = window.AVLIB;
      return L.dicebear(L.estilos.personas, {
        seed: 'av', hair: [p.hair], hairColor: [c.cabelo], skinColor: [c.pele], eyes: [p.eyes], mouth: [p.mouth], nose: [p.nose],
        facialHair: [p.facialHair === 'nenhuma' ? 'shadow' : p.facialHair], facialHairProbability: p.facialHair === 'nenhuma' ? 0 : 100,
        body: [p.body], clothingColor: [c.roupa], backgroundColor: [c.fundo]
      }).toDataUri();
    }
  }
};

var AVATAR_PADRAO = { estilo: 'traco', pele: 'edb98a', cabelo: '2c1b18', roupa: '3fc2ab', detalhe: '262e33', fundo: 'cdeee6', por: {} };

/* completa o que falta (peças de um estilo que a pessoa ainda não abriu, perfis antigos) */
function avatarNormalizar(cfg) {
  var c = JSON.parse(JSON.stringify(cfg || {}));
  if (!c.estilo || !AV_ESTILOS[c.estilo]) c = JSON.parse(JSON.stringify(AVATAR_PADRAO)); /* perfil do desenho antigo: recomeça no padrão */
  ['pele', 'cabelo', 'roupa', 'detalhe', 'fundo'].forEach(function (k) { if (!c[k]) c[k] = AVATAR_PADRAO[k]; });
  c.por = c.por || {};
  Object.keys(AV_ESTILOS).forEach(function (k) { c.por[k] = Object.assign({}, AV_ESTILOS[k].padrao, c.por[k] || {}); });
  return c;
}

var AV_CACHE = {};
var AV_PARTES = {};
function avatarPartes(estilo) { return AV_PARTES[estilo] || (AV_PARTES[estilo] = AV_ESTILOS[estilo].partes()); }

/* devolve a imagem (data URI) do personagem; humor 'feliz' troca olhos e boca nos estilos que têm expressão */
function avatarURI(cfg, humor, estiloForcado) {
  var c = avatarNormalizar(cfg), e = estiloForcado || c.estilo, st = AV_ESTILOS[e];
  var p = Object.assign({}, c.por[e], humor === 'feliz' && st.feliz ? st.feliz : {});
  var chave = e + '|' + c.pele + c.cabelo + c.roupa + c.detalhe + c.fundo + '|' + JSON.stringify(p);
  if (!AV_CACHE[chave]) { try { AV_CACHE[chave] = st.desenhar(c, p); } catch (err) { AV_CACHE[chave] = ''; } }
  return AV_CACHE[chave];
}
function avatarImg(cfg, humor, estiloForcado) {
  var e = estiloForcado || avatarNormalizar(cfg).estilo;
  return '<img alt="" class="av-img av-' + e + '" src="' + avatarURI(cfg, humor, estiloForcado) + '">';
}
function avatarMix(hex, alvo, t) {
  var a = parseInt(hex.replace('#', ''), 16), b = parseInt(alvo.replace('#', ''), 16);
  var m = function (s) { return Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); };
  return 'rgb(' + m(16) + ',' + m(8) + ',' + m(0) + ')';
}

function avatarAleatorio(cfg) {
  var c = avatarNormalizar(cfg), e = c.estilo, P = avatarPartes(e), r = function (l) { return l[Math.floor(Math.random() * l.length)][0]; };
  ['pele', 'cabelo', 'roupa', 'detalhe', 'fundo'].forEach(function (k) { c[k] = r(AV_CORES[k]); });
  if (Math.random() < .8) c.cabelo = r(AV_CORES.cabelo.slice(0, 7)); /* cores de cabelo naturais na maioria das vezes */
  c.fundo = r(AV_CORES.fundo.slice(0, 6));
  Object.keys(P).forEach(function (k) { c.por[e][k] = r(P[k]); });
  if (e === 'traco' && Math.random() < .5) c.por.traco.item = 'none';
  if (e === 'traco' && Math.random() < .7) c.por.traco.glasses = 'none';
  if (e === 'classico' && Math.random() < .6) c.por.classico.accessories = 'nenhum';
  return c;
}


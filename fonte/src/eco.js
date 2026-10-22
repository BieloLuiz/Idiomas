/*!
 * Eco — a parceira de estudo do Idiomas, em SVG.
 *
 * Uso:
 *   const eco = Eco.criar(document.querySelector('#eco'));
 *   eco.estado('happy');            // reação curta; depois volta ao estado de base
 *   eco.estado('listening');        // estado de base (fica até trocar)
 *   eco.conectarAudio(audioEl);     // speaking/listening seguem o volume do áudio
 *   eco.seguirPonteiro(true);       // olhos seguem o dedo/mouse
 *   eco.pausar(); eco.retomar();    // nada se mexe enquanto a pessoa lê ou escreve
 *   Eco.criar(el, { estilo: '2.5d' }) // versão com volume e profundidade
 *   eco.sequencia(12);              // estrela da sequência de dias (0 esconde)
 *   Eco.abertura({ nome: 'Ana' })   // { estado, frase } conforme a hora (sono depois das 22h)
 *   Eco.frase('dupla', { nomes: ['Ana', 'Bia'] })  // os dois estudaram hoje
 *
 * Reações entram numa fila: uma por vez; iguais seguidas viram uma só; surprise interrompe.
 *
 * Estados de base (ficam): neutral, thinking, reading, listening, speaking, sleepy
 * Reações (cerca de 1,5 s; surprise 0,5 s; depois voltam à base): happy, celebrate, confused, surprise, wave
 *   eco.estado('celebrate', { grande: true })  → versão maior, para fim de nível
 *
 * Cores: variáveis CSS no elemento que contém a Eco (ou em :root):
 *   --eco-corpo, --eco-corpo-sombra, --eco-borda, --eco-viseira, --eco-rosto,
 *   --eco-bochecha, --eco-chao, --eco-dourado e --eco-luz-<estado>.
 */
(function (global) {
  'use strict';

  var BASES = ['neutral', 'thinking', 'reading', 'listening', 'speaking', 'sleepy'];
  var REACOES = ['happy', 'celebrate', 'confused', 'surprise', 'wave'];
  var LUZ = { // cor da antena por estado (paleta do app)
    neutral: 'dourado', happy: 'verde', celebrate: 'verde', confused: 'caramelo',
    thinking: 'lilas', reading: 'leitura', listening: 'azul', speaking: 'agua', surprise: 'dourado',
    wave: 'dourado', sleepy: 'apagada'
  };
  var CSS = '' +
    '.eco-svg{--eco-corpo:#5B6FD2;--eco-corpo-sombra:#4153B4;--eco-borda:#8F9EE6;--eco-viseira:#18243D;' +
    '--eco-rosto:#C5F4D3;--eco-bochecha:#FF8FB8;--eco-chao:#1F2937;--eco-dourado:#F3C26C;' +
    '--eco-luz-dourado:var(--eco-dourado);--eco-luz-verde:#6FBF8E;--eco-luz-caramelo:#D9A06B;' +
    '--eco-luz-lilas:#A18ADB;--eco-luz-leitura:#9DB0E8;--eco-luz-azul:#7298E3;--eco-luz-agua:#63BFC4;--eco-luz-apagada:#4B527A;' +
    'display:block;width:100%;height:auto;overflow:visible}' +
    '.eco-svg .ani{transform-box:fill-box}' +
    '.eco-svg .t{transition:opacity .14s ease}' +
    '.eco-svg [data-o="0"]{opacity:0}' +
    '.eco-svg .luz-c{transition:stop-color .25s ease}' +
    '.eco-svg .p{transition:transform .55s cubic-bezier(.34,1.45,.6,1)}';

  var contador = 0;

  function svg(id, e25) {
    var g = 'eco-luz-' + id, d = 'eco-corpo-' + id, k = 'eco-k-' + id;
    var corpo = 'M100 44C140 44 168 86 170 132C172 178 142 206 100 206C58 206 28 178 30 132C32 86 60 44 100 44Z';
    var estrela = function (x, y, r) {
      return 'M' + x + ' ' + (y - r) + 'l' + r * .28 + ' ' + r * .72 + 'l' + r * .72 + ' ' + r * .28 + 'l' + -r * .72 + ' ' + r * .28 +
        'l' + -r * .28 + ' ' + r * .72 + 'l' + -r * .28 + ' ' + -r * .72 + 'l' + -r * .72 + ' ' + -r * .28 + 'l' + r * .72 + ' ' + -r * .28 + 'Z';
    };
    var confete = '';
    var cores = ['#FF8FB8', '#F3C26C', '#6FBF8E', '#7298E3', '#A18ADB'];
    for (var i = 0; i < 10; i++) {
      confete += '<rect class="cf" data-o="0" x="97" y="30" width="7" height="3.5" rx="1" fill="' + cores[i % 5] + '"/>';
    }
    var stop = function (o, cor, op) { return '<stop offset="' + o + '" style="stop-color:' + cor + (op !== undefined ? ';stop-opacity:' + op : '') + '"/>'; };
    // ---- peças que mudam entre plano e 2.5D ----
    var defs, sombra, braco, corpoEl, brilho, borda, viseira, reflexo, brilhoOlhos = '', especular = '';
    if (e25) {
      defs =
        '<radialGradient id="' + d + '" cx=".34" cy=".28" r=".82">' + stop(0, '#8C9DF0') + stop(.42, 'var(--eco-corpo)') + stop(.86, 'var(--eco-corpo-sombra)') + stop(1, '#2E3A8C') + '</radialGradient>' +
        '<radialGradient id="' + k + 'b" cx=".32" cy=".3" r=".8">' + stop(0, '#7A8CE4') + stop(1, 'var(--eco-corpo-sombra)') + '</radialGradient>' +
        '<linearGradient id="' + k + 'r" x1="0" y1="0" x2="1" y2="0">' + stop(.55, '#C9D2FF', 0) + stop(1, '#C9D2FF', .7) + '</linearGradient>' +
        '<radialGradient id="' + k + 'o" cx=".5" cy=".5" r=".5">' + stop(0, '#151C4D', .38) + stop(1, '#151C4D', 0) + '</radialGradient>' +
        '<linearGradient id="' + k + 'v" x1="0" y1="0" x2="0" y2="1">' + stop(0, '#2C3C66') + stop(.55, 'var(--eco-viseira)') + stop(1, '#0E1527') + '</linearGradient>' +
        '<linearGradient id="' + k + 'e" x1="0" y1="0" x2="0" y2="1">' + stop(0, '#C3CCFF') + stop(1, '#7484D6') + '</linearGradient>' +
        '<radialGradient id="' + k + 'g" cx=".5" cy=".5" r=".5">' + stop(0, 'var(--eco-rosto)', .42) + stop(1, 'var(--eco-rosto)', 0) + '</radialGradient>' +
        '<radialGradient id="' + k + 's" cx=".5" cy=".5" r=".5">' + stop(0, 'var(--eco-chao)', .3) + stop(1, 'var(--eco-chao)', 0) + '</radialGradient>' +
        '<clipPath id="' + k + 'c"><path d="' + corpo + '"/></clipPath>';
      sombra = '<g class="sombra"><ellipse cx="100" cy="214" rx="66" ry="9" fill="url(#' + k + 's)"/><ellipse cx="100" cy="213" rx="40" ry="3.6" style="fill:var(--eco-chao)" opacity=".16"/></g>';
      braco = 'url(#' + k + 'b)';
      corpoEl = '<path class="corpo" d="' + corpo + '" fill="url(#' + d + ')"/>' +
        '<g clip-path="url(#' + k + 'c)">' +
        '<ellipse cx="100" cy="204" rx="70" ry="22" fill="url(#' + k + 'o)"/>' +              // sombra interna embaixo
        '<ellipse cx="33" cy="154" rx="16" ry="24" fill="url(#' + k + 'o)"/><ellipse cx="167" cy="154" rx="16" ry="24" fill="url(#' + k + 'o)"/>' + // oclusão dos braços
        '<path d="' + corpo + '" fill="none" stroke="url(#' + k + 'r)" stroke-width="7"/>' +  // luz de contorno
        '</g>';
      brilho = '<g class="brilho-p p"><ellipse class="brilho" cx="70" cy="76" rx="20" ry="11" transform="rotate(-32 70 76)" fill="#fff" opacity=".3"/>' +
        '<ellipse cx="60" cy="92" rx="5" ry="3" transform="rotate(-32 60 92)" fill="#fff" opacity=".22"/></g>';
      borda = '<rect x="48" y="88" width="104" height="70" rx="28" fill="url(#' + k + 'e)"/>';
      viseira = '<rect class="viseira" x="52" y="92" width="96" height="62" rx="24" fill="url(#' + k + 'v)"/>';
      reflexo = '<path d="M62 112C63 102 70 97 84 96" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".22"/>' +
        '<circle cx="92" cy="96.5" r="2" fill="#fff" opacity=".2"/>' +
        '<path d="M70 150.5h60" stroke="#B7C2FF" stroke-width="1.6" stroke-linecap="round" opacity=".28"/>';
      brilhoOlhos = '<g class="olhos-brilho"><ellipse cx="82" cy="118" rx="15" ry="21" fill="url(#' + k + 'g)"/><ellipse cx="118" cy="118" rx="15" ry="21" fill="url(#' + k + 'g)"/></g>';
      especular = '<circle cx="106.5" cy="11" r="2.8" fill="#fff" opacity=".75"/>';
    } else {
      defs = '<linearGradient id="' + d + '" x1="0" y1="0" x2="0" y2="1">' + stop(0, 'var(--eco-corpo)') + stop(1, 'var(--eco-corpo-sombra)') + '</linearGradient>';
      sombra = '<ellipse class="sombra" cx="100" cy="214" rx="56" ry="5.5" style="fill:var(--eco-chao)" opacity=".14"/>';
      braco = 'var(--eco-corpo-sombra)';
      corpoEl = '<path class="corpo" d="' + corpo + '" fill="url(#' + d + ')"/>';
      brilho = '<g class="brilho-p p"><ellipse class="brilho" cx="72" cy="78" rx="18" ry="10" transform="rotate(-32 72 78)" fill="#fff" opacity=".22"/></g>';
      borda = '<rect x="48" y="88" width="104" height="70" rx="28" style="fill:var(--eco-borda)"/>';
      viseira = '<rect class="viseira" x="52" y="92" width="96" height="62" rx="24" style="fill:var(--eco-viseira)"/>';
      reflexo = '<path d="M64 100h22" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".16"/>';
    }
    var bracoFill = braco.indexOf('url') === 0 ? 'fill="' + braco + '"' : 'style="fill:' + braco + '"';
    return '' +
      '<svg class="eco-svg' + (e25 ? ' eco-25' : '') + '" viewBox="-40 -40 280 280" role="img" aria-label="Eco" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' + defs +
      '<radialGradient id="' + g + '" cx=".38" cy=".36" r=".7"><stop class="luz-c luz-c1" offset="0" style="stop-color:#fff"/><stop class="luz-c luz-c2" offset="1" style="stop-color:var(--eco-dourado)"/></radialGradient>' +
      '</defs>' + sombra +
      '<g class="pulo"><g class="respira">' +
      '<g class="antena-p p"><g class="antena"><path d="M98 50C96 36 100 26 108 18" fill="none" style="stroke:var(--eco-corpo)" stroke-width="7" stroke-linecap="round"/>' +
      '<circle class="anel t" data-o="0" cx="110" cy="15" r="15" fill="none" stroke-width="2.5" style="stroke:var(--eco-luz-azul)"/>' +
      '<circle class="luz" cx="110" cy="15" r="10" fill="url(#' + g + ')"/>' + especular + '</g></g>' +
      '<g class="bracos-p p">' +
      '<g class="braco-e"><ellipse cx="34" cy="160" rx="13" ry="20" transform="rotate(28 34 160)" ' + bracoFill + '/></g>' +
      '<g class="braco-d"><ellipse cx="166" cy="160" rx="13" ry="20" transform="rotate(-28 166 160)" ' + bracoFill + '/></g></g>' +
      corpoEl + brilho +
      '<g class="rosto p">' + borda + viseira + reflexo +
      '<g class="bochechas t" data-o="0" style="fill:var(--eco-bochecha)"><ellipse cx="70" cy="139" rx="8" ry="4.2"/><ellipse cx="130" cy="139" rx="8" ry="4.2"/></g>' +
      '<g class="olhos"><g class="olhos-alvo">' + brilhoOlhos +
      '<g class="olhos-pilula t" style="fill:var(--eco-rosto)"><rect x="76" y="106" width="12" height="24" rx="6"/><rect x="112" y="106" width="12" height="24" rx="6"/></g>' +
      '<g class="olhos-feliz t" data-o="0" fill="none" style="stroke:var(--eco-rosto)" stroke-width="4.5" stroke-linecap="round"><path d="M75 122Q82 111 89 122"/><path d="M111 122Q118 111 125 122"/></g>' +
      '<g class="olhos-dormindo t" data-o="0" fill="none" style="stroke:var(--eco-rosto)" stroke-width="4" stroke-linecap="round"><path d="M75 120h13"/><path d="M112 120h13"/></g>' +
      '</g></g>' +
      '<g class="boca" fill="none" style="stroke:var(--eco-rosto)" stroke-width="3.6" stroke-linecap="round">' +
      '<path class="b-sorriso t" d="M90 140Q100 147 110 140"/>' +
      '<path class="b-reta t" data-o="0" d="M92 142h14"/>' +
      '<ellipse class="b-fala t" data-o="0" cx="100" cy="142" rx="6" ry="1.5" style="fill:var(--eco-rosto)" stroke="none"/>' +
      '<ellipse class="b-o t" data-o="0" cx="100" cy="142" rx="4.2" ry="5.2" stroke-width="3"/>' +
      '</g></g>' +
      '</g></g>' +
      '<g class="pontos t" data-o="0" style="fill:var(--eco-luz-lilas)"><circle cx="150" cy="22" r="5"/><circle cx="166" cy="14" r="5"/><circle cx="182" cy="6" r="5"/></g>' +
      '<g class="zzz t" data-o="0" fill="none" style="stroke:var(--eco-borda)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="z1" d="M138 30h10l-10 11h10"/><path class="z2" d="M156 12h13l-13 14h13"/></g>' +
      '<g class="sequencia t" data-o="0" style="fill:var(--eco-dourado)"><path class="seq-estrela" d="' + estrela(82, 14, 10) + '"/></g>' +
      '<g class="brilhos" style="fill:var(--eco-dourado)">' +
      '<path class="br" data-o="0" d="' + estrela(14, 70, 9) + '"/><path class="br" data-o="0" d="' + estrela(188, 82, 8) + '"/>' +
      '<path class="br" data-o="0" d="' + estrela(30, 22, 6) + '"/><path class="br" data-o="0" d="' + estrela(176, 166, 7) + '"/></g>' +
      '<g class="confete">' + confete + '</g>' +
      '</svg>';
  }

  function injetarCSS() {
    if (document.getElementById('eco-estilo')) return;
    var s = document.createElement('style');
    s.id = 'eco-estilo';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function criar(alvo, opcoes) {
    opcoes = opcoes || {};
    injetarCSS();
    var id = ++contador;
    var e25 = opcoes.estilo === '2.5d';
    alvo.innerHTML = svg(id, e25);
    var raiz = alvo.querySelector('svg');
    if (opcoes.justo) raiz.setAttribute('viewBox', '0 -2 200 222');
    var q = function (s) { return raiz.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(raiz.querySelectorAll(s)); };
    var el = {
      pulo: q('.pulo'), respira: q('.respira'), antena: q('.antena'), anel: q('.anel'),
      luzC1: q('.luz-c1'), luzC2: q('.luz-c2'), bracoE: q('.braco-e'), bracoD: q('.braco-d'),
      olhos: q('.olhos'), alvo: q('.olhos-alvo'), pilula: q('.olhos-pilula'), feliz: q('.olhos-feliz'),
      dormindo: q('.olhos-dormindo'), bochechas: q('.bochechas'), sorriso: q('.b-sorriso'), reta: q('.b-reta'),
      fala: q('.b-fala'), bocaO: q('.b-o'), pontos: q('.pontos'), zzz: q('.zzz'), sombra: q('.sombra'),
      brilhos: qa('.br'), confete: qa('.cf'), seq: q('.sequencia'), seqEstrela: q('.seq-estrela'),
      rosto: q('.rosto'), antenaP: q('.antena-p'), bracosP: q('.bracos-p'), brilhoP: q('.brilho-p')
    };
    // só as peças animadas medem o giro pela própria caixa (as outras mantêm as
    // rotações fixas do desenho no espaço normal do SVG)
    [el.pulo, el.respira, el.antena, el.anel, el.bracoE, el.bracoD, el.olhos, el.alvo, el.pilula, el.sombra, el.fala, el.pontos, el.zzz, el.seq, el.seqEstrela]
      .concat(el.brilhos, el.confete, qa('.pontos circle'), qa('.zzz path'))
      .forEach(function (n) { n.classList.add('ani'); });
    // pontos de giro (relativos à própria caixa de cada peça)
    el.pulo.style.transformOrigin = '50% 100%';
    el.respira.style.transformOrigin = '50% 100%';
    el.antena.style.transformOrigin = '15% 100%';
    el.bracoE.style.transformOrigin = '78% 12%';
    el.bracoD.style.transformOrigin = '22% 12%';
    el.pilula.style.transformOrigin = '50% 50%';
    el.sombra.style.transformOrigin = '50% 50%';
    el.anel.style.transformOrigin = '50% 50%';
    el.fala.style.transformOrigin = '50% 50%';
    el.brilhos.concat([el.pontos, el.seq, el.seqEstrela]).forEach(function (b) { b.style.transformOrigin = '50% 50%'; });

    var mq = global.matchMedia ? global.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var forcarReduzir = null;
    var base = 'neutral', atual = 'neutral', pausado = false, reagindo = false, fila = [], seqDias = 0, raf = 0;
    var anims = [], laco = [], timers = [];
    var nivel = 0, nivelAlvo = 0, simular = !!opcoes.simularVoz, fonte = null, analisador = null, dados = null, ctx = null;
    var ponteiro = { x: 0, y: 0 }, seguindo = false, olharEstado = [0, 0];

    function reduzir() { return forcarReduzir !== null ? forcarReduzir : mq.matches; }
    function mostra(n, sim) { n.setAttribute('data-o', sim ? '1' : '0'); }
    function animar(n, kf, o, lacoFlag) {
      if (reduzir() || !n.animate) return null;
      var a = n.animate(kf, Object.assign({ fill: lacoFlag ? 'none' : 'forwards', easing: 'cubic-bezier(.3,.7,.3,1)' }, o));
      (lacoFlag ? laco : anims).push(a);
      return a;
    }
    function depois(ms, fn) { timers.push(setTimeout(fn, reduzir() ? Math.min(ms, 400) : ms)); }
    function limpar(tudo) {
      anims.forEach(function (a) { a.cancel(); }); anims = [];
      laco.forEach(function (a) { a.cancel(); }); laco = [];
      timers.forEach(clearTimeout); timers = [];
      if (tudo) { el.brilhos.concat(el.confete).forEach(function (b) { mostra(b, false); }); }
    }

    function luz(nome) {
      var cor = 'var(--eco-luz-' + nome + ')';
      el.luzC2.style.stopColor = cor;
      el.luzC1.style.stopColor = nome === 'apagada' ? cor : 'color-mix(in srgb, ' + cor + ' 45%, #fff)';
    }
    function rosto(r) {
      r = r || {};
      var olhos = r.olhos || 'pilula';
      mostra(el.pilula, olhos === 'pilula'); mostra(el.feliz, olhos === 'feliz'); mostra(el.dormindo, olhos === 'dormindo');
      el.pilula.style.transform = r.olhosEscala ? 'scale(' + r.olhosEscala + ')' : '';
      var boca = r.boca || 'sorriso';
      mostra(el.sorriso, boca === 'sorriso'); mostra(el.reta, boca === 'reta'); mostra(el.fala, boca === 'fala'); mostra(el.bocaO, boca === 'o');
      mostra(el.bochechas, !!r.bochechas);
      olharEstado = r.olhar || [0, 0];
      aplicarOlhar();
    }
    function aplicarOlhar() {
      var dx = olharEstado[0], dy = olharEstado[1];
      if (seguindo && (atual === 'neutral' || atual === 'listening' || atual === 'speaking' || atual === 'reading')) {
        dx += ponteiro.x; dy += ponteiro.y;
      }
      el.olhos.style.transform = 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px)';
      if (e25 && !reduzir()) {
        // profundidade: o rosto (na frente) anda mais; antena, braços e brilho reagem como camadas
        var px = function (k, x, y) { return 'translate(' + (x * k).toFixed(2) + 'px,' + (y * k).toFixed(2) + 'px)'; };
        el.rosto.style.transform = px(.9, dx, dy * .8);
        el.brilhoP.style.transform = px(-.55, dx, dy);
        el.antenaP.style.transform = px(.35, dx, 0);
        el.bracosP.style.transform = px(-.3, dx, dy * .3);
      }
    }

    // ---------- piscar (só nos estados calmos) ----------
    function agendarPiscada() {
      depois(3000 + Math.random() * 3000, function () {
        if (!pausado && (atual === 'neutral' || atual === 'listening' || atual === 'speaking')) {
          animar(el.pilula, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.12)' }, { transform: 'scaleY(1)' }], { duration: 180, easing: 'ease-in-out' });
        }
        agendarPiscada();
      });
    }

    // ---------- estados de base ----------
    var BASE = {
      neutral: function () {
        luz('dourado'); rosto({});
        animar(el.respira, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.012,1.022)' }, { transform: 'scale(1,1)' }], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }, true);
        agendarPiscada(); agendarMicro();
      },
      thinking: function () {
        luz('lilas'); rosto({ boca: 'reta', olhar: [-3.5, -4] });
        mostra(el.pontos, true);
        qa('.pontos circle').forEach(function (c, i) {
          c.style.transformOrigin = '50% 50%'; c.style.transformBox = 'fill-box';
          animar(c, [{ transform: 'translateY(0)', opacity: .35 }, { transform: 'translateY(-5px)', opacity: 1 }, { transform: 'translateY(0)', opacity: .35 }],
            { duration: 900, delay: i * 150, iterations: Infinity, easing: 'ease-in-out' }, true);
        });
        animar(el.antena.querySelector('.luz'), [{ opacity: 1 }, { opacity: .55 }, { opacity: 1 }], { duration: 1400, iterations: Infinity, easing: 'ease-in-out' }, true);
      },
      reading: function () {
        luz('leitura'); rosto({ boca: 'reta', olhar: [0, 1.5] });
        animar(el.pulo, [{ transform: 'none' }, { transform: 'translateY(-1px) scale(1.02)' }], { duration: 300, easing: 'ease-out' });
        // olhos correm a linha da esquerda para a direita e voltam para a próxima
        animar(el.alvo, [{ transform: 'translate(-6px,-2px)' }, { transform: 'translate(6px,-2px)', offset: .42 }, { transform: 'translate(-6px,1px)', offset: .5 },
          { transform: 'translate(6px,1px)', offset: .92 }, { transform: 'translate(-6px,-2px)' }], { duration: 2600, iterations: Infinity, easing: 'linear' }, true);
      },
      listening: function () {
        luz('azul'); rosto({ olhosEscala: 1.12 });
        mostra(el.anel, true);
        animar(el.pulo, [{ transform: 'none' }, { transform: 'translateY(-2px) scale(1.03)' }], { duration: 260, easing: 'ease-out' });
        agendarPiscada();
      },
      speaking: function () {
        luz('agua'); rosto({ boca: 'fala' });
        agendarPiscada();
      },
      sleepy: function () {
        luz('apagada'); rosto({ olhos: 'dormindo', boca: 'reta' });
        mostra(el.zzz, true);
        animar(el.respira, [{ transform: 'scale(1,.985)' }, { transform: 'scale(1.01,1.02)' }, { transform: 'scale(1,.985)' }], { duration: 4200, iterations: Infinity, easing: 'ease-in-out' }, true);
        animar(el.antena, [{ transform: 'rotate(10deg)' }, { transform: 'rotate(13deg)' }, { transform: 'rotate(10deg)' }], { duration: 4200, iterations: Infinity, easing: 'ease-in-out' }, true);
        [qa('.z1')[0], qa('.z2')[0]].forEach(function (z, i) {
          z.style.transformBox = 'fill-box'; z.style.transformOrigin = '50% 50%';
          animar(z, [{ transform: 'translate(-6px,8px) scale(.6)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translate(6px,-8px) scale(1)', opacity: 0 }],
            { duration: 2600, delay: i * 1300, iterations: Infinity, easing: 'ease-out' }, true);
        });
      }
    };

    // ---------- reações (< 1 s) ----------
    function balancoAntena(f, ms) {
      animar(el.antena, [{ transform: 'rotate(0)' }, { transform: 'rotate(' + -10 * f + 'deg)', offset: .25 }, { transform: 'rotate(' + 12 * f + 'deg)', offset: .5 },
        { transform: 'rotate(' + -5 * f + 'deg)', offset: .72 }, { transform: 'rotate(0)' }], { duration: ms || 1300, easing: 'ease-out' });
    }
    function sombra(ms, min) {
      animar(el.sombra, [{ transform: 'scale(1)', opacity: .14 }, { transform: 'scale(' + min + ')', opacity: .08, offset: .45 }, { transform: 'scale(1.06)', opacity: .14, offset: .7 }, { transform: 'scale(1)', opacity: .14 }], { duration: ms });
    }
    function brilhar(atraso) {
      el.brilhos.forEach(function (b, i) {
        mostra(b, true);
        var a = animar(b, [{ transform: 'scale(0) rotate(0)', opacity: 0 }, { transform: 'scale(1.2) rotate(40deg)', opacity: 1, offset: .4 }, { transform: 'scale(0) rotate(80deg)', opacity: 0 }],
          { duration: 520, delay: atraso + i * 70 });
        if (!a) mostra(b, false);
      });
    }
    function confetes(grande) {
      el.confete.forEach(function (c, i) {
        var ang = Math.PI * (0.08 + 0.84 * i / 9);
        var v = (grande ? 120 : 80) * (0.75 + 0.5 * ((i * 37) % 10) / 10);
        var x = Math.cos(ang) * v, y = -Math.sin(ang) * v * 0.6;
        c.style.transformOrigin = '50% 50%';
        mostra(c, true);
        var a = animar(c, [{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + (i % 2 ? 200 : -200) + 'deg)', opacity: 1, offset: .35 },
          { transform: 'translate(' + x * 1.1 + 'px,' + (y + 90) + 'px) rotate(' + (i % 2 ? 420 : -420) + 'deg)', opacity: 0 }], { duration: grande ? 1500 : 900, delay: 120, easing: 'cubic-bezier(.2,.6,.4,1)' });
        if (!a) mostra(c, false);
      });
    }
    var REACAO = {
      happy: function () {
        luz('verde'); rosto({ olhos: 'feliz', bochechas: true });
        animar(el.pulo, [{ transform: 'none' }, { transform: 'translateY(2px) scale(1.06,.9)', offset: .1 }, { transform: 'translateY(-12px) scale(.96,1.06)', offset: .27 },
          { transform: 'translateY(1px) scale(1.04,.95)', offset: .44 }, { transform: 'translateY(-6px) scale(.98,1.03)', offset: .6 },
          { transform: 'translateY(0) scale(1.02,.98)', offset: .76 }, { transform: 'none' }], { duration: 1200 });
        sombra(1200, .75); balancoAntena(.8, 1300);
        return 1500;
      },
      celebrate: function (o) {
        var g = o && o.grande;
        luz('verde'); rosto({ olhos: 'feliz', bochechas: true });
        var d = g ? 2100 : 1350;
        var o5 = '50% 58%'; // gira em torno do meio do corpo, não da base
        animar(el.pulo, [{ transform: 'none', transformOrigin: o5 }, { transform: 'translateY(3px) scale(1.08,.88)', transformOrigin: o5, offset: .12 },
          { transform: 'translateY(' + (g ? -30 : -18) + 'px) rotate(180deg) scale(.95,1.05)', transformOrigin: o5, offset: .42 },
          { transform: 'translateY(' + (g ? -12 : -6) + 'px) rotate(360deg)', transformOrigin: o5, offset: .66 },
          { transform: 'translateY(1px) rotate(360deg) scale(1.05,.94)', transformOrigin: o5, offset: .82 },
          { transform: 'rotate(360deg)', transformOrigin: o5 }], { duration: d });
        animar(el.bracoE, [{ transform: 'rotate(0)' }, { transform: 'rotate(115deg)', offset: .3 }, { transform: 'rotate(100deg)', offset: .7 }, { transform: 'rotate(0)' }], { duration: d });
        animar(el.bracoD, [{ transform: 'rotate(0)' }, { transform: 'rotate(-115deg)', offset: .3 }, { transform: 'rotate(-100deg)', offset: .7 }, { transform: 'rotate(0)' }], { duration: d });
        sombra(d, .6); balancoAntena(1, d); brilhar(g ? 260 : 220);
        if (g) confetes(true);
        return g ? 2300 : 1500;
      },
      confused: function () {
        luz('caramelo'); rosto({ boca: 'reta', olhar: [-4, -2] });
        animar(el.pulo, [{ transform: 'none' }, { transform: 'rotate(-9deg) translateX(-2px)', offset: .25 }, { transform: 'rotate(-8deg) translateX(-2px)', offset: .62 },
          { transform: 'rotate(2deg)', offset: .8 }, { transform: 'none' }], { duration: 1400, easing: 'ease-in-out' });
        animar(el.bracoE, [{ transform: 'rotate(0)' }, { transform: 'rotate(-38deg)', offset: .3 }, { transform: 'rotate(-34deg)', offset: .62 }, { transform: 'rotate(0)' }], { duration: 1400, easing: 'ease-in-out' });
        balancoAntena(.6, 1400);
        depois(950, function () { if (atual === 'confused') rosto({ olhos: 'feliz' }); });
        return 1500;
      },
      surprise: function () {
        luz('dourado'); rosto({ olhosEscala: 1.35, boca: 'o' });
        animar(el.pulo, [{ transform: 'none' }, { transform: 'translateY(-6px) scale(.96,1.05)', offset: .3 }, { transform: 'translateY(1px) scale(1.03,.97)', offset: .65 }, { transform: 'none' }], { duration: 480 });
        animar(el.bracoE, [{ transform: 'rotate(0)' }, { transform: 'rotate(30deg)', offset: .3 }, { transform: 'rotate(0)' }], { duration: 480 });
        animar(el.bracoD, [{ transform: 'rotate(0)' }, { transform: 'rotate(-30deg)', offset: .3 }, { transform: 'rotate(0)' }], { duration: 480 });
        balancoAntena(.9);
        return 520;
      },
      wave: function () {
        luz('dourado'); rosto({ olhos: 'feliz', bochechas: true });
        animar(el.bracoE, [{ transform: 'rotate(0)' }, { transform: 'rotate(118deg)', offset: .2 }, { transform: 'rotate(92deg)', offset: .36 }, { transform: 'rotate(122deg)', offset: .52 },
          { transform: 'rotate(92deg)', offset: .68 }, { transform: 'rotate(112deg)', offset: .8 }, { transform: 'rotate(0)' }], { duration: 1400, easing: 'ease-in-out' });
        animar(el.pulo, [{ transform: 'none' }, { transform: 'rotate(-4deg)', offset: .3 }, { transform: 'rotate(-3deg)', offset: .75 }, { transform: 'none' }], { duration: 1400, easing: 'ease-in-out' });
        el.brilhos[0].style.transformOrigin = '50% 50%';
        mostra(el.brilhos[0], true);
        if (!animar(el.brilhos[0], [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.2) rotate(40deg)', opacity: 1, offset: .4 }, { transform: 'scale(0) rotate(80deg)', opacity: 0 }], { duration: 500, delay: 300 })) mostra(el.brilhos[0], false);
        return 1500;
      }
    };

    function iniciarBase() {
      limpar(true);
      [el.anel, el.pontos, el.zzz].forEach(function (n) { mostra(n, false); });
      atual = base; reagindo = false;
      el.antena.querySelector('.luz').style.opacity = '';
      BASE[base]();
      brilhoSequencia();
      if (pausado) { laco.forEach(function (a) { a.cancel(); }); laco = []; }
      acordarQuadro();
    }

    function tocarReacao(nome, o) {
      limpar(true);
      [el.anel, el.pontos, el.zzz].forEach(function (n) { mostra(n, false); });
      atual = nome; reagindo = true;
      var dur = REACAO[nome](o || {});
      depois(dur, function () {
        if (atual !== nome) return;
        var prox = fila.shift();
        if (prox) tocarReacao(prox[0], prox[1]); else iniciarBase();
      });
      acordarQuadro();
    }

    function estado(nome, o) {
      o = o || {};
      if (BASES.indexOf(nome) >= 0) {
        base = nome;
        if (reagindo && !o.agora) return api;      // entra quando a reação terminar
        fila = []; iniciarBase(); return api;
      }
      if (REACOES.indexOf(nome) < 0) { console.warn('Eco: estado desconhecido', nome); return api; }
      var agora = o.agora || nome === 'surprise';    // "opa" não espera
      if (reagindo && !agora) {
        var repetida = atual === nome || fila.some(function (f) { return f[0] === nome; });
        if (!repetida && fila.length < 2) fila.push([nome, o]);
        return api;
      }
      if (agora) fila = [];
      tocarReacao(nome, o);
      return api;
    }

    // ---------- microações no repouso (a cada 30–60 s, só em neutral) ----------
    var MICRO = {
      olhar: function () {
        animar(el.alvo, [{ transform: 'none' }, { transform: 'translate(-5px,0)', offset: .15 }, { transform: 'translate(-5px,0)', offset: .4 },
          { transform: 'translate(5px,0)', offset: .55 }, { transform: 'translate(5px,0)', offset: .8 }, { transform: 'none' }], { duration: 2400, easing: 'ease-in-out' });
      },
      antena: function () { balancoAntena(.7, 1300); },
      virar: function () {
        if (!e25) return MICRO.olhar();
        [[el.rosto, .9], [el.alvo, 1], [el.brilhoP, -.55]].forEach(function (p) {
          var x = 5 * p[1];
          animar(p[0], [{ transform: 'none' }, { transform: 'translate(' + -x + 'px,0)', offset: .18 }, { transform: 'translate(' + -x + 'px,0)', offset: .42 },
            { transform: 'translate(' + x + 'px,0)', offset: .6 }, { transform: 'translate(' + x + 'px,0)', offset: .82 }, { transform: 'none' }], { duration: 2600, easing: 'ease-in-out' });
        });
      },
      espreguicar: function () {
        animar(el.pulo, [{ transform: 'none' }, { transform: 'scale(.98,1.05)', offset: .4 }, { transform: 'scale(1.02,.98)', offset: .7 }, { transform: 'none' }], { duration: 1500, easing: 'ease-in-out' });
        animar(el.bracoE, [{ transform: 'rotate(0)' }, { transform: 'rotate(35deg)', offset: .4 }, { transform: 'rotate(0)' }], { duration: 1500, easing: 'ease-in-out' });
        animar(el.bracoD, [{ transform: 'rotate(0)' }, { transform: 'rotate(-35deg)', offset: .4 }, { transform: 'rotate(0)' }], { duration: 1500, easing: 'ease-in-out' });
      }
    };
    function microacao(tipo) {
      if (pausado || reagindo || atual !== 'neutral') return api;
      var nomes = Object.keys(MICRO);
      (MICRO[tipo] || MICRO[nomes[Math.floor(Math.random() * nomes.length)]])();
      return api;
    }
    function agendarMicro() {
      var ms = 30000 + Math.random() * 30000;
      timers.push(setTimeout(function () { microacao(); agendarMicro(); }, ms));
    }

    // ---------- sequência de dias: estrela que cresce e nunca fica triste ----------
    function tamanhoEstrela(n) { return n < 3 ? .7 : n < 7 ? .85 : n < 30 ? 1 : 1.2; }
    function brilhoSequencia() {
      if (seqDias <= 0 || pausado) return;
      animar(el.seqEstrela, [{ transform: 'none' }, { transform: 'scale(1.25) rotate(25deg)', offset: .06 }, { transform: 'none', offset: .12 }, { transform: 'none' }],
        { duration: 7000, iterations: Infinity, easing: 'ease-in-out' }, true);
    }
    function sequencia(n) {
      n = Math.max(0, Math.floor(+n || 0));
      var cresceu = n > seqDias;
      seqDias = n;
      mostra(el.seq, n > 0);
      el.seq.style.transform = 'scale(' + tamanhoEstrela(n) + ')';
      if (n > 0 && cresceu) {
        animar(el.seqEstrela, [{ transform: 'scale(.4)' }, { transform: 'scale(1.35) rotate(40deg)', offset: .5 }, { transform: 'none' }], { duration: 600 });
      }
      return api;
    }

    // ---------- toque: uma apertadinha e um sorriso ----------
    function aoTocar() {
      if (opcoes.semToque || reagindo || pausado || ['neutral', 'listening', 'reading'].indexOf(atual) < 0) return;
      var antes = atual;
      rosto({ olhos: 'feliz', bochechas: true });
      animar(el.pulo, [{ transform: 'none' }, { transform: 'scale(1.08,.9)', offset: .3 }, { transform: 'scale(.97,1.04)', offset: .65 }, { transform: 'none' }], { duration: 450, easing: 'ease-out' });
      balancoAntena(.5, 800);
      depois(750, function () { if (atual === antes && !reagindo) iniciarBase(); });
    }
    raiz.addEventListener('pointerdown', aoTocar);

    // ---------- voz: boca (speaking) e anel (listening) ----------
    function lerNivel() {
      if (analisador) {
        analisador.getByteTimeDomainData(dados);
        var soma = 0;
        for (var i = 0; i < dados.length; i++) { var v = (dados[i] - 128) / 128; soma += v * v; }
        return Math.min(1, Math.sqrt(soma / dados.length) * 4.5);
      }
      if (simular) {
        var t = performance.now() / 1000;
        var silabas = Math.max(0, Math.sin(t * 9.3) * 0.6 + Math.sin(t * 5.1) * 0.4);
        var frase = Math.sin(t * 0.9) > -0.55 ? 1 : 0;   // pausas entre frases
        return silabas * frase;
      }
      return nivelAlvo;
    }
    function quadro() {
      var alvo = (atual === 'speaking' || atual === 'listening') ? lerNivel() : 0;
      nivel += (alvo - nivel) * (alvo > nivel ? 0.55 : 0.25);
      if (atual === 'speaking') {
        var ry = reduzir() ? 2.5 : 1.5 + nivel * 6.5, rx = 6 + nivel * 1.6;
        el.fala.setAttribute('ry', ry.toFixed(2)); el.fala.setAttribute('rx', rx.toFixed(2));
        if (!reduzir() && !pausado) el.respira.style.transform = 'translateY(' + (-nivel * 1.6).toFixed(2) + 'px)';
      } else if (el.respira.style.transform) {
        el.respira.style.transform = '';
      }
      if (atual === 'listening') {
        var s = reduzir() ? 1 : 1 + nivel * 0.55;
        el.anel.style.transform = 'scale(' + s.toFixed(3) + ')';
        el.anel.style.opacity = (0.35 + nivel * 0.65).toFixed(2);
      } else { el.anel.style.opacity = ''; }
      raf = precisaQuadro() ? requestAnimationFrame(quadro) : 0;
    }
    function precisaQuadro() {
      if (document.hidden) return false;
      return atual === 'speaking' || atual === 'listening' || nivel > 0.01 || !!el.respira.style.transform;
    }
    function acordarQuadro() { if (!raf && precisaQuadro()) raf = requestAnimationFrame(quadro); }
    document.addEventListener('visibilitychange', acordarQuadro);

    function conectarAudio(origem) {
      desconectarAudio();
      try {
        ctx = ctx || new (global.AudioContext || global.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        analisador = ctx.createAnalyser(); analisador.fftSize = 1024;
        dados = new Uint8Array(analisador.fftSize);
        if (origem instanceof MediaStream) {
          fonte = ctx.createMediaStreamSource(origem); fonte.connect(analisador);      // microfone: não toca no alto-falante
        } else {
          fonte = origem.__ecoFonte || (origem.__ecoFonte = ctx.createMediaElementSource(origem));
          fonte.connect(analisador); analisador.connect(ctx.destination);
        }
      } catch (e) { console.warn('Eco: não consegui ler o áudio', e); analisador = null; }
      return api;
    }
    function desconectarAudio() {
      try { if (fonte) fonte.disconnect(); if (analisador) analisador.disconnect(); } catch (e) { /* já desconectado */ }
      if (fonte && fonte.mediaElement && ctx) { try { fonte.connect(ctx.destination); } catch (e) { /* ok */ } }
      analisador = null; fonte = null;
      return api;
    }

    // ---------- olhar segue o ponteiro ----------
    function aoMover(ev) {
      var r = raiz.getBoundingClientRect();
      var cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.47;
      var dx = ev.clientX - cx, dy = ev.clientY - cy, d = Math.hypot(dx, dy) || 1;
      var k = Math.min(1, d / (r.width * 1.5)) * 4.5;
      ponteiro.x = dx / d * k; ponteiro.y = dy / d * k * 0.7;
      aplicarOlhar();
    }

    var api = {
      elemento: raiz,
      estado: estado,
      get atual() { return atual; },
      get base() { return base; },
      nivelDeVoz: function (v) { nivelAlvo = Math.max(0, Math.min(1, +v || 0)); return api; },
      simularVoz: function (sim) { simular = !!sim; return api; },
      conectarAudio: conectarAudio,
      desconectarAudio: desconectarAudio,
      seguirPonteiro: function (sim) {
        seguindo = !!sim;
        global.removeEventListener('pointermove', aoMover);
        if (seguindo) global.addEventListener('pointermove', aoMover, { passive: true });
        else { ponteiro.x = ponteiro.y = 0; aplicarOlhar(); }
        return api;
      },
      pausar: function () { pausado = true; laco.forEach(function (a) { a.cancel(); }); laco = []; return api; },
      sequencia: sequencia,
      microacao: microacao,
      get fila() { return fila.map(function (f) { return f[0]; }); },
      retomar: function () { pausado = false; iniciarBase(); return api; },
      reduzirMovimento: function (sim) { forcarReduzir = sim === null || sim === undefined ? null : !!sim; iniciarBase(); return api; },
      destruir: function () {
        limpar(true); cancelAnimationFrame(raf); raf = 0; api.seguirPonteiro(false); desconectarAudio();
        document.removeEventListener('visibilitychange', acordarQuadro); alvo.innerHTML = '';
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', function () { iniciarBase(); });
    estado(opcoes.estado || 'neutral');
    return api;
  }

  // ---------- frases e abertura (tom do app: calmo, sem cobrança) ----------
  function limpaNome(n) { return String(n || '').trim().split(/\s+/)[0]; }
  function abertura(o) {
    o = o || {};
    var h = typeof o.hora === 'number' ? o.hora : new Date().getHours();
    var nome = limpaNome(o.nome), v = nome ? ', ' + nome : '';
    if (h >= 22 || h < 5) return { estado: 'sleepy', frase: 'Boa noite' + v + '. Uma revisão curta já vale; pode encerrar por aqui, se quiser.' };
    if (h < 12) return { estado: 'wave', frase: 'Bom dia' + v + '. Um próximo passo já é um bom começo.' };
    if (h < 18) return { estado: 'wave', frase: 'Boa tarde' + v + '. Seu tempo, seu ritmo.' };
    return { estado: 'wave', frase: 'Boa noite' + v + '. Vamos com calma hoje?' };
  }
  function frase(tipo, o) {
    o = o || {};
    var n = (o.nomes || []).map(limpaNome).filter(Boolean);
    if (tipo === 'dupla') {
      var quem = n.length === 2 ? n[0] + ' e ' + n[1] : 'Vocês dois';
      return { estado: 'happy', frase: quem + ' estudaram hoje. Que bom ver vocês dois por aqui.' };
    }
    return abertura(o);
  }

  global.Eco = { criar: criar, estados: BASES.concat(REACOES), abertura: abertura, frase: frase };
})(window);

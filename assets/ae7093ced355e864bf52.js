
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = $('#root'), aviso = $('#aviso'), html = document.documentElement;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var I = {
    trilha: '<path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5z"/>',
    guias: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    revisar: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
    progresso: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path class="solid" d="M8 5.5v13l11-6.5z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".5"/>',
    voice: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
    motion: '<path d="M4 12h3l3-7 4 14 3-7h3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    out: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5M15 12H4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/>',
    flame: '<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>',
    ear: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>'
  };
  var svg = function (k, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + I[k] + '</svg>'; };
  var DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  var DIAS_NOME = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
  function nDias(n) { return n + (n === 1 ? ' dia seguido' : ' dias seguidos'); }
  function hojeIdx() { return (new Date().getDay() + 6) % 7; }
  function hojeStr() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function segundaStr() { var d = new Date(); d.setDate(d.getDate() - hojeIdx()); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  /* =================================================================
     ESTADO (salvo no aparelho só para a demonstração)
     LIGAR: no Apps Script, perfis e progresso vêm da planilha:
       google.script.run.withSuccessHandler(fn).obterPerfis();
     e cada mudança vai para google.script.run.salvarPerfil(perfil).
     ================================================================= */
  var CHAVE = 'idiomas-app-v2';
  function semente() {
    var h = hojeIdx(), ate = function (l) { return l.map(function (m, i) { return i < h ? m : 0; }); };
    return {
      versao: 2, ativo: null, ultimo: null, visto: false,
      cfg: { tema: 'sistema', meta: 15, voz: 0.9, fala: true, efeitos: true, lembrete: true, hora: '20:30', motion: false, metaJuntos: 600 },
      perfis: (window.SYNC && SYNC.remotos()) || []
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { S = null; }
  if (!S || S.versao !== 2 || !Array.isArray(S.perfis) || !S.cfg || typeof S.cfg!=='object') { try{var invalid=localStorage.getItem(CHAVE);if(invalid)localStorage.setItem(CHAVE+':recuperacao',invalid);}catch(e){} S = semente(); }
  try{S.perfis=S.perfis.map(function(p){var oldPIN=p&&p.pin,normalized=ProfileCore.normalize(p);if(oldPIN)normalized.pin=oldPIN;return normalized;});}catch(e){try{localStorage.setItem(CHAVE+':recuperacao',JSON.stringify(S));}catch(err){}S=semente();}
  S.perfis.forEach(function (p) { if (!p.motivos) p.motivos = []; p.avatar = avatarNormalizar(p.avatar); if (!p.xpSemana) p.xpSemana = [0, 0, 0, 0, 0, 0, 0]; delete p.cor; delete p.mascote; });
  if (!S.cfg.metaJuntos) S.cfg.metaJuntos = 600;
  var cfgProfileId=S.ativo;
  function salvar() { if(eu()&&cfgProfileId===S.ativo){var prefs=eu().preferencias=eu().preferencias||{};['meta','voz','tema','efeitos','motion','silent','translations','textSize'].forEach(function(k){if(S.cfg[k]!==undefined)prefs[k]=S.cfg[k];});}if (window.SYNC) SYNC.mudou(S); try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { toast('O aparelho não conseguiu guardar as alterações. Exporte uma cópia em Configurações.'); } }
  function eu() { return S.perfis.filter(function (p) { return p.id === S.ativo; })[0]; }
  function novoDia(p) {
    return ProfileCore.newDay(p);
  }

  /* ---------- tema e movimento ---------- */
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function aplicarTema() {
    var t = S.cfg.tema, dark = t === 'escuro' || (t === 'sistema' && mq.matches);
    html.dataset.theme = dark ? 'dark' : 'light';
    if (S.cfg.motion) html.dataset.motion = 'reduce'; else delete html.dataset.motion;
    var m = $('meta[name="theme-color"]'); if (m) m.content = dark ? '#121827' : '#F6F4EF';
  }
  if (mq.addEventListener) mq.addEventListener('change', aplicarTema);
  aplicarTema();

  /* ---------- utilidades ---------- */
  var CORES = [['menta', 'Menta', '#7fe3cf', '#23a38c'], ['coral', 'Coral', '#ffc0b4', '#e0604f'], ['ambar', 'Âmbar', '#ffe09a', '#d1901c'], ['ceu', 'Céu', '#b5dbff', '#3f84d1'], ['lavanda', 'Lavanda', '#dccfff', '#7a62d4'], ['grafite', 'Grafite', '#c9d1da', '#56616e']];
  var MOTIVOS = ['Viagem', 'Trabalho', 'Filmes e séries', 'Música', 'Morar fora', 'Conversar com amigos', 'Estudos', 'Por diversão'];
  function pintar(el) { el.removeAttribute('data-cor'); return el; } /* o mascote tem uma cor só */
  function ecoDe(p, estado, rotulo, decorativo) { return eco(estado, rotulo || 'Lumi', decorativo); }
  function avatar(p, size, humor) { var s = document.createElement('span'); s.className = 'av'; s.setAttribute('aria-hidden', 'true'); if (size) s.style.setProperty('--av', size + 'px'); s.innerHTML = avatarImg(p.avatar, humor); return s; }

  /* ---------- sons próprios, gerados no navegador (Web Audio), sem arquivos de áudio ---------- */
  var SOM = (function () {
    /* Efeitos originais, sintetizados na hora (sem arquivos): sino de acerto, "bonk" de erro, toque, combo e fanfarra. */
    var ctx = null, out = null, VOL = 1;
    function ac() {
      if (!ctx) {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
        try { ctx = new C(); } catch (e) { return null; }
        var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.connect(ctx.destination);
        out = ctx.createGain(); out.gain.value = 0.9 * VOL; out.connect(comp);
        var d = ctx.createDelay(); d.delayTime.value = 0.11; var fb = ctx.createGain(); fb.gain.value = 0.22; var wet = ctx.createGain(); wet.gain.value = 0.18;
        out.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(comp);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    /* nota com harmônicos, para soar como sino/marimba e não como apito */
    function nota(f, t0, dur, vol, tipo, f2, harm) {
      var c = ac(); if (!c) return;
      var t = c.currentTime + t0;
      (harm || [[1, 1]]).forEach(function (h) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = tipo || 'sine'; o.frequency.setValueAtTime(f * h[0], t);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2 * h[0], t + dur * 0.8);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * h[1], t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur / h[0] * (h[0] > 1 ? 1.4 : 1));
        o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
      });
    }
    function sopro(t0, dur, f1, f2, vol) {
      var c = ac(); if (!c) return;
      var t = c.currentTime + t0, n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(out); src.start(t); src.stop(t + dur + 0.02);
    }
    function pop(f, t0, vol) { nota(f, t0 || 0, 0.07, vol || 0.09, 'sine', f * 1.6, [[1, 1], [2, 0.15]]); }
    var SINO = [[1, 1], [2, 0.35], [3, 0.12], [4.2, 0.05]], MAD = [[1, 1], [4, 0.18], [9.8, 0.04]];
    return {
      vol: function (v) { VOL = v; if (out) out.gain.value = 0.9 * v; },
      clique: function () { pop(620); },
      principal: function () { pop(520, 0, 0.1); pop(780, 0.05, 0.09); },
      aba: function () { pop(700, 0, 0.07); nota(1050, 0.04, 0.09, 0.05, 'sine', 0, [[1, 1], [2, 0.2]]); },
      voltar: function () { nota(700, 0, 0.09, 0.07, 'sine', 420); },
      liga: function () { nota(660, 0, 0.06, 0.08, 'sine'); nota(990, 0.06, 0.1, 0.08, 'sine', 0, [[1, 1], [2, 0.2]]); },
      desliga: function () { nota(880, 0, 0.06, 0.07, 'sine'); nota(587, 0.06, 0.1, 0.07, 'sine'); },
      tecla: function () { nota(1500 + Math.random() * 300, 0, 0.04, 0.07, 'triangle', 0, [[1, 1], [3.1, 0.1]]); },
      entrou: function () { [659.3, 987.8, 1318.5].forEach(function (f, i) { nota(f, i * 0.07, 0.35, 0.12, 'sine', 0, SINO); }); },
      folha: function () { sopro(0, 0.22, 500, 2200, 0.05); },
      fechar: function () { sopro(0, 0.18, 2000, 450, 0.04); },
      tela: function () { sopro(0, 0.16, 900, 2600, 0.025); },
      aviso: function () { nota(1174.7, 0, 0.35, 0.08, 'sine', 0, SINO); },
      toque: function () { nota(1320, 0, 0.06, 0.06, 'sine', 0, [[1, 1], [2, 0.2]]); },
      solta: function () { nota(880, 0, 0.06, 0.05, 'sine', 660); },
      acerto: function () { nota(880, 0, 0.18, 0.2, 'sine', 0, SINO); nota(1318.5, 0.085, 0.5, 0.2, 'sine', 0, SINO); },
      combo: function () { [880, 1108.7, 1318.5, 1760].forEach(function (f, i) { nota(f, i * 0.055, i === 3 ? 0.55 : 0.2, 0.15, 'sine', 0, SINO); }); },
      erro: function () { nota(220, 0, 0.16, 0.22, 'triangle', 196, MAD); nota(164.8, 0.12, 0.32, 0.2, 'triangle', 146.8, MAD); },
      fim: function () {
        [523.3, 659.3, 784, 1046.5].forEach(function (f, i) { nota(f, i * 0.1, 0.3, 0.14, 'triangle'); });
        [1046.5, 1318.5, 1568].forEach(function (f) { nota(f, 0.42, 0.9, 0.09, 'sine', 0, SINO); });
        for (var i = 0; i < 6; i++) nota(2093 + i * 260, 0.5 + i * 0.05, 0.12, 0.03, 'sine');
      },
      chama: function () { nota(330, 0, 0.45, 0.03, 'sawtooth', 990); nota(988, 0.2, 0.5, 0.12, 'sine', 0, SINO); nota(1480, 0.3, 0.6, 0.08, 'sine', 0, SINO); }
    };
  })();
  function tocar(t) { if (!S.cfg.silent && S.cfg.efeitos && SOM[t]) try { SOM.vol(S.cfg.volume == null ? 1 : S.cfg.volume); SOM[t](); } catch (e) {} }
  function botaoSom(bar) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'icon-btn som-btn'; b.setAttribute('role', 'switch');
    function pinta() { b.setAttribute('aria-checked', String(!!S.cfg.efeitos)); b.setAttribute('aria-label', S.cfg.efeitos ? 'Sons ligados. Toque para desligar' : 'Sons desligados. Toque para ligar');
      b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/>' + (S.cfg.efeitos ? '<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M16 9l5 6M21 9l-5 6"/>') + '</svg>'; }
    b.addEventListener('click', function () { S.cfg.efeitos = !S.cfg.efeitos; salvar(); pinta(); if (S.cfg.efeitos) tocar('liga'); toast(S.cfg.efeitos ? 'Sons ligados.' : 'Sons desligados.'); });
    pinta(); bar.appendChild(b);
  }
  /* som em todo toque da interface (a lição tem os sons próprios dela) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button, a, [role=radio], [role=switch], summary, label, input[type=checkbox], input[type=radio]'); if (!b || b.disabled) return;
    if (b.closest('.u015-opt, .u019-chip, #acao, .u019 button')) return;
    var lab = (b.getAttribute('aria-label') || '') + ' ' + b.className;
    if (b.closest('.ui-keypad')) tocar('tecla');
    else if (b.getAttribute('role') === 'switch') tocar(b.getAttribute('aria-checked') === 'true' ? 'desliga' : 'liga');
    else if (b.classList.contains('ui-nav__item')) tocar('aba');
    else if (/sair|voltar|fechar|cancelar|back|close/i.test(lab + ' ' + b.textContent)) tocar('voltar');
    else if (/primary/.test(b.className)) tocar('principal');
    else tocar('clique');
  }, true);
  function sincronizarTemplate() { pintar($('#tplEco').content.firstElementChild); }
  function eco(estado, rotulo, decorativo) { return criarEco(estado, rotulo, decorativo); }
  function anunciar(t) { aviso.textContent = ''; setTimeout(function () { aviso.textContent = t; }, 30); }
  function toast(t) {
    var old = $('.toast'); if (old) old.remove();
    var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d);
    anunciar(t); setTimeout(function () { tocar('aviso'); }, 60); setTimeout(function () { d.remove(); }, 2400);
  }
  function falar(texto, lang) {
    if (window.AUD && AUD.say(texto, lang, null, S.cfg.voz)) return;
    if (!('speechSynthesis' in window)) { toast('Este aparelho não consegue ler em voz alta.'); return; }
    speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(texto); u.lang = lang; u.rate = S.cfg.voz; speechSynthesis.speak(u);
  }
  function curso() { return CURSOS[eu().idioma]; }
  function todasLicoes(c) {
    var out = [];
    c.secoes.forEach(function (s) { s.unidades.forEach(function (u, ui) { u.licoes.forEach(function (l, li) { out.push({ unidade: u, ui: ui, li: li, nome: l, check: li === u.licoes.length - 1 }); }); }); });
    return out;
  }
  /* tipo de cada lição dentro da unidade: [ícone, nome] */
  var TIPOS = [['star', 'Palavras novas'], ['ear', 'Escuta'], ['chat', 'Conversa'], ['book', 'Gramática'], ['trophy', 'Revisão da unidade']];
  function saudacao() { var h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }

  /* radiogroup simples com a aparência do #015 (Lucian UX/UI Prompt #015 · MIT License (c) 2026 Seokwoooo) */
  function grupoRadio(container, itens, sel, aoMudar, rotulo) {
    var g = document.createElement('div'); g.className = 'u015 ux has-sel';
    g.innerHTML = '<div class="u015-grp" role="radiogroup" aria-label="' + esc(rotulo) + '"><span class="u015-frame" aria-hidden="true"></span>' +
      itens.map(function (it, i) {
        return '<button class="u015-opt" type="button" role="radio" aria-checked="' + (it.v === sel) + '" tabindex="' + (it.v === sel ? 0 : -1) + '" data-v="' + esc(it.v) + '">' +
          '<span class="u015-dot" aria-hidden="true"></span>' + (it.code ? '<span class="opt-code" aria-hidden="true">' + esc(it.code) + '</span>' : '') +
          '<span class="u015-txt">' + esc(it.t) + (it.s ? '<span class="opt-sub">' + esc(it.s) + '</span>' : '') + '</span>' +
          (it.val ? '<span class="opt-val">' + esc(it.val) + '</span>' : '') + '</button>';
      }).join('') + '</div>';
    container.appendChild(g);
    var opts = $$('.u015-opt', g), frame = $('.u015-frame', g);
    function place(o) { frame.style.top = o.offsetTop + 'px'; frame.style.height = o.offsetHeight + 'px'; }
    function choose(o, focus) {
      opts.forEach(function (x) { var on = x === o; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
      place(o); if (focus) o.focus(); aoMudar(o.dataset.v);
    }
    opts.forEach(function (o, i) {
      o.addEventListener('click', function () { choose(o); });
      o.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (d) { e.preventDefault(); choose(opts[(i + d + opts.length) % opts.length], true); }
      });
    });
    var ini = opts.filter(function (o) { return o.dataset.v === String(sel); })[0];
    frame.style.transition = 'none';
    requestAnimationFrame(function () { if (ini) place(ini); else g.classList.remove('has-sel'); requestAnimationFrame(function () { frame.style.transition = ''; }); });
    return g;
  }
  function segmento(itens, sel, aoMudar, rotulo) {
    var s = document.createElement('div'); s.className = 'ui-segment'; s.setAttribute('role', 'group'); s.setAttribute('aria-label', rotulo);
    itens.forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = it.t; b.setAttribute('aria-pressed', String(it.v === sel));
      b.addEventListener('click', function () { $$('button', s).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); aoMudar(it.v); });
      s.appendChild(b);
    });
    return s;
  }
  function interruptor(on, aoMudar, rotulo) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ui-switch'; b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', String(!!on)); b.setAttribute('aria-label', rotulo);
    b.addEventListener('click', function () { var v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', String(v)); aoMudar(v); });
    return b;
  }
  function tecladoPin(box, aoCompletar) {
    var val = '', busy = false;
    box.insertAdjacentHTML('beforeend', '<div class="ui-pin" role="img" aria-label="0 de 4 dígitos"><span></span><span></span><span></span><span></span></div><p class="pin-msg pin-feedback" aria-live="polite"></p>' +
      '<div class="ui-keypad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" data-k="' + n + '">' + n + '</button>'; }).join('') +
      '<span></span><button type="button" data-k="0">0</button><button type="button" class="ghost" data-k="apagar">Apagar</button></div>');
    var pin = $('.ui-pin', box), msg = $('.pin-feedback', box);
    function draw() { $$('span', pin).forEach(function (s, i) { s.classList.toggle('on', i < val.length); }); pin.setAttribute('aria-label', val.length + ' de 4 dígitos'); }
    function tecla(k) {
      if(busy)return;
      if (k === 'apagar') val = val.slice(0, -1); else if (val.length < 4) val += k;
      draw(); msg.classList.remove('err'); msg.textContent = '';
      if (val.length === 4) {var entered=val;busy=true;setTimeout(function(){if(!box.isConnected){busy=false;return;}Promise.resolve(aoCompletar(entered)).catch(function(){val='';draw();msg.textContent='Não foi possível conferir o PIN. Tente novamente.';}).finally(function(){busy=false;});},120);}
    }
    $$('.ui-keypad button', box).forEach(function (b) { b.addEventListener('click', function () { tecla(b.dataset.k); }); });
    var onKey = function (e) { if (!box.isConnected) { removeEventListener('keydown', onKey); return; } if (/^[0-9]$/.test(e.key)) tecla(e.key); else if (e.key === 'Backspace') tecla('apagar'); };
    addEventListener('keydown', onKey);
    return {
      erro: function (t) { val = ''; draw(); msg.textContent = t; msg.classList.add('err'); tocar('erro'); pin.classList.remove('shake'); void pin.offsetWidth; pin.classList.add('shake'); },
      limpar: function () { val = ''; draw(); },
      msg: function (t) { msg.classList.remove('err'); msg.textContent = t; }
    };
  }

  /* =================================================================
     ROTEADOR
     ================================================================= */
  var abas = [['hoje', 'Hoje'], ['trilha', 'Trilha'], ['praticar', 'Praticar'], ['caderno', 'Caderno'], ['perfil', 'Perfil']];
  var historyBack=false;
  var historyScreens=['revisaoDia','provas','leituras','lembrete','hoje','trilha','praticar','caderno','perfil','config','guia','guias','revisar','progresso','ecoHub','ecoScenarios','ecoWrite','ecoPronuncia','ecoDitado','ecoRevisao','ecoHistory','ecoWritingHistory','ecoSummary','conquistas','descobrir','boasvindas','entrar'];
  function recordRoute(tela,arg){if(historyBack||historyScreens.indexOf(tela)<0)return;var data={idiomas:true,tela:tela,arg:typeof arg==='string'||typeof arg==='number'?arg:null,perfil:S.ativo};if(!history.state||!history.state.idiomas)history.replaceState(data,'');else if(history.state.tela!==tela||history.state.arg!==data.arg)history.pushState(data,'');}
  addEventListener('popstate',function(e){if(!e.state||!e.state.idiomas)return;historyBack=true;try{if(e.state.perfil!==S.ativo&&e.state.perfil){S.ativo=null;salvar();ir('entrar');}else ir(e.state.tela,e.state.arg);}finally{historyBack=false;}});
  function ir(tela, arg) {
    studioStop();
    if(eu()){var prefs=eu().preferencias||{};Object.assign(S.cfg,{tema:'sistema',meta:15,voz:.9,efeitos:true,motion:false,silent:false,translations:true,textSize:100},prefs);cfgProfileId=eu().id;uxAplicarPrefs();}
    IdiomasAudio.stop(); fecharFolha(); sincronizarTemplate();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    root.innerHTML = '';
    if(!TELAS[tela])tela='hoje';TELAS[tela](arg);recordRoute(tela,arg); tocar('tela');
    window.scrollTo(0, 0);
    var alvo = $('.page h1, .page h2, .entry h1, .step-body h1, #root h1');
    if (alvo) { alvo.setAttribute('tabindex', '-1'); alvo.focus({ preventScroll: true }); }
  }
  function casca(aba, titulo, extrasTopo) {
    var sh = document.createElement('div'); sh.className = 'shell';
    var bar = document.createElement('header'); bar.className = 'appbar';
    if (titulo) { var h = document.createElement('h1'); h.textContent = titulo; bar.appendChild(h); }
    if (extrasTopo) extrasTopo(bar);
    if (aba) botaoSom(bar);
    if (aba) { var practice=document.createElement('button');practice.type='button';practice.className='studio-nav';practice.setAttribute('aria-label','Praticar com o Eco');practice.title='Conversar e escrever com o Eco';practice.innerHTML=svg('mic');practice.addEventListener('click',function(){ir('ecoHub');});bar.appendChild(practice); }
    var pg = document.createElement('main'); pg.className = 'page';
    var nav = document.createElement('nav'); nav.className = 'ui-nav tabbar'; nav.setAttribute('aria-label', 'Principal');
    abas.forEach(function (a) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ui-nav__item';
      b.innerHTML = svg(({hoje:'sun',praticar:'chat',caderno:'book'})[a[0]]||a[0]) + a[1]; if (a[0] === aba) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', function () { ir(a[0]); });
      nav.appendChild(b);
    });
    sh.appendChild(bar); sh.appendChild(pg); if (aba) sh.appendChild(nav);
    root.appendChild(sh);
    return pg;
  }
  function seloStats(bar) {
    var p = eu(), w = document.createElement('div'); w.className = 'stats';
    w.innerHTML = '<span class="ui-stat ui-stat--streak" aria-label="' + nDias(p.sequencia) + '">' + svg('flame') + p.sequencia + '</span>' +
      '<span class="ui-stat ui-stat--xp" aria-label="' + p.xp + ' XP">' + svg('bolt') + p.xp + '</span>';
    bar.appendChild(w);
  }
  function botaoIdioma(bar) {
    var p = eu(), c = CURSOS[p.idioma], b = document.createElement('button'); b.type = 'button'; b.className = 'lang-btn';
    b.setAttribute('aria-label', 'Curso atual: ' + c.nome + '. Trocar de idioma');
    b.innerHTML = '<span class="lang-code" aria-hidden="true">' + c.codigo + '</span>' + c.nome + svg('down');
    b.addEventListener('click', function () {
      folha(function (sh) {
        sh.insertAdjacentHTML('beforeend', '<span class="ui-label">Curso</span><h2>Qual idioma agora?</h2><p>O progresso de cada idioma fica separado.</p>');
        grupoRadio(sh, p.idiomas.map(function (k) { return { v: k, t: CURSOS[k].nome, code: CURSOS[k].codigo, val: p.progresso[k] + ' lições' }; }), p.idioma, function (v) {
          p.idioma = v; salvar(); setTimeout(function () { ir('trilha'); toast('Curso de ' + CURSOS[v].nome + ' aberto.'); }, 250);
        }, 'Idioma do curso');
      });
    });
    bar.appendChild(b);
  }

  /* folha inferior */
  var focoAntes = null;
  function folha(montar) {
    fecharFolha(); focoAntes = document.activeElement;
    var scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.addEventListener('click', fecharFolha);
    var sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.tabIndex = -1;
    sh.innerHTML = '<div class="grab" aria-hidden="true"></div>';
    montar(sh);
    var close = document.createElement('button'); close.type = 'button'; close.className = 'sheet-close';
    close.setAttribute('aria-label', 'Fechar janela'); close.textContent = '×';
    close.addEventListener('click', fecharFolha); sh.appendChild(close);
    var h = $('h2', sh); if (h) { h.id = 'sheet-t'; sh.setAttribute('aria-labelledby', 'sheet-t'); }
    document.body.appendChild(scrim); document.body.appendChild(sh); tocar('folha');
    root.inert = true; document.body.classList.add('has-sheet');
    sh.focus();
    sh.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharFolha();
      if (e.key === 'Tab') { var f = $$('button, [href], input, select, textarea, [tabindex]', sh).filter(function (el) { return !el.disabled && el.tabIndex >= 0 && el.getClientRects().length; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && (document.activeElement === a || document.activeElement === sh)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && (document.activeElement === z || document.activeElement === sh)) { e.preventDefault(); a.focus(); } }
    });
  }
  function fecharFolha() {
    var a = $('.sheet'), b = $('.scrim'); if (a) { tocar('fechar'); a.remove(); } if (b) b.remove();
    root.inert = false; document.body.classList.remove('has-sheet');
    if (focoAntes && focoAntes.isConnected) { try { focoAntes.focus(); } catch (e) {} } focoAntes = null;
  }

  var TELAS = {};

  /* =================================================================
     ENTRADA: boas-vindas → cadastro em 3 passos | entrar com PIN
     ================================================================= */
  TELAS.boasvindas = function () {
    var sh = document.createElement('div'); sh.className = 'shell ui-grid-bg';
    var e = document.createElement('main'); e.className = 'entry';
    e.innerHTML = '<div class="entry-top"><span class="wordmark"></span></div><div class="entry-hero"><span class="ui-label">Inglês · Francês · do A1 ao C1</span><h1>Do zero à conversa, no seu ritmo.</h1><p>Um curso completo, com gramática explicada, pronúncia e revisão na hora certa. Feito para estudar a dois.</p></div>' +
      '<div class="entry-actions"><button class="ui-btn ui-btn--primary ui-btn--block" id="bvComecar">Começar</button><button class="ui-btn ui-btn--ghost ui-btn--block" id="bvTenho">Já tenho perfil</button></div>';
    var wm = $('.wordmark', e); wm.appendChild(eco('neutral', '', true)); wm.appendChild(document.createTextNode('Idiomas'));
    $('.entry-hero', e).insertBefore(eco('neutral', 'Lumi, a mascote do app'), $('.entry-hero', e).firstChild);
    sh.appendChild(e); root.appendChild(sh);
    $('#bvComecar', e).addEventListener('click', function () {
      if (S.perfis.length >= 2) { toast('Já existem 2 perfis neste app. Entre com o seu.'); ir('entrar'); return; }
      cadastro = { idioma: 'fr', meta: 15, nome: '', pin: '' }; ir('cadastro', 1);
    });
    $('#bvTenho', e).addEventListener('click', function () { ir('entrar'); });
    S.visto = true; salvar();
  };

  var cadastro = null;
  TELAS.cadastro = function (passo) {
    var sh = document.createElement('div'); sh.className = 'shell';
    var e = document.createElement('main'); e.className = 'entry';
    e.innerHTML = '<div class="steps"><button class="icon-btn" id="cdVoltar" aria-label="Voltar">' + svg('back') + '</button>' +
      '<div class="ui-progress" role="progressbar" aria-label="Cadastro" aria-valuemin="0" aria-valuemax="3" aria-valuenow="' + passo + '"><div class="ui-progress__fill" style="width:' + (passo / 3 * 100) + '%"></div></div>' +
      '<span class="ui-label">' + passo + '/3</span></div><div class="step-body"></div>';
    var body = $('.step-body', e);
    var rodape = document.createElement('div'); rodape.className = 'entry-actions';
    var seguir = document.createElement('button'); seguir.className = 'ui-btn ui-btn--primary ui-btn--block'; seguir.textContent = 'Continuar';
    rodape.appendChild(seguir);
    if (passo === 1) {
      body.appendChild(eco('neutral', '', true));
      body.insertAdjacentHTML('beforeend', '<h1>Qual idioma você quer estudar primeiro?</h1><p class="lead">Você pode adicionar o outro depois, sem perder nada.</p>');
      grupoRadio(body, [{ v: 'fr', t: 'Francês', s: 'Do zero, com pronúncia desde o início', code: 'FR' }, { v: 'en', t: 'Inglês', s: 'Do básico à conversa do dia a dia', code: 'EN' }], cadastro.idioma, function (v) { cadastro.idioma = v; }, 'Idioma');
    } else if (passo === 2) {
      body.insertAdjacentHTML('beforeend', '<h1>Quanto tempo por dia?</h1><p class="lead">Constância vale mais do que maratona. Dá para mudar nas configurações.</p>');
      grupoRadio(body, [{ v: '5', t: 'Leve', s: 'Uma lição curta', val: '5 min' }, { v: '10', t: 'Regular', s: 'Uma lição e revisão', val: '10 min' }, { v: '15', t: 'Sério', s: 'Duas lições e revisão', val: '15 min' }, { v: '30', t: 'Intenso', s: 'Para avançar rápido', val: '30 min' }], String(cadastro.meta), function (v) { cadastro.meta = +v; }, 'Meta diária');
    } else {
      body.insertAdjacentHTML('beforeend', '<h1>Como você quer ser chamado?</h1><div class="field"><label for="cdNome">Seu nome</label><input class="input" id="cdNome" autocomplete="given-name" maxlength="20"></div><p class="lead" id="cdPinTit">Depois, crie um PIN de 4 números para entrar.</p>');
      var inp = $('#cdNome', body); inp.value = cadastro.nome;
      inp.addEventListener('input', function () { cadastro.nome = inp.value.trim(); });
      seguir.textContent = 'Criar PIN';
    }
    $('#cdVoltar', e).addEventListener('click', function () { if (passo === 1) ir('boasvindas'); else ir('cadastro', passo - 1); });
    seguir.addEventListener('click', function () {
      if (passo < 3) { ir('cadastro', passo + 1); return; }
      if (!cadastro.nome) { var i = $('#cdNome'); i.focus(); toast('Escreva seu nome para continuar.'); return; }
      ir('criarPin');
    });
    e.appendChild(rodape); sh.appendChild(e); root.appendChild(sh);
  };

  TELAS.criarPin = function () {
    var sh = document.createElement('div'); sh.className = 'shell';
    var e = document.createElement('main'); e.className = 'entry';
    e.innerHTML = '<div class="steps"><button class="icon-btn" id="cpVoltar" aria-label="Voltar">' + svg('back') + '</button><div class="ui-progress" aria-hidden="true"><div class="ui-progress__fill" style="width:100%"></div></div><span class="ui-label">3/3</span></div>' +
      '<div class="pin-wrap"><div class="step-body" style="flex:0;padding-bottom:0"><h1>Crie seu PIN</h1><p class="lead">4 números para alternar os perfis neste aparelho. A conta Google controla o acesso online.</p></div></div>';
    sh.appendChild(e); root.appendChild(sh);
    $('#cpVoltar', e).addEventListener('click', function () { ir('cadastro', 3); });
    var primeiro = null, h1 = $('h1', e);
    var tp = tecladoPin($('.pin-wrap', e), async function (v) {
      if (!primeiro) { primeiro = v; tp.limpar(); h1.textContent = 'Repita o PIN'; tp.msg('Digite de novo para confirmar.'); return; }
      if (v !== primeiro) { primeiro = null; h1.textContent = 'Crie seu PIN'; tp.erro('Os PINs não batem. Comece de novo.'); return; }
      var id = 'p' + Date.now().toString(36);
      var p = { id: id, nome: cadastro.nome, pinCredential: await PIN.create(v), idioma: cadastro.idioma, idiomas: ['fr', 'en'], desde: new Date().toLocaleDateString('pt-BR', {month:'short',year:'numeric'}), sequencia: 0, melhorSequencia: 0, xp: 0, hojeFeito: false, ultimoDia: '', semana: [0, 0, 0, 0, 0, 0, 0], xpSemana: [0, 0, 0, 0, 0, 0, 0], minutosHoje: 0, palavras: 0, progresso: { fr: 0, en: 0 }, metasHoje: { licoes: 0, revisadas: 0 }, motivos: [], avatar: cadastro.avatar || avatarAleatorio() };
      S.perfis.push(p); p.preferencias={meta:cadastro.meta}; S.cfg.meta = cadastro.meta; S.ativo = id; S.ultimo = id; salvar();
      /* LIGAR: google.script.run.criarPerfil({ nome, pinHash, idioma, meta }) — guarde só um hash do PIN na planilha. */
      ir('personagem', { novo: true });
    });
  };

  TELAS.entrar = function (id) {
    if (!S.perfis.length) { toast('Ainda não há perfis. Toque em Começar para criar o seu.'); ir('boasvindas'); return; }
    var sel = id || S.ultimo || S.perfis[0].id;
    var sh = document.createElement('div'); sh.className = 'shell';
    var e = document.createElement('main'); e.className = 'entry';
    e.innerHTML = '<div class="entry-top"><span class="wordmark"></span>' + (S.visto ? '' : '') + '</div><div class="pin-wrap"><div><span class="ui-label">Entrar</span><h1 style="margin:8px 0 20px;font-family:var(--font-display);font-weight:600;font-size:28px;line-height:34px;letter-spacing:-.02em">Quem vai estudar agora?</h1><div class="profiles" role="group" aria-label="Perfis"></div></div><p class="pin-msg" id="pinPara" style="margin-top:8px"></p></div>';
    var wm = $('.wordmark', e); wm.appendChild(eco('neutral', '', true)); wm.appendChild(document.createTextNode('Idiomas'));
    var box = $('.profiles', e);
    S.perfis.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ui-profile'; b.setAttribute('aria-pressed', String(p.id === sel));
      b.innerHTML = esc(p.nome) + '<small>' + p.idiomas.map(function (k) { return CURSOS[k].codigo; }).join(' · ') + '</small>'; b.insertBefore(avatar(p), b.firstChild);
      b.addEventListener('click', function () { ir('entrar', p.id); });
      box.appendChild(b);
    });
    if (S.perfis.length < 2) {
      var n = document.createElement('button'); n.type = 'button'; n.className = 'ui-profile'; n.setAttribute('aria-pressed', 'false');
      n.innerHTML = '<span class="ui-avatar ui-avatar--add" aria-hidden="true">+</span>Novo perfil<small>' + S.perfis.length + ' de 2</small>';
      n.addEventListener('click', function () { cadastro = { idioma: 'fr', meta: 15, nome: '', pin: '' }; ir('cadastro', 1); });
      box.appendChild(n);
    }
    var p = S.perfis.filter(function (x) { return x.id === sel; })[0];
    $('#pinPara', e).textContent = 'Digite o PIN de ' + p.nome;
    sh.appendChild(e); root.appendChild(sh);
    var erros = 0;
    var tp = tecladoPin($('.pin-wrap', e), async function (v) {
      /* LIGAR: confira o PIN no servidor (google.script.run.entrar(perfilId, pin)) em vez de no aparelho. */
      if (await PIN.verify(v, p)) { if(!p.pinCredential||p.pinCredential.alg!=='PBKDF2')p.pinCredential = await PIN.create(v); delete p.pin; S.ativo = p.id; S.ultimo = p.id; novoDia(p); salvar(); ir('hoje'); tocar('entrou'); }
      else { erros++; tp.erro(erros >= 3 ? 'PIN incorreto. Esqueceu? Peça para a outra pessoa redefinir nas configurações.' : 'PIN incorreto, tente de novo.'); }
    });
  };

  /* =================================================================
     TRILHA
     ================================================================= */
  TELAS.trilha = function () {
    var p = eu(); novoDia(p);
    var pg = casca('trilha', '', function (bar) { botaoIdioma(bar); seloStats(bar); });
    var c = curso(), feitas = p.progresso[p.idioma], meta = S.cfg.meta, todas = todasLicoes(c);
    var hello = document.createElement('section'); hello.className = 'card hello'; hello.setAttribute('aria-label', 'Meta de hoje');
    hello.appendChild(eco(p.hojeFeito ? 'happy' : 'neutral', p.hojeFeito ? 'Lumi, feliz' : 'Eco'));
    var pct = Math.min(100, Math.round(p.minutosHoje / meta * 100));
    hello.insertAdjacentHTML('beforeend', '<div class="hello-txt"><b>' + saudacao() + ', ' + esc(p.nome) + '.</b><div class="goal-line"><span>META DE HOJE</span><span>' + p.minutosHoje + '/' + meta + ' MIN</span></div>' +
      '<div class="ui-progress" role="progressbar" aria-label="Meta de hoje" aria-valuemin="0" aria-valuemax="' + meta + '" aria-valuenow="' + p.minutosHoje + '"><div class="ui-progress__fill" style="width:' + pct + '%"></div></div></div>');
    pg.appendChild(hello);
    var proxima = todas[feitas];
    var resume = document.createElement('section'); resume.className = 'resume-card';
    if (proxima) {
      var parcial = p.rascunhos && p.rascunhos[p.idioma + ':' + proxima.unidade.id + '-' + proxima.nome + ':normal'];
      resume.innerHTML = '<span class="ui-label">Seu próximo passo</span><h1>Continuar de onde parei</h1><p>' + esc(proxima.unidade.titulo) + '</p><strong>' + esc(proxima.nome) + '</strong><button class="ui-btn ui-btn--primary" type="button">Continuar lição ' + svg('play') + '</button>';
      if (parcial) { var savedNote=document.createElement('p'); savedNote.className='saved-note'; savedNote.textContent='Lição em andamento · respostas verificadas salvas neste aparelho'; resume.insertBefore(savedNote, $('button',resume)); $('button',resume).firstChild.textContent='Retomar lição '; }
      $('button', resume).addEventListener('click', function () { abrirLicaoApp(proxima.unidade, proxima.nome, {}); });
    } else {
      resume.innerHTML = '<span class="ui-label">Seu percurso</span><h1>Trilha concluída!</h1><p>Suas lições continuam disponíveis para revisar.</p><button class="ui-btn ui-btn--primary" type="button">Revisar</button>';
      $('button', resume).addEventListener('click', function () { ir('revisar'); });
    }
    pg.appendChild(resume);
    var discoverCard=document.createElement('section');discoverCard.className='card discover-entry';
    discoverCard.innerHTML='<div class="discover-entry-icon">'+svg('guias')+'</div><div><span class="ui-label">Outros jeitos de aprender</span><h2>Ler, explorar e descobrir</h2><p>Histórias, imagens e desafios para praticar no seu ritmo.</p></div><button class="ui-btn ui-btn--primary" type="button">Abrir Descobrir '+svg('chev')+'</button>';
    discoverCard.querySelector('button').onclick=function(){ir('descobrir');};pg.appendChild(discoverCard);

    var gi = 0, ordem = 0, nUn = 0;
    c.secoes.forEach(function (sec) {
      sec.unidades.forEach(function (u, ui) {
        var ini = gi, nU = u.licoes.length, feitasU = Math.max(0, Math.min(nU, feitas - ini)), ln = (nUn % 3) + 1;
        nUn++;
        var sct = document.createElement('section'); sct.className = 'linha l' + ln; sct.setAttribute('aria-label', 'Unidade ' + nUn + ': ' + u.titulo);
        sct.innerHTML = '<div class="linha-head"><span class="linha-badge" aria-hidden="true">' + nUn + '</span><div class="linha-txt"><span class="ui-label">' + esc(sec.titulo.split(' · ')[0]) + ' · ' + feitasU + ' de ' + nU + ' lições</span><h2>' + esc(u.titulo) + '</h2><p>' + esc(u.objetivo) + '</p></div>' +
          '<button class="linha-guia" type="button" aria-label="Abrir o guia da unidade ' + esc(u.titulo) + '">' + svg('guias') + '</button></div><ol class="estacoes"></ol>';
        $('.linha-guia', sct).addEventListener('click', function () { ir('guia', u.id); });
        if (feitas < ini) sct.classList.add('bloq');

        var ol = $('.estacoes', sct);
        u.licoes.forEach(function (nome, li) {
          var idx = gi++, estado = idx < feitas ? 'feita' : idx === feitas ? 'atual' : 'bloq', chk = li === nU - 1, tipo = TIPOS[Math.min(li, TIPOS.length - 1)];
          var prevFeita = idx - 1 < feitas, eraAtual = idx - 1 === feitas;
          var segCima = idx <= feitas ? 'on' : (eraAtual ? 'fluxo' : '');
          var segBaixo = idx < feitas ? 'on' : (estado === 'atual' ? 'fluxo' : '');
          var item = document.createElement('li'); item.className = 'est ' + estado + (chk ? ' final' : ''); item.style.setProperty('--i', ordem++);
          var estTxt = estado === 'feita' ? 'concluída' : estado === 'atual' ? 'lição atual' : 'bloqueada';
          var parada = '<div class="trilho"><span class="seg cima ' + segCima + '"></span><span class="seg baixo ' + segBaixo + '"></span>' +
            '<button class="parada" type="button" aria-label="' + esc(nome) + ', ' + tipo[1].toLowerCase() + ', ' + estTxt + '"' + (estado === 'bloq' ? ' aria-disabled="true"' : '') + '>' + svg(estado === 'bloq' ? 'lock' : tipo[0]) + '</button></div>';
          if (estado === 'atual') {
            item.innerHTML = parada + '<div class="est-card"><div class="aqui"><span class="ui-label">Lição atual · ' + (li + 1) + ' de ' + nU + '</span></div>' +
              '<h3>' + esc(nome) + '</h3><p>' + tipo[1] + ' · cerca de 4 minutos · +30 XP</p>' +
              '<div class="ui-progress" role="progressbar" aria-label="Progresso da linha" aria-valuemin="0" aria-valuemax="' + nU + '" aria-valuenow="' + feitasU + '"><div class="ui-progress__fill" style="width:' + Math.round(feitasU / nU * 100) + '%"></div></div>' +
              '<button class="ui-btn ui-btn--primary ui-btn--block" type="button">' + svg('play').replace('class="solid"', 'fill="currentColor" stroke="none"') + 'Começar</button></div>';
            $('.aqui', item).insertBefore(avatar(p, 40), $('.aqui', item).firstChild);
            $('.est-card .ui-btn', item).addEventListener('click', function () { abrirLicaoApp(u, nome, {}); });
            $('.parada', item).addEventListener('click', function () { abrirLicaoApp(u, nome, {}); });
          } else {
            item.innerHTML = parada + '<button class="est-card" type="button"><span class="t"><b>' + esc(nome) + '</b><small>' + tipo[1] + (estado === 'feita' ? ' · Concluída' : ' · Bloqueada') + '</small></span><span class="st">' + svg(estado === 'feita' ? 'check' : estado === 'bloq' ? 'lock' : 'chev') + '</span></button>';
            var abre = function () { detalheLicao(u, ui, li, nome, estado, chk, idx, tipo); };
            $('.parada', item).addEventListener('click', abre); $('.est-card', item).addEventListener('click', abre);
            $('.est-card', item).setAttribute('aria-label', esc(nome) + ', ' + tipo[1].toLowerCase() + ', ' + estTxt);
          }
          ol.appendChild(item);
        });
        var toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'unit-toggle';
        ol.id = 'unit-lessons-' + nUn;
        toggle.setAttribute('aria-controls', ol.id);
        var aberta = feitas >= ini && feitas < ini + nU;
        function abrirUnidade(on) {
          ol.hidden = !on; toggle.setAttribute('aria-expanded', String(on));
          toggle.innerHTML = '<span>' + (feitasU === nU ? 'Concluída' : feitas >= ini && feitas < ini + nU ? 'Em andamento' : 'Próxima unidade') + '</span><span>' + (on ? 'Recolher lições' : 'Ver ' + nU + ' lições') + '</span>';
        }
        toggle.addEventListener('click', function () { abrirUnidade(ol.hidden); });
        sct.insertBefore(toggle, ol); abrirUnidade(aberta);
        pg.appendChild(sct);
        if (feitasU === nU) studioTrailCard(pg, u);
      });
    });
  };


  /* =================================================================
     CENAS DA TRILHA — desenho próprio em SVG, cores pelos tokens da linha,
     animadas só com CSS (param com movimento reduzido)
     ================================================================= */
  var NUVENS = '<g class="c-nuvem"><g class="cw" opacity=".9"><ellipse cx="30" cy="26" rx="22" ry="9"/><ellipse cx="44" cy="20" rx="13" ry="10"/></g></g><g class="c-nuvem n2"><g class="cw" opacity=".75"><ellipse cx="20" cy="40" rx="16" ry="6"/><ellipse cx="30" cy="35" rx="9" ry="7"/></g></g>';
  var CHAO = '<rect class="cc" x="0" y="96" width="340" height="24"/>';
  function balao(x, y, txt, cls, lang) {
    var w = txt.length * 7.6 + 18;
    return '<g class="c-pop ' + (cls || '') + '"><path class="bal" d="M' + x + ' ' + y + 'h' + w + 'a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-' + (w - 16) + 'l-8 7v-7h-' + 8 + 'a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6z"/><text x="' + (x + 9) + '" y="' + (y + 16) + '"' + (lang ? ' lang="' + lang + '"' : '') + '>' + txt + '</text></g>';
  }
  var CENAS = {
    'fr-u1': function () { /* Paris: telhados, a torre e um "Bonjour !" */
      return NUVENS + '<circle class="cs c-bob" cx="296" cy="26" r="13"/>' +
        '<rect class="cb" x="14" y="58" width="44" height="40" rx="3"/><path class="ca" d="M10 60l26-14 26 14z"/><rect class="cw" x="22" y="68" width="9" height="12" rx="2"/><rect class="cw c-pisca" x="40" y="68" width="9" height="12" rx="2"/>' +
        '<rect class="cb" x="70" y="66" width="40" height="32" rx="3"/><path class="ca" d="M66 68l24-12 24 12z"/><rect class="cw c-pisca j2" x="80" y="74" width="8" height="10" rx="2"/>' +
        '<path class="ca" d="M222 98l12-40 4-28 2-12 2 12 4 28 12 40h-9l-6-16h-6l-6 16z"/><rect class="ca" x="226" y="56" width="28" height="4" rx="1"/><rect class="ca" x="232" y="34" width="16" height="3" rx="1"/>' +
        '<rect class="cb" x="270" y="62" width="50" height="36" rx="3"/><path class="ca" d="M266 64l29-14 29 14z"/><rect class="cw c-pisca j3" x="280" y="72" width="9" height="12" rx="2"/><rect class="cw" x="300" y="72" width="9" height="12" rx="2"/>' +
        CHAO + balao(118, 30, 'Bonjour !', '', 'fr') + balao(150, 58, 'Salut !', 'p2', 'fr');
    },
    'fr-u2': function () { /* café: toldo listrado, xícara com vapor e croissant */
      var toldo = ''; for (var i = 0; i < 9; i++) toldo += '<path class="' + (i % 2 ? 'cw' : 'ca') + '" d="M' + (i * 40) + ' 0h40v22a20 8 0 0 1-40 0z"/>';
      return toldo + '<rect class="cb" x="0" y="0" width="340" height="4"/>' +
        '<rect class="ck" x="96" y="78" width="150" height="8" rx="4"/><rect class="ck" x="166" y="86" width="10" height="14"/>' +
        '<path class="cw" d="M132 58h34v10a14 12 0 0 1-34 0z" stroke="var(--border-strong)" stroke-width="1.5"/><path class="tr" d="M166 62c8 0 8 9 0 9"/><ellipse class="ck" cx="149" cy="78" rx="24" ry="3"/>' +
        '<path class="tr c-vapor" d="M141 52c-4-5 4-8 0-13"/><path class="tr c-vapor v2" d="M150 50c-4-5 4-8 0-13"/><path class="tr c-vapor v3" d="M159 52c-4-5 4-8 0-13"/>' +
        '<path class="cs" d="M190 76c4-14 34-14 38 0-6-4-10-5-12-1-3-5-11-5-14 0-3-3-8-3-12 1z"/>' +
        '<rect class="ci" x="262" y="36" width="56" height="40" rx="6" opacity=".9"/><text x="272" y="54" style="fill:var(--surface-200);font-size:11px">CAFÉ</text><text x="272" y="68" style="fill:var(--sun);font-size:10px;font-family:var(--font-mono)">2,50 €</text>' +
        CHAO + balao(18, 44, 'Merci !', '', 'fr');
    },
    'fr-u3': function () { /* família: casa com janelas acesas, árvore e fumaça */
      return NUVENS + '<ellipse class="cb" cx="70" cy="104" rx="120" ry="26"/><ellipse class="cc" cx="290" cy="106" rx="110" ry="22"/>' +
        '<rect class="cw" x="132" y="52" width="76" height="46" rx="3" stroke="var(--border-strong)" stroke-width="1.5"/><path class="ca" d="M124 56l46-30 46 30z"/><rect class="ck" x="192" y="28" width="9" height="18"/>' +
        '<circle class="ck c-vapor" cx="197" cy="22" r="5"/><circle class="ck c-vapor v2" cx="200" cy="16" r="4"/>' +
        '<rect class="cs c-pisca" x="142" y="62" width="14" height="12" rx="2"/><rect class="cs c-pisca j2" x="184" y="62" width="14" height="12" rx="2"/><rect class="ca" x="162" y="74" width="16" height="24" rx="3"/>' +
        '<g class="c-balanca"><rect class="ck" x="262" y="66" width="7" height="32" rx="2"/><circle class="ca" cx="265" cy="54" r="20"/><circle class="cb" cx="252" cy="62" r="10"/></g>' +
        '<path class="ce c-bob" d="M60 44c0-6 8-6 8 0 0-6 8-6 8 0 0 6-8 10-8 12 0-2-8-6-8-12z"/>';
    },
    'en-u1': function () { /* cidade com torre do relógio e dois "olás" */
      return NUVENS + '<circle class="cs c-bob" cx="40" cy="28" r="12"/>' +
        '<rect class="cb" x="20" y="64" width="40" height="34" rx="3"/><rect class="cb" x="64" y="54" width="30" height="44" rx="3"/><rect class="cw c-pisca" x="72" y="62" width="6" height="8"/><rect class="cw c-pisca j3" x="82" y="76" width="6" height="8"/>' +
        '<rect class="ca" x="236" y="30" width="26" height="68" rx="2"/><path class="ca" d="M234 32l15-20 15 20z"/><circle class="cw" cx="249" cy="46" r="9"/>' +
        '<g class="c-gira lento" style="transform-origin:249px 46px;transform-box:view-box"><rect class="ci" x="248" y="39" width="2" height="8" rx="1"/></g><rect class="ci" x="248" y="45" width="6" height="2" rx="1"/>' +
        '<rect class="cb" x="272" y="60" width="44" height="38" rx="3"/><rect class="cw c-pisca j2" x="282" y="70" width="8" height="10" rx="2"/><rect class="cw" x="298" y="70" width="8" height="10" rx="2"/>' +
        CHAO + balao(108, 30, 'Hello!', '', 'en') + balao(150, 58, 'Hi there!', 'p2', 'en');
    },
    'en-u2': function () { /* aeroporto: avião cruzando, torre e painel de voos */
      return NUVENS + '<rect class="ck" x="0" y="96" width="340" height="24"/>' + [20, 80, 140, 200, 260, 320].map(function (x) { return '<rect class="cw" x="' + x + '" y="106" width="26" height="3" rx="1.5"/>'; }).join('') +
        '<rect class="cb" x="40" y="44" width="12" height="52"/><path class="ca" d="M30 44h32l-4-14h-24z"/><rect class="cw c-pisca" x="36" y="34" width="20" height="6" rx="2"/>' +
        '<rect class="ci" x="214" y="40" width="104" height="44" rx="6" opacity=".92"/><text x="222" y="56" style="fill:var(--surface-200);font-size:10px;font-family:var(--font-mono)">GATE 12</text><text x="222" y="72" style="fill:var(--sun);font-size:10px;font-family:var(--font-mono)" class="c-pisca">BOARDING</text>' +
        '<g class="c-aviao"><path class="ca" d="M0 14h46c6 0 10 3 10 5s-4 5-10 5H8L0 14z"/><path class="cb" d="M20 18l-8 14h8l14-14zM20 14l-6-10h6l10 10z"/><circle class="cw" cx="44" cy="18" r="2"/><circle class="cw" cx="36" cy="18" r="2"/><circle class="cw" cx="28" cy="18" r="2"/></g>';
    },
    'en-u3': function () { /* rotina: sol e lua girando no céu, relógio e casa */
      return '<g class="c-ceu"><circle class="cs" cx="170" cy="-6" r="14"/><circle class="ck" cx="170" cy="126" r="11"/><circle class="cw" cx="175" cy="122" r="9"/></g>' +
        '<ellipse class="cb" cx="170" cy="118" rx="210" ry="30"/>' +
        '<rect class="cw" x="40" y="56" width="56" height="40" rx="3" stroke="var(--border-strong)" stroke-width="1.5"/><path class="ca" d="M34 60l34-22 34 22z"/><rect class="cs c-pisca" x="50" y="66" width="12" height="11" rx="2"/><rect class="ca" x="72" y="72" width="13" height="24" rx="3"/>' +
        '<circle class="cw" cx="270" cy="56" r="26" stroke="var(--border-strong)" stroke-width="2"/><circle class="ci" cx="270" cy="56" r="2.5"/>' +
        '<g class="c-gira" style="transform-origin:270px 56px;transform-box:view-box"><rect class="ca" x="269" y="36" width="2.5" height="20" rx="1.2"/></g>' +
        '<g class="c-gira lento" style="transform-origin:270px 56px;transform-box:view-box"><rect class="ci" x="268.5" y="43" width="3" height="13" rx="1.5"/></g>' +
        balao(118, 40, '7:30 AM', '', 'en');
    }
  };
  function cena(id) {
    var f = CENAS[id] || function () { return NUVENS + '<ellipse class="cb" cx="80" cy="110" rx="140" ry="28"/><ellipse class="cc" cx="280" cy="112" rx="120" ry="24"/>'; };
    return '<div class="cena" aria-hidden="true"><svg viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">' + f() + '</svg></div>';
  }

  /* =================================================================
     PLACAR DA SEMANA — vocês dois, com meta em conjunto
     LIGAR: no Apps Script, xpSemana de cada perfil vem da aba de histórico da planilha.
     ================================================================= */
  function soma(l) { return (l || []).reduce(function (a, b) { return a + b; }, 0); }
  function placar() {
    var p = eu(), outro = S.perfis.filter(function (x) { return x.id !== p.id; })[0];
    var sec = document.createElement('section'); sec.className = 'card placar'; sec.setAttribute('aria-label', 'Placar da semana');
    if (!outro) {
      sec.innerHTML = '<p class="ui-label">Placar da semana</p><p class="lead" style="margin:0;font-size:14px">Estude junto com alguém: cada pessoa tem o próprio perfil e PIN, e o placar de vocês aparece aqui.</p><button class="ui-btn ui-btn--secondary ui-btn--block" type="button">Criar o segundo perfil</button>';
      $('button', sec).addEventListener('click', function () { cadastro = { idioma: 'fr', meta: 15, nome: '', pin: '' }; ir('cadastro', 1); });
      return sec;
    }
    [p, outro].forEach(novoDia);
    var a = [{ p: p, xp: soma(p.xpSemana) }, { p: outro, xp: soma(outro.xpSemana) }];
    var mx = Math.max(1, a[0].xp, a[1].xp), lider = a[0].xp === a[1].xp ? null : (a[0].xp > a[1].xp ? a[0] : a[1]);
    var dif = Math.abs(a[0].xp - a[1].xp), faltam = 6 - hojeIdx(), juntos = a[0].xp + a[1].xp, metaJ = S.cfg.metaJuntos;
    sec.innerHTML = '<div class="placar-top"><p class="ui-label">Placar da semana</p><span class="pill">' + (faltam === 0 ? 'termina hoje' : 'termina em ' + faltam + (faltam === 1 ? ' dia' : ' dias')) + '</span></div>';
    a.forEach(function (x, i) {
      var r = document.createElement('div'); r.className = 'placar-row' + (i ? ' outro' : '') + (lider === x ? ' lider' : '');
      var dias = x.p.semana.filter(function (m) { return m > 0; }).length;
      r.innerHTML = '<div><div class="placar-nome"><b>' + esc(x.p.nome) + (i ? '' : ' <small>você</small>') + (lider === x ? '<span class="placar-lider">' + svg('trophy') + 'na frente</span>' : '') + '</b><span class="mono">' + x.xp + ' XP</span></div>' +
        '<div class="ui-progress" role="progressbar" aria-label="XP de ' + esc(x.p.nome) + ' nesta semana" aria-valuemin="0" aria-valuemax="' + mx + '" aria-valuenow="' + x.xp + '"><div class="ui-progress__fill" style="width:' + (x.xp / mx * 100) + '%"></div></div>' +
        '<p class="sub">' + dias + (dias === 1 ? ' dia' : ' dias') + ' de estudo · ' + (x.p.hojeFeito ? 'estudou hoje' : 'ainda não hoje') + '</p></div>';
      r.insertBefore(avatar(x.p, 46, lider === x ? 'feliz' : null), r.firstChild);
      sec.appendChild(r);
    });
    var msg = !lider ? 'Empate. A próxima lição desempata.' :
      (lider.p === p ? 'Você está ' + dif + ' XP à frente.' : esc(outro.nome) + ' está ' + dif + ' XP à frente.') + (dif <= 30 ? ' Uma lição muda o placar.' : faltam > 0 ? ' Dá tempo de virar até domingo.' : '');
    sec.insertAdjacentHTML('beforeend', '<p class="placar-msg">' + msg + '</p>' +
      '<div class="juntos"><div class="placar-juntos"><span>META DE VOCÊS DOIS</span><span>' + Math.min(juntos, metaJ) + '/' + metaJ + ' XP</span></div>' +
      '<div class="ui-progress" role="progressbar" aria-label="Meta de vocês dois nesta semana" aria-valuemin="0" aria-valuemax="' + metaJ + '" aria-valuenow="' + Math.min(juntos, metaJ) + '"><div class="ui-progress__fill" style="width:' + Math.min(100, juntos / metaJ * 100) + '%"></div></div></div>');
    return sec;
  }

  function detalheLicao(u, ui, li, nome, estado, chk, idx, tipo) {
    folha(function (sh) {
      sh.insertAdjacentHTML('beforeend', '<span class="ui-label">Unidade ' + (ui + 1) + ' · ' + tipo[1] + '</span><h2>' + esc(nome) + '</h2>');
      if (estado === 'bloq') {
        sh.insertAdjacentHTML('beforeend', '<p>Termine as lições anteriores para abrir esta. Se você já sabe este conteúdo, faça o teste da unidade.</p><div class="actions"><button class="ui-btn ui-btn--secondary ui-btn--block" id="dlTeste">Fazer teste para pular</button><button class="ui-btn ui-btn--ghost ui-btn--block" id="dlFechar">Fechar</button></div>');
        $('#dlTeste', sh).addEventListener('click', function () { abrirLicaoApp(u, 'Teste para pular', { teste: true, idx: idx }); });
      } else {
        sh.insertAdjacentHTML('beforeend', '<p>' + (chk ? 'Revisão com tudo o que a unidade ensinou.' : 'Uma prática curta de escuta, leitura ou montagem de frases. Você pode pausar e retomar.') + '</p>' +
          '<div class="chips"><span class="pill">' + svg('bolt') + '+30 XP</span><span class="pill">' + svg('ear') + 'Áudio</span>' + (S.cfg.fala ? '<span class="pill">' + svg('mic') + 'Fala</span>' : '') + '</div>' +
          '<div class="actions"><button class="ui-btn ui-btn--primary ui-btn--block" id="dlIr">' + (estado === 'feita' ? 'Refazer lição' : 'Começar lição') + '</button><button class="ui-btn ui-btn--ghost ui-btn--block" id="dlGuia">Ler o guia antes</button></div>');
        $('#dlIr', sh).addEventListener('click', function () { abrirLicaoApp(u, nome, { refazer: estado === 'feita' }); });
        $('#dlGuia', sh).addEventListener('click', function () { ir('guia', u.id); });
      }
      var f = $('#dlFechar', sh); if (f) f.addEventListener('click', fecharFolha);
    });
  }

  /* =================================================================
     LIÇÃO (usa abrirLicao, definida acima)
     ================================================================= */
  function abrirLicaoApp(u, nome, op) {
    uxExit='hoje';
    fecharFolha();
    if (!u) u = { id: (eu() ? eu().idioma : 'en') + '-erros', titulo: (op && op.licao && op.licao.titulo) || nome || 'Revisão', objetivo: 'Revisar o que você errou' };
    var p = eu(), base = (op && op.licao) ? op.licao : (op && op.revisao ? LICOES['rev|' + p.idioma] : LICOES[u.id + '|' + ((op && op.teste) || nome === 'Prática do guia' ? 'Revisão da unidade' : nome)]);
    var licao = { id: (op && op.licao) ? 'erros-' + Date.now() : u.id + '-' + nome, idioma: base.idioma, unidade: (op && op.licao) ? base.titulo : (op && op.revisao) ? 'Revisão de palavras' : u.titulo + ' · ' + nome, nivel: base.nivel || '', exercicios: base.exercicios };
    IdiomasAudio.stop();
    var modo = op && op.revisao ? 'revisao' : op && op.teste ? 'teste' : op && op.refazer ? 'refazer' : 'normal';
    var draftKey = p.idioma + ':' + licao.id + ':' + modo;
    p.rascunhos = p.rascunhos || {};
    var signature = JSON.stringify(licao.exercicios), draft = p.rascunhos[draftKey];
    if (draft && draft.signature !== signature) { delete p.rascunhos[draftKey]; draft = null; }
    root.innerHTML = '<div class="app ux licao">' +
      '<header class="top"><button class="icon-btn" id="sair" aria-label="Sair da lição">' + svg('back').replace('M15 5l-7 7 7 7', 'M6 6l12 12M18 6L6 18') + '</button>' +
      '<span class="combo" id="combo" hidden></span><div class="ui-progress" id="barra" role="progressbar" aria-label="Progresso da lição" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0"><div class="ui-progress__fill" style="width:0%"></div></div>' +
      '<span class="ui-stat ui-stat--streak" id="seqTopo">' + svg('flame') + '<span></span></span></header>' +
      '<main id="tela"></main><footer class="rodape" id="rodape"><div id="banner"></div><button class="ui-btn ui-btn--primary ui-btn--block" id="acao" disabled>Verificar</button></footer><p class="sr" id="anuncio" role="status" aria-live="polite"></p></div>';
    window.scrollTo(0, 0);
    root.querySelector('.top').appendChild(uxQuickButton());
    var feitosSemana = p.semana.slice(0, hojeIdx() + (p.hojeFeito ? 1 : 0)).filter(function (m) { return m > 0; }).length;
    var perfilLicao = { nome: p.nome, sequencia: p.sequencia, diasFeitosNaSemana: feitosSemana, xpPorAcerto: 10, hojeFeito: p.hojeFeito,
      semanaDias: p.semana.map(function (m) { return m > 0; }), hoje: hojeIdx() };
    abrirLicao(licao, perfilLicao, {
      aposExercicio: function(box){uxHelp(box,{unit:u});},
      decorateFim: function(box,r){uxDecorateFim(box,r,u);},
      rascunho: draft,
      salvarRascunho: function (value) { value.signature = signature; p.rascunhos[draftKey] = value; salvar(); },
      mudarVelocidade: function (value) { S.cfg.voz=value; salvar(); },
      velocidadeVoz: S.cfg.voz,
      som: tocar,
      avatarFeliz: '<span class="av" aria-hidden="true">' + avatarImg(p.avatar, 'feliz') + '</span>',
      sair: function () { ir('trilha'); },
      concluir: function (r) {
        novoDia(p); delete p.rascunhos[draftKey]; IdiomasAudio.stop();
        if (op && op.teste) { if (r.acertos === r.tentativas) p.progresso[licao.idioma.slice(0,2)] = Math.min(300,Math.max(p.progresso[licao.idioma.slice(0,2)], op.idx)); }
        else if (!(op && (op.refazer || op.revisao || op.licao))) p.progresso[licao.idioma.slice(0,2)] = Math.min(300,Math.max(p.progresso[licao.idioma.slice(0,2)],todasLicoes(CURSOS[licao.idioma.slice(0,2)]).findIndex(function(x){return x.unidade.id===u.id&&x.nome===nome;})+1));
        if (!p.hojeFeito) { p.sequencia++; p.melhorSequencia = Math.max(p.melhorSequencia, p.sequencia); p.hojeFeito = true; }
        p.ultimoDia = hojeStr(); p.xp += r.xp; p.xpSemana[hojeIdx()] += r.xp; p.minutosHoje += Math.max(1, r.minutos); p.semana[hojeIdx()] = p.minutosHoje;
        p.metasHoje.licoes++; if (op && op.revisao) p.metasHoje.revisadas += 8;
        salvar();
        /* LIGAR: google.script.run.concluirLicao(p.id, licao.id, r); */
        uxRecord({kind:'lesson',title:u.titulo+' · '+nome,detail:u.objetivo||'Lição praticada',correct:r.acertos,attempts:r.tentativas});
        if (op && op.aoConcluir) { op.aoConcluir(r); return; }
        ir(uxExit); toast('Prática salva. +'+r.xp+' XP.');
      }
    });
  }

  /* =================================================================
     GUIAS
     ================================================================= */
  TELAS.guias = function () {
    var p = eu(), c = curso(), feitas = p.progresso[p.idioma], gi = 0;
    var pg = casca('guias', 'Guias', function (bar) { botaoIdioma(bar); });
    pg.insertAdjacentHTML('beforeend', '<p class="lead">Explicação de gramática, vocabulário e pronúncia de cada unidade. Leia antes ou depois das lições.</p>');
    c.secoes.forEach(function (sec) {
      var ul = document.createElement('ul'); ul.className = 'list';
      sec.unidades.forEach(function (u, ui) {
        var aberta = gi <= feitas; gi += u.licoes.length;
        var li = document.createElement('li');
        li.innerHTML = '<button class="row guide-row' + (aberta ? '' : ' locked') + '" type="button"><span class="ic">' + svg(aberta ? 'book' : 'lock') + '</span><span class="txt">Unidade ' + (ui + 1) + ' · ' + esc(u.titulo) + '<small>' + esc(u.objetivo) + '</small></span><span class="chev">' + svg('chev') + '</span></button>';
        $('button', li).addEventListener('click', function () { if (aberta) ir('guia', u.id); else toast('Este guia abre quando você chegar à unidade ' + (ui + 1) + '.'); });
        ul.appendChild(li);
      });
      var t = document.createElement('div'); t.innerHTML = '<p class="ui-label sec-title">' + esc(sec.titulo) + '</p>'; t.appendChild(ul); pg.appendChild(t);
    });
  };

  TELAS.guia = function (id) {
    var k = id.slice(0, 2), c = CURSOS[k], u = null, ui = 0;
    c.secoes.forEach(function (s) { s.unidades.forEach(function (x, i) { if (x.id === id) { u = x; ui = i; } }); });
    var g = GUIAS[id];
    var pg = casca('guias', '', function (bar) {
      var b = document.createElement('button'); b.className = 'icon-btn'; b.setAttribute('aria-label', 'Voltar para os guias'); b.innerHTML = svg('back'); b.addEventListener('click', function () { ir('guias'); });
      bar.appendChild(b); bar.insertAdjacentHTML('beforeend', '<h1>Guia · ' + esc(u.titulo) + '</h1>');
    });
    pg.insertAdjacentHTML('beforeend', '<div><span class="ui-label">' + c.nome + ' · Unidade ' + (ui + 1) + '</span><h2 class="h" style="margin-top:6px">' + esc(u.objetivo) + '</h2></div>');
    if (!g) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p class="lead">O guia desta unidade ainda não foi escrito.</p></div>'); return; } // LIGAR: conteúdo da planilha
    var voc = document.createElement('details'); voc.className = 'card guide-section'; voc.open = true;
    voc.innerHTML = '<summary>Frases-chave</summary><table class="vocab"><thead><tr><th scope="col">' + c.nome + '</th><th scope="col">Português</th></tr></thead><tbody>' +
      g.vocab.map(function (v, i) { return '<tr><td lang="' + k + '">' + esc(v[0]) + '<button class="say" type="button" data-i="' + i + '" aria-label="Ouvir ' + esc(v[0]) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></button></td><td>' + esc(v[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
    $$('.say', voc).forEach(function (b) { var v=g.vocab[+b.dataset.i]; b.replaceWith(IdiomasAudio.player(v[0],c.voz,null,S.cfg.voz,function(rate){S.cfg.voz=rate;salvar();})); });
    pg.appendChild(voc);
    g.blocos.forEach(function (bl) {
      var s = document.createElement('details'); s.className = 'card prose guide-section';
      s.innerHTML = '<summary>' + esc(bl.titulo) + '</summary><div class="guide-content">' + bl.texto + (bl.exemplo ? '<div class="ex-box" lang="' + k + '">' + esc(bl.exemplo) + '</div>' : '') + '</div>';
      pg.appendChild(s);
    });
    var download=studioButton('Baixar áudio desta unidade para usar sem internet',function(){var sw=navigator.serviceWorker&&navigator.serviceWorker.controller;if(!sw){toast('Instale ou reabra o aplicativo para baixar o áudio.');return;}download.disabled=true;download.textContent='Baixando áudio…';var channel=new MessageChannel(),timeout=setTimeout(function(){download.disabled=false;download.textContent='Não foi possível baixar. Tentar novamente';},60000);channel.port1.onmessage=function(e){clearTimeout(timeout);download.disabled=false;download.textContent=e.data.ok?'Áudio disponível neste aparelho':'Não foi possível baixar. Tentar novamente';};sw.postMessage({type:'download-unit',unit:k+'|'+(Number(id.split('-u')[1])-1)},[channel.port2]);});pg.appendChild(download);
    var go = document.createElement('button'); go.className = 'ui-btn ui-btn--primary ui-btn--block'; go.textContent = 'Praticar esta unidade';
    go.addEventListener('click', function () { var p = eu(); p.idioma = k; salvar(); abrirLicaoApp(u, 'Prática do guia', { refazer: true }); });
    pg.appendChild(go);
  };

  /* =================================================================
     REVISAR (revisão espaçada)
     ================================================================= */
  TELAS.revisar = function () {
    var p = eu(), k = p.idioma, lista = PALAVRAS[k].slice().sort(function (a, b) { return a[2] - b[2]; });
    var hoje = lista.filter(function (w) { return w[3] <= Date.now(); });
    var pg = casca('revisar', 'Revisar', function (bar) { botaoIdioma(bar); });
    var top = document.createElement('section'); top.className = 'card';
    top.innerHTML = '<div class="due"><span class="num">' + hoje.length + '</span><div class="txt"><b>palavras para hoje</b><p class="lead">Revise as expressões vencidas. Acertos aumentam o intervalo; erros trazem a expressão de volta antes.</p></div></div>';
    var b = document.createElement('button'); b.className = 'ui-btn ui-btn--primary ui-btn--block'; b.style.marginTop = '16px'; b.textContent = hoje.length ? 'Revisar agora' : 'Nada para hoje';
    b.disabled = !hoje.length;
    b.addEventListener('click', function () { abrirLicaoApp({ id: k + '-rev', titulo: 'Revisão' }, 'Palavras do dia', { revisao: true }); });
    top.appendChild(b); pg.appendChild(top);
    var sec = document.createElement('div'); sec.innerHTML = '<p class="ui-label sec-title">Suas palavras · ' + CURSOS[k].nome + '</p>';
    var ul = document.createElement('ul'); ul.className = 'list';
    lista.forEach(function (w) {
      var li = document.createElement('li');
      li.innerHTML = '<div class="row word-row"><button class="say" type="button" aria-label="Ouvir ' + esc(w[0]) + '" style="margin:0"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></button><span class="txt"><b lang="' + k + '">' + esc(w[0]) + '</b><small>' + esc(w[1]) + '</small></span>' +
        '<span class="strength' + (w[2] <= 2 ? ' low' : '') + '" role="img" aria-label="Memória ' + w[2] + ' de 5">' + [1, 2, 3, 4, 5].map(function (n) { return '<i class="' + (n <= w[2] ? 'on' : '') + '"></i>'; }).join('') + '</span></div>';
      $('.say', li).remove(); li.appendChild(IdiomasAudio.player(w[0],CURSOS[k].voz,null,S.cfg.voz,function(rate){S.cfg.voz=rate;salvar();}));
      ul.appendChild(li);
    });
    sec.appendChild(ul); pg.appendChild(sec);
    pg.insertAdjacentHTML('beforeend', '<div class="legend"><span><i style="background:var(--primary)"></i>bem guardada</span><span><i style="background:var(--sun-shadow)"></i>precisa revisar</span></div>');
  };

  /* =================================================================
     PROGRESSO
     ================================================================= */
  TELAS.progresso = function () {
    var p = eu(), meta = S.cfg.meta, h = hojeIdx();
    var pg = casca('progresso', 'Progresso', function (bar) { seloStats(bar); });
    var all=todasLicoes(curso()), done=Math.min(all.length,p.progresso[p.idioma]), current=all[done];
    var overview=document.createElement('section'); overview.className='card progress-overview';
    overview.innerHTML='<span class="ui-label">Seu percurso · '+esc(curso().nome)+'</span><h2>'+esc(current ? current.unidade.titulo : 'Trilha concluída')+'</h2><p>'+done+' de '+all.length+' lições concluídas</p><div class="ui-progress" role="progressbar" aria-label="Lições concluídas" aria-valuemin="0" aria-valuemax="'+all.length+'" aria-valuenow="'+done+'"><div class="ui-progress__fill" style="width:'+(all.length ? done/all.length*100 : 0)+'%"></div></div><p>Hoje: '+p.minutosHoje+' de '+meta+' minutos</p>';
    pg.appendChild(overview);
    var st = document.createElement('section'); st.className = 'card streak-mini';
    st.innerHTML = '<svg class="fl" viewBox="0 0 44 54" aria-hidden="true"><path d="M22 2c3 9 16 15 16 31a16 16 0 0 1-32 0c0-7 3-11 7-14 0 6 3 9 6 9 0-11-3-17 3-26z" fill="var(--error)"/><path d="M22 20c2 6 9 9 9 18a9 9 0 0 1-18 0c0-4 2-6 4-8 0 3 2 5 3 5 0-6-1-9 2-15z" fill="var(--sun)"/></svg>' +
      '<div><div><span class="n">' + p.sequencia + '</span> <span class="muted">' + nDias(p.sequencia).replace(/^\d+ /, '') + '</span></div><div class="dots7" role="img" aria-label="Dias estudados nesta semana: ' + p.semana.filter(function (m) { return m > 0; }).length + ' de 7">' +
      DIAS.map(function (d, i) { return '<i class="' + (p.semana[i] > 0 ? 'on' : '') + '">' + (p.semana[i] > 0 ? '' : d) + '</i>'; }).join('') + '</div><p class="lead" style="margin-top:8px;font-size:13px">Recorde: ' + p.melhorSequencia + (p.melhorSequencia === 1 ? ' dia' : ' dias') + '</p></div>';
    pg.appendChild(st);
    var mx = Math.max(meta * 1.4, Math.max.apply(null, p.semana) + 4);
    var wk = document.createElement('section'); wk.className = 'card';
    wk.innerHTML = '<p class="ui-label sec-title">Minutos por dia · esta semana</p><div class="week" role="img" aria-label="' + p.semana.map(function (m, i) { return DIAS_NOME[i] + ' ' + m + ' minutos'; }).join(', ') + '. Meta: ' + meta + ' minutos.">' +
      p.semana.map(function (m, i) { return '<div class="bar' + (m >= meta ? ' ok' : '') + (i === h ? ' today' : '') + '"><span style="bottom:calc(' + (m / mx * 100) + '% + 4px)">' + (m || '') + '</span><i style="height:' + (m / mx * 100) + '%"></i></div>'; }).join('') +
      '<div class="goal-mark" style="bottom:' + (meta / mx * 100) + '%"><span>meta ' + meta + '</span></div></div>' +
      '<div class="week-days" aria-hidden="true">' + DIAS.map(function (d, i) { return '<span class="' + (i === h ? 'today' : '') + '">' + d + '</span>'; }).join('') + '</div>' +
      '<div class="legend"><span><i style="background:var(--primary)"></i>bateu a meta</span><span><i style="background:var(--border-strong)"></i>abaixo da meta</span></div>';
    pg.appendChild(wk);
    var metas = document.createElement('div'); metas.innerHTML = '<p class="ui-label sec-title">Metas de hoje</p>';
    var mg = document.createElement('div'); mg.style.cssText = 'display:grid;gap:12px';
    [['bolt', 'Estudar ' + meta + ' minutos', p.minutosHoje, meta], ['check', 'Terminar 1 lição', p.metasHoje.licoes, 1], ['revisar', 'Revisar 8 palavras', p.metasHoje.revisadas, 8]].forEach(function (g) {
      var ok = g[2] >= g[3], v = Math.min(g[2], g[3]);
      mg.insertAdjacentHTML('beforeend', '<div class="ui-goal' + (ok ? ' ui-goal--done' : '') + '"><span class="ui-goal__icon">' + (ok ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2L6.6 12l1.6-1.6 2.6 2.6 5-5 1.6 1.6z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/></svg>') + '</span><div class="ui-goal__body"><div class="ui-goal__top"><p class="ui-goal__title">' + g[1] + '</p><span class="ui-goal__count">' + (ok ? 'Concluída' : v + ' de ' + g[3]) + '</span></div>' +
        '<div class="ui-progress" role="progressbar" aria-label="' + g[1] + '" aria-valuemin="0" aria-valuemax="' + g[3] + '" aria-valuenow="' + v + '"><div class="ui-progress__fill" style="width:' + (v / g[3] * 100) + '%"></div></div></div></div>');
    });
    metas.appendChild(mg); pg.insertBefore(metas, st);
    var cur = document.createElement('div'); cur.innerHTML = '<p class="ui-label sec-title">Por idioma</p>';
    var gr = document.createElement('div'); gr.className = 'ui-statgrid';
    p.idiomas.forEach(function (k) {
      var tot = todasLicoes(CURSOS[k]).length, f = p.progresso[k];
      gr.insertAdjacentHTML('beforeend', '<div class="ui-statcard"><span class="ui-statcard__icon ui-statcard__icon--primary"><span class="mono" style="font-size:11px;font-weight:600">' + CURSOS[k].codigo + '</span></span><div><p class="ui-statcard__value">' + Math.round(f / tot * 100) + '%</p><p class="ui-statcard__label">' + CURSOS[k].nome + ' · ' + f + ' de ' + tot + ' lições</p></div></div>');
    });
    gr.insertAdjacentHTML('beforeend', '<div class="ui-statcard"><span class="ui-statcard__icon ui-statcard__icon--sun"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/></svg></span><div><p class="ui-statcard__value">' + p.xp.toLocaleString('pt-BR') + '</p><p class="ui-statcard__label">XP total</p></div></div>' +
      '<div class="ui-statcard"><span class="ui-statcard__icon ui-statcard__icon--primary"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H8l-4 4z"/></svg></span><div><p class="ui-statcard__value">' + p.palavras + '</p><p class="ui-statcard__label">Palavras aprendidas</p></div></div>');
    cur.appendChild(gr); pg.appendChild(cur);
    var extras=document.createElement('details'); extras.className='card guide-section'; extras.innerHTML='<summary>Estatísticas e placar</summary>'; extras.appendChild(st); extras.appendChild(cur); extras.appendChild(placar()); pg.appendChild(extras);
  };

  /* =================================================================
     PERFIL
     ================================================================= */
  TELAS.perfil = function () {
    var p = eu();
    var pg = casca('perfil', 'Perfil', function (bar) {
      var b = document.createElement('button'); b.className = 'icon-btn'; b.setAttribute('aria-label', 'Configurações'); b.innerHTML = svg('gear'); b.addEventListener('click', function () { ir('config'); }); bar.appendChild(b);
    });
    var head = document.createElement('section'); head.className = 'prof-head';
    var top = document.createElement('div'); top.className = 'prof-top'; top.appendChild(avatar(p));
    var who = document.createElement('div'); who.className = 'who';
    edicaoInline(who, p.nome, 'Seu nome', 26, function (v) { p.nome = v; salvar(); toast('Nome salvo.'); /* LIGAR: google.script.run.salvarPerfil(p) */ });
    who.insertAdjacentHTML('beforeend', '<p class="lead" style="font-size:14px">Estudando desde ' + p.desde + '</p>');
    top.appendChild(who); head.appendChild(top);
    head.insertAdjacentHTML('beforeend', '<div class="pills" style="margin-top:12px">' + p.idiomas.map(function (k) { return '<span class="pill"><span class="lang-code" aria-hidden="true">' + CURSOS[k].codigo + '</span>' + CURSOS[k].nome + '</span>'; }).join('') +
      (p.motivos || []).map(function (m) { return '<span class="pill">' + esc(m) + '</span>'; }).join('') + '</div>');
    var cb = document.createElement('button'); cb.type = 'button'; cb.className = 'ui-btn ui-btn--secondary ui-btn--block custom-btn'; cb.innerHTML = svg('perfil') + 'Editar meu personagem';
    cb.addEventListener('click', function () { ir('personagem'); }); head.appendChild(cb);
    pg.appendChild(head);
    var g = document.createElement('div'); g.innerHTML = '<p class="ui-label sec-title">Visão geral</p>';
    var gr = document.createElement('div'); gr.className = 'ui-statgrid';
    [['sun', 'flame', p.sequencia, p.sequencia === 1 ? 'Dia seguido' : 'Dias seguidos'], ['primary', 'trophy', p.melhorSequencia, 'Recorde de dias'], ['sun', 'bolt', p.xp.toLocaleString('pt-BR'), 'XP total'], ['primary', 'book', p.progresso.fr + p.progresso.en, 'Lições feitas']].forEach(function (s) {
      gr.insertAdjacentHTML('beforeend', '<div class="ui-statcard"><span class="ui-statcard__icon ui-statcard__icon--' + s[0] + '">' + svg(s[1]) + '</span><div><p class="ui-statcard__value">' + s[2] + '</p><p class="ui-statcard__label">' + s[3] + '</p></div></div>');
    });
    g.appendChild(gr); pg.appendChild(g);
    var conq = [['flame', 'Primeiro dia', p.sequencia >= 1, ''], ['star', '7 dias seguidos', p.melhorSequencia >= 7, 'alt'], ['book', '10 lições', (p.progresso.fr + p.progresso.en) >= 10, 'ink'], ['ear', 'Ouvido treinado', false, ''], ['trophy', 'Unidade completa', (p.progresso.fr >= 5 || p.progresso.en >= 5), 'alt'], ['globe', 'Dois idiomas', p.progresso.fr > 0 && p.progresso.en > 0, 'ink'], ['mic', 'Primeira conversa', false, ''], ['target', '30 dias', p.melhorSequencia >= 30, '']];
    var bd = document.createElement('div'); bd.innerHTML = '<p class="ui-label sec-title">Conquistas · ' + conq.filter(function (c) { return c[2]; }).length + ' de ' + conq.length + '</p>';
    var bg = document.createElement('div'); bg.className = 'badges';
    conq.forEach(function (c) { bg.insertAdjacentHTML('beforeend', '<div class="badge' + (c[2] ? ' got ' + c[3] : '') + '"><span class="b">' + svg(c[2] ? c[0] : 'lock') + '</span>' + c[1] + '<span class="sr">' + (c[2] ? ', conquistada' : ', ainda não') + '</span></div>'); });
    bd.appendChild(bg); pg.appendChild(bd);
    var vs = document.createElement('div'); vs.innerHTML = '<p class="ui-label sec-title">Estudando junto</p>'; vs.appendChild(placar()); pg.appendChild(vs);
    var ul = document.createElement('ul'); ul.className = 'list';
    ul.innerHTML = '<li><button class="row" type="button" id="pfCfg"><span class="ic">' + svg('gear') + '</span><span class="txt">Configurações</span><span class="chev">' + svg('chev') + '</span></button></li>' +
      '<li><button class="row" type="button" id="pfTroca"><span class="ic">' + svg('users') + '</span><span class="txt">Trocar de perfil<small>Volta para a tela do PIN</small></span><span class="chev">' + svg('chev') + '</span></button></li>';
    pg.appendChild(ul);
    $('#pfCfg', ul).addEventListener('click', function () { ir('config'); });
    $('#pfTroca', ul).addEventListener('click', function () { S.ativo = null; salvar(); ir('entrar'); });
  };

  /* ===================================================================
     #033 adaptado — edição no lugar
     Lucian UX/UI Prompt #033 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#033
     =================================================================== */
  function edicaoInline(box, valor, rotulo, tamanho, aoSalvar) {
    var root = document.createElement('div'); root.className = 'u033 ux'; root.style.setProperty('--fs', tamanho + 'px');
    root.innerHTML = '<div class="u033-row"><button class="u033-view" type="button"></button>' +
      '<button class="u033-pen" type="button" aria-label="Editar ' + esc(rotulo.toLowerCase()) + '"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M11.5 3.5l3 3L6 15H3v-3z"/></svg></button>' +
      '<div class="u033-edit"><input class="u033-in" type="text" maxlength="20" aria-label="' + esc(rotulo) + '">' +
      '<button class="u033-act ok" type="button" aria-label="Salvar"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 9.5l3.2 3.2L14 5.5"/></svg></button>' +
      '<button class="u033-act no" type="button" aria-label="Cancelar"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M5 5l8 8M13 5l-8 8"/></svg></button><span class="u033-line" aria-hidden="true"></span></div></div>';
    var view = $('.u033-view', root), pen = $('.u033-pen', root), input = $('.u033-in', root);
    var title = valor;
    function rot() { view.textContent = title; view.setAttribute('aria-label', rotulo + ': ' + title + '. Toque para editar'); }
    rot();
    function edit() { root.classList.add('is-edit'); input.value = title; input.focus(); input.select(); }
    function shake() { root.classList.remove('is-shake'); void root.offsetWidth; root.classList.add('is-shake'); }
    function done(save) {
      if (!root.classList.contains('is-edit')) return;
      var v = input.value.trim();
      if (save && !v) { shake(); input.focus(); return; }
      root.classList.remove('is-edit');
      if (save && v !== title) { title = v; rot(); view.classList.remove('flash'); void view.offsetWidth; view.classList.add('flash'); aoSalvar(v); }
      view.focus();
    }
    view.addEventListener('click', edit); pen.addEventListener('click', edit);
    $('.ok', root).addEventListener('click', function () { done(true); });
    $('.no', root).addEventListener('click', function () { done(false); });
    input.addEventListener('keydown', function (e) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === 'Enter') { e.preventDefault(); done(true); }
      if (e.key === 'Escape') { e.preventDefault(); done(false); }
    });
    input.addEventListener('blur', function () { setTimeout(function () { if (root.isConnected && !root.contains(document.activeElement)) done(true); }, 0); });
    box.appendChild(root);
    return root;
  }

  /* =================================================================
     MEU PERSONAGEM: estilo do desenho, peças e cores
     (desenhos de código aberto; créditos em avatar.js e nas Configurações)
     ================================================================= */
  TELAS.personagem = function (op) {
    var p = eu(), novo = op && op.novo;
    var cfg = avatarNormalizar(p.avatar);
    var pg = casca(novo ? '' : 'perfil', '', function (bar) {
      if (!novo) { var b = document.createElement('button'); b.className = 'icon-btn'; b.setAttribute('aria-label', 'Voltar para o perfil'); b.innerHTML = svg('back'); b.addEventListener('click', function () { ir('perfil'); }); bar.appendChild(b); }
      bar.insertAdjacentHTML('beforeend', '<h1>' + (novo ? 'Crie seu personagem' : 'Meu personagem') + '</h1>');
    });
    if (novo) pg.insertAdjacentHTML('beforeend', '<p class="lead">É ele que aparece no seu perfil, na trilha e no placar de vocês dois. Dá para mudar quando quiser.</p>');
    var hero = document.createElement('div'); hero.className = 'av-hero';
    var big = document.createElement('span'); big.className = 'av'; big.setAttribute('role', 'img'); big.setAttribute('aria-label', 'Prévia do seu personagem');
    hero.appendChild(big);
    var acts = document.createElement('div'); acts.className = 'av-actions';
    acts.innerHTML = '<button class="ui-btn ui-btn--secondary" type="button" id="avSorte"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>Aleatório</button>' +
      '<button class="ui-btn ui-btn--ghost" type="button" id="avSorriso">Sorrir</button>';
    hero.appendChild(acts); pg.appendChild(hero);
    var humor = null;
    function desenhar(pular) {
      big.innerHTML = avatarImg(cfg, humor);
      if (pular && !S.cfg.motion) { big.classList.remove('pula'); void big.offsetWidth; big.classList.add('pula'); }
    }
    desenhar(false);

    /* estilo do desenho */
    var est = document.createElement('section'); est.className = 'av-estilos';
    est.innerHTML = '<p class="ui-label av-sub">Estilo do desenho</p><div class="av-est-row" role="radiogroup" aria-label="Estilo do desenho"></div>';
    pg.appendChild(est);
    var row = $('.av-est-row', est), CH = Object.keys(AV_ESTILOS);
    CH.forEach(function (k, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'av-est'; b.setAttribute('role', 'radio');
      b.innerHTML = '<span class="av" aria-hidden="true"></span>' + AV_ESTILOS[k].nome;
      b.addEventListener('click', function () { escolherEstilo(i); });
      b.addEventListener('keydown', function (e) { var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0; if (d) { e.preventDefault(); escolherEstilo((i + d + CH.length) % CH.length, true); } });
      row.appendChild(b);
    });
    function marcarEstilos() {
      $$('.av-est', row).forEach(function (b, i) { var on = CH[i] === cfg.estilo; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; $('.av', b).innerHTML = avatarImg(cfg, null, CH[i]); });
      cred.textContent = 'Desenho: ' + AV_ESTILOS[cfg.estilo].credito + '. Créditos completos em Configurações.';
    }
    function escolherEstilo(i, focus) {
      if (CH[i] === cfg.estilo) return;
      cfg.estilo = CH[i]; aba = 0; desenhar(true); marcarEstilos(); montarAbas();
      if (focus) row.children[i].focus();
      anunciar('Estilo ' + AV_ESTILOS[cfg.estilo].nome + '.');
    }

    /* abas do estilo atual */
    var tabs = document.createElement('div'); tabs.className = 'av-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Partes do personagem');
    var panel = document.createElement('div'); panel.className = 'av-panel card'; panel.setAttribute('role', 'tabpanel'); panel.id = 'avPainel';
    var cred = document.createElement('p'); cred.className = 'av-cred';
    pg.appendChild(tabs); pg.appendChild(panel); pg.appendChild(cred);
    var aba = 0;
    function abas() { return AV_ESTILOS[cfg.estilo].abas; }
    function montarAbas() {
      tabs.innerHTML = '';
      abas().forEach(function (ab, i) {
        var t = document.createElement('button'); t.type = 'button'; t.className = 'av-tab'; t.setAttribute('role', 'tab'); t.textContent = ab[0]; t.setAttribute('aria-controls', 'avPainel');
        t.addEventListener('click', function () { aba = i; montarPainel(); });
        t.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); aba = (i + d + abas().length) % abas().length; montarPainel(); tabs.children[aba].focus(); } });
        tabs.appendChild(t);
      });
      montarPainel();
    }
    function previa(chave, valor) {
      var c = JSON.parse(JSON.stringify(cfg)), e = c.estilo;
      if (AV_CORES[chave]) c[chave] = valor; else c.por[e][chave] = valor;
      if (chave === 'clothingGraphic') c.por[e].clothing = 'graphicShirt'; /* a estampa só aparece na camiseta estampada */
      return c;
    }
    function grupo(chave, titulo, tipo) {
      var box = document.createElement('div');
      box.innerHTML = '<p class="ui-label av-sub">' + titulo + '</p>';
      if (tipo === 'cor') {
        /* seletor de cor com anel que desliza: Lucian UX/UI Prompt #020 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#020 */
        var root = document.createElement('div'); root.className = 'ux u020';
        root.innerHTML = '<div class="u020-row" role="radiogroup" aria-label="' + esc(titulo) + '" style="margin-top:0;justify-content:flex-start;flex-wrap:wrap"><span class="u020-ring" aria-hidden="true"></span></div>';
        var rw = $('.u020-row', root), ring = $('.u020-ring', root), lista = AV_CORES[chave];
        var cur = Math.max(0, lista.map(function (o) { return o[0]; }).indexOf(cfg[chave]));
        var sws = lista.map(function (o, i) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'u020-sw';
          b.style.setProperty('--s1', avatarMix(o[0], '#ffffff', 0.25)); b.style.setProperty('--s2', '#' + o[0]);
          b.setAttribute('role', 'radio'); b.setAttribute('aria-label', o[1]); b.title = o[1]; b.setAttribute('aria-checked', String(i === cur)); b.tabIndex = i === cur ? 0 : -1;
          rw.appendChild(b); return b;
        });
        var moveRing = function (i) { ring.style.transform = 'translate(' + (sws[i].offsetLeft - 6) + 'px,' + (sws[i].offsetTop - 6) + 'px)'; };
        var choose = function (i, focus) {
          if (i === cur) return; cur = i;
          sws.forEach(function (b, k) { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
          if (focus) sws[i].focus(); moveRing(i); cfg[chave] = lista[i][0]; desenhar(true); atualizarMiniaturas(null); marcarEstilos();
        };
        sws.forEach(function (b, i) {
          b.addEventListener('click', function () { choose(i); });
          b.addEventListener('keydown', function (e) { var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0; if (d) { e.preventDefault(); choose((i + d + sws.length) % sws.length, true); } });
        });
        box.appendChild(root);
        ring.style.transition = 'none';
        requestAnimationFrame(function () { moveRing(cur); requestAnimationFrame(function () { ring.style.transition = ''; }); });
      } else {
        var g = document.createElement('div'); g.className = 'av-grid'; g.dataset.chave = chave; g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-label', titulo);
        var ops = avatarPartes(cfg.estilo)[chave];
        ops.forEach(function (o, i) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'av-opt'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', o[1]); b.title = o[1];
          var on = cfg.por[cfg.estilo][chave] === o[0]; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
          b.innerHTML = '<span class="av" aria-hidden="true">' + avatarImg(previa(chave, o[0])) + '</span>';
          b.addEventListener('click', function () { escolher(i); });
          b.addEventListener('keydown', function (e) { var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0; if (d) { e.preventDefault(); escolher((i + d + ops.length) % ops.length, true); } });
          g.appendChild(b);
        });
        var escolher = function (i, focus) {
          cfg.por[cfg.estilo][chave] = ops[i][0];
          if (chave === 'clothingGraphic') cfg.por[cfg.estilo].clothing = 'graphicShirt';
          $$('.av-opt', g).forEach(function (b, k) { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
          if (focus) g.children[i].focus();
          desenhar(true); atualizarMiniaturas(chave); marcarEstilos();
        };
        box.appendChild(g);
      }
      return box;
    }
    function atualizarMiniaturas(mudou) {
      $$('.av-grid', panel).forEach(function (g) {
        var chave = g.dataset.chave; if (chave === mudou) return;
        var ops = avatarPartes(cfg.estilo)[chave];
        $$('.av-opt', g).forEach(function (b, i) { $('.av', b).innerHTML = avatarImg(previa(chave, ops[i][0])); });
      });
    }
    function montarPainel() {
      $$('.av-tab', tabs).forEach(function (t, i) { t.setAttribute('aria-selected', String(i === aba)); t.tabIndex = i === aba ? 0 : -1; });
      panel.setAttribute('aria-label', abas()[aba][0]); panel.innerHTML = '';
      abas()[aba][1].forEach(function (gr) { panel.appendChild(grupo(gr[0], gr[1], gr[2])); });
    }
    marcarEstilos(); montarAbas();
    $('#avSorte', hero).addEventListener('click', function () { cfg = avatarAleatorio(cfg); desenhar(true); marcarEstilos(); montarPainel(); anunciar('Personagem sorteado.'); });
    var sorriso = $('#avSorriso', hero);
    sorriso.setAttribute('aria-pressed', 'false');
    sorriso.addEventListener('click', function () { humor = humor ? null : 'feliz'; sorriso.setAttribute('aria-pressed', String(!!humor)); desenhar(true); });

    var c3 = document.createElement('section'); c3.className = 'card';
    c3.innerHTML = '<p class="ui-label sec-title">Por que você está aprendendo?</p><p class="lead" style="font-size:14px">Escolha até 3. As lições de prática vão puxar mais para esses temas.</p>';
    /* chips do #019 (Lucian UX/UI Prompt #019 · MIT License (c) 2026 Seokwoooo), até 3 */
    var mv = document.createElement('div'); mv.className = 'u019 ux motivos';
    mv.innerHTML = '<div class="u019-list" role="group" aria-label="Motivos, até 3"></div><p class="u019-msg" aria-live="polite" style="text-align:left"></p>';
    var lista = $('.u019-list', mv), msg = $('.u019-msg', mv), t0 = 0, motivos = (p.motivos || []).slice();
    MOTIVOS.forEach(function (m) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'u019-chip';
      b.setAttribute('aria-pressed', String(motivos.indexOf(m) >= 0));
      b.innerHTML = '<i aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4"/></svg></i>'; b.appendChild(document.createTextNode(m));
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') === 'true';
        if (!on && motivos.length >= 3) {
          b.classList.remove('is-no'); void b.offsetWidth; b.classList.add('is-no');
          mv.classList.remove('is-warn'); void mv.offsetWidth; mv.classList.add('is-warn'); msg.textContent = 'Dá para escolher até 3.';
          clearTimeout(t0); t0 = setTimeout(function () { mv.classList.remove('is-warn'); msg.textContent = ''; }, 1600); return;
        }
        b.setAttribute('aria-pressed', String(!on));
        if (on) motivos.splice(motivos.indexOf(m), 1); else motivos.push(m);
      });
      lista.appendChild(b);
    });
    c3.appendChild(mv); pg.appendChild(c3);
    var ok = document.createElement('button'); ok.className = 'ui-btn ui-btn--primary ui-btn--block'; ok.textContent = novo ? 'Começar a estudar' : 'Salvar personagem';
    ok.addEventListener('click', function () {
      p.avatar = avatarNormalizar(cfg); p.motivos = motivos; salvar();
      /* LIGAR: google.script.run.salvarPerfil(p) — o personagem é só um objeto pequeno (cfg), cabe numa célula da planilha. */
      if (novo) { ir('hoje'); toast('Perfil criado. Bem-vindo, ' + p.nome + '.'); } else { ir('perfil'); toast('Personagem salvo.'); }
    });
    pg.appendChild(ok);
  };

  /* =================================================================
     CONFIGURAÇÕES
     ================================================================= */
  TELAS.config = function () {
    var p = eu();
    var pg = casca('perfil', '', function (bar) {
      var b = document.createElement('button'); b.className = 'icon-btn'; b.setAttribute('aria-label', 'Voltar para o perfil'); b.innerHTML = svg('back'); b.addEventListener('click', function () { ir('perfil'); });
      bar.appendChild(b); bar.insertAdjacentHTML('beforeend', '<h1>Configurações</h1>');
    });
    function bloco(titulo, linhas) {
      var d = document.createElement('section'); d.innerHTML = '<p class="ui-label sec-title">' + titulo + '</p>';
      var ul = document.createElement('ul'); ul.className = 'list';
      linhas.forEach(function (l) { var li = document.createElement('li'); li.appendChild(l); ul.appendChild(li); });
      d.appendChild(ul); pg.appendChild(d);
    }
    function linha(ic, t, sub, ctrl, empilhado) {
      var r = document.createElement('div'); r.className = 'row' + (empilhado ? ' row-stack' : '');
      var top = empilhado ? document.createElement('div') : r;
      if (empilhado) { top.style.cssText = 'display:flex;align-items:center;gap:12px'; r.appendChild(top); }
      top.insertAdjacentHTML('beforeend', '<span class="ic">' + svg(ic) + '</span><span class="txt">' + t + (sub ? '<small>' + sub + '</small>' : '') + '</span>');
      if (ctrl) (empilhado ? r : top).appendChild(ctrl);
      return r;
    }
    function botaoLinha(ic, t, sub, acao, perigo) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'row' + (perigo ? ' danger' : '');
      b.innerHTML = '<span class="ic">' + svg(ic) + '</span><span class="txt">' + t + (sub ? '<small>' + sub + '</small>' : '') + '</span><span class="chev">' + svg('chev') + '</span>';
      b.addEventListener('click', acao); return b;
    }
    function indisponivel(label) { var el=document.createElement('span'); el.className='availability'; el.textContent=label; return el; }
    var conectado = !!(window.AUTH && AUTH.enabled && AUTH.ready()), st = window.SYNC && SYNC.status;
    var nota = !window.IDIOMAS_API ? ['Salvo neste aparelho', 'Perfis, preferências e lições ficam neste navegador. Esta cópia do app não está ligada ao servidor.']
      : !conectado ? ['Só neste aparelho por enquanto', 'O estudo continua salvo aqui. Entre com Google (em Conexão, abaixo) para sincronizar entre os aparelhos e usar a IA.']
      : st === 'ok' ? ['Sincronizado', 'Perfis, progresso e preferências estão iguais neste aparelho e na conta.']
      : st === 'erro' || st === 'armazenamento' || st === 'limite' ? ['Sincronização com problema', 'Seu estudo está salvo aqui. Vou tentar sincronizar de novo sozinho; se continuar, exporte uma cópia dos dados.']
      : ['Sincronizando', 'Há alterações deste aparelho esperando para chegar à conta. Elas ficam guardadas aqui até lá.'];
    pg.insertAdjacentHTML('beforeend','<div class="settings-note"><strong>' + nota[0] + '</strong><p>' + nota[1] + '</p></div>');
    function set(k, v, msg) { S.cfg[k] = v; p.preferencias=p.preferencias||{};p.preferencias[k]=v;salvar(); if (msg) toast(msg); /* LIGAR: google.script.run.salvarPreferencias(p.id, S.cfg); */ }

    bloco('Sons', [
      linha('sound', 'Efeitos sonoros', 'Toques, acertos, erros e avisos', interruptor(S.cfg.efeitos, function (v) { set('efeitos', v); if (v) tocar('acerto'); }, 'Efeitos sonoros')),
      linha('sound', 'Volume dos efeitos', 'Não muda o volume das frases gravadas', segmento([{ v: 0.4, t: 'Baixo' }, { v: 0.7, t: 'Médio' }, { v: 1, t: 'Alto' }, { v: 1.5, t: 'Máximo' }], S.cfg.volume == null ? 1 : S.cfg.volume, function (v) { set('volume', v); tocar('acerto'); }, 'Volume dos efeitos'), true)
    ]);
    bloco('Aparência', [
      linha('sun', 'Tema', 'Sistema segue o modo do celular', segmento([{ v: 'sistema', t: 'Sistema' }, { v: 'claro', t: 'Claro' }, { v: 'escuro', t: 'Escuro' }], S.cfg.tema, function (v) { set('tema', v); aplicarTema(); }, 'Tema'), true)
    ]);
    bloco('Laboratório', [
      botaoLinha('motion', 'Eco em 3D', 'Explore o mascote e suas expressões quando quiser', function () { ir('eco3D'); })
    ]);
    bloco('Estudo', [
      linha('target', 'Meta diária', 'Minutos por dia', segmento([{ v: 5, t: '5' }, { v: 10, t: '10' }, { v: 15, t: '15' }, { v: 30, t: '30' }], S.cfg.meta, function (v) { set('meta', v, 'Meta: ' + v + ' minutos por dia.'); }, 'Meta diária em minutos'), true),
      linha('voice', 'Velocidade da voz', 'Lições, guias e revisão · velocidade salva neste aparelho', segmento([{ v: 0.7, t: 'Lenta' }, { v: 0.9, t: 'Normal' }, { v: 1.05, t: 'Rápida' }], S.cfg.voz, function (v) { set('voz', v); falar(CURSOS[p.idioma].codigo === 'FR' ? 'Bonjour, ça va ?' : 'Hello, how are you?', CURSOS[p.idioma].voz); }, 'Velocidade da voz'), true),
      botaoLinha('mic', 'Treino de pronúncia', 'Grave frases da unidade e veja o que o Eco entendeu', function () { ir('ecoPronuncia'); })
    ]);
    bloco('Lembretes', [
      botaoLinha('bell', 'Lembrete diário', window.textoLembrete ? textoLembrete() : '', function () { ir('lembrete'); })
    ]);
    bloco('Acessibilidade', [
      linha('motion', 'Reduzir animações', 'O sistema do celular também é respeitado', interruptor(S.cfg.motion, function (v) { set('motion', v); aplicarTema(); }, 'Reduzir animações'))
    ]);
    bloco('Cópia dos dados', [botaoLinha('book','Exportar meus dados','Baixa uma cópia dos perfis deste aparelho',function(){var blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='idiomas-backup.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);}),botaoLinha('book','Importar uma cópia','Recupera notas e progresso de um arquivo exportado',function(){var input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=async function(){try{var file=input.files[0];if(!file||file.size>8000000)throw new Error('arquivo');var backup=JSON.parse(await file.text());if(backup.versao!==2||!Array.isArray(backup.perfis)||backup.perfis.length>4)throw new Error('arquivo');var profiles=[];for(var entry of backup.perfis){var normalized=ProfileCore.normalize(entry);if(entry.pin&&!normalized.pinCredential)normalized.pinCredential=await PIN.create(String(entry.pin));profiles.push(normalized);}profiles.forEach(function(x){var old=S.perfis.find(function(y){return y.id===x.id;});if(old)ProfileCore.reconcile(old,ProfileCore.merge(undefined,old,x));else if(S.perfis.length<4)S.perfis.push(x);});salvar();toast('Cópia incorporada. Entre no perfil para continuar.');S.ativo=null;salvar();ir('entrar');}catch(e){toast('Não consegui importar esse arquivo. Seus dados atuais foram preservados.');}};input.click();})]);
    bloco('Conexão', conectado ? [botaoLinha('out','Sair da conta Google neste aparelho','O estudo continua salvo aqui; a sincronização e a IA param até entrar de novo',function(){AUTH.logout();toast('Você saiu da conta Google neste aparelho.');ir('config');})]
      : [botaoLinha('users','Entrar com Google','Ativa sincronização e IA para as contas autorizadas',function(){AUTH.start();})]);
    bloco('Conta', [
      botaoLinha('globe', 'Idiomas do curso', p.idiomas.map(function (k) { return CURSOS[k].nome; }).join(' e '), function () {
        folha(function (sh) {
          sh.insertAdjacentHTML('beforeend', '<span class="ui-label">Conta</span><h2>Idioma ativo</h2><p>Os dois cursos continuam salvos. Escolha qual aparece na trilha.</p>');
          grupoRadio(sh, p.idiomas.map(function (k) { return { v: k, t: CURSOS[k].nome, code: CURSOS[k].codigo, val: p.progresso[k] + ' lições' }; }), p.idioma, function (v) { p.idioma = v; salvar(); }, 'Idioma ativo');
          var ok = document.createElement('button'); ok.className = 'ui-btn ui-btn--primary ui-btn--block'; ok.style.marginTop = '16px'; ok.textContent = 'Pronto';
          ok.addEventListener('click', function () { ir('config'); }); sh.appendChild(ok);
        });
      }),
      botaoLinha('key', 'Mudar PIN', '', function () { ir('mudarPin'); }),
      botaoLinha('users', 'Trocar de perfil', '', function () { S.ativo = null; salvar(); ir('entrar'); }),
      botaoLinha('out', 'Apagar dados deste aparelho', 'Remove a cópia local; os dados sincronizados continuam na conta', function () {
        folha(function (sh) {
          sh.insertAdjacentHTML('beforeend', '<span class="ui-label">Atenção</span><h2>Apagar a cópia deste aparelho?</h2><p>Alterações que ainda não foram sincronizadas podem ser perdidas. Exporte uma cópia antes de continuar.</p><div class="actions"><button class="ui-btn ui-btn--danger ui-btn--block" id="apSim">Apagar a cópia</button>' + (conectado ? '<button class="ui-btn ui-btn--danger ui-btn--block" id="apSair">Apagar e sair da conta Google</button>' : '') + '<button class="ui-btn ui-btn--ghost ui-btn--block" id="apNao">Cancelar</button></div>');
          if ($('#apSair', sh)) $('#apSair', sh).addEventListener('click', function () { AUTH.logout(); $('#apSim', sh).click(); });
          $('#apSim', sh).addEventListener('click', function () { try { Object.keys(localStorage).filter(function(k){return k===CHAVE||k.indexOf(CHAVE+':')===0||k.indexOf('idiomas-discover:')===0;}).forEach(function(k){localStorage.removeItem(k);}); } catch (e) {} S = semente(); if(window.SYNC){SYNC.limpar();SYNC.bind(S);} aplicarTema(); ir('boasvindas'); });
          $('#apNao', sh).addEventListener('click', fecharFolha);
        });
      }, true)
    ]);
    var sobre = document.createElement('section'); sobre.className = 'card about';
    sobre.innerHTML = '<p class="ui-label sec-title">Sobre</p><p style="margin:0 0 8px">Idiomas · curso pessoal</p>' +
      '<p style="margin:0">Componentes de interface adaptados do Lucian UX/UI Prompt, licença MIT (c) 2026 Seokwoooo: ' +
      '<a href="https://lucianlabs.dev/uxui-prompt/#015" target="_blank" rel="noopener">#015</a>, <a href="https://lucianlabs.dev/uxui-prompt/#019" target="_blank" rel="noopener">#019</a>, ' +
      '<a href="https://lucianlabs.dev/uxui-prompt/#007" target="_blank" rel="noopener">#007</a>, <a href="https://lucianlabs.dev/uxui-prompt/#020" target="_blank" rel="noopener">#020</a>, <a href="https://lucianlabs.dev/uxui-prompt/#033" target="_blank" rel="noopener">#033</a>, <a href="https://lucianlabs.dev/uxui-prompt/#086" target="_blank" rel="noopener">#086</a> e <a href="https://lucianlabs.dev/uxui-prompt/#379" target="_blank" rel="noopener">#379</a>. Fontes Bricolage Grotesque, Plus Jakarta Sans e Geist Mono (SIL Open Font License).</p>' +
      '<p style="margin:8px 0 0">Personagens: <a href="https://github.com/humation-labs/humation" target="_blank" rel="noopener">Humation</a> (MIT, (c) 2026 Humation contributors); ' +
      '<a href="https://www.dicebear.com" target="_blank" rel="noopener">DiceBear</a> (MIT, (c) Florian Körner) com os desenhos ' +
      '<a href="https://avataaars.com/" target="_blank" rel="noopener">Avataaars</a> de Pablo Stanley (livre para uso pessoal e comercial), ' +
      '<a href="https://www.figma.com/community/file/1589627891082866389" target="_blank" rel="noopener">Toon Head</a> de Johan Melin e ' +
      '<a href="https://personas.draftbit.com/" target="_blank" rel="noopener">Personas</a> de Draftbit, ambos sob <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. Só escolhemos cores e combinações; os desenhos não foram alterados. Sons e cenas da trilha são próprios.</p>';
    pg.appendChild(sobre);
  };

  TELAS.mudarPin = function () {
    var p = eu();
    var sh = document.createElement('div'); sh.className = 'shell';
    var e = document.createElement('main'); e.className = 'entry';
    e.innerHTML = '<div class="steps"><button class="icon-btn" id="mpVoltar" aria-label="Voltar">' + svg('back') + '</button><span class="ui-label">Mudar PIN</span></div><div class="pin-wrap"><div class="step-body" style="flex:0;padding-bottom:0"><h1>Digite o PIN atual</h1></div></div>';
    sh.appendChild(e); root.appendChild(sh);
    $('#mpVoltar', e).addEventListener('click', function () { ir('config'); });
    var etapa = 0, novo = null, h1 = $('h1', e);
    var tp = tecladoPin($('.pin-wrap', e), async function (v) {
      if (etapa === 0) { if (!(await PIN.verify(v, p))) { tp.erro('PIN incorreto.'); return; } etapa = 1; tp.limpar(); h1.textContent = 'Novo PIN'; return; }
      if (etapa === 1) { novo = v; etapa = 2; tp.limpar(); h1.textContent = 'Repita o novo PIN'; return; }
      if (v !== novo) { etapa = 1; tp.erro('Não bateu. Digite o novo PIN de novo.'); h1.textContent = 'Novo PIN'; return; }
      p.pinCredential = await PIN.create(v); delete p.pin; salvar(); /* LIGAR: google.script.run.mudarPin(p.id, hashDoPin) */
      ir('config'); toast('PIN alterado.');
    });
  };

  /* =================================================================
     INÍCIO
     ================================================================= */
  /* ECO STUDIO · UI prototype. Service boundary: no microphone capture, network,
     generated grading or learning rewards. Fixtures below are explicitly labelled.
     Integrator: replace fixtures with studied-scope, realtime/STT/TTS and writing
     service responses; use transcript/corrections/words fields as the UI contract. */
  var studioTimers = [], studioSession = null;
  var studioDisposers = [];
  function studioCleanup(fn) { studioDisposers.push(fn); }
  function studioStop() { var fns = studioDisposers; studioDisposers = []; fns.forEach(function (fn) { try { fn(); } catch(e) { console.error('Falha ao encerrar recurso', e); } }); studioTimers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); studioTimers=[]; }
  addEventListener('pagehide', studioStop);
  document.addEventListener('idiomas-auth-locked', function(){studioStop();fecharFolha();});
  document.addEventListener('idiomas-offline',function(){S.ativo=null;salvar();ir(S.perfis.length?'entrar':'boasvindas');});
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') studioStop(); else if (eu()) { novoDia(eu()); salvar(); } });
  function studioLater(fn, ms) { var t=setTimeout(fn,ms); studioTimers.push(t); return t; }
  function studioData() { var p=eu(); p.ecoStudio=p.ecoStudio || {calls:[],writings:[],notebook:[],words:[],drafts:{}}; return p.ecoStudio; }
  function studioUnits() { var p=eu(), n=0, out=[]; curso().secoes.forEach(function(sec){sec.unidades.forEach(function(u){var start=n; n+=u.licoes.length; out.push({id:u.id,title:u.titulo,objective:u.objetivo,done:p.progresso[p.idioma]>=n,current:p.progresso[p.idioma]>=start&&p.progresso[p.idioma]<n,level:(sec.titulo.match(/\b[ABC][12]\b/)||['A1'])[0]});});}); return out; }
  function studioCurrent() { var u=studioUnits();return u.find(function(x){return x.current;}) || u[u.length-1]; }
  function studioButton(label, fn, kind) { var b=document.createElement('button');b.type='button';b.className='ui-btn ui-btn--'+(kind||'secondary');b.textContent=label;b.onclick=fn;return b; }
  function studioPage(title,back) { var pg=casca('praticar',title,function(bar){var b=document.createElement('button');b.type='button';b.className='icon-btn';b.setAttribute('aria-label','Voltar');b.innerHTML=svg('back');b.onclick=function(){ir(back||'ecoHub');};bar.prepend(b);});pg.classList.add('eco-studio');return pg; }
  function studioDemo(pg) { var d=document.createElement('p');d.className='studio-demo';d.textContent='Prévia interativa · voz e IA simuladas. Não grava nem envia seu áudio ou texto.';pg.appendChild(d); }
  function studioLead(pg,kicker,title,body) { var h=document.createElement('div');h.className='studio-heading';h.innerHTML='<span class="ui-label">'+esc(kicker)+'</span><h1>'+esc(title)+'</h1><p>'+esc(body)+'</p>';pg.appendChild(h); }
  function studioTime(sec) { return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'); }
  function studioDate(value) {return new Date(value).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});}
  function studioFixture() {
    return eu().idioma==='fr' ? {
      eco:'Bonjour ! Comment ça va ?',translation:'Olá! Como você está?',user:'Bonjour ! Je suis bien.',better:'Bonjour ! Je vais bien.',hint:'Você pode dizer como está e perguntar de volta.',example:'Je vais bien, merci. Et vous ?',reply:'Très bien, merci !',replyPT:'Muito bem, obrigado!',
      text:'Bonjour ! Je suis bien. Je viens de Brésil. Je parle français un peu.',corrected:'Bonjour ! Je vais bien. Je viens du Brésil. Je parle un peu français.',starter:'Bonjour ! Je…',
      errors:[['Je suis bien','Je vais bien','Para responder como você está, use a expressão « aller bien ».'],['de Brésil','du Brésil','Antes do nome masculino Brésil, de + le se torna du.'],['français un peu','un peu français','Nesta frase, un peu vem antes do idioma.']],words:[['bonjour','olá'],['merci','obrigado(a)'],['bien','bem']]
    } : {
      eco:'Hello! How are you?',translation:'Olá! Como você está?',user:'Hello! I is fine.',better:'Hello! I am fine.',hint:'Você pode dizer como está e perguntar de volta.',example:'I am fine, thank you. And you?',reply:'I am fine too. Thank you!',replyPT:'Eu também estou bem. Obrigado!',
      text:'Hello! I is fine. I am from brazil. I likes music.',corrected:'Hello! I am fine. I am from Brazil. I like music.',starter:'Hello! I…',
      errors:[['I is','I am','Com I, use am, não is.'],['brazil','Brazil','Nomes de países começam com letra maiúscula.'],['I likes','I like','Com I, o verbo no presente fica sem o s.']],words:[['hello','olá'],['fine','bem'],['thank you','obrigado(a)']]
    };
  }
  function studioTrailCard(pg,u) { var c=document.createElement('section');c.className='studio-entry';var mascot=eco('happy','Eco');c.appendChild(mascot);var body=document.createElement('div');body.innerHTML='<span class="ui-label">Unidade concluída</span><h3>Conversar com o Eco</h3><p>'+esc(u.titulo)+' · pratique o que estudou</p>';body.appendChild(studioButton('Escolher conversa',function(){ir('ecoSetup',{id:u.id,title:u.titulo,level:'A1',minutes:5,role:'Eco é seu parceiro de conversa'});},'primary'));c.appendChild(body);pg.appendChild(c); }
  TELAS.ecoHub=function(){
    var pg=studioPage('Praticar com o Eco','trilha'), u=studioCurrent();
    pg.appendChild(studioButton('Ler e descobrir · atividades da unidade',function(){ir('descobrir');}));
    studioLead(pg,'Seu espaço de prática','Vamos colocar em palavras?','Fale ou escreva no seu ritmo. O Eco acompanha você.');
    var hero=document.createElement('div');hero.className='studio-welcome';hero.appendChild(eco('happy','Eco, seu parceiro de prática'));pg.appendChild(hero);
    var card=document.createElement('section');card.className='card studio-feature';card.innerHTML='<span class="studio-icon">'+svg('mic')+'</span><h2>Conversar com o Eco</h2><p>Uma conversa por voz, devagar e com espaço para você interromper.</p><span class="studio-tag">Tema sugerido: '+esc(u.title)+'</span>';
    card.appendChild(studioButton('Escolher conversa',function(){ir('ecoScenarios');},'primary'));pg.appendChild(card);
    var writing=document.createElement('section');writing.className='card studio-feature';writing.innerHTML='<span class="studio-icon">'+svg('book')+'</span><h2>Escrever com o Eco</h2><p>Escreva, entenda as correções e guarde o que quer praticar.</p>';writing.appendChild(studioButton('Escrever uma redação',function(){ir('ecoWrite',u.id);},'primary'));pg.appendChild(writing);
    var links=document.createElement('div');links.className='studio-actions';links.appendChild(studioButton('Histórico de conversas',function(){ir('ecoHistory');}));links.appendChild(studioButton('Histórico de redações',function(){ir('ecoWritingHistory');}));links.appendChild(studioButton('Caderno de erros',function(){ir('ecoNotebook');}));pg.appendChild(links);studioDemo(pg);
  };
  TELAS.ecoScenarios=function(){
    var pg=studioPage('Escolher conversa'),units=studioUnits(),done=units.filter(function(x){return x.done;});
    studioLead(pg,'Conversa por voz','Sobre o que vamos falar?','Na versão conectada, o Eco usará apenas o vocabulário e a gramática que você já estudou.');
    function scenario(x,preview){var c=document.createElement('section');c.className='card studio-scenario';c.innerHTML='<div class="studio-between"><h2>'+esc(x.title)+'</h2><span class="studio-tag">'+esc(x.level)+'</span></div><p>'+esc(x.role)+'</p><p class="muted">'+x.minutes+' min sugeridos'+(preview?' · cenário de demonstração':'')+'</p>';c.appendChild(studioButton('Escolher este cenário',function(){ir('ecoSetup',x);},'primary'));pg.appendChild(c);}
    done.forEach(function(u){scenario({id:u.id,title:u.title,level:u.level,minutes:5,role:/caf[eé]/i.test(u.title)?'Eco é o garçom':'Eco é seu parceiro de conversa'});});
    if(!done.length)pg.insertAdjacentHTML('beforeend','<div class="studio-note">Os cenários das unidades aparecerão aqui quando você concluí-las. Você já pode conhecer a prévia abaixo.</div>');
    scenario({id:'free',title:'Conversa livre',level:studioCurrent().level,minutes:10,role:'Eco é seu parceiro de conversa'},!done.length);
    var previews=document.createElement('details');previews.className='card studio-details';previews.innerHTML='<summary>Explorar cenários de demonstração</summary><p>Exemplos de telas. Não desbloqueiam unidades nem representam seu nível.</p>';
    [{id:'demo-cafe',title:'No café',level:'A1',minutes:5,role:'Eco é o garçom'},{id:'demo-weekend',title:'Contar o fim de semana',level:'A2',minutes:10,role:'Eco é um amigo'},{id:'demo-doctor',title:'No médico',level:'A2',minutes:15,role:'Eco faz o papel do médico'}].forEach(function(x){var b=studioButton(x.title+' · '+x.level+' · '+x.minutes+' min',function(){ir('ecoSetup',x);});previews.appendChild(b);});pg.appendChild(previews);studioDemo(pg);
  };
  TELAS.ecoSetup=function(sc){
    var pg=studioPage('Preparar conversa','ecoScenarios'),corrections='during',captions='translation',minutes=sc.minutes;
    studioLead(pg,sc.level+' · '+sc.role,sc.title,'Sem pressa. Você pode pedir ajuda, repetir ou interromper o Eco.');
    var opts=document.createElement('section');opts.className='card studio-stack';
    function group(title,items,value,fn){var label=document.createElement('h2');label.textContent=title;opts.appendChild(label);opts.appendChild(segmento(items,value,fn,title));}
    group('Duração sugerida',[{v:5,t:'5 min'},{v:10,t:'10 min'},{v:15,t:'15 min'}],minutes,function(v){minutes=v;});
    group('Correções',[{v:'during',t:'Durante a conversa'},{v:'end',t:'Só no final'}],corrections,function(v){corrections=v;});
    group('Legendas',[{v:'on',t:'Ligadas'},{v:'off',t:'Desligadas'},{v:'translation',t:'Com tradução'}],captions,function(v){captions=v;});pg.appendChild(opts);
    var mic=document.createElement('section');mic.className='card studio-stack';mic.innerHTML='<span class="studio-icon">'+svg('mic')+'</span><h2>Podemos usar seu microfone?</h2><p>Precisamos dele para o Eco ouvir sua voz durante a conversa.</p><p class="studio-mic-status" role="status">Nesta prévia, a permissão é simulada e o microfone não é aberto.</p>';
    var granted=false,start=studioButton('Começar conversa',function(){if(!granted)return;studioSession={scenario:sc,corrections:corrections,captions:captions,minutes:minutes,seconds:0,muted:false,mode:'live',transcript:[],lang:eu().idioma};ir('ecoCall');},'primary');start.disabled=true;
    mic.appendChild(studioButton('Simular permissão do microfone',function(){granted=true;$('.studio-mic-status',mic).textContent='Microfone permitido na simulação. Tudo pronto!';start.disabled=false;this.disabled=true;}));
    mic.appendChild(studioButton('Ver permissão bloqueada',function(){studioSession={scenario:sc,corrections:corrections,captions:captions,minutes:minutes,seconds:0,muted:false,mode:'live',transcript:[],lang:eu().idioma};ir('ecoError','mic');},'ghost'));pg.appendChild(mic);pg.appendChild(start);studioDemo(pg);
  };
  TELAS.ecoCall=function(){
    if(!studioSession){ir('ecoScenarios');return;}var s=studioSession, f=studioFixture(),pg=studioPage('Conversa com o Eco','ecoScenarios');
    pg.classList.add('studio-call');studioDemo(pg);
    pg.insertAdjacentHTML('beforeend','<div class="studio-between"><div><span class="ui-label">'+esc(s.scenario.level)+' · '+(s.mode==='turns'?'Por turnos':'Conversa ao vivo')+'</span><h1>'+esc(s.scenario.title)+'</h1></div><span class="studio-timer" aria-label="Tempo de conversa">'+studioTime(s.seconds)+'</span></div>');
    var stage=document.createElement('div');stage.className='studio-stage';stage.dataset.state='connecting';var mascot=eco('thinking','Eco conectando');stage.appendChild(mascot);stage.insertAdjacentHTML('beforeend','<span class="studio-orbit" aria-hidden="true"></span><p class="studio-state" role="status">Conectando…</p><div class="studio-wave" aria-hidden="true">'+Array.from({length:15},function(_,i){return '<i style="--d:'+i*.08+'s;--h:'+(12+(i%4)*7)+'px"></i>';}).join('')+'</div><p class="studio-voice-label">Sua voz · simulação</p>');pg.appendChild(stage);
    var correction=document.createElement('div');correction.className='studio-correction';correction.setAttribute('role','status');correction.hidden=true;pg.appendChild(correction);
    var subtitles=document.createElement('div');subtitles.className='studio-subtitles';subtitles.setAttribute('aria-live','polite');pg.appendChild(subtitles);
    var help=document.createElement('div');help.className='studio-help';help.hidden=true;help.innerHTML='<strong>Você consegue. Tente assim:</strong><p>'+esc(f.hint)+'</p><p class="studio-example" lang="'+s.lang+'">'+esc(f.example)+'</p>';pg.appendChild(help);
    var actions=document.createElement('div');actions.className='studio-call-actions';pg.appendChild(actions);
    var state='connecting',phaseTimer=null,chipTimer=null;
    function setState(v){state=v;stage.dataset.state=v;mascot.dataset.state={connecting:'thinking',listening:'listening',thinking:'thinking',speaking:'speaking',interrupted:'surprise',muted:'neutral'}[v];var labels={connecting:'Conectando…',listening:s.mode==='turns'?'Segure para falar':'Estou ouvindo você',thinking:'Eco está pensando…',speaking:'Eco está falando',interrupted:'Pode falar. Estou ouvindo!',muted:'Microfone silenciado'};$('.studio-state',stage).textContent=labels[v];mascot.setAttribute('aria-label',labels[v]);}
    function caption(){subtitles.innerHTML='';if(s.captions==='off'){subtitles.innerHTML='<p class="muted">Legendas desligadas</p>';return;}s.transcript.slice(-2).forEach(function(t){var b=document.createElement('div');b.className='studio-caption '+(t.who==='Você'?'is-user':'');b.innerHTML='<strong>'+esc(t.who)+'</strong><p lang="'+s.lang+'">'+esc(t.text)+'</p>'+(s.captions==='translation'&&t.pt?'<small>'+esc(t.pt)+'</small>':'');subtitles.appendChild(b);});}
    function add(who,text,pt){s.transcript.push({who:who,text:text,pt:pt||''});caption();}
    function schedule(fn,ms){clearTimeout(phaseTimer);phaseTimer=studioLater(function(){if(pg.isConnected)fn();},ms);}
    function speak(text,pt){if(!pg.isConnected)return;setState('speaking');add('Eco',text,pt);schedule(function(){setState(s.muted?'muted':'listening');},3000);}
    function reply(){setState('thinking');schedule(function(){if(s.corrections==='during'){correction.textContent='Você disse: '+f.user+' → Melhor: '+f.better;correction.hidden=false;clearTimeout(chipTimer);chipTimer=studioLater(function(){correction.hidden=true;},6500);}s.hadDemoReply=true;speak(f.reply,f.replyPT);},1200);}
    function beginUser(){if(s.muted){toast('Ative o microfone para falar.');return false;}clearTimeout(phaseTimer);setState(state==='speaking'?'interrupted':'listening');stage.classList.add('user-speaking');return true;}
    function endUser(){if(!stage.classList.contains('user-speaking'))return;stage.classList.remove('user-speaking');add('Você',f.user,'Olá! Estou bem.');reply();}
    var mic=studioButton(s.muted?'Ativar microfone':'Silenciar microfone',function(){s.muted=!s.muted;mic.textContent=s.muted?'Ativar microfone':'Silenciar microfone';mic.setAttribute('aria-pressed',String(s.muted));if(s.muted){stage.classList.remove('user-speaking');clearTimeout(phaseTimer);setState('muted');}else setState('listening');});mic.setAttribute('aria-pressed',String(s.muted));actions.appendChild(mic);
    var hint=studioButton('Me ajuda',function(){help.hidden=!help.hidden;hint.setAttribute('aria-expanded',String(!help.hidden));});hint.setAttribute('aria-expanded','false');actions.appendChild(hint);
    actions.appendChild(studioButton('Repetir mais devagar',function(){speak(f.eco,f.translation);$('.studio-state',stage).textContent='Eco repete mais devagar · simulação';schedule(function(){setState(s.muted?'muted':'listening');},5000);}));
    actions.appendChild(studioButton('Encerrar',function(){studioFinish();},'danger'));
    var voice=studioButton(s.mode==='turns'?'Segure para falar · solte para enviar':'Simular minha fala / interromper',function(){if(s.mode==='live'&&beginUser())schedule(endUser,1300);},'primary');voice.classList.add('studio-voice-button');
    if(s.mode==='turns'){
      voice.onpointerdown=function(e){if(beginUser()){e.preventDefault();voice.setPointerCapture(e.pointerId);voice.textContent='Ouvindo… solte para enviar';}};
      voice.onpointerup=function(){endUser();voice.textContent='Segure para falar · solte para enviar';};
      voice.onpointercancel=function(){stage.classList.remove('user-speaking');setState('listening');voice.textContent='Segure para falar · solte para enviar';};
      voice.onkeydown=function(e){if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();beginUser();voice.textContent='Ouvindo… solte para enviar';}};
      voice.onkeyup=function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();endUser();voice.textContent='Segure para falar · solte para enviar';}};
    }
    pg.appendChild(voice);if(s.mode==='turns')pg.insertAdjacentHTML('beforeend','<p class="studio-note">Fale uma mensagem por vez. No teclado, segure Espaço e solte para enviar. Este modo também precisa de conexão e microfone no serviço real.</p>');
    var prefs=document.createElement('details');prefs.className='studio-details';prefs.innerHTML='<summary>Legendas e estados de demonstração</summary>';prefs.appendChild(segmento([{v:'on',t:'Ligadas'},{v:'off',t:'Desligadas'},{v:'translation',t:'Com tradução'}],s.captions,function(v){s.captions=v;caption();},'Legendas da conversa'));
    [['Sem internet','offline'],['Microfone bloqueado','mic'],['Limite atingido','limit']].forEach(function(x){prefs.appendChild(studioButton(x[0],function(){ir('ecoError',x[1]);}));});pg.appendChild(prefs);
    var dock=document.createElement('div');dock.className='studio-call-dock';dock.appendChild(actions);dock.appendChild(voice);pg.appendChild(dock);
    var interval=setInterval(function(){if(!pg.isConnected){clearInterval(interval);return;}s.seconds++;$('.studio-timer',pg).textContent=studioTime(s.seconds);},1000);studioTimers.push(interval);caption();schedule(function(){speak(f.eco,f.translation);},1000);
  };
  TELAS.ecoError=function(type){
    var pg=studioPage('Vamos resolver','ecoScenarios'),copy={offline:['Sem conexão por enquanto','A conversa foi pausada. Verifique sua conexão para continuar.'],mic:['O microfone está bloqueado','Na versão conectada, permita o microfone nas configurações do navegador e tente novamente.'],limit:['Limite de conversa ao vivo atingido','Você pode tentar novamente mais tarde ou conhecer o modo por turnos.']}[type];
    var face=document.createElement('div');face.className='studio-welcome';face.appendChild(eco('confused','Eco aguardando'));pg.appendChild(face);studioLead(pg,'Conversa pausada',copy[0],copy[1]);studioDemo(pg);
    pg.appendChild(studioButton(type==='mic'?'Simular permissão e continuar':'Simular nova tentativa',function(){ir('ecoCall');},'primary'));
    pg.appendChild(studioButton('Continuar em modo por turnos',function(){studioSession.mode='turns';studioSession.muted=false;ir('ecoCall');}));
    pg.insertAdjacentHTML('beforeend','<p class="studio-note">O modo por turnos não contorna bloqueios: no serviço real, também exige internet, permissão do microfone e disponibilidade do serviço. Aqui você pode explorar a tela.</p>');
    pg.appendChild(studioButton('Encerrar e ver resumo',studioFinish,'ghost'));
  };
  function studioFinish(){var s=studioSession;if(!s){ir('ecoHub');return;}var f=studioFixture(), record={id:'call-'+Date.now(),date:Date.now(),lang:s.lang,scenario:s.scenario.title,seconds:s.seconds,xp:s.transcript.some(function(t){return t.who==='Você';})?30:0,transcript:s.transcript.slice(),errors:s.hadDemoReply?f.errors:[],words:s.hadDemoReply?f.words:[],demo:true};studioData().calls.unshift(record);salvar();studioSession=null;ir('ecoSummary',record.id);}
  function studioErrors(box,errors){errors.forEach(function(e){var card=document.createElement('article');card.className='studio-error-card';card.innerHTML='<span class="ui-label">Você disse</span><p class="studio-wrong">'+esc(e[0])+'</p><span class="ui-label">Melhor assim</span><p class="studio-right">'+esc(e[1])+'</p><p>'+esc(e[2])+'</p>';box.appendChild(card);});}
  TELAS.ecoSummary=function(id){var r=studioData().calls.find(function(x){return x.id===id;});if(!r){ir('ecoHistory');return;}var pg=studioPage('Resumo da conversa','ecoHistory');studioLead(pg,'Conversa de demonstração','Cada tentativa é um passo.','Você reservou um momento para praticar. O Eco está com você!');var e=document.createElement('div');e.className='studio-welcome small';e.appendChild(eco('celebrate','Eco comemorando'));pg.appendChild(e);
    pg.insertAdjacentHTML('beforeend','<div class="studio-metrics"><div><strong>'+studioTime(r.seconds)+'</strong><span>Tempo de conversa</span></div><div><strong>+'+r.xp+' XP</strong><span>Exemplo · não creditado</span></div></div><p>'+esc(r.scenario)+' · '+studioDate(r.date)+'</p>');
    var errors=document.createElement('section');errors.className='studio-stack';errors.innerHTML='<h2>O que praticar agora</h2><p class="muted">Exemplo de 3 correções para mostrar o formato. Não é uma avaliação da sua voz.</p>';if(r.errors.length)studioErrors(errors,r.errors);else errors.insertAdjacentHTML('beforeend','<p>Nenhuma fala simulada enviada nesta sessão.</p>');pg.appendChild(errors);
    var words=document.createElement('section');words.className='card studio-stack';words.innerHTML='<h2>Palavras novas</h2><p class="muted">Exemplos da prévia. A integração identificará quais são novas para você.</p>';r.words.forEach(function(w){var row=document.createElement('div');row.className='studio-word';row.innerHTML='<div><strong>'+esc(w[0])+'</strong><small>'+esc(w[1])+'</small></div>';var exists=function(){return studioData().words.some(function(x){return x.word===w[0]&&x.lang===r.lang;});};var b=studioButton(exists()?'Adicionada':'Adicionar à revisão',function(){if(!exists()){studioData().words.push({word:w[0],translation:w[1],lang:r.lang});salvar();}b.textContent='Adicionada';b.disabled=true;});b.disabled=exists();row.appendChild(b);words.appendChild(row);});words.appendChild(studioButton('Ver palavras salvas da prévia',function(){ir('ecoWords');},'ghost'));pg.appendChild(words);
    var transcript=document.createElement('details');transcript.className='card studio-details';transcript.innerHTML='<summary>Transcrição da conversa</summary>';if(!r.transcript.length)transcript.insertAdjacentHTML('beforeend','<p>Nenhuma fala registrada.</p>');r.transcript.forEach(function(t){transcript.insertAdjacentHTML('beforeend','<div class="studio-caption"><strong>'+esc(t.who)+'</strong><p lang="'+r.lang+'">'+esc(t.text)+'</p>'+(t.pt?'<small>'+esc(t.pt)+'</small>':'')+'</div>');});pg.appendChild(transcript);
    pg.appendChild(studioButton('Conversar de novo',function(){ir('ecoScenarios');},'primary'));pg.appendChild(studioButton('Voltar à trilha',function(){ir('trilha');}));studioDemo(pg);
  };
  TELAS.ecoHistory=function(){var pg=studioPage('Histórico de conversas');studioLead(pg,'Suas conversas','Um passo de cada vez.','As sessões de demonstração ficam salvas neste perfil e navegador.');var rows=studioData().calls.filter(function(r){return r.lang===eu().idioma;});if(!rows.length)pg.insertAdjacentHTML('beforeend','<div class="card"><h2>Sua primeira conversa começa aqui</h2><p>Depois de encerrar, o resumo e a transcrição aparecem nesta tela.</p></div>');rows.forEach(function(r){var b=studioButton(r.scenario+' · '+studioDate(r.date)+' · '+studioTime(r.seconds),function(){ir('ecoSummary',r.id);});b.classList.add('studio-history-row');pg.appendChild(b);});pg.appendChild(studioButton('Nova conversa',function(){ir('ecoScenarios');},'primary'));};
  TELAS.ecoWords=function(){var pg=studioPage('Palavras da prévia'),words=studioData().words.filter(function(w){return w.lang===eu().idioma;});studioLead(pg,'Revisão · demonstração','Suas palavras salvas','Lista separada da revisão do curso, pronta para a integração.');words.forEach(function(w){pg.insertAdjacentHTML('beforeend','<article class="card"><h2>'+esc(w.word)+'</h2><p>'+esc(w.translation)+'</p></article>');});if(!words.length)pg.insertAdjacentHTML('beforeend','<p>Nenhuma palavra salva. Adicione palavras pelo resumo de uma conversa.</p>');};
  TELAS.ecoWrite=function(unitId){var pg=studioPage('Escrever com o Eco'),units=studioUnits(),unit=units.find(function(x){return x.id===unitId;})||studioCurrent(),f=studioFixture(),data=studioData();
    studioLead(pg,'Redação · '+unit.level,'Sua vez de escrever','Tema da unidade: '+unit.title);studioDemo(pg);
    var unitLabel=document.createElement('label');unitLabel.className='studio-field';unitLabel.textContent='Unidade';var select=document.createElement('select');units.filter(function(x){return x.done||x.current||x.id===unit.id;}).forEach(function(x){var op=document.createElement('option');op.value=x.id;op.textContent=x.title;select.appendChild(op);});select.value=unit.id;select.onchange=function(){ir('ecoWrite',select.value);};unitLabel.appendChild(select);pg.appendChild(unitLabel);
    var task=document.createElement('section');task.className='card studio-stack';task.innerHTML='<span class="ui-label">Tarefa da unidade · prévia</span><h2>'+esc(unit.objective)+'</h2><p>Escreva algumas frases sobre esse tema. A tarefa definitiva será fornecida pelo conteúdo do curso.</p><p>Começo sugerido <span class="studio-example" lang="'+eu().idioma+'">'+esc(f.starter)+'</span></p>';pg.appendChild(task);
    var label=document.createElement('label');label.className='studio-field';label.textContent='Seu texto';var input=document.createElement('textarea');input.rows=8;input.maxLength=5000;input.lang=eu().idioma;input.placeholder='Escreva aqui, no idioma que você está estudando…';input.value=data.drafts[unit.id]||'';label.appendChild(input);pg.appendChild(label);
    var count=document.createElement('div');count.className='studio-between studio-count';count.innerHTML='<span class="studio-word-count" role="status"></span><span>Salvo neste aparelho</span>';pg.appendChild(count);
    var correct=studioButton('Corrigir',function(){var text=input.value.trim();if(!text)return;ir('ecoWritingLoading',{unit:unit,text:text,lang:eu().idioma});},'primary');
    function update(){var n=input.value.trim()?input.value.trim().split(/\s+/).length:0;$('.studio-word-count',count).textContent=n+(n===1?' palavra':' palavras')+' · '+input.value.length+'/5.000 caracteres';correct.disabled=!n;data.drafts[unit.id]=input.value;salvar();}input.oninput=update;update();
    pg.appendChild(studioButton('Usar texto de demonstração',function(){function fill(){input.value=f.text;update();input.focus();}if(input.value.trim()&&input.value!==f.text){folha(function(sh){sh.innerHTML='<h2>Substituir seu rascunho?</h2><p>O texto atual será trocado pelo exemplo da prévia.</p>';sh.appendChild(studioButton('Manter meu texto',fecharFolha));sh.appendChild(studioButton('Usar exemplo',function(){fecharFolha();fill();},'primary'));});}else fill();},'ghost'));pg.appendChild(correct);pg.appendChild(studioButton('Histórico desta unidade',function(){ir('ecoWritingHistory',unit.id);}));
  };
  TELAS.ecoWritingLoading=function(payload){var pg=studioPage('Eco está lendo','ecoWrite');var box=document.createElement('section');box.className='studio-reading';box.appendChild(eco('thinking','Eco lendo seu texto'));box.insertAdjacentHTML('beforeend','<span class="studio-book" aria-hidden="true">'+svg('book')+'</span><h1>Um instante. Estou lendo…</h1><p role="status">Organizando a prévia das correções.</p><div class="studio-loading" aria-hidden="true"></div>');pg.appendChild(box);studioDemo(pg);pg.appendChild(studioButton('Voltar ao texto',function(){ir('ecoWrite',payload.unit.id);}));studioLater(function(){if(!pg.isConnected)return;var f=studioFixture(),isExample=payload.text===f.text;var r={id:'write-'+Date.now(),date:Date.now(),lang:payload.lang,unit:payload.unit.id,title:payload.unit.title,text:payload.text,corrected:isExample?f.corrected:payload.text,errors:isExample?f.errors:[],score:isExample?7.5:null,demo:true};studioData().writings.unshift(r);salvar();ir('ecoWritingResult',r.id);},1700);};
  TELAS.ecoWritingResult=function(id){var d=studioData(),r=d.writings.find(function(x){return x.id===id;});if(!r){ir('ecoWritingHistory');return;}var pg=studioPage('Sua redação','ecoWritingHistory');
    studioLead(pg,(r.demo?'Resultado · demonstração':'Resultado'),r.score===null?'Seu texto está guardado.':'Boa tentativa! Vamos lapidar?',r.score===null?'A avaliação do seu texto depende da conexão com a IA. Nenhuma nota ou correção foi inventada.':'Você comunicou sua ideia. Agora veja pequenos ajustes.');
    pg.insertAdjacentHTML('beforeend','<div class="studio-score"><strong>'+(r.score===null?'—':String(r.score).replace('.',','))+'</strong><span>/ 10<br>'+(r.score===null?'Aguardando IA':(r.demo?'Nota de exemplo':'Nota do Eco'))+'</span></div><p class="muted">'+esc(r.title)+' · '+studioDate(r.date)+'</p>');
    var marked=document.createElement('section');marked.className='card studio-stack';marked.innerHTML='<h2>'+ (r.errors.length ? 'Seu texto, com atenção aos detalhes' : 'Seu texto') +'</h2><p class="muted">'+ (r.errors.length ? 'Toque nos trechos sublinhados para entender.' : 'As sugestões aparecerão aqui quando a IA estiver conectada.') +'</p>';var text=document.createElement('div');text.className='studio-marked';text.lang=r.lang;
    var pos=0;r.errors.forEach(function(er,i){var at=r.text.indexOf(er[0],pos);if(at<0)return;text.appendChild(document.createTextNode(r.text.slice(pos,at)));var b=document.createElement('button');b.type='button';b.className='studio-mark';b.textContent=er[0];b.setAttribute('aria-label','Ver correção de '+er[0]);b.setAttribute('aria-expanded','false');b.onclick=function(){var was=b.getAttribute('aria-expanded')==='true';$$('.studio-mark',text).forEach(function(x){x.setAttribute('aria-expanded','false');});bubble.hidden=was;if(!was){b.setAttribute('aria-expanded','true');bubble.innerHTML='<strong>'+esc(er[0])+' → '+esc(er[1])+'</strong><p>'+esc(er[2])+'</p>';var close=studioButton('Fechar explicação',function(){bubble.hidden=true;b.setAttribute('aria-expanded','false');b.focus();},'ghost');bubble.appendChild(close);}};text.appendChild(b);pos=at+er[0].length;});text.appendChild(document.createTextNode(r.text.slice(pos)));marked.appendChild(text);var bubble=document.createElement('aside');bubble.className='studio-explanation';bubble.hidden=true;bubble.setAttribute('role','status');marked.appendChild(bubble);pg.appendChild(marked);
    marked.addEventListener('keydown',function(e){if(e.key==='Escape'){bubble.hidden=true;$$('.studio-mark',text).forEach(function(b){b.setAttribute('aria-expanded','false');});}});
    var full=document.createElement('section');full.className='card studio-stack';full.innerHTML='<h2>'+(r.score===null?'Texto original preservado':'Texto inteiro corrigido')+'</h2><p class="studio-full-text" lang="'+r.lang+'">'+esc(r.corrected)+'</p>';pg.appendChild(full);
    var saved=d.notebook.indexOf(r.id)!==-1;var save=studioButton(saved?'Salvo no caderno de erros':'Salvar no caderno de erros',function(){if(d.notebook.indexOf(r.id)===-1)d.notebook.push(r.id);salvar();save.textContent='Salvo no caderno de erros';save.disabled=true;},'primary');save.disabled=saved||!r.errors.length;pg.appendChild(save);pg.appendChild(studioButton('Ver caderno de erros',function(){ir('ecoNotebook');}));pg.appendChild(studioButton('Escrever de novo',function(){ir('ecoWrite',r.unit);}));studioDemo(pg);
  };
  TELAS.ecoWritingHistory=function(unitId){var pg=studioPage('Histórico de redações'),rows=studioData().writings.filter(function(r){return r.lang===eu().idioma&&(!unitId||r.unit===unitId);});studioLead(pg,'Seu caderno','Uma escrita de cada vez.','Textos organizados por unidade, salvos neste perfil.');var units=studioUnits();units.forEach(function(u){var list=rows.filter(function(r){return r.unit===u.id;});if(!list.length)return;var sec=document.createElement('section');sec.className='studio-stack';sec.innerHTML='<h2>'+esc(u.title)+'</h2>';list.forEach(function(r){sec.appendChild(studioButton(studioDate(r.date)+' · '+(r.score===null?'Aguardando IA':String(r.score).replace('.',',')+'/10'+(r.demo?' · exemplo':'')),function(){ir('ecoWritingResult',r.id);}));});pg.appendChild(sec);});if(!rows.length)pg.insertAdjacentHTML('beforeend','<div class="card"><h2>Um espaço para suas próximas ideias</h2><p>Suas redações aparecerão aqui depois de tocar em Corrigir.</p></div>');pg.appendChild(studioButton('Nova redação',function(){ir('ecoWrite',unitId);},'primary'));if(unitId)pg.appendChild(studioButton('Ver todas as unidades',function(){ir('ecoWritingHistory');}));};
  TELAS.ecoNotebook=function(){var pg=studioPage('Caderno de erros'),d=studioData(),rows=d.writings.filter(function(r){return r.lang===eu().idioma&&d.notebook.indexOf(r.id)!==-1;});studioLead(pg,'Aprender com os ajustes','O que vamos praticar?','Correções salvas das suas redações.');rows.forEach(function(r){var sec=document.createElement('section');sec.className='studio-stack';sec.innerHTML='<h2>'+esc(r.title)+'</h2>';studioErrors(sec,r.errors);sec.appendChild(studioButton('Abrir redação',function(){ir('ecoWritingResult',r.id);}));pg.appendChild(sec);});if(!rows.length)pg.insertAdjacentHTML('beforeend','<p>Nenhuma correção salva ainda. Corrija uma redação e salve aqui o que quer praticar.</p>');pg.appendChild(studioButton('Escrever uma redação',function(){ir('ecoWrite');},'primary'));};

  /* ================= IA de verdade nas telas do Eco (src/ia-telas.js) ================= */
  function IAon() { return !!(window.IA && IA.ativo()); }
  function tarefaDe(unitId) {
    var m = /^(en|fr)-u(\d+)$/.exec(unitId || ''), L = m && COURSE[m[1]], U = L && L.units[+m[2] - 1];
    return (U && U.write) || null;
  }
  function semDemo(pg) { if (!pg) return; $$('.studio-demo', pg).forEach(function (x) { x.remove(); }); }
  var _ecoWrite = TELAS.ecoWrite;
  TELAS.ecoWrite = function (unitId) {
    _ecoWrite(unitId);
    if (!IAon()) return;
    var pg = $('.eco-studio'); semDemo(pg);
    $$('button', pg).forEach(function (b) { if (b.textContent === 'Usar texto de demonstração') b.remove(); });
    var sel = $('.studio-field select', pg), uid = (sel && sel.value) || unitId, w = tarefaDe(uid), task = $('.card.studio-stack', pg);
    if (w && task) task.innerHTML = '<span class="ui-label">Tarefa da unidade</span><h2>' + esc(w.task) + '</h2>' + (w.ph ? '<p>Começo sugerido <span class="studio-example" lang="' + eu().idioma + '">' + esc(w.ph) + '</span></p>' : '');
  };
  var _ecoWritingLoading = TELAS.ecoWritingLoading;
  TELAS.ecoWritingLoading = function (payload) {
    if (!IAon()) { var local=studioPage('Correção com o Eco','ecoWrite');local.appendChild(document.createTextNode('Seu texto fica no rascunho. Entre com Google para pedir a correção por IA.'));local.appendChild(studioButton('Entrar com Google',function(){AUTH.start();},'primary'));return; }
    var owner = eu(), ownerData = studioData();
    var pg = studioPage('Eco está lendo', 'ecoWrite'), box = document.createElement('section'); box.className = 'studio-reading';
    box.appendChild(eco('thinking', 'Eco lendo seu texto'));
    box.insertAdjacentHTML('beforeend', '<span class="studio-book" aria-hidden="true">' + svg('book') + '</span><h1>Um instante. Estou lendo…</h1><p role="status" class="ia-status">Corrigindo com calma. Pode levar até meio minuto.</p><div class="studio-loading" aria-hidden="true"></div>');
    pg.appendChild(box);
    var voltar = studioButton('Voltar ao texto', function () { ir('ecoWrite', payload.unit.id); }); pg.appendChild(voltar);
    var w = tarefaDe(payload.unit.id);
    IA.pedir('redacao', { idioma: payload.lang, nivel: payload.unit.level, unidade: payload.unit.title, objetivo: payload.unit.objective, tarefa: w && w.task, texto: payload.text })
      .then(function (r) {
        var d = r.dados || {}, rec = { id: 'write-' + Date.now(), date: Date.now(), lang: payload.lang, unit: payload.unit.id, title: payload.unit.title, text: payload.text,
          corrected: d.corrigido || payload.text, errors: (d.erros || []).map(function (e) { return [e.trecho, e.correcao, e.explicacao]; }),
          score: typeof d.nota === 'number' ? d.nota : null, resumo: d.resumo || '', demo: false };
        if (S.perfis.indexOf(owner) < 0) return;
        var dd = ownerData; dd.writings.unshift(rec); if (dd.writings.length > 30) dd.writings.length = 30;
        if (dd.drafts) delete dd.drafts[payload.unit.id];
        salvar(); if (pg.isConnected && eu() === owner) ir('ecoWritingResult', rec.id); else if (eu() === owner) toast('Sua redação foi corrigida. Veja no histórico.');
      })
      .catch(function (e) {
        if (!pg.isConnected) return;
        $('.studio-loading', box) && $('.studio-loading', box).remove();
        $('h1', box).textContent = 'Não deu para corrigir agora';
        $('.ia-status', box).textContent = IA.erroTexto(e) + ' Seu texto continua guardado.';
        pg.insertBefore(studioButton('Tentar de novo', function () { ir('ecoWritingLoading', payload); }, 'primary'), voltar);
      });
  };
  var _ecoWritingResult = TELAS.ecoWritingResult;
  TELAS.ecoWritingResult = function (id) {
    _ecoWritingResult(id);
    var r = studioData().writings.find(function (x) { return x.id === id; }); if (!r || r.demo) return;
    var pg = $('.eco-studio'); semDemo(pg);
    if (r.resumo) { var lead = $('.studio-heading p', pg); if (lead) lead.textContent = r.resumo; }
    if (!r.errors.length) { var t = $('.studio-marked', pg); if (t && t.previousElementSibling) t.previousElementSibling.textContent = 'Nenhum erro encontrado. Muito bem!'; }
  };
  var _ecoHub = TELAS.ecoHub;
  TELAS.ecoHub = function () {
    _ecoHub();
    var pg = $('.eco-studio'); if (!pg) return;
    var card = document.createElement('section'); card.className = 'card studio-feature';
    card.innerHTML = '<span class="studio-icon">' + svg('book') + '</span><h2>Tirar dúvida com o Eco</h2><p>Pergunte sobre gramática, palavras ou como dizer algo. A resposta vem em português, com exemplos.</p>';
    card.appendChild(studioButton('Perguntar', function () { ir('ecoDuvida'); }, 'primary'));
    var links = $('.studio-actions', pg); pg.insertBefore(card, links || null);
    if (IAon()) { var demo = $('.studio-demo', pg); if (demo) demo.textContent = 'Redação, dúvidas e conversa usam os serviços de IA configurados para o aplicativo.'; }
  };
  TELAS.ecoDuvida = function () {
    var pg = studioPage('Tirar dúvida'), d = studioData(), u = studioCurrent(), lang = eu().idioma;
    d.duvidas = d.duvidas || [];
    studioLead(pg, 'Pergunte ao Eco', 'Ficou alguma dúvida?', 'Gramática, palavras, pronúncia ou "como se diz…". O Eco sabe em que unidade você está: ' + u.title + '.');
    if (!IAon()) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p>As dúvidas funcionam no app instalado, com a IA ligada.</p></div>'); return; }
    var lista = document.createElement('div'); lista.className = 'ia-chat'; lista.setAttribute('aria-live', 'polite'); pg.appendChild(lista);
    function bolha(m) { var b = document.createElement('div'); b.className = 'ia-msg ia-msg--' + (m.de === 'eco' ? 'eco' : 'eu'); b.innerHTML = '<p>' + (m.de === 'eco' ? IA.html(m.texto) : esc(m.texto)) + '</p>'; lista.appendChild(b); return b; }
    var mine = d.duvidas.filter(function (m) { return m.lang === lang; });
    mine.forEach(bolha);
    var SUG = lang === 'fr' ? ['Quando uso tu e quando uso vous?', 'Qual a diferença entre c\'est e il est?', 'Como se diz "estou com saudade"?']
                            : ['Qual a diferença entre make e do?', 'Quando uso the e quando não uso?', 'Como se diz "estou com saudade"?'];
    var sug = document.createElement('div'); sug.className = 'ia-sug';
    if (!mine.length) SUG.forEach(function (s) { sug.appendChild(studioButton(s, function () { input.value = s; enviar(); }, 'ghost')); });
    pg.appendChild(sug);
    var label = document.createElement('label'); label.className = 'studio-field'; label.textContent = 'Sua pergunta';
    var input = document.createElement('textarea'); input.rows = 3; input.maxLength = 1500; input.placeholder = 'Escreva sua dúvida…'; label.appendChild(input); pg.appendChild(label);
    var btn = studioButton('Enviar', enviar, 'primary'); pg.appendChild(btn);
    if (mine.length) pg.appendChild(studioButton('Limpar conversa', function () { d.duvidas = d.duvidas.filter(function (m) { return m.lang !== lang; }); salvar(); ir('ecoDuvida'); }, 'ghost'));
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } });
    function enviar() {
      var q = input.value.trim(); if (!q || btn.disabled) return;
      sug.innerHTML = ''; input.value = ''; btn.disabled = true;
      var hist = d.duvidas.filter(function (m) { return m.lang === lang; }).slice(-8);
      var m = { de: 'eu', texto: q, lang: lang, em: Date.now() }; d.duvidas.push(m); bolha(m);
      var esp = bolha({ de: 'eco', texto: 'Pensando…' }); esp.classList.add('ia-msg--espera');
      esp.scrollIntoView({ block: 'nearest', behavior: S.cfg.motion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      IA.pedir('duvida', { idioma: lang, nivel: u.level, unidade: u.title, objetivo: u.objective, historico: hist, pergunta: q })
        .then(function (r) { var a = { de: 'eco', texto: r.texto, lang: lang, em: Date.now() }; d.duvidas.push(a); esp.innerHTML = '<p>' + IA.html(a.texto) + '</p>'; esp.classList.remove('ia-msg--espera'); })
        .catch(function (e) { esp.innerHTML = '<p>' + esc(IA.erroTexto(e)) + '</p>'; esp.classList.remove('ia-msg--espera'); d.duvidas.pop(); input.value = q; })
        .then(function () { if (d.duvidas.length > 60) d.duvidas.splice(0, d.duvidas.length - 60); salvar(); btn.disabled = false; if (pg.isConnected) input.focus(); });
    }
  };
  /* ---------- Pronúncia: ouvir, gravar, comparar ---------- */
  function unidadeDe(unitId) { var m = /^(en|fr)-u(\d+)$/.exec(unitId || ''), L = m && COURSE[m[1]]; return (L && L.units[+m[2] - 1]) || null; }
  function normPal(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{N}'\s-]/gu, ' ').split(/\s+/).filter(Boolean); }
  function alinhar(esp, ouv) {   /* quais palavras esperadas apareceram, na ordem (maior subsequência comum) */
    var a = esp.map(function (w) { return normPal(w).join(' '); }), b = normPal(ouv), n = a.length, m = b.length, T = [];
    for (var i = 0; i <= n; i++) { T.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) T[i][j] = a[i] && a[i] === b[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    var ok = new Array(n).fill(false); i = 0; j = 0;
    while (i < n && j < m) { if (a[i] && a[i] === b[j]) { ok[i] = true; i++; j++; } else if (T[i + 1][j] >= T[i][j + 1]) i++; else j++; }
    a.forEach(function (w, k) { if (!w) ok[k] = true; });
    return ok;
  }
  function gravador() {
    var rec, chunks = [], stream, cancelled = false;
    return {
      iniciar: function () {
        return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (s) {
          if (cancelled) { s.getTracks().forEach(function (t) { t.stop(); }); throw new Error('cancelado'); }
          stream = s; chunks = [];
          var mt = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].filter(function (t) { return window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0];
          try { rec = new MediaRecorder(s, mt ? { mimeType: mt } : undefined); } catch (e) { s.getTracks().forEach(function (t) { t.stop(); }); throw e; }
          rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
          rec.start();
        });
      },
      parar: function () {
        return new Promise(function (res) {
          if (!rec || rec.state === 'inactive') { res(null); return; }
          rec.onstop = function () { stream.getTracks().forEach(function (t) { t.stop(); }); res(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); };
          rec.stop();
        });
      },
      cancelar: function () { cancelled = true; try { rec && rec.state !== 'inactive' && rec.stop(); } catch (e) {} try { stream && stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
    };
  }
  function blobB64(b) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1] || ''); }; r.onerror = rej; r.readAsDataURL(b); }); }
  var gravAtual = null;
  TELAS.ecoPronuncia = function (unitId) {
    if (gravAtual) { gravAtual.cancelar(); gravAtual = null; }
    var pg = studioPage('Treinar pronúncia'), units = studioUnits(), unit = units.find(function (x) { return x.id === unitId; }) || studioCurrent();
    var lang = eu().idioma, voz = CURSOS[lang].voz, U = unidadeDe(unit.id), d = studioData(); d.pron = d.pron || {};
    studioLead(pg, 'Pronúncia · ' + unit.level, 'Ouça, repita e compare a transcrição.', 'O percentual indica palavras reconhecidas, sem medir todos os sons ou a entonação. Falhas do reconhecimento também podem acontecer.');
    var lab = document.createElement('label'); lab.className = 'studio-field'; lab.textContent = 'Unidade'; var sel = document.createElement('select');
    units.filter(function (x) { return x.done || x.current || x.id === unit.id; }).forEach(function (x) { var op = document.createElement('option'); op.value = x.id; op.textContent = x.title; sel.appendChild(op); });
    sel.value = unit.id; sel.onchange = function () { ir('ecoPronuncia', sel.value); }; lab.appendChild(sel); pg.appendChild(lab);
    if (!IAon()) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p>A pronúncia funciona no app instalado, com a IA ligada.</p></div>'); return; }
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p>Este navegador não permite gravar áudio. Tente pelo Chrome ou pelo Safari atualizado.</p></div>'); return; }
    var frases = [].concat((U && U.shadow) || []);
    if (frases.length < 6 && U && U.dict) U.dict.forEach(function (x) { if (frases.length < 6 && frases.indexOf(x.t) < 0) frases.push(x.t); });
    if (!frases.length) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p>Esta unidade ainda não tem frases para treinar.</p></div>'); return; }
    frases.forEach(function (f, k) {
      var chave = unit.id + '|' + k, card = document.createElement('section'); card.className = 'card pron-card';
      var txt = document.createElement('p'); txt.className = 'pron-frase'; txt.lang = lang;
      var pal = f.split(/\s+/); pal.forEach(function (w, i) { var s = document.createElement('span'); s.textContent = w; txt.appendChild(s); if (i < pal.length - 1) txt.appendChild(document.createTextNode(' ')); });
      card.appendChild(txt);
      var acoes = document.createElement('div'); acoes.className = 'pron-acoes';
      var ouvir = studioButton('Ouvir', function () { AUD.stop(); if (!AUD.say(f, voz, null, S.cfg.voz || 0.9)) { var u = new SpeechSynthesisUtterance(f); u.lang = voz; speechSynthesis.speak(u); } });
      var gravar = studioButton('Gravar', alternar, 'primary');
      acoes.appendChild(ouvir); acoes.appendChild(gravar); card.appendChild(acoes);
      var st = document.createElement('p'); st.className = 'pron-status'; st.setAttribute('role', 'status'); card.appendChild(st);
      var res = document.createElement('div'); res.className = 'pron-res'; card.appendChild(res);
      if (d.pron[chave] != null) st.textContent = 'Melhor correspondência com a transcrição: ' + d.pron[chave] + '%.';
      pg.appendChild(card);
      var g = null, timer = null, t0 = 0;
      studioCleanup(function () { clearInterval(timer); if (g) g.cancelar(); if (gravAtual === g) gravAtual = null; g = null; });
      function alternar() {
        if (g) { parar(); return; }
        if (gravAtual) { toast('Termine a outra gravação primeiro.'); return; }
        AUD.stop(); g = gravador(); gravAtual = g;
        g.iniciar().then(function () {
          if (!pg.isConnected) { if (g) g.cancelar(); return; } t0 = Date.now(); gravar.textContent = 'Parar · 0s'; card.classList.add('is-gravando'); st.textContent = 'Gravando… diga a frase.';
          timer = setInterval(function () { var s = Math.round((Date.now() - t0) / 1000); gravar.textContent = 'Parar · ' + s + 's'; if (s >= 15) parar(); }, 250);
        }).catch(function () { g = null; gravAtual = null; st.textContent = 'Não consegui usar o microfone. Permita o acesso ao microfone nas configurações do navegador.'; });
      }
      function parar() {
        clearInterval(timer); var gg = g; g = null; gravAtual = null; card.classList.remove('is-gravando');
        gravar.textContent = 'Gravar'; gravar.disabled = true; st.textContent = 'O Eco está ouvindo…';
        gg.parar().then(function (blob) {
          if (!blob || blob.size < 1500) throw new Error('curto');
          return blobB64(blob).then(function (b64) { return IA.pedir('pronuncia', { idioma: lang, frase: f, audio: b64, mime: blob.type }); });
        }).then(function (r) {
          var ok = alinhar(pal, r.ouvido || ''), conta = pal.map(function (w) { return normPal(w).length > 0; }), tot = conta.filter(Boolean).length || 1, n = ok.filter(function (x, i) { return x && conta[i]; }).length, pct = Math.round(100 * n / tot);
          $$('span', txt).forEach(function (s, i) { s.className = ok[i] ? 'pron-ok' : 'pron-erro'; });
          res.innerHTML = '<div class="pron-nota"><strong>' + pct + '%</strong><span>das palavras esperadas foram reconhecidas</span></div>' +
            '<p class="muted">O reconhecimento entendeu: <span lang="' + lang + '">«' + esc(r.ouvido || '…') + '»</span></p>' + (r.dica ? '<p class="pron-dica">' + IA.html(r.dica) + '</p>' : '');
          st.textContent = pct === 100 ? 'As palavras esperadas apareceram na transcrição. Você pode praticar a entonação.' : 'Grave de novo quando quiser.';
          if (d.pron[chave] == null || pct > d.pron[chave]) { d.pron[chave] = pct; salvar(); }
          tocar(pct >= 80 ? 'acerto' : 'aviso');
        }).catch(function (e) {
          st.textContent = /curto/.test(String(e && e.message)) ? 'A gravação ficou curta demais. Segure um pouco mais e fale a frase inteira.' : IA.erroTexto(e);
        }).then(function () { gravar.disabled = false; });
      }
    });
  };
  var _ecoHub2 = TELAS.ecoHub;
  TELAS.ecoHub = function () {
    _ecoHub2();
    var pg = $('.eco-studio'); if (!pg) return;
    var card = document.createElement('section'); card.className = 'card studio-feature';
    card.innerHTML = '<span class="studio-icon">' + svg('mic') + '</span><h2>Treinar pronúncia</h2><p>Ouça uma frase da unidade, grave a sua versão e veja quais palavras ficaram claras.</p>';
    card.appendChild(studioButton('Treinar', function () { ir('ecoPronuncia'); }, 'primary'));
    var links = $('.studio-actions', pg); pg.insertBefore(card, links || null);
  };
  /* ---------- Conversa por turnos com o Eco (IA de verdade) ---------- */
  function cenarioDe(u) {
    var U = unidadeDe(u.id);
    return { id: u.id, title: u.title, level: u.level, minutes: 5, objetivo: u.objective || '', contexto: (U && U.setting) || '',
      role: U && U.setting ? 'Eco entra na situação da unidade: ' + U.setting : 'Eco é seu parceiro de conversa' };
  }
  var _ecoScenarios = TELAS.ecoScenarios;
  TELAS.ecoScenarios = function () {
    if (!IAon()) { var local=studioPage('Conversa com o Eco');local.appendChild(document.createTextNode('Entre com Google para usar a conversa por IA.'));local.appendChild(studioButton('Entrar com Google',function(){AUTH.start();},'primary'));return; }
    var pg = studioPage('Escolher conversa'), units = studioUnits(), cur = studioCurrent();
    studioLead(pg, 'Conversa por voz', 'Sobre o que vamos falar?', 'O Eco entra na situação da unidade e fala no seu nível. Você responde segurando o botão.');
    function card(x) { var c = document.createElement('section'); c.className = 'card studio-scenario';
      c.innerHTML = '<div class="studio-between"><h2>' + esc(x.title) + '</h2><span class="studio-tag">' + esc(x.level) + '</span></div><p>' + esc(x.role) + '</p>';
      c.appendChild(studioButton('Escolher este cenário', function () { ir('ecoSetup', x); }, 'primary')); pg.appendChild(c); }
    card(cenarioDe(cur));
    card({ id: 'free', title: 'Conversa livre', level: cur.level, minutes: 10, contexto: 'conversa livre sobre o dia a dia, os interesses e a vida do aluno', objetivo: '', role: 'Eco puxa assunto sobre o seu dia, seus planos e o que você gosta.' });
    var feitas = units.filter(function (x) { return x.done && x.id !== cur.id; }).reverse();
    if (feitas.length) { var det = document.createElement('details'); det.className = 'card studio-details'; det.innerHTML = '<summary>Unidades já concluídas (' + feitas.length + ')</summary>';
      feitas.forEach(function (u) { det.appendChild(studioButton(u.title + ' · ' + u.level, function () { ir('ecoSetup', cenarioDe(u)); })); }); pg.appendChild(det); }
  };
  var _ecoSetup = TELAS.ecoSetup;
  TELAS.ecoSetup = function (sc) {
    if (!IAon()) return _ecoSetup(sc);
    var pg = studioPage('Preparar conversa', 'ecoScenarios'), corrections = 'during', captions = 'translation';
    studioLead(pg, sc.level + ' · Conversa por voz', sc.title, 'Sem pressa. Você pode pedir ajuda, repetir ou interromper o Eco.');
    var opts = document.createElement('section'); opts.className = 'card studio-stack';
    function group(t, items, v, fn) { var h = document.createElement('h2'); h.textContent = t; opts.appendChild(h); opts.appendChild(segmento(items, v, fn, t)); }
    var modo = 'live';
    group('Modo', [{ v: 'live', t: 'Ao vivo' }, { v: 'turns', t: 'Por turnos' }], modo, function (v) { modo = v; atualizarMic(); });
    opts.insertAdjacentHTML('beforeend', '<p class="muted">Ao vivo: fale à vontade e interrompa o Eco quando quiser. Por turnos: segure um botão para falar.</p>');
    group('Correções', [{ v: 'during', t: 'Durante a conversa' }, { v: 'end', t: 'Só no final' }], corrections, function (v) { corrections = v; });
    group('Legendas', [{ v: 'on', t: 'Ligadas' }, { v: 'off', t: 'Desligadas' }, { v: 'translation', t: 'Com tradução' }], captions, function (v) { captions = v; });
    pg.appendChild(opts);
    var mic = document.createElement('section'); mic.className = 'card studio-stack';
    mic.innerHTML = '<span class="studio-icon">' + svg('mic') + '</span><h2>Podemos usar seu microfone?</h2><p class="studio-mic-explain"></p><p>Por turnos, você também pode responder por texto. As falas são processadas pelos serviços de IA configurados pelo responsável pelo aplicativo.</p><p class="studio-mic-status" role="status"></p>';
    function atualizarMic() { if (!mic) return; $('.studio-mic-explain', mic).textContent = modo === 'live' ? 'Ao vivo, o microfone transmite áudio continuamente ao Gemini enquanto estiver ligado. Silencie ou encerre para parar.' : 'Por turnos, a gravação é enviada quando você solta o botão. O áudio é processado pelo servidor e pelo serviço de reconhecimento disponível.'; if (start) start.disabled = modo === 'live' && !granted; }
    var granted = false, start = studioButton('Começar conversa', function () {
      if (!granted && modo === 'live') return;
      studioSession = { scenario: sc, corrections: corrections, captions: captions, minutes: sc.minutes, seconds: 0, muted: false, mode: modo, transcript: [], hist: [], correcoes: [], lang: eu().idioma, real: true };
      ir('ecoCall');
    }, 'primary'); start.disabled = true; atualizarMic();
    var pedir = studioButton('Permitir microfone', function () {
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) { $('.studio-mic-status', mic).textContent = 'Este navegador não permite gravar áudio. Tente pelo Chrome ou pelo Safari atualizado.'; return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) { st.getTracks().forEach(function (t) { t.stop(); }); granted = true; start.disabled = false; pedir.disabled = true; $('.studio-mic-status', mic).textContent = 'Microfone liberado. Tudo pronto!'; })
        .catch(function () { $('.studio-mic-status', mic).textContent = 'O microfone foi bloqueado. Libere o acesso ao microfone nas configurações do navegador e tente de novo.'; });
    });
    mic.appendChild(pedir); pg.appendChild(mic); pg.appendChild(start);
  };
  var _ecoCall = TELAS.ecoCall;
  TELAS.ecoCall = function () {
    var s = studioSession; if (!s) { ir('ecoScenarios'); return; }
    if (!IAon() || !s.real) return _ecoCall();
    var lang = s.lang, voz = CURSOS[lang].voz, pg = studioPage('Conversa com o Eco', 'ecoScenarios'); pg.classList.add('studio-call');
    pg.insertAdjacentHTML('beforeend', '<div class="studio-between"><div><span class="ui-label">' + esc(s.scenario.level) + ' · Por turnos</span><h1>' + esc(s.scenario.title) + '</h1></div><span class="studio-timer" aria-label="Tempo de conversa">' + studioTime(s.seconds) + '</span></div>');
    var stage = document.createElement('div'); stage.className = 'studio-stage'; var mascot = eco('thinking', 'Eco'); stage.appendChild(mascot);
    stage.insertAdjacentHTML('beforeend', '<span class="studio-orbit" aria-hidden="true"></span><p class="studio-state" role="status"></p><div class="studio-wave" aria-hidden="true">' + Array.from({ length: 15 }, function (_, i) { return '<i style="--d:' + i * .08 + 's;--h:' + (12 + (i % 4) * 7) + 'px"></i>'; }).join('') + '</div><p class="studio-voice-label">Sua voz</p>');
    pg.appendChild(stage);
    var correction = document.createElement('div'); correction.className = 'studio-correction'; correction.setAttribute('role', 'status'); correction.hidden = true; pg.appendChild(correction);
    var subtitles = document.createElement('div'); subtitles.className = 'studio-subtitles'; subtitles.setAttribute('aria-live', 'polite'); pg.appendChild(subtitles);
    var help = document.createElement('div'); help.className = 'studio-help'; help.hidden = true; pg.appendChild(help);
    var actions = document.createElement('div'); actions.className = 'studio-call-actions';
    var state = 'connecting', ocupado = false, chipTimer = null;
    var LBL = { connecting: 'Conectando…', listening: 'Segure o botão para falar', recording: 'Estou ouvindo você', thinking: 'Eco está pensando…', speaking: 'Eco está falando', muted: 'Microfone silenciado' };
    function setState(v) { state = v; stage.dataset.state = v === 'recording' ? 'listening' : v; mascot.dataset.state = { connecting: 'thinking', listening: 'listening', recording: 'listening', thinking: 'thinking', speaking: 'speaking', muted: 'neutral' }[v]; $('.studio-state', stage).textContent = LBL[v]; mascot.setAttribute('aria-label', LBL[v]); }
    function caption() { subtitles.innerHTML = ''; if (s.captions === 'off') { subtitles.innerHTML = '<p class="muted">Legendas desligadas</p>'; return; }
      s.transcript.slice(-2).forEach(function (t) { var b = document.createElement('div'); b.className = 'studio-caption ' + (t.who === 'Você' ? 'is-user' : ''); b.innerHTML = '<strong>' + esc(t.who) + '</strong><p lang="' + lang + '">' + esc(t.text) + '</p>' + (s.captions === 'translation' && t.pt ? '<small>' + esc(t.pt) + '</small>' : ''); subtitles.appendChild(b); }); }
    function add(who, text, pt) { s.transcript.push({ who: who, text: text, pt: pt || '' }); caption(); }
    function vozDoIdioma() { var vs = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : []; return vs.filter(function (v) { return v.lang && v.lang.replace('_', '-').indexOf(voz) === 0; })[0] || vs.filter(function (v) { return v.lang && v.lang.slice(0, 2) === lang; })[0] || null; }
    function falar(texto, rate) {
      if (!pg.isConnected) return;
      if(S.cfg.silent){setState(s.muted?'muted':'listening');return;}
      setState('speaking');
      if (!('speechSynthesis' in window)) { setTimeout(function () { if (pg.isConnected) setState(s.muted ? 'muted' : 'listening'); }, 1500); return; }
      speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(texto); u.lang = voz; u.rate = rate || S.cfg.voz || 0.9; var v = vozDoIdioma(); if (v) u.voice = v;
      u.onend = u.onerror = function () { if (pg.isConnected && state === 'speaking') setState(s.muted ? 'muted' : 'listening'); };
      speechSynthesis.speak(u);
    }
    function ajudar() { help.innerHTML = s.sugestao ? '<strong>Você consegue. Tente assim:</strong><p class="studio-example" lang="' + lang + '">' + esc(s.sugestao) + '</p>' + (s.sugestaoPt ? '<p>' + esc(s.sugestaoPt) + '</p>' : '') : '<p>Escute o Eco e responda com uma frase curta. Pode ser simples!</p>'; }
    function pedirEco(dados) {
      ocupado = true; setState('thinking');
      var sc = s.scenario;
      IA.pedir('conversa', Object.assign({ idioma: lang, correcoes: s.corrections, historico: s.hist,
        cenario: { titulo: sc.title, nivel: sc.level, contexto: sc.contexto || '', objetivo: sc.objetivo || '', papel: sc.role || '' } }, dados))
        .then(function (r) {
          if (!pg.isConnected) return;
          if (r.vazio) { toast('Não ouvi nada. Segure o botão e fale mais perto do microfone.'); setState(s.muted ? 'muted' : 'listening'); return; }
          if (r.ouvido && !dados.inicio) { add('Você', r.ouvido, ''); s.hist.push({ de: 'eu', texto: r.ouvido }); }
          if (r.correcao) { s.correcoes.push(r.correcao);
            if (s.corrections === 'during') { correction.textContent = 'Você disse: ' + r.correcao.voce + ' → Melhor: ' + r.correcao.melhor; correction.hidden = false; clearTimeout(chipTimer); chipTimer = studioLater(function () { correction.hidden = true; }, 8000); } }
          s.ultimo = r.fala; s.sugestao = r.sugestao; s.sugestaoPt = r.sugestaoPt; ajudar();
          add('Eco', r.fala, r.traducao); s.hist.push({ de: 'eco', texto: r.fala }); falar(r.fala);
        })
        .catch(function (e) { if (!pg.isConnected) return; setState(s.muted ? 'muted' : 'listening'); toast(IA.erroTexto(e)); })
        .then(function () { ocupado = false; });
    }
    /* gravação: segurar para falar */
    var g = null, soltou = false, t0 = 0, limite = null;
    studioCleanup(function () { clearTimeout(limite); if (g) g.cancelar(); g = null; });
    function comecar() {
      if (s.muted) { toast('Ative o microfone para falar.'); return; }
      if (ocupado || g) return;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      soltou = false; g = gravador();
      g.iniciar().then(function () { if (!pg.isConnected) { if (g) g.cancelar(); return; } t0 = Date.now(); setState('recording'); stage.classList.add('user-speaking'); voice.textContent = 'Ouvindo… solte para enviar';
        limite = setTimeout(terminar, 30000); if (soltou) terminar(); })
        .catch(function () { g = null; toast('Não consegui usar o microfone. Libere o acesso nas configurações do navegador.'); });
    }
    function terminar() {
      soltou = true; if (!g || state !== 'recording') return;
      clearTimeout(limite); var gg = g; g = null; stage.classList.remove('user-speaking'); voice.textContent = 'Segure para falar · solte para enviar';
      var dur = Date.now() - t0;
      gg.parar().then(function (blob) {
        if (!blob || blob.size < 1500 || dur < 500) { setState('listening'); toast('Muito curto. Segure o botão enquanto fala.'); return; }
        setState('thinking'); return blobB64(blob).then(function (b64) { pedirEco({ audio: b64, mime: blob.type }); });
      });
    }
    var voice = studioButton('Segure para falar · solte para enviar', function () {}, 'primary'); voice.classList.add('studio-voice-button');
    voice.onpointerdown = function (e) { e.preventDefault(); try { voice.setPointerCapture(e.pointerId); } catch (er) {} comecar(); };
    voice.onpointerup = voice.onpointercancel = function () { terminar(); };
    voice.oncontextmenu = function (e) { e.preventDefault(); };
    voice.onkeydown = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); comecar(); } };
    voice.onkeyup = function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); terminar(); } };
    var mic = studioButton('Silenciar microfone', function () { s.muted = !s.muted; mic.textContent = s.muted ? 'Ativar microfone' : 'Silenciar microfone'; mic.setAttribute('aria-pressed', String(s.muted)); setState(s.muted ? 'muted' : 'listening'); });
    actions.appendChild(mic);
    var hint = studioButton('Me ajuda', function () { ajudar(); help.hidden = !help.hidden; hint.setAttribute('aria-expanded', String(!help.hidden)); }); hint.setAttribute('aria-expanded', 'false'); actions.appendChild(hint);
    actions.appendChild(studioButton('Repetir mais devagar', function () { if (s.ultimo && !ocupado) falar(s.ultimo, 0.7); }));
    actions.appendChild(studioButton('Encerrar', function () { finalizarConversa(); }, 'danger'));
    var escrever = document.createElement('details'); escrever.className = 'studio-details'; escrever.innerHTML = '<summary>Prefere escrever esta resposta?</summary>';
    var ta = document.createElement('textarea'); ta.rows = 2; ta.maxLength = 400; ta.lang = lang; ta.placeholder = 'Escreva no idioma…'; var label = document.createElement('label'); label.className = 'studio-field'; label.textContent = 'Sua resposta por texto'; label.appendChild(ta); escrever.appendChild(label);
    escrever.appendChild(studioButton('Enviar texto', function () { var t = ta.value.trim(); if (!t || ocupado) return; ta.value = ''; if ('speechSynthesis' in window) speechSynthesis.cancel(); pedirEco({ texto: t }); }));
    var prefs = document.createElement('details'); prefs.className = 'studio-details'; prefs.innerHTML = '<summary>Legendas</summary>';
    prefs.appendChild(segmento([{ v: 'on', t: 'Ligadas' }, { v: 'off', t: 'Desligadas' }, { v: 'translation', t: 'Com tradução' }], s.captions, function (v) { s.captions = v; caption(); }, 'Legendas da conversa'));
    pg.appendChild(escrever); pg.appendChild(prefs);
    var dock = document.createElement('div'); dock.className = 'studio-call-dock'; dock.appendChild(actions); dock.appendChild(voice); pg.appendChild(dock);
    var interval = setInterval(function () { if (!pg.isConnected) { clearInterval(interval); if ('speechSynthesis' in window) speechSynthesis.cancel(); if (g) g.cancelar(); return; } s.seconds++; $('.studio-timer', pg).textContent = studioTime(s.seconds); }, 1000);
    studioTimers.push(interval); caption(); setState('connecting');
    if (s.hist.length) { setState('listening'); ajudar(); } else pedirEco({ inicio: true });
  };
  function finalizarConversa() {
    var s = studioSession; if (!s) { ir('ecoHub'); return; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    var falas = s.transcript.filter(function (t) { return t.who === 'Você'; }).length, xp = Math.min(50, falas * 5);
    var rec = { id: 'call-' + Date.now(), date: Date.now(), lang: s.lang, scenario: s.scenario.title, seconds: s.seconds, xp: xp, transcript: s.transcript.slice(),
      errors: s.correcoes.map(function (c) { return [c.voce, c.melhor, '']; }), words: [], demo: false, analisando: falas > 0, resumo: '' };
    var d = studioData(); d.calls.unshift(rec); if (d.calls.length > 30) d.calls.length = 30;
    var p = eu(); if (xp) { p.xp = (p.xp || 0) + xp; }
    salvar(); studioSession = null; ir('ecoSummary', rec.id);
    if (!falas) return;
    IA.pedir('conversaResumo', { idioma: rec.lang, nivel: s.scenario.level, cenario: s.scenario.title,
      transcricao: rec.transcript.map(function (t) { return { de: t.who === 'Eco' ? 'eco' : 'eu', texto: t.text }; }) })
      .then(function (r) { rec.resumo = r.resumo || ''; if (r.erros && r.erros.length) rec.errors = r.erros; rec.words = r.palavras || []; })
      .catch(function () { rec.resumo = 'Não consegui analisar esta conversa agora, mas a transcrição está guardada.'; })
      .then(function () { rec.analisando = false; salvar(); var aberto = $('.eco-studio'); if (aberto && aberto.dataset.call === rec.id) ir('ecoSummary', rec.id); });
  }
  var _ecoSummary = TELAS.ecoSummary;
  TELAS.ecoSummary = function (id) {
    _ecoSummary(id);
    var r = studioData().calls.find(function (x) { return x.id === id; }); if (!r || r.demo) return;
    var pg = $('.eco-studio'); if (!pg) return; pg.dataset.call = id; semDemo(pg);
    var lab = $('.studio-heading .ui-label', pg); if (lab) lab.textContent = 'Resumo da conversa';
    var lead = $('.studio-heading p', pg); if (lead) lead.textContent = r.analisando ? 'O Eco está analisando a sua conversa…' : (r.resumo || 'Você reservou um momento para praticar. O Eco está com você!');
    $$('.studio-metrics span', pg).forEach(function (sp) { if (/Exemplo/.test(sp.textContent)) sp.textContent = 'Somados ao seu XP'; });
    $$('p.muted', pg).forEach(function (m) { if (/Exemplo de 3 correções/.test(m.textContent)) m.textContent = r.analisando ? 'Analisando…' : 'Pontos da sua fala para praticar.'; if (/Exemplos da prévia/.test(m.textContent)) m.textContent = r.analisando ? 'Analisando…' : 'Palavras úteis que apareceram na conversa.'; });
    $$('p', pg).forEach(function (m) { if (m.textContent === 'Nenhuma fala simulada enviada nesta sessão.') m.textContent = r.analisando ? '' : 'Nenhuma correção. Muito bem!'; });
    $$('button', pg).forEach(function (b) { if (b.textContent === 'Ver palavras salvas da prévia') b.textContent = 'Ver palavras salvas'; });
  };
  /* ---------- Caderno de erros: tudo que a pessoa errou, para a revisão personalizada ---------- */
  function errosDe() { var d = studioData(); d.erros = d.erros || []; return d.erros; }
  function chaveErro(e) { return [e.lang, String(e.frase || '').trim().toLowerCase(), String(e.correta || '').trim().toLowerCase()].join('|'); }
  window.registrarErro = function (e) {
    try {
      if (!eu() || !e || !(e.frase || e.correta)) return;
      e.lang = (e.lang || eu().idioma).slice(0, 2); var L = errosDe(), k = chaveErro(e);
      var x = L.filter(function (y) { return chaveErro(y) === k; })[0];
      if (x) { x.vezes = (x.vezes || 1) + 1; x.acertos = 0; x.em = Date.now(); x.due = 0; if (e.dada) x.dada = e.dada; }
      else L.unshift({ id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), fonte: e.fonte || 'licao', lang: e.lang, unidade: String(e.unidade || '').slice(0, 80),
        frase: String(e.frase || '').slice(0, 300), correta: String(e.correta || '').slice(0, 300), dada: String(e.dada || '').slice(0, 300), nota: String(e.nota || '').slice(0, 300), vezes: 1, acertos: 0, em: Date.now() });
      if (L.length > 150) L.length = 150;
      salvar();
    } catch (er) {}
  };
  window.registrarAcerto = function (ex) {
    try { if (!ex || !ex._ref || !eu()) return; var L = errosDe(), x = L.filter(function (y) { return y.id === ex._ref; })[0]; if (!x) return;
      x.acertos = (x.acertos || 0) + 1; x.due = Date.now() + 2 * 86400000; /* acertou: volta em 2 dias na revisão do dia */ if (x.acertos >= 2) L.splice(L.indexOf(x), 1); salvar(); } catch (er) {}
  };
  function errosPendentes(lang) { return errosDe().filter(function (e) { return e.lang === lang; }).sort(function (a, b) { return (b.vezes - a.vezes) || (b.em - a.em); }); }
  /* erros vindos da redação e da conversa também entram no caderno */
  var _salvarRed = TELAS.ecoWritingResult;
  TELAS.ecoWritingResult = function (id) {
    _salvarRed(id);
    var r = studioData().writings.find(function (x) { return x.id === id; });
    if (r && !r.demo && !r._noCaderno) { r._noCaderno = true; (r.errors || []).forEach(function (e) { registrarErro({ fonte: 'redacao', lang: r.lang, unidade: r.title, frase: e[0], dada: e[0], correta: e[1], nota: e[2] }); }); }
  };
  var _sumCad = TELAS.ecoSummary;
  TELAS.ecoSummary = function (id) {
    _sumCad(id);
    var r = studioData().calls.find(function (x) { return x.id === id; });
    if (r && !r.demo && !r.analisando && !r._noCaderno) { r._noCaderno = true; (r.errors || []).forEach(function (e) { registrarErro({ fonte: 'conversa', lang: r.lang, unidade: r.scenario, frase: e[0], dada: e[0], correta: e[1], nota: e[2] }); }); }
  };

  /* ---------- Ditado ---------- */
  function semAcento(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function normDit(s) { return String(s).toLowerCase().replace(/[’`´]/g, "'").replace(/[«»"“”.,!?;:…()\[\]–—]/g, ' ').replace(/\s+/g, ' ').trim(); }
  TELAS.ecoDitado = function (unitId) {
    var pg = studioPage('Ditado'), units = studioUnits(), unit = units.find(function (x) { return x.id === unitId; }) || studioCurrent();
    var lang = eu().idioma, voz = CURSOS[lang].voz, U = unidadeDe(unit.id), d = studioData(); d.dit = d.dit || {};
    studioLead(pg, 'Ditado · ' + unit.level, 'Ouça e escreva.', 'Ouça quantas vezes quiser e escreva exatamente o que ouviu. Acentos e apóstrofos contam.');
    var lab = document.createElement('label'); lab.className = 'studio-field'; lab.textContent = 'Unidade'; var sel = document.createElement('select');
    units.filter(function (x) { return x.done || x.current || x.id === unit.id; }).forEach(function (x) { var op = document.createElement('option'); op.value = x.id; op.textContent = x.title; sel.appendChild(op); });
    sel.value = unit.id; sel.onchange = function () { ir('ecoDitado', sel.value); }; lab.appendChild(sel); pg.appendChild(lab);
    var itens = (U && U.dict) || [];
    if (!itens.length) { pg.insertAdjacentHTML('beforeend', '<div class="card"><p>Esta unidade não tem ditado.</p></div>'); return; }
    itens.forEach(function (it, k) {
      var chave = unit.id + '|' + k, card = document.createElement('section'); card.className = 'card pron-card';
      card.insertAdjacentHTML('beforeend', '<span class="ui-label">Frase ' + (k + 1) + ' de ' + itens.length + (d.dit[chave] ? ' · ✓ acertada' : '') + '</span>');
      var acoes = document.createElement('div'); acoes.className = 'pron-acoes';
      function tocarFrase(r) { AUD.stop(); if (!AUD.say(it.t, voz, null, r)) { var u = new SpeechSynthesisUtterance(it.t); u.lang = voz; u.rate = r; speechSynthesis.speak(u); } }
      acoes.appendChild(studioButton('Ouvir', function () { tocarFrase(S.cfg.voz || 0.9); }, 'primary'));
      acoes.appendChild(studioButton('Mais devagar', function () { tocarFrase(0.7); }));
      card.appendChild(acoes);
      var ta = document.createElement('textarea'); ta.rows = 2; ta.lang = lang; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.setAttribute('autocorrect', 'off'); ta.placeholder = 'Escreva o que ouviu…'; ta.className = 'dit-input'; var label = document.createElement('label'); label.className = 'studio-field'; label.textContent = 'Sua transcrição · frase ' + (k + 1); label.appendChild(ta); card.appendChild(label);
      var conf = studioButton('Conferir', conferir); card.appendChild(conf);
      var res = document.createElement('div'); res.className = 'pron-res'; res.setAttribute('role', 'status'); card.appendChild(res);
      pg.appendChild(card);
      function conferir() {
        var dado = ta.value.trim(); if (!dado) { ta.focus(); return; }
        var certos = [it.t].concat(it.alt || []), nd = normDit(dado);
        var exato = certos.some(function (c) { return normDit(c) === nd; });
        var quase = !exato && certos.some(function (c) { return semAcento(normDit(c)) === semAcento(nd); });
        var esp = it.t.split(/\s+/), ok = alinhar(esp, dado.replace(/[«»"“”.,!?;:…]/g, ' '));
        var linha = esp.map(function (w, i) { return '<span class="' + (exato || ok[i] ? 'pron-ok' : 'pron-erro') + '">' + esc(w) + '</span>'; }).join(' ');
        res.innerHTML = '<div class="pron-nota"><strong>' + (exato ? 'Perfeito!' : quase ? 'Quase!' : 'Vamos ver') + '</strong><span>' + (exato ? 'Você escreveu certinho.' : quase ? 'Só faltou acento ou apóstrofo.' : 'Compare com a frase certa:') + '</span></div>' +
          (exato ? '' : '<p class="pron-frase" lang="' + lang + '">' + linha + '</p>') + (it.note ? '<p class="pron-dica">' + esc(it.note) + '</p>' : '');
        if (exato) { if (!d.dit[chave]) { d.dit[chave] = 1; salvar(); } tocar('acerto'); }
        else {
          tocar('erro'); registrarErro({ fonte: 'ditado', lang: lang, unidade: unit.title, frase: it.t, correta: it.t, dada: dado, nota: quase ? 'Atenção aos acentos e apóstrofos.' : '' });
          if (IAon() && !quase) { var bt = studioButton('Por que errei?', function () { bt.disabled = true; bt.textContent = 'O Eco está pensando…';
            IA.pedir('explicar', { idioma: lang, unidade: unit.title, nivel: unit.level, enunciado: 'Ditado: escreva o que ouviu', frase: '(áudio)', correta: it.t, dada: dado })
              .then(function (r) { var p = document.createElement('p'); p.className = 'pron-dica'; p.innerHTML = IA.html(r.texto); bt.replaceWith(p); })
              .catch(function (e) { bt.disabled = false; bt.textContent = IA.erroTexto(e); }); }, 'ghost'); res.appendChild(bt); }
        }
      }
    });
  };

  /* ---------- Revisão personalizada: a IA cria exercícios sobre os seus erros ---------- */
  var FONTE = { licao: 'Lições', ditado: 'Ditado', redacao: 'Redação', conversa: 'Conversa', pronuncia: 'Pronúncia' };
  TELAS.ecoRevisao = function () {
    var pg = studioPage('Revisar meus erros'), lang = eu().idioma, L = errosPendentes(lang), u = studioCurrent();
    studioLead(pg, 'Revisão personalizada', L.length ? 'O que vale reforçar?' : 'Nada pendente por aqui!', L.length ? 'O Eco cria exercícios novos sobre o que você errou nas lições, no ditado, na redação e nas conversas. Cada ponto sai da lista depois de 2 acertos.' : 'Quando você errar algo nas lições, no ditado, na redação ou na conversa, aparece aqui para revisar.');
    if (!L.length) { pg.appendChild(studioButton('Voltar', function () { ir('ecoHub'); }, 'primary')); return; }
    var cont = {}; L.forEach(function (e) { cont[e.fonte] = (cont[e.fonte] || 0) + 1; });
    pg.insertAdjacentHTML('beforeend', '<div class="studio-metrics">' + Object.keys(cont).map(function (k) { return '<div><strong>' + cont[k] + '</strong><span>' + (FONTE[k] || k) + '</span></div>'; }).join('') + '</div>');
    var go = studioButton('Praticar meus erros', function () {
      if (!IAon()) { toast('A revisão personalizada funciona no app instalado, com a IA ligada.'); return; }
      go.disabled = true; go.textContent = 'O Eco está preparando os exercícios…';
      var lote = L.slice(0, 8);
      IA.pedir('revisao', { idioma: lang, nivel: u.level, erros: lote.map(function (e, i) { return { i: i, fonte: e.fonte, frase: e.frase, correta: e.correta, dada: e.dada, nota: e.nota }; }) })
        .then(function (r) {
          var voz = CURSOS[lang].voz, extra = [];
          (r.exercicios || []).forEach(function (x) { if (x.traducao) extra = extra.concat(String(x.traducao).split(/\s+/)); });
          var ex = (r.exercicios || []).map(function (x) {
            var ref = lote[x.ref] ? lote[x.ref].id : null;
            if (x.tipo === 'montar' && x.frase && x.traducao) {
              var resp = String(x.traducao).replace(/[.,!?;:]/g, ' ').split(/\s+/).filter(Boolean), dis = extra.filter(function (w) { w = w.replace(/[.,!?;:]/g, ''); return w && resp.indexOf(w) < 0; }).slice(0, 3).map(function (w) { return w.replace(/[.,!?;:]/g, ''); });
              var banco = resp.concat(dis).sort(function () { return Math.random() - .5; });
              return { tipo: 'montar', enunciado: 'Traduza esta frase', frase: x.frase, dicas: [], resposta: resp, banco: banco, audio: AUD.fn(x.frase, voz), _ref: ref };
            }
            if (!x.opcoes || x.opcoes.length < 2) return null;
            return { tipo: 'escolha', etiqueta: 'revisao', enunciado: x.enunciado || 'Escolha a opção certa', frase: x.frase || '', ocultar: x.pt ? x.frase : undefined, opcoes: x.opcoes, correta: x.correta, perguntaEmPt: !!x.pt, audio: x.pt ? undefined : AUD.fn(String(x.frase || '').replace(/_{2,}/g, '…'), voz), _ref: ref };
          }).filter(Boolean);
          if (ex.length < 3) throw new Error('poucos');
          abrirLicaoApp(null, 'Revisão dos meus erros', { licao: { idioma: voz, exercicios: ex, titulo: 'Revisão dos meus erros' } });
        })
        .catch(function (e) { go.disabled = false; go.textContent = 'Praticar meus erros'; toast(/poucos/.test(e && e.message) ? 'Não consegui montar exercícios bons agora. Tente de novo.' : IA.erroTexto(e)); });
    }, 'primary');
    pg.appendChild(go);
    var lista = document.createElement('details'); lista.className = 'card studio-details'; lista.innerHTML = '<summary>Ver a lista (' + L.length + ')</summary>';
    L.slice(0, 60).forEach(function (e) {
      var a = document.createElement('article'); a.className = 'studio-error-card';
      a.innerHTML = '<span class="ui-label">' + esc(FONTE[e.fonte] || e.fonte) + (e.unidade ? ' · ' + esc(e.unidade) : '') + (e.vezes > 1 ? ' · errou ' + e.vezes + 'x' : '') + '</span>' +
        (e.dada ? '<p class="studio-wrong" lang="' + e.lang + '">' + esc(e.dada) + '</p>' : '') + '<p class="studio-right" lang="' + e.lang + '">' + esc(e.correta) + '</p>' + (e.nota ? '<p>' + esc(e.nota) + '</p>' : '');
      var rm = studioButton('Já aprendi', function () { var X = errosDe(); X.splice(X.indexOf(e), 1); salvar(); a.remove(); }, 'ghost'); a.appendChild(rm);
      lista.appendChild(a);
    });
    pg.appendChild(lista);
  };
  var _ecoHub3 = TELAS.ecoHub;
  TELAS.ecoHub = function () {
    _ecoHub3();
    var pg = $('.eco-studio'); if (!pg) return;
    var n = errosPendentes(eu().idioma).length, links = $('.studio-actions', pg);
    var c1 = document.createElement('section'); c1.className = 'card studio-feature';
    c1.innerHTML = '<span class="studio-icon">' + svg('book') + '</span><h2>Ditado</h2><p>Ouça frases gravadas da unidade e escreva o que ouviu.</p>';
    c1.appendChild(studioButton('Fazer ditado', function () { ir('ecoDitado'); }, 'primary')); pg.insertBefore(c1, links || null);
    var c2 = document.createElement('section'); c2.className = 'card studio-feature';
    c2.innerHTML = '<span class="studio-icon">' + svg('book') + '</span><h2>Revisar meus erros' + (n ? ' · ' + n : '') + '</h2><p>Exercícios novos, criados pelo Eco, sobre o que você errou.</p>';
    c2.appendChild(studioButton(n ? 'Revisar agora' : 'Ver revisão', function () { ir('ecoRevisao'); }, 'primary')); pg.insertBefore(c2, links || null);
  };
  /* ---------- Conversa ao vivo (Gemini Live direto do navegador, com token temporário) ---------- */
  function b64DePCM(i16) { var u8 = new Uint8Array(i16.buffer), s = '', CH = 0x8000; for (var i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH)); return btoa(s); }
  function pcmDeB64(b64) { var bin = atob(b64), n = bin.length >> 1, out = new Float32Array(n); for (var i = 0; i < n; i++) { var v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8); out[i] = (v >= 32768 ? v - 65536 : v) / 32768; } return out; }
  function sistemaAoVivo(s) {
    var sc = s.scenario, idioma = s.lang === 'fr' ? 'francês' : 'inglês';
    return 'Você é o Eco, parceiro de conversa por voz de um aluno brasileiro adulto que estuda ' + idioma + ', nível ' + sc.level + '. ' +
      'Cenário: ' + sc.title + '. Contexto: ' + (sc.contexto || 'conversa do dia a dia') + '. ' + (sc.objetivo ? 'Objetivo do aluno: ' + sc.objetivo + '. ' : '') +
      'Fale SOMENTE em ' + idioma + ', devagar e com pronúncia clara, frases curtas (1 ou 2 por vez), vocabulário do nível do aluno. Sempre devolva a vez com uma pergunta simples. ' +
      (s.corrections === 'during' ? 'Quando o aluno errar algo importante, repita a forma certa de modo natural e gentil antes de continuar. ' : 'Não corrija durante a conversa. ') +
      'Se o aluno falar em português, entenda e ajude em ' + idioma + ' bem simples. Se ele pedir ajuda, dê em português uma sugestão curta do que responder e depois repita sua pergunta em ' + idioma + '. ' +
      'Comece cumprimentando e abrindo o cenário com uma pergunta.';
  }
  function chamadaAoVivo(s) {
    var lang = s.lang, pg = studioPage('Conversa com o Eco', 'ecoScenarios'); pg.classList.add('studio-call');
    pg.insertAdjacentHTML('beforeend', '<div class="studio-between"><div><span class="ui-label">' + esc(s.scenario.level) + ' · Ao vivo</span><h1>' + esc(s.scenario.title) + '</h1></div><span class="studio-timer" aria-label="Tempo de conversa">' + studioTime(s.seconds) + '</span></div>');
    var stage = document.createElement('div'); stage.className = 'studio-stage'; var mascot = eco('thinking', 'Eco'); stage.appendChild(mascot);
    stage.insertAdjacentHTML('beforeend', '<span class="studio-orbit" aria-hidden="true"></span><p class="studio-state" role="status"></p><div class="studio-wave" aria-hidden="true">' + Array.from({ length: 15 }, function (_, i) { return '<i style="--d:' + i * .08 + 's;--h:' + (12 + (i % 4) * 7) + 'px"></i>'; }).join('') + '</div><p class="studio-voice-label">Fale quando quiser · pode interromper</p>');
    pg.appendChild(stage);
    var subtitles = document.createElement('div'); subtitles.className = 'studio-subtitles'; subtitles.setAttribute('aria-live', 'polite'); pg.appendChild(subtitles);
    var actions = document.createElement('div'); actions.className = 'studio-call-actions';
    var LBL = { connecting: 'Conectando…', listening: 'Estou ouvindo você', speaking: 'Eco está falando', muted: 'Microfone silenciado', thinking: 'Eco está pensando…' }, state = '';
    function setState(v) { if (state === v) return; state = v; stage.dataset.state = v; mascot.dataset.state = { connecting: 'thinking', listening: 'listening', speaking: 'speaking', muted: 'neutral', thinking: 'thinking' }[v]; $('.studio-state', stage).textContent = LBL[v]; mascot.setAttribute('aria-label', LBL[v]); }
    var parcialEu = '', parcialEco = '';
    function caption() { subtitles.innerHTML = ''; if (s.captions === 'off') { subtitles.innerHTML = '<p class="muted">Legendas desligadas</p>'; return; }
      var linhas = s.transcript.slice(-2).map(function (t) { return t; });
      if (parcialEu) linhas.push({ who: 'Você', text: parcialEu }); if (parcialEco) linhas.push({ who: 'Eco', text: parcialEco });
      linhas.slice(-2).forEach(function (t) { var b = document.createElement('div'); b.className = 'studio-caption ' + (t.who === 'Você' ? 'is-user' : ''); b.innerHTML = '<strong>' + esc(t.who) + '</strong><p lang="' + lang + '">' + esc(t.text) + '</p>' + (s.captions === 'translation' && t.pt ? '<small>' + esc(t.pt) + '</small>' : ''); subtitles.appendChild(b); }); }
    /* áudio: saída 24 kHz, entrada 16 kHz */
    /* Saída e microfone em contextos separados: a saída já nasce em 24 kHz (sem reamostrar, o que no iPhone dava chiado)
       e passa por um volume e um limitador para não estourar; o microfone abre o próprio contexto em 16 kHz. */
    var AC = window.AudioContext || window.webkitAudioContext, ctx, ctxIn = null, fontes = [], proxima = 0, ws = null, micStream = null, proc = null, fim = false;
    try { ctx = new AC({ sampleRate: 24000 }); } catch (e) { ctx = new AC(); }
    var saida = ctx.createGain(); saida.gain.value = 0.8;
    var limitador = ctx.createDynamicsCompressor(); limitador.threshold.value = -6; limitador.knee.value = 6; limitador.ratio.value = 12; limitador.attack.value = 0.003; limitador.release.value = 0.15;
    saida.connect(limitador); limitador.connect(ctx.destination);
    try { ctx.resume(); } catch (e) {}
    function pararFala() { fontes.forEach(function (f) { try { f.stop(); } catch (e) {} }); fontes = []; proxima = 0; }
    function tocarPCM(b64, taxa) {
      if(S.cfg.silent)return;
      var dados = pcmDeB64(b64); if (!dados.length) return;
      var buf = ctx.createBuffer(1, dados.length, taxa || 24000); buf.getChannelData(0).set(dados);
      var src = ctx.createBufferSource(); src.buffer = buf; src.connect(saida);
      var t = Math.max(ctx.currentTime + 0.03, proxima); src.start(t); proxima = t + buf.duration; fontes.push(src);
      src.onended = function () { fontes = fontes.filter(function (x) { return x !== src; }); if (!fontes.length && !fim) setState(s.muted ? 'muted' : 'listening'); };
      setState('speaking');
    }
    function enviar(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }
    function ligarMic() {
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (st) {
        if (fim || !pg.isConnected) { st.getTracks().forEach(function (t) { t.stop(); }); throw new Error('cancelado'); }
        micStream = st; try { ctxIn = new AC({ sampleRate: 16000 }); } catch (e) { ctxIn = new AC(); } try { ctxIn.resume(); } catch (e) {}
        var fonte = ctxIn.createMediaStreamSource(st); proc = ctxIn.createScriptProcessor(4096, 1, 1);
        var razao = ctxIn.sampleRate / 16000;
        proc.onaudioprocess = function (e) {
          if (s.muted || !ws || ws.readyState !== 1) return;
          /* reduz para 16 kHz pela média de cada bloco (evita o ruído de só pular amostras) */
          var x = e.inputBuffer.getChannelData(0), n = Math.floor(x.length / razao), out = new Int16Array(n);
          for (var i = 0; i < n; i++) { var a = Math.floor(i * razao), b = Math.max(a + 1, Math.floor((i + 1) * razao)), soma = 0; for (var j = a; j < b; j++) soma += x[j]; var v = soma / (b - a); out[i] = Math.max(-1, Math.min(1, v)) * 0x7fff; }
          enviar({ realtimeInput: { audio: { data: b64DePCM(out), mimeType: 'audio/pcm;rate=16000' } } });
        };
        var mudo = ctxIn.createGain(); mudo.gain.value = 0; fonte.connect(proc); proc.connect(mudo); mudo.connect(ctxIn.destination);
      });
    }
    function encerrar(motivo) {
      if (fim) return; fim = true; pararFala();
      try { proc && proc.disconnect(); } catch (e) {} try { micStream && micStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      try { ws && ws.close(); } catch (e) {} try { ctx.close(); } catch (e) {} try { ctxIn && ctxIn.close(); } catch (e) {}
      if (motivo === 'sair') return;
      finalizarConversa();
    }
    studioCleanup(function () { encerrar('sair'); });
    function comfort(e){if(e.detail.silent)pararFala();}window.addEventListener('idiomas-preferences',comfort);studioCleanup(function(){window.removeEventListener('idiomas-preferences',comfort);});
    function traduzir(entrada) {
      if (s.captions !== 'translation' || !entrada.text) return;
      IA.pedir('traduzir', { idioma: lang, texto: entrada.text }).then(function (r) { entrada.pt = r.texto; if (pg.isConnected) caption(); }).catch(function () {});
    }
    function falhou(msg) {
      if (fim) return; encerrar('sair');
      if (!pg.isConnected) return;
      folha(function (sh) {
        sh.innerHTML = '<h2>A conversa ao vivo parou</h2><p>' + esc(msg) + '</p><p>Você pode continuar no modo por turnos, que usa outra cota.</p>';
        sh.appendChild(studioButton('Continuar por turnos', function () { fecharFolha(); s.mode = 'turns'; s.hist = s.transcript.map(function (t) { return { de: t.who === 'Eco' ? 'eco' : 'eu', texto: t.text }; }); ir('ecoCall'); }, 'primary'));
        sh.appendChild(studioButton('Encerrar e ver resumo', function () { fecharFolha(); finalizarConversa(); }));
      });
    }
    setState('connecting');
    IA.pedir('liveToken', {}).then(function (t) {
      if (!pg.isConnected) return;
      ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=' + encodeURIComponent(t.token));
      ws.onopen = function () {
        enviar({ setup: { model: 'models/' + t.modelo, generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } },
          systemInstruction: { parts: [{ text: sistemaAoVivo(s) }] }, inputAudioTranscription: {}, outputAudioTranscription: {} } });
      };
      ws.onmessage = function (ev) {
        (typeof ev.data === 'string' ? Promise.resolve(ev.data) : ev.data.text()).then(function (txt) {
          var m; try { m = JSON.parse(txt); } catch (e) { return; }
          if (m.setupComplete) { ligarMic().then(function () { setState('thinking'); enviar({ realtimeInput: { text: '(Comece a conversa agora.)' } }); }).catch(function () { falhou('Não consegui usar o microfone. Libere o acesso nas configurações do navegador.'); }); return; }
          if (m.goAway) { toast('A sessão ao vivo vai terminar em instantes.'); return; }
          var sc = m.serverContent; if (!sc) return;
          if (sc.interrupted) { pararFala(); setState('listening'); }
          (sc.modelTurn && sc.modelTurn.parts || []).forEach(function (p) { if (p.inlineData && p.inlineData.data) { var r = /rate=(\d+)/.exec(p.inlineData.mimeType || ''); tocarPCM(p.inlineData.data, r ? +r[1] : 24000); } });
          if (sc.inputTranscription && sc.inputTranscription.text) { parcialEu += sc.inputTranscription.text; caption(); }
          if (sc.outputTranscription && sc.outputTranscription.text) { if (parcialEu.trim()) { s.transcript.push({ who: 'Você', text: parcialEu.trim(), pt: '' }); parcialEu = ''; } parcialEco += sc.outputTranscription.text; caption(); }
          if (sc.turnComplete || sc.interrupted) {
            if (parcialEu.trim()) { s.transcript.push({ who: 'Você', text: parcialEu.trim(), pt: '' }); parcialEu = ''; }
            if (parcialEco.trim()) { var e = { who: 'Eco', text: parcialEco.trim(), pt: '' }; s.transcript.push(e); parcialEco = ''; traduzir(e); }
            caption();
          }
        });
      };
      ws.onerror = function () {};
      ws.onclose = function (e) { if (!fim) falhou(e.code === 1011 ? 'O serviço ao vivo está indisponível agora.' : e.code === 1008 || e.code === 1007 ? 'O serviço ao vivo recusou a conexão' + (e.reason ? ' (' + e.reason + ')' : '') + '. Tente a conversa por turnos.' : 'A conexão caiu.'); };
    }).catch(function (e) { falhou(IA.erroTexto(e)); });
    var mic = studioButton('Silenciar microfone', function () { s.muted = !s.muted; mic.textContent = s.muted ? 'Ativar microfone' : 'Silenciar microfone'; mic.setAttribute('aria-pressed', String(s.muted)); if (!fontes.length) setState(s.muted ? 'muted' : 'listening'); });
    actions.appendChild(mic);
    actions.appendChild(studioButton('Me ajuda', function () { pararFala(); enviar({ realtimeInput: { text: '(O aluno pediu ajuda: em português, sugira em uma frase o que ele pode responder agora, e depois repita sua pergunta devagar em ' + (lang === 'fr' ? 'francês' : 'inglês') + '.)' } }); setState('thinking'); }));
    actions.appendChild(studioButton('Repetir mais devagar', function () { pararFala(); enviar({ realtimeInput: { text: '(Repita sua última fala bem mais devagar e com palavras mais simples.)' } }); setState('thinking'); }));
    actions.appendChild(studioButton('Encerrar', function () { encerrar(); }, 'danger'));
    var prefs = document.createElement('details'); prefs.className = 'studio-details'; prefs.innerHTML = '<summary>Legendas</summary>';
    prefs.appendChild(segmento([{ v: 'on', t: 'Ligadas' }, { v: 'off', t: 'Desligadas' }, { v: 'translation', t: 'Com tradução' }], s.captions, function (v) { s.captions = v; caption(); }, 'Legendas da conversa'));
    pg.appendChild(prefs);
    pg.insertAdjacentHTML('beforeend', '<p class="studio-note">Use fone de ouvido se puder: assim o Eco não escuta a própria voz.</p>');
    var dock = document.createElement('div'); dock.className = 'studio-call-dock'; dock.appendChild(actions); pg.appendChild(dock);
    var interval = setInterval(function () { if (!pg.isConnected) { clearInterval(interval); encerrar('sair'); return; } s.seconds++; $('.studio-timer', pg).textContent = studioTime(s.seconds); if (s.seconds >= 14 * 60 && !fim) { toast('Chegamos ao limite de uma sessão ao vivo.'); encerrar(); } }, 1000);
    studioTimers.push(interval); caption();
  }
  var _ecoCallTurnos = TELAS.ecoCall;
  TELAS.ecoCall = function () {
    var s = studioSession;
    if (s && s.real && s.mode === 'live' && IAon()) return chamadaAoVivo(s);
    return _ecoCallTurnos();
  };

  /* ================= Estudo: revisão do dia, lembrete, prova de nível e leituras (src/estudo.js) =================
     Entra no app logo depois de src/ia-telas.js (mesmo escopo: usa studioPage, studioButton, gravador, alinhar etc.). */
  var EST_NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  function estMix(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function estLc(s) { return String(s || '').trim().toLowerCase(); }
  function estEl(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function estNivelAtual(k) { return Math.min(4, Math.floor(((eu().progresso[k] || 0)) / 60)); }

  /* ---------------- 1. Revisão do dia (revisão espaçada) ----------------
     Fila curta com: palavras e frases vencidas (o que você acerta volta cada vez mais tarde),
     erros do caderno para refazer e algumas frases novas das unidades já estudadas. */
  function exercicioDeErro(e, outras) {
    var certa = String(e.correta || '').trim(), dada = String(e.dada || '').trim(); if (!certa) return null;
    var op = [certa]; if (dada && estLc(dada) !== estLc(certa)) op.push(dada);
    estMix(outras).forEach(function (o) { if (op.length < 3 && o && op.map(estLc).indexOf(estLc(o)) < 0) op.push(String(o)); });
    if (op.length < 2) return null; op = estMix(op);
    return { tipo: 'escolha', enunciado: e.nota ? String(e.nota) : 'Qual é a forma certa?', frase: String(e.frase || ''), semFrase: !e.frase, semAudio: true,
      opcoes: op, correta: op.indexOf(certa), _ref: e.id, perguntaEmPt: true, etiqueta: 'revisao' };
  }
  function filaDoDia(k) {
    var p = eu(), h = p.reviewWords = p.reviewWords || {}, it = window.SRS_ITENS && SRS_ITENS[k] ? SRS_ITENS[k]() : { palavras: [], frases: [], voz: CURSOS[k].voz }, agora = Date.now();
    var vencidos = it.palavras.concat(it.frases).filter(function (a) { return h[a.id] && h[a.id].due <= agora; }).sort(function (a, b) { return h[a.id].due - h[b.id].due; }).slice(0, 8);
    var pend = errosPendentes(k), outras = pend.map(function (e) { return e.correta; }), exErros = [];
    pend.forEach(function (e) { if (exErros.length < 4 && !(e.due > agora)) { var x = exercicioDeErro(e, outras); if (x) exErros.push(x); } });
    var novos = it.frases.filter(function (a) { return !h[a.id]; }).slice(0, Math.max(0, Math.min(3, 12 - vencidos.length - exErros.length)));
    var lista = vencidos.concat(novos).map(function (a) { return a.ex; }).concat(exErros);
    if (lista.length && lista.length < 5) lista = lista.concat(it.palavras.filter(function (a) { return !h[a.id]; }).slice(0, 5 - lista.length).map(function (a) { return a.ex; }));
    return { exercicios: estMix(lista), voz: it.voz, vencidos: vencidos.length, erros: exErros.length, novos: novos.length };
  }
  window.filaDoDia = filaDoDia;
  function abrirRevisaoDia() {
    var f = filaDoDia(eu().idioma);
    if (!f.exercicios.length) { toast('Nada para revisar agora. Volte amanhã!'); return; }
    abrirLicaoApp(null, 'Revisão do dia', { revisao: true, licao: { idioma: f.voz, exercicios: f.exercicios, titulo: 'Revisão do dia' } });
  }
  function cartaoRevisaoDia() {
    var f = filaDoDia(eu().idioma), n = f.exercicios.length, c = estEl('section', 'card ux-small-card est-dia');
    var partes = []; if (f.vencidos) partes.push(f.vencidos + ' para relembrar'); if (f.erros) partes.push(f.erros + ' erro' + (f.erros > 1 ? 's' : '') + ' para refazer'); if (f.novos) partes.push(f.novos + ' frase' + (f.novos > 1 ? 's' : '') + ' nova' + (f.novos > 1 ? 's' : ''));
    c.innerHTML = '<span class="ui-label">Revisão do dia' + (n ? ' · cerca de ' + Math.max(2, Math.round(n / 2)) + ' min' : '') + '</span><h2>' + (n ? n + ' itens quase esquecidos' : 'Tudo revisado por agora') + '</h2><p>' +
      (n ? esc(partes.join(', ')) + '. O que você acerta volta cada vez mais tarde.' : 'Volte amanhã: o que você acertou reaparece em intervalos maiores.') + '</p>';
    if (n) c.appendChild(uxBtn('Revisar agora', abrirRevisaoDia, true));
    return c;
  }

  /* ---------------- 2. Lembrete diário ---------------- */
  function estB64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); var r = atob(s + '='.repeat((4 - s.length % 4) % 4)), u = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) u[i] = r.charCodeAt(i); return u; }
  function lembreteLocal(v) { var key = 'idiomas-lembrete:' + eu().id; try { if (v === undefined) return JSON.parse(localStorage.getItem(key)) || null; if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch (e) { return null; } }
  function textoLembrete() { var l = lembreteLocal(); return l && l.ligado ? 'Todo dia às ' + l.hora + ', neste aparelho' : 'Desligado neste aparelho'; }
  window.textoLembrete = textoLembrete;
  TELAS.lembrete = function () {
    var pg = studioPage('Lembrete diário', 'config'), l = lembreteLocal() || { hora: '20:00', ligado: false };
    studioLead(pg, 'Constância', 'Um lembrete por dia', 'No horário escolhido, o celular avisa para estudar um pouco. Se você já tiver estudado no dia, o lembrete não vem.');
    var card = estEl('section', 'card studio-stack'), st = estEl('p', 'pron-status'); st.setAttribute('role', 'status');
    var lab = estEl('label', 'studio-field', 'Horário'), hora = document.createElement('input'); hora.type = 'time'; hora.value = l.hora; hora.step = 300; lab.appendChild(hora); card.appendChild(lab);
    var ligar = studioButton(l.ligado ? 'Salvar horário' : 'Ligar lembrete', function () { ativar(); }, 'primary'), desligar = studioButton('Desligar lembrete', function () { desativar(); });
    var testar = studioButton('Ver como chega', function () { navigator.serviceWorker.ready.then(function (reg) { return reg.showNotification('Idiomas', { body: eu().nome.split(' ')[0] + ', 5 minutinhos com a Eco?', icon: 'icon-192.png', tag: 'lembrete-teste' }); }).catch(function () { st.textContent = 'Não consegui mostrar o aviso. Confira se as notificações estão permitidas.'; }); });
    card.appendChild(ligar); if (l.ligado) { card.appendChild(desligar); card.appendChild(testar); } card.appendChild(st); pg.appendChild(card);
    var ios = /iPhone|iPad/.test(navigator.userAgent), instalado = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    var faltando = !('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window);
    if (faltando || (ios && !instalado)) { st.textContent = ios ? 'No iPhone, o lembrete funciona com o app instalado: no Safari, toque em Compartilhar → Adicionar à Tela de Início e abra o app por lá.' : 'Este navegador não recebe notificações. Tente pelo Chrome ou pelo app instalado.'; ligar.disabled = true; return; }
    if (!window.IDIOMAS_API) { st.textContent = 'Esta cópia do app não está ligada ao servidor, então não envia lembretes.'; ligar.disabled = true; return; }
    if (!(window.AUTH && AUTH.enabled && AUTH.ready())) { st.textContent = 'Para ligar o lembrete, entre com Google (Configurações → Conexão).'; ligar.disabled = true; return; }
    pg.insertAdjacentHTML('beforeend', '<p class="muted">O horário vale para este aparelho. Para receber em outro celular, ligue o lembrete nele também.</p>');
    function ativar() {
      if (!/^\d\d:\d\d$/.test(hora.value)) { st.textContent = 'Escolha um horário.'; return; }
      ligar.disabled = true; st.textContent = 'Ligando…';
      Promise.all([fetch(window.IDIOMAS_API).then(function (r) { return r.json(); }), Notification.requestPermission(), navigator.serviceWorker.ready]).then(function (x) {
        var vapid = x[0] && x[0].vapid; if (x[1] !== 'granted') throw new Error('permissao'); if (!vapid) throw new Error('sem_chave');
        return x[2].pushManager.getSubscription().then(function (s) { return s || x[2].pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: estB64(vapid) }); });
      }).then(function (sub) {
        return AUTH.post({ acao: 'lembrete', perfil: eu().id, hora: hora.value, fuso: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', assinatura: sub.toJSON() });
      }).then(function () {
        lembreteLocal({ hora: hora.value, ligado: true }); toast('Lembrete ligado: todo dia às ' + hora.value + '.'); ir('lembrete');
      }).catch(function (e) {
        ligar.disabled = false; var m = String(e && e.message);
        st.textContent = /permissao/.test(m) ? 'As notificações estão bloqueadas. Libere nas configurações do navegador ou do celular e tente de novo.' : /sem_chave/.test(m) ? 'O servidor ainda não está pronto para lembretes. Tente mais tarde.' : 'Não consegui ligar agora. Confira a internet e tente de novo.';
      });
    }
    function desativar() {
      desligar.disabled = true;
      navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
        if (!sub) return; return AUTH.post({ acao: 'lembrete', desligar: true, endpoint: sub.endpoint }).catch(function () {}).then(function () { return sub.unsubscribe(); });
      }).then(function () { lembreteLocal(null); toast('Lembrete desligado neste aparelho.'); ir('lembrete'); }).catch(function () { desligar.disabled = false; st.textContent = 'Não consegui desligar agora. Tente de novo.'; });
    }
  };

  /* ---------------- 4. Prova de fim de nível ----------------
     Parte objetiva (escuta, leitura, gramática e vocabulário) no motor das lições; depois escrita e fala com a IA. */
  var provaAtual = null;
  window.provaResposta = function (ex, ok) { if (provaAtual && ex && ex._pid && provaAtual.respostas[ex._pid] === undefined) provaAtual.respostas[ex._pid] = { parte: ex._prova, ok: !!ok }; };
  function provasDe(p) { p.provas = p.provas || {}; return p.provas; }
  function montarProva(k, li) {
    var L = COURSE[k], voz = L.tts, ini = li * 12, units = L.units.slice(ini, ini + 12), ex = [], pid = 0;
    function marca(x, parte) { x._prova = parte; x._pid = 'p' + (pid++); x.etiqueta = undefined; return x; }
    var mcs = []; units.forEach(function (u, i) { (u.mc || []).forEach(function (m) { var f = falaDoMc(u, m); if (f) mcs.push({ u: u, ui: ini + i, m: m, fala: f }); }); });
    mcs = estMix(mcs);
    mcs.slice(0, 5).forEach(function (x) { ex.push(marca({ tipo: 'escolha', escuta: true, enunciado: x.m.q, frase: x.fala, opcoes: x.m.o.slice(), correta: x.m.a, audio: AUD.fn(x.fala, voz, x.ui) }, 'escuta')); });
    mcs.slice(5, 10).forEach(function (x) {
      var ls = x.u.lines || [], i = ls.findIndex(function (l) { return l[1] === x.fala || l[1].indexOf(x.fala) >= 0; }); if (i < 0) i = 0;
      var trecho = ls.slice(Math.max(0, i - 1), i + 2).map(function (l) { return l[0] + ': ' + l[1]; }).join('  ');
      ex.push(marca({ tipo: 'escolha', semAudio: true, enunciado: 'Leia: ' + x.m.q, frase: trecho, opcoes: x.m.o.slice(), correta: x.m.a }, 'leitura'));
    });
    var gaps = []; units.forEach(function (u) { (u.gaps || []).forEach(function (g) { gaps.push(g); }); });
    var resps = gaps.map(function (g) { return g.a[0]; });
    estMix(gaps).slice(0, 5).forEach(function (g) {
      var op = [g.a[0]]; estMix(resps).forEach(function (a) { if (op.length < 3 && g.a.map(estLc).indexOf(estLc(a)) < 0 && op.map(estLc).indexOf(estLc(a)) < 0) op.push(a); }); op = estMix(op);
      ex.push(marca({ tipo: 'escolha', semAudio: true, enunciado: 'Complete: ' + (g.h || ''), frase: g.s, opcoes: op, correta: op.indexOf(g.a[0]), perguntaEmPt: true }, 'gramatica'));
    });
    var cards = []; units.forEach(function (u, i) { (u.cards || []).forEach(function (c) { cards.push({ c: c, ui: ini + i }); }); });
    var alvos = cards.map(function (x) { return x.c[1]; });
    estMix(cards).slice(0, 5).forEach(function (x) {
      var op = [x.c[1]]; estMix(alvos).forEach(function (a) { if (op.length < 3 && op.indexOf(a) < 0) op.push(a); }); op = estMix(op);
      ex.push(marca({ tipo: 'escolha', enunciado: 'Como se diz isto?', frase: x.c[1], ocultar: x.c[0], opcoes: op, correta: op.indexOf(x.c[1]), perguntaEmPt: true, audio: AUD.fn(x.c[1], voz, x.ui) }, 'vocabulario'));
    });
    var tarefas = units.filter(function (u) { return u.write && u.write.task; }), frases = [];
    units.forEach(function (u) { (u.shadow || []).forEach(function (s) { frases.push(s); }); });
    return { exercicios: estMix(ex), voz: voz, tarefa: tarefas.length ? estMix(tarefas)[0].write : null, frases: estMix(frases).slice(0, 3) };
  }
  window.montarProva = montarProva;
  var PARTES = { escuta: 'Escuta', leitura: 'Leitura', gramatica: 'Gramática', vocabulario: 'Vocabulário', escrita: 'Escrita', fala: 'Fala' };
  TELAS.provas = function () {
    var pg = studioPage('Provas de nível'), k = eu().idioma, feitas = eu().progresso[k] || 0, res = provasDe(eu());
    studioLead(pg, 'Provas · ' + CURSOS[k].nome, 'Como estou em cada nível?', 'Uma prova curta com escuta, leitura, gramática, vocabulário, escrita e fala. Mostra o que já está firme e o que vale reforçar.');
    EST_NIVEIS.forEach(function (n, li) {
      var r = res[k + '|' + n], completo = feitas >= (li + 1) * 60, aberto = feitas >= li * 60 + 30 || completo, c = estEl('section', 'card est-prova');
      c.innerHTML = '<span class="ui-label">' + (r ? (r.aprovado ? 'Aprovado' : 'Feita') + ' · ' + new Date(r.data).toLocaleDateString('pt-BR') : completo ? 'Nível concluído' : aberto ? 'Disponível' : 'Ainda não') + '</span><h2>Prova do ' + n + '</h2><p>' +
        (r ? 'Resultado: ' + r.total + '%.' : aberto ? 'Cerca de 15 minutos. ' + (completo ? 'Você terminou as 12 unidades do nível.' : 'Recomendada ao terminar as 12 unidades, mas você já pode testar.') : 'Abre na metade das unidades do ' + n + '.') + '</p>';
      if (aberto) c.appendChild(studioButton(r ? 'Refazer a prova' : 'Começar', function () { ir('prova', n); }, r ? 'secondary' : 'primary'));
      if (r) c.appendChild(studioButton('Ver resultado', function () { ir('provaResultado', k + '|' + n); }));
      pg.appendChild(c);
    });
  };
  TELAS.prova = function (nivel) {
    var k = eu().idioma, li = Math.max(0, EST_NIVEIS.indexOf(nivel)), pg = studioPage('Prova do ' + EST_NIVEIS[li], 'provas');
    studioLead(pg, 'Prova · ' + CURSOS[k].nome, 'Prova do ' + EST_NIVEIS[li], 'Três partes: 20 questões (escuta, leitura, gramática e vocabulário), um texto curto e três frases faladas. Conta a primeira resposta de cada questão.');
    var c = estEl('section', 'card'); c.innerHTML = '<p>' + (IAon() ? 'A escrita e a fala são avaliadas pelo Eco. Você pode pular essas partes.' : 'Sem a IA ligada, a prova fica só com a parte objetiva. Entre com Google para incluir escrita e fala.') + '</p>';
    c.appendChild(studioButton('Começar a prova', function () {
      var pv = montarProva(k, li); provaAtual = { k: k, nivel: EST_NIVEIS[li], respostas: {}, total: pv.exercicios.length, tarefa: pv.tarefa, frases: pv.frases, escrita: null, fala: null, data: Date.now() };
      abrirLicaoApp(null, 'Prova do ' + EST_NIVEIS[li], { licao: { idioma: pv.voz, exercicios: pv.exercicios, titulo: 'Prova do ' + EST_NIVEIS[li] }, aoConcluir: function () { ir(IAon() && provaAtual.tarefa ? 'provaEscrita' : 'provaResultado'); } });
    }, 'primary'));
    pg.appendChild(c);
  };
  TELAS.provaEscrita = function () {
    if (!provaAtual) { ir('provas'); return; }
    var pa = provaAtual, pg = studioPage('Prova · escrita', 'provas'), w = pa.tarefa;
    studioLead(pg, 'Parte 2 de 3 · Escrita', w.task, 'Escreva com calma. O Eco dá uma nota de 0 a 10 e comenta.');
    var lab = estEl('label', 'studio-field', 'Seu texto'), ta = document.createElement('textarea'); ta.rows = 7; ta.maxLength = 3000; ta.lang = pa.k; if (w.ph) ta.placeholder = w.ph; lab.appendChild(ta); pg.appendChild(lab);
    var st = estEl('p', 'pron-status'); st.setAttribute('role', 'status'); pg.appendChild(st);
    var env = studioButton('Enviar e continuar', function () {
      if (ta.value.trim().split(/\s+/).length < 8) { st.textContent = 'Escreva pelo menos algumas frases.'; return; }
      env.disabled = true; st.textContent = 'O Eco está lendo…';
      IA.pedir('redacao', { idioma: pa.k, nivel: pa.nivel, unidade: 'Prova do ' + pa.nivel, objetivo: 'Prova de nível', tarefa: w.task, texto: ta.value })
        .then(function (r) { var d = r.dados || {}, nota = Math.max(0, Math.min(10, Number(d.nota) || 0)); pa.escrita = Math.round(nota * 10); pa.escritaResumo = String(d.resumo || ''); ir('provaFala'); })
        .catch(function (e) { env.disabled = false; st.textContent = IA.erroTexto(e); });
    }, 'primary');
    pg.appendChild(env); pg.appendChild(studioButton('Pular a escrita', function () { ir('provaFala'); }));
  };
  TELAS.provaFala = function () {
    if (!provaAtual) { ir('provas'); return; }
    var pa = provaAtual, pg = studioPage('Prova · fala', 'provas'), notas = {};
    if (!pa.frases.length || !(navigator.mediaDevices && window.MediaRecorder)) { ir('provaResultado'); return; }
    studioLead(pg, 'Parte 3 de 3 · Fala', 'Leia em voz alta', 'Grave cada frase uma vez. Conta a porcentagem de palavras que o reconhecimento entendeu.');
    pa.frases.forEach(function (f, i) {
      var card = estEl('section', 'card pron-card'), txt = estEl('p', 'pron-frase', f), st = estEl('p', 'pron-status'), g = null, timer = null;
      txt.lang = pa.k; st.setAttribute('role', 'status'); card.appendChild(txt);
      var bt = studioButton('Gravar', function () {
        if (g) { clearInterval(timer); var gg = g; g = null; gravAtual = null; bt.disabled = true; bt.textContent = 'Gravar'; st.textContent = 'O Eco está ouvindo…';
          gg.parar().then(function (blob) { if (!blob || blob.size < 1500) throw new Error('curto'); return blobB64(blob).then(function (b) { return IA.pedir('pronuncia', { idioma: pa.k, frase: f, audio: b, mime: blob.type }); }); })
            .then(function (r) { var pal = f.split(/\s+/), ok = alinhar(pal, r.ouvido || ''), conta = pal.filter(function (w) { return normPal(w).length; }).length || 1, n = ok.filter(function (x, j) { return x && normPal(pal[j]).length; }).length;
              notas[i] = Math.round(100 * n / conta); st.textContent = notas[i] + '% das palavras reconhecidas. O reconhecimento entendeu: «' + (r.ouvido || '…') + '»'; bt.textContent = 'Gravar de novo'; })
            .catch(function (e) { st.textContent = /curto/.test(String(e && e.message)) ? 'Ficou curto demais. Grave a frase inteira.' : IA.erroTexto(e); })
            .then(function () { bt.disabled = false; });
          return; }
        if (gravAtual) { toast('Termine a outra gravação primeiro.'); return; }
        AUD.stop(); g = gravador(); gravAtual = g;
        g.iniciar().then(function () { var t0 = Date.now(); bt.textContent = 'Parar'; st.textContent = 'Gravando… leia a frase.'; timer = setInterval(function () { if (Date.now() - t0 > 15000) bt.click(); }, 500); })
          .catch(function () { g = null; gravAtual = null; st.textContent = 'Não consegui usar o microfone.'; });
      }, 'primary');
      studioCleanup(function () { clearInterval(timer); if (g) g.cancelar(); if (gravAtual === g) gravAtual = null; g = null; });
      card.appendChild(bt); card.appendChild(st); pg.appendChild(card);
    });
    pg.appendChild(studioButton('Ver resultado', function () { var v = Object.keys(notas).map(function (x) { return notas[x]; }); pa.fala = v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / pa.frases.length) : null; ir('provaResultado'); }, 'primary'));
  };
  var DICAS_PARTE = { escuta: ['Lições de Escuta e Descobrir › Ouvir e compreender', 'praticar'], leitura: ['Descobrir › Ler o diálogo', 'descobrir'], gramatica: ['Guias das unidades do nível', 'guias'],
    vocabulario: ['Revisão do dia, todos os dias', 'revisaoDia'], escrita: ['Escrever um texto com o Eco', 'ecoWrite'], fala: ['Treinar pronúncia', 'ecoPronuncia'] };
  TELAS.provaResultado = function (chave) {
    var p = eu(), res = provasDe(p), r;
    if (provaAtual && !chave) {
      var pa = provaAtual, partes = {}; provaAtual = null;
      Object.keys(pa.respostas).forEach(function (id) { var x = pa.respostas[id]; partes[x.parte] = partes[x.parte] || [0, 0]; partes[x.parte][1]++; if (x.ok) partes[x.parte][0]++; });
      var notas = {}; Object.keys(partes).forEach(function (k) { notas[k] = Math.round(100 * partes[k][0] / partes[k][1]); });
      if (pa.escrita != null) notas.escrita = pa.escrita; if (pa.fala != null) notas.fala = pa.fala;
      var vals = Object.keys(notas).map(function (k) { return notas[k]; }), total = vals.length ? Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length) : 0;
      r = { data: Date.now(), nivel: pa.nivel, partes: notas, total: total, aprovado: total >= 70, escritaResumo: pa.escritaResumo || '' };
      res[pa.k + '|' + pa.nivel] = r; chave = pa.k + '|' + pa.nivel; salvar();
      uxRecord({ kind: 'prova', title: 'Prova do ' + pa.nivel, detail: 'Resultado: ' + total + '%' });
    } else r = res[chave];
    if (!r) { ir('provas'); return; }
    var pg = studioPage('Resultado', 'provas');
    studioLead(pg, 'Prova do ' + r.nivel, r.aprovado ? 'Você passou no ' + r.nivel + '!' : 'Bom retrato do seu ' + r.nivel, r.aprovado ? 'Resultado geral de ' + r.total + '%. Siga para o próximo nível com confiança.' : 'Resultado geral de ' + r.total + '%. A meta é 70%. Veja abaixo o que reforçar e refaça quando quiser.');
    pg.insertBefore(eco(r.aprovado ? 'happy' : 'neutral', 'Eco'), pg.querySelector('.studio-heading').nextSibling);
    var c = estEl('section', 'card est-resultado');
    Object.keys(PARTES).forEach(function (k) {
      if (r.partes[k] == null) return; var v = r.partes[k], row = estEl('div', 'est-barra');
      row.innerHTML = '<span>' + PARTES[k] + '</span><div class="ui-progress" role="img" aria-label="' + PARTES[k] + ' ' + v + '%"><div class="ui-progress__fill" style="width:' + v + '%"></div></div><b>' + v + '%</b>';
      c.appendChild(row);
    });
    pg.appendChild(c);
    if (r.escritaResumo) pg.appendChild(estEl('p', 'muted', 'Sobre o seu texto: ' + r.escritaResumo));
    var fracos = Object.keys(r.partes).filter(function (k) { return r.partes[k] < 70; }).sort(function (a, b) { return r.partes[a] - r.partes[b]; }).slice(0, 2);
    if (fracos.length) { var d = estEl('section', 'card'); d.appendChild(estEl('h2', null, 'Para reforçar')); fracos.forEach(function (k) { d.appendChild(studioButton(PARTES[k] + ': ' + DICAS_PARTE[k][0], function () { ir(DICAS_PARTE[k][1]); })); }); pg.appendChild(d); }
    pg.appendChild(studioButton('Voltar às provas', function () { ir('provas'); }, 'primary'));
  };

  /* ---------------- 5. Leituras extras com a IA ---------------- */
  var TEMAS_LEITURA = ['Viagem', 'Comida', 'Trabalho', 'Cinema e séries', 'Esportes', 'Tecnologia', 'Natureza', 'Vida na cidade', 'Música', 'Família'];
  function leiturasDe() { var d = studioData(); d.leituras = Array.isArray(d.leituras) ? d.leituras : []; return d.leituras; }
  TELAS.revisaoDia = function () { var pg = studioPage('Revisão do dia'); studioLead(pg, 'Revisão espaçada', 'Revisão do dia', 'Palavras, frases e erros no momento certo de lembrar. Errou? Volta logo. Acertou? Volta mais tarde.'); pg.appendChild(cartaoRevisaoDia()); };
  TELAS.leituras = function () {
    var k = eu().idioma, pg = studioPage('Leitura extra'), nv = EST_NIVEIS[estNivelAtual(k)];
    studioLead(pg, 'Leitura · ' + CURSOS[k].nome, 'Um texto do seu jeito', 'O Eco escreve um texto curto no seu nível, sobre o tema que você quiser, com áudio, vocabulário e perguntas.');
    var card = estEl('section', 'card studio-stack');
    var lt = estEl('label', 'studio-field', 'Tema'), tema = document.createElement('input'); tema.maxLength = 100; tema.placeholder = 'Ex.: uma viagem de trem'; lt.appendChild(tema); card.appendChild(lt);
    var chips = estEl('div', 'ux-actions'); estMix(TEMAS_LEITURA).slice(0, 6).forEach(function (t) { var b = studioButton(t, function () { tema.value = t; }); b.classList.add('est-chip'); chips.appendChild(b); }); card.appendChild(chips);
    var lf = estEl('label', 'studio-field', 'Formato'), fmt = document.createElement('select');
    [['historia', 'História'], ['dialogo', 'Diálogo'], ['noticia', 'Notícia'], ['mensagem', 'E-mail ou mensagem']].forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; fmt.appendChild(op); }); lf.appendChild(fmt); card.appendChild(lf);
    var ln = estEl('label', 'studio-field', 'Nível'), niv = document.createElement('select');
    EST_NIVEIS.forEach(function (n) { var op = document.createElement('option'); op.value = n; op.textContent = n; niv.appendChild(op); }); niv.value = nv; ln.appendChild(niv); card.appendChild(ln);
    var st = estEl('p', 'pron-status'); st.setAttribute('role', 'status');
    var gerar = studioButton('Criar leitura', function () {
      if (!IAon()) { st.textContent = 'Entre com Google para o Eco criar leituras.'; return; }
      var owner = eu(); gerar.disabled = true; st.textContent = 'O Eco está escrevendo… pode levar uns 20 segundos.';
      IA.pedir('leitura', { idioma: k, nivel: niv.value, tema: tema.value.trim() || estMix(TEMAS_LEITURA)[0], formato: fmt.value }).then(function (r) {
        if (eu() !== owner) return;
        var L = leiturasDe(), rec = { id: 'l' + Date.now().toString(36), data: Date.now(), lang: k, nivel: niv.value, tema: tema.value.trim(), titulo: r.titulo, texto: r.texto, traducao: r.traducao, vocabulario: r.vocabulario || [], perguntas: r.perguntas || [], acertos: null };
        L.unshift(rec); if (L.length > 30) L.length = 30; salvar(); ir('leitura', rec.id);
      }).catch(function (e) { gerar.disabled = false; st.textContent = IA.erroTexto(e); });
    }, 'primary');
    card.appendChild(gerar); card.appendChild(st); pg.appendChild(card);
    var L = leiturasDe().filter(function (x) { return x.lang === k; });
    if (L.length) {
      pg.appendChild(estEl('p', 'ui-label sec-title', 'Suas leituras'));
      L.forEach(function (x) { var c = estEl('section', 'card'); c.innerHTML = '<span class="ui-label">' + esc(x.nivel) + ' · ' + new Date(x.data).toLocaleDateString('pt-BR') + (x.acertos != null ? ' · ' + x.acertos + '/' + x.perguntas.length + ' certas' : '') + '</span><h2 lang="' + k + '">' + esc(x.titulo) + '</h2>'; c.appendChild(studioButton('Abrir', function () { ir('leitura', x.id); })); pg.appendChild(c); });
    }
  };
  TELAS.leitura = function (id) {
    var x = leiturasDe().filter(function (l) { return l.id === id; })[0]; if (!x) { ir('leituras'); return; }
    var pg = studioPage('Leitura', 'leituras'), voz = CURSOS[x.lang].voz;
    studioLead(pg, 'Leitura · ' + x.nivel + (x.tema ? ' · ' + x.tema : ''), x.titulo, 'Leia, ouça cada parágrafo e responda às perguntas no fim.');
    var t = estEl('section', 'card est-leitura');
    String(x.texto).split(/\n+/).filter(function (s) { return s.trim(); }).forEach(function (par) { var p = estEl('p', null, par); p.lang = x.lang; t.appendChild(p); t.appendChild(IdiomasAudio.player(par, voz, AUD.fn(par, voz), S.cfg.voz, function (v) { S.cfg.voz = v; salvar(); })); });
    if (x.traducao) { var det = document.createElement('details'); det.appendChild(estEl('summary', null, 'Ver tradução')); String(x.traducao).split(/\n+/).forEach(function (s) { if (s.trim()) det.appendChild(estEl('p', 'ux-translation', s)); }); t.appendChild(det); }
    pg.appendChild(t);
    if (x.vocabulario.length) {
      var v = estEl('section', 'card'); v.appendChild(estEl('h2', null, 'Vocabulário'));
      x.vocabulario.forEach(function (w) { var row = estEl('div', 'est-vocab'), b = estEl('b', null, w[0]); b.lang = x.lang; row.appendChild(b); row.appendChild(estEl('span', null, ' — ' + w[1])); var g = studioButton('Guardar', function () { uxSaveNote(w[0], w[1], 'Quero lembrar', x.titulo); g.disabled = true; g.textContent = 'Guardada'; }); row.appendChild(g); v.appendChild(row); });
      pg.appendChild(v);
    }
    if (x.perguntas.length) {
      var q = estEl('section', 'card'); q.appendChild(estEl('h2', null, 'Você entendeu?')); var marcadas = {};
      x.perguntas.forEach(function (pq, i) {
        var f = document.createElement('fieldset'); f.className = 'est-pergunta'; f.appendChild(estEl('legend', null, (i + 1) + '. ' + pq.pergunta));
        pq.opcoes.forEach(function (o, j) { var l = estEl('label'), r = document.createElement('input'); r.type = 'radio'; r.name = 'q' + i; r.onchange = function () { marcadas[i] = j; }; l.appendChild(r); l.appendChild(document.createTextNode(' ' + o)); f.appendChild(l); });
        q.appendChild(f);
      });
      var res = estEl('p', 'pron-status'); res.setAttribute('role', 'status');
      q.appendChild(studioButton('Conferir respostas', function () {
        var n = 0; x.perguntas.forEach(function (pq, i) { var f = q.querySelectorAll('fieldset')[i], ok = marcadas[i] === pq.correta; if (ok) n++; f.classList.toggle('est-certa', ok); f.classList.toggle('est-errada', !ok);
          var ex = f.querySelector('.est-gabarito') || estEl('p', 'est-gabarito'); ex.textContent = ok ? 'Certo!' : 'Resposta: ' + pq.opcoes[pq.correta]; f.appendChild(ex); });
        res.textContent = n + ' de ' + x.perguntas.length + ' certas.'; if (x.acertos == null || n > x.acertos) { x.acertos = n; salvar(); }
        if (x.acertos === n) uxRecord({ kind: 'reading', title: 'Leitura · ' + x.titulo, detail: n + ' de ' + x.perguntas.length + ' certas' });
      }, 'primary'));
      q.appendChild(res); pg.appendChild(q);
    }
    pg.appendChild(studioButton('Outra leitura', function () { ir('leituras'); }));
  };

  /* ---------------- entradas: Hoje e Praticar ---------------- */
  /* TELAS.hoje é definida mais adiante no design; o build chama esta função logo depois dela */
  function estudoInstalarHoje() {
  var _hojeEst = TELAS.hoje;
  TELAS.hoje = function () {
    _hojeEst.apply(this, arguments);
    var pg = $('.page'); if (!pg || !eu()) return;
    var ecoOi = $('.ux-greeting .eco', pg); if (ecoOi && ecoOi.__eco && window.Eco) { ecoOi.__eco.estado(Eco.abertura({ nome: eu().nome }).estado); ecoOi.__eco.sequencia(eu().sequencia || 0); }
    var foco = $('.ux-focus', pg), dia = cartaoRevisaoDia(); if (foco && foco.nextSibling) pg.insertBefore(dia, foco.nextSibling); else pg.appendChild(dia);
    var k = eu().idioma, feitas = eu().progresso[k] || 0, res = provasDe(eu()), pendente = null;
    EST_NIVEIS.forEach(function (n, li) { if (!pendente && feitas >= (li + 1) * 60 && !res[k + '|' + n]) pendente = n; });
    if (pendente) { var c = estEl('section', 'card ux-small-card est-prova-hoje'); c.innerHTML = '<span class="ui-label">Fim de nível</span><h2>Você terminou o ' + pendente + '!</h2><p>Faça a prova do nível para ver o que já está firme.</p>'; c.appendChild(uxBtn('Fazer a prova', function () { ir('prova', pendente); })); pg.insertBefore(c, dia.nextSibling); }
  };
  }

  TELAS.eco3D=function(){
    var pg=studioPage('Laboratório do Eco 3D','config');
    studioLead(pg,'Prévia do mascote','Conheça o Eco em 3D','Teste as expressões e veja o personagem por outros ângulos. O mascote das outras telas continua igual.');
    var lab=document.createElement('section');lab.className='eco-lab';
    lab.innerHTML='<div class="eco-lab-view"><span class="eco-lab-badge">Modelo 3D real</span></div><p class="eco-lab-status" role="status">Preparando o Eco…</p><div class="eco-lab-states" role="group" aria-label="Estados do Eco">'+['Neutro','Conectando','Ouvindo','Pensando','Falando','Interrompido','Feliz','Ajudando','Lendo'].map(function(n){return '<button type="button" disabled data-eco-state="'+n+'" aria-pressed="false">'+n+'</button>';}).join('')+'</div><div class="eco-lab-settings"><label>Ângulo do personagem<input class="eco-lab-angle" type="range" min="-180" max="180" value="9"></label><label>Fundo da prévia<select class="eco-lab-theme"><option value="auto">Acompanhar o app</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label><label class="eco-lab-check"><input class="eco-lab-reduce" type="checkbox"> Reduzir movimentos</label><button type="button" class="ui-btn ui-btn--secondary eco-lab-pause" aria-pressed="false">Pausar movimentos</button><button type="button" class="ui-btn ui-btn--ghost eco-lab-reset">Voltar à vista inicial</button></div>';
    pg.appendChild(lab);pg.insertAdjacentHTML('beforeend','<p class="studio-note">Movimentos de demonstração recriados para o navegador a partir das partes do seu modelo. A onda de fala é ilustrativa; não está ligada ao microfone.</p>');
    pg.appendChild(studioButton('Voltar às configurações',function(){ir('config');}));
    Promise.all([new Promise(function(resolve,reject){if(window.EcoLabMount){resolve();return;}var script=document.createElement('script');script.src=document.getElementById('eco-3d-renderer').dataset.src;script.onload=resolve;script.onerror=reject;document.head.appendChild(script);}),fetch(document.getElementById('eco-glb-asset').dataset.src).then(function(r){if(!r.ok)throw new Error('modelo');return r.text();})]).then(function(result){if(lab.isConnected)window.EcoLabMount(lab,result[1]);}).catch(function(){if(lab.isConnected)lab.querySelector('[role=status]').textContent='Não foi possível abrir o modelo 3D. Confira a conexão.';});
  };

  TELAS.descobrir=function(context){
    var pg=studioPage('Descobrir','praticar');
    var current=uxCurrent();if(current)pg.appendChild(uxUnitCard(current.unidade));
    DiscoveryContent.mount({container:pg,profile:eu(),course:COURSE,context:context,rate:S.cfg.voz,save:salvar,note:uxSaveNote,record:uxRecord,finish:function(rec){ir('uxFim',rec);},toast:toast});
  };
  var UX_PHOTOS='assets/c6bfe16efec91a123fcd.webp';
  /* UX: navigation, personal notebook, supportive controls and visible learning records. */
  function uxData(){var p=eu();p.design=p.design||{notes:[],records:[],favorites:{},topics:{}};return p.design;}
  function uxDS(){var p=eu();p.discovery=p.discovery||{};if(!p.discovery[p.idioma]){try{p.discovery[p.idioma]=JSON.parse(localStorage.getItem('idiomas-discover:'+p.id+':'+p.idioma))||{};}catch(e){p.discovery[p.idioma]={};}}return p.discovery[p.idioma];}
  function uxSaveNote(text,translation,topic,source){var d=uxData(),lang=eu().idioma;var existing=d.notes.find(function(n){return n.text===text&&n.lang===lang;});if(existing){toast('Esta expressão já está no caderno.');return existing;}var n={id:'note-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),lang:lang,text:text,translation:translation||'',topic:topic||'Quero lembrar',source:source||'Anotação pessoal',date:Date.now()};d.notes.unshift(n);salvar();toast('Guardado no seu caderno.');return n;}
  function uxRecord(record){var d=uxData();record.id='practice-'+Date.now();record.lang=eu().idioma;record.date=Date.now();d.records.unshift(record);d.records=d.records.slice(0,150);salvar();return record;}
  function uxCurrent(){var p=eu(),all=todasLicoes(curso());return all[p.progresso[p.idioma]] || null;}
  function uxBtn(text,fn,primary){var b=studioButton(text,fn,primary?'primary':'secondary');b.classList.add('ux-button');return b;}
  function uxTitle(pg,kicker,title,body){var h=document.createElement('div');h.className='ux-heading';h.innerHTML='<span class="ui-label">'+esc(kicker)+'</span><h1>'+esc(title)+'</h1><p>'+esc(body)+'</p>';pg.appendChild(h);}
  function uxPhotoIndex(u){var t=(u.titulo||u.title||'').toLowerCase();if(/café|comida|restaur|food|coffee/.test(t))return 1;if(/família|familia|family/.test(t))return 2;if(/viag|aero|travel|airport/.test(t))return 3;if(/rotina|daily|routine|dia/.test(t))return 4;if(/trabalh|work/.test(t))return 5;return 0;}
  function uxPhoto(u){var i=uxPhotoIndex(u),pic=document.createElement('div');pic.className='ux-photo';pic.setAttribute('role','img');pic.setAttribute('aria-label',['Pessoas se encontrando em um café','Café e livro junto à janela','Família conversando à mesa','Terminal de aeroporto','Uma manhã em casa','Colegas de trabalho conversando'][i]);pic.style.backgroundImage='url("'+UX_PHOTOS+'")';pic.style.backgroundPosition=(i%3*50)+'% '+(i<3?'0%':'100%');return pic;}
  function uxUnitCard(u){var card=document.createElement('section');card.className='card ux-unit';card.appendChild(uxPhoto(u));var text=document.createElement('div');text.innerHTML='<span class="ui-label">Seu próximo contexto</span><h2>'+esc(u.titulo||u.title)+'</h2><p>'+esc(u.objetivo||u.objective||'')+'</p>';card.appendChild(text);return card;}
  function uxPage(title,tab){return casca(tab||'praticar',title);}
  TELAS.hoje=function(){var p=eu();novoDia(p);var pg=casca('hoje','',function(bar){botaoIdioma(bar);});var current=uxCurrent(),ds=uxDS(),cards=ds.cards||[],due=cards.filter(function(c){return c.due<=Date.now();}).length;
    var greeting=document.createElement('div');greeting.className='ux-greeting';var text=document.createElement('div');text.innerHTML='<span class="ui-label">Seu tempo, seu ritmo</span><h1>'+esc(saudacao()+', '+p.nome)+'.</h1><p>Um próximo passo já é um bom começo.</p>';greeting.appendChild(text);greeting.appendChild(eco('neutral','Eco está com você'));pg.appendChild(greeting);
    var focus=document.createElement('section');focus.className='card ux-focus';focus.innerHTML='<span class="ui-label">Seu próximo passo · cerca de 5 min</span><h2>'+esc(current?current.nome:'Um reencontro com o idioma')+'</h2><p>'+esc(current?current.unidade.objetivo:'Revisite uma expressão que deseja lembrar.')+'</p>';focus.appendChild(uxBtn('Continuar aprendendo',function(){if(current)abrirLicaoApp(current.unidade,current.nome,{});else ir('revisar');},true));focus.insertAdjacentHTML('beforeend','<small>Você pode pausar e retomar quando precisar.</small>');pg.appendChild(focus);
    var choices=document.createElement('div');choices.className='ux-two';var rev=document.createElement('section');rev.className='card ux-small-card';rev.innerHTML='<span class="ui-label">Reencontrar</span><h2>Um pouco de revisão</h2><p>'+(due?due+' expressões salvas disponíveis.':'Revisite palavras e expressões do curso.')+'</p>';rev.appendChild(uxBtn('Revisar',function(){ir('revisar');}));var explore=document.createElement('section');explore.className='card ux-small-card';explore.innerHTML='<span class="ui-label">Experimentar</span><h2>Explorar no seu ritmo</h2><p>Pratique expressões da sua unidade, sem precisar de microfone.</p>';explore.appendChild(uxBtn('Explorar',function(){ir('descobrir',{activity:2});}));choices.append(rev,explore);pg.appendChild(choices);
    if(current){var c=uxUnitCard(current.unidade);c.appendChild(uxBtn('Ver minha trilha',function(){ir('trilha');}));pg.appendChild(c);}
    var n=document.createElement('p');n.className='ux-quiet';n.textContent=p.minutosHoje?'Hoje você reservou '+p.minutosHoje+' minutos para estudar. Pode encerrar por aqui, se quiser.':'Uma sessão curta também conta. Escolha o ritmo de hoje.';pg.appendChild(n);pg.appendChild(uxBtn('O que já pratiquei',function(){ir('conquistas');}));
  };
  TELAS.praticar=function(intent){var pg=uxPage('Praticar','praticar');uxTitle(pg,'Escolha pelo que precisa','Como quer praticar hoje?','Você escolhe o caminho. O Eco acompanha quando precisar.');
    var intentions=[['entender','Quero entender melhor','Leitura, escuta e explicações','ear'],['expressar','Quero me expressar','Conversa, escrita e situações reais','chat'],['revisar','Quero revisar','Palavras, expressões e novas tentativas','revisar'],['explorar','Quero explorar','Imagens, histórias e desafios','globe']];
    var menu=document.createElement('div');menu.className='ux-intentions';intentions.forEach(function(x){var b=document.createElement('button');b.className='card ux-intention'+(intent===x[0]?' selected':'');b.type='button';b.setAttribute('aria-expanded',intent===x[0]?'true':'false');b.innerHTML='<span class="ux-intention-icon">'+svg(x[3])+'</span><span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></span>'+svg('chev');b.onclick=function(){var y=window.scrollY;ir('praticar',x[0]);window.scrollTo(0,y);};menu.appendChild(b);});pg.appendChild(menu);
    if(!intent){pg.appendChild(uxBtn('Explorar todas as atividades',function(){ir('descobrir');}));return;}
    var options={entender:[['Leitura extra com o Eco','leituras'],['Tirar uma dúvida com o Eco','ecoDuvida'],['Fazer um ditado','ecoDitado'],['Ler o diálogo','descobrir',{activity:1}],['Guias da unidade','guias'],['Explorar expressões','descobrir',{activity:2}]],expressar:[['Conversar com o Eco','ecoScenarios'],['Escrever um texto','ecoWrite'],['Treinar pronúncia','ecoPronuncia'],['Resolver uma missão','descobrir',{activity:10}],['Praticar com menos ajuda','descobrir',{activity:11}]],revisar:[['Revisão do dia','revisaoDia'],['Prova de nível','provas'],['Revisar meus erros','ecoRevisao'],['Revisão do curso','revisar'],['Expressões salvas','descobrir',{view:'review'}],['Meu caderno pessoal','caderno'],['Praticar dificuldades','descobrir',{view:'errors'}]],explorar:[['Uma história em sequência','descobrir',{activity:8}],['Completar uma ideia','descobrir',{activity:9}],['Montar uma frase','descobrir',{activity:3}],['Todas as descobertas','descobrir']]};
    var section=document.createElement('section');section.className='card ux-options';section.innerHTML='<h2>'+intentions.find(function(x){return x[0]===intent;})[1]+'</h2>';options[intent].forEach(function(x){section.appendChild(uxBtn(x[0],function(){ir(x[1],x[2]);}));});pg.appendChild(section);
    /* no celular as opções ficavam abaixo dos quatro cartões, fora da tela: abrem logo abaixo do escolhido */
    var escolhido=menu.querySelector('.ux-intention.selected');if(escolhido){escolhido.after(section);setTimeout(function(){try{section.scrollIntoView({block:'nearest',behavior:'smooth'});}catch(e){section.scrollIntoView(false);}},60);}
  };
  function uxItems(){var lang=eu().idioma,d=uxData(),st=studioData(),ds=uxDS();var rows=d.notes.filter(function(n){return n.lang===lang;}).map(function(n){return Object.assign({kind:'Anotações',own:true},n);});
    (ds.cards||[]).forEach(function(c){rows.push({id:'discover-'+c.id,kind:'Expressões',text:c.answer,translation:c.prompt,topic:'Quero lembrar',source:'Descobrir · prática do curso',action:function(){ir('descobrir',{view:'review'});}});});
    st.words.filter(function(w){return w.lang===lang;}).forEach(function(w,i){rows.push({id:'eco-word-'+w.word,kind:'Palavras',text:w.word,translation:w.translation,topic:'Quero lembrar',source:'Conversa com o Eco'});});
    st.writings.filter(function(w){return w.lang===lang;}).forEach(function(w){rows.push({id:w.id,kind:'Textos',text:w.text,translation:w.title,topic:'Meus textos',source:'Redação · '+studioDate(w.date),date:w.date,action:function(){ir('ecoWritingResult',w.id);}});});
    (st.erros||[]).filter(function(e){return e.lang===lang;}).forEach(function(e){rows.push({id:'erro-'+e.id,kind:'Dificuldades',text:e.correta,translation:e.nota||'',topic:'Quero lembrar',source:'Minha tentativa: '+(e.dada||'—'),action:function(){ir('ecoRevisao');}});});
    (ds.errors||[]).forEach(function(e){rows.push({id:'error-'+e.id,kind:'Dificuldades',text:e.correct,translation:e.explanation,topic:'Quero lembrar',source:'Minha tentativa: '+e.said,action:function(){ir('descobrir',{activity:e.activity,errorId:e.id});}});});
    var seen={};rows=rows.filter(function(r){var key=r.text.trim().toLocaleLowerCase();if(seen[key])return false;seen[key]=true;return true;});return rows.map(function(r){r.favorite=!!d.favorites[r.id];r.topic=d.topics[r.id]||r.topic;return r;});
  }
  TELAS.caderno=function(){var pg=uxPage('Meu caderno','caderno');uxTitle(pg,'Feito por você','O que vale guardar.','Frases, palavras e ideias para reencontrar depois.');var toolbar=document.createElement('div');toolbar.className='ux-notebook-tools';toolbar.innerHTML='<label class="ux-field">Buscar no caderno<input type="search" placeholder="Uma palavra, frase ou assunto…" aria-label="Buscar no caderno"></label><label class="ux-field">Filtrar<select><option>Todos</option><option>Favoritos</option><option>Quero lembrar</option><option>Viagem</option><option>Trabalho</option><option>Cotidiano</option><option>Cultura</option><option>Textos</option><option>Dificuldades</option></select></label>';pg.appendChild(toolbar);pg.appendChild(uxBtn('Adicionar uma anotação',function(){uxEditNote();},true));var list=document.createElement('div');list.className='ux-notebook-list';pg.appendChild(list);
    function render(){var q=toolbar.querySelector('input').value.toLocaleLowerCase(),f=toolbar.querySelector('select').value,rows=uxItems().filter(function(r){return (!q||(r.text+' '+r.translation+' '+r.topic).toLocaleLowerCase().includes(q))&&(f==='Todos'||f==='Favoritos'&&r.favorite||r.topic===f||r.kind===f);});list.innerHTML='';if(!rows.length){list.innerHTML='<section class="card ux-empty"><h2>'+(uxItems().length?'Nenhum item com esse filtro.':'Seu caderno começa com uma ideia.')+'</h2><p>'+(uxItems().length?'Experimente outra busca ou escolha Todos.':'Salve uma frase nos Guias, uma expressão na leitura ou escreva uma anotação pessoal.')+'</p></section>';return;}rows.forEach(function(r){var c=document.createElement('article');c.className='card ux-note';c.innerHTML='<div class="ux-note-meta"><span class="ui-label">'+esc(r.topic)+'</span></div><h2>'+esc(r.text)+'</h2><p class="ux-translation">'+esc(r.translation||'')+'</p><small>'+esc(r.source)+'</small>';var fav=uxBtn(r.favorite?'★ Favorito':'☆ Favoritar',function(){uxData().favorites[r.id]=!uxData().favorites[r.id];salvar();render();});fav.setAttribute('aria-pressed',String(r.favorite));var actions=document.createElement('div');actions.className='ux-actions';actions.append(fav,uxBtn('Abrir',function(){uxNoteDetail(r,render);}));c.appendChild(actions);list.appendChild(c);});}
    toolbar.querySelector('input').oninput=render;toolbar.querySelector('select').onchange=render;render();
  };
  function uxEditNote(note){folha(function(sh){sh.innerHTML='<h2>'+(note?'Editar anotação':'Guardar uma ideia')+'</h2><label class="ux-field">Frase ou anotação<textarea id="ux-note-text" rows="4" maxlength="3000" placeholder="O que você quer lembrar?"></textarea></label><label class="ux-field">Tradução ou comentário<input id="ux-note-translation" maxlength="1000"></label><label class="ux-field">Assunto<select id="ux-note-topic"><option>Quero lembrar</option><option>Viagem</option><option>Trabalho</option><option>Cotidiano</option><option>Cultura</option></select></label>';sh.querySelector('#ux-note-text').value=note?note.text:'';sh.querySelector('#ux-note-translation').value=note?note.translation:'';if(note)sh.querySelector('#ux-note-topic').value=note.topic;
      var b=uxBtn('Salvar no caderno',function(){var text=sh.querySelector('#ux-note-text').value.trim();if(!text)return;var tr=sh.querySelector('#ux-note-translation').value.trim(),topic=sh.querySelector('#ux-note-topic').value;if(note){Object.assign(note,{text:text,translation:tr,topic:topic});salvar();}else uxSaveNote(text,tr,topic);fecharFolha();ir('caderno');},true);function valid(){b.disabled=!sh.querySelector('#ux-note-text').value.trim();}sh.querySelector('#ux-note-text').oninput=valid;sh.appendChild(b);sh.appendChild(uxBtn('Cancelar',fecharFolha));valid();});}
  function uxNoteDetail(r,update){folha(function(sh){sh.innerHTML='<span class="ui-label">'+esc(r.kind)+'</span><h2>'+esc(r.text)+'</h2><p>'+esc(r.translation||'')+'</p><small>'+esc(r.source)+'</small><label class="ux-field">Organizar por assunto<select><option>Quero lembrar</option><option>Viagem</option><option>Trabalho</option><option>Cotidiano</option><option>Cultura</option><option>Meus textos</option></select></label>';sh.querySelector('select').value=r.topic;sh.querySelector('select').onchange=function(){uxData().topics[r.id]=this.value;salvar();update();};if(r.action)sh.appendChild(uxBtn('Voltar à atividade',function(){fecharFolha();r.action();},true));if(r.own){sh.appendChild(uxBtn('Editar',function(){fecharFolha();uxEditNote(uxData().notes.find(function(n){return n.id===r.id;}));}));sh.appendChild(uxBtn('Remover anotação',function(){var d=uxData(),removed=d.notes.find(function(n){return n.id===r.id;});d.notes=d.notes.filter(function(n){return n.id!==r.id;});salvar();sh.innerHTML='<h2>Anotação removida</h2><p>Você pode desfazer antes de fechar.</p>';sh.appendChild(uxBtn('Desfazer',function(){d.notes.unshift(removed);salvar();fecharFolha();update();},true));sh.appendChild(uxBtn('Fechar',function(){fecharFolha();update();}));update();}));}sh.appendChild(uxBtn('Fechar',fecharFolha));});}
  function uxHelp(container,context){var current=uxCurrent(),u=context&&context.unit||current&&current.unidade||{id:'',titulo:'Revisão'},g=GUIAS[u.id],sample=g&&g.vocab&&g.vocab[0],block=g&&g.blocos&&g.blocos[0];var panel=document.createElement('details');panel.className='ux-help';panel.innerHTML='<summary>'+svg('chat')+' Uma ajuda do Eco</summary><div class="ux-help-content"></div>';var body=panel.querySelector('div'),step=0;var explanation='Observe a estrutura da frase e o contexto. Compare as palavras que já conhece antes de responder.';if(block){var temp=document.createElement('div');temp.innerHTML=block.texto;explanation=temp.textContent.trim();}var levels=[['Uma pista','Leia o objetivo: '+(u.objetivo||u.objective||'entender a mensagem')+'. Comece pelas palavras que reconhece.'],['Um exemplo',sample?sample[0]+' — '+sample[1]:'Compare a sua resposta com as expressões do guia da unidade.'],['A explicação',explanation]];function render(){body.innerHTML='<span class="ui-label">'+(step+1)+' de 3 · '+levels[step][0]+'</span><p>'+esc(levels[step][1])+'</p>';if(step<2)body.appendChild(uxBtn(step===0?'Ver um exemplo':'Entender melhor',function(){step++;render();}));else body.appendChild(uxBtn('Voltar à pista',function(){step=0;render();}));}render();container.appendChild(panel);}
  function uxPrefs(){folha(function(sh){sh.classList.add('ux-preferences');sh.innerHTML='<span class="ui-label">Seu conforto</span><h2>Do seu jeito</h2><p>Os ajustes são aplicados sem sair da atividade.</p>';function toggle(label,desc,key){var row=document.createElement('label');row.className='ux-pref-row';row.innerHTML='<span><strong>'+label+'</strong><small>'+desc+'</small></span><input type="checkbox" '+(S.cfg[key]?'checked':'')+'>';row.querySelector('input').onchange=function(){S.cfg[key]=this.checked;salvar();uxApplyPrefs();if(key==='silent'&&this.checked){IdiomasAudio.stop();if('speechSynthesis'in window)speechSynthesis.cancel();}};sh.appendChild(row);}toggle('Modo silencioso','Pausa voz e sons. A leitura continua disponível.','silent');toggle('Mostrar traduções','Exibe o apoio em português nos Guias e na leitura.','translations');toggle('Reduzir movimentos','Mantém os estados sem animações decorativas.','motion');var row=document.createElement('div');row.className='ux-pref-size';row.innerHTML='<h3>Tamanho do texto</h3>';[100,112,125].forEach(function(n){var b=uxBtn(n===100?'Padrão':n===112?'Maior':'Amplo',function(){S.cfg.textSize=n;salvar();uxApplyPrefs();row.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(+x.dataset.size===n));});});b.dataset.size=n;b.setAttribute('aria-pressed',String((S.cfg.textSize||100)===n));row.appendChild(b);});sh.appendChild(row);sh.appendChild(uxBtn('Pronto',fecharFolha,true));});}
  function uxApplyPrefs(){if(eu()){eu().preferencias=eu().preferencias||{};['meta','voz','tema','efeitos','motion','silent','translations','textSize'].forEach(function(k){if(S.cfg[k]!==undefined)eu().preferencias[k]=S.cfg[k];});}uxAplicarPrefs();}
  /* só aplica na tela (não grava): usado ao abrir o app e ao entrar ou trocar de perfil */
  function uxAplicarPrefs(){if(S.cfg.translations===undefined)S.cfg.translations=true;html.dataset.silent=S.cfg.silent?'true':'false';html.dataset.translations=S.cfg.translations?'show':'hide';html.style.setProperty('--ux-text-scale',(S.cfg.textSize||100)/100);aplicarTema();window.dispatchEvent(new CustomEvent('idiomas-preferences',{detail:{silent:!!S.cfg.silent,translations:!!S.cfg.translations,reduce:!!S.cfg.motion,textSize:S.cfg.textSize||100}}));}
  function uxQuickButton(){var b=document.createElement('button');b.type='button';b.className='icon-btn ux-quick';b.setAttribute('aria-label','Ajustes rápidos de leitura e áudio');b.innerHTML=svg('gear');b.onclick=uxPrefs;return b;}
  function uxDecorateFim(box,r,u){var g=GUIAS[u.id],phrase=g&&g.vocab&&g.vocab[0],section=document.createElement('section');section.className='card ux-closure';section.innerHTML='<span class="ui-label">O que você praticou</span><h2>'+esc(u.objetivo||u.titulo)+'</h2><p>Você reservou um momento para este contexto. Pode encerrar por aqui.</p>';if(phrase){section.insertAdjacentHTML('beforeend','<div class="ux-keepsake"><strong>'+esc(phrase[0])+'</strong><p class="ux-translation">'+esc(phrase[1])+'</p></div>');section.appendChild(uxBtn('Guardar esta expressão',function(){uxSaveNote(phrase[0],phrase[1],'Quero lembrar',u.titulo);},false));}var next=uxBtn('Prefiro continuar pela trilha',function(){uxExit='trilha';document.getElementById('acao').click();});section.appendChild(next);box.appendChild(section);}
  var uxExit='hoje';
  TELAS.uxFim=function(record){var pg=uxPage('Um passo a mais','praticar');uxTitle(pg,'Prática encerrada','Seu tempo valeu a pena.','Você pode parar por aqui e voltar quando quiser.');var c=document.createElement('section');c.className='card ux-closure';c.appendChild(eco('happy','Eco reconhece seu esforço'));c.insertAdjacentHTML('beforeend','<span class="ui-label">O que você praticou</span><h2>'+esc(record.title)+'</h2><p>'+esc(record.detail||'Uma nova oportunidade de usar o idioma.')+'</p>');if(record.phrase){c.insertAdjacentHTML('beforeend','<div class="ux-keepsake">'+esc(record.phrase)+'</div>');c.appendChild(uxBtn('Guardar uma expressão',function(){uxSaveNote(record.phrase,'','Quero lembrar',record.title);}));}pg.appendChild(c);pg.appendChild(uxBtn('Encerrar por hoje',function(){ir('hoje');},true));pg.appendChild(uxBtn('Escolher outra prática',function(){ir('praticar');}));};
  TELAS.conquistas=function(){var pg=uxPage('Minhas conquistas','perfil'),d=uxData(),records=d.records.filter(function(r){return r.lang===eu().idioma;}),ds=uxDS(),st=studioData();uxTitle(pg,'O que já consigo fazer','Seu percurso, com exemplos.','Reveja o que praticou e perceba o que está ficando mais familiar.');var domains=[['Entender mensagens',records.filter(function(r){return [1,2,6,7,8,9].includes(r.activity)||r.kind==='lesson';})],['Me expressar',records.filter(function(r){return [3,5,10,11].includes(r.activity);})],['Guardar e reencontrar',uxItems().length?[{title:uxItems().length+' itens no caderno',date:Date.now(),detail:'Expressões, textos e anotações pessoais.'}]:[]]];domains.forEach(function(x){var c=document.createElement('section');c.className='card ux-capability';c.innerHTML='<span class="pill">'+(x[1].length?'Praticado':'Próximo passo')+'</span><h2>'+x[0]+'</h2><p>'+(x[1].length?esc(x[1][0].title):'Sua próxima experiência aparecerá aqui.')+'</p>';c.appendChild(uxBtn('Praticar novamente',function(){ir('praticar',x[0]==='Entender mensagens'?'entender':x[0]==='Me expressar'?'expressar':'revisar');}));pg.appendChild(c);});
    var writings=st.writings.filter(function(w){return w.lang===eu().idioma;});if(writings.length>=2){var compare=document.createElement('section');compare.className='card';compare.innerHTML='<h2>Seu texto, em dois momentos</h2><p>Observe o que mudou na sua maneira de escrever. As datas mostram o percurso; não são uma nota automática.</p>';[writings[writings.length-1],writings[0]].forEach(function(w,i){compare.insertAdjacentHTML('beforeend','<details class="ux-attempt"><summary>'+(i?'Mais recente':'Primeiro texto')+' · '+studioDate(w.date)+'</summary><p>'+esc(w.text)+'</p></details>');});pg.appendChild(compare);}
    var history=document.createElement('section');history.className='ux-records';history.innerHTML='<h2>Seus momentos de prática</h2>';if(!records.length)history.innerHTML+='<div class="card"><p>Conclua uma atividade para registrar seu primeiro momento. As lições anteriores continuam no progresso do curso.</p></div>';records.slice(0,12).forEach(function(r){history.insertAdjacentHTML('beforeend','<article class="card"><span class="ui-label">'+studioDate(r.date)+'</span><h3>'+esc(r.title)+'</h3><p>'+esc(r.detail||'Prática concluída')+'</p>'+(r.attempt?'<details><summary>Rever minha tentativa</summary><p>'+esc(r.attempt)+'</p></details>':'')+'</article>');});pg.appendChild(history);pg.appendChild(uxBtn('Ver números do curso',function(){ir('progresso');}));pg.insertAdjacentHTML('beforeend','<p class="ux-quiet">Atividades demonstrativas registram prática; não certificam domínio do idioma.</p>');};
  // Existing destinations remain available through the new navigation.
  var uxCasca=casca;casca=function(aba,titulo,extras){var mapped={guias:'praticar',revisar:'praticar',progresso:'perfil'};var pg=uxCasca(mapped[aba]||aba,titulo,extras);var bar=pg.parentElement.querySelector('.appbar');if(bar&&eu())bar.appendChild(uxQuickButton());return pg;};
  var uxGuide=TELAS.guia;TELAS.guia=function(id){uxGuide(id);var pg=root.querySelector('.page'),u;curso().secoes.forEach(function(s){s.unidades.forEach(function(x){if(x.id===id)u=x;});});if(u)pg.prepend(uxUnitCard(u));var g=GUIAS[id];if(g)root.querySelectorAll('.vocab tbody tr').forEach(function(row,i){var cell=row.firstElementChild,b=uxBtn('Guardar',function(){uxSaveNote(g.vocab[i][0],g.vocab[i][1],'Quero lembrar',u.titulo);});b.classList.add('ux-save-small');cell.appendChild(b);});};
  var uxTrail=TELAS.trilha;TELAS.trilha=function(){uxTrail();var units=[];curso().secoes.forEach(function(s){s.unidades.forEach(function(u){units.push(u);});});root.querySelectorAll('.linha').forEach(function(section,i){if(!units[i])return;var img=uxPhoto(units[i]);img.classList.add('ux-unit-thumb');var header=section.querySelector('.linha-head');if(header)header.prepend(img);});};
  var uxProfile=TELAS.perfil;TELAS.perfil=function(){uxProfile();var pg=root.querySelector('.page'),c=document.createElement('section');c.className='card ux-options';c.innerHTML='<h2>Seu percurso</h2>';c.append(uxBtn('Minhas conquistas',function(){ir('conquistas');}),uxBtn('Progresso do curso',function(){ir('progresso');}),uxBtn('Guias das unidades',function(){ir('guias');}));pg.insertBefore(c,pg.children[1]||null);};
  estudoInstalarHoje();
  var uxReview=TELAS.revisar;TELAS.revisar=function(){uxReview();var pg=root.querySelector('.page'),ds=uxDS();var c=document.createElement('section');c.className='card ux-options';c.innerHTML='<span class="ui-label">Além das palavras do curso</span><h2>Expressões que você guardou</h2><p>'+(ds.cards||[]).length+' expressões de Descobrir · '+uxItems().length+' itens no caderno.</p>';c.append(uxBtn('Revisar expressões',function(){ir('descobrir',{view:'review'});}),uxBtn('Abrir meu caderno',function(){ir('caderno');}));pg.insertBefore(c,pg.children[1]||null);};
  var uxWrite=TELAS.ecoWrite;TELAS.ecoWrite=function(id){uxWrite(id);uxHelp(root.querySelector('.page'),{unit:uxCurrent()&&uxCurrent().unidade});};
  var uxSpeak=falar;falar=function(t,l){if(S.cfg.silent){toast('Modo silencioso ativo. Você pode mudar nos ajustes rápidos.');return;}uxSpeak(t,l);};
  var uxPlayer=IdiomasAudio.player;IdiomasAudio.player=function(){var player=uxPlayer.apply(IdiomasAudio,arguments);player.addEventListener('click',function(e){if(S.cfg.silent&&e.target.closest('button')){e.preventDefault();e.stopImmediatePropagation();toast('Modo silencioso ativo. Ajuste o áudio no botão de configurações.');}},true);return player;};
  uxAplicarPrefs();

  window.registrarRespostaCurso = function(ex,ok) { if(ex&&ex._prova&&window.provaResposta)provaResposta(ex,ok); if(ex&&ex._srsId&&eu()){var ps=eu();ps.reviewWords=ps.reviewWords||{};ProfileCore.review(ps.reviewWords,ex._srsId,ok);salvar();return;} if(!ex._wordId||!eu())return; var p=eu(); p.reviewWords=p.reviewWords||{}; ProfileCore.review(p.reviewWords,ex._wordId,ok);if(ok){p.vistas=p.vistas||{};p.vistas[ex._wordId.replace(/^(en|fr)\|\d+\|/,'$1|')]=true;p.palavras=Object.keys(p.vistas).length;}salvar(); };
  document.addEventListener('idiomas-sync', function(e){ var box=document.getElementById('sync-feedback'); if(!box){box=document.createElement('p');box.id='sync-feedback';box.setAttribute('role','status');document.body.appendChild(box);} var labels={ok:'Sincronizado',enviando:'Sincronizando…',pendente:'Salvo neste aparelho; sincronização pendente',erro:'Sem sincronizar. Uma nova tentativa será feita.',entrar:'Entre com Google para sincronizar',armazenamento:'Não foi possível salvar no aparelho. Exporte seus dados.',limite:'O histórico excedeu o limite do servidor. Exporte uma cópia.'};box.textContent=labels[e.detail]||''; });
  document.addEventListener('idiomas-profiles-updated', function(){ if(!eu()&&S.perfis.length&&document.querySelector('.profiles'))ir('entrar'); if(eu()){Object.assign(S.cfg,{tema:'sistema',meta:15,voz:.9,efeitos:true,motion:false,silent:false,translations:true,textSize:100},eu().preferencias||{});cfgProfileId=eu().id;uxAplicarPrefs();} });
  if(window.SYNC) SYNC.bind(S);
  var ativo = S.ativo && eu();
  if (ativo) { novoDia(ativo); ir('hoje'); }
  else if (!S.visto) ir('boasvindas');
  else ir('entrar');
})();

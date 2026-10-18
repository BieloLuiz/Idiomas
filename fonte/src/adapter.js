/* Conteúdo real do curso A1 ligado ao app (gerado por src/build-app.py). */
var CURSOS = {}, LICOES = {}, GUIAS = {}, PALAVRAS = {};
(function () {
  var LN = ['Palavras novas', 'Escuta', 'Conversa', 'Gramática', 'Revisão da unidade'];
  function rnd(seed) { var s = seed + 7; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function mix(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function words(s) { return String(s).replace(/[.,!?;:¿¡…“”"]/g, ' ').split(/\s+/).filter(Boolean); }

  /* ---------- áudio: um MP3 por unidade, com o trecho de cada frase ---------- */
  var els = {}, cur = null, tok = 0;
  function el(f) { if (!els[f]) { var a = new Audio(); a.preload = 'auto'; a.src = f; els[f] = a; } return els[f]; }
  function clip(k, u, text) {
    var sp = AUDIO && AUDIO.sprites[k + '|' + u], t = String(text).trim(); if (!sp) return null;
    for (var key in sp.clips) if (key.slice(key.indexOf('|') + 1) === t) return { f: sp.file, c: sp.clips[key] };
    return null;
  }
  function find(k, text, u) {
    if (u != null) { var h = clip(k, u, text); if (h) return h; }
    for (var i = 0; i < 60; i++) { var g = clip(k, i, text); if (g) return g; }
    return null;
  }
  function play(h, onend, r) {
    var a = el(h.f), my = ++tok; if (cur && cur !== a) cur.pause(); cur = a;
    function go() {
      if (my !== tok) return;
      a.playbackRate = r || 0.9; try { a.preservesPitch = true; } catch (e) {}
      a.currentTime = Math.max(0, h.c[0] - 0.02);
      var end = h.c[1] + 0.06;
      a.play().then(function () {
        (function tick() { if (my !== tok) return; if (a.currentTime >= end || a.ended) { a.pause(); onend && onend(); return; } requestAnimationFrame(tick); })();
      }).catch(function () { onend && onend(); });
    }
    if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
  }
  function tts(text, lang, onend, r) {
    if (!('speechSynthesis' in window)) { onend && onend(); return; }
    var u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = r || 0.9;
    u.onend = u.onerror = function () { onend && onend(); }; speechSynthesis.speak(u);
  }
  window.AUD = {
    stop: function () { tok++; if (cur) try { cur.pause(); } catch (e) {} },
    /* toca a frase gravada; devolve false se não houver gravação */
    say: function (text, lang, onend, r, u) {
      var k = String(lang).slice(0, 2), h = find(k, text, u);
      if (!h) return false; play(h, onend, r); return true;
    },
    fn: function (text, lang, u) {
      return function (onend, r) { if (!AUD.say(text, lang, onend, r, u)) tts(text.replace(/_{2,}/g, '…'), lang, onend, r); };
    }
  };
  if ('speechSynthesis' in window) {
    var oc = speechSynthesis.cancel.bind(speechSynthesis);
    speechSynthesis.cancel = function () { AUD.stop(); oc(); };
  }

  /* ---------- montar o curso ---------- */
  ['en', 'fr'].forEach(function (k) {
    var L = COURSE[k], vozL = L.tts, all = [];
    var secs = [], NIV = ['A1', 'A2', 'B1', 'B2', 'C1'];
    L.units.forEach(function (U, ui) {
      var id = k + '-u' + (ui + 1), r = rnd(ui * 31 + (k === 'en' ? 1 : 2));
      var sn = Math.floor(ui / 6), nv = NIV[Math.floor(ui / 12)], a0 = (ui % 12 < 6) ? 1 : 7;
      if (!secs[sn]) secs[sn] = { titulo: 'Seção ' + (sn + 1) + ' · ' + nv + ', unidades ' + a0 + ' a ' + (a0 + 5), unidades: [] };
      secs[sn].unidades.push({ id: id, titulo: U.title, objetivo: U.goal, licoes: LN.slice() });
      var lex = [];
      (U.vocab || []).forEach(function (v) { (v.items || []).forEach(function (it) { if (Array.isArray(it)) lex.push([it[0], it[1]]); }); });
      (U.cards || []).forEach(function (c) { lex.push([c[1], c[0]]); });
      function dicas(frase) {
        var hits = [];
        lex.forEach(function (w) { if (w[0].length < 2) return; var i = frase.indexOf(w[0]); if (i >= 0) hits.push([i, w]); });
        hits.sort(function (a, b) { return a[0] - b[0] || b[1][0].length - a[1][0].length; });
        var out = [], end = 0;
        hits.forEach(function (h) { if (h[0] >= end && out.length < 4) { out.push([h[1][0], h[1][1]]); end = h[0] + h[1][0].length; } });
        return out;
      }
      var lines = (U.lines || []).filter(function (l) { return l[1] && l[2]; });
      var pts = uniq(lines.map(function (l) { return l[2]; }));
      function escuta(l) {
        var outras = mix(pts.filter(function (p) { return p !== l[2]; }), r).slice(0, 2);
        var op = mix([l[2]].concat(outras), r);
        return { tipo: 'escolha', enunciado: 'O que significa esta frase?', frase: l[1], dicas: dicas(l[1]), opcoes: op, correta: op.indexOf(l[2]), audio: AUD.fn(l[1], vozL, ui) };
      }
      function conversa(l) {
        var resp = words(l[2]), extra = [];
        mix(pts, r).forEach(function (p) { words(p).forEach(function (w) { if (extra.length < 3 && resp.indexOf(w) < 0 && extra.indexOf(w) < 0) extra.push(w); }); });
        return { tipo: 'montar', enunciado: 'Traduza esta frase', frase: l[1], dicas: dicas(l[1]), resposta: resp, banco: mix(resp.concat(extra), r), audio: AUD.fn(l[1], vozL, ui) };
      }
      var cards = U.cards || [], alvos = cards.map(function (c) { return c[1]; });
      function palavra(c, nova) {
        var op = mix([c[1]].concat(mix(alvos.filter(function (a) { return a !== c[1]; }), r).slice(0, 2)), r);
        return { tipo: 'escolha', etiqueta: nova ? 'nova' : undefined, enunciado: 'Como se diz isto?', frase: c[1], ocultar: c[0], opcoes: op, correta: op.indexOf(c[1]), perguntaEmPt: true, audio: AUD.fn(c[1], vozL, ui) };
      }
      var gaps = U.gaps || [], resps = uniq(gaps.map(function (g) { return g.a[0]; }));
      function lacuna(g) {
        var op = mix([g.a[0]].concat(mix(resps.filter(function (a) { return g.a.indexOf(a) < 0; }), r).slice(0, 2)), r);
        return { tipo: 'escolha', etiqueta: 'dificil', enunciado: 'Complete: ' + (g.h || ''), frase: g.s, opcoes: op, correta: op.indexOf(g.a[0]), perguntaEmPt: true, audio: AUD.fn(g.s.replace('___', g.a[0]).replace(/\s*\([^)]*\)/g, '').trim(), vozL, ui) };
      }
      var curtas = lines.filter(function (l) { return words(l[2]).length <= 8; });
      if (curtas.length < 4) curtas = curtas.concat(lines.filter(function (l) { var n = words(l[2]).length; return n > 8 && n <= 12; }));
      if (curtas.length < 4) curtas = curtas.concat((U.order || []).map(function (o) { return ['', o.t.join(' '), o.h]; }));
      var ex = [
        mix(cards, r).slice(0, 7).map(function (c) { return palavra(c, true); }),
        mix(lines, r).slice(0, 7).map(escuta),
        mix(curtas, r).slice(0, 6).map(conversa),
        mix(gaps, r).slice(0, 7).map(lacuna)
      ];
      ex.push(mix([].concat(mix(cards, r).slice(0, 2).map(function (c) { return palavra(c); }), mix(lines, r).slice(0, 2).map(escuta), mix(curtas, r).slice(0, 2).map(conversa), mix(gaps, r).slice(0, 2).map(lacuna)), r));
      LN.forEach(function (n, i) { if (ex[i].length) LICOES[id + '|' + n] = { idioma: vozL, exercicios: ex[i], unidade: U.title, nivel: nv }; });
      cards.forEach(function (c) { all.push({ u: ui, ex: palavra(c), w: [c[1], c[0]] }); });

      /* guia da unidade */
      var blocos = (U.grammar || []).map(function (g) {
        return { titulo: g.h, texto: [].concat(g.p || []).map(function (p) { return '<p>' + p + '</p>'; }).join('') + (g.tip ? '<p><b>Dica:</b> ' + g.tip.replace(/^<b>Dica:?<\/b>\s*/i, '') + '</p>' : ''),
          exemplo: (g.ex || []).map(function (e) { return e[0]; }).join(' · ') };
      });
      (U.pron || []).forEach(function (p) { blocos.push({ titulo: 'Pronúncia · ' + p.h, texto: [].concat(p.p || []).map(function (x) { return '<p>' + x + '</p>'; }).join(''), exemplo: [].concat(p.w || []).join(' · ') }); });
      GUIAS[id] = { vocab: lex.slice(0, 16), blocos: blocos };
    });
    CURSOS[k] = { nome: L.name, codigo: k.toUpperCase(), voz: vozL, secoes: secs };
    /* revisão de palavras: tudo o que já foi aberto */
    function feitas() { try { var S = JSON.parse(localStorage.getItem('idiomas-app-v2')); var p = S.perfis.filter(function (x) { return x.id === S.ativo; })[0]; return p.progresso[k] || 0; } catch (e) { return 0; } }
    function abertas() { var n = Math.floor(feitas() / LN.length); return all.filter(function (a) { return a.u <= n; }); }
    Object.defineProperty(PALAVRAS, k, { enumerable: true, get: function () { var f = feitas(); return abertas().map(function (a) { var d = f - a.u * LN.length; return [a.w[0], a.w[1], Math.max(1, Math.min(5, Math.floor(d / 2) + 1))]; }); } });
    Object.defineProperty(LICOES, 'rev|' + k, { get: function () { return { idioma: vozL, exercicios: mix(abertas(), rnd(Date.now() % 1000)).slice(0, 10).map(function (a) { return a.ex; }) }; } });
  });
})();
var LICOES_DEMO = { fr: LICOES['fr-u1|Escuta'], en: LICOES['en-u1|Escuta'] };

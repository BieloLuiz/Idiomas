/* Conteúdo real do curso A1 ligado ao app (gerado por src/build-app.py). */
var CURSOS = {}, LICOES = {}, GUIAS = {}, PALAVRAS = {};
(function () {
  var LN = ['Palavras novas', 'Escuta', 'Montar frases', 'Gramática', 'Revisão da unidade'];
  function rnd(seed) { var s = seed + 7; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function mix(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function words(s) { return String(s).replace(/[.,!?;:¿¡…“”"]/g, ' ').split(/\s+/).filter(Boolean); }

  /* ---------- áudio: um MP3 por unidade, com o trecho de cada frase ---------- */
  var els = {}, cur = null, tok = 0, clean = null, index = {};
  Object.keys(AUDIO.sprites).forEach(function(key){var sp=AUDIO.sprites[key],k=key.slice(0,2);Object.keys(sp.clips).forEach(function(text){var t=text.slice(text.indexOf('|')+1);if(!index[k+'|'+t])index[k+'|'+t]={f:sp.file,c:sp.clips[text]};});});
  function el(f) { if (!els[f]) { var a = new Audio(); a.preload = 'metadata'; a.src = f; els[f] = a; } return els[f]; }
  function clip(k, u, text) {
    var sp = AUDIO && AUDIO.sprites[k + '|' + u], t = String(text).trim(); if (!sp) return null;
    for (var key in sp.clips) if (key.slice(key.indexOf('|') + 1) === t) return { f: sp.file, c: sp.clips[key] };
    return null;
  }
  function find(k, text, u) {
    if (u != null) { var h = clip(k, u, text); if (h) return h; }
    return index[k + '|' + String(text).trim()] || null;
  }
  function play(h, onend, r) {
    if(clean)clean(); var a = el(h.f), my = ++tok; if (cur) cur.pause(); cur = a;
    var timeout=setTimeout(function(){finish(new Error('audio_timeout'));},15000), frame;
    function finish(err){if(my!==tok)return;done();a.pause();if(err)document.dispatchEvent(new CustomEvent('idiomas-audio-error'));if(onend)onend(err);}
    function done(){clearTimeout(timeout);cancelAnimationFrame(frame);a.removeEventListener('loadedmetadata',go);a.removeEventListener('error',failed);if(clean===done)clean=null;}
    function failed(){finish(new Error('audio_indisponivel'));} clean=done;a.addEventListener('error',failed,{once:true});
    function go() {
      if (my !== tok) return;
      a.playbackRate = r || 0.9; try { a.preservesPitch = true; } catch (e) {}
      a.currentTime = Math.max(0, h.c[0] - 0.02);
      var end = h.c[1] + 0.06;
      a.play().then(function () {
        clearTimeout(timeout);timeout=setTimeout(failed,Math.max(15000,(end-h.c[0])*3000));
        (function tick() { if (my !== tok) return; if (a.currentTime >= end || a.ended) { finish(); return; } frame=requestAnimationFrame(tick); })();
      }).catch(failed);
    }
    if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
  }
  function tts(text, lang, onend, r) {
    if (!('speechSynthesis' in window)) { onend && onend(); return; }
    var u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = r || 0.9;
    u.onend = u.onerror = function () { onend && onend(); }; speechSynthesis.speak(u);
  }
  window.AUD = {
    stop: function () { tok++; if(clean)clean(); if (cur) try { cur.pause(); } catch (e) {} },
    /* toca a frase gravada; devolve false se não houver gravação */
    say: function (text, lang, onend, r, u) {
      if(document.documentElement.dataset.silent==='true'){if(onend)onend(new Error('silencioso'));return true;}
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
        return { tipo: 'escolha', escuta: true, enunciado: 'Ouça: o que significa esta frase?', frase: l[1], dicas: dicas(l[1]), opcoes: op, correta: op.indexOf(l[2]), audio: AUD.fn(l[1], vozL, ui) };
      }
      function conversa(l) {
        var resp = words(l[1]), extra = [];
        mix(lines,r).forEach(function(p){words(p[1]).forEach(function(w){if(extra.length<3&&resp.indexOf(w)<0&&extra.indexOf(w)<0)extra.push(w);});});
        return { tipo: 'montar', enunciado: 'Monte a frase no idioma que você estuda', frase: l[1], ocultar: l[2], respostaIdioma: k, resposta: resp, banco: mix(resp.concat(extra), r), audio: AUD.fn(l[1], vozL, ui) };
      }
      var cards = U.cards || [], alvos = cards.map(function (c) { return c[1]; });
      function palavra(c, nova) {
        var op = mix([c[1]].concat(mix(alvos.filter(function (a) { return a !== c[1]; }), r).slice(0, 2)), r);
        return { tipo: 'escolha', _wordId:k+'|'+ui+'|'+c[1], etiqueta: nova ? 'nova' : undefined, enunciado: 'Como se diz isto?', frase: c[1], ocultar: c[0], opcoes: op, correta: op.indexOf(c[1]), perguntaEmPt: true, audio: AUD.fn(c[1], vozL, ui) };
      }
      var gaps = U.gaps || [], resps = uniq(gaps.map(function (g) { return g.a[0]; }));
      function lacuna(g) {
        var op = mix([g.a[0]].concat(mix(resps.filter(function (a) { return g.a.indexOf(a) < 0; }), r).slice(0, 2)), r);
        return { tipo: 'escolha', etiqueta: 'dificil', enunciado: 'Complete: ' + (g.h || ''), frase: g.s, opcoes: op, correta: op.indexOf(g.a[0]), perguntaEmPt: true, audio: AUD.fn(g.s.replace('___', g.a[0]).replace(/\s*\([^)]*\)/g, '').trim(), vozL, ui) };
      }
      var curtas = lines.filter(function (l) { return words(l[2]).length <= 8; });
      if (curtas.length < 4) curtas = curtas.concat(lines.filter(function (l) { var n = words(l[2]).length; return n > 8 && n <= 12; }));
      if (curtas.length < 4) curtas = curtas.concat((U.order || []).map(function (o) { return ['', o.t.join(' '), o.h]; }));
      var ex;
      function prepare(){if(ex)return;r=rnd(ui*31+(k==='en'?1:2));ex = [
        mix(cards, r).slice(0, 7).map(function (c) { return palavra(c, true); }),
        U.mc && U.mc.length ? mix(U.mc,r).map(function(m){return{tipo:'escolha',escuta:true,enunciado:m.q,frase:m.e,opcoes:m.o.slice(),correta:m.a,audio:AUD.fn(m.e,vozL,ui)};}) : mix(lines, r).slice(0, 7).map(escuta),
        mix(curtas, r).slice(0, 6).map(conversa),
        mix(gaps, r).slice(0, 7).map(lacuna)
      ];
      ex.push(mix([].concat(mix(cards, r).slice(0, 2).map(function (c) { return palavra(c); }), mix(lines, r).slice(0, 2).map(escuta), mix(curtas, r).slice(0, 2).map(conversa), mix(gaps, r).slice(0, 2).map(lacuna)), r));
      }
      LN.forEach(function (n, i) { Object.defineProperty(LICOES,id+'|'+n,{enumerable:true,get:function(){prepare();return { idioma: vozL, exercicios: ex[i], unidade: U.title, nivel: nv };}}); });
      cards.forEach(function (c,ci) { all.push({ u: ui, get ex(){r=rnd(ui*97+ci);return palavra(c);}, w: [c[1], c[0]], id:k+'|'+ui+'|'+c[1] }); });

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
    function profile(){try{var S=JSON.parse(localStorage.getItem('idiomas-app-v2'));return S.perfis.find(function(x){return x.id===S.ativo;})||{};}catch(e){return{};}}
    function feitas() { return profile().progresso && profile().progresso[k] || 0; }
    function abertas() { var n = Math.floor(feitas() / LN.length); return all.filter(function (a) { return a.u <= n; }); }
    Object.defineProperty(PALAVRAS, k, { enumerable: true, get: function () { var history=profile().reviewWords||{};return abertas().map(function(a){var item=history[a.id]||{};return[a.w[0],a.w[1],Math.min(5,1+Math.floor(Math.log2((item.interval||0)+1))),item.due||0,a.id];}); } });
    Object.defineProperty(LICOES, 'rev|' + k, { get: function () { var h=profile().reviewWords||{};return { idioma: vozL, exercicios: abertas().filter(function(a){return !h[a.id]||h[a.id].due<=Date.now();}).sort(function(a,b){return (h[a.id]&&h[a.id].due||0)-(h[b.id]&&h[b.id].due||0);}).slice(0,10).map(function(a){return a.ex;}) }; } });
  });
})();

/* Tipos extras de exercício da lição (montados em src/adapter.js, desenhados aqui):
   - explicacao: cartão para aprender antes de praticar (texto, exemplos com áudio e dica). Não vale nota.
   - escrever: a pessoa lê a frase em português e escreve a frase inteira no idioma estudado. */
var LICAO_TIPOS = (function () {
  'use strict';
  function node(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var ICON_SOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
  function botaoOuvir(fn, rotulo) {
    var b = node('button', 'lt-ouvir'); b.type = 'button'; b.innerHTML = ICON_SOM; b.setAttribute('aria-label', rotulo);
    b.addEventListener('click', function () { if (window.AUD) AUD.stop(); if ('speechSynthesis' in window) speechSynthesis.cancel(); b.classList.add('is-on'); fn(function () { b.classList.remove('is-on'); }); });
    return b;
  }

  /* ---------- comparação tolerante para frases escritas ---------- */
  var EN = [[/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'], [/\bwon't\b/g, 'will not'], [/\bshan't\b/g, 'shall not'], [/n't\b/g, ' not'],
    [/'re\b/g, ' are'], [/'ve\b/g, ' have'], [/'m\b/g, ' am'], [/'ll\b/g, ' will']];
  function norm(s, lang, comAcentos) {
    s = String(s || '').toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'");
    if (lang === 'en') EN.forEach(function (r) { s = s.replace(r[0], r[1]); });
    if (!comAcentos) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s.replace(/[^\p{L}\p{N}' ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  function confere(dada, certas, lang) {
    for (var i = 0; i < certas.length; i++) if (norm(dada, lang, true) === norm(certas[i], lang, true)) return { ok: true };
    for (i = 0; i < certas.length; i++) if (norm(dada, lang, false) === norm(certas[i], lang, false)) return { ok: true, acentos: true };
    return { ok: false };
  }

  /* ---------- aprender: cartão de explicação ---------- */
  var explicacao = {
    proprio: true,
    montar: function (ex, box, ctx) {
      var ask = node('div', 'ask'), top = node('div', 'ask-top');
      top.innerHTML = '<span class="tag tag--aprenda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>' + (ex.etiqueta || 'Aprenda') + '</span>';
      top.appendChild(node('span', 'ui-label', ctx.unidade || ''));
      var h = node('h1', null, ex.titulo); h.tabIndex = -1;
      ask.appendChild(top); ask.appendChild(h); box.appendChild(ask);
      var card = node('div', 'lt-explica');
      if (ex.html) { var t = node('div', 'lt-texto'); t.innerHTML = ex.html; card.appendChild(t); }   // texto do próprio curso (versionado no repositório)
      if (ex.exemplos && ex.exemplos.length) {
        card.appendChild(node('p', 'lt-sub', ex.rotuloExemplos || 'Exemplos'));
        var ul = node('ul', 'lt-exemplos');
        ex.exemplos.forEach(function (e) {
          var li = node('li'), txt = node('div', 'lt-ex-txt'), alvo = node('span', 'lt-alvo', e[0]);
          alvo.lang = ctx.idioma.slice(0, 2); txt.appendChild(alvo);
          if (e[1]) txt.appendChild(node('span', 'lt-pt', e[1]));
          if (e[2]) li.appendChild(botaoOuvir(e[2], 'Ouvir: ' + e[0]));
          li.appendChild(txt); ul.appendChild(li);
        });
        card.appendChild(ul);
      }
      if (ex.dica) { var d = node('div', 'lt-dica'); d.innerHTML = '<b>Dica:</b> ' + ex.dica; card.appendChild(d); }
      box.appendChild(card);
      return { botao: ex.botao || 'Entendi', verificar: function () { return { ok: true, semNota: true }; } };
    }
  };

  /* ---------- praticar: escrever a frase inteira ---------- */
  var escrever = {
    montar: function (ex, box, ctx) {
      var lang = ex.respostaIdioma || ctx.idioma.slice(0, 2), certas = [ex.resposta].concat(ex.aceitas || []);
      var root = node('div', 'lt-escrever'), lab = node('label', 'lt-rotulo', 'Sua resposta');
      var ta = node('textarea', 'dit-input'); ta.rows = 2; ta.lang = lang; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.setAttribute('autocorrect', 'off'); ta.setAttribute('autocomplete', 'off');
      ta.placeholder = lang === 'fr' ? 'Écrivez ici…' : 'Type here…'; ta.id = 'escrever-' + Math.random().toString(36).slice(2); lab.htmlFor = ta.id;
      var dica = node('button', 'ia-porque', 'Mostrar a primeira palavra'); dica.type = 'button';
      var msg = node('p', 'lt-msg'); msg.setAttribute('aria-live', 'polite');
      var travado = false;
      dica.addEventListener('click', function () { var w = String(ex.resposta).split(/\s+/)[0]; msg.textContent = 'Começa com: ' + w; msg.lang = lang; dica.remove(); if (!ta.value.trim()) { ta.value = w + ' '; ctx.acao.disabled = false; } ta.focus(); });
      ta.addEventListener('input', function () { if (!travado) ctx.acao.disabled = !ta.value.trim(); });
      ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!ctx.acao.disabled) ctx.acao.click(); } });
      root.appendChild(lab); root.appendChild(ta); root.appendChild(dica); root.appendChild(msg); box.appendChild(root);
      setTimeout(function () { if (ta.isConnected && matchMedia('(pointer: fine)').matches) ta.focus({ preventScroll: true }); }, 0);
      return {
        verificar: function () {
          travado = true; ta.readOnly = true; if (dica.isConnected) dica.remove();
          var dada = ta.value.trim(), r = confere(dada, certas, lang);
          root.classList.add(r.ok ? 'is-right' : 'is-wrong');
          msg.lang = 'pt'; msg.textContent = r.acentos ? 'Certo! Só confira os acentos: ' + ex.resposta : '';
          if (ex.audio) { var b = botaoOuvir(ex.audio, 'Ouvir a resposta'); b.classList.add('lt-ouvir--resp'); b.appendChild(document.createTextNode(' Ouvir a resposta')); root.appendChild(b); }
          return { ok: r.ok, correta: String(ex.resposta).replace(/\.$/, ''), dada: dada };
        }
      };
    }
  };
  return { explicacao: explicacao, escrever: escrever, _norm: norm, _confere: confere };
})();

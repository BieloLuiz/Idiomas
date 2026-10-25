  /* ================= Ensino (src/ensino.js): Consulta (gramática de bolso, erros comuns, falsos cognatos,
     guia de sons) e teste de nivelamento. Mesmo escopo de ia-telas.js. Conteúdo em fonte/curso/consulta-*.json
     e nivelamento.json (vars CONSULTA e NIVELAMENTO). ================= */
  function enEl(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function enVoltar(bar, destino, rotulo) { var b = enEl('button', 'icon-btn'); b.type = 'button'; b.setAttribute('aria-label', rotulo || 'Voltar'); b.innerHTML = svg('back'); b.addEventListener('click', function () { ir(destino); }); bar.appendChild(b); }
  function enOuvir(texto, k) { return IdiomasAudio.player(texto, CURSOS[k].voz, null, S.cfg.voz, function (r) { S.cfg.voz = r; salvar(); }); }
  function enAlvo(texto, k) { var p = enEl('p', 'consulta-alvo', texto); p.lang = k; return p; }

  /* ---------- Consulta ---------- */
  var CONSULTA_ABAS = [['gramatica', 'Gramática'], ['erros', 'Erros comuns'], ['cognatos', 'Falsos amigos'], ['sons', 'Sons']];
  TELAS.consulta = function (aba) {
    var k = eu().idioma, C = (window.CONSULTA || {})[k], nome = CURSOS[k].nome;
    aba = aba && CONSULTA_ABAS.some(function (a) { return a[0] === aba; }) ? aba : 'gramatica';
    var pg = casca('perfil', '', function (bar) { enVoltar(bar, 'perfil', 'Voltar ao perfil'); bar.insertAdjacentHTML('beforeend', '<h1>Consulta · ' + esc(nome) + '</h1>'); });
    pg.classList.add('consulta');
    if (!C) { pg.appendChild(enEl('p', 'lead', 'A consulta deste idioma ainda não foi escrita.')); return; }
    var tabs = enEl('div', 'consulta-abas'); tabs.setAttribute('role', 'tablist');
    CONSULTA_ABAS.forEach(function (a) { var b = enEl('button', 'consulta-aba', a[1]); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(a[0] === aba)); b.addEventListener('click', function () { ir('consulta', a[0]); }); tabs.appendChild(b); });
    pg.appendChild(tabs);
    if (aba === 'gramatica') {
      pg.appendChild(enEl('p', 'lead', 'A base de ' + nome.toLowerCase() + ' em um lugar só. Toque num tema para abrir.'));
      C.gramatica.forEach(function (g) {
        var d = enEl('details', 'card consulta-tema'); d.id = 'tema-' + g.id;
        var s = enEl('summary'); s.appendChild(enEl('b', null, g.titulo)); s.appendChild(enEl('small', null, g.resumo)); d.appendChild(s);
        g.blocos.forEach(function (bl) {
          if (bl.h) d.appendChild(enEl('h3', null, bl.h));
          if (bl.p) d.appendChild(enEl('p', null, bl.p));
          if (bl.tabela) {
            var wrap = enEl('div', 'consulta-tabela'), t = enEl('table', 'vocab');
            bl.tabela.forEach(function (linha, i) { var tr = enEl('tr'); linha.forEach(function (cel) { var td = enEl(i ? 'td' : 'th', null, cel); if (!i) td.scope = 'col'; tr.appendChild(td); }); (i ? (t.tBodies[0] || t.appendChild(enEl('tbody'))) : t.appendChild(enEl('thead'))).appendChild(tr); });
            wrap.appendChild(t); d.appendChild(wrap);
          }
          (bl.ex || []).forEach(function (e) { var x = enEl('div', 'consulta-ex'); x.appendChild(enAlvo(e[0], k)); x.appendChild(enEl('p', 'consulta-trad', e[1])); x.appendChild(enOuvir(e[0], k)); d.appendChild(x); });
        });
        if (g.unidade) { var vai = enEl('button', 'ui-btn ui-btn--secondary', 'Ver na unidade ' + g.unidade); vai.type = 'button'; vai.addEventListener('click', function () { ir('guia', k + '-u' + g.unidade); }); d.appendChild(vai); }
        pg.appendChild(d);
      });
    } else if (aba === 'erros') {
      pg.appendChild(enEl('p', 'lead', 'Erros que quem fala português costuma cometer. Leia o errado, ouça o certo.'));
      C.erros.forEach(function (e) {
        var c = enEl('section', 'card consulta-erro');
        var w = enEl('p', 'consulta-errado', '✗ ' + e.errado); w.lang = k; c.appendChild(w);
        var r = enEl('p', 'consulta-certo', '✓ ' + e.certo); r.lang = k; c.appendChild(r);
        c.appendChild(enEl('p', 'consulta-trad', e.porque));
        c.appendChild(enOuvir(e.certo.replace(/\s*\/.*$/, ''), k));
        pg.appendChild(c);
      });
    } else if (aba === 'cognatos') {
      pg.appendChild(enEl('p', 'lead', 'Palavras que parecem português, mas significam outra coisa.'));
      C.cognatos.forEach(function (f) {
        var c = enEl('section', 'card consulta-cognato');
        var h = enEl('p', 'consulta-palavra', f.palavra); h.lang = k; c.appendChild(h);
        c.appendChild(enEl('p', null, 'Parece “' + f.parece + '”, mas significa: ')).appendChild(enEl('b', null, f.significa));
        if (f.ex) { c.appendChild(enAlvo(f.ex[0], k)); c.appendChild(enEl('p', 'consulta-trad', f.ex[1])); c.appendChild(enOuvir(f.ex[0], k)); }
        pg.appendChild(c);
      });
    } else {
      pg.appendChild(enEl('p', 'lead', 'Os sons mais difíceis para quem fala português. Ouça as palavras e repita em voz alta.'));
      C.sons.forEach(function (s) {
        var c = enEl('section', 'card consulta-som');
        c.appendChild(enEl('h3', null, s.som)); c.appendChild(enEl('p', null, s.como));
        var ws = enEl('div', 'consulta-palavras');
        s.palavras.forEach(function (w) { var b = enEl('button', 'consulta-chip', w); b.type = 'button'; b.lang = k; b.setAttribute('aria-label', 'Ouvir ' + w); b.addEventListener('click', function () { if (S.cfg.silent) { toast('Modo silencioso ativo.'); return; } if ('speechSynthesis' in window) { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(w); u.lang = CURSOS[k].voz; u.rate = Math.min(1, +S.cfg.voz || .9) * .85; speechSynthesis.speak(u); } }); ws.appendChild(b); });
        c.appendChild(ws);
        if (s.frase) { c.appendChild(enAlvo(s.frase, k)); c.appendChild(enOuvir(s.frase, k)); }
        pg.appendChild(c);
      });
    }
  };

  /* ---------- Teste de nivelamento ---------- */
  var NIVEIS_ORDEM = ['A1', 'A2', 'B1', 'B2', 'C1'];
  TELAS.nivelamento = function () {
    var p = eu(), k = p.idioma, nome = CURSOS[k].nome, T = (window.NIVELAMENTO || {})[k];
    var pg = casca('perfil', '', function (bar) { enVoltar(bar, 'perfil', 'Voltar ao perfil'); bar.insertAdjacentHTML('beforeend', '<h1>Teste de nivelamento</h1>'); });
    pg.classList.add('nivelamento');
    if (!T) { pg.appendChild(enEl('p', 'lead', 'O teste deste idioma ainda não está pronto.')); return; }
    var nivelIdx = 0, qi = 0, acertos = 0, ordem = [];
    function intro() {
      pg.replaceChildren();
      pg.appendChild(enEl('span', 'ui-label', nome));
      pg.appendChild(enEl('h2', 'h', 'Descubra por onde começar'));
      pg.appendChild(enEl('p', 'lead', 'São 5 frases por nível, do A1 ao C1. O teste para quando um nível ficar difícil. Leva de 2 a 8 minutos. Não vale olhar o dicionário: o resultado só é útil se for sincero.'));
      var b = enEl('button', 'ui-btn ui-btn--primary ui-btn--block', 'Começar o teste'); b.type = 'button'; b.addEventListener('click', function () { nivelIdx = 0; nivel(); }); pg.appendChild(b);
    }
    function nivel() { qi = 0; acertos = 0; ordem = T[nivelIdx].perguntas.map(function (q) { var idx = q.o.map(function (_, i) { return i; }); for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; } return idx; }); pergunta(); }
    function pergunta() {
      var bloco = T[nivelIdx], q = bloco.perguntas[qi];
      pg.replaceChildren();
      pg.appendChild(enEl('span', 'ui-label', 'Nível ' + bloco.nivel + ' · frase ' + (qi + 1) + ' de ' + bloco.perguntas.length));
      var barra = enEl('div', 'ui-progress'); barra.setAttribute('role', 'progressbar'); barra.setAttribute('aria-label', 'Progresso do teste'); barra.setAttribute('aria-valuemin', '0'); barra.setAttribute('aria-valuemax', '25'); barra.setAttribute('aria-valuenow', String(nivelIdx * 5 + qi));
      var fill = enEl('div', 'ui-progress__fill'); fill.style.width = Math.round((nivelIdx * 5 + qi) / 25 * 100) + '%'; barra.appendChild(fill); pg.appendChild(barra);
      pg.appendChild(enEl('p', null, 'Complete a frase:'));
      var f = enEl('p', 'nivel-frase'); f.lang = k; f.innerHTML = esc(q.f).replace('___', '<span class="lacuna" aria-label="lacuna">____</span>'); pg.appendChild(f);
      if (q.dica) pg.appendChild(enEl('p', 'consulta-trad', q.dica));
      var ops = enEl('div', 'nivel-opcoes');
      ordem[qi].forEach(function (i) { var b = enEl('button', 'ui-btn ui-btn--secondary ui-btn--block', q.o[i]); b.type = 'button'; b.lang = k; b.addEventListener('click', function () { if (i === q.a) acertos++; proxima(); }); ops.appendChild(b); });
      var nao = enEl('button', 'ui-btn ui-btn--ghost ui-btn--block', 'Não sei'); nao.type = 'button'; nao.addEventListener('click', proxima); ops.appendChild(nao);
      pg.appendChild(ops);
    }
    function proxima() {
      qi++;
      if (qi < T[nivelIdx].perguntas.length) { pergunta(); return; }
      if (acertos >= 4 && nivelIdx < T.length - 1) { nivelIdx++; nivel(); return; }
      resultado(nivelIdx, acertos >= 4 && nivelIdx === T.length - 1);
    }
    function resultado(idx, passouTudo) {
      var nv = T[idx].nivel, todas = todasLicoes(CURSOS[k]), porNivel = Math.round(todas.length / NIVEIS_ORDEM.length);
      var inicio = Math.min(todas.length - 1, idx * porNivel), feitas = p.progresso[k] || 0;
      pg.replaceChildren();
      pg.appendChild(eco('happy', 'Eco'));
      pg.appendChild(enEl('span', 'ui-label', 'Resultado · ' + nome));
      pg.appendChild(enEl('h2', 'h', passouTudo ? 'Você foi muito bem até o C1!' : 'Sugestão: começar no ' + nv));
      pg.appendChild(enEl('p', 'lead', passouTudo ? 'Comece pelo C1 para aprofundar. Os níveis anteriores continuam abertos para revisar quando quiser.' :
        (idx === 0 ? 'O melhor é começar do início da trilha: o A1 vai construir a base com calma.' : 'Você mostrou base nos níveis anteriores. Começar no ' + nv + ' evita repetir o que já sabe; as unidades anteriores continuam disponíveis para revisar.')));
      if (idx > 0 && inicio > feitas) {
        var ok = enEl('button', 'ui-btn ui-btn--primary ui-btn--block', 'Começar no ' + nv); ok.type = 'button';
        ok.addEventListener('click', function () {
          if (ok.dataset.confirma !== '1') { ok.dataset.confirma = '1'; ok.textContent = 'Confirmar: marcar o ' + NIVEIS_ORDEM.slice(0, idx).join(', ') + ' como vistos'; return; }
          p.progresso[k] = inicio; salvar(); toast('Pronto! Sua trilha agora começa no ' + nv + '.'); ir('trilha');
        });
        pg.appendChild(ok);
      } else if (idx > 0) pg.appendChild(enEl('p', null, 'Sua trilha já está no ' + nv + ' ou mais adiante, então nada muda.'));
      var volta = enEl('button', 'ui-btn ui-btn--secondary ui-btn--block', idx > 0 && inicio > feitas ? 'Manter onde estou' : 'Voltar à trilha'); volta.type = 'button'; volta.addEventListener('click', function () { ir('trilha'); }); pg.appendChild(volta);
    }
    intro();
  };

  /* convite ao teste na trilha, só para quem ainda não fez nenhuma lição do idioma */
  var enTrilha = TELAS.trilha;
  TELAS.trilha = function () {
    enTrilha.apply(this, arguments);
    var p = eu(); if (!p || (p.progresso[p.idioma] || 0) > 0 || !(window.NIVELAMENTO || {})[p.idioma]) return;
    var resume = root.querySelector('.resume-card'); if (!resume) return;
    var c = enEl('section', 'card nivel-convite');
    c.appendChild(enEl('h2', null, 'Já sabe um pouco de ' + CURSOS[p.idioma].nome.toLowerCase() + '?'));
    c.appendChild(enEl('p', null, 'Faça o teste de nivelamento e comece no ponto certo da trilha.'));
    var b = enEl('button', 'ui-btn ui-btn--secondary', 'Fazer o teste'); b.type = 'button'; b.addEventListener('click', function () { ir('nivelamento'); }); c.appendChild(b);
    resume.parentNode.insertBefore(c, resume.nextSibling);
  };

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

  /* ================= Entender antes de praticar =================
     Guia completo (mapa da unidade, diálogo com tradução, todo o vocabulário, exemplos traduzidos),
     explicação antes de "Palavras novas" e de "Gramática", botão "Ver a regra" nos erros de lacuna
     e escrita guiada sem IA. Usa só o conteúdo que cada unidade já tem. */
  function enIndice(id) { var n = Number(String(id || '').split('-u')[1]); return n > 0 ? n - 1 : -1; }
  function enUnidade(id) { var k = String(id || '').slice(0, 2), u = null; if (!CURSOS[k]) return null; CURSOS[k].secoes.forEach(function (s) { s.unidades.forEach(function (x) { if (x.id === id) u = x; }); }); return u; }
  function enExemplos(lista, k) {
    var ul = enEl('ul', 'guia-exemplos');
    lista.forEach(function (e) { var li = enEl('li'), a = enEl('span', 'guia-alvo', e[0]); a.lang = k; li.appendChild(a); if (e[1]) li.appendChild(enEl('span', 'guia-pt', e[1])); ul.appendChild(li); });
    return ul;
  }
  function enBloco(bl, k, aberto) {
    var s = enEl('details', 'card prose guide-section'); s.open = !!aberto;
    s.appendChild(enEl('summary', null, bl.titulo));
    var c = enEl('div', 'guide-content'); c.innerHTML = bl.texto;   /* texto do curso (com negrito), não digitado por ninguém */
    if (bl.exemplos && bl.exemplos.length) c.appendChild(enExemplos(bl.exemplos, k));
    else if (bl.exemplo) { var x = enEl('div', 'ex-box', bl.exemplo); x.lang = k; c.appendChild(x); }
    s.appendChild(c); return s;
  }
  function enOuvirMini(texto, k) {
    var b = enEl('button', 'guia-ouvir'); b.type = 'button'; b.setAttribute('aria-label', 'Ouvir: ' + texto);
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    b.addEventListener('click', function () { IdiomasAudio.stop(); falar(texto, CURSOS[k].voz); });
    return b;
  }
  function enFala(alvo, pt, k, quem) {
    var row = enEl('div', 'guia-fala'), txt = enEl('div', 'guia-fala-txt'); if (quem) txt.appendChild(enEl('b', null, quem));
    var a = enEl('p', 'guia-alvo', alvo); a.lang = k; txt.appendChild(a); if (pt) txt.appendChild(enEl('p', 'guia-pt', pt));
    row.appendChild(txt); row.appendChild(enOuvirMini(alvo, k)); return row;
  }
  var EN_PASSOS = {
    'Palavras novas': 'Você vê as frases novas com tradução e áudio e depois escolhe a versão certa.',
    'Escuta': 'Você ouve falas do diálogo e responde a perguntas sobre elas.',
    'Montar frases': 'Você monta frases do diálogo, palavra por palavra, na ordem certa.',
    'Gramática': 'Você relê as regras e completa lacunas. Se errar, "Ver a regra" traz a explicação de volta.',
    'Revisão da unidade': 'Uma mistura curta de tudo o que apareceu na unidade.'
  };
  /* mapa da unidade: o que vem, em que ordem e quanto tempo leva */
  function enMapa(u, id, k) {
    var p = eu(), feitas = (p && p.progresso[k]) || 0, base = enIndice(id) * u.licoes.length, U = unidadeDe(id) || {};
    var card = enEl('section', 'card guia-mapa');
    card.appendChild(enEl('span', 'ui-label', 'Como esta unidade funciona'));
    card.appendChild(enEl('p', 'guia-mapa-lead', 'Primeiro você entende, depois pratica. A ordem é a mesma em todas as unidades.'));
    var ol = enEl('ol', 'guia-passos');
    function passo(titulo, detalhe, estado, rotulo) { var li = enEl('li', estado ? 'is-' + estado : ''); li.appendChild(enEl('b', null, titulo)); li.appendChild(enEl('span', null, detalhe)); if (rotulo) li.appendChild(enEl('em', null, rotulo)); ol.appendChild(li); }
    passo('Entender', 'Esta página: o diálogo com tradução, as frases-chave, a gramática e a pronúncia. Cerca de 5 minutos de leitura.', 'aqui', 'Você está aqui');
    u.licoes.forEach(function (n, i) {
      var L = LICOES[id + '|' + n], q = L && L.exercicios ? L.exercicios.length : 0, pos = base + i;
      passo((i + 1) + '. ' + n, (EN_PASSOS[n] || '') + (q ? ' ' + q + ' exercícios,' : '') + ' cerca de 4 minutos.', pos < feitas ? 'feito' : pos === feitas ? 'atual' : '', pos < feitas ? 'Feita' : pos === feitas ? 'Próxima lição' : '');
    });
    var nd = (U.dict || []).length, nc = (U.cards || []).length;
    passo('Para ir além', 'Ditado (' + nd + ' frases) e escrita guiada (' + nc + ' frases) funcionam sem internet. Conversa, pronúncia e redação com o Eco pedem internet e entrada com Google.', '', 'Opcional');
    card.appendChild(ol); return card;
  }
  TELAS.guia = function (id) {
    var k = String(id || '').slice(0, 2), c = CURSOS[k], u = enUnidade(id), g = GUIAS[id], p = eu();
    if (!c || !u) { ir('guias'); return; }
    var pg = casca('guias', '', function (bar) { enVoltar(bar, 'guias', 'Voltar para os guias'); bar.appendChild(enEl('h1', null, 'Guia · ' + u.titulo)); });
    var topo = enEl('div'); topo.appendChild(enEl('span', 'ui-label', c.nome + ' · Unidade ' + (enIndice(id) + 1)));
    var h = enEl('h2', 'h', u.objetivo); h.style.marginTop = '6px'; topo.appendChild(h); pg.appendChild(topo);
    videoaula(pg, k, id);
    if (!g) { var vazio = enEl('div', 'card'); vazio.appendChild(enEl('p', 'lead', 'O guia desta unidade ainda não foi escrito.')); pg.appendChild(vazio); return; }
    if (p) { p.guiasVistos = p.guiasVistos || {}; if (!p.guiasVistos[id]) { p.guiasVistos[id] = Date.now(); salvar(); } }
    pg.appendChild(enMapa(u, id, k));
    /* o diálogo inteiro, na ordem, com contexto e tradução */
    if (g.dialogo && g.dialogo.length) {
      var dia = enEl('details', 'card guide-section guia-dialogo'); dia.open = true; dia.appendChild(enEl('summary', null, 'O diálogo da unidade'));
      var dc = enEl('div', 'guide-content'); if (g.contexto) dc.appendChild(enEl('p', 'guia-contexto', g.contexto));
      g.dialogo.forEach(function (l) { dc.appendChild(enFala(l[1], l[2], k, l[0])); });
      dia.appendChild(dc); pg.appendChild(dia);
    }
    /* frases-chave: todo o vocabulário da unidade (a tabela mantém a classe e a ordem usadas pelo botão "Guardar") */
    var voc = enEl('details', 'card guide-section'); voc.open = true; voc.appendChild(enEl('summary', null, 'Frases-chave · ' + g.vocab.length));
    var tabela = enEl('table', 'vocab'), cab = enEl('thead'), linha0 = enEl('tr'), corpo = enEl('tbody');
    [c.nome, 'Português'].forEach(function (t) { var th = enEl('th', null, t); th.scope = 'col'; linha0.appendChild(th); }); cab.appendChild(linha0); tabela.appendChild(cab);
    g.vocab.forEach(function (v) { var tr = enEl('tr'), a = enEl('td'), t = enEl('span', 'guia-alvo', v[0]); t.lang = k; a.appendChild(t); a.appendChild(enOuvirMini(v[0], k)); tr.appendChild(a); tr.appendChild(enEl('td', null, v[1])); corpo.appendChild(tr); });
    tabela.appendChild(corpo); voc.appendChild(tabela); pg.appendChild(voc);
    /* gramática e pronúncia: abertas, com exemplos traduzidos */
    g.blocos.forEach(function (bl) { pg.appendChild(enBloco(bl, k, true)); });
    /* o que fazer agora */
    var feitas = (p && p.progresso[k]) || 0, base = enIndice(id) * u.licoes.length, proxima = feitas - base;
    var acoes = enEl('div', 'guia-acoes');
    var go = enEl('button', 'ui-btn ui-btn--primary ui-btn--block'); go.type = 'button';
    if (proxima >= 0 && proxima < u.licoes.length) { go.textContent = 'Ir para a lição: ' + u.licoes[proxima]; go.addEventListener('click', function () { p.idioma = k; salvar(); abrirLicaoApp(u, u.licoes[proxima], {}); }); }
    else { go.textContent = 'Praticar esta unidade'; go.addEventListener('click', function () { p.idioma = k; salvar(); abrirLicaoApp(u, 'Prática do guia', { refazer: true }); }); }
    acoes.appendChild(go);
    var dit = enEl('button', 'ui-btn ui-btn--secondary ui-btn--block', 'Ditado desta unidade'); dit.type = 'button'; dit.addEventListener('click', function () { p.idioma = k; salvar(); ir('ecoDitado', id); }); acoes.appendChild(dit);
    var esc1 = enEl('button', 'ui-btn ui-btn--secondary ui-btn--block', 'Escrita guiada desta unidade'); esc1.type = 'button'; esc1.addEventListener('click', function () { p.idioma = k; salvar(); ir('escritaGuiada', id); }); acoes.appendChild(esc1);
    var download = studioButton('Baixar áudio desta unidade para usar sem internet', function () {
      var sw = navigator.serviceWorker && navigator.serviceWorker.controller; if (!sw) { toast('Instale ou reabra o aplicativo para baixar o áudio.'); return; }
      download.disabled = true; download.textContent = 'Baixando áudio…';
      var channel = new MessageChannel(), timeout = setTimeout(function () { download.disabled = false; download.textContent = 'Não foi possível baixar. Tentar novamente'; }, 60000);
      channel.port1.onmessage = function (e) { clearTimeout(timeout); download.disabled = false; download.textContent = e.data.ok ? 'Áudio disponível neste aparelho' : 'Não foi possível baixar. Tentar novamente'; };
      sw.postMessage({ type: 'download-unit', unit: k + '|' + enIndice(id) }, [channel.port2]);
    });
    download.classList.add('ui-btn--block'); acoes.appendChild(download);
    pg.appendChild(acoes);
  };

  /* ---------- explicação antes da lição ----------
     "Palavras novas" mostrava a pergunta antes de apresentar a frase; "Gramática" ia direto para as lacunas.
     Agora as duas abrem com o que a lição vai cobrar. Lição em andamento (rascunho) retoma direto. */
  var enAbrirLicao = abrirLicaoApp;
  abrirLicaoApp = function (u, nome, op) {
    var p = eu(), g = u && u.id && GUIAS[u.id];
    if (!p || !g || (nome !== 'Palavras novas' && nome !== 'Gramática') || (op && (op.revisao || op.teste || op.refazer || op.licao))) return enAbrirLicao(u, nome, op);
    if (p.rascunhos && p.rascunhos[p.idioma + ':' + u.id + '-' + nome + ':normal']) return enAbrirLicao(u, nome, op);
    var k = u.id.slice(0, 2), L = LICOES[u.id + '|' + nome];
    folha(function (sh) {
      sh.classList.add('previa-licao');
      sh.appendChild(enEl('span', 'ui-label', 'Antes de praticar · ' + u.titulo));
      if (nome === 'Palavras novas') {
        sh.appendChild(enEl('h2', null, 'Conheça as frases desta lição'));
        sh.appendChild(enEl('p', null, 'Leia e ouça com calma. Na lição, você vê a frase em português e escolhe a versão em ' + CURSOS[k].nome.toLowerCase() + '.'));
        var lista = enEl('div', 'previa-lista');
        ((L && L.exercicios) || []).forEach(function (ex) { if (ex.frase) lista.appendChild(enFala(ex.frase, ex.ocultar || '', k)); });
        sh.appendChild(lista);
      } else {
        sh.appendChild(enEl('h2', null, 'Releia as regras desta unidade'));
        sh.appendChild(enEl('p', null, 'A lição pede para completar frases usando estas regras. Se errar uma lacuna, o botão "Ver a regra" traz a explicação de volta.'));
        g.blocos.filter(function (b) { return !b.pron; }).forEach(function (bl, i) { sh.appendChild(enBloco(bl, k, i === 0)); });
      }
      var ac = enEl('div', 'guia-acoes');
      if (nome === 'Gramática') {
        /* escolher entre três opções ou digitar a palavra; o app lembra a última escolha */
        var digitar = window.lacunaDigitada();
        var comecar = function (modo) { p.preferencias = p.preferencias || {}; if (p.preferencias.lacuna !== modo) { p.preferencias.lacuna = modo; salvar(); } enAbrirLicao(u, nome, op); };
        sh.appendChild(enEl('p', 'guia-pt', 'Escolhendo: três opções por lacuna. Digitando: você escreve a palavra que falta, e acentos contam. O app lembra a sua escolha.'));
        var b1 = studioButton('Praticar escolhendo a resposta', function () { comecar('escolher'); }, digitar ? 'secondary' : 'primary'); b1.classList.add('ui-btn--block');
        var b2 = studioButton('Praticar digitando a resposta', function () { comecar('digitar'); }, digitar ? 'primary' : 'secondary'); b2.classList.add('ui-btn--block');
        ac.appendChild(digitar ? b2 : b1); ac.appendChild(digitar ? b1 : b2);
      } else {
        var ja = studioButton('Praticar agora', function () { enAbrirLicao(u, nome, op); }, 'primary'); ja.classList.add('ui-btn--block'); ac.appendChild(ja);
      }
      var guia = studioButton('Ver o guia completo da unidade', function () { fecharFolha(); ir('guia', u.id); }); guia.classList.add('ui-btn--block'); ac.appendChild(guia);
      sh.appendChild(ac);
    });
  };

  /* a pessoa prefere digitar a palavra da lacuna? (guardado nas preferências do perfil) */
  window.lacunaDigitada = function () { var p = eu(); return !!(p && p.preferencias && p.preferencias.lacuna === 'digitar'); };

  /* ---------- "Ver a regra" quando a pessoa erra uma lacuna ---------- */
  window.botaoRegra = function (ex) {
    var id = ex && ex._guia, g = id && GUIAS[id], u = id && enUnidade(id);
    var bt = enEl('button', 'ia-porque', 'Ver a regra'); bt.type = 'button';
    if (!g) { bt.hidden = true; return bt; }
    bt.addEventListener('click', function () {
      var k = id.slice(0, 2), regras = g.blocos.filter(function (b) { return !b.pron; }), alvo = String(ex._resp || '').toLowerCase(), melhor = 0, pontos = 0;
      /* não há ligação escrita entre lacuna e regra: abre primeiro a seção que mais cita a resposta certa */
      regras.forEach(function (b, i) {
        var texto = (b.titulo + ' ' + b.texto + ' ' + (b.exemplos || []).map(function (e) { return e[0]; }).join(' ')).toLowerCase();
        var n = alvo.length > 1 ? texto.split(alvo).length - 1 : 0; if (n > pontos) { pontos = n; melhor = i; }
      });
      folha(function (sh) {
        sh.classList.add('previa-licao');
        sh.appendChild(enEl('span', 'ui-label', 'Gramática · ' + (u ? u.titulo : 'unidade')));
        sh.appendChild(enEl('h2', null, 'As regras desta unidade'));
        sh.appendChild(enEl('p', null, 'A resposta certa era "' + (ex._resp || '') + '". A primeira regra aberta é a que mais fala dela; as outras ficam logo abaixo.'));
        [regras[melhor]].concat(regras.filter(function (b, i) { return i !== melhor; })).forEach(function (bl, i) { if (bl) sh.appendChild(enBloco(bl, k, i === 0)); });
        var volta = studioButton('Voltar para a lição', function () { fecharFolha(); }, 'primary'); volta.classList.add('ui-btn--block'); sh.appendChild(volta);
      });
    });
    return bt;
  };

  /* ---------- escrita guiada: do português para o idioma, sem IA ---------- */
  TELAS.escritaGuiada = function (unitId) {
    var pg = studioPage('Escrita guiada'), units = studioUnits(), unit = units.find(function (x) { return x.id === unitId; }) || studioCurrent();
    var lang = eu().idioma, voz = CURSOS[lang].voz, nome = CURSOS[lang].nome.toLowerCase(), U = unidadeDe(unit.id), d = studioData(); d.esc = d.esc || {};
    studioLead(pg, 'Escrita guiada · ' + unit.level, 'Leia em português e escreva em ' + nome + '.', 'Sem pressa e sem internet. Escreva a frase, confira e compare com a resposta. Acentos e apóstrofos contam; maiúsculas e pontuação, não.');
    var lab = enEl('label', 'studio-field', 'Unidade'), sel = document.createElement('select');
    units.filter(function (x) { return x.done || x.current || x.id === unit.id; }).forEach(function (x) { var op = document.createElement('option'); op.value = x.id; op.textContent = x.title; sel.appendChild(op); });
    sel.value = unit.id; sel.onchange = function () { ir('escritaGuiada', sel.value); }; lab.appendChild(sel); pg.appendChild(lab);
    var itens = ((U && U.cards) || []).filter(function (c) { return c && c[0] && c[1]; });
    if (!itens.length) { var v = enEl('div', 'card'); v.appendChild(enEl('p', null, 'Esta unidade não tem frases para escrever.')); pg.appendChild(v); return; }
    itens.forEach(function (it, i) {
      var chave = unit.id + '|' + i, card = enEl('section', 'card pron-card');
      card.appendChild(enEl('span', 'ui-label', 'Frase ' + (i + 1) + ' de ' + itens.length + (d.esc[chave] ? ' · ✓ acertada' : '')));
      card.appendChild(enEl('p', 'pron-frase', it[0]));
      var ta = document.createElement('textarea'); ta.rows = 2; ta.lang = lang; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.setAttribute('autocorrect', 'off'); ta.placeholder = 'Escreva em ' + nome + '…'; ta.className = 'dit-input';
      var rot = enEl('label', 'studio-field', 'Sua frase · ' + (i + 1)); rot.appendChild(ta); card.appendChild(rot);
      var res = enEl('div', 'pron-res'); res.setAttribute('role', 'status');
      card.appendChild(studioButton('Conferir', function () {
        var dado = ta.value.trim(); if (!dado) { ta.focus(); return; }
        var certo = it[1], nd = normDit(dado), exato = normDit(certo) === nd, quase = !exato && semAcento(normDit(certo)) === semAcento(nd);
        var esp = certo.split(' ').filter(String), ok = alinhar(esp, dado);
        res.textContent = '';
        var nota = enEl('div', 'pron-nota'); nota.appendChild(enEl('strong', null, exato ? 'Perfeito!' : quase ? 'Quase!' : 'Vamos ver'));
        nota.appendChild(enEl('span', null, exato ? 'Você escreveu certinho.' : quase ? 'Só faltou acento ou apóstrofo.' : 'Compare com a frase esperada. Em verde, as palavras que você acertou.'));
        res.appendChild(nota);
        if (!exato) { var linha = enEl('p', 'pron-frase'); linha.lang = lang; esp.forEach(function (w, j) { if (j) linha.appendChild(document.createTextNode(' ')); linha.appendChild(enEl('span', ok[j] ? 'pron-ok' : 'pron-erro', w)); }); res.appendChild(linha);
          res.appendChild(enEl('p', 'pron-dica', 'Outras formas corretas podem existir; esta é a frase ensinada na unidade.')); }
        res.appendChild(studioButton('Ouvir a resposta', function () { AUD.stop(); if (!AUD.say(certo, voz, null, S.cfg.voz || 0.9) && 'speechSynthesis' in window) { var f = new SpeechSynthesisUtterance(certo); f.lang = voz; f.rate = S.cfg.voz || 0.9; speechSynthesis.speak(f); } }));
        if (exato) { if (!d.esc[chave]) { d.esc[chave] = 1; salvar(); } tocar('acerto'); }
        else { tocar('erro'); registrarErro({ fonte: 'escrita', lang: lang, unidade: unit.title, frase: it[0], correta: certo, dada: dado, nota: quase ? 'Atenção aos acentos e apóstrofos.' : '' }); }
      }));
      card.appendChild(res); pg.appendChild(card);
    });
  };

  /* ---------- trilha: "Entender a unidade" aparece antes das lições ---------- */
  var enTrilhaEntender = TELAS.trilha;
  TELAS.trilha = function () {
    enTrilhaEntender.apply(this, arguments);
    var p = eu(); if (!p) return;
    var k = p.idioma, unidades = []; CURSOS[k].secoes.forEach(function (s) { s.unidades.forEach(function (u) { unidades.push(u); }); });
    var vistos = p.guiasVistos || {};
    root.querySelectorAll('.linha').forEach(function (sec, i) {
      var u = unidades[i], alvo = sec.querySelector('.unit-toggle'); if (!u || !alvo || !GUIAS[u.id]) return;
      var b = enEl('button', 'video-linha entender-linha' + (vistos[u.id] ? ' vista' : '')); b.type = 'button'; b.setAttribute('aria-label', 'Entender a unidade ' + u.titulo + ': diálogo, regras e vocabulário');
      var t = enEl('span', 't'); t.appendChild(enEl('b', null, 'Entender a unidade')); t.appendChild(enEl('small', null, vistos[u.id] ? 'Diálogo, regras e vocabulário · já aberto' : 'Diálogo, regras e vocabulário · leia antes das lições')); b.appendChild(t);
      var st = enEl('span', 'st'); st.innerHTML = svg('book'); b.appendChild(st);
      b.addEventListener('click', function () { ir('guia', u.id); });
      alvo.parentNode.insertBefore(b, alvo);
    });
  };

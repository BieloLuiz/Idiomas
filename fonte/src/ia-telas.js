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

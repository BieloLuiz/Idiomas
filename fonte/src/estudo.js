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

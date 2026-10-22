  /* ================= Extras (src/extras.js): painel do administrador, privacidade do áudio, conversa sem botão,
     modo a dois e a Eco nas lições. Mesmo escopo de ia-telas.js e estudo.js. ================= */
  function exEl(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function exUSD(v) { return 'US$ ' + (Number(v) || 0).toFixed(Number(v) < 0.1 ? 4 : 2).replace('.', ','); }

  /* ---------- aviso de privacidade antes da primeira gravação ---------- */
  function avisoAudio() {
    return new Promise(function (ok, nao) {
      try { if (localStorage.getItem('idiomas-aviso-audio') === '1') { ok(); return; } } catch (e) { ok(); return; }
      folha(function (sh) {
        sh.innerHTML = '<span class="ui-label">Antes de gravar</span><h2>O que acontece com a sua voz</h2>' +
          '<p>A gravação vai para o servidor do app (Google Apps Script) e é transcrita pela Groq (Whisper) ou, se ela falhar, pelo Google Gemini. ' +
          'O texto transcrito pode ir para a IA que dá a dica ou responde (OpenAI, Groq, Gemini ou GitHub Models).</p>' +
          '<p>O áudio não fica guardado: é descartado depois da transcrição. No app ficam só o texto e o resultado.</p>' +
          '<p class="muted">O responsável pelo app ativou o compartilhamento de dados com a OpenAI: os textos enviados a ela podem ser usados para melhorar os modelos dela.</p>';
        sh.appendChild(studioButton('Entendi, pode gravar', function () { try { localStorage.setItem('idiomas-aviso-audio', '1'); } catch (e) {} fecharFolha(); ok(); }, 'primary'));
        sh.appendChild(studioButton('Agora não', function () { fecharFolha(); nao(new Error('cancelado')); }));
      });
    });
  }
  var _gravadorOriginal = gravador;
  gravador = function () { var g = _gravadorOriginal(), ini = g.iniciar; g.iniciar = function () { return avisoAudio().then(function () { return ini.apply(g, arguments); }); }; return g; };

  /* ---------- painel do administrador ---------- */
  var _configEx = TELAS.config;
  TELAS.config = function () {
    _configEx.apply(this, arguments);
    if (!(window.AUTH && AUTH.enabled && AUTH.ready())) return;
    var pg = $('.page'); if (!pg) return;
    AUTH.post({ acao: 'admin', op: 'eu' }).then(function (r) {
      if (!r.admin || !pg.isConnected) return;
      var c = exEl('section', 'card'); c.innerHTML = '<span class="ui-label">Administrador</span><h2>Painel da IA</h2><p>Consumo do mês, provedores e cotas. Só a sua conta vê.</p>';
      c.appendChild(studioButton('Abrir painel', function () { ir('admin'); }, 'primary')); pg.insertBefore(c, pg.children[1] || null);
    }).catch(function () {});
  };
  TELAS.admin = function () {
    var pg = studioPage('Painel da IA', 'config'), st = exEl('p', 'pron-status', 'Carregando…'); st.setAttribute('role', 'status'); pg.appendChild(st);
    AUTH.post({ acao: 'admin', op: 'estado' }).then(function (r) { st.remove(); montarAdmin(pg, r); }).catch(function (e) { st.textContent = /nao_admin/.test(e.message) ? 'Só a conta administradora abre este painel.' : 'Não consegui carregar agora.'; });
  };
  function montarAdmin(pg, r) {
    var o = r.orcamento, cfg = r.config;
    studioLead(pg, 'Mês ' + o.mes.split('-').reverse().join('/'), exUSD(o.gasto) + ' de ' + exUSD(o.operacional), 'Valores estimados pelo app a partir dos tokens e segundos informados. A cobrança real está nas páginas de faturamento da OpenAI e da Groq.');
    var res = exEl('section', 'card');
    res.innerHTML = '<div class="est-barra"><span>Usado</span><div class="ui-progress" role="img" aria-label="' + o.usoPct + '% do orçamento"><div class="ui-progress__fill" style="width:' + Math.min(100, o.usoPct) + '%"></div></div><b>' + String(o.usoPct).replace('.', ',') + '%</b></div>' +
      '<p>Reservado agora: ' + exUSD(o.reservado) + ' · Reserva travada: ' + exUSD(o.reserva) + ' · Total: ' + exUSD(o.total) + '</p>' +
      '<p>Alertas do mês: ' + (o.alertas.length ? o.alertas.map(function (a) { return a + '%'; }).join(', ') : 'nenhum') + ' · Pedidos bloqueados: ' + o.bloqueios + '</p>';
    var gh = r.gratisHoje || {}; Object.keys(gh).forEach(function (g) { res.appendChild(exEl('p', 'muted', 'OpenAI grátis hoje (' + g + '): ' + Math.round(gh[g].usado / 1000) + ' mil de ' + Math.round(gh[g].limite / 1000) + ' mil tokens')); });
    pg.appendChild(res);
    var ps = exEl('section', 'card'); ps.appendChild(exEl('h2', null, 'Por serviço'));
    var chaves = Object.keys(o.porServico); if (!chaves.length) ps.appendChild(exEl('p', 'muted', 'Nada pago neste mês.'));
    chaves.forEach(function (k) { ps.appendChild(exEl('p', null, k + ': ' + exUSD(o.porServico[k]))); }); pg.appendChild(ps);
    var pa = exEl('section', 'card'); pa.appendChild(exEl('h2', null, 'Por aluno'));
    Object.keys(o.alunos).forEach(function (sub) {
      var a = o.alunos[sub], b = exEl('div', 'admin-aluno');
      b.appendChild(exEl('strong', null, a.email || sub));
      b.appendChild(exEl('p', null, exUSD(a.gasto) + ' · ' + a.texto + ' interações · ' + Math.round(a.audioSeg / 60) + ' min de áudio · ' + Math.round(a.vozSeg / 60) + ' min de voz premium · ' + a.liveMin + ' min ao vivo (reservados)'));
      var dias = Object.keys(a.dias || {}).sort().slice(-7);
      if (dias.length) b.appendChild(exEl('p', 'muted', 'Últimos dias: ' + dias.map(function (d) { var x = a.dias[d]; return d.slice(8) + '/' + d.slice(5, 7) + ' ' + x.texto + ' int.'; }).join(' · ')));
      pa.appendChild(b);
    });
    if (!Object.keys(o.alunos).length) pa.appendChild(exEl('p', 'muted', 'Sem uso neste mês.'));
    pg.appendChild(pa);
    /* configuração */
    var f = exEl('section', 'card studio-stack'); f.appendChild(exEl('h2', null, 'Configuração'));
    var lp = exEl('label', 'studio-field', 'Provedor principal'), sp = document.createElement('select');
    cfg.servicos.forEach(function (s) { var op = document.createElement('option'); op.value = s.id; op.textContent = s.nome + (s.ativo ? '' : ' — sem chave'); sp.appendChild(op); }); sp.value = cfg.principal; lp.appendChild(sp); f.appendChild(lp);
    f.appendChild(exEl('p', 'muted', 'Reservas (usadas em ordem, se o principal falhar ou o orçamento acabar):'));
    var marcas = {};
    cfg.servicos.forEach(function (s) { var l = exEl('label', 'admin-check'), cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = cfg.fallback.indexOf(s.id) >= 0; marcas[s.id] = cb; l.appendChild(cb); l.appendChild(document.createTextNode(' ' + s.nome + (s.pago ? ' · pago' : ''))); f.appendChild(l); });
    var lm = exEl('label', 'admin-check'), modo = document.createElement('input'); modo.type = 'checkbox'; modo.checked = cfg.modo === 'bloquear'; lm.appendChild(modo); lm.appendChild(document.createTextNode(' Bloquear quando um aluno passar da cota (desligado: só anota)')); f.appendChild(lm);
    var lr = exEl('label', 'admin-check'), reserva = document.createElement('input'); reserva.type = 'checkbox'; reserva.checked = !!cfg.usarReserva; lr.appendChild(reserva); lr.appendChild(document.createTextNode(' Liberar a reserva de US$ 1 (teto passa a US$ 5)')); f.appendChild(lr);
    var lw = exEl('label', 'admin-check'), wg = document.createElement('input'); wg.type = 'checkbox'; wg.checked = !!cfg.whisperGratis; lw.appendChild(wg); lw.appendChild(document.createTextNode(' A conta da Groq é do plano gratuito (transcrição não conta gasto)')); f.appendChild(lw);
    var NOMES = { textoDia: 'Interações de texto por dia', textoMes: 'Interações de texto por mês', audioMinDia: 'Minutos de áudio por dia', audioMinMes: 'Minutos de áudio por mês', vozMinDia: 'Voz premium (min) por dia', vozMinMes: 'Voz premium (min) por mês', liveMinDia: 'Ao vivo (min) por dia', liveMinMes: 'Ao vivo (min) por mês' }, campos = {};
    f.appendChild(exEl('p', 'muted', 'Cotas por aluno:'));
    Object.keys(NOMES).forEach(function (k) { var l = exEl('label', 'studio-field', NOMES[k]), i = document.createElement('input'); i.type = 'number'; i.min = 0; i.inputMode = 'numeric'; i.value = cfg.cotas[k]; campos[k] = i; l.appendChild(i); f.appendChild(l); });
    var st = exEl('p', 'pron-status'); st.setAttribute('role', 'status');
    var salvarB = studioButton('Salvar configuração', function () {
      var cotas = {}; Object.keys(campos).forEach(function (k) { cotas[k] = Number(campos[k].value); });
      var fb = cfg.servicos.map(function (s) { return s.id; }).filter(function (id) { return marcas[id].checked && id !== sp.value; });
      salvarB.disabled = true; st.textContent = 'Salvando…';
      AUTH.post({ acao: 'admin', op: 'config', config: { principal: sp.value, fallback: fb, modo: modo.checked ? 'bloquear' : 'registrar', cotas: cotas, usarReserva: reserva.checked, whisperGratis: wg.checked } })
        .then(function () { toast('Configuração salva.'); ir('admin'); }).catch(function () { salvarB.disabled = false; st.textContent = 'Não consegui salvar. Confira os valores.'; });
    }, 'primary');
    f.appendChild(salvarB); f.appendChild(st); pg.appendChild(f);
  }

  /* ---------- modo a dois ---------- */
  function outroPerfil() { var p = eu(); return (S.perfis || []).filter(function (x) { return x.id !== p.id; })[0] || null; }
  function semanaAtual(p) { var hoje = new Date(), seg = new Date(hoje); seg.setDate(hoje.getDate() - (hoje.getDay() + 6) % 7); return p.semanaDe === ProfileCore.day(seg); }
  function minutosSemana(p) { return semanaAtual(p) ? (p.semana || []).reduce(function (a, b) { return a + (Number(b) || 0); }, 0) : 0; }
  function estudouHoje(p) { return p.ultimoDia === ProfileCore.day(new Date()) && !!p.hojeFeito; }
  function unidadeAtual(p) { var k = p.idioma, ui = Math.min(59, Math.floor((p.progresso[k] || 0) / 5)), u = COURSE[k].units[ui]; return { k: k, ui: ui, u: u, nivel: ['A1', 'A2', 'B1', 'B2', 'C1'][Math.floor(ui / 12)] }; }
  function cartaoDupla() {
    var eu_ = eu(), outro = outroPerfil(); if (!outro) return null;
    var meta = ((eu_.preferencias && eu_.preferencias.meta) || S.cfg.meta || 15) + ((outro.preferencias && outro.preferencias.meta) || 15), alvo = meta * 5;
    var feito = minutosSemana(eu_) + minutosSemana(outro), pct = Math.min(100, Math.round(100 * feito / alvo)), ua = unidadeAtual(outro);
    var c = exEl('section', 'card ux-small-card est-dupla'), nomeO = String(outro.nome || '').split(' ')[0], nomeE = String(eu_.nome || '').split(' ')[0];
    var ambos = estudouHoje(eu_) && estudouHoje(outro);
    c.innerHTML = '<span class="ui-label">Vocês dois · desafio da semana</span><h2>' + (ambos && window.Eco ? esc(Eco.frase('dupla', { nomes: [nomeE, nomeO] }).frase) : 'Juntos, ' + alvo + ' minutos nesta semana') + '</h2>' +
      '<div class="est-barra"><span>' + feito + ' min</span><div class="ui-progress" role="img" aria-label="' + pct + '% do desafio"><div class="ui-progress__fill" style="width:' + pct + '%"></div></div><b>' + pct + '%</b></div>' +
      '<p>' + esc(nomeO) + (estudouHoje(outro) ? ' já estudou hoje' : ' ainda não estudou hoje') + ' · ' + esc(CURSOS[ua.k].nome) + ', unidade ' + (ua.ui + 1) + ' (' + ua.nivel + '): ' + esc(ua.u.title) + '</p>';
    c.appendChild(uxBtn('Diálogo em dupla', function () { ir('dupla'); }));
    return c;
  }
  function extrasInstalarHoje() {
    var _hojeX = TELAS.hoje;
    TELAS.hoje = function () { _hojeX.apply(this, arguments); var pg = $('.page'); if (!pg || !eu()) return; var c = cartaoDupla(); if (!c) return; var ref = $('.est-dia', pg); if (!ref) { pg.appendChild(c); return; }
      /* tela larga (iPad, computador): revisão do dia e desafio dos dois lado a lado */
      var par = exEl('div', 'est-par'); pg.insertBefore(par, ref); par.appendChild(ref); par.appendChild(c); };
  }
  /* diálogo em dupla, no mesmo aparelho: cada um faz um personagem do diálogo da unidade */
  TELAS.dupla = function () {
    var eu_ = eu(), outro = outroPerfil(), pg = studioPage('Diálogo em dupla');
    var ua = unidadeAtual(eu_), lines = (ua.u.lines || []).filter(function (l) { return l[1]; }), conta = {};
    lines.forEach(function (l) { conta[l[0]] = (conta[l[0]] || 0) + 1; });
    var papeis = Object.keys(conta).sort(function (a, b) { return conta[b] - conta[a]; }).slice(0, 2);
    var nomes = [String(eu_.nome || 'Você').split(' ')[0], outro ? String(outro.nome).split(' ')[0] : 'Outra pessoa'];
    studioLead(pg, CURSOS[ua.k].nome + ' · unidade ' + (ua.ui + 1), ua.u.title, 'Passem o celular: cada um lê as falas do seu personagem. Ouça antes, se quiser, e grave. O Eco mostra quais palavras ele reconheceu.');
    if (papeis.length < 2) { pg.appendChild(exEl('p', null, 'Esta unidade tem só um personagem. Tente a próxima.')); return; }
    var escolha = exEl('section', 'card studio-stack'); escolha.appendChild(exEl('h2', null, 'Quem faz cada personagem?'));
    var troca = false, info = exEl('p');
    function mostrar() { info.textContent = nomes[0] + ' faz ' + papeis[troca ? 1 : 0] + ' e ' + nomes[1] + ' faz ' + papeis[troca ? 0 : 1] + '.'; }
    mostrar(); escolha.appendChild(info); escolha.appendChild(studioButton('Trocar personagens', function () { troca = !troca; mostrar(); }));
    escolha.appendChild(studioButton('Começar', function () { escolha.remove(); rodar(); }, 'primary')); pg.appendChild(escolha);
    function rodar() {
      var quem = {}; quem[papeis[troca ? 1 : 0]] = 0; quem[papeis[troca ? 0 : 1]] = 1;
      var falas = lines.filter(function (l) { return l[0] in quem; }), notas = [[], []], i = 0, voz = CURSOS[ua.k].voz;
      var card = exEl('section', 'card pron-card'); pg.appendChild(card);
      function passo() {
        card.replaceChildren();
        if (i >= falas.length) { fim(); return; }
        var l = falas[i], n = quem[l[0]];
        card.appendChild(exEl('span', 'ui-label', 'Fala ' + (i + 1) + ' de ' + falas.length + ' · vez de ' + nomes[n] + ' (' + l[0] + ')'));
        var t = exEl('p', 'pron-frase', l[1]); t.lang = ua.k; card.appendChild(t);
        var det = document.createElement('details'); det.appendChild(exEl('summary', null, 'Ver tradução')); det.appendChild(exEl('p', null, l[2] || '')); card.appendChild(det);
        var st = exEl('p', 'pron-status'); st.setAttribute('role', 'status');
        var acoes = exEl('div', 'pron-acoes');
        acoes.appendChild(studioButton('Ouvir', function () { AUD.stop(); AUD.fn(l[1], voz, ua.ui)(null, S.cfg.voz || 0.9); }));
        var g = null, grav = studioButton(IAon() ? 'Gravar' : 'Já li', function () {
          if (!IAon()) { i++; passo(); return; }
          if (g) { var gg = g; g = null; grav.disabled = true; grav.textContent = 'Gravar'; st.textContent = 'O Eco está ouvindo…';
            gg.parar().then(function (blob) { if (!blob || blob.size < 1500) throw new Error('curto'); return blobB64(blob).then(function (b) { return IA.pedir('pronuncia', { idioma: ua.k, frase: l[1], audio: b, mime: blob.type }); }); })
              .then(function (r) { var pal = l[1].split(/\s+/), ok = alinhar(pal, r.ouvido || ''), tot = pal.filter(function (w) { return normPal(w).length; }).length || 1, k = ok.filter(function (x, j) { return x && normPal(pal[j]).length; }).length, pct = Math.round(100 * k / tot);
                notas[n].push(pct); st.textContent = pct + '% das palavras reconhecidas.'; grav.disabled = false; grav.textContent = 'Próxima fala'; grav.onclick = function () { i++; passo(); }; })
              .catch(function (e) { grav.disabled = false; st.textContent = /curto/.test(String(e && e.message)) ? 'Ficou curto. Grave a fala inteira.' : IA.erroTexto(e); });
            return; }
          AUD.stop(); g = gravador(); g.iniciar().then(function () { grav.textContent = 'Parar'; st.textContent = 'Gravando… ' + nomes[n] + ', pode falar.'; }).catch(function () { g = null; st.textContent = 'Não consegui usar o microfone.'; });
        }, 'primary');
        studioCleanup(function () { if (g) g.cancelar(); g = null; });
        acoes.appendChild(grav); acoes.appendChild(studioButton('Pular', function () { if (g) { g.cancelar(); g = null; } i++; passo(); }));
        card.appendChild(acoes); card.appendChild(st);
      }
      function fim() {
        var media = notas.map(function (v) { return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length) : null; });
        card.appendChild(exEl('h2', null, 'Diálogo completo!'));
        [0, 1].forEach(function (n) { card.appendChild(exEl('p', null, nomes[n] + ': ' + (media[n] == null ? 'leitura sem gravação' : media[n] + '% das palavras reconhecidas em média'))); });
        card.appendChild(exEl('p', 'muted', 'O percentual indica palavras que o reconhecimento entendeu; não é nota de pronúncia.'));
        uxRecord({ kind: 'dupla', title: 'Diálogo em dupla · ' + ua.u.title, detail: nomes.join(' e ') });
        card.appendChild(studioButton('Fazer de novo', function () { ir('dupla'); }, 'primary'));
      }
      passo();
    }
  };

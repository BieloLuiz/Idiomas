
/* ===================================================================== */
/*  LIÇÃO (a mesma da licao-idiomas.html, transformada em função)        */
/* ===================================================================== */
var IdiomasAudio = (function () {
  var cleanup = null;
  function stop() { if (cleanup) { var fn=cleanup; cleanup=null; fn(); } }
  function player(text, lang, source, rate, onRate) {
    var el=document.createElement('div'); el.className='audio-player';
    el.innerHTML='<button type="button" class="audio-play">Ouvir</button><button type="button" class="audio-repeat" aria-label="Repetir áudio">↻</button><label>Velocidade <select aria-label="Velocidade do áudio"><option value="0.7">0,7×</option><option value="0.9">0,9×</option><option value="1.05">1,05×</option></select></label><span class="audio-status" role="status">Pronto para ouvir</span>';
    if(!source&&window.AUD)source=AUD.fn(text,lang);
    var play=el.querySelector('.audio-play'), status=el.querySelector('.audio-status'), speed=el.querySelector('select'), media=null, utter=null, state='idle', serial=0;
    speed.value=String(rate || 0.9);
    function show(v,msg) { state=v; play.textContent=v==='playing'?'Pausar':v==='paused'?'Retomar':'Ouvir'; play.setAttribute('aria-label',play.textContent+' áudio'); status.textContent=msg || (v==='playing'?'Ouvindo':v==='paused'?'Pausado':'Pronto para ouvir'); }
    function cancel() { serial++; if(typeof source==='function'&&window.AUD)AUD.stop(); if(media){media.pause();media.currentTime=0;} if(utter && 'speechSynthesis' in window) speechSynthesis.cancel(); utter=null; show('idle'); }
    function start() {
      stop(); cleanup=cancel; var token=++serial;
      if(typeof source==='function') { source(function(error){if(token===serial)show('idle',error?'Não foi possível ouvir. Confira a conexão ou baixe a unidade.':'Áudio concluído');}, +speed.value); show('playing'); }
      else if(source) {
        media=media || new Audio(source); media.currentTime=0; media.playbackRate=+speed.value;
        media.onended=function(){if(token===serial)show('idle','Áudio concluído');};
        media.onerror=function(){if(token===serial)show('idle','Não foi possível carregar o áudio. Tente novamente.');};
        media.play().then(function(){if(token===serial)show('playing');else media.pause();}).catch(function(){if(token===serial)show('idle','Não foi possível reproduzir. Tente novamente.');});
      } else if ('speechSynthesis' in window) {
        utter=new SpeechSynthesisUtterance(text); utter.lang=lang; utter.rate=+speed.value;
        utter.onend=function(){if(token===serial)show('idle','Áudio concluído');};
        utter.onerror=function(){if(token===serial)show('idle','Voz indisponível neste navegador.');};
        speechSynthesis.speak(utter); show('playing');
      } else show('idle','Áudio indisponível neste navegador.');
    }
    play.onclick=function(){
      if(state==='playing'&&typeof source==='function'){cancel();}
      else if(state==='playing'){if(media)media.pause();else speechSynthesis.pause();show('paused');}
      else if(state==='paused'){if(media)media.play().then(function(){show('playing');}).catch(function(){show('idle','Não foi possível retomar.');});else{speechSynthesis.resume();show('playing');}}
      else start();
    };
    el.querySelector('.audio-repeat').onclick=start;
    speed.onchange=function(){if(onRate)onRate(+speed.value); if(state==='playing'||state==='paused')start();};
    return el;
  }
  return {player:player,stop:stop};
})();
window.addEventListener('pagehide', function(){IdiomasAudio.stop();});

function abrirLicao(LICAO, PERFIL, ao) {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var tela = $('#tela'), acao = $('#acao'), bannerBox = $('#banner'), anuncio = $('#anuncio');
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';
  var ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* (o tema agora é controlado nas Configurações do app) */
  /* ---------- Eco ---------- */
  function novoEco(estado, rotulo) {
    var el = $('#tplEco').content.firstElementChild.cloneNode(true);
    el.dataset.state = estado || 'neutral';
    el.setAttribute('aria-label', rotulo || 'Lumi');
    return el;
  }
  function pular(eco) { if (rm || !eco) return; eco.classList.remove('is-jump'); void eco.offsetWidth; eco.classList.add('is-jump'); setTimeout(function () { eco.classList.remove('is-jump'); }, 750); }

  /* ---------- estado da lição ---------- */
  var fila = LICAO.exercicios.map(function (e, i) { return { ex: e, idx: i, revisao: false }; });
  var total = LICAO.exercicios.length, feitos = 0, acertos = 0, tentativas = 0, inicio = Date.now();
  var atual = null, eco = null, seguidas = 0, melhorSeq = 0;
  var saved = ao && ao.rascunho;
  if (saved && Array.isArray(saved.fila) && saved.fila.every(function (x) { return Number.isInteger(x.idx) && x.idx >= 0 && x.idx < total; })) {
    fila = saved.fila.map(function (x) { return {ex: LICAO.exercicios[x.idx], idx:x.idx, revisao:!!x.revisao}; });
    feitos = saved.feitos || 0; acertos = saved.acertos || 0; tentativas = saved.tentativas || 0;
    seguidas = saved.seguidas || 0; melhorSeq = saved.melhorSeq || 0; inicio = Date.now() - (saved.tempo || 0);
  }
  var hiddenAt=0;function lessonVisibility(){if(!tela.isConnected){document.removeEventListener('visibilitychange',lessonVisibility);return;}if(document.hidden){hiddenAt=Date.now();checkpoint(true);}else if(hiddenAt){inicio+=Date.now()-hiddenAt;hiddenAt=0;}}
  document.addEventListener('visibilitychange',lessonVisibility);
  function checkpoint(incluirAtual) {
    if (!ao || !ao.salvarRascunho) return;
    var pendentes = incluirAtual && atual ? [atual].concat(fila) : fila;
    ao.salvarRascunho({fila:pendentes.map(function (x) { return {idx:x.idx,revisao:x.revisao}; }), feitos:feitos, acertos:acertos, tentativas:tentativas, seguidas:seguidas, melhorSeq:melhorSeq, tempo:Date.now()-inicio});
  }
  function combo() {
    var c = $('#combo'), top = $('.top');
    c.hidden = seguidas < 2; c.textContent = seguidas + ' seguidas';
    top.classList.toggle('is-combo', seguidas >= 3);
    if (seguidas >= 2 && !rm) { c.classList.remove('combo-pop'); void c.offsetWidth; c.classList.add('combo-pop'); }
  }
  $('#seqTopo span').textContent = PERFIL.sequencia;
  $('#seqTopo').setAttribute('aria-label', PERFIL.sequencia + ' dias seguidos');

  function progresso() {
    var b = $('#barra'); b.setAttribute('aria-valuemax', total); b.setAttribute('aria-valuenow', feitos);
    b.firstElementChild.style.width = (feitos / total * 100) + '%';
  }

  /* ===================================================================
     #007 adaptado — botão "Ouvir a frase"
     Lucian UX/UI Prompt #007 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#007
     =================================================================== */
  function montarOuvir(ex) {
    return IdiomasAudio.player(ex.frase, LICAO.idioma, ex.audio, ao.velocidadeVoz, function (v) { ao.velocidadeVoz=v; if(ao.mudarVelocidade)ao.mudarVelocidade(v); });
  }

  /* ---------- enunciado com Eco + balão ---------- */
  function cabecalho(ex) {
    var box = document.createElement('div');
    var ask = document.createElement('div'); ask.className = 'ask';
    var TAGS = { nova: ['tag--nova', 'Palavra nova', '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'],
      dificil: ['tag--dificil', 'Mais difícil', '<path d="M4 18l5-6 4 3 7-9"/><path d="M15 6h5v5"/>'],
      revisao: ['tag--revisao', 'Revisão', '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>'] };
    var tg = atual.revisao ? 'revisao' : ex.etiqueta;
    ask.innerHTML = '<div class="ask-top">' + (tg ? '<span class="tag ' + TAGS[tg][0] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + TAGS[tg][2] + '</svg>' + TAGS[tg][1] + '</span>' : '') +
      '<span class="ui-label">' + LICAO.unidade + '</span></div><h1 tabindex="-1"></h1>';
    ask.querySelector('h1').textContent = ex.enunciado;
    var pr = document.createElement('div'); pr.className = 'prompt';
    eco = novoEco('neutral', 'Lumi, a mascote');
    var bub = document.createElement('div'); bub.className = 'bubble';
    var p = document.createElement('p'); p.lang = LICAO.idioma.slice(0, 2);
    var pop = document.createElement('div'); pop.className = 'hint-pop'; pop.hidden = true; pop.id = 'dica-' + atual.idx; pop.setAttribute('role', 'status');
    if (ex.ocultar) { p.textContent = ex.ocultar; p.lang = 'pt'; } else frasecomDicas(p, ex, pop);
    if(ex.escuta){var transcript=document.createElement('details'),sum=document.createElement('summary');sum.textContent='Ver transcrição';transcript.append(sum,p);bub.append(transcript,montarOuvir(ex),pop);}else{bub.appendChild(p); if (!ex.ocultar) bub.appendChild(montarOuvir(ex)); bub.appendChild(pop);}
    pr.appendChild(eco); pr.appendChild(bub);
    box.className = 'screen'; box.appendChild(ask); box.appendChild(pr);
    if (ex.dicas && !dicaVista) {
      var c = document.createElement('p'); c.className = 'coach'; c.textContent = 'Toque numa palavra sublinhada para ver o que ela significa.';
      box.appendChild(c);
    }
    return box;
  }

  /* ---------- dicas: a frase vira texto com trechos tocáveis ---------- */
  var dicaVista = false;
  try { dicaVista = localStorage.getItem('idiomas-dica-vista') === '1'; } catch (e) {}
  function frasecomDicas(p, ex, pop) {
    var resto = ex.frase, aberto = null;
    (ex.dicas || []).forEach(function (d) {
      var i = resto.indexOf(d[0]); if (i < 0) return;
      if (i) p.appendChild(document.createTextNode(resto.slice(0, i)));
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hint'; b.textContent = d[0];
      b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', pop.id);
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (aberto === b) { fechar(); return; }
        if (aberto) aberto.setAttribute('aria-expanded', 'false');
        aberto = b; b.setAttribute('aria-expanded', 'true');
        pop.innerHTML = '<b></b><span></span>'; pop.firstChild.textContent = d[0] + ' = ' + d[1]; pop.lastChild.textContent = d[2] || '';
        pop.hidden = false;
        if (!dicaVista) { dicaVista = true; try { localStorage.setItem('idiomas-dica-vista', '1'); } catch (er) {} var c = $('.coach'); if (c) c.remove(); }
        /* LIGAR: conte quais palavras a pessoa consultou; elas são boas candidatas para a revisão espaçada. */
      });
      p.appendChild(b);
      resto = resto.slice(i + d[0].length);
    });
    if (resto) p.appendChild(document.createTextNode(resto));
    function fechar() { if (aberto) aberto.setAttribute('aria-expanded', 'false'); aberto = null; pop.hidden = true; }
    document.addEventListener('click', function f(e) { if (!p.isConnected) { document.removeEventListener('click', f); return; } if (!(e.target.closest && e.target.closest('.hint'))) fechar(); });
    document.addEventListener('keydown', function f(e) { if (!p.isConnected) { document.removeEventListener('keydown', f); return; } if (e.key === 'Escape') fechar(); });
  }

  /* ===================================================================
     #015 adaptado — múltipla escolha
     Lucian UX/UI Prompt #015 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#015
     =================================================================== */
  function montarEscolha(ex, box) {
    var root = document.createElement('div');
    root.className = 'u015';
    var grp = '<div class="u015-grp" role="radiogroup" aria-label="Respostas"><span class="u015-frame" aria-hidden="true"></span>';
    ex.opcoes.forEach(function (t, i) {
      grp += '<button class="u015-opt" type="button" role="radio" aria-checked="false" tabindex="' + (i ? -1 : 0) + '">' +
        '<span class="u015-dot" aria-hidden="true"></span><span class="u015-key" aria-hidden="true">' + (i + 1) + '</span>' +
        '<span class="u015-txt"></span><span class="u015-mark" aria-hidden="true"></span></button>';
    });
    root.innerHTML = grp + '</div>';
    var opts = Array.prototype.slice.call(root.querySelectorAll('.u015-opt'));
    opts.forEach(function (o, i) { var tx = o.querySelector('.u015-txt'); tx.textContent = ex.opcoes[i]; if (!ex.perguntaEmPt) {} else tx.lang = LICAO.idioma.slice(0, 2); });
    var frame = root.querySelector('.u015-frame');
    var escolhida = -1, travado = false;
    function place(o) { frame.style.top = o.offsetTop + 'px'; frame.style.height = o.offsetHeight + 'px'; }
    function choose(o, focus) {
      if (travado) return; if (ao && ao.som) ao.som('toque');
      opts.forEach(function (x) { var on = x === o; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
      if (!root.classList.contains('has-sel')) { frame.style.transition = 'none'; place(o); void frame.offsetWidth; frame.style.transition = ''; root.classList.add('has-sel'); }
      place(o);
      escolhida = opts.indexOf(o);
      acao.disabled = false;
      if (focus) o.focus();
    }
    opts.forEach(function (o, i) {
      o.addEventListener('click', function () { choose(o); });
      o.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (d) { e.preventDefault(); choose(opts[(i + d + opts.length) % opts.length], true); }
      });
    });
    /* atalho: teclas 1 a 4 escolhem a opção */
    atalho = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= opts.length) choose(opts[n - 1], true); };
    addEventListener('resize', function () { var o = opts[escolhida]; if (o && root.isConnected) place(o); });
    box.appendChild(root);
    return {
      verificar: function () {
        travado = true; root.classList.add('is-done');
        var ok = escolhida === ex.correta;
        opts.forEach(function (o, i) {
          o.setAttribute('aria-disabled', 'true');
          var m = o.querySelector('.u015-mark');
          if (i === ex.correta) { o.classList.add('is-right'); m.innerHTML = ICON_OK; o.setAttribute('aria-label', ex.opcoes[i] + ', resposta correta'); }
          else if (i === escolhida) { o.classList.add('is-wrong'); m.innerHTML = ICON_X; o.setAttribute('aria-label', ex.opcoes[i] + ', sua resposta, errada'); }
          else o.classList.add('is-off');
        });
        return { ok: ok, correta: ex.opcoes[ex.correta], dada: ex.opcoes[escolhida] };
      }
    };
  }

  /* ===================================================================
     #019 adaptado — banco de palavras
     Lucian UX/UI Prompt #019 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#019
     =================================================================== */
  function montarFrase(ex, box) {
    var root = document.createElement('div');
    root.className = 'u019';
    var MAX = ex.resposta.length + 2, t = 0, travado = false;
    var dotsHtml = ''; for (var k = 0; k < ex.resposta.length; k++) dotsHtml += '<i></i>';
    root.innerHTML = '<div class="u019-head"><b>Sua resposta</b><span class="u019-cnt"><span class="u019-dots" aria-hidden="true">' + dotsHtml + '</span><span class="u019-n"></span></span></div>' +
      '<div class="u019-line" data-vazio="Toque nas palavras abaixo"></div>' +
      '<div class="u019-list" role="group" aria-label="Palavras disponíveis"></div><p class="u019-msg" aria-live="polite"></p>';
    var list = root.querySelector('.u019-list'), line = root.querySelector('.u019-line');
    var dots = root.querySelectorAll('.u019-dots i'), n = root.querySelector('.u019-n'), msg = root.querySelector('.u019-msg');
    var ordem = []; // índices do banco na ordem escolhida
    var chips = ex.banco.map(function (name, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'u019-chip'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<i aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4"/></svg></i>';
      b.lang=ex.respostaIdioma||'pt'; b.appendChild(document.createTextNode(name));
      list.appendChild(b);
      return b;
    });
    function render() {
      var k = ordem.length;
      n.textContent = k + '/' + ex.resposta.length;
      Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('on', i < k); });
      line.innerHTML = '';
      ordem.forEach(function (idx, pos) {
        var c = document.createElement('button');
        c.type = 'button'; c.className = 'u019-chip'; c.textContent = ex.banco[idx]; c.lang=ex.respostaIdioma||'pt';
        c.setAttribute('aria-label', ex.banco[idx] + ', palavra ' + (pos + 1) + ' da resposta. Toque para tirar.');
        c.addEventListener('click', function () { if (travado) return; if (ao && ao.som) ao.som('solta'); tirar(idx); });
        line.appendChild(c);
      });
      if (!root.classList.contains('is-warn')) msg.textContent = '';
      acao.disabled = k === 0 || travado;
    }
    function tirar(idx) { ordem.splice(ordem.indexOf(idx), 1); chips[idx].setAttribute('aria-pressed', 'false'); render(); chips[idx].focus(); }
    chips.forEach(function (c, idx) {
      c.addEventListener('click', function () {
        if (travado) return; if (ao && ao.som) ao.som('toque');
        var on = c.getAttribute('aria-pressed') === 'true';
        if (on) { tirar(idx); return; }
        if (ordem.length >= MAX) {
          c.classList.remove('is-no'); void c.offsetWidth; c.classList.add('is-no');
          root.classList.remove('is-warn'); void root.offsetWidth; root.classList.add('is-warn');
          msg.textContent = 'A resposta não precisa de tantas palavras';
          clearTimeout(t);
          t = setTimeout(function () { if (root.isConnected) { root.classList.remove('is-warn'); render(); } }, 1600);
          return;
        }
        c.setAttribute('aria-pressed', 'true'); ordem.push(idx); render();
      });
    });
    box.appendChild(root);
    render();
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\s]/g, '').trim(); }
    return {
      verificar: function () {
        travado = true; root.classList.add('is-done');
        var dada = ordem.map(function (i) { return ex.banco[i]; }).join(' ');
        var certa = ex.resposta.join(' ');
        var ok = norm(dada) === norm(certa);
        /* LIGAR: aceite variações corretas cadastradas na planilha (ex.aceitas), além da resposta principal. */
        if (!ok && ex.aceitas) ok = ex.aceitas.some(function (a) { return norm(a) === norm(dada); });
        root.classList.add(ok ? 'is-right' : 'is-wrong');
        if (!ok) Array.prototype.forEach.call(line.children, function (c) { c.classList.remove('is-no'); void c.offsetWidth; c.classList.add('is-no'); });
        chips.forEach(function (c) { c.setAttribute('aria-disabled', 'true'); });
        return { ok: ok, correta: certa, dada: dada };
      }
    };
  }

  /* ---------- banner de resposta (Design System: FeedbackBanner) ---------- */
  function banner(ok, correta, dada) {
    bannerBox.innerHTML = '<div class="ui-banner ' + (ok ? 'ui-banner--correct' : 'ui-banner--wrong') + '"><div class="ui-banner__icon">' + (ok ? ICON_OK : ICON_X) + '</div>' +
      '<div class="ui-banner__text"><p class="ui-banner__title"></p><p class="ui-banner__detail"></p></div></div>';
    var ELOGIOS = ['Muito bem', 'Isso mesmo', 'Mandou bem', 'Perfeito', 'Certinho'];
    $('.ui-banner__title', bannerBox).textContent = ok ? (seguidas >= 3 ? seguidas + ' seguidas' : ELOGIOS[(feitos + seguidas) % ELOGIOS.length]) : 'Quase lá';
    $('.ui-banner__detail', bannerBox).textContent = ok ? (feitos < total ? 'Você acertou. Vamos para a próxima.' : 'Última do dia, concluída.') : 'Resposta correta: ' + correta + '. Ela volta no fim da lição.';
    anuncio.textContent = (ok ? $('.ui-banner__title', bannerBox).textContent + '. ' : 'Quase lá. Resposta correta: ' + correta + '.');
    if (ao && ao.som) ao.som(ok ? (seguidas >= 3 ? 'combo' : 'acerto') : 'erro');
    if(window.registrarRespostaCurso)registrarRespostaCurso(atual.ex,ok);
    if (ok && window.registrarAcerto) registrarAcerto(atual.ex);
    if (!ok && window.registrarErro && !atual.ex._ref) registrarErro({ fonte: 'licao', lang: LICAO.idioma, unidade: LICAO.unidade || '', frase: atual.ex.ocultar || atual.ex.frase || '', correta: correta, dada: dada || '', nota: atual.ex.enunciado || '' });
    if (!ok && atual.ex._ref && window.registrarErro) { /* errou de novo na revisão: continua na lista */ }
    if (!ok && window.IA && IA.ativo()) {
      var ex0 = atual.ex, bt = document.createElement('button'); bt.type = 'button'; bt.className = 'ia-porque'; bt.textContent = 'Por que errei?';
      bt.onclick = function () { bt.disabled = true; bt.textContent = 'O Eco está pensando…';
        IA.pedir('explicar', { idioma: LICAO.idioma.slice(0, 2), unidade: LICAO.unidade || '', nivel: LICAO.nivel || '', enunciado: ex0.enunciado || '', frase: ex0.ocultar || ex0.frase || '', opcoes: ex0.opcoes || null, correta: correta, dada: dada || '' })
          .then(function (r) { var p = document.createElement('p'); p.className = 'ia-explica'; p.innerHTML = IA.html(r.texto); bt.replaceWith(p); })
          .catch(function (e) { bt.disabled = false; bt.textContent = IA.erroTexto(e) + ' Tocar para tentar de novo.'; }); };
      $('.ui-banner__text', bannerBox).appendChild(bt);
    }
  }

  /* ---------- fluxo ---------- */
  var exercicio = null, atalho = null, fase = 'responder';
  addEventListener('keydown', function onKey(e) {
    if (!tela.isConnected) { removeEventListener('keydown', onKey); return; }
    if (e.target.closest && e.target.closest('input,textarea,select,.audio-player')) return;
    if (e.key === 'Enter' && !acao.disabled && document.activeElement && !document.activeElement.closest('.u015-opt,.u019-chip,.u007-btn,.icon-btn')) { e.preventDefault(); acao.click(); return; }
    if (fase === 'responder' && atalho) atalho(e);
  });

  function proximo() {
    IdiomasAudio.stop();
    bannerBox.innerHTML = ''; atalho = null; fase = 'responder';
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (!fila.length) { fim(); return; }
    atual = fila.shift(); checkpoint(true);
    var box = cabecalho(atual.ex);
    exercicio = atual.ex.tipo === 'escolha' ? montarEscolha(atual.ex, box) : montarFrase(atual.ex, box);
    if(ao.aposExercicio)ao.aposExercicio(box);
    tela.innerHTML = ''; tela.appendChild(box);
    acao.className = 'ui-btn ui-btn--primary ui-btn--block'; acao.textContent = 'Verificar'; acao.disabled = true;
    var h = $('h1', box); if (h) h.focus({ preventScroll: true });
  }

  acao.addEventListener('click', function () {
    if (fase === 'responder') {
      var r = exercicio.verificar();
      tentativas++;
      if (r.ok) { acertos++; feitos++; seguidas++; melhorSeq = Math.max(melhorSeq, seguidas); eco.dataset.state = seguidas >= 3 ? 'proud' : 'celebrate'; pular(eco); }
      else {
        seguidas = 0;
        eco.dataset.state = 'sad';
        if (!atual.revisao) fila.push({ ex: atual.ex, idx: atual.idx, revisao: true }); else feitos++;
      }
      progresso(); combo();
      banner(r.ok, r.correta, r.dada);
      acao.className = 'ui-btn ui-btn--block ' + (r.ok ? 'ui-btn--primary' : 'ui-btn--danger');
      acao.textContent = r.ok ? 'Continuar' : 'Entendi';
      acao.disabled = false; fase = 'seguir'; checkpoint(false); acao.focus();
      /* LIGAR: registre cada resposta para a revisão espaçada:
         google.script.run.registrarResposta(PERFIL_ID, LICAO.id, atual.idx, r.ok); */
    } else if (fase === 'seguir') proximo();
    else if (fase === 'fim') {
      /* LIGAR: volte para a trilha (no Apps Script, mostre a tela da trilha ou recarregue). */
      document.removeEventListener('visibilitychange',lessonVisibility);
      ao.concluir({ acertos: acertos, tentativas: tentativas, xp: acertos * PERFIL.xpPorAcerto, minutos: Math.max(1, Math.round((Date.now() - inicio) / 60000)), melhorSeq: melhorSeq });
    }
  });

  $('#sair').addEventListener('click', function () {
    checkpoint(fase === 'responder'); IdiomasAudio.stop();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    document.removeEventListener('visibilitychange',lessonVisibility);ao.sair();
  });

  function reiniciar() {
    fila = LICAO.exercicios.map(function (e, i) { return { ex: e, idx: i, revisao: false }; });
    feitos = 0; acertos = 0; tentativas = 0; seguidas = 0; melhorSeq = 0; inicio = Date.now(); progresso(); combo();
    $('#barra').hidden = false; proximo();
  }

  /* ===================================================================
     #379 adaptado — chama da sequência
     Lucian UX/UI Prompt #379 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#379
     =================================================================== */
  function montarChama(streakAntes, feitosAntes) {
    var root = document.createElement('div');
    root.className = 'u379';
    root.innerHTML = '<div class="u379-glow" aria-hidden="true"></div>' +
      '<div class="u379-fl" aria-hidden="true"><svg viewBox="0 0 120 144"><defs></defs><g class="u379-sp"></g><path class="u379-fo"/><path class="u379-fm"/><path class="u379-fc"/></svg></div>' +
      '<div class="u379-ct" aria-hidden="true"><span class="u379-nw"><span class="u379-ns"></span></span><b>dias seguidos</b></div>' +
      '<ol class="u379-wk" aria-label="Dias estudados nesta semana"></ol>' +
      '<div class="u379-bd" aria-hidden="true">Semana completa</div>' +
      '<p class="sr u379-sr"></p>';
    var fl = root.querySelector('.u379-fl'), glow = root.querySelector('.u379-glow'), ns = root.querySelector('.u379-ns'), wk = root.querySelector('.u379-wk'), srT = root.querySelector('.u379-sr');
    var DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
    var NOMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    var streak = streakAntes, done = feitosAntes, D = [], LI = [], marcado = !!PERFIL.hojeFeito;
    var MAXN = Math.max(60, streak + 10);
    for (var i = 0; i < MAXN; i++) { var n = document.createElement('i'); n.textContent = i; ns.appendChild(n); }
    DAYS.forEach(function (d, i) { var c = document.createElement('li'); c.innerHTML = '<div class="u379-dy" aria-hidden="true">' + d + '</div><div class="u379-dt" aria-hidden="true"></div>'; wk.appendChild(c); D.push(c.querySelector('.u379-dt')); LI.push(c); });
    function info() {
      ns.style.transform = 'translateY(' + (-streak * 44) + 'px)';
      var sem = PERFIL.semanaDias, hj = PERFIL.hoje;
      D.forEach(function (d, i) {
        /* Com a semana real (PERFIL.semanaDias + PERFIL.hoje), marca os dias certos; sem ela, preenche a partir de segunda. */
        var on = sem ? (sem[i] || (i === hj && marcado)) : i < done;
        d.classList.toggle('is-on', on); d.classList.toggle('is-today', sem ? i === hj : (i === done - 1 || (done === 0 && i === 0)));
        LI[i].setAttribute('aria-label', NOMES[i] + (on ? ', estudou' : ', ainda não') + ((sem ? i === hj : false) ? ', hoje' : ''));
      });
      var s = 0.8 + done * 0.05; fl.style.transform = 'scale(' + s.toFixed(2) + ')'; glow.style.opacity = (0.3 + done * 0.06).toFixed(2); glow.style.transform = 'scale(' + (0.8 + done * 0.06).toFixed(2) + ')';
      root.classList.toggle('is-week', done >= 7);
      root.querySelector('.u379-ct b').textContent = streak === 1 ? 'dia seguido' : 'dias seguidos';
      srT.textContent = streak + (streak === 1 ? ' dia seguido' : ' dias seguidos') + (done >= 7 ? '. Semana completa.' : '.');
    }
    var svg = fl.querySelector('svg'), uid = 'u379' + Math.random().toString(36).slice(2, 7);
    svg.querySelector('defs').innerHTML =
      '<linearGradient id="' + uid + 'o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color:var(--sun-shadow)"/><stop offset=".55" style="stop-color:var(--error)"/><stop offset="1" style="stop-color:var(--error)"/></linearGradient>' +
      '<linearGradient id="' + uid + 'm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color:var(--sun)"/><stop offset="1" style="stop-color:var(--sun-shadow)"/></linearGradient>' +
      '<linearGradient id="' + uid + 'c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color:#fffbea"/><stop offset="1" style="stop-color:var(--sun)"/></linearGradient>';
    var LY = [
      { el: svg.querySelector('.u379-fo'), g: 'o', w: 40, h: 126, ph: 0, sw: 1 },
      { el: svg.querySelector('.u379-fm'), g: 'm', w: 28, h: 88, ph: 1.7, sw: 0.8 },
      { el: svg.querySelector('.u379-fc'), g: 'c', w: 15, h: 48, ph: 3.1, sw: 0.55 }
    ];
    LY.forEach(function (L) { L.el.setAttribute('fill', 'url(#' + uid + L.g + ')'); });
    var PRO = [[0.05, 0.6], [0.19, 0.96], [0.37, 1], [0.55, 0.8], [0.71, 0.52], [0.85, 0.26]];
    var CX = 60, BASE = 138, flare = 0;
    function outline(L, t) {
      var w = L.w * (1 + flare * 0.08), h = L.h * (1 + flare * 0.2), sw = function (f) { return (Math.sin(t * 1.7 + L.ph) * 0.6 + Math.sin(t * 2.9 + L.ph * 2) * 0.4) * h * 0.13 * L.sw * Math.pow(f, 1.5); };
      var R = [], Lf = [];
      PRO.forEach(function (q) {
        var f = q[0], y = BASE - f * h, x = q[1] * w, s0 = sw(f);
        R.push([CX + x + s0 + Math.sin(t * 6.1 + f * 7 + L.ph) * w * 0.07 * f, y]);
        Lf.unshift([CX - x + s0 - Math.sin(t * 5.3 + f * 6 + L.ph + 2) * w * 0.07 * f, y]);
      });
      var tip = [CX + sw(1) + Math.sin(t * 4.3 + L.ph) * w * 0.12, BASE - h * (1 + Math.sin(t * 5.2 + L.ph) * 0.035)];
      var P = [[CX, BASE]].concat(R, [tip, tip], Lf), n = P.length, d = 'M' + P[0][0].toFixed(1) + ' ' + P[0][1].toFixed(1);
      for (var i = 0; i < n; i++) {
        var a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n], e = P[(i + 2) % n];
        d += ' C' + (b[0] + (c[0] - a[0]) / 6).toFixed(1) + ' ' + (b[1] + (c[1] - a[1]) / 6).toFixed(1) + ' ' + (c[0] - (e[0] - b[0]) / 6).toFixed(1) + ' ' + (c[1] - (e[1] - b[1]) / 6).toFixed(1) + ' ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1);
      }
      L.el.setAttribute('d', d + 'Z');
    }
    var spg = svg.querySelector('.u379-sp'), SP = [];
    for (var k = 0; k < 7; k++) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); spg.appendChild(c); SP.push({ el: c, t0: -1 }); }
    function sparks(now) {
      SP.forEach(function (p, k) {
        var on = k < 2 + Math.round(done * 0.7 + flare * 3);
        if (p.t0 < 0 || now - p.t0 > p.life) { if (!on) { p.el.setAttribute('r', 0); p.t0 = -1; return; } p.t0 = now + Math.random() * 600; p.life = 900 + Math.random() * 700; p.x = CX + (Math.random() - 0.5) * 30; p.dx = (Math.random() - 0.5) * 30; p.r = 1 + Math.random() * 1.6; }
        var q = (now - p.t0) / p.life; if (q < 0) { p.el.setAttribute('r', 0); return; }
        p.el.setAttribute('cx', (p.x + p.dx * q + Math.sin(q * 9 + k) * 3).toFixed(1)); p.el.setAttribute('cy', (BASE - 70 - q * 80).toFixed(1));
        p.el.setAttribute('r', (p.r * (1 - q)).toFixed(2)); p.el.setAttribute('opacity', (1 - q).toFixed(2));
      });
    }
    var vis = true;
    function frame(now) {
      if (!root.isConnected) return;
      if (vis) { var t = now / 1000; flare = Math.max(0, flare - 0.02); LY.forEach(function (L) { outline(L, t); }); sparks(now); }
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(root);
    info();
    if (rm) LY.forEach(function (L) { outline(L, 0); }); else requestAnimationFrame(frame);
    /* Marca o dia de hoje sozinho (no original, era o botão "Done today"). */
    /* Adaptado: em vez do botão "Done today", a chama fica apagada e acende quando a pessoa a arrasta
       para cima. Tocar (ou Enter/Espaço/seta para cima no teclado) também acende, para quem não arrasta. */
    root.armar = function (aoAcender) {
      root.classList.add('is-off');
      var lit = false, y0 = null, dy = 0, base = fl.style.transform;
      var pull = document.createElement('button'); pull.type = 'button'; pull.className = 'u379-pull'; pull.setAttribute('aria-label', 'Acender a sequência de hoje');
      var hint = document.createElement('div'); hint.className = 'u379-hint';
      hint.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>Arraste a chama para cima<small>para acender o dia de hoje</small>';
      root.appendChild(pull); root.appendChild(hint);
      function mover(d) { dy = Math.max(0, Math.min(80, d)); fl.style.transition = 'none'; fl.style.transform = base + ' translateY(' + (-dy) + 'px) scale(' + (1 + dy / 400).toFixed(3) + ')'; }
      function soltar() { fl.style.transition = ''; if (dy > 45) acender(); else fl.style.transform = base; y0 = null; }
      function acender() {
        if (lit) return; lit = true; pull.remove(); hint.remove(); root.classList.remove('is-off'); fl.style.transform = base;
        root.marcarHoje(); if (aoAcender) aoAcender(); if (ao && ao.som) ao.som('chama');
      }
      pull.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; try { pull.setPointerCapture(e.pointerId); } catch (er) {} });
      pull.addEventListener('pointermove', function (e) { if (y0 !== null) mover(y0 - e.clientY); });
      pull.addEventListener('pointerup', soltar); pull.addEventListener('pointercancel', soltar);
      pull.addEventListener('click', acender);
      pull.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { e.preventDefault(); acender(); } });
      root.acender = acender;
    };
    root.marcarHoje = function () {
      if (done >= 7) done = 0;
      done++; streak++; flare = 1; marcado = true; info();
      if (rm) LY.forEach(function (L) { flare = 0; outline(L, 0); });
    };
    return root;
  }

  /* ---------- fim de lição ---------- */
  function fim() {
    fase = 'fim'; checkpoint(false);
    var min = Math.max(1, Math.round((Date.now() - inicio) / 60000));
    var xp = acertos * PERFIL.xpPorAcerto;
    var box = document.createElement('div'); box.className = 'screen fim';
    eco = novoEco('happy', 'Lumi, feliz');
    if (ao && ao.avatarFeliz) { var duo = document.createElement('div'); duo.className = 'fim-duo'; duo.appendChild(eco); duo.insertAdjacentHTML('beforeend', ao.avatarFeliz); box.appendChild(duo); } else box.appendChild(eco);
    if (ao && ao.som) ao.som('fim');
    var t = document.createElement('div');
    t.innerHTML = '<span class="ui-label"></span><h1 tabindex="-1">Lição concluída</h1><p class="sub"></p>';
    $('.ui-label', t).textContent = LICAO.unidade;
    $('.sub', t).textContent = acertos === tentativas ? 'Tudo certo de primeira.' : 'Você revisou o que errou e fechou a lição.' + (melhorSeq >= 3 ? ' Melhor série: ' + melhorSeq + ' seguidas.' : '');
    box.appendChild(t);
    var chama = montarChama(PERFIL.sequencia, PERFIL.diasFeitosNaSemana);
    if(!ao.decorateFim)box.appendChild(chama);
    var g = document.createElement('div'); g.className = 'ui-statgrid';
    [['primary', ICON_OK, Math.round(acertos / tentativas * 100) + '%', 'Precisão'], ['sun', '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="cheio" d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/></svg>', '+' + xp, 'XP'], ['primary', '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>', min + ' min', 'Tempo']].forEach(function (s) {
      var c = document.createElement('div'); c.className = 'ui-statcard';
      c.innerHTML = '<span class="ui-statcard__icon ui-statcard__icon--' + s[0] + '">' + s[1] + '</span><div><p class="ui-statcard__value">' + s[2] + '</p><p class="ui-statcard__label">' + s[3] + '</p></div>';
      g.appendChild(c);
    });
    box.appendChild(g);
    if(ao.decorateFim)ao.decorateFim(box,{acertos:acertos,tentativas:tentativas});
    tela.innerHTML = ''; tela.appendChild(box);
    bannerBox.innerHTML = '';
    acao.className = 'ui-btn ui-btn--primary ui-btn--block'; acao.textContent = ao.decorateFim?'Encerrar por hoje':'Continuar'; acao.disabled = false;
    $('h1', box).focus({ preventScroll: true });
    pular(eco);
    if (!ao.decorateFim && !PERFIL.hojeFeito) chama.armar(function () {
      PERFIL.sequencia++; PERFIL.diasFeitosNaSemana = Math.min(7, PERFIL.diasFeitosNaSemana + 1);
      $('#seqTopo span').textContent = PERFIL.sequencia; $('#seqTopo').setAttribute('aria-label', PERFIL.sequencia + ' dias seguidos');
      anuncio.textContent = 'Lição concluída. ' + PERFIL.sequencia + (PERFIL.sequencia === 1 ? ' dia seguido.' : ' dias seguidos.');
    });
    /* LIGAR: salve o resultado e a sequência na planilha:
       google.script.run.concluirLicao(PERFIL_ID, LICAO.id, { acertos: acertos, tentativas: tentativas, xp: xp, minutos: min }); */
  }

  progresso();
  proximo();
}

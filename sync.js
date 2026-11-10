/* Fila persistente, revisão do servidor e reconciliação de três versões. */
(function () {
  'use strict';
  var K = 'idiomas-app-v2', Q = K + ':fila', B = K + ':base', F = K + ':envio';
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } }
  var queue = read(Q, {}), bases = read(B, {}), flight = read(F,null), state = null, sending = false, timer, retry = 2000, started = false, pulling = null;
  /* Recusa definitiva do servidor (perfil grande demais, inválido ou sem vaga): repetir o mesmo envio não adianta.
     recusas guarda o conteúdo recusado de cada perfil; ele só volta para a fila quando mudar. */
  var DEFINITIVO = /^(perfil_invalido|perfil inválido|perfil_grande|limite de perfis|operacao_invalida)$/, recusas = {}, parado = false;
  function situacao() { return Object.keys(queue).length ? 'pendente' : Object.keys(recusas).length ? 'recusado' : 'ok'; }
  function semSessao() { return window.AUTH && AUTH.local && AUTH.local() ? 'local' : 'entrar'; }
  function status(value) { SYNC.status = value; document.dispatchEvent(new CustomEvent('idiomas-sync', { detail: value })); }
  function persist() {
    try { localStorage.setItem(Q, JSON.stringify(queue)); localStorage.setItem(B, JSON.stringify(bases)); localStorage.setItem(F,JSON.stringify(flight)); if (state) localStorage.setItem(K, JSON.stringify(state)); }
    catch (e) { status('armazenamento'); }
  }
  function stamp(p) { var c = ProfileCore.copy(p); delete c.atualizado; delete c.revisao; delete c._receipts; delete c._operation; return JSON.stringify(c); }
  var last = {};
  function apply(remote, sent) {
    if (!state) return;
    remote.forEach(function (rp) {
      var p = state.perfis.find(function (x) { return x.id === rp.id; });
      if (!p) { if (state.perfis.length < 4) { p = ProfileCore.copy(rp); state.perfis.push(p); } else return; }
      var before = sent && sent[rp.id] || bases[rp.id], value = ProfileCore.mergeProfile(before, p, rp);
      value.revisao = rp.revisao; value.atualizado = rp.atualizado;
      if (rp.pinCredential) delete value.pin;
      ProfileCore.reconcile(p, value); bases[p.id] = ProfileCore.copy(rp); last[p.id] = stamp(p);
      if (stamp(p) === stamp(rp)) delete queue[p.id]; else queue[p.id] = ProfileCore.copy(p);
    });
    persist(); document.dispatchEvent(new CustomEvent('idiomas-profiles-updated'));
  }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(send, ms == null ? 500 : ms); }
  function send() {
    if (!window.IDIOMAS_API || !AUTH.ready() || !started || sending || pulling || !state) return Promise.resolve();
    var ids = Object.keys(queue); if (!ids.length && !flight) { status(situacao()); return Promise.resolve(); }
    var sent;
    if(flight)sent=flight.sent;
    else { sent = {}; var operation=crypto.randomUUID(); ids.forEach(function (id) { var p = state.perfis.find(function (x) { return x.id === id; }); if (p) { sent[id] = ProfileCore.copy(p); sent[id].revisao = bases[id] && bases[id].revisao || 0;sent[id]._operation=operation; } });flight={sent:sent};persist(); }
    sending = true; status('enviando');
    return AUTH.post({ acao: 'salvar', perfis: Object.values(sent) }).then(function (r) {
      apply(r.perfis || [], sent); apply(r.conflitos || []);
      (r.perfis || []).forEach(function (x) { if (x) delete recusas[x.id]; });
      var recusados = r.recusados || [], grande = false;
      recusados.forEach(function (x) {
        if (!x || !sent[x.id]) return;
        recusas[x.id] = stamp(sent[x.id]); if (x.erro === 'perfil_grande') grande = true;
        if (queue[x.id] && stamp(queue[x.id]) === recusas[x.id]) delete queue[x.id];   // mudou depois do envio: continua na fila
      });
      flight=null;retry = 2000; parado = false;
      status(recusados.length ? (grande ? 'limite' : 'recusado') : situacao());
    }).catch(function (e) {
      var definitivo = DEFINITIVO.test(e.message);
      status(/^auth_/.test(e.message) ? semSessao() : e.message === 'perfil_grande' ? 'limite' : definitivo ? 'recusado' : 'erro');
      retry = Math.min(60000, retry * 2);
      /* Servidor antigo, que recusa o envio inteiro: o envio em andamento é mantido (para não contar nada duas vezes),
         mas as tentativas automáticas param até haver uma mudança ou o app ser reaberto. */
      if (definitivo) parado = true;
    }).finally(function () { sending = false; persist(); if (!parado && (flight || Object.keys(queue).length) && AUTH.ready()) schedule(retry); });
  }
  function refresh() {
    if (!window.IDIOMAS_API || !AUTH.ready() || !state) return Promise.resolve();
    if(flight){if(sending)return Promise.resolve();started=true;return send().then(function(){if(!flight)return refresh();});}
    if (pulling) return pulling;
    pulling = AUTH.post({ acao: 'listar' }).then(function (r) {
      apply(r.perfis || []); started = true;
      state.perfis.forEach(function (p) { if (!bases[p.id] && recusas[p.id] !== stamp(p)) queue[p.id] = ProfileCore.copy(p); });
      persist(); schedule(); status(situacao());
    }).catch(function (e) { status(/^auth_/.test(e.message) ? semSessao() : 'erro'); }).finally(function () { pulling = null; });
    return pulling;
  }
  window.SYNC = {
    ativo: !!window.IDIOMAS_API, status: window.IDIOMAS_API ? 'entrar' : 'local',
    remotos: function () { return null; },
    bind: function (S) { state = S; S.perfis.forEach(function (p) { last[p.id] = stamp(p); }); refresh(); },
    mudou: function (S) {
      state = S;
      S.perfis.forEach(function (p) { var value = stamp(p); if (last[p.id] !== value) { p.atualizado = Date.now(); queue[p.id] = ProfileCore.copy(p); last[p.id] = value; } });
      parado = false; persist();
      /* Sem sessão não há envio: quem escolheu estudar só neste aparelho não vê "sincronização pendente". */
      if (window.IDIOMAS_API) { if (AUTH.ready()) { status('pendente'); schedule(); } else status(semSessao()); }
    },
    agora: send, recarregar: refresh,
    limpar: function () { queue = {}; bases = {}; last = {}; flight=null; persist(); }
  };
  document.addEventListener('idiomas-auth-ready', function () { started = false; refresh(); });
  addEventListener('online', function () { refresh().then(send); });
  addEventListener('storage', function (e) {
    if (e.key !== K || !state || !e.newValue) return;
    /* Outra aba gravou. A base da fusão é o que estava gravado antes dessa gravação (oldValue), não a base do servidor:
       assim o que esta aba já recebeu da outra não é somado de novo. */
    try {
      var other = JSON.parse(e.newValue), before = {}, old = null;
      try { old = JSON.parse(e.oldValue || 'null'); } catch (x) {}
      ((old && old.perfis) || []).forEach(function (x) { if (x && x.id) before[x.id] = x; });
      var lb = read(B, {}); Object.keys(lb).forEach(function (id) { if (lb[id] && (!bases[id] || (lb[id].revisao || 0) > (bases[id].revisao || 0))) bases[id] = lb[id]; });
      (other.perfis || []).forEach(function (rp) { var p = state.perfis.find(function (x) { return x.id === rp.id; }); if (p) ProfileCore.reconcile(p, ProfileCore.mergeProfile(before[p.id], p, rp)); else state.perfis.push(rp); });
      SYNC.mudou(state);
    } catch (err) { status('armazenamento'); }
  });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refresh(); else { persist(); send(); } });
})();

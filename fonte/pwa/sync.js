/* Idiomas: sincroniza perfis e progresso com a planilha (Apps Script).
   O app continua salvando no aparelho; isto só copia para a planilha e traz de volta.
   Sem endereço configurado (window.IDIOMAS_API vazio), não faz nada. */
(function () {
  var API = window.IDIOMAS_API || '', K = 'idiomas-app-v2', KR = 'idiomas-remoto';
  var ultimo = {}, pend = {}, timer = null, enviando = false;
  function ler() { try { return JSON.parse(localStorage.getItem(K)); } catch (e) { return null; } }
  function chave(p) { var c = {}; for (var k in p) if (k !== 'atualizado') c[k] = p[k]; return JSON.stringify(c); }
  function post(o, keep) {
    return fetch(API, { method: 'POST', body: JSON.stringify(o), keepalive: !!keep, redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (r && r.erro) throw new Error(r.erro); return r; });
  }
  function enviar(keep) {
    if (!API || enviando) return;
    var ids = Object.keys(pend); if (!ids.length) return;
    var lote = ids.map(function (id) { return pend[id]; }); pend = {}; enviando = true;
    post({ acao: 'salvar', perfis: lote }, keep).then(function () { enviando = false; estado('ok'); })
      .catch(function () { enviando = false; lote.forEach(function (p) { if (!pend[p.id]) pend[p.id] = p; }); estado('erro'); });
  }
  function estado(s) { window.SYNC.status = s; }

  window.SYNC = {
    ativo: !!API, status: API ? 'iniciando' : 'desligado',
    /* perfis vindos da planilha para um aparelho novo (usado na primeira abertura) */
    remotos: function () { try { var r = JSON.parse(localStorage.getItem(KR)); localStorage.removeItem(KR); return Array.isArray(r) && r.length ? r : null; } catch (e) { return null; } },
    /* chamado pelo app a cada salvar(): marca o que mudou e envia em seguida */
    mudou: function (S) {
      if (!API || !S || !S.perfis) return;
      S.perfis.forEach(function (p) {
        var c = chave(p);
        if (ultimo[p.id] !== c) { ultimo[p.id] = c; p.atualizado = Date.now(); pend[p.id] = JSON.parse(JSON.stringify(p)); }
      });
      clearTimeout(timer); timer = setTimeout(enviar, 1500);
    },
    agora: function () { clearTimeout(timer); enviar(true); }
  };
  if (!API) return;

  var L = ler(); if (L && L.perfis) L.perfis.forEach(function (p) { ultimo[p.id] = chave(p); });
  addEventListener('online', function () { enviar(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') window.SYNC.agora(); });

  /* ao abrir: traz da planilha o que for mais novo e envia o que só existe aqui */
  function recarregar() {
    try { var t = +sessionStorage.getItem('idiomas-recarga') || 0; if (Date.now() - t < 15000) return; sessionStorage.setItem('idiomas-recarga', Date.now()); } catch (e) {}
    location.reload();
  }
  function depoisDoApp(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(fn, 0); }); else setTimeout(fn, 0); }
  post({ acao: 'listar' }).then(function (r) { depoisDoApp(function () { aplicar(r); }); }).catch(function () { estado('erro'); });
  function aplicar(r) {
    estado('ok');
    var remoto = (r && r.perfis) || [], S = ler(), mudouAqui = false;
    if (!S || !S.perfis) {
      if (remoto.length) { try { localStorage.setItem(KR, JSON.stringify(remoto)); localStorage.removeItem(K); } catch (e) {} recarregar(); }
      return;
    }
    var porId = {}; S.perfis.forEach(function (p) { porId[p.id] = p; });
    remoto.forEach(function (rp) {
      var lp = porId[rp.id];
      if (!lp) { if (S.perfis.length < 2) { S.perfis.push(rp); mudouAqui = true; } }
      else if ((rp.atualizado || 0) > (lp.atualizado || 0)) { S.perfis[S.perfis.indexOf(lp)] = rp; mudouAqui = true; }
    });
    var ids = {}; remoto.forEach(function (rp) { ids[rp.id] = rp.atualizado || 0; });
    S.perfis.forEach(function (p) { if (!(p.id in ids) || (p.atualizado || 0) > ids[p.id]) pend[p.id] = p; });
    enviar();
    if (mudouAqui) {
      try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) {}
      S.perfis.forEach(function (p) { ultimo[p.id] = chave(p); });
      if (!document.querySelector('#acao')) recarregar();   /* fora de uma lição: recarrega já com os dados novos */
    }
  }
})();

/* Regras puras compartilhadas pelo navegador e pelo Apps Script. */
var ProfileCore = (function () {
  'use strict';
  function copy(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x, function(k,v){return ['__proto__','constructor','prototype'].indexOf(k)>=0?undefined:v;})); }
  function equal(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function merge(base, local, remote, key) {
    if (equal(local, base)) return copy(remote);
    if (equal(remote, base) || equal(local, remote)) return copy(local);
    if (local === undefined) return undefined;
    if (remote === undefined) return copy(local);
    if (Array.isArray(local) && Array.isArray(remote)) {
      if (local.concat(remote).every(function (v) { return v && typeof v === 'object' && v.id; })) {
        var bm = {}, lm = {}, rm = {}, ids = [];
        (base || []).forEach(function (v) { bm[v.id] = v; });
        local.forEach(function (v) { lm[v.id] = v; ids.push(v.id); });
        remote.forEach(function (v) { rm[v.id] = v; if (ids.indexOf(v.id) < 0) ids.push(v.id); });
        return ids.map(function (id) { return merge(bm[id], lm[id], rm[id], key); }).filter(Boolean);
      }
      if (local.concat(remote).every(function (v) { return typeof v === 'number'; })) return local.map(function (v, i) { return merge(base && base[i], v, remote[i] || 0, key); });
      return copy(local);
    }
    if (local && remote && typeof local === 'object' && typeof remote === 'object') {
      var out = {}, keys = Object.keys(local).concat(Object.keys(remote));
      keys.forEach(function (k) { if (['__proto__', 'constructor', 'prototype'].indexOf(k) >= 0) return; var v = merge(base && base[k], local[k], remote[k], k); if (v !== undefined) out[k] = v; });
      return out;
    }
    if (typeof local === 'number' && typeof remote === 'number') {
      if (['xp', 'palavras', 'minutosHoje', 'licoes', 'revisadas', 'semana', 'xpSemana'].indexOf(key) >= 0 && typeof base === 'number') return Math.max(0, local + remote - base);
      return Math.max(local, remote);
    }
    return copy(local);
  }
  function reconcile(target, value) {
    Object.keys(target).forEach(function (k) { if (!(k in value)) delete target[k]; });
    Object.keys(value).forEach(function (k) {
      var a = target[k], b = value[k];
      if (a && b && !Array.isArray(a) && !Array.isArray(b) && typeof a === 'object' && typeof b === 'object') reconcile(a, b);
      else if (Array.isArray(a) && Array.isArray(b)) {
        var old = {}; a.forEach(function (x) { if (x && x.id) old[x.id] = x; });
        var items = b.map(function (x) { if (x && old[x.id]) { reconcile(old[x.id], x); return old[x.id]; } return copy(x); });
        a.splice.apply(a, [0, a.length].concat(items));
      } else target[k] = copy(b);
    });
    return target;
  }
  function normalize(p) {
    if (!p || !/^[\w-]{1,60}$/.test(String(p.id || '')) || ['__proto__','constructor','prototype'].indexOf(p.id)>=0) throw new Error('perfil_invalido');
    p = copy(p); delete p.pin; delete p.token; delete p.credential;
    p.nome = String(p.nome || '').slice(0, 40); p.idioma = p.idioma === 'en' ? 'en' : 'fr'; p.idiomas = ['fr', 'en'];
    p.progresso = p.progresso || {}; ['en', 'fr'].forEach(function (k) { p.progresso[k] = Math.max(0, Math.min(300, Math.floor(Number(p.progresso[k]) || 0))); });
    ['xp', 'palavras', 'sequencia', 'melhorSequencia', 'minutosHoje'].forEach(function (k) { p[k] = Math.max(0, Number(p[k]) || 0); });
    ['semana', 'xpSemana'].forEach(function (k) { p[k] = Array.from({ length: 7 }, function (_, i) { return Math.max(0, Number(p[k] && p[k][i]) || 0); }); });
    p.metasHoje = p.metasHoje || { licoes: 0, revisadas: 0 }; p.motivos = Array.isArray(p.motivos) ? p.motivos : [];
    ['ecoStudio','design','discovery','reviewWords','preferencias','rascunhos'].forEach(function(k){if(p[k]!=null&&(typeof p[k]!=='object'||Array.isArray(p[k])))throw new Error('perfil_invalido');});
    var schemas={ecoStudio:['calls','writings','notebook','words','erros','duvidas'],design:['notes','records']};
    Object.keys(schemas).forEach(function(k){if(!p[k])return;schemas[k].forEach(function(field){if(p[k][field]!=null&&!Array.isArray(p[k][field]))throw new Error('perfil_invalido');});});
    p.revisao = Math.max(0, Math.floor(Number(p.revisao) || 0)); return p;
  }
  function day(d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function newDay(p, date) {
    date = date || new Date(); var today = day(date), yesterday = new Date(date); yesterday.setDate(yesterday.getDate() - 1);
    if (p.ultimoDia !== today) { p.hojeFeito = false; p.minutosHoje = 0; p.metasHoje = { licoes: 0, revisadas: 0 }; if (p.ultimoDia !== day(yesterday)) p.sequencia = 0; }
    var monday = new Date(date); monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7); var week = day(monday);
    if (p.semanaDe !== week) { p.semana = [0,0,0,0,0,0,0]; p.xpSemana = [0,0,0,0,0,0,0]; }
    p.semanaDe = week; return p;
  }
  function review(state, id, correct, now) {
    now = now || Date.now(); state[id] = state[id] || { interval: 0, due: 0, correct: 0, wrong: 0 };
    var r = state[id]; r.interval = correct ? (r.interval ? Math.min(120, r.interval * 2) : 1) : 0;
    r[correct ? 'correct' : 'wrong']++; r.last = now; r.due = now + (correct ? r.interval * 86400000 : 60000); return r;
  }
  return { copy: copy, equal: equal, merge: merge, reconcile: reconcile, normalize: normalize, day: day, newDay: newDay, review: review };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = ProfileCore;

/* IA do app: tudo passa pelo Apps Script (as chaves ficam lá). Sem endereço configurado, fica desligada. */
window.IA = {
  ativo: function () { return !!window.IDIOMAS_API; },
  pedir: function (tipo, dados) {
    var ctrl = window.AbortController ? new AbortController() : null, t = ctrl && setTimeout(function () { ctrl.abort(); }, 60000);
    return fetch(window.IDIOMAS_API, { method: 'POST', body: JSON.stringify({ acao: 'ia', tipo: tipo, dados: dados }), signal: ctrl && ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (t) clearTimeout(t); if (!r || r.erro) throw new Error((r && r.erro) || 'falha'); return r; });
  },
  /* texto da IA para HTML seguro: escapa tudo e só permite **negrito** e quebras de linha */
  html: function (s) {
    return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; })
      .replace(/^[ \t]*[*-][ \t]+/gm, '• ').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*\n]+)\*/g, '<i>$1</i>').replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  },
  erroTexto: function (e) {
    var m = String(e && e.message || e);
    if (/sem_chave/.test(m)) return 'A IA ainda não foi configurada no servidor.';
    if (/limite/.test(m)) return 'A IA atingiu o limite gratuito por agora. Tente mais tarde.';
    if (/abort|Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com a IA agora. Confira a internet e tente de novo.';
    return 'Não consegui falar com a IA agora. Tente de novo.';
  }
};

/* Pedidos repetidos reutilizam a operação em caso de falha ou demora. */
var IA_OPERACOES = new Map();
window.IA = {
  ativo: function () { return !!window.IDIOMAS_API && window.AUTH && AUTH.ready(); },
  pedir: function (tipo, dados) {
    var key=tipo+'|'+JSON.stringify(dados), previous=IA_OPERACOES.get(key), now=Date.now();
    if(previous&&previous.promise)return previous.promise;
    var operation=previous&&now-previous.at<5*60000?previous.id:crypto.randomUUID();
    if(tipo==='liveToken')operation=crypto.randomUUID();
    var entry={id:operation,at:now};IA_OPERACOES.set(key,entry);
    entry.promise=AUTH.post({ acao: 'ia', tipo: tipo, dados: dados, requestId:operation }).then(function(r){IA_OPERACOES.delete(key);return r;}).catch(function(e){entry.promise=null;throw e;});
    return entry.promise;
  },
  /* texto da IA para HTML seguro: escapa tudo e só permite **negrito** e quebras de linha */
  html: function (s) {
    return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; })
      .replace(/^[ \t]*[*-][ \t]+/gm, '• ').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*\n]+)\*/g, '<i>$1</i>').replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  },
  erroTexto: function (e) {
    var m = String(e && e.message || e);
    if (/sem_chave/.test(m)) return 'A IA ainda não foi configurada no servidor.';
    if (/orcamento/.test(m)) return 'O limite de uso da IA deste mês foi atingido. Os exercícios, o áudio e a revisão continuam funcionando.';
    if (/^auth_/.test(m)) return 'Entre novamente com sua conta Google para usar a IA.';
    if (/quota|limite/.test(m)) return 'O limite de uso foi atingido por agora. Tente mais tarde.';
    if (/tempo|AbortError/i.test(m)) return 'A resposta demorou mais que o esperado. Tente novamente em instantes.';
    if (/indisponivel/.test(m)) return 'O serviço de IA está indisponível agora. Seu trabalho continua guardado.';
    if (/abort|Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com a IA agora. Confira a internet e tente de novo.';
    return 'Não consegui falar com a IA agora. Tente de novo.';
  }
};

/* Lembrete diário por notificação (Web Push).
   O app guarda aqui a inscrição de cada aparelho e o horário escolhido.
   Um fluxo do GitHub (.github/workflows/lembretes.yml) pergunta a cada 15 minutos quem precisa de lembrete
   e envia a notificação. Esse fluxo se identifica com LEMBRETE_SEGREDO, gravado no Segredo.gs na publicação
   (nunca versionado) ou na propriedade do script de mesmo nome. */
const ABA_LEMBRETES = 'Lembretes';
const COLS_LEMBRETES = ['endpoint', 'perfil', 'hora', 'fuso', 'ultimoEnvio', 'assinatura', 'criado'];

function abaLembretes_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(ABA_LEMBRETES);
  if (!sh) { sh = ss.insertSheet(ABA_LEMBRETES); sh.appendRow(COLS_LEMBRETES); sh.setFrozenRows(1); }
  return sh;
}
function segredoLembrete_() {
  const s = (typeof LEMBRETE_SEGREDO !== 'undefined' && LEMBRETE_SEGREDO) || PropertiesService.getScriptProperties().getProperty('LEMBRETE_SEGREDO') || '';
  return String(s);
}
function conferirSegredo_(valor) {
  const s = segredoLembrete_(), v = String(valor || '');
  if (s.length < 32 || v.length !== s.length) throw new Error('auth_required');
  let dif = 0; for (let i = 0; i < s.length; i++) dif |= s.charCodeAt(i) ^ v.charCodeAt(i);
  if (dif) throw new Error('auth_required');
}
function validarHora_(h) { if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(h || ''))) throw new Error('hora'); return String(h); }
function validarFuso_(f) { f = String(f || 'America/Sao_Paulo'); try { Utilities.formatDate(new Date(), f, 'HH:mm'); return f; } catch (e) { return 'America/Sao_Paulo'; } }

/* app → servidor (com sessão): liga, muda ou desliga o lembrete deste aparelho */
function lembrete_(q) {
  const a = q.assinatura || {}, endpoint = String(a.endpoint || q.endpoint || '');
  if (!/^https:\/\/[\w.-]+\//.test(endpoint) || endpoint.length > 1000) throw new Error('assinatura');
  const sh = abaLembretes_(), n = sh.getLastRow() - 1, dados = n > 0 ? sh.getRange(2, 1, n, COLS_LEMBRETES.length).getValues() : [];
  const i = dados.findIndex(function (r) { return r[0] === endpoint; });
  if (q.desligar) { if (i >= 0) sh.deleteRow(i + 2); return { ok: true, ligado: false }; }
  if (!a.keys || !a.keys.p256dh || !a.keys.auth) throw new Error('assinatura');
  if (!/^[\w-]{1,60}$/.test(String(q.perfil || ''))) throw new Error('perfil_invalido');
  const linha = [endpoint, String(q.perfil), validarHora_(q.hora), validarFuso_(q.fuso), i >= 0 ? dados[i][4] : '', JSON.stringify({ endpoint: endpoint, keys: { p256dh: String(a.keys.p256dh), auth: String(a.keys.auth) } }), i >= 0 ? dados[i][6] : new Date()];
  if (i >= 0) sh.getRange(i + 2, 1, 1, linha.length).setValues([linha]); else { if (n >= 20) throw new Error('limite'); sh.appendRow(linha); }
  return { ok: true, ligado: true };
}

/* fluxo do GitHub → servidor: quem deve receber o lembrete agora */
function lembretesPendentes_(agora) {
  agora = agora || new Date();
  const sh = abaLembretes_(), n = sh.getLastRow() - 1; if (n < 1) return { envios: [] };
  const dados = sh.getRange(2, 1, n, COLS_LEMBRETES.length).getValues(), perfis = {};
  listar_().forEach(function (p) { perfis[p.id] = p; });
  const envios = [];
  dados.forEach(function (r, i) {
    const fuso = validarFuso_(r[3]), hoje = Utilities.formatDate(agora, fuso, 'yyyy-MM-dd'), hora = Utilities.formatDate(agora, fuso, 'HH:mm');
    const hojeApp = Utilities.formatDate(agora, fuso, 'yyyy-M-d'), p = perfis[r[1]];
    if (!p || String(r[4]) === hoje || hora < String(r[2]) || hora > '23:30') return;
    sh.getRange(i + 2, 5).setValue(hoje);
    if (p.ultimoDia === hojeApp && p.hojeFeito) return;      // já estudou hoje: não incomoda
    envios.push({ assinatura: JSON.parse(r[5]), titulo: 'Idiomas', corpo: mensagemLembrete_(p, agora) });
  });
  return { envios: envios };
}
function mensagemLembrete_(p, agora) {
  const lingua = p.idioma === 'fr' ? 'francês' : 'inglês', nome = String(p.nome || '').split(' ')[0];
  const frases = [
    '5 minutinhos de ' + lingua + ' com a Eco?',
    'Sua revisão do dia está pronta. Bora?',
    (p.sequencia ? 'Sua sequência está em ' + p.sequencia + ' dia' + (p.sequencia > 1 ? 's' : '') + '. Vamos manter?' : 'Que tal uma lição curta hoje?'),
    'Algumas palavras estão quase esquecidas. Uma revisão rápida?'
  ];
  return (nome ? nome + ', ' : '') + frases[agora.getDate() % frases.length].replace(/^./, function (c) { return nome ? c.toLowerCase() : c; });
}
function lembreteRemover_(endpoint) {
  const sh = abaLembretes_(), n = sh.getLastRow() - 1; if (n < 1) return { ok: true };
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) if (ids[i][0] === endpoint) sh.deleteRow(i + 2);
  return { ok: true };
}

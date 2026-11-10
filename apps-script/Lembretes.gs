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

/* A planilha converte sozinha textos como "08:00" e "2026-11-10" em hora e data. Lidos de volta, viram um objeto Date
   e a comparação com texto deixa de funcionar (o lembrete nunca seria enviado). Por isso:
   - ao gravar, o apóstrofo na frente (textoPlanilha_) obriga a célula a guardar texto; a planilha não mostra o apóstrofo;
   - ao ler, horaPlanilha_ e diaPlanilha_ aceitam texto, Date ou número (linhas gravadas antes desta correção). */
function textoPlanilha_(v) { return "'" + String(v); }
function fusoPlanilha_() { try { return SpreadsheetApp.getActive().getSpreadsheetTimeZone() || 'America/Sao_Paulo'; } catch (e) { return 'America/Sao_Paulo'; } }
function horaPlanilha_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, fusoPlanilha_(), 'HH:mm');
  if (typeof v === 'number' && v >= 0 && v < 1) { const m = Math.round(v * 1440) % 1440; return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
  const m = /^'?(\d{1,2}):(\d{2})/.exec(String(v == null ? '' : v).trim());
  return m ? ('0' + m[1]).slice(-2) + ':' + m[2] : '';
}
function diaPlanilha_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, fusoPlanilha_(), 'yyyy-MM-dd');
  return String(v == null ? '' : v).trim().replace(/^'/, '');
}

/* app → servidor (com sessão): liga, muda ou desliga o lembrete deste aparelho */
function lembrete_(q) {
  const a = q.assinatura || {}, endpoint = String(a.endpoint || q.endpoint || '');
  if (!/^https:\/\/[\w.-]+\//.test(endpoint) || endpoint.length > 1000) throw new Error('assinatura');
  const sh = abaLembretes_(), n = sh.getLastRow() - 1, dados = n > 0 ? sh.getRange(2, 1, n, COLS_LEMBRETES.length).getValues() : [];
  const i = dados.findIndex(function (r) { return r[0] === endpoint; });
  if (q.desligar) { if (i >= 0) sh.deleteRow(i + 2); return { ok: true, ligado: false }; }
  if (!a.keys || !a.keys.p256dh || !a.keys.auth) throw new Error('assinatura');
  if (!/^[\w-]{1,60}$/.test(String(q.perfil || ''))) throw new Error('perfil_invalido');
  const enviado = i >= 0 ? diaPlanilha_(dados[i][4]) : '';
  const linha = [endpoint, String(q.perfil), textoPlanilha_(validarHora_(q.hora)), validarFuso_(q.fuso), enviado ? textoPlanilha_(enviado) : '', JSON.stringify({ endpoint: endpoint, keys: { p256dh: String(a.keys.p256dh), auth: String(a.keys.auth) } }), i >= 0 ? dados[i][6] : new Date()];
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
    const marcada = horaPlanilha_(r[2]);                      // sem horário legível, não envia
    if (!p || !marcada || diaPlanilha_(r[4]) === hoje || hora < marcada || hora > '23:30') return;
    sh.getRange(i + 2, 5).setValue(textoPlanilha_(hoje));
    if (p.ultimoDia === hojeApp && p.hojeFeito) return;      // já estudou hoje: não incomoda
    envios.push({ assinatura: JSON.parse(r[5]), titulo: 'Idiomas', corpo: mensagemLembrete_(p, agora) });
  });
  return { envios: envios };
}
function mensagemLembrete_(p, agora) {
  const lingua = p.idioma === 'fr' ? 'francês' : 'inglês', nome = String(p.nome || '').split(' ')[0];
  const frases = [
    '5 minutinhos de ' + lingua + ' com o Eco?',
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

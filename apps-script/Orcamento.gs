/* =====================================================================
 * Controle central de orçamento da IA (etapa 1).
 *
 * - Orçamento total dos dois alunos: US$ 5 por mês, com US$ 4 operacionais e US$ 1 de reserva travada.
 *   O teto financeiro sempre bloqueia; as cotas por aluno seguem ORCAMENTO_MODO ('registrar' ou 'bloquear').
 * - Mês no fuso America/Sao_Paulo. Cada pedido reserva o custo máximo estimado antes da chamada e acerta depois.
 *   Uma reserva continua contando no mês em que foi feita, mesmo que termine depois da virada.
 * - Preços, teto e cotas têm padrão aqui e podem ser trocados pelas propriedades PRECOS, ORCAMENTO e COTAS (JSON),
 *   sem mudar o código. Valores em dólar; tokens por milhão; áudio por minuto ou por hora.
 * - É estimativa: a cobrança real está nas páginas de faturamento de cada empresa.
 * ===================================================================== */
const FUSO_ORCAMENTO = 'America/Sao_Paulo';
const PRECOS_PADRAO = {
  // modelos de texto: dólar por milhão de tokens (entrada, entrada em cache, saída). Planos gratuitos = 0.
  texto: {
    openai: { entrada: 0.10, cache: 0.01, saida: 0.50 },          // gpt-6-luna (developers.openai.com/api/docs/pricing)
    groq: { entrada: 0, cache: 0, saida: 0 },
    github: { entrada: 0, cache: 0, saida: 0 },
    gemini: { entrada: 0, cache: 0, saida: 0 },
    geminiLeve: { entrada: 0, cache: 0, saida: 0 }
  },
  /* modelos da OpenAI grátis por dia (programa de compartilhamento de dados, ativado na organização):
     tokens/dia somando todos os modelos do mesmo grupo. Perto do limite, o app passa para o próximo modelo (pago). */
  gratisDiario: { 'gpt-5.4-mini': { grupo: 'mini', limite: 2500000 }, 'gpt-5-mini': { grupo: 'mini', limite: 2500000 }, 'gpt-5.4': { grupo: 'grande', limite: 250000 } },
  margemGratis: 0.9,
  whisper: { porHora: 0.04, minimoSegundos: 10 },                 // Groq: cobra no mínimo 10 s por arquivo
  whisperGratis: false,                                            // true se a conta da Groq for do plano gratuito
  vozPremium: { textoPorMilhao: 0.50, porMinuto: 0.009, desde2027: { textoPorMilhao: 1.00, porMinuto: 0.018 } }, // Gemini 3.8 Flash-Lite TTS
  geminiLive: { entradaPorMinuto: 0.005, saidaPorMinuto: 0.018 },
  geminiPago: false                                                // chave do Gemini no plano gratuito: tudo do Gemini custa 0
};
const ORCAMENTO_PADRAO = { total: 5, operacional: 4, reserva: 1, alertas: [50, 75, 90, 100], opcionaisAte: 90 };
const COTAS_PADRAO = { textoDia: 60, textoMes: 1200, audioMinDia: 15, audioMinMes: 240, vozMinDia: 3, vozMinMes: 45, liveMinDia: 30, liveMinMes: 450 };
const TIPOS_OPCIONAIS = ['leitura', 'voz'];                        // param em 90% do orçamento

function lerJSONProp_(nome, padrao) {
  try { const v = PropertiesService.getScriptProperties().getProperty(nome); return v ? mesclar_(padrao, JSON.parse(v)) : JSON.parse(JSON.stringify(padrao)); }
  catch (e) { return JSON.parse(JSON.stringify(padrao)); }
}
function mesclar_(a, b) {
  const out = JSON.parse(JSON.stringify(a));
  Object.keys(b || {}).forEach(function (k) { out[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && out[k] && typeof out[k] === 'object') ? mesclar_(out[k], b[k]) : b[k]; });
  return out;
}
function precos_() { return lerJSONProp_('PRECOS', PRECOS_PADRAO); }
function tetos_() { return lerJSONProp_('ORCAMENTO', ORCAMENTO_PADRAO); }
function cotas_() { return lerJSONProp_('COTAS', COTAS_PADRAO); }
function modoCotas_() { return PropertiesService.getScriptProperties().getProperty('ORCAMENTO_MODO') === 'bloquear' ? 'bloquear' : 'registrar'; }
function mesAtual_(agora) { return Utilities.formatDate(agora || new Date(), FUSO_ORCAMENTO, 'yyyy-MM'); }
function diaAtual_(agora) { return Utilities.formatDate(agora || new Date(), FUSO_ORCAMENTO, 'yyyy-MM-dd'); }
function arred_(v) { return Math.round(v * 1e6) / 1e6; }

/* ---------- preços de cada operação ---------- */
function precoTexto_(servico, entrada, saida, cache, modelo) {
  const P = precos_(), t = P.texto[servico];
  if (modelo && P.gratisDiario[modelo]) return 0;   // dentro do limite grátis diário (controlado por gratisDisponivel_)
  if (!t || (/^gemini/.test(servico) && !P.geminiPago)) return 0;
  const novos = Math.max(0, (entrada || 0) - (cache || 0));
  return arred_((novos * t.entrada + (cache || 0) * t.cache + (saida || 0) * t.saida) / 1e6);
}
function segundosCobradosWhisper_(segundos) { return Math.max(precos_().whisper.minimoSegundos, Math.ceil(segundos || 0)); }
function precoWhisper_(segundos) { const P = precos_(); return P.whisperGratis ? 0 : arred_(segundosCobradosWhisper_(segundos) / 3600 * P.whisper.porHora); }
/* duração aproximada a partir do tamanho: Opus/AAC de voz fica perto de 2–4 KB/s; 2 KB/s superestima de propósito */
function segundosDoAudio_(bytes) { return Math.max(1, Math.ceil((bytes || 0) / 2000)); }
function precoVozPremium_(segundosAudio, tokensTexto, agora) {
  const P = precos_(); if (!P.geminiPago) return 0;
  const v = (agora || new Date()) >= new Date('2027-01-01T03:00:00Z') ? P.vozPremium.desde2027 : P.vozPremium;
  return arred_(segundosAudio / 60 * v.porMinuto + (tokensTexto || 0) * v.textoPorMilhao / 1e6);
}
function precoLive_(minutos) { const P = precos_(); return P.geminiPago ? arred_(minutos * (P.geminiLive.entradaPorMinuto + P.geminiLive.saidaPorMinuto)) : 0; }

/* ---------- estado do mês (propriedade ORC_aaaa-mm) ---------- */
function lerMes_(mes) {
  let o; try { o = JSON.parse(PropertiesService.getScriptProperties().getProperty('ORC_' + mes) || 'null'); } catch (e) { o = null; }
  o = o || {}; o.mes = mes; o.gasto = o.gasto || 0; o.reservas = o.reservas || {}; o.porServico = o.porServico || {}; o.alunos = o.alunos || {}; o.alertas = o.alertas || []; o.bloqueios = o.bloqueios || 0;
  return o;
}
function gravarMes_(o) { PropertiesService.getScriptProperties().setProperty('ORC_' + o.mes, JSON.stringify(o)); }
function reservado_(o) { return Object.keys(o.reservas).reduce(function (s, k) { return s + (o.reservas[k].valor || 0); }, 0); }
function aluno_(o, user, dia) {
  const a = o.alunos[user.sub] = o.alunos[user.sub] || { email: user.email || '', gasto: 0, texto: 0, audioSeg: 0, vozSeg: 0, liveMin: 0, dias: {} };
  if (dia) { a.dias[dia] = a.dias[dia] || { texto: 0, audioSeg: 0, vozSeg: 0, liveMin: 0, gasto: 0 }; Object.keys(a.dias).sort().slice(0, -35).forEach(function (d) { delete a.dias[d]; }); }
  return a;
}
function comLock_(fn) { const lk = LockService.getScriptLock(); lk.waitLock(15000); try { return fn(); } finally { lk.releaseLock(); } }

/* reservas esquecidas (o pedido caiu no meio) viram gasto pelo valor estimado: é o lado seguro */
function vencerReservas_(o, agora) {
  Object.keys(o.reservas).forEach(function (id) { const r = o.reservas[id]; if (agora - r.em > 15 * 60000) { o.gasto += r.valor; o.porServico.vencidas = (o.porServico.vencidas || 0) + r.valor; delete o.reservas[id]; } });
}
function registrarAlertas_(o, T) {
  const pct = 100 * (o.gasto + reservado_(o)) / T.operacional;
  T.alertas.forEach(function (lim) { if (pct >= lim && o.alertas.indexOf(lim) < 0) { o.alertas.push(lim); registrar_('orcamento', 'alerta', lim + '%', true, 0, 'Uso estimado chegou a ' + lim + '% do orçamento operacional'); } });
}

/**
 * Antes de cada chamada de IA. uso = { texto: n, audioSeg: s, vozSeg: s, liveMin: m }, valor = custo máximo estimado (US$).
 * Devolve um identificador de reserva. Erros: 'orcamento' (teto financeiro) e 'quota' (cota do aluno, no modo bloquear).
 */
function reservar_(user, tipo, valor, uso, agora) {
  agora = agora || new Date(); uso = uso || {}; valor = Math.max(0, valor || 0);
  return comLock_(function () {
    const T = tetos_(), C = cotas_(), mes = mesAtual_(agora), dia = diaAtual_(agora), o = lerMes_(mes);
    vencerReservas_(o, agora.getTime());
    const comprometido = o.gasto + reservado_(o), pct = 100 * comprometido / T.operacional;
    if (valor > 0 && comprometido + valor > T.operacional) { o.bloqueios++; gravarMes_(o); throw new Error('orcamento'); }
    if (valor > 0 && TIPOS_OPCIONAIS.indexOf(tipo) >= 0 && pct >= T.opcionaisAte) { o.bloqueios++; gravarMes_(o); throw new Error('orcamento'); }
    const a = aluno_(o, user, dia), d = a.dias[dia], estoura = [];
    if (uso.texto && (d.texto + uso.texto > C.textoDia || a.texto + uso.texto > C.textoMes)) estoura.push('texto');
    if (uso.audioSeg && (d.audioSeg + uso.audioSeg > C.audioMinDia * 60 || a.audioSeg + uso.audioSeg > C.audioMinMes * 60)) estoura.push('audio');
    if (uso.vozSeg && (d.vozSeg + uso.vozSeg > C.vozMinDia * 60 || a.vozSeg + uso.vozSeg > C.vozMinMes * 60)) estoura.push('voz');
    if (uso.liveMin && (d.liveMin + uso.liveMin > C.liveMinDia || a.liveMin + uso.liveMin > C.liveMinMes)) estoura.push('live');
    if (estoura.length) {
      registrar_('orcamento', 'cota', estoura.join(','), modoCotas_() !== 'bloquear', 0, (user.email || user.sub) + ' passou da cota (' + modoCotas_() + ')');
      if (modoCotas_() === 'bloquear') { o.bloqueios++; gravarMes_(o); throw new Error('quota'); }
    }
    const id = Utilities.getUuid();
    o.reservas[id] = { valor: valor, sub: user.sub, tipo: tipo, em: agora.getTime(), uso: uso, dia: dia };
    registrarAlertas_(o, T); gravarMes_(o);
    return mes + '|' + id;
  });
}
/** Depois da chamada: custo real (ou estimado com o que a resposta informou) e linhas de detalhe para a aba Custos. */
function confirmar_(reserva, user, custo, uso, linhas) {
  const p = String(reserva || '').split('|'), mes = p[0], id = p[1];
  return comLock_(function () {
    const o = lerMes_(mes), r = o.reservas[id]; if (!r) return;
    delete o.reservas[id]; custo = Math.max(0, custo || 0); uso = uso || r.uso || {};
    const a = aluno_(o, user, r.dia), d = a.dias[r.dia];
    o.gasto = arred_(o.gasto + custo); a.gasto = arred_(a.gasto + custo); d.gasto = arred_(d.gasto + custo);
    ['texto', 'audioSeg', 'vozSeg', 'liveMin'].forEach(function (k) { if (uso[k]) { a[k] += uso[k]; d[k] += uso[k]; } });
    (linhas || []).forEach(function (l) { o.porServico[l.servico] = arred_((o.porServico[l.servico] || 0) + (l.custo || 0)); });
    registrarAlertas_(o, tetos_()); gravarMes_(o);
    anotarCustos_(mes, user, r.tipo, linhas || []);
  });
}
function liberar_(reserva) {
  const p = String(reserva || '').split('|');
  return comLock_(function () { const o = lerMes_(p[0]); if (o.reservas[p[1]]) { delete o.reservas[p[1]]; gravarMes_(o); } });
}
function anotarCustos_(mes, user, tipo, linhas) {
  if (!linhas.length) return;
  try {
    const ss = SpreadsheetApp.getActive(); let sh = ss.getSheetByName('Custos');
    if (!sh) { sh = ss.insertSheet('Custos'); sh.appendRow(['quando', 'mes', 'conta', 'tipo', 'servico', 'modelo', 'tokens_entrada', 'tokens_cache', 'tokens_saida', 'segundos_cobrados', 'custo_estimado_usd']); sh.setFrozenRows(1); }
    const agora = new Date();
    linhas.forEach(function (l) { sh.appendRow([agora, mes, user.email || user.sub, tipo, l.servico, l.modelo || '', l.entrada || 0, l.cache || 0, l.saida || 0, l.segundos || 0, l.custo || 0]); });
    if (sh.getLastRow() > 20000) sh.deleteRows(2, 5000);
  } catch (e) {}
}
/** Resumo para o painel do administrador (etapa 3). */
function estadoOrcamento_(agora) {
  const T = tetos_(), o = lerMes_(mesAtual_(agora)), res = reservado_(o);
  return { mes: o.mes, gasto: arred_(o.gasto), reservado: arred_(res), operacional: T.operacional, reserva: T.reserva, total: T.total,
    usoPct: Math.round(1000 * (o.gasto + res) / T.operacional) / 10, porServico: o.porServico, alunos: o.alunos, alertas: o.alertas, bloqueios: o.bloqueios, modoCotas: modoCotas_(), estimado: true };
}

/* ---------- contabilidade de um pedido em andamento (preenchida por chamar_, transcrever_ e pronuncia_) ---------- */
let GASTO_ = null;
function iniciarGasto_() { GASTO_ = { custo: 0, linhas: [], uso: { texto: 0, audioSeg: 0, vozSeg: 0, liveMin: 0 } }; }
function anotarTexto_(servico, modelo, u) {
  if (!GASTO_) return; u = u || {};
  const custo = precoTexto_(servico, u.entrada, u.saida, u.cache, modelo);
  if (precos_().gratisDiario[modelo]) somarGratis_(modelo, (u.entrada || 0) + (u.saida || 0));
  GASTO_.custo += custo; GASTO_.uso.texto += 1;
  GASTO_.linhas.push({ servico: servico, modelo: modelo, entrada: u.entrada || 0, cache: u.cache || 0, saida: u.saida || 0, custo: custo });
}
function anotarWhisper_(modelo, bytes) {
  if (!GASTO_) return;
  const seg = segundosDoAudio_(bytes), cobrados = segundosCobradosWhisper_(seg), custo = precoWhisper_(seg);
  GASTO_.custo += custo; GASTO_.uso.audioSeg += cobrados;
  GASTO_.linhas.push({ servico: 'groq-whisper', modelo: modelo, segundos: cobrados, custo: custo });
}
function anotarGeminiAudio_(modelo, bytes) {           // transcrição pelo Gemini (reserva): plano gratuito = 0
  if (!GASTO_) return;
  const seg = segundosDoAudio_(bytes); GASTO_.uso.audioSeg += seg;
  GASTO_.linhas.push({ servico: 'gemini-transcricao', modelo: modelo, segundos: seg, custo: 0 });
}

/* limite grátis diário da OpenAI (dia em UTC, como a OpenAI conta) */
function chaveGratis_(modelo, agora) { const g = precos_().gratisDiario[modelo]; return 'GRATIS_' + Utilities.formatDate(agora || new Date(), 'UTC', 'yyyy-MM-dd') + '_' + g.grupo; }
function gratisDisponivel_(modelo, agora) {
  const P = precos_(), g = P.gratisDiario[modelo]; if (!g) return true;
  const usado = Number(PropertiesService.getScriptProperties().getProperty(chaveGratis_(modelo, agora)) || 0);
  return usado + 6000 < g.limite * P.margemGratis;          // 6.000 = pior caso de um pedido
}
function somarGratis_(modelo, tokens, agora) {
  try { comLock_(function () { const props = PropertiesService.getScriptProperties(), k = chaveGratis_(modelo, agora);
    props.setProperty(k, String(Number(props.getProperty(k) || 0) + tokens));
    props.getKeys().forEach(function (x) { if (/^GRATIS_/.test(x) && x.slice(7, 17) < Utilities.formatDate(new Date(Date.now() - 3 * 86400000), 'UTC', 'yyyy-MM-dd')) props.deleteProperty(x); }); }); } catch (e) {}
}

/* estimativa conservadora antes da chamada (pior caso: o provedor pago mais caro da rota responde com o máximo de saída) */
const TIPOS_TEXTO = ['explicar', 'duvida', 'redacao', 'conversa', 'conversaResumo', 'revisao', 'leitura', 'traduzir'];
function estimarPedido_(tipo, dados) {
  const tamanho = JSON.stringify(dados || {}).length;
  if (tipo === 'liveToken') return { valor: precoLive_(15), uso: { liveMin: 15 } };
  if (tipo === 'pronuncia' || (tipo === 'conversa' && dados && dados.audio)) {
    const bytes = Math.floor(String(dados.audio || '').length * 3 / 4), seg = segundosDoAudio_(bytes);
    const texto = tipo === 'conversa' ? estimarTexto_('conversa', tamanho - String(dados.audio || '').length) : estimarTexto_('pronunciaTexto', 2000);
    return { valor: arred_(precoWhisper_(seg) + texto), uso: { audioSeg: segundosCobradosWhisper_(seg), texto: tipo === 'conversa' ? 1 : 0 } };
  }
  if (TIPOS_TEXTO.indexOf(tipo) >= 0) return { valor: estimarTexto_(tipo, tamanho), uso: { texto: 1 } };
  return { valor: 0, uso: {} };
}
function estimarTexto_(tipo, tamanho) {
  const entrada = Math.ceil(Math.max(0, tamanho) / 3) + 2500, saida = 4000;   // até 4.000 de saída (o maior limite usado nas chamadas)
  return rotas_(tipo).reduce(function (m, s) { return Math.max(m, precoTexto_(s, entrada, saida, 0)); }, 0);
}

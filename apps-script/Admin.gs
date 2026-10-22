/* =====================================================================
 * Painel do administrador, sessão única de conversa por aluno e voz premium.
 * ===================================================================== */
const ADMIN_PADRAO = 'gabriel.luiz.adv@gmail.com';
function ehAdmin_(user) {
  const v = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS');
  const lista = String(v == null ? ADMIN_PADRAO : v).toLowerCase().split(/[;,\s]+/).filter(Boolean);
  return !!user && lista.indexOf(String(user.email || '').toLowerCase()) >= 0;
}
const NOMES_SERVICO = { openai: 'OpenAI (gpt-5.4-mini grátis, depois GPT-6 Luna)', groq: 'Groq (grátis)', gemini: 'Gemini (grátis)', geminiLeve: 'Gemini Flash-Lite (grátis)', github: 'GitHub Models (grátis)' };

function admin_(user, q) {
  const op = String(q.op || 'eu');
  if (op === 'eu') return { admin: ehAdmin_(user) };
  if (!ehAdmin_(user)) throw new Error('nao_admin');
  const props = PropertiesService.getScriptProperties();
  if (op === 'config') {
    const c = q.config || {};
    if (c.principal != null) { if (!SERVICOS[c.principal]) throw new Error('config'); props.setProperty('IA_PRINCIPAL', c.principal); }
    if (Array.isArray(c.fallback)) props.setProperty('IA_FALLBACK', c.fallback.filter(function (s) { return SERVICOS[s]; }).join(','));
    if (c.modo != null) props.setProperty('ORCAMENTO_MODO', c.modo === 'bloquear' ? 'bloquear' : 'registrar');
    if (c.cotas && typeof c.cotas === 'object') {
      const atual = lerJSONProp_('COTAS', {}), novas = {};
      Object.keys(COTAS_PADRAO).forEach(function (k) { if (c.cotas[k] != null) { const n = Math.floor(Number(c.cotas[k])); if (!(n >= 0 && n <= 100000)) throw new Error('config'); novas[k] = n; } });
      props.setProperty('COTAS', JSON.stringify(Object.assign(atual, novas)));
    }
    if (c.usarReserva != null) props.setProperty('ORCAMENTO', JSON.stringify(Object.assign(lerJSONProp_('ORCAMENTO', {}), { operacional: c.usarReserva ? 5 : 4 })));
    if (c.whisperGratis != null) props.setProperty('PRECOS', JSON.stringify(Object.assign(lerJSONProp_('PRECOS', {}), { whisperGratis: !!c.whisperGratis })));
    registrar_('admin', 'config', '', true, 0, (user.email || '') + ' mudou: ' + Object.keys(c).join(','));
  }
  const cfg = configIA_(), P = precos_();
  const gratis = {}; Object.keys(P.gratisDiario).forEach(function (m) { const g = P.gratisDiario[m]; gratis[g.grupo] = { usado: Number(props.getProperty(chaveGratis_(m)) || 0), limite: g.limite }; });
  return {
    orcamento: estadoOrcamento_(), gratisHoje: gratis,
    config: { principal: cfg.principal, fallback: cfg.fallback || rotas_('conversa').slice(1), modo: modoCotas_(), cotas: cotas_(), usarReserva: tetos_().operacional > 4,
      geminiPago: !!P.geminiPago, whisperGratis: !!P.whisperGratis,
      servicos: Object.keys(SERVICOS).map(function (k) { return { id: k, nome: NOMES_SERVICO[k] || k, pago: !!SERVICOS[k].pago, ativo: !!props.getProperty(SERVICOS[k].chave) }; }) }
  };
}

/* ---------- uma conversa ativa por aluno (por turnos ou ao vivo) ----------
   O app avisa a cada minuto; sem aviso por 3 minutos, a sessão é considerada encerrada. Máximo de 15 minutos. */
const SESSAO_CONVERSA_MS = 15 * 60000, SESSAO_SILENCIO_MS = 3 * 60000;
function sessaoConversa_(user, q) {
  const op = String(q.op || ''), id = String(q.id || ''), agora = Date.now();
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('operacao_invalida');
  const cache = CacheService.getScriptCache(), k = 'conv:' + user.sub;
  return comLock_(function () {
    let s = null; try { s = JSON.parse(cache.get(k) || 'null'); } catch (e) {}
    const viva = s && agora - s.ultimo < SESSAO_SILENCIO_MS && agora < s.expira;
    if (op === 'iniciar') {
      if (viva && s.id !== id && !q.assumir) return { ok: false, motivo: 'outra_sessao' };
      s = { id: id, inicio: agora, ultimo: agora, expira: agora + SESSAO_CONVERSA_MS, modo: String(q.modo || '') };
      cache.put(k, JSON.stringify(s), 1200); return { ok: true, expira: s.expira };
    }
    if (op === 'ping') {
      if (!s || s.id !== id) return { ok: false, motivo: 'assumida' };
      if (agora >= s.expira) { cache.remove(k); return { ok: false, motivo: 'tempo' }; }
      s.ultimo = agora; cache.put(k, JSON.stringify(s), 1200); return { ok: true, expira: s.expira };
    }
    if (op === 'fim') { if (s && s.id === id) cache.remove(k); return { ok: true }; }
    throw new Error('operacao_invalida');
  });
}

/* ---------- voz premium (Gemini 3.8 Flash-Lite TTS) ---------- */
const VOZ_MODELO = 'gemini-3.8-flash-lite-tts';
function segundosFala_(texto) { return Math.max(2, Math.ceil(String(texto || '').split(/\s+/).filter(Boolean).length / 2.3)); }
function voz_(d) {
  const texto = String(d.texto || '').replace(/\s+/g, ' ').trim().slice(0, 600); if (!texto) throw new Error('texto');
  const chave = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'); if (!chave) throw new Error('sem_chave');
  const voz = d.idioma === 'fr' ? 'Leda' : 'Kore', t0 = Date.now();
  const corpo = { contents: [{ role: 'user', parts: [{ text: texto }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voz } } } } };
  const r = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + VOZ_MODELO + ':generateContent',
    { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': chave }, payload: JSON.stringify(corpo) });
  const code = r.getResponseCode(), txt = r.getContentText();
  registrar_('voz', 'gemini', VOZ_MODELO, code === 200, Date.now() - t0, code === 200 ? '' : txt.slice(0, 160));
  if (code !== 200) throw new Error(code === 429 ? 'limite' : 'indisponivel');
  const parte = (((JSON.parse(txt).candidates || [])[0] || {}).content || {}).parts || [], dado = parte.filter(function (p) { return p.inlineData; })[0];
  if (!dado) throw new Error('indisponivel');
  const b64 = dado.inlineData.data, seg = Math.ceil(b64.length * 3 / 4 / 48000);   // PCM 16 bits, 24 kHz
  if (GASTO_) { const custo = precoVozPremium_(seg, Math.ceil(texto.length / 4)); GASTO_.custo += custo; GASTO_.uso.vozSeg += seg; GASTO_.linhas.push({ servico: 'gemini-tts', modelo: VOZ_MODELO, segundos: seg, custo: custo }); }
  return { audio: b64, taxa: 24000, segundos: seg };
}

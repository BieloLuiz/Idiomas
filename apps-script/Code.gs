/**
 * Idiomas — servidor (Google Apps Script)
 * Guarda os perfis e o progresso do app na aba "Perfis" desta planilha e faz as chamadas de IA.
 *
 * Chaves (Configurações do projeto → Propriedades do script). Nenhuma é obrigatória; sem chave, o serviço é pulado:
 *   GROQ_API_KEY         console.groq.com/keys
 *   GITHUB_MODELS_TOKEN  github.com/settings/personal-access-tokens (fine-grained, permissão "Models: read")
 *   GEMINI_API_KEY       aistudio.google.com/apikey
 * Opcionais, para trocar modelos sem mexer no código (separe por vírgula):
 *   GROQ_MODELOS, GITHUB_MODELOS, GEMINI_MODELOS, GEMINI_LEVE
 *
 * Este arquivo é publicado sozinho pelo GitHub (.github/workflows/publicar.yml).
 */
const ABA = 'Perfis';
const COLS = ['id', 'nome', 'atualizado', 'atualizadoMs', 'json'];
const MAX_PERFIS = 4;
const PEDACO = 45000;   // limite seguro por célula; perfis maiores ocupam as colunas seguintes

function doGet() { return saida_({ ok: true, app: 'Idiomas', perfis: Math.max(0, aba_().getLastRow() - 1), ia: servicosAtivos_() }); }

function doPost(e) {
  let q = {};
  try { q = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return saida_({ erro: 'json' }); }
  if (q.acao === 'ia') {                      // IA não precisa travar a planilha
    try { return saida_(ia_(String(q.tipo || ''), q.dados || {})); }
    catch (err) { return saida_({ erro: String(err && err.message || err) }); }
  }
  if (q.acao === 'iaUso') return saida_({ uso: usoHoje_(), servicos: servicosAtivos_() });
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (q.acao === 'listar') return saida_({ perfis: listar_() });
    if (q.acao === 'salvar') { (Array.isArray(q.perfis) ? q.perfis : [q.perfil]).slice(0, MAX_PERFIS).forEach(salvar_); return saida_({ ok: true }); }
    return saida_({ erro: 'acao' });
  } catch (err) {
    return saida_({ erro: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/* =====================================================================
 * Perfis
 * ===================================================================== */
function aba_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(ABA);
  if (!sh) { sh = ss.insertSheet(ABA); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}

function listar_() {
  const sh = aba_(), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const larg = Math.max(COLS.length, sh.getLastColumn());
  return sh.getRange(2, 1, n, larg).getValues()
    .map(function (r) { try { return JSON.parse(r.slice(4).join('')); } catch (e) { return null; } })
    .filter(function (p) { return p && p.id; });
}

function salvar_(p) {
  if (!p || !/^[\w-]{1,60}$/.test(String(p.id || ''))) throw new Error('perfil inválido');
  const json = JSON.stringify(p);
  if (json.length > PEDACO * 6) throw new Error('perfil grande demais');
  const pedacos = []; for (let i = 0; i < json.length; i += PEDACO) pedacos.push(json.slice(i, i + PEDACO));
  const sh = aba_(), n = sh.getLastRow() - 1, ms = Number(p.atualizado) || Date.now();
  const linha = [String(p.id), String(p.nome || '').slice(0, 40), new Date(ms), ms].concat(pedacos);
  let row = 0;
  if (n > 0) {
    const ids = sh.getRange(2, 1, n, 4).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(p.id)) {
        if (Number(ids[i][3]) > ms) return;          // a planilha já tem uma versão mais nova
        row = i + 2; break;
      }
    }
    if (!row && n >= MAX_PERFIS) throw new Error('limite de perfis');
  }
  if (!row) row = sh.getLastRow() + 1;
  const larg = Math.max(sh.getLastColumn(), linha.length);
  sh.getRange(row, 1, 1, larg).clearContent();
  sh.getRange(row, 1, 1, linha.length).setValues([linha]);
}

/* =====================================================================
 * IA: cada tipo de pedido tem uma ordem de serviços. Se um falhar ou
 * bater no limite, o próximo assume.
 * ===================================================================== */
const SERVICOS = {
  groq:       { tipo: 'openai', url: 'https://api.groq.com/openai/v1/chat/completions', chave: 'GROQ_API_KEY', prop: 'GROQ_MODELOS', modelos: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'] },
  github:     { tipo: 'openai', url: 'https://models.github.ai/inference/chat/completions', chave: 'GITHUB_MODELS_TOKEN', prop: 'GITHUB_MODELOS', modelos: ['openai/gpt-4o', 'openai/gpt-4.1-mini'] },
  gemini:     { tipo: 'gemini', chave: 'GEMINI_API_KEY', prop: 'GEMINI_MODELOS', modelos: ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3-flash-preview'] },
  geminiLeve: { tipo: 'gemini', chave: 'GEMINI_API_KEY', prop: 'GEMINI_LEVE', modelos: ['gemini-3.5-flash-lite'] }
};
const ROTAS = {
  explicar: ['groq', 'geminiLeve', 'github', 'gemini'],
  duvida:   ['groq', 'geminiLeve', 'github', 'gemini'],
  redacao:  ['gemini', 'github', 'groq', 'geminiLeve'],
  pronunciaTexto: ['groq', 'geminiLeve', 'github', 'gemini']
};
const IDIOMA = { en: 'inglês', fr: 'francês' };

function servicosAtivos_() {
  const props = PropertiesService.getScriptProperties();
  return Object.keys(SERVICOS).filter(function (k) { return !!props.getProperty(SERVICOS[k].chave); });
}

function ia_(tipo, d) {
  if (tipo === 'pronuncia') return pronuncia_(d);
  if (!ROTAS[tipo]) throw new Error('tipo');
  const idioma = IDIOMA[d.idioma] || 'inglês';
  let p;
  if (tipo === 'explicar') p = promptExplicar_(idioma, d);
  else if (tipo === 'duvida') p = promptDuvida_(idioma, d);
  else p = promptRedacao_(idioma, d);

  if (tipo === 'explicar') {                  // a mesma explicação serve de novo: economiza cota
    const ck = 'exp_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, p.usuario)).slice(0, 22);
    const c = CacheService.getScriptCache().get(ck);
    if (c) return { texto: c, provedor: 'cache' };
    const r = chamar_(tipo, p);
    try { CacheService.getScriptCache().put(ck, r.texto, 21600); } catch (e) {}
    return r;
  }
  const r = chamar_(tipo, p);
  if (tipo === 'redacao') return { dados: limparRedacao_(r.texto, String(d.texto || '')), provedor: r.provedor };
  return r;
}

function chamar_(tipo, p) {
  const props = PropertiesService.getScriptProperties(), falhas = [];
  for (const nome of ROTAS[tipo]) {
    const s = SERVICOS[nome], chave = props.getProperty(s.chave);
    if (!chave) continue;
    const modelos = (props.getProperty(s.prop) || '').split(',').map(function (x) { return x.trim(); }).filter(String);
    for (const modelo of (modelos.length ? modelos : s.modelos)) {
      const t0 = Date.now();
      try {
        const texto = s.tipo === 'gemini' ? gemini_(chave, modelo, p) : openai_(s.url, chave, modelo, p);
        registrar_(tipo, nome, modelo, true, Date.now() - t0);
        return { texto: texto, provedor: nome + ':' + modelo };
      } catch (err) {
        const msg = String(err && err.message || err);
        registrar_(tipo, nome, modelo, false, Date.now() - t0, msg);
        falhas.push(nome + ':' + modelo + ' → ' + msg.slice(0, 80));
        if (/^(401|403)/.test(msg)) break;     // chave errada: nem tenta os outros modelos deste serviço
      }
    }
  }
  if (!falhas.length) throw new Error('sem_chave');
  throw new Error('limite: ' + falhas.join(' | '));
}

function openai_(url, chave, modelo, p) {
  const corpo = { model: modelo, temperature: p.json ? 0.2 : 0.4, max_tokens: p.json ? 3000 : 900,
    messages: [{ role: 'system', content: p.sistema }].concat(p.historico || []).concat([{ role: 'user', content: p.usuario }]) };
  if (p.json) corpo.response_format = { type: 'json_object' };
  const r = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + chave }, payload: JSON.stringify(corpo) });
  const code = r.getResponseCode(), txt = r.getContentText();
  if (code !== 200) throw new Error(code + ' ' + txt.slice(0, 160));
  const out = JSON.parse(txt), m = out.choices && out.choices[0] && out.choices[0].message;
  const texto = m && (m.content || '').trim();
  if (!texto) throw new Error('vazio');
  return texto;
}

function gemini_(chave, modelo, p) {
  const contents = (p.historico || []).map(function (m) { return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }; })
    .concat([{ role: 'user', parts: [{ text: p.usuario }] }]);
  const corpo = { systemInstruction: { parts: [{ text: p.sistema }] }, contents: contents,
    generationConfig: { temperature: p.json ? 0.2 : 0.4, maxOutputTokens: p.json ? 4000 : 1200 } };
  if (p.json) corpo.generationConfig.responseMimeType = 'application/json';
  const r = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelo) + ':generateContent',
    { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': chave }, payload: JSON.stringify(corpo) });
  const code = r.getResponseCode(), txt = r.getContentText();
  if (code !== 200) throw new Error(code + ' ' + txt.slice(0, 160));
  const out = JSON.parse(txt), c = out.candidates && out.candidates[0];
  const texto = c && c.content && (c.content.parts || []).map(function (x) { return x.text || ''; }).join('').trim();
  if (!texto) throw new Error('vazio');
  return texto;
}

/* ---------- prompts ---------- */
function promptExplicar_(idioma, d) {
  const sistema = 'Você é o Eco, professor de ' + idioma + ' para brasileiros adultos (nível ' + (d.nivel || 'básico') + '). ' +
    'O aluno errou um exercício. Explique em português do Brasil, em no máximo 3 frases curtas e diretas: por que a resposta dele não serve e por que a certa está certa. ' +
    'Se a resposta do aluno também estiver correta ou for aceitável, diga isso com honestidade. Cite a regra de gramática quando houver. ' +
    'Pode usar **negrito** só em palavras ou expressões curtas no idioma, nunca em frases inteiras e nunca um negrito dentro de outro. Não use títulos, tabelas, listas nem saudações.';
  const usuario = [
    'Unidade: ' + (d.unidade || '-'),
    'Enunciado: ' + (d.enunciado || '-'),
    'Frase do exercício: ' + (d.frase || '-'),
    d.opcoes ? 'Opções: ' + [].concat(d.opcoes).join(' | ') : '',
    'Resposta do aluno: ' + (d.dada || '(não informada)'),
    'Resposta certa: ' + (d.correta || '-')
  ].filter(String).join('\n').slice(0, 2000);
  return { sistema: sistema, usuario: usuario };
}

function promptDuvida_(idioma, d) {
  const sistema = 'Você é o Eco, professor de ' + idioma + ' para brasileiros adultos. O aluno está no nível ' + (d.nivel || 'A1') +
    ', na unidade "' + (d.unidade || '') + '" (objetivo: ' + (d.objetivo || '') + '). ' +
    'Responda dúvidas sobre o idioma em português do Brasil, de forma clara e curta (até 150 palavras), com 1 a 3 exemplos no idioma e a tradução. ' +
    'Adapte a explicação ao nível do aluno. Use **negrito** só em palavras ou expressões curtas no idioma, nunca em frases inteiras e nunca um negrito dentro de outro. Sem títulos nem tabelas; listas simples com "- " são permitidas. ' +
    'Se a pergunta não tiver relação com estudar idiomas, diga com gentileza que só ajuda com o curso.';
  const hist = (Array.isArray(d.historico) ? d.historico : []).slice(-8)
    .map(function (m) { return { role: m.de === 'eco' ? 'assistant' : 'user', content: String(m.texto || '').slice(0, 1500) }; });
  return { sistema: sistema, historico: hist, usuario: String(d.pergunta || '').slice(0, 1500) };
}

function promptRedacao_(idioma, d) {
  const sistema = 'Você é o Eco, professor de ' + idioma + ' para brasileiros adultos. Corrija a redação do aluno, nível ' + (d.nivel || 'A1') + '. ' +
    'Seja justo com o nível: não corrija estilo que já está correto. Responda SOMENTE com um objeto JSON, sem texto fora dele, neste formato: ' +
    '{"corrigido": "o texto inteiro corrigido, mantendo as ideias do aluno", ' +
    '"nota": número de 0 a 10 com uma casa decimal, considerando o nível, ' +
    '"resumo": "1 ou 2 frases em português: o que ficou bom e o principal ponto a melhorar", ' +
    '"erros": [{"trecho": "cópia EXATA de um trecho curto do texto do aluno que tem erro", "correcao": "como fica corrigido", "explicacao": "explicação curta em português"}]}. ' +
    'No máximo 8 erros, os mais importantes, na ordem em que aparecem no texto. Se não houver erros, use "erros": [].';
  const usuario = 'Tema da unidade: ' + (d.unidade || '-') + '\nTarefa: ' + (d.tarefa || d.objetivo || '-') + '\n\nTexto do aluno:\n' + String(d.texto || '').slice(0, 5000);
  return { sistema: sistema, usuario: usuario, json: true };
}

function limparRedacao_(txt, original) {
  let o;
  try { o = JSON.parse(txt); } catch (e) {
    const m = String(txt).match(/\{[\s\S]*\}/); if (!m) throw new Error('resposta_invalida');
    o = JSON.parse(m[0]);
  }
  const erros = (Array.isArray(o.erros) ? o.erros : []).filter(function (e) { return e && e.trecho && original.indexOf(String(e.trecho)) >= 0; })
    .slice(0, 8).map(function (e) { return { trecho: String(e.trecho), correcao: String(e.correcao || ''), explicacao: String(e.explicacao || '') }; });
  erros.sort(function (a, b) { return original.indexOf(a.trecho) - original.indexOf(b.trecho); });
  const nota = Number(o.nota);
  return { corrigido: String(o.corrigido || original), nota: isFinite(nota) ? Math.max(0, Math.min(10, Math.round(nota * 10) / 10)) : null,
    resumo: String(o.resumo || ''), erros: erros };
}


/* =====================================================================
 * Pronúncia: transcreve a gravação (Groq Whisper) e compara com a frase.
 * Sem Groq, o Gemini ouve o áudio direto.
 * ===================================================================== */
const STT_MODELOS = ['whisper-large-v3-turbo', 'whisper-large-v3'];
function pronuncia_(d) {
  const b64 = String(d.audio || ''), frase = String(d.frase || '').slice(0, 400), lang = d.idioma === 'fr' ? 'fr' : 'en';
  if (!b64 || b64.length > 4000000) throw new Error('audio');
  const mime = String(d.mime || 'audio/webm').split(';')[0];
  const ext = { 'audio/webm': 'webm', 'audio/mp4': 'mp4', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-m4a': 'm4a' }[mime] || 'webm';
  const bytes = Utilities.base64Decode(b64), props = PropertiesService.getScriptProperties(), falhas = [];
  const groq = props.getProperty('GROQ_API_KEY');
  if (groq) {
    const modelos = (props.getProperty('GROQ_STT') || '').split(',').map(function (x) { return x.trim(); }).filter(String);
    for (const modelo of (modelos.length ? modelos : STT_MODELOS)) {
      const t0 = Date.now();
      try {
        const r = UrlFetchApp.fetch('https://api.groq.com/openai/v1/audio/transcriptions', { method: 'post', muteHttpExceptions: true,
          headers: { Authorization: 'Bearer ' + groq },
          payload: { file: Utilities.newBlob(bytes, mime, 'fala.' + ext), model: modelo, language: lang, response_format: 'json', temperature: '0' } });
        const code = r.getResponseCode(), txt = r.getContentText();
        if (code !== 200) throw new Error(code + ' ' + txt.slice(0, 160));
        const ouvido = String(JSON.parse(txt).text || '').trim();
        registrar_('pronuncia', 'groq', modelo, true, Date.now() - t0);
        let dica = '', prov = 'groq:' + modelo;
        try { const f = chamar_('pronunciaTexto', promptPronuncia_(lang, frase, ouvido)); dica = f.texto; prov += ' + ' + f.provedor; } catch (e) {}
        return { ouvido: ouvido, dica: dica, provedor: prov };
      } catch (err) {
        const msg = String(err && err.message || err);
        registrar_('pronuncia', 'groq', modelo, false, Date.now() - t0, msg); falhas.push('groq:' + modelo + ' → ' + msg.slice(0, 80));
        if (/^(401|403)/.test(msg)) break;
      }
    }
  }
  const gem = props.getProperty('GEMINI_API_KEY');
  if (gem) {
    const lista = [].concat((props.getProperty('GEMINI_LEVE') || '').split(',').filter(String), SERVICOS.geminiLeve.modelos, SERVICOS.gemini.modelos);
    for (const modelo of lista) {
      const t0 = Date.now();
      try {
        const p = promptPronuncia_(lang, frase, null);
        const corpo = { systemInstruction: { parts: [{ text: p.sistema }] },
          contents: [{ role: 'user', parts: [{ text: p.usuario }, { inlineData: { mimeType: mime, data: b64 } }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 800, responseMimeType: 'application/json' } };
        const r = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelo) + ':generateContent',
          { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': gem }, payload: JSON.stringify(corpo) });
        const code = r.getResponseCode(), txt = r.getContentText();
        if (code !== 200) throw new Error(code + ' ' + txt.slice(0, 160));
        const c = JSON.parse(txt).candidates[0].content.parts.map(function (x) { return x.text || ''; }).join('');
        const o = JSON.parse((c.match(/\{[\s\S]*\}/) || [c])[0]);
        registrar_('pronuncia', 'gemini', modelo, true, Date.now() - t0);
        return { ouvido: String(o.ouvido || ''), dica: String(o.dica || ''), provedor: 'gemini:' + modelo };
      } catch (err) {
        const msg = String(err && err.message || err);
        registrar_('pronuncia', 'gemini', modelo, false, Date.now() - t0, msg); falhas.push('gemini:' + modelo + ' → ' + msg.slice(0, 80));
        if (/^(401|403)/.test(msg)) break;
      }
    }
  }
  if (!groq && !gem) throw new Error('sem_chave');
  throw new Error('limite: ' + falhas.join(' | '));
}

function promptPronuncia_(lang, frase, ouvido) {
  const idioma = lang === 'fr' ? 'francês' : 'inglês';
  const base = 'Você é o Eco, professor de pronúncia de ' + idioma + ' para brasileiros. Responda em português do Brasil, curto e gentil, sem títulos nem listas. ' +
    'Use **negrito** só em palavras soltas no idioma. Dê uma dica prática (posição da boca, som parecido em português, sílaba forte). ';
  if (ouvido !== null) return { sistema: base + 'Em no máximo 2 frases: se o reconhecimento de voz entendeu algo diferente da frase esperada, diga quais palavras provavelmente não ficaram claras e como melhorar. ' +
    'Se for igual (ignorando pontuação e maiúsculas), elogie numa frase e sugira um detalhe de entonação ou ligação entre palavras.',
    usuario: 'Frase esperada: ' + frase + '\nO reconhecimento de voz entendeu: ' + (ouvido || '(nada)') };
  return { sistema: base + 'Ouça o áudio do aluno tentando dizer a frase esperada. Responda SOMENTE com JSON: {"ouvido": "exatamente o que você entendeu no áudio, no idioma", "dica": "no máximo 2 frases de dica"}.',
    usuario: 'Frase esperada: ' + frase };
}

/* ---------- uso por dia (aba "Uso") ---------- */
function registrar_(tipo, servico, modelo, ok, ms, erro) {
  try {
    const ss = SpreadsheetApp.getActive(); let sh = ss.getSheetByName('Uso');
    if (!sh) { sh = ss.insertSheet('Uso'); sh.appendRow(['quando', 'dia', 'tipo', 'servico', 'modelo', 'ok', 'ms', 'erro']); sh.setFrozenRows(1); }
    const agora = new Date();
    sh.appendRow([agora, Utilities.formatDate(agora, Session.getScriptTimeZone(), 'yyyy-MM-dd'), tipo, servico, modelo, ok, ms, erro ? String(erro).slice(0, 200) : '']);
    if (sh.getLastRow() > 5000) sh.deleteRows(2, 1000);
  } catch (e) {}
}

function usoHoje_() {
  const sh = SpreadsheetApp.getActive().getSheetByName('Uso'); if (!sh || sh.getLastRow() < 2) return {};
  const hoje = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'), out = {};
  const n = Math.min(1500, sh.getLastRow() - 1);
  sh.getRange(sh.getLastRow() - n + 1, 2, n, 5).getValues().forEach(function (r) {
    if (String(r[0]) !== hoje && !(r[0] instanceof Date)) return;
    if (r[0] instanceof Date && Utilities.formatDate(r[0], Session.getScriptTimeZone(), 'yyyy-MM-dd') !== hoje) return;
    if (r[4] === true) out[r[2]] = (out[r[2]] || 0) + 1;
  });
  return out;
}

/** Rode no editor para testar as chaves: Executar → testarIA. O resultado aparece no registro de execução. */
function testarIA() {
  Logger.log(JSON.stringify(ia_('duvida', { idioma: 'en', nivel: 'A1', unidade: 'Hello', pergunta: 'Qual a diferença entre "I am" e "I\'m"?' })));
}

function saida_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

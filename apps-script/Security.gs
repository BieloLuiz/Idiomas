/* ID público do cliente OAuth (aparece no botão do Google; não é segredo). A propriedade GOOGLE_CLIENT_ID, se existir, tem prioridade. */
const GOOGLE_CLIENT_ID_PADRAO = '215022981558-ppdrm1ekehb39ha06r4q3fsh0iu0374i.apps.googleusercontent.com';
/* Contas que podem entrar. A propriedade ALLOWED_EMAILS, se existir, substitui esta lista (vazia = ninguém entra). */
const ALLOWED_EMAILS_PADRAO = 'gabriel.luiz.adv@gmail.com, leonardo9464@gmail.com';
function contasPermitidas_(props) { const v = props.getProperty('ALLOWED_EMAILS'); return String(v == null ? ALLOWED_EMAILS_PADRAO : v).toLowerCase().split(/[;,\s]+/).filter(Boolean); }
function clienteGoogle_() { return PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID') || GOOGLE_CLIENT_ID_PADRAO; }
/* Configurar GOOGLE_CLIENT_ID e ALLOWED_EMAILS nas propriedades privadas do script.
   Sem configuração, o servidor recusa acesso. Nunca aceitar identidade enviada pelo cliente. */
function autenticar_(token) {
  const props = PropertiesService.getScriptProperties(), audience = clienteGoogle_();
  const allowed = contasPermitidas_(props);
  if (!audience || !allowed.length) throw new Error('auth_config');
  if (typeof token !== 'string' || token.length < 50 || token.length > 10000) throw new Error('auth_required');
  const digest = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token));
  const cache = CacheService.getScriptCache(), key = 'auth:' + digest;
  let user, cached = cache.get(key);
  if (cached) user = JSON.parse(cached);
  else {
    // O endpoint do Google verifica a assinatura; as claims são verificadas também aqui.
    let r; try { r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), { muteHttpExceptions: true }); } catch (e) { throw new Error('auth_required'); }
    if (r.getResponseCode() !== 200) throw new Error('auth_required');
    user = JSON.parse(r.getContentText());
  }
  const ttl = Math.floor(Number(user.exp) - Date.now() / 1000);
  if (user.aud !== audience || !['accounts.google.com', 'https://accounts.google.com'].includes(user.iss) || ttl <= 0 || !user.sub || String(user.email_verified) !== 'true') throw new Error('auth_required');
  if (!allowed.includes(String(user.email || '').toLowerCase())) throw new Error('auth_denied');
  if (!cached) cache.put(key, JSON.stringify(user), Math.min(ttl, 300));
  return { sub: user.sub, email: user.email };
}

function limitarIA_(user, tipo) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties(), today = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
    const key = 'IA_BUDGET', previous = JSON.parse(props.getProperty(key) || '{}');
    const budget = previous.day === today ? previous : { day: today, total: 0, users: {} };
    const row = budget.users[user.sub] || { total: 0, live: 0, minute: 0, count: 0 };
    const minute = Math.floor(Date.now() / 60000); if (row.minute !== minute) { row.minute = minute; row.count = 0; }
    const daily = Math.max(1, Number(props.getProperty('IA_DAILY_LIMIT')) || 120), global = Math.max(1, Number(props.getProperty('IA_GLOBAL_LIMIT')) || 240);
    if (row.total >= daily || budget.total >= global || row.count >= 10 || (tipo === 'liveToken' && row.live >= 12)) throw new Error('quota');
    row.total++; row.count++; if (tipo === 'liveToken') row.live++; budget.total++; budget.users[user.sub] = row;
    props.setProperty(key, JSON.stringify(budget));
  } finally { lock.releaseLock(); }
}

function migrarPin_(p) {
  if (p && p.pin) {
    const salt = Utilities.getUuid();
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + String(p.pin), Utilities.Charset.UTF_8);
    p.pinCredential = { alg: 'SHA-256-legacy', salt: salt, hash: hash.map(function (x) { return ('0' + ((x + 256) % 256).toString(16)).slice(-2); }).join('') };
    delete p.pin;
  }
  return p;
}

function validarPedido_(q) {
  if (!q || typeof q !== 'object' || !['entrarGoogle','sair','listar','salvar','ia','iaUso','lembrete','lembretesPendentes','lembreteRemover'].includes(q.acao)) throw new Error('acao');
  if (q.acao === 'ia') {
    if (!q.dados || typeof q.dados !== 'object' || JSON.stringify(q.dados).length > 6500000) throw new Error('pedido_grande');
    if (!['explicar','duvida','redacao','pronuncia','conversa','conversaResumo','revisao','liveToken','traduzir','leitura'].includes(q.tipo)) throw new Error('tipo');
  }
}

function pedidoIA_(user,q){
  if(!/^[0-9a-f-]{36}$/.test(String(q.requestId||'')))throw new Error('operacao_invalida');
  const cache=CacheService.getScriptCache(),key='pedido:'+user.sub+':'+q.requestId,lock=LockService.getScriptLock();
  lock.waitLock(10000);
  try{const previous=cache.get(key);if(previous){if(previous==='pendente')throw new Error('pedido_andamento');return JSON.parse(previous);}cache.put(key,'pendente',90);}finally{lock.releaseLock();}
  try{limitarIA_(user,q.tipo);IA_PRAZO_=Date.now()+45000;const result=ia_(String(q.tipo||''),q.dados||{}),json=JSON.stringify(result);if(json.length<90000)cache.put(key,json,300);else cache.remove(key);return result;}
  catch(e){cache.remove(key);throw e;}
}

/* Sessão própria do app: o Google confirma a pessoa uma vez por aparelho (entrarGoogle) e o servidor devolve
   um código de sessão de 60 dias. Só o resumo (hash) do código fica nas propriedades do script.
   Tirar o e-mail de ALLOWED_EMAILS corta as sessões dessa pessoa na hora. */
const SESSAO_DIAS = 60;
function hashSessao_(token) { return 'SESSAO_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)); }
function permitidos_() {
  const props = PropertiesService.getScriptProperties();
  const allowed = contasPermitidas_(props);
  if (!clienteGoogle_() || !allowed.length) throw new Error('auth_config');
  return allowed;
}
function criarSessao_(user) {
  const props = PropertiesService.getScriptProperties(), agora = Date.now();
  if (typeof props.getKeys === 'function') props.getKeys().forEach(function (k) {   // limpa sessões vencidas
    if (k.indexOf('SESSAO_') !== 0) return;
    try { if (JSON.parse(props.getProperty(k)).exp < agora) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
  const token = 's1.' + (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''), exp = agora + SESSAO_DIAS * 86400000;
  props.setProperty(hashSessao_(token), JSON.stringify({ sub: user.sub, email: user.email, exp: exp }));
  return { sessao: token, expira: exp };
}
function sessao_(token) {
  const allowed = permitidos_();
  if (typeof token !== 'string' || !/^s1\.[0-9a-f]{64}$/.test(token)) throw new Error('auth_required');
  const props = PropertiesService.getScriptProperties(), key = hashSessao_(token);
  let s; try { s = JSON.parse(props.getProperty(key) || 'null'); } catch (e) { s = null; }
  if (!s || !(s.exp > Date.now())) { if (s && typeof props.deleteProperty === 'function') props.deleteProperty(key); throw new Error('auth_required'); }
  if (!allowed.includes(String(s.email || '').toLowerCase())) throw new Error('auth_denied');
  return { sub: s.sub, email: s.email };
}
function sairSessao_(token) {
  const props = PropertiesService.getScriptProperties();
  if (typeof token === 'string' && typeof props.deleteProperty === 'function') props.deleteProperty(hashSessao_(token));
}

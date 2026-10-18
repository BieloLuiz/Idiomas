/**
 * Idiomas — servidor (Google Apps Script)
 * Guarda os perfis e o progresso do app na aba "Perfis" desta planilha.
 * Implantar: Implantar → Nova implantação → App da Web → Executar como: Eu → Quem pode acessar: Qualquer pessoa.
 * Depois de mudar este código: Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão.
 */
const ABA = 'Perfis';
const COLS = ['id', 'nome', 'atualizado', 'atualizadoMs', 'json'];
const MAX_PERFIS = 4;

function doGet() { return saida_({ ok: true, app: 'Idiomas', perfis: aba_().getLastRow() - 1 }); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const q = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (q.acao === 'listar') return saida_({ perfis: listar_() });
    if (q.acao === 'salvar') { (Array.isArray(q.perfis) ? q.perfis : [q.perfil]).slice(0, MAX_PERFIS).forEach(salvar_); return saida_({ ok: true }); }
    return saida_({ erro: 'acao' });
  } catch (err) {
    return saida_({ erro: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function aba_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(ABA);
  if (!sh) { sh = ss.insertSheet(ABA); sh.appendRow(COLS); sh.setFrozenRows(1); sh.getRange('E:E').setWrap(false); }
  return sh;
}

function listar_() {
  const sh = aba_(), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, COLS.length).getValues()
    .map(function (r) { try { return JSON.parse(r[4]); } catch (e) { return null; } })
    .filter(function (p) { return p && p.id; });
}

function salvar_(p) {
  if (!p || !/^[\w-]{1,60}$/.test(String(p.id || ''))) throw new Error('perfil inválido');
  const json = JSON.stringify(p);
  if (json.length > 45000) throw new Error('perfil grande demais');
  const sh = aba_(), n = sh.getLastRow() - 1, ms = Number(p.atualizado) || Date.now();
  const linha = [String(p.id), String(p.nome || '').slice(0, 40), new Date(ms), ms, json];
  if (n > 0) {
    const ids = sh.getRange(2, 1, n, 4).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(p.id)) {
        if (Number(ids[i][3]) > ms) return;          // a planilha já tem uma versão mais nova
        sh.getRange(i + 2, 1, 1, COLS.length).setValues([linha]);
        return;
      }
    }
    if (n >= MAX_PERFIS) throw new Error('limite de perfis');
  }
  sh.appendRow(linha);
}

function saida_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

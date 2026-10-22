/* Envia os lembretes pendentes (usado por .github/workflows/lembretes.yml). */
const webpush = require('web-push'), fs = require('fs');
const api = /IDIOMAS_API\s*=\s*'([^']+)'/.exec(fs.readFileSync('config.js', 'utf8'))[1];
const { LEMBRETE_SEGREDO: segredo, VAPID_PUBLICA: pub, VAPID_PRIVADA: priv } = process.env;
webpush.setVapidDetails('mailto:idiomas@users.noreply.github.com', pub, priv);
async function post(body) {
  const r = await fetch(api, { method: 'POST', body: JSON.stringify(Object.assign({ segredo }, body)), redirect: 'follow' });
  const j = await r.json(); if (j.erro) throw new Error(j.erro); return j;
}
(async () => {
  const { envios } = await post({ acao: 'lembretesPendentes' });
  let ok = 0, removidos = 0;
  for (const e of envios) {
    try { await webpush.sendNotification(e.assinatura, JSON.stringify({ titulo: e.titulo, corpo: e.corpo }), { TTL: 3 * 3600, urgency: 'normal' }); ok++; }
    catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410 || err.statusCode === 403) { await post({ acao: 'lembreteRemover', endpoint: e.assinatura.endpoint }); removidos++; }
      else console.error('falha no envio', err.statusCode || err.message);
    }
  }
  console.log(`lembretes: ${envios.length} pendentes, ${ok} enviados, ${removidos} inscrições vencidas removidas`);
})().catch(e => { console.error(e.message); process.exit(1); });

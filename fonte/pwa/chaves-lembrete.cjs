/* Chaves do lembrete diário, derivadas do segredo CLASPRC_JSON que o repositório já tem.
   Assim não é preciso cadastrar segredos novos: a publicação do Apps Script e o envio dos lembretes
   chegam às mesmas chaves. Se CLASPRC_JSON mudar, as chaves mudam e cada pessoa liga o lembrete de novo.
   Uso: node chaves-lembrete.cjs gs <arquivo.gs>   → grava Segredo.gs (não versionado)
        node chaves-lembrete.cjs env               → imprime as variáveis para o envio */
const crypto = require('crypto');
const base = process.env.CLASPRC;
if (!base) { console.error('Falta CLASPRC'); process.exit(1); }
const derivar = rotulo => crypto.createHmac('sha256', base).update('idiomas-lembrete:' + rotulo).digest();
const segredo = derivar('segredo').toString('hex');
const priv = derivar('vapid'), ecdh = crypto.createECDH('prime256v1'); ecdh.setPrivateKey(priv);
const vapidPublica = ecdh.getPublicKey().toString('base64url'), vapidPrivada = priv.toString('base64url');
if (process.argv[2] === 'gs') {
  require('fs').writeFileSync(process.argv[3], "/* Gerado na publicação. Não versionar. */\nconst LEMBRETE_SEGREDO = '" + segredo + "';\nconst VAPID_PUBLICA = '" + vapidPublica + "';\n");
} else {
  for (const [k, v] of [['LEMBRETE_SEGREDO', segredo], ['VAPID_PUBLICA', vapidPublica], ['VAPID_PRIVADA', vapidPrivada]]) {
    if (process.env.GITHUB_ACTIONS) console.log('::add-mask::' + v);
    require('fs').appendFileSync(process.env.GITHUB_ENV || '/dev/stdout', k + '=' + v + '\n');
  }
}

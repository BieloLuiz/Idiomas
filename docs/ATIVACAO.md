# Ativação da versão com entrada Google

Esta versão foi preparada para um espaço compartilhado por duas pessoas. As contas autorizadas podem acessar os perfis da família, incluindo históricos. O PIN é uma conveniência para alternar perfis no aparelho, e não uma autorização individual do servidor.

## Preparar antes de publicar

1. No Google Cloud, criar um cliente OAuth do tipo **Aplicativo da Web**, para uso com Google Identity Services.
2. Cadastrar a origem JavaScript `https://bieloluiz.github.io`. Para teste local de login real, adicionar a origem local usada pelo responsável.
3. Configurar a tela de consentimento e, quando o projeto estiver em teste, cadastrar as duas contas autorizadas como usuários de teste.
4. Nas **Propriedades do script** do Google Apps Script, preencher:

| Propriedade privada | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | Identificador do cliente OAuth, terminado em `.apps.googleusercontent.com`. |
| `ALLOWED_EMAILS` | Os dois endereços autorizados, separados por vírgula. Não colocar essa lista no repositório público. |
| `IA_DAILY_LIMIT` | Opcional. Padrão: 120 pedidos por pessoa por dia UTC. |
| `IA_GLOBAL_LIMIT` | Opcional. Padrão: 240 pedidos por dia UTC para o aplicativo. |

As propriedades já existentes de Groq, GitHub Models e Gemini continuam no servidor. Não colocar chaves em `config.js`, em um commit ou em uma mensagem de chat.

O endpoint `/exec` pode continuar acessível por HTTP anônimo porque o próprio código exige e valida a credencial Google em cada pedido privado. Sem `GOOGLE_CLIENT_ID` e `ALLOWED_EMAILS`, o servidor recusa acesso. `doGet` revela apenas o nome do aplicativo e o identificador público do cliente OAuth.

## Publicação e migração

- Fazer uma cópia da planilha antes de implantar uma migração. Usar também **Configurações → Exportar meus dados** em aparelhos que tenham alterações ainda não sincronizadas.
- Revisar e integrar a proposta na `main` somente depois de configurar a entrada Google. A publicação do Apps Script agora depende das verificações do aplicativo.
- Publicar os arquivos `Code.gs`, `Security.gs` e `ProfileCore.gs` juntos. `appsscript.json` continua sendo preservado pela automação.
- O primeiro acesso autorizado converte o PIN antigo da planilha para uma credencial de migração sem devolver o PIN em claro. Ao entrar no perfil, o aparelho atualiza essa credencial para PBKDF2 com sal aleatório.
- A autenticação Google é validada no servidor pelo endpoint `tokeninfo`, com verificação adicional de emissor, público, expiração, endereço verificado e lista de contas. Há cache curto de resultados válidos. Depois disso, o app usa a sessão própria descrita abaixo.
- As duas pessoas devem entrar, abrir os respectivos perfis e confirmar sincronização antes de retirar as cópias de segurança. A versão usa revisões do servidor e recibos de operação para recuperar respostas perdidas sem reaplicar o mesmo envio.
- Configurar uma regra de proteção da `main` no GitHub para exigir a verificação **Verificar aplicativo / verificar** antes de integrar alterações. Essa configuração administrativa não é feita pelo código do repositório.

## Sem internet

A entrada oferece **Estudar neste aparelho sem sincronizar**. Esse modo abre a escolha de perfis e exige o PIN local, e o aparelho lembra a escolha. Pedidos de IA e sincronização voltam a funcionar depois de entrar com Google (Configurações → Entrar com Google).

## Sessão por aparelho

O Google é pedido uma vez por aparelho. Na ação `entrarGoogle`, o servidor valida a credencial Google e devolve uma sessão própria (`s1.` + 64 caracteres aleatórios) válida por 60 dias. O aparelho guarda essa sessão em `localStorage` (`idiomas-sessao`); a planilha não guarda o código, só o resumo SHA-256 dele nas propriedades do script (`SESSAO_…`). Sessões vencidas são apagadas na próxima entrada.

- Todos os outros pedidos exigem a sessão; a credencial Google sozinha não lê dados.
- Tirar um e-mail de `ALLOWED_EMAILS` corta as sessões dessa pessoa no pedido seguinte. Apagar as propriedades `SESSAO_…` encerra todas as sessões.
- Se a sessão acabar ou for recusada, o app **não some da tela**: a lição continua, a sincronização e a IA pausam e aparece um aviso para entrar de novo. A tela inteira de entrada só aparece na primeira vez em um aparelho sem sessão e sem modo local escolhido.

Nos Guias, **Baixar áudio desta unidade** guarda o MP3 no cache próprio do aplicativo. O navegador precisa concluir a instalação da PWA e ter espaço disponível. A interface distingue sincronização pendente de sincronização concluída. Históricos e notas continuam podendo ser exportados e importados.

## Verificações antes de integrar

```sh
python -m pip install -r requirements.txt
npm ci
python fonte/build.py
npm test
npx playwright install chromium
npm run test:browser
```

No Linux de integração contínua, usar `npx playwright install --with-deps chromium`. Os testes usam contas e provedores simulados; não leem a planilha nem consomem cotas reais. Uma verificação do login com as contas autorizadas e da conexão com os provedores ainda deve ser feita no ambiente de implantação.

Fontes de implementação: [verificação de identidade Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [tokens temporários do Gemini Live](https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens).

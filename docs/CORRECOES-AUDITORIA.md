# Correções da auditoria

Esta proposta reúne correções de segurança, progresso, sincronização, áudio, atividades e publicação. Não altera as chaves dos provedores nem publica diretamente na `main`.

| Achado | Tratamento nesta proposta |
|---|---|
| 01–02: acesso e uso de IA | Entrada Google, lista privada de contas, verificação no servidor, cota por minuto/dia, limite global e tokens Live restritos. Configuração de OAuth pendente de ativação. |
| 03: microfone | Descarte explícito de tracks, gravador, contexto de áudio e WebSocket ao sair, ocultar ou bloquear o aplicativo; proteção durante permissão pendente. |
| 04: unidade errada | Teste e prática do guia usam a revisão da própria unidade; retirada da reserva silenciosa para A1. |
| 05: sincronização | Fila e envio em andamento persistidos, revisão de servidor, reconciliação de três versões, recibos de operação e novas tentativas com intervalo crescente. |
| 06: resposta em outro perfil | Correção de redação mantém o proprietário capturado ao enviar. |
| 07: revisão | Histórico, acertos, erros e vencimento por expressão; sessão usa os itens vencidos. |
| 08–09: progresso e sequência | Limite do curso, estado de conclusão, avanço por posição da lição e comparação de dias locais consecutivos. |
| 10–11: Descobrir | Atividades derivadas da unidade/idioma atual, com estado no perfil. O protótipo fixo de café em inglês deixa de executar no aplicativo. |
| 12: gabarito da IA | Rejeição de opções duplicadas/vazias e índices não inteiros. |
| 13–14: voz | Explicação de transmissão contínua no modo ao vivo e apresentação do percentual como correspondência com a transcrição. |
| 15: carregamento | Imagens otimizadas e recursos com cache independente; modelo e biblioteca 3D carregados sob demanda; exercícios preparados apenas ao acessar a unidade. |
| 16–17: áudio/PWA | Tratamento de falha e espera, índice de trechos, gravações nos players, download de MP3 por unidade, suporte a Range offline e remoção limitada a caches próprios. |
| 18: armazenamento | Estados de falha visíveis, cópia de recuperação para estado inválido, exportação/importação e limite remoto ampliado com validação de esquema. |
| 19: publicação | Dependências fixadas, testes com asserções e navegador, conferência fonte/artefato e verificação obrigatória antes do deploy do Apps Script. Regra administrativa da branch documentada. |
| 20: didática | Perguntas contextualizadas já existentes em `mc`, transcrição revelável, montagem na língua estudada e atividades de Descobrir baseadas no conteúdo real. |
| 21: acessibilidade | Rótulos persistentes, idioma das respostas, foco ao retirar palavras, respeito a movimento reduzido e testes de largura. |
| 22: pedidos lentos | Operações de IA identificadas, deduplicação de pedido pendente/retentativa e prazo entre tentativas de provedores. Uma chamada externa já iniciada no Apps Script não pode ser interrompida pelo navegador. |
| 23: preferências e métricas | Preferências por perfil, data de criação real, expressões únicas recuperadas corretamente e tempo de lição sem o mínimo artificial de quatro minutos. |
| 24: manutenção e navegação | Núcleo puro compartilhado, módulo Descobrir com eventos declarados, retirada de eval/new Function do módulo, build multiplataforma, recursos externos e histórico das telas principais. |

## Limites que continuam relevantes

O conteúdo completo e os mapas de áudio ainda são carregados como um recurso do curso. Esta etapa reduz bastante o HTML e a preparação inicial de exercícios; a divisão do conteúdo em downloads por unidade pode ser uma evolução posterior, se as medições de celulares mostrarem necessidade.

A tela de Descobrir foi conectada ao conteúdo real, substituindo os jogos visuais demonstrativos que usavam o mesmo exemplo de inglês em qualquer nível/idioma. As atividades agora cobrem leitura, expressões, ordenação, compreensão, gramática e escrita; novas ilustrações contextualizadas podem ser acrescentadas preservando esse contrato.

Os testes cobrem regras e fluxos simulados. Ainda cabem verificação humana de pronúncia dos MP3, revisão linguística integral das 120 unidades, contraste por estado e avaliação com leitores de tela. Essas atividades não são substituídas por um teste automatizado ou pelo rótulo A1–C1.

As contas autorizadas compartilham o espaço familiar. Se for necessário privacidade entre as duas pessoas ou abrir o serviço a outros grupos, o modelo de autorização deve evoluir para propriedade individual e convites. O PIN local não substitui esse modelo.

## Revisão posterior: sessão por aparelho

Na primeira versão, a credencial Google ficava só na memória da aba: era preciso entrar a cada abertura e, quando ela vencia (1 hora), a tela do app era escondida, inclusive no meio de uma lição ou conversa ao vivo. Agora o Google é pedido uma vez por aparelho e o servidor emite uma sessão própria de 60 dias (detalhes em `ATIVACAO.md`). Quando a sessão acaba, só a sincronização e a IA pausam, com um aviso que não esconde o app; a escolha do modo local fica lembrada no aparelho.

Verificações: `npm test` (15, com teste da sessão: emissão, código não guardado às claras, sem consulta ao Google a cada pedido, credencial Google sozinha não lê dados, revogação por `ALLOWED_EMAILS`, saída e vencimento) e `npm run test:browser` (reabrir o app sem pedir Google; sessão recusada mostra aviso com o app visível). Para rodar o navegador com um Chromium já instalado: `CHROMIUM_PATH=/caminho/do/chromium`. Observado nos testes: com duas abas abertas ao mesmo tempo, a segunda pode deixar alterações como pendentes até voltar a ficar visível; não gera envios repetidos.

## Revisão 2 (21/10/2026): correções

| Item | Correção | Verificação |
|---|---|---|
| 1. XP entre abas | A fusão entre abas usa como base o valor gravado antes da gravação da outra aba (`oldValue` do evento `storage`), não a base do servidor; a aba também adota a base do servidor mais nova gravada pela outra. | `npm test`: "duas abas não contam o mesmo XP duas vezes" (falhava com o código anterior: 60 em vez de 40). |
| 2. Escuta | `falaDoMc` só trata o campo `e` como áudio quando corresponde a uma fala do diálogo da unidade (inteira ou parte). Nos outros 53 casos (explicações), a questão aparece sem balão nem áudio, e a explicação é mostrada depois da resposta. Descobrir › Ouvir e compreender sorteia só entre questões com fala. | Navegador: nenhuma explicação vira áudio; 53 questões identificadas. |
| 3. Contadores do dia | `ProfileCore.mergeProfile`: minutos, metas e "feito hoje" só somam entre versões do mesmo dia; semana e XP da semana, da mesma semana. Valores de um dia anterior não entram no atual. | `npm test`: caso da revisão (5 minutos, não 15), mesmo dia somando (13) e virada de semana. |
| 4. Preferências | Carregar/aplicar separados de salvar (`uxAplicarPrefs`): aplicadas ao abrir, ao navegar, ao trocar de perfil e quando a sincronização traz mudanças. | Navegador: silêncio, traduções e texto 125% aplicados ao trocar de pessoa e ao reabrir. |
| 5. Saída Google | Configurações › Conexão mostra "Sair da conta Google neste aparelho" quando conectado (revoga a sessão no servidor e limpa a local). "Apagar dados deste aparelho" oferece também "Apagar e sair da conta Google". | Navegador: entrar pelas Configurações e sair; servidor recebe a saída. |
| 6. Erro antigo | O erro guarda o item; "Praticar novamente" e o atalho do Caderno abrem a unidade e o item de origem. | Navegador: erro da unidade 1 aberto com o perfil na unidade 49. |
| 7. Mensagens | Nota de sincronização mostra o estado real; "Exercícios de fala" virou atalho para o treino de pronúncia; "Puzzles e enigmas" virou "Montar uma frase". | Navegador. |
| 8. Publicação | `pages.yml` publica o site só depois de `verificar`. Requer mudar Settings › Pages › Source para **GitHub Actions** (configuração administrativa feita pelo dono). `verificar.yml` deixou de rodar sozinho no push, porque é chamado pelos dois fluxos de publicação. | Primeira execução depois da integração. |
| 10. Variedade (parcial) | Montagem, lacuna e escuta do Descobrir sorteiam o item; "Uma história em sequência" usa um trecho diferente do diálogo; "Reencontrar palavras" virou recordação com revelação. | Navegador (fluxos sem erro). |

Pendentes: item 9 (dividir o conteúdo por idioma/nível, depois de medir em celular). A fusão ainda trata como uma só duas alterações independentes que terminam no mesmo valor (por exemplo, dois aparelhos do mesmo perfil fazendo a mesma lição offline); resolver isso exige registrar atividades com identificador, e foi deixado como evolução.

## Recursos de estudo (branch `recursos-estudo`)

Novos: revisão do dia (revisão espaçada de palavras, frases e erros), lembrete diário por notificação, prova de fim de nível (escuta, leitura, gramática, vocabulário, escrita e fala) e leitura extra criada pela IA.

Verificações feitas (com dados fictícios e serviços simulados; nada real foi enviado):

| O quê | Como |
|---|---|
| Lembrete: horário no fuso da pessoa (São Paulo e Paris, com a troca de horário de 25/10), uma vez por dia, não avisa quem já estudou, nada depois de 23:30, volta no dia seguinte, horário e endereço inválidos recusados | `npm test` |
| Lembrete: segredo ausente, curto ou errado recusado; app precisa de sessão; remover inscrição vencida; desligar no app remove | `npm test` |
| Leitura: resposta que não é JSON ou com texto curto recusada; perguntas com opções repetidas ou índice inválido descartadas; vocabulário malformado descartado; nível e formato desconhecidos caem no padrão | `npm test` |
| Chaves do lembrete: `chaves-lembrete.cjs` gera o mesmo segredo e a mesma chave pública no `Segredo.gs` e no envio; a chave VAPID derivada é aceita pelo `web-push`; `apps-script/Segredo.gs` está no `.gitignore` | execução local com valor fictício |
| Envio: `enviar-lembretes.cjs` busca os pendentes com o segredo, envia e remove a inscrição que responde 410 | execução local com `web-push` e servidor simulados |
| Revisão do dia, prova do A1 (20 questões, 5 por parte, resultado salvo), tela do lembrete, leitura extra com IA simulada | `npm run test:browser` (16 verificações) |

Ainda não verificado: notificação real num celular (depende da publicação e de ligar o lembrete com o app instalado e entrada Google) e o primeiro disparo agendado do fluxo `lembretes.yml`. O agendamento do GitHub pode atrasar alguns minutos. Se o segredo `CLASPRC_JSON` mudar, as chaves do lembrete mudam: o Apps Script precisa ser publicado de novo e cada pessoa liga o lembrete outra vez.

## IA e voz — etapa 1: controle de orçamento (branch `orcamento-etapa1`)

Preços conferidos nas páginas oficiais em 22/10/2026: GPT-6 Luna US$ 0,10 / 0,01 (cache) / 0,50 por milhão de tokens; Groq Whisper Large V3 Turbo US$ 0,04 por hora, mínimo de 10 s por arquivo; Gemini 3.8 Flash-Lite TTS US$ 6 por milhão de tokens de áudio (≈ US$ 0,009/min) e US$ 0,50 por milhão de texto até 31/12/2026, o dobro a partir de 2027; Gemini Live grátis no plano gratuito. A chave do Gemini é do plano gratuito, então tudo do Gemini entra como US$ 0 (`geminiPago: false`).

O que foi feito: `apps-script/Orcamento.gs` (preços, teto, cotas, reserva antes da chamada e acerto depois, alertas 50/75/90/100%, opcionais param em 90%, mês no fuso de São Paulo, aba Custos); `pedidoIA_` reserva e confirma; `chamar_`, `openai_` e `gemini_` registram os tokens informados pela resposta; as duas transcrições pelo Whisper registram os segundos cobrados (mínimo de 10 s). As cotas por aluno começam no modo `registrar` (anotam sem bloquear); o teto financeiro sempre bloqueia.

Verificações (`npm test`, 24): preços e configuração; teto de US$ 4 com reservas em andamento; reserva travada; opcionais em 90%; cotas por aluno nos dois modos; virada do mês no fuso de São Paulo com reserva contando no mês de origem; pedido real simulado registrando tokens e custo; falha liberando a reserva. Navegador: 16 verificações sem regressão.

Limites: o custo é estimado; a duração do áudio é estimada pelo tamanho do arquivo (para mais). O estado do mês fica numa propriedade do script (cerca de 6,4 KB no pior caso medido, limite de 9 KB por propriedade). A trava do orçamento pode somar perto de 1 s quando os dois pedirem ao mesmo tempo; ainda não medido no Apps Script real.

## IA e voz — etapa 2: GPT-6 Luna e escolha de provedores (branch `ia-etapa2`)

GPT-6 Luna entra como serviço `openai` (Chat Completions, `reasoning_effort: low`, `max_completion_tokens: 2000`, sem `temperature`, conforme a página do modelo). Groq, Gemini, GitHub Models e o Live continuam. `rotas_(tipo)` substitui o uso direto de `ROTAS`: principal em `IA_PRINCIPAL` (padrão `openai`) e reservas em `IA_FALLBACK` (padrão: os gratuitos de cada tarefa, na ordem atual). Se a OpenAI falhar, não há nova tentativa paga: segue para os gratuitos. Se o orçamento acabar, o pedido continua só com os gratuitos (`SEM_PAGOS_`); o Whisper da Groq também fica de fora nesse caso, salvo se `PRECOS.whisperGratis` for verdadeiro, e a transcrição usa o Gemini.

Verificações (`npm test`, 26): rotas padrão e configuradas; corpo da chamada à OpenAI; queda para o gratuito em erro; orçamento esgotado sem chamar a OpenAI. A chamada real à OpenAI não foi feita daqui (a chave fica no servidor): depois de publicar, rodar `testarOpenAI` no editor do Apps Script.

## OpenAI: modelo grátis por compartilhamento de dados (22/10/2026)

O dono ativou o compartilhamento de dados com a OpenAI (até 2,5 milhões de tokens/dia grátis no grupo mini e 250 mil no grupo maior). `SERVICOS.openai.modelos` passou a `gpt-5.4-mini` (grátis) e depois `gpt-6-luna` (pago). `gratisDisponivel_` soma os tokens do dia (UTC, propriedade `GRATIS_<dia>_<grupo>`) e, ao chegar a 90% do limite, o pedido segue para o GPT-6 Luna. Dentro do limite o custo estimado é 0. Os textos enviados à OpenAI podem ser usados por ela para treinar modelos, por escolha do dono. Verificado em `npm test` (simulado); a chamada real deve ser conferida com `testarOpenAI`, que agora testa os dois modelos.

## IA e voz — etapas 3 a 5, modo a dois e Eco nas lições (branch `tudo-v2`)

- Painel do administrador (`apps-script/Admin.gs`, `TELAS.admin`): só a conta em `ADMIN_EMAILS` (padrão: a do dono). Mostra o consumo estimado do mês, por serviço e por aluno, os tokens grátis da OpenAI usados no dia, alertas e bloqueios; configura provedor principal, reservas, modo das cotas (registrar ou bloquear), cotas por aluno, liberação da reserva de US$ 1 e se a Groq é do plano gratuito.
- Pronúncia: aviso de privacidade antes da primeira gravação (qualquer tela que grava) e botão "Mais devagar".
- Conversa "Sem botão": detecção de fala pelo volume no próprio aparelho (limiar adaptado ao ruído; 150 ms de fala para começar, 1,2 s de silêncio para enviar; até 60 s por frase); não escuta enquanto o Eco fala nem logo depois; botão para interromper o Eco; encerra após 2 min sem fala e aos 15 min. Sessão única por aluno no servidor (`sessaoConversa_`) para os três modos, com opção de continuar em outro aparelho.
- Voz premium opcional (Gemini 3.8 Flash-Lite TTS, plano gratuito: US$ 0, conta minutos na cota); a voz do aparelho continua padrão; em falha, volta para a do aparelho.
- Modo a dois: desafio da semana conjunto (soma dos minutos dos dois perfis contra 5 × as metas diárias somadas), o que o outro estudou hoje e a unidade dele, frase da Eco quando os dois estudaram; diálogo em dupla no mesmo aparelho, com cada um num personagem.
- Eco aparece ao lado do enunciado nas lições e reage a acerto e erro.
- Cores: a paleta do app já usava o azul-violeta da marca (`--primary: #5366C7`), sem mudança.

Verificações: `npm test` 29 (admin, sessão única, voz premium); `npm run test:browser` 20 (painel, aviso de privacidade, conversa sem botão abrindo e fechando o microfone, modo a dois). Não verificado: a detecção de fala com voz real (o navegador de teste usa um tom fixo) e a voz premium real do Gemini.

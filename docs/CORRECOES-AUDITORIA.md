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

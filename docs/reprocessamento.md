# Reprocessamento e rastreabilidade

O fluxo cria organizações, negócios e contatos por chamadas POST e adiciona registros de jornada. Ao final há uma atualização do marcador na origem.

Não foi identificada uma garantia global de idempotência para todas as entidades. Reexecutar uma conta após falha parcial pode criar duplicados ou repetir partes da jornada. O marcador de origem e os IFs ajudam no controle do caminho, mas não equivalem a uma transação distribuída.

Alguns nós usam continueRegularOutput em caso de erro, incluindo partes da criação e os agentes. Por isso, chegar ao fim da execução não comprova sucesso completo da migração.

## Reconciliação recomendada para adaptação

Registrar ID da origem, ID da organização, ID do negócio, ID do contato e status por etapa. Conferir contagens, valores e associações. Só considerar a conta concluída após validar as operações obrigatórias.

Outras evoluções possíveis: checkpoints, retomada da etapa pendente, critérios de existência antes de criar, auditoria de erro e limites/retries por API. Essas funcionalidades não foram acrescentadas ao template como se existissem no original.

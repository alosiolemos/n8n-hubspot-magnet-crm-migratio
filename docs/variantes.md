# Ativos e cancelados

| Característica | Ativos | Cancelados |
| --- | --- | --- |
| Nós | 71 | 72 |
| Code / Function | 7 / 3 | 7 / 3 |
| Agentes / modelos Gemini | 3 / 3 | 3 / 3 |
| HTTP Request | 19 | 19 |
| Loop Over Items | 6 | 6 |
| IF | 6 | 7 |

Os filtros de ObterContas são distintos. No export de ativos, além do pipeline e de um conjunto de etapas, existe um filtro por conta_name. Seu valor foi substituído por EMPRESA_DEMO. Portanto essa configuração não significa “buscar automaticamente todos os ativos” sem revisar o escopo.

No export de cancelados, há pipeline, uma etapa e um filtro no marcador magnetcustomer. Os IDs foram substituídos por marcadores. A variante possui um IF adicional próximo da criação da organização.

Há diferenças nos códigos de agrupamento e seleção das contas; os dois conjuntos foram preservados. Os códigos alternativos não devem ser trocados indiscriminadamente entre variantes.

O recorte de associações também muda: ativos seleciona 10 notas, 10 e-mails e 5 contatos; cancelados seleciona 3 de cada um desses tipos. Ambas selecionam 5 reuniões.

Cada versão tem um Schedule Trigger no original. O template público deixa o agendamento desabilitado, o workflow inativo e preserva o acionamento manual desabilitado como recebido. Configure um gatilho de teste conscientemente antes de executar.

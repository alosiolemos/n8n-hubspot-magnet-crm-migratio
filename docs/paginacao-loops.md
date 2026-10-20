# Paginação e loops

## Extração paginada

ObterContas e Paginação HubSpot realizam buscas em um objeto customizado do HubSpot. Os identificadores desse objeto e dos pipelines foram substituídos por marcadores no template público.

O fluxo utiliza after como cursor. paginacao3 inicia em zero na primeira execução e preserva o cursor nas seguintes; prox_pag3 lê paging.next.after da resposta. Um IF decide o avanço, com espera entre chamadas.

All percorre resultados de execuções anteriores da busca paginada. O término depende de uma exceção ao tentar ler uma execução inexistente. Isso também pode ocultar outros erros; na adaptação, convém distinguir fim de paginação de falha real. Os logs que exibiam resultados completos foram retirados do código público.

Os Function legados foram preservados. Eles dependem de variáveis e helpers próprios do n8n; o teste local não executa o motor de paginação do n8n.

## Loops encadeados

| Etapa | Papel |
| --- | --- |
| Separar | Percorrer grupos econômicos |
| Loop 1 | Percorrer contas/negócios de cada grupo |
| Loop Over Items3 | Percorrer notas |
| Loop Over Items1 | Percorrer e-mails |
| Loop Over Items | Percorrer reuniões |
| Loop Over Items2 | Percorrer contatos |

As saídas de conclusão de cada loop encaminham o fluxo à próxima etapa. As chamadas e esperas por registro explicam por que o tempo total cresce com o volume e com a quantidade de associações.

## Recortes verificados

Os códigos de separação selecionam o final do array recebido. Ativos: até 10 notas, 10 e-mails, 5 reuniões e 5 contatos. Cancelados: até 3 notas, 3 e-mails, 5 reuniões e 3 contatos. Não há ordenação cronológica nesses códigos, portanto “últimos” significa posição na lista, não garantia de data mais recente. Também não foi identificado um loop de paginação para essas listas de associações.

O case transfere recortes da jornada. Para migrar histórico completo, seria necessário validar paginação, ordenação, limites e cobertura das associações.

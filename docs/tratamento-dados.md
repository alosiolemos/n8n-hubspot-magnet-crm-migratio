# Agrupamento e transformação

Extração do Grupo Econômico1 aceita itens em results, arrays diretos ou objetos. Agrupa por grupo_economico, ordena as contas por valor e seleciona a de maior valor como referência. Campos ausentes podem usar o primeiro valor não vazio de outra conta do grupo.

O código calcula valor_total, valor_referencia, qtd_contas e ultima_atualizacao. Também produz listas de valores distintos com Set e combina cidade e UF.

## Exemplo fictício

| Conta | Grupo | Valor |
| --- | --- | ---: |
| Conta A | GRUPO DEMO | 100 |
| Conta B | GRUPO DEMO | 250 |

O grupo tem duas contas, total 350 e referência na Conta B. A organização representa o agrupamento; os negócios são criados a partir das contas vinculadas.

Obetem negócios vinculados busca o grupo de Set Empresa e filtra registros vindos de IF6. Existem diferenças entre as versões; o código específico de cada export foi mantido em sua pasta.

## Particularidades

- SEM GRUPO reúne registros sem valor de grupo e pode combinar contas sem relação empresarial comprovada.
- A conversão numérica troca vírgula por ponto, mas não trata de forma completa separadores de milhar como 1.234,56.
- O uso de valores truthy em alguns fallbacks pode tratar zero como ausência.
- Atualização mais recente é calculada por comparação dos valores fornecidos; pressupõe datas comparáveis.
- Obter Grupo Economico é um código alternativo e está desabilitado no export de cancelados. Sua presença não comprova participação em todas as execuções.

Essas características foram preservadas, sem apresentar a normalização como uma garantia de qualidade para qualquer entrada.

# Migração de CRM com IA — HubSpot → Magnet Customer

Case de migração de clientes **ativos e cancelados**, reunindo **n8n, APIs REST, JavaScript, enriquecimento por CNPJ e Google Gemini** para reconstruir cadastros e contexto comercial em outro CRM.

## O desafio

Os CRMs tinham propriedades, entidades e processos diferentes. Segundo o autor, a operação no destino era feita registro a registro. A automação organizou extração, agrupamento, enriquecimento, criação de vínculos e transferência de partes da jornada comercial.

O autor relata uma execução de quase um dia, envolvendo chamadas e tratamento por registro. Essa duração não foi medida nesta preparação. O case não afirma uma economia de horas específica ou migração integral de todo o histórico.

## Arquitetura

```mermaid
flowchart LR
    A[HubSpot: busca e paginação] --> B[Normalização e grupo econômico]
    B --> C[Magnet: criar organização]
    C --> D[Selecionar contas do grupo]
    D --> E[CNPJ e descrição por Gemini]
    E --> F[Magnet: criar negócio e vincular organização]
    F --> G[Notas da jornada: agente HTML]
    G --> H[E-mails: agente HTML]
    H --> I[Reuniões: agente HTML]
    I --> J[Contatos: criar e vincular]
    J --> K[HubSpot: marcar migração]
```

Há **três agentes de formatação HTML em cada versão**, além de uma chamada HTTP ao Gemini para gerar a descrição empresarial. A consulta cadastral de CNPJ é uma etapa distinta do texto gerado por IA.

## Duas versões, uma arquitetura

| Versão | Nós no export | Template |
| --- | ---: | --- |
| Ativos | 71 | [Abrir JSON](workflows/migracao-ativos.template.json) |
| Cancelados | 72 | [Abrir JSON](workflows/migracao-cancelados.template.json) |

Os templates estão **inativos**, sem credenciais, com integrações e agendamento desabilitados. São material de estudo e adaptação; não um pacote conectado ao ambiente de origem. Identificadores, filtros específicos, responsáveis e exemplos reais foram substituídos por marcadores ou dados de demonstração.

## Screenshots

![Migração de clientes do HubSpot para o Magnet Customer](assets/screenshots/migra%C3%A7%C3%A3o.png)


## O que explorar

- [Desafio, entregas e decisões](docs/contexto.md)
- [Paginação e loops](docs/paginacao-loops.md)
- [Agrupamento e transformação](docs/tratamento-dados.md)
- [Entidades, vínculos e mapeamento de campos](docs/entidades-mapeamento.md)
- [Enriquecimento e três agentes de IA](docs/ia-enriquecimento.md)
- [Ativos versus cancelados](docs/variantes.md)
- [Reprocessamento e rastreabilidade](docs/reprocessamento.md)
- [Como configurar](docs/configuracao.md)
- [Inventário e códigos](docs/inventario.md)
- [Preparação pública](docs/publicacao.md)
- [Validação e limites](docs/validacao.md)

## Escopo público

Dois templates, vinte corpos de código extraídos, seis prompts públicos e documentação. Não inclui clientes reais, segredos, IDs de aplicações/usuários, configurações operacionais ou dados de execução. Nenhuma operação foi realizada nos CRMs nesta preparação.

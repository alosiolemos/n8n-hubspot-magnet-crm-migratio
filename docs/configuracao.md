# Configuração e teste

## O que o template fornece

O desenho dos dois workflows, conexões, expressões e código de transformação, com marcadores. Não fornece contas de CRM, credenciais, objetos customizados, pipelines, campos ou dados reais.

## Preparação

1. Importe somente a versão desejada em uma instância de teste do n8n. A importação ainda não foi executada nesta preparação.
2. Configure os objetos e propriedades HubSpot e o schema equivalente do Magnet.
3. Substitua os marcadores de pipeline, etapas, customField, responsáveis e IDs de referência conforme seus ambientes.
4. Configure credenciais HubSpot, Magnet e Gemini de forma privada. Não publique um export preenchido com tokens ou client_secret.
5. Ajuste filtros para uma conta fictícia e mantenha o agendamento desabilitado.
6. Teste organização → negócio → jornada → contato em etapas, habilitando somente os nós necessários no ambiente de demonstração.

Todos os HTTP Request, nós HubSpot, agentes, modelos e agendamento estão desabilitados no template. Com esses nós desabilitados, o workflow não deve ser interpretado como uma simulação funcional completa: saídas esperadas podem faltar.

Os endpoints de tenant do destino foram substituídos por crm.example.invalid. Os marcadores não são identificadores funcionais. Campos customizados e mapeamentos de responsáveis precisam de adaptação além da autenticação.

## Conferência por conta

Validar a organização retornada antes de criar o negócio; conferir o vínculo organization; comparar notas/e-mails/reuniões dentro do recorte configurado; verificar contato e vínculo; conferir as etapas antes de marcar a origem como concluída.

O modo de batch e as esperas foram preservados. A unidade seconds foi explicitada nos Wait versão 1.1. As datas, horários e limites das APIs precisam ser validados na instalação de destino.

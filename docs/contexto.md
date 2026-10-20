# Desafio e entregas

Migrar entre CRMs exigiu mais do que transportar uma planilha: grupos econômicos, contas, negócios, contatos e registros de jornada tinham estruturas e propriedades diferentes.

O desenho organiza a migração por dependências. Primeiro obtém e agrupa registros; depois cria a organização que será referenciada pelos negócios. Para cada conta, busca dados cadastrais, prepara uma descrição e cria o negócio. Em seguida percorre as associações para notas, e-mails, reuniões e contatos, e executa uma atualização na origem.

A versão de clientes ativos e a de cancelados foram mantidas separadas para preservar seus filtros e diferenças de tratamento. A documentação não considera os exports idênticos.

No ambiente em que executei a migração, o processo levou quase um dia. Não incluí nesta publicação logs de duração total, volumes reconciliados ou taxa de erro. Meu foco neste case é apresentar a engenharia da transformação e da orquestração, sem atribuir ganhos quantitativos que não medi.

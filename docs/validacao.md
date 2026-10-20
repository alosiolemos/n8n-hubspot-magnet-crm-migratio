# Validação e limites

Foram inspecionados os dois JSONs, seus nós, conexões, códigos, prompts e principais payloads. A validação local verifica estrutura, substituições e comportamento de transformação em dados fictícios.

Consulte [resultados dos testes](../tests/resultados-testes.json) e [script reproduzível](../tests/validar-codigo.cjs).

Não houve importação no n8n, consulta aos CRMs, chamada Gemini/CNPJ, criação de registros ou alteração da origem. Testes locais de JavaScript não comprovam execução dos loops no motor n8n, limites de API, duração, integridade dos dados ou sucesso em produção.

Não foram recebidos logs de reconciliação da migração original. A publicação preserva as particularidades do código e diferencia alterações de anonimização das funcionalidades do ambiente original.

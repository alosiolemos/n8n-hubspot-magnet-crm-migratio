# Enriquecimento e IA

## Quatro usos, três agentes

| Componente | Responsabilidade observada |
| --- | --- |
| ObterDados CNPJ | Consulta cadastral por API |
| Criar descrição Simplificada | Requisição HTTP ao Gemini para gerar descrição da empresa |
| AI Agent1 | Preparar notas em HTML |
| AI Agent | Preparar e-mails em HTML |
| AI Agent2 | Preparar registros de reuniões em HTML |

Cada agente está conectado ao seu nó de modelo Gemini. Não há evidência de agentes que negociem tarefas entre si: são etapas especializadas, encadeadas pelo workflow.

O export referencia gemini-2.0-flash. Esse nome foi preservado como registro da implementação; disponibilidade e compatibilidade precisam ser verificadas na configuração de uma nova instalação.

## Prompts públicos

Os prompts foram reescritos para remover exemplos que continham nomes, telefones, assinaturas e links internos. Mantêm os campos de entrada e a finalidade, mas não são uma cópia literal dos prompts originais.

A descrição empresarial foi ajustada no template para usar os dados recebidos. O prompt original pedia pesquisa, mas não foi identificado mecanismo de busca ou grounding nessa requisição. Texto gerado não é prova de pesquisa externa ou enriquecimento factual.

## Validação da saída

Pedir HTML limpo ao modelo não garante HTML seguro, JSON válido ou fidelidade factual. O histórico original deve ser preservado para conferência. Antes de uso operacional, validar a serialização JSON e aplicar sanitização determinística ao HTML. O template não adiciona um sanitizador completo.

A generalização pública também usa acesso opcional a remetentes/destinatários no prompt de e-mail; isso reduz referências a campos ausentes, mas não substitui teste do prompt na instância n8n.

# Prompt de reunioes

Prompt público reescrito para remover exemplos reais e tornar explícita a preservação de fatos.

```text
=Reorganize o conteúdo recebido em HTML legível para importação em CRM. Preserve os fatos e não invente informações. Retorne somente o HTML final, sem cercas de código ou explicações. A validação e a serialização devem ocorrer fora do modelo.

Registro de reunião: {{ $("HubSpot_meetings").item.json.engagement.bodyPreview }}
```

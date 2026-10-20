# Prompt de notas

Prompt público reescrito para remover exemplos reais e tornar explícita a preservação de fatos.

```text
=Reorganize o conteúdo recebido em HTML legível para importação em CRM. Preserve os fatos e não invente informações. Retorne somente o HTML final, sem cercas de código ou explicações. A validação e a serialização devem ocorrer fora do modelo.

Nota recebida: {{ $("HubSpot1").item.json.engagement.bodyPreview }}
HTML de origem: {{ $("HubSpot1").item.json.engagement.bodyPreviewHtml }}
```

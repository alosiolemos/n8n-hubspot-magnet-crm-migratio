# Prompt de email

Prompt público reescrito para remover exemplos reais e tornar explícita a preservação de fatos.

```text
=Reorganize o conteúdo recebido em HTML legível para importação em CRM. Preserve os fatos e não invente informações. Retorne somente o HTML final, sem cercas de código ou explicações. A validação e a serialização devem ocorrer fora do modelo.

E-mail recebido:
De: {{ $json.metadata.from?.firstName ?? "" }} — {{ $json.metadata.from?.email ?? "" }}
Para: {{ ($json.metadata.to ?? []).map(e => e.email).join(", ") }}
CC: {{ ($json.metadata.cc ?? []).map(e => e.email).join(", ") }}
Conteúdo: {{ $("HubSpot_Email").item.json.engagement.bodyPreview }}
```

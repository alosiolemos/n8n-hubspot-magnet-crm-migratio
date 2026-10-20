// ===========================================
// ETAPA 1 — ENTRADA UNIVERSAL (IN-OUT)
// ===========================================
const allItems = $input.all(); // Pega tudo o que vier na entrada
let flattened = []; // Array final para armazenar os registros normalizados

// Itera sobre cada item recebido
for (const item of allItems) {
  const json = item.json;

  if (Array.isArray(json?.results)) {
    // Caso 1: item.json.results é um array
    json.results.forEach(r => flattened.push({ json: r }));
  } else if (Array.isArray(json)) {
    // Caso 2: item.json é um array direto
    json.forEach(r => flattened.push({ json: r }));
  } else if (json && typeof json === 'object') {
    // Caso 3: item.json é um único objeto
    flattened.push({ json });
  }
}

// Se não houver nada, retorna aviso
if (flattened.length === 0) {
  return [{ json: { mensagem: "Nenhum item encontrado" } }];
}

// ===========================================
// ETAPA 2 — AGRUPAMENTO E PROCESSAMENTO
// ===========================================

// Extrai os dados planos
const data = flattened.map(item => item.json);

// Função segura para converter número
const parseNum = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  return Number(val.toString().replace(",", ".")) || 0;
};

// Lista de campos de interesse
const campos = [
  "canais_de_coleta_utilizados_hoje_pelo_cliente",
  "cidade",
  "cnpj",
  "complemento",
  "conta_name",
  "cs_da_conta",
  "endereco_completo",
  "estado__uf_",
  "id_do_parceiro_sankhya",
  "plataforma_legado",
  "qual_o_segmento_de_atuacao_da_sua_empresa_",
  "razao_social_da_conta",
  "subsegmento_da_empresa",
  "valor",
  "link_do_contrato_assinado",
  "link_da_proposta",
  "hs_createdate",
  "proprietario_ev",
  "numero_de_clientes_monitorados_por_ciclo",
  "ciclo_de_monitoramento",
  "data_da_ultima_renovacao_dos_creditos",
  "dia_da_renovacao_do_ciclo",
  "guide_sap__codigo_pn_",
  "hs_object_id",
  "recorrencia_de_pagamento"
];

// ==============================
// AGRUPA REGISTROS POR GRUPO
// ==============================
const grouped = {};

for (const record of data) {
  const props = record.properties || record; // garante compatibilidade
  const grupo = props.grupo_economico || "SEM GRUPO";
  if (!grouped[grupo]) grouped[grupo] = [];
  grouped[grupo].push({ ...record, properties: props });
}

// ==============================
// PROCESSA CADA GRUPO
// ==============================
const output = [];

for (const [grupo, registros] of Object.entries(grouped)) {
  // Ordena registros por valor (maior primeiro)
  registros.sort((a, b) => parseNum(b.properties.valor) - parseNum(a.properties.valor));

  // Função auxiliar: primeiro valor não vazio
  const getComFallback = (campo) => {
    for (const r of registros) {
      const v = r.properties[campo];
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return null;
  };

  // Base: o de maior valor
  const base = registros[0];
  const props = base.properties;

  // Campos de referência
  const referencia = {};
  for (const c of campos) {
    referencia[`${c}_referencia`] = props[c] || getComFallback(c) || null;
  }

  // Soma de valores
  const valor_total = registros.reduce((acc, r) => acc + parseNum(r.properties.valor), 0);

  // Última atualização
  const ultima_atualizacao = registros.reduce(
    (max, r) => (r.updatedAt > max ? r.updatedAt : max),
    registros[0].updatedAt
  );

  // Campos únicos
  const agrupados = {};
  for (const c of campos) agrupados[c] = new Set();
  for (const r of registros) {
    const p = r.properties;
    for (const c of campos) {
      if (p[c]) agrupados[c].add(p[c]);
    }
  }

  // Arrays finais
  const conjuntos = Object.fromEntries(
    Object.entries(agrupados)
      .filter(([k]) => k !== "grupo_economico")
      .map(([k, v]) => [k, Array.from(v)])
  );

  // Cidade - UF
  const cidade = props.cidade || getComFallback("cidade") || "";
  const uf = props.estado__uf_ || getComFallback("estado__uf_") || "";
  const cidade_uf = cidade && uf ? `${cidade} - ${uf}` : cidade || uf || null;

  // Estrutura final
  const saida = {
    id: base.id || base.properties?.hs_object_id || null,
    grupo_economico: grupo,
    cidade_uf,
    ...referencia,
    valor_referencia: parseNum(base.properties.valor),
    valor_total: Number(valor_total.toFixed(2)),
    qtd_contas: registros.length,
    ultima_atualizacao,
    ...conjuntos
  };

  output.push({ json: saida });
}

// ===========================================
// RETORNO FINAL
// ===========================================
return output;

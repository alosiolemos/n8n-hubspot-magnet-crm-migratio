// ==============================
// ETAPA 1 — OBTÉM TODOS OS ITENS
// ==============================
const allItems = $input.all(); // Obtém todos os itens de entrada
let flattened = []; // Array para armazenar os itens divididos

// Itera sobre os itens do JSON de entrada
allItems.forEach(item => {
  // Itera sobre os resultados do JSON
  item.json.results.forEach(result => {
    // Adiciona cada registro como um item separado no array de saída
    flattened.push({
      json: result
    });
  });
});

// ==============================
// ETAPA 2 — SEPARA A CONTA PRINCIPAL
// ==============================

// Extrai os dados do JSON achatado
const data = flattened.map(item => item.json);

// Função para converter números corretamente
const parseNum = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  return Number(val.toString().replace(",", ".")) || 0;
};

// Campos a considerar
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

// Agrupa registros por grupo econômico
const grouped = {};

for (const record of data) {
  const props = record.properties;
  const grupo = props.grupo_economico || "SEM GRUPO";
  if (!grouped[grupo]) grouped[grupo] = [];
  grouped[grupo].push(record);
}

const output = [];

for (const [grupo, registros] of Object.entries(grouped)) {
  // Ordena registros por valor (maior primeiro)
  registros.sort((a, b) => parseNum(b.properties.valor) - parseNum(a.properties.valor));

  // Função auxiliar: pega o primeiro valor não vazio
  const getComFallback = (campo) => {
    for (const r of registros) {
      const v = r.properties[campo];
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return null;
  };

  // Registro base: o de maior valor
  const base = registros[0];
  const props = base.properties;

  // Monta campos de referência
  const referencia = {};
  for (const c of campos) {
    referencia[`${c}_referencia`] = props[c] || getComFallback(c) || null;
  }

  // Soma de valores
  const valor_total = registros.reduce((acc, r) => acc + parseNum(r.properties.valor), 0);

  // Última atualização (máxima)
  const ultima_atualizacao = registros.reduce(
    (max, r) => (r.updatedAt > max ? r.updatedAt : max),
    registros[0].updatedAt
  );

  // Campos com valores únicos (listas)
  const agrupados = {};
  for (const c of campos) agrupados[c] = new Set();

  for (const r of registros) {
    const p = r.properties;
    for (const c of campos) {
      if (p[c]) agrupados[c].add(p[c]);
    }
  }

  // Monta objeto final — 'id' simples, 'grupo_economico' fora do array
  const conjuntos = Object.fromEntries(
    Object.entries(agrupados)
      .filter(([k]) => k !== "grupo_economico") // exclui este campo dos arrays
      .map(([k, v]) => [k, Array.from(v)])
  );

  // ✅ Concatenação cidade - UF
  const cidade = props.cidade || getComFallback("cidade") || "";
  const uf = props.estado__uf_ || getComFallback("estado__uf_") || "";
  const cidade_uf = cidade && uf ? `${cidade} - ${uf}` : cidade || uf || null;

  // Estrutura final
  const saida = {
    id: base.id, // ✅ apenas o ID da conta principal
    grupo_economico: grupo, // ✅ valor simples, sem []
    cidade_uf, // ✅ campo combinado
    ...referencia,
    valor_referencia: parseNum(base.properties.valor),
    valor_total: Number(valor_total.toFixed(2)),
    qtd_contas: registros.length,
    ultima_atualizacao,
    ...conjuntos
  };

  output.push({ json: saida });
}

// Retorna a saída final para o n8n
return output;

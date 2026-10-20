// 🔹 Busca o grupo econômico do Set Empresa
const grupoEmpresa = $('Set Empresa').first().json.grupo_economico;

if (!grupoEmpresa) {
  return [{
    json: { erro: "Grupo econômico não encontrado em Set Empresa" }
  }];
}

// 🔹 Busca todos os registros do node IF6
const allNodes = $('IF6').all();

if (!allNodes || allNodes.length === 0) {
  return [{
    json: { erro: "Nenhum registro encontrado no node IF6" }
  }];
}

// 🔹 Monta uma lista com todos os registros dentro de results[]
const registros = allNodes
  .flatMap(node => node.json?.results || []);

// 🔹 Filtra corretamente usando results[].properties.grupo_economico
const encontrados = registros.filter(reg => {
  const grupo = reg.properties?.grupo_economico;
  if (!grupo) return false;
  return grupo.trim().toUpperCase() === grupoEmpresa.trim().toUpperCase();
});

// 🔹 Se encontrou registros
if (encontrados.length > 0) {
  return encontrados.map(reg => ({
    json: {
      id: reg.id,
      ...reg.properties,
      grupo_economico_procurado: grupoEmpresa
    }
  }));
}

// 🔹 Se não encontrou
return [{
  json: {
    aviso: "Nenhum registro encontrado com o grupo econômico",
    grupo_procurado: grupoEmpresa,
    total_registros_all: registros.length
  }
}];

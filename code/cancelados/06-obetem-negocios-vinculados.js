// 🔹 Busca o grupo econômico do Set Empresa
const grupoEmpresa = $('Set Empresa').first().json.grupo_economico;

if (!grupoEmpresa) {
  return [{
    json: { 
      erro: "Grupo econômico não encontrado em Set Empresa" 
    }
  }];
}

// 🔹 Busca todos os registros do node All
const allNodes = $('All').all();

if (!allNodes || allNodes.length === 0) {
  return [{
    json: { 
      erro: "Nenhum registro encontrado no node All" 
    }
  }];
}

// 🔹 Filtra os registros que têm o mesmo grupo econômico
const registrosEncontrados = allNodes
  .map(node => node.json)
  .filter(registro => {
    const grupoAll = registro.properties?.grupo_economico;
    return grupoAll && grupoAll === grupoEmpresa;
  });

// 🔹 Retorna todos os registros encontrados
if (registrosEncontrados.length > 0) {
  return registrosEncontrados.map(registro => ({
    json: {
      ...registro.properties,
      id: registro.id,
      grupo_economico_procurado: grupoEmpresa
    }
  }));
} else {
  return [{
    json: {
      aviso: "Nenhum registro encontrado com o grupo econômico",
      grupo_procurado: grupoEmpresa,
      total_registros_all: allNodes.length
    }
  }];
}

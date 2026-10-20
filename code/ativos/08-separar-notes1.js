// Usando inputData em vez de $()
const inputData = $input.all();
let engagements = [];

// Verifica se há dados de entrada
if (inputData && inputData.length > 0) {
  engagements = inputData[0]?.json?.associations?.notes?.results || [];
}

// Pega apenas os últimos 5 registros (ajuste conforme necessário)
const last12Engagements = engagements.slice(-10);

// Retorna os registros, ou "SemAssociacao" se não houver nenhum
if (last12Engagements.length === 0) {
  return [{ json: { id: "SemAssociacao" } }];
}

return last12Engagements.map(c => ({
  json: { id: c.id }
}));

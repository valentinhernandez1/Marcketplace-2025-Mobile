/**
 * Filtra servicios según criterios especificados
 * @param {Array} servicios - Lista de servicios a filtrar
 * @param {Object} filters - Criterios de filtrado
 * @returns {Array} Servicios filtrados
 */
export function filterServices(servicios, filters = {}) {
  let filtered = [...servicios];

  if (filters.solicitanteId) {
    filtered = filtered.filter((s) => s.solicitanteId === filters.solicitanteId);
  }

  if (filters.categoria) {
    filtered = filtered.filter((s) => s.categoria === filters.categoria);
  }

  if (filters.estado) {
    filtered = filtered.filter((s) => s.estado === filters.estado);
  }

  return filtered;
}


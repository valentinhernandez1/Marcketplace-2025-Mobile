/**
 * Calcula el precio total de un pack de insumos
 * @param {Array} items - Lista de items del pack
 * @returns {number} Precio total calculado
 */
export function calculatePackPrice(items) {
  return items.reduce((total, item) => {
    const cantidad = Number(item.cantidad) || 0;
    const precioUnit = Number(item.precioUnit) || 0;
    return total + cantidad * precioUnit;
  }, 0);
}


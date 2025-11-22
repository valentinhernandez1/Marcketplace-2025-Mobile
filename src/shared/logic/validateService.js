/**
 * Valida los datos de un servicio
 * @param {Object} servicio - Datos del servicio a validar
 * @returns {Array<string>} Lista de errores encontrados
 */
export function validateService(servicio) {
  const errores = [];

  if (!servicio.titulo || servicio.titulo.trim().length < 3) {
    errores.push('El título debe tener al menos 3 caracteres.');
  }

  if (!servicio.descripcion || servicio.descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres.');
  }

  if (!servicio.categoria) {
    errores.push('Debés seleccionar una categoría.');
  }

  if (!servicio.direccion || servicio.direccion.trim().length < 5) {
    errores.push('La dirección debe tener al menos 5 caracteres.');
  }

  if (!servicio.ciudad || servicio.ciudad.trim().length < 2) {
    errores.push('La ciudad es obligatoria.');
  }

  if (!servicio.fechaPreferida) {
    errores.push('Debés ingresar una fecha preferida.');
  }

  return errores;
}


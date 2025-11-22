import { getCotizacionesApi } from './cotizacionesApi';

/**
 * Compara y ordena cotizaciones de un servicio
 * @param {string} serviceId - ID del servicio
 * @param {string} orden - Tipo de ordenamiento ('precio' o 'plazo')
 * @returns {Promise<Array>} Cotizaciones ordenadas
 */
export async function compararCotizacionesApi(serviceId, orden = 'precio') {
  try {
    const cotizaciones = await getCotizacionesApi();
    const filtradas = cotizaciones.filter((c) => c.serviceId === serviceId);

    // Ordenar según el parámetro
    const ordenadas = [...filtradas].sort((a, b) => {
      if (orden === 'precio') {
        return a.precio - b.precio;
      } else if (orden === 'plazo') {
        return a.plazoDias - b.plazoDias;
      }
      return 0;
    });

    return ordenadas;
  } catch (error) {
    console.error('Error comparando cotizaciones:', error);
    return [];
  }
}


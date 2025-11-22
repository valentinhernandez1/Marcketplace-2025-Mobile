import * as SecureStore from 'expo-secure-store';
import { generateId } from '../utils/generateId';

const COTIZACIONES_KEY = 'cotizacionesDB';

/**
 * Datos iniciales de ejemplo para cotizaciones
 */
const COTIZACIONES_INICIALES = [
  {
    id: 'cot-1',
    serviceId: 'serv-1',
    proveedorId: '2',
    precio: 3500,
    plazoDias: 5,
    detalle: 'Incluye limpieza completa, poda y retiro de residuos. Trabajo garantizado.',
    ratingProveedorMock: 4,
    createdAt: '2024-01-11T09:00:00.000Z',
  },
  {
    id: 'cot-2',
    serviceId: 'serv-1',
    proveedorId: '2',
    precio: 4200,
    plazoDias: 7,
    detalle: 'Servicio premium con fertilización incluida.',
    ratingProveedorMock: 5,
    createdAt: '2024-01-11T10:30:00.000Z',
  },
  {
    id: 'cot-3',
    serviceId: 'serv-2',
    proveedorId: '2',
    precio: 8500,
    plazoDias: 10,
    detalle: 'Pintura de calidad premium, incluye preparación de superficie.',
    ratingProveedorMock: 4,
    createdAt: '2024-01-13T11:00:00.000Z',
  },
];

/**
 * Inicializa la base de datos con datos de ejemplo si está vacía
 */
async function initializeCotizacionesDB() {
  try {
    const cotizacionesJson = await SecureStore.getItemAsync(COTIZACIONES_KEY);
    if (!cotizacionesJson) {
      await SecureStore.setItemAsync(COTIZACIONES_KEY, JSON.stringify(COTIZACIONES_INICIALES));
      return COTIZACIONES_INICIALES;
    }
    return JSON.parse(cotizacionesJson);
  } catch (error) {
    console.error('Error initializing cotizaciones DB:', error);
    return COTIZACIONES_INICIALES;
  }
}

/**
 * Obtiene todas las cotizaciones almacenadas
 * @returns {Promise<Array>} Lista de cotizaciones
 */
export async function getCotizacionesApi() {
  try {
    const cotizacionesJson = await SecureStore.getItemAsync(COTIZACIONES_KEY);
    if (!cotizacionesJson) {
      return await initializeCotizacionesDB();
    }
    return JSON.parse(cotizacionesJson);
  } catch (error) {
    console.error('Error getting cotizaciones:', error);
    return await initializeCotizacionesDB();
  }
}

/**
 * Crea una nueva cotización
 * @param {Object} cotizacion - Datos de la cotización
 * @returns {Promise<Object>} Cotización creada con ID y fecha
 */
export async function createCotizacionApi(cotizacion) {
  try {
    const cotizaciones = await getCotizacionesApi();
    const nueva = {
      ...cotizacion,
      id: cotizacion.id || generateId(),
      fechaCreacion: cotizacion.createdAt || new Date().toISOString(),
    };
    cotizaciones.push(nueva);
    await SecureStore.setItemAsync(COTIZACIONES_KEY, JSON.stringify(cotizaciones));
    return nueva;
  } catch (error) {
    console.error('Error creating cotizacion:', error);
    throw error;
  }
}

export async function updateCotizacionApi(id, updates) {
  try {
    const cotizaciones = await getCotizacionesApi();
    const index = cotizaciones.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Cotizacion no encontrada');
    
    cotizaciones[index] = { ...cotizaciones[index], ...updates };
    await SecureStore.setItemAsync(COTIZACIONES_KEY, JSON.stringify(cotizaciones));
    return cotizaciones[index];
  } catch (error) {
    console.error('Error updating cotizacion:', error);
    throw error;
  }
}

export async function deleteCotizacionApi(id) {
  try {
    const cotizaciones = await getCotizacionesApi();
    const filtered = cotizaciones.filter((c) => c.id !== id);
    await SecureStore.setItemAsync(COTIZACIONES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting cotizacion:', error);
    throw error;
  }
}

export async function getCotizacionesProveedorApi(proveedorId) {
  try {
    const cotizaciones = await getCotizacionesApi();
    return cotizaciones.filter((c) => c.proveedorId === proveedorId);
  } catch (error) {
    console.error('Error getting cotizaciones proveedor:', error);
    return [];
  }
}


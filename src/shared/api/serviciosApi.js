import * as SecureStore from 'expo-secure-store';
import { generateId } from '../utils/generateId';

const SERVICIOS_KEY = 'serviciosDB';

/**
 * Datos iniciales de ejemplo para servicios
 */
const SERVICIOS_INICIALES = [
  {
    id: 'serv-1',
    titulo: 'Limpieza de jardín completo',
    descripcion: 'Necesito limpiar mi jardín, cortar el pasto, podar árboles y retirar hojas secas.',
    categoria: 'JARDINERIA',
    direccion: 'Av. 18 de Julio 1234',
    ciudad: 'Montevideo',
    fechaPreferida: '2024-02-15',
    solicitanteId: '1',
    estado: 'PUBLICADO',
    cotizacionSeleccionadaId: null,
    insumosRequeridos: [
      { nombre: 'Fertilizante', cantidad: 2 },
      { nombre: 'Semillas de pasto', cantidad: 1 },
    ],
    fechaCreacion: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'serv-2',
    titulo: 'Pintura de fachada',
    descripcion: 'Pintar la fachada de mi casa, aproximadamente 50m². Necesito presupuesto.',
    categoria: 'PINTURA',
    direccion: 'Bulevar Artigas 567',
    ciudad: 'Montevideo',
    fechaPreferida: '2024-02-20',
    solicitanteId: '1',
    estado: 'PUBLICADO',
    cotizacionSeleccionadaId: null,
    insumosRequeridos: [
      { nombre: 'Pintura blanca', cantidad: 10 },
      { nombre: 'Rodillos', cantidad: 3 },
    ],
    fechaCreacion: '2024-01-12T14:30:00.000Z',
  },
];

/**
 * Inicializa la base de datos con datos de ejemplo si está vacía
 */
async function initializeServiciosDB() {
  try {
    const serviciosJson = await SecureStore.getItemAsync(SERVICIOS_KEY);
    if (!serviciosJson) {
      await SecureStore.setItemAsync(SERVICIOS_KEY, JSON.stringify(SERVICIOS_INICIALES));
      return SERVICIOS_INICIALES;
    }
    return JSON.parse(serviciosJson);
  } catch (error) {
    console.error('Error initializing servicios DB:', error);
    return SERVICIOS_INICIALES;
  }
}

/**
 * Obtiene todos los servicios almacenados
 * @returns {Promise<Array>} Lista de servicios
 */
export async function getServiciosApi() {
  try {
    const serviciosJson = await SecureStore.getItemAsync(SERVICIOS_KEY);
    if (!serviciosJson) {
      return await initializeServiciosDB();
    }
    return JSON.parse(serviciosJson);
  } catch (error) {
    console.error('Error getting servicios:', error);
    return await initializeServiciosDB();
  }
}

/**
 * Crea un nuevo servicio
 * @param {Object} servicio - Datos del servicio a crear
 * @returns {Promise<Object>} Servicio creado con ID y fecha
 */
export async function createServicioApi(servicio) {
  try {
    const servicios = await getServiciosApi();
    const nuevo = {
      ...servicio,
      id: generateId(),
      fechaCreacion: new Date().toISOString(),
    };
    servicios.push(nuevo);
    await SecureStore.setItemAsync(SERVICIOS_KEY, JSON.stringify(servicios));
    return nuevo;
  } catch (error) {
    console.error('Error creating servicio:', error);
    throw error;
  }
}

export async function updateServicioApi(id, updates) {
  try {
    const servicios = await getServiciosApi();
    const index = servicios.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Servicio no encontrado');
    
    servicios[index] = { ...servicios[index], ...updates };
    await SecureStore.setItemAsync(SERVICIOS_KEY, JSON.stringify(servicios));
    return servicios[index];
  } catch (error) {
    console.error('Error updating servicio:', error);
    throw error;
  }
}

export async function deleteServicioApi(id) {
  try {
    const servicios = await getServiciosApi();
    const filtered = servicios.filter((s) => s.id !== id);
    await SecureStore.setItemAsync(SERVICIOS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting servicio:', error);
    throw error;
  }
}


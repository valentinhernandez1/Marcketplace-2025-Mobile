import * as SecureStore from 'expo-secure-store';
import { generateId } from '../utils/generateId';

const INSUMOS_KEY = 'suppliesDB';
const PACKS_KEY = 'packDB';

/**
 * Datos iniciales de ejemplo para insumos
 */
const INSUMOS_INICIALES = [
  {
    id: 'ins-1',
    vendedorId: '3',
    nombre: 'Pintura blanca 4L',
    categoria: 'PINTURA',
    precioUnit: 850,
    unidad: 'litro',
    stock: 15,
    fechaCreacion: '2024-01-05T08:00:00.000Z',
  },
  {
    id: 'ins-2',
    vendedorId: '3',
    nombre: 'Fertilizante universal 5kg',
    categoria: 'JARDINERIA',
    precioUnit: 450,
    unidad: 'kg',
    stock: 20,
    fechaCreacion: '2024-01-05T08:30:00.000Z',
  },
  {
    id: 'ins-3',
    vendedorId: '3',
    nombre: 'Semillas de pasto Bermuda',
    categoria: 'JARDINERIA',
    precioUnit: 320,
    unidad: 'kg',
    stock: 12,
    fechaCreacion: '2024-01-05T09:00:00.000Z',
  },
  {
    id: 'ins-4',
    vendedorId: '3',
    nombre: 'Rodillo de pintura',
    categoria: 'PINTURA',
    precioUnit: 180,
    unidad: 'unidad',
    stock: 25,
    fechaCreacion: '2024-01-05T09:30:00.000Z',
  },
  {
    id: 'ins-5',
    vendedorId: '3',
    nombre: 'Cable eléctrico 2.5mm',
    categoria: 'ELECTRICIDAD',
    precioUnit: 120,
    unidad: 'metro',
    stock: 100,
    fechaCreacion: '2024-01-05T10:00:00.000Z',
  },
];

/**
 * Datos iniciales de ejemplo para packs
 */
const PACKS_INICIALES = [
  {
    id: 'pack-1',
    vendedorId: '3',
    serviceId: 'serv-1',
    items: [
      { nombre: 'Fertilizante universal 5kg', cantidad: 2, precioUnit: 450 },
      { nombre: 'Semillas de pasto Bermuda', cantidad: 1, precioUnit: 320 },
    ],
    precioTotal: 1220,
    createdAt: '2024-01-11T15:00:00.000Z',
  },
];

/**
 * Inicializa la base de datos de insumos con datos de ejemplo si está vacía
 */
async function initializeInsumosDB() {
  try {
    const insumosJson = await SecureStore.getItemAsync(INSUMOS_KEY);
    if (!insumosJson) {
      await SecureStore.setItemAsync(INSUMOS_KEY, JSON.stringify(INSUMOS_INICIALES));
      return INSUMOS_INICIALES;
    }
    return JSON.parse(insumosJson);
  } catch (error) {
    console.error('Error initializing insumos DB:', error);
    return INSUMOS_INICIALES;
  }
}

/**
 * Inicializa la base de datos de packs con datos de ejemplo si está vacía
 */
async function initializePacksDB() {
  try {
    const packsJson = await SecureStore.getItemAsync(PACKS_KEY);
    if (!packsJson) {
      await SecureStore.setItemAsync(PACKS_KEY, JSON.stringify(PACKS_INICIALES));
      return PACKS_INICIALES;
    }
    return JSON.parse(packsJson);
  } catch (error) {
    console.error('Error initializing packs DB:', error);
    return PACKS_INICIALES;
  }
}

/**
 * Obtiene todos los insumos almacenados
 * @returns {Promise<Array>} Lista de insumos
 */
export async function getInsumosApi() {
  try {
    const insumosJson = await SecureStore.getItemAsync(INSUMOS_KEY);
    if (!insumosJson) {
      return await initializeInsumosDB();
    }
    return JSON.parse(insumosJson);
  } catch (error) {
    console.error('Error getting insumos:', error);
    return await initializeInsumosDB();
  }
}

/**
 * Crea un nuevo insumo
 * @param {Object} insumo - Datos del insumo a crear
 * @returns {Promise<Object>} Insumo creado con ID y fecha
 */
export async function createInsumoApi(insumo) {
  try {
    const insumos = await getInsumosApi();
    const nuevo = {
      ...insumo,
      id: generateId(),
      fechaCreacion: new Date().toISOString(),
    };
    insumos.push(nuevo);
    await SecureStore.setItemAsync(INSUMOS_KEY, JSON.stringify(insumos));
    return nuevo;
  } catch (error) {
    console.error('Error creating insumo:', error);
    throw error;
  }
}

export async function updateInsumoApi(id, updates) {
  try {
    const insumos = await getInsumosApi();
    const index = insumos.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Insumo no encontrado');
    
    insumos[index] = { ...insumos[index], ...updates };
    await SecureStore.setItemAsync(INSUMOS_KEY, JSON.stringify(insumos));
    return insumos[index];
  } catch (error) {
    console.error('Error updating insumo:', error);
    throw error;
  }
}

export async function deleteInsumoApi(id) {
  try {
    const insumos = await getInsumosApi();
    const filtered = insumos.filter((i) => i.id !== id);
    await SecureStore.setItemAsync(INSUMOS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting insumo:', error);
    throw error;
  }
}

// Funciones para packs
/**
 * Obtiene todos los packs almacenados
 * @returns {Promise<Array>} Lista de packs
 */
export async function getPacksApi() {
  try {
    const packsJson = await SecureStore.getItemAsync(PACKS_KEY);
    if (!packsJson) {
      return await initializePacksDB();
    }
    return JSON.parse(packsJson);
  } catch (error) {
    console.error('Error getting packs:', error);
    return await initializePacksDB();
  }
}

/**
 * Crea un nuevo pack de insumos
 * @param {Object} pack - Datos del pack a crear
 * @returns {Promise<Object>} Pack creado con ID y fecha
 */
export async function createPackApi(pack) {
  try {
    const packs = await getPacksApi();
    const nuevo = {
      ...pack,
      id: pack.id || generateId(),
      fechaCreacion: pack.createdAt || new Date().toISOString(),
    };
    packs.push(nuevo);
    await SecureStore.setItemAsync(PACKS_KEY, JSON.stringify(packs));
    return nuevo;
  } catch (error) {
    console.error('Error creating pack:', error);
    throw error;
  }
}

export async function updatePackApi(id, updates) {
  try {
    const packs = await getPacksApi();
    const index = packs.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Pack no encontrado');
    
    packs[index] = { ...packs[index], ...updates };
    await SecureStore.setItemAsync(PACKS_KEY, JSON.stringify(packs));
    return packs[index];
  } catch (error) {
    console.error('Error updating pack:', error);
    throw error;
  }
}

export async function deletePackApi(id) {
  try {
    const packs = await getPacksApi();
    const filtered = packs.filter((p) => p.id !== id);
    await SecureStore.setItemAsync(PACKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting pack:', error);
    throw error;
  }
}


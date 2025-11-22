/**
 * Genera un ID único usando timestamp + número aleatorio
 * Compatible con React Native (no requiere crypto.getRandomValues)
 * @returns {string} ID único
 */
export function generateId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}


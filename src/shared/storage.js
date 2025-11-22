import * as SecureStore from 'expo-secure-store';

export const storage = {
  async getItem(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
    }
  },

  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
};



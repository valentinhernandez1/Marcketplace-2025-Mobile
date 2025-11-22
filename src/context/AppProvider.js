import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useReducer } from 'react';
import { getCotizacionesApi } from '../shared/api/cotizacionesApi';
import { getServiciosApi } from '../shared/api/serviciosApi';
import { appReducer } from '../shared/context/AppReducer';
import { initialState } from '../shared/context/initialState';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restaurar usuario desde SecureStore
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          dispatch({ type: 'LOGIN', payload: user });
        }
      } catch (error) {
        console.error('Error restoring user:', error);
      }
    };
    restoreUser();
  }, []);

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (!state.currentUser) return;

    const loadData = async () => {
      try {
        const servicios = await getServiciosApi();
        const cotizaciones = await getCotizacionesApi();
        const suppliesJson = await SecureStore.getItemAsync('suppliesDB');
        const packsJson = await SecureStore.getItemAsync('packDB');
        const supplies = suppliesJson ? JSON.parse(suppliesJson) : [];
        const packs = packsJson ? JSON.parse(packsJson) : [];

        dispatch({ type: 'SET_SERVICES', payload: servicios });
        dispatch({ type: 'SET_QUOTES', payload: cotizaciones });
        dispatch({ type: 'SET_SUPPLIES', payload: supplies });
        dispatch({ type: 'SET_SUPPLY_OFFERS', payload: packs });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentUser?.id]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}



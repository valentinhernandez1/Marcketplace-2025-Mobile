import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { compararCotizacionesApi } from '../shared/api/comparadorApi';
import { updateServicioApi } from '../shared/api/serviciosApi';

export default function CompareScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const { serviceId } = route.params;
  const [orden, setOrden] = useState('precio');
  const [cotizaciones, setCotizaciones] = useState([]);

  const servicio = state.services.find((s) => s.id === serviceId);

  useEffect(() => {
    const cargar = async () => {
      const data = await compararCotizacionesApi(serviceId, orden);
      setCotizaciones(data);
    };
    cargar();
  }, [serviceId, orden]);

  const seleccionar = async (quoteId) => {
    dispatch({
      type: 'SELECT_QUOTE',
      payload: { serviceId, quoteId },
    });

    await updateServicioApi(serviceId, {
      estado: 'ASIGNADO',
      cotizacionSeleccionadaId: quoteId,
    });

    Alert.alert('Éxito', 'Cotización seleccionada correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const mejorPrecio = cotizaciones.length > 0
    ? Math.min(...cotizaciones.map((c) => c.precio))
    : null;

  const renderQuote = ({ item }) => {
    const isMejorPrecio = item.precio === mejorPrecio;
    const isSelected = servicio?.cotizacionSeleccionadaId === item.id;

    return (
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        <View style={styles.cardHeader}>
          <Text style={styles.proveedor}>👷 Proveedor {item.proveedorId}</Text>
          {isMejorPrecio && <Text style={styles.badge}>💸 Mejor precio</Text>}
          {isSelected && <Text style={styles.badgeSelected}>✓ Seleccionada</Text>}
        </View>
        <Text style={styles.price}>${item.precio.toLocaleString()}</Text>
        <Text style={styles.plazo}>{item.plazoDias} días de plazo</Text>
        {item.detalle && <Text style={styles.detalle}>{item.detalle}</Text>}
        {!isSelected && (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => seleccionar(item.id)}
          >
            <Text style={styles.selectButtonText}>Seleccionar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Comparar Cotizaciones</Text>
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Ordenar por:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, orden === 'precio' && styles.filterButtonActive]}
            onPress={() => setOrden('precio')}
          >
            <Text style={[styles.filterText, orden === 'precio' && styles.filterTextActive]}>
              Precio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, orden === 'plazo' && styles.filterButtonActive]}
            onPress={() => setOrden('plazo')}
          >
            <Text style={[styles.filterText, orden === 'plazo' && styles.filterTextActive]}>
              Plazo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={cotizaciones}
        renderItem={renderQuote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay cotizaciones aún</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filters: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#28a745',
    backgroundColor: '#f0fff4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proveedor: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#007bff',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
  },
  badgeSelected: {
    backgroundColor: '#28a745',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  plazo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detalle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});



import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { getCotizacionesProveedorApi } from '../shared/api/cotizacionesApi';

export default function QuotesScreen({ navigation }) {
  const { state } = useContext(AppContext);
  const user = state.currentUser;
  const [cotizaciones, setCotizaciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadCotizaciones = async () => {
    if (!user?.id) return;
    try {
      const data = await getCotizacionesProveedorApi(user.id);
      setCotizaciones(data);
    } catch (error) {
      console.error('Error loading cotizaciones:', error);
      setCotizaciones([]);
    }
  };

  useEffect(() => {
    loadCotizaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, state.quotes.length]); // Se actualiza cuando cambian las cotizaciones

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCotizaciones();
    setRefreshing(false);
  };

  const getServicioTitulo = (serviceId) => {
    const servicio = state.services.find((s) => s.id === serviceId);
    return servicio?.titulo || `Servicio ${serviceId}`;
  };

  const renderQuote = ({ item }) => {
    const servicio = state.services.find((s) => s.id === item.serviceId);
    const servicioAsignado = servicio?.estado === 'ASIGNADO' && servicio?.cotizacionSeleccionadaId === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.card, servicioAsignado && styles.cardSelected]}
        onPress={() => {
          if (servicio) {
            navigation.navigate('ServiceDetail', { serviceId: item.serviceId });
          }
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{getServicioTitulo(item.serviceId)}</Text>
          {servicioAsignado && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓ Seleccionada</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.price}>${item.precio.toLocaleString()}</Text>
          <Text style={styles.detail}>Plazo: {item.plazoDias} días</Text>
          {item.detalle && (
            <Text style={styles.description} numberOfLines={2}>
              {item.detalle}
            </Text>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={(e) => {
              e.stopPropagation();
              if (servicio) {
                navigation.navigate('CreateQuote', { serviceId: item.serviceId, quoteId: item.id });
              }
            }}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>🏠</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mis Cotizaciones</Text>
          <Text style={styles.headerSubtitle}>
            {cotizaciones.length} cotización{cotizaciones.length !== 1 ? 'es' : ''}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={cotizaciones}
        renderItem={renderQuote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No enviaste cotizaciones aún</Text>
            <Text style={styles.emptySubtext}>
              Navegá a un servicio para enviar tu primera cotización
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  homeButtonText: {
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  headerSpacer: {
    width: 40,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  editButtonText: {
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});



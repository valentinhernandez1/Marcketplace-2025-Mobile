import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { getCotizacionesProveedorApi } from '../shared/api/cotizacionesApi';
import { getServiciosApi } from '../shared/api/serviciosApi';
import Badge from '../shared/components/Badge';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';
import EmptyState from '../shared/components/EmptyState';
import Header from '../shared/components/Header';
import { theme } from '../shared/styles/theme';

const CATEGORIAS = ['JARDINERIA', 'PINTURA', 'PLOMERIA', 'ELECTRICIDAD', 'CONSTRUCCION', 'LIMPIEZA', 'OTROS'];

export default function AvailableServicesScreen({ navigation }) {
  const { state } = useContext(AppContext);
  const user = state.currentUser;
  const [servicios, setServicios] = useState([]);
  const [cotizacionesProveedor, setCotizacionesProveedor] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const todosServicios = await getServiciosApi();
      // Filtrar solo servicios PUBLICADOS (no ASIGNADOS ni otros estados)
      const serviciosDisponibles = todosServicios.filter(
        (s) => s.estado === 'PUBLICADO'
      );
      setServicios(serviciosDisponibles);

      // Cargar cotizaciones del proveedor para saber cuáles ya cotizó
      const cotizaciones = await getCotizacionesProveedorApi(user.id);
      setCotizacionesProveedor(cotizaciones);
    } catch (error) {
      console.error('Error loading services:', error);
      setServicios([]);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, state.services.length, state.quotes.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const yaCotizado = (serviceId) => {
    return cotizacionesProveedor.some((q) => q.serviceId === serviceId);
  };

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter((servicio) => {
    const matchSearch = !searchText || 
      servicio.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchCategoria = !filterCategoria || 
      servicio.categoria === filterCategoria;
    return matchSearch && matchCategoria;
  });

  // Categorías únicas para filtro - usar todas las categorías posibles
  const categoriasDisponibles = CATEGORIAS;

  const renderService = ({ item }) => {
    const cotizado = yaCotizado(item.id);
    const tieneCotizaciones = state.quotes.filter((q) => q.serviceId === item.id).length > 0;

    return (
      <Card
        onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          {cotizado && (
            <Badge variant="success" size="sm">✓ Cotizado</Badge>
          )}
        </View>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.cardFooter}>
          <Badge variant="primary" size="sm">{item.categoria}</Badge>
          <View style={styles.info}>
            {tieneCotizaciones && (
              <Text style={styles.cotizacionesCount}>
                {state.quotes.filter((q) => q.serviceId === item.id).length} cotizaciones
              </Text>
            )}
            {!cotizado && (
              <Button
                title="Cotizar"
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate('CreateQuote', { serviceId: item.id });
                }}
                variant="success"
                size="sm"
              />
            )}
          </View>
        </View>
        {item.insumosRequeridos && item.insumosRequeridos.length > 0 && (
          <View style={styles.insumosInfo}>
            <Text style={styles.insumosText}>
              📦 Requiere {item.insumosRequeridos.length} insumo(s)
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Servicios Disponibles"
        leftAction={{ icon: '🏠', onPress: () => navigation.navigate('Home') }}
      />

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar servicios..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {categoriasDisponibles.length > 0 && (
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Categoría:</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.filterChip, !filterCategoria && styles.filterChipActive]}
                onPress={() => setFilterCategoria('')}
              >
                <Text style={[styles.filterChipText, !filterCategoria && styles.filterChipTextActive]}>
                  Todas
                </Text>
              </TouchableOpacity>
              {categoriasDisponibles.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, filterCategoria === cat && styles.filterChipActive]}
                  onPress={() => setFilterCategoria(filterCategoria === cat ? '' : cat)}
                >
                  <Text style={[styles.filterChipText, filterCategoria === cat && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={serviciosFiltrados}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title={searchText || filterCategoria
              ? 'No se encontraron servicios'
              : 'No hay servicios disponibles'}
            message="Los servicios aparecerán aquí cuando los solicitantes los publiquen"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    ...theme.typography.h4,
    flex: 1,
    marginRight: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  cardDescription: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cotizacionesCount: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  insumosInfo: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  insumosText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
  list: {
    padding: theme.spacing.md,
  },
  filters: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  searchInput: {
    backgroundColor: theme.colors.background.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    color: theme.colors.text.primary,
  },
  filterRow: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.small,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.light,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});


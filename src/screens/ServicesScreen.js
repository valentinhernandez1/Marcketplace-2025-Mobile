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
import { getServiciosApi } from '../shared/api/serviciosApi';
import { filterServices } from '../shared/logic/filterServices';
import { theme } from '../shared/styles/theme';
import Header from '../shared/components/Header';
import Card from '../shared/components/Card';
import Badge from '../shared/components/Badge';
import EmptyState from '../shared/components/EmptyState';

export default function ServicesScreen({ navigation }) {
  const { state } = useContext(AppContext);
  const user = state.currentUser;
  const [servicios, setServicios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const loadServices = async () => {
    const data = await getServiciosApi();
    const misServicios = filterServices(data, { solicitanteId: user.id });
    setServicios(misServicios);
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, state.services.length]); // Se actualiza cuando cambian los servicios

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter((servicio) => {
    const matchSearch = !searchText || 
      servicio.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchCategoria = !filterCategoria || 
      servicio.categoria === filterCategoria;
    const matchEstado = !filterEstado || 
      servicio.estado === filterEstado;
    return matchSearch && matchCategoria && matchEstado;
  });

  // Categorías y estados únicos para filtros
  const categoriasDisponibles = [...new Set(servicios.map((s) => s.categoria))];
  const estadosDisponibles = [...new Set(servicios.map((s) => s.estado))];

  const renderService = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.descripcion}
      </Text>
      <View style={styles.cardFooter}>
        <Badge variant="primary" size="sm">{item.categoria}</Badge>
        <Text style={styles.status}>
          {item.estado === 'PUBLICADO' ? '📢' : '✅'} {item.estado}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Mis Servicios"
        leftAction={{ icon: '🏠', onPress: () => navigation.navigate('Home') }}
        rightAction={{ icon: '+', onPress: () => navigation.navigate('CreateService') }}
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
        {estadosDisponibles.length > 0 && (
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.filterChip, !filterEstado && styles.filterChipActive]}
                onPress={() => setFilterEstado('')}
              >
                <Text style={[styles.filterChipText, !filterEstado && styles.filterChipTextActive]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {estadosDisponibles.map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[styles.filterChip, filterEstado === estado && styles.filterChipActive]}
                  onPress={() => setFilterEstado(filterEstado === estado ? '' : estado)}
                >
                  <Text style={[styles.filterChipText, filterEstado === estado && styles.filterChipTextActive]}>
                    {estado}
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
            title={searchText || filterCategoria || filterEstado
              ? 'No se encontraron servicios'
              : 'No tenés servicios publicados'}
            message={searchText || filterCategoria || filterEstado
              ? 'Intenta con otros filtros de búsqueda'
              : 'Crea tu primer servicio para comenzar'}
            buttonTitle="Publicar servicio"
            onButtonPress={() => navigation.navigate('CreateService')}
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
  list: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.sm,
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
  },
  status: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
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



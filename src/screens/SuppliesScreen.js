import React, { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { deleteInsumoApi, deletePackApi, getInsumosApi, getPacksApi } from '../shared/api/insumosApi';

export default function SuppliesScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;
  const [activeTab, setActiveTab] = useState('insumos'); // 'insumos' o 'packs'
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  const misInsumos = state.supplies.filter((s) => s.vendedorId === user?.id);
  const misPacks = state.supplyOffers.filter((p) => p.vendedorId === user?.id);

  // Filtrar insumos
  const insumosFiltrados = misInsumos.filter((insumo) => {
    const matchSearch = !searchText || 
      insumo.nombre.toLowerCase().includes(searchText.toLowerCase());
    const matchCategoria = !filterCategoria || 
      insumo.categoria === filterCategoria;
    return matchSearch && matchCategoria;
  });

  // Insumos con stock bajo (menos de 5 unidades)
  const insumosStockBajo = misInsumos.filter((i) => (i.stock || 0) < 5);

  // Categorías únicas para filtro
  const categorias = [...new Set(misInsumos.map((i) => i.categoria))];

  const onRefresh = async () => {
    setRefreshing(true);
    // Recargar datos desde las APIs
    try {
      await getInsumosApi();
      await getPacksApi();
      // Los datos se actualizan automáticamente desde AppProvider
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setRefreshing(false);
  };

  const handleDeleteSupply = (id) => {
    Alert.alert(
      'Eliminar insumo',
      '¿Estás seguro de que querés eliminar este insumo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteInsumoApi(id);
              dispatch({ type: 'DELETE_SUPPLY', payload: id });
              Alert.alert('Éxito', 'Insumo eliminado correctamente');
            } catch (_error) {
              Alert.alert('Error', 'No se pudo eliminar el insumo');
            }
          },
        },
      ]
    );
  };

  const renderSupply = ({ item }) => {
    const stockBajo = (item.stock || 0) < 5;
    return (
      <TouchableOpacity
        style={[styles.card, stockBajo && styles.cardStockBajo]}
        onPress={() => navigation.navigate('SupplyDetail', { supplyId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              {stockBajo && (
                <View style={styles.stockBajoBadge}>
                  <Text style={styles.stockBajoBadgeText}>⚠️ Stock bajo</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardCategory}>{item.categoria}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('CreateSupply', { supplyId: item.id });
              }}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteSupply(item.id);
              }}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.precioUnit?.toLocaleString() || 0}</Text>
          <Text style={[styles.stock, stockBajo && styles.stockBajo]}>
            Stock: {item.stock || 0} {item.unidad || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeletePack = (id) => {
    Alert.alert(
      'Eliminar pack',
      '¿Estás seguro de que querés eliminar este pack?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePackApi(id);
              dispatch({ type: 'DELETE_SUPPLY_OFFER', payload: id });
              Alert.alert('Éxito', 'Pack eliminado correctamente');
            } catch (_error) {
              Alert.alert('Error', 'No se pudo eliminar el pack');
            }
          },
        },
      ]
    );
  };

  const renderPack = ({ item }) => {
    const servicio = state.services.find((s) => s.id === item.serviceId);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PackDetail', { packId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>Pack para: {servicio?.titulo || 'Servicio'}</Text>
            <Text style={styles.cardCategory}>{item.items?.length || 0} insumos</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('CreatePack', { packId: item.id });
              }}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeletePack(item.id);
              }}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.precioTotal?.toLocaleString() || 0}</Text>
          <Text style={styles.stock}>
            {new Date(item.createdAt || item.fechaCreacion).toLocaleDateString()}
          </Text>
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
        <Text style={styles.headerTitle}>Mis Insumos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateSupply')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{misInsumos.length}</Text>
          <Text style={styles.statLabel}>Insumos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{misPacks.length}</Text>
          <Text style={styles.statLabel}>Packs</Text>
        </View>
        {insumosStockBajo.length > 0 && (
          <View style={[styles.statCard, styles.statCardWarning]}>
            <Text style={styles.statNumberWarning}>{insumosStockBajo.length}</Text>
            <Text style={styles.statLabelWarning}>Stock bajo</Text>
          </View>
        )}
      </View>

      {insumosStockBajo.length > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            ⚠️ {insumosStockBajo.length} insumo(s) con stock bajo (menos de 5 unidades)
          </Text>
        </View>
      )}

      {activeTab === 'insumos' && (
        <View style={styles.filters}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar insumo..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {categorias.length > 0 && (
            <View style={styles.categoryFilters}>
              <TouchableOpacity
                style={[styles.filterChip, !filterCategoria && styles.filterChipActive]}
                onPress={() => setFilterCategoria('')}
              >
                <Text style={[styles.filterChipText, !filterCategoria && styles.filterChipTextActive]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {categorias.map((cat) => (
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
          )}
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insumos' && styles.tabActive]}
          onPress={() => setActiveTab('insumos')}
        >
          <Text style={[styles.tabText, activeTab === 'insumos' && styles.tabTextActive]}>
            Insumos ({misInsumos.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'packs' && styles.tabActive]}
          onPress={() => setActiveTab('packs')}
        >
          <Text style={[styles.tabText, activeTab === 'packs' && styles.tabTextActive]}>
            Packs ({misPacks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabCreate}
          onPress={() => {
            if (activeTab === 'insumos') {
              navigation.navigate('CreateSupply');
            } else {
              navigation.navigate('CreatePack');
            }
          }}
        >
          <Text style={styles.tabCreateText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'insumos' ? insumosFiltrados : misPacks}
        renderItem={activeTab === 'insumos' ? renderSupply : renderPack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeTab === 'insumos'
                ? searchText || filterCategoria
                  ? 'No se encontraron insumos con esos filtros'
                  : 'No tenés insumos publicados'
                : 'No tenés packs creados'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                if (activeTab === 'insumos') {
                  navigation.navigate('CreateSupply');
                } else {
                  navigation.navigate('CreatePack');
                }
              }}
            >
              <Text style={styles.emptyButtonText}>
                {activeTab === 'insumos' ? 'Publicar insumo' : 'Crear pack'}
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#007bff',
  },
  stats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statCardWarning: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  statNumberWarning: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  statLabelWarning: {
    fontSize: 14,
    color: '#ff9800',
    marginTop: 4,
  },
  alertBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
  },
  filters: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tabActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabCreate: {
    width: 44,
    height: 44,
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCreateText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
  cardStockBajo: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    backgroundColor: '#fffbf0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  stockBajoBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stockBajoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#856404',
  },
  cardCategory: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  stockBajo: {
    color: '#ff9800',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



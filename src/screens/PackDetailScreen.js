import React, { useContext } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';

export default function PackDetailScreen({ route, navigation }) {
  const { state } = useContext(AppContext);
  const { packId } = route.params;
  const pack = state.supplyOffers.find((p) => p.id === packId);

  if (!pack) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pack no encontrado</Text>
        </View>
      </View>
    );
  }

  const servicio = state.services.find((s) => s.id === pack.serviceId);

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.headerTitle}>Pack de Insumos</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Pack</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servicio:</Text>
            <Text style={styles.infoValue}>{servicio?.titulo || 'Servicio no encontrado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio total:</Text>
            <Text style={styles.priceValue}>
              ${pack.precioTotal?.toLocaleString() || 0} UYU
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cantidad de insumos:</Text>
            <Text style={styles.infoValue}>{pack.items?.length || 0} insumos</Text>
          </View>

          {(pack.createdAt || pack.fechaCreacion) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de creación:</Text>
              <Text style={styles.infoValue}>
                {new Date(pack.createdAt || pack.fechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {pack.items && pack.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insumos incluidos</Text>
            {pack.items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <Text style={styles.itemPrice}>
                    ${item.precioUnit?.toLocaleString() || 0} c/u
                  </Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemQuantity}>
                    Cantidad: {item.cantidad}
                  </Text>
                  <Text style={styles.itemSubtotal}>
                    Subtotal: ${((item.precioUnit || 0) * (item.cantidad || 0)).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('CreatePack', { packId: pack.id })}
          >
            <Text style={styles.editButtonText}>✏️ Editar pack</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 20,
    color: '#28a745',
    fontWeight: 'bold',
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemSubtotal: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});


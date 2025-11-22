import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';

export default function SupplyDetailScreen({ route, navigation }) {
  const { state } = useContext(AppContext);
  const { supplyId } = route.params;
  const insumo = state.supplies.find((s) => s.id === supplyId);

  if (!insumo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Insumo no encontrado</Text>
        </View>
      </View>
    );
  }

  const stockBajo = (insumo.stock || 0) < 5;

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
        <Text style={styles.headerTitle}>{insumo.nombre}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Insumo</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{insumo.nombre}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{insumo.categoria}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio unitario:</Text>
            <Text style={styles.priceValue}>
              ${insumo.precioUnit?.toLocaleString() || 0} UYU
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Unidad:</Text>
            <Text style={styles.infoValue}>{insumo.unidad || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock disponible:</Text>
            <View style={styles.stockContainer}>
              <Text style={[styles.stockValue, stockBajo && styles.stockBajo]}>
                {insumo.stock || 0} {insumo.unidad || ''}
              </Text>
              {stockBajo && (
                <View style={styles.stockBajoBadge}>
                  <Text style={styles.stockBajoBadgeText}>⚠️ Stock bajo</Text>
                </View>
              )}
            </View>
          </View>

          {insumo.fechaCreacion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de creación:</Text>
              <Text style={styles.infoValue}>
                {new Date(insumo.fechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('CreateSupply', { supplyId: insumo.id })}
          >
            <Text style={styles.editButtonText}>✏️ Editar insumo</Text>
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
  categoryBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  stockBajo: {
    color: '#ff9800',
  },
  stockBajoBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockBajoBadgeText: {
    fontSize: 10,
    color: '#856404',
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


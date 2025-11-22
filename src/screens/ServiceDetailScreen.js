import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { deleteServicioApi } from '../shared/api/serviciosApi';

export default function ServiceDetailScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const { serviceId } = route.params;
  const [deleting, setDeleting] = useState(false);

  const servicio = state.services.find((s) => s.id === serviceId);
  const cotizaciones = state.quotes.filter((q) => q.serviceId === serviceId);
  const esMiServicio = servicio?.solicitanteId === state.currentUser?.id;

  const handleDelete = () => {
    Alert.alert(
      'Eliminar servicio',
      '¿Estás seguro de que querés eliminar este servicio? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteServicioApi(serviceId);
              // Eliminar del estado global
              const serviciosActualizados = state.services.filter((s) => s.id !== serviceId);
              dispatch({ type: 'SET_SERVICES', payload: serviciosActualizados });
              Alert.alert('Éxito', 'Servicio eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.navigate('Services') },
              ]);
            } catch (_error) {
              Alert.alert('Error', 'No se pudo eliminar el servicio');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleSelectQuote = (quoteId) => {
    Alert.alert(
      'Seleccionar cotización',
      '¿Confirmás que querés seleccionar esta cotización?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            dispatch({
              type: 'SELECT_QUOTE',
              payload: { serviceId, quoteId },
            });
            Alert.alert('Éxito', 'Cotización seleccionada correctamente');
          },
        },
      ]
    );
  };

  if (!servicio) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Servicio no encontrado</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>{servicio.titulo}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.sectionText}>{servicio.descripcion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <Text style={styles.infoItem}>Categoría: {servicio.categoria}</Text>
          <Text style={styles.infoItem}>Dirección: {servicio.direccion}</Text>
          <Text style={styles.infoItem}>Ciudad: {servicio.ciudad}</Text>
          <Text style={styles.infoItem}>
            Fecha preferida: {servicio.fechaPreferida 
              ? (() => {
                  // Formatear fecha YYYY-MM-DD a DD/MM/YYYY
                  const [year, month, day] = servicio.fechaPreferida.split('-');
                  return `${day}/${month}/${year}`;
                })()
              : 'No especificada'}
          </Text>
        </View>

        {servicio.insumosRequeridos && servicio.insumosRequeridos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insumos requeridos</Text>
            {servicio.insumosRequeridos.map((insumo, index) => (
              <Text key={index} style={styles.infoItem}>
                • {insumo.nombre} — {insumo.cantidad}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Cotizaciones ({cotizaciones.length})
          </Text>
          {cotizaciones.length === 0 ? (
            <Text style={styles.emptyText}>Aún no hay cotizaciones</Text>
          ) : (
            cotizaciones.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.quoteCard,
                  servicio.cotizacionSeleccionadaId === c.id && styles.quoteCardSelected,
                ]}
                onPress={() => esMiServicio && !servicio.cotizacionSeleccionadaId && handleSelectQuote(c.id)}
                disabled={!esMiServicio || !!servicio.cotizacionSeleccionadaId}
              >
                {servicio.cotizacionSeleccionadaId === c.id && (
                  <Text style={styles.selectedBadge}>✓ Seleccionada</Text>
                )}
                <Text style={styles.quotePrice}>${c.precio.toLocaleString()}</Text>
                <Text style={styles.quoteDetail}>
                  Plazo: {c.plazoDias} días
                </Text>
                {c.detalle && (
                  <Text style={styles.quoteText}>{c.detalle}</Text>
                )}
                {esMiServicio && !servicio.cotizacionSeleccionadaId && (
                  <Text style={styles.selectHint}>Tocá para seleccionar</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {cotizaciones.length > 0 && !servicio.cotizacionSeleccionadaId && esMiServicio && (
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => navigation.navigate('Compare', { serviceId })}
          >
            <Text style={styles.compareButtonText}>Comparar cotizaciones</Text>
          </TouchableOpacity>
        )}

        {esMiServicio && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('CreateService', { serviceId: servicio.id })}
            >
              <Text style={styles.editButtonText}>✏️ Editar servicio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, deleting && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Text style={styles.deleteButtonText}>
                {deleting ? 'Eliminando...' : '🗑️ Eliminar servicio'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quoteCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  quotePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  quoteDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  compareButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  compareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quoteCardSelected: {
    backgroundColor: '#d4edda',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  selectedBadge: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  selectHint: {
    fontSize: 10,
    color: '#007bff',
    marginTop: 4,
    fontStyle: 'italic',
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



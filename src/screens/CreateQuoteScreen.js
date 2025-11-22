import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { createCotizacionApi, updateCotizacionApi } from '../shared/api/cotizacionesApi';
import { generateId } from '../shared/utils/generateId';

export default function CreateQuoteScreen({ route, navigation }) {
  const { serviceId, quoteId } = route.params || {};
  const { state, dispatch } = useContext(AppContext);
  const servicio = state.services.find((s) => s.id === serviceId);
  const cotizacionExistente = quoteId ? state.quotes.find((q) => q.id === quoteId) : null;
  const isEditing = !!cotizacionExistente;

  const [form, setForm] = useState({
    precio: cotizacionExistente?.precio?.toString() || '',
    plazoDias: cotizacionExistente?.plazoDias?.toString() || '',
    detalle: cotizacionExistente?.detalle || '',
  });
  const [loading, setLoading] = useState(false);

  const yaCotizado = state.quotes.some(
    (q) => q.serviceId === serviceId && q.proveedorId === state.currentUser?.id
  );

  if (!servicio) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
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

  const handleSubmit = async () => {
    if (yaCotizado) {
      Alert.alert('Error', 'Ya enviaste una cotización para este servicio.');
      return;
    }

    if (!form.precio || form.precio.trim() === '') {
      Alert.alert('Error', 'El precio es obligatorio.');
      return;
    }

    const precioNum = Number(form.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor a 0.');
      return;
    }

    const plazoNum = form.plazoDias ? Number(form.plazoDias) : 0;
    if (form.plazoDias && (isNaN(plazoNum) || plazoNum < 0)) {
      Alert.alert('Error', 'El plazo debe ser un número mayor o igual a 0.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Editar cotización existente
        const updates = {
          precio: precioNum,
          plazoDias: plazoNum,
          detalle: form.detalle.trim(),
        };

        const actualizada = await updateCotizacionApi(quoteId, updates);
        dispatch({ type: 'UPDATE_QUOTE', payload: { id: quoteId, ...actualizada } });

        Alert.alert('Éxito', 'Cotización actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Quotes') },
        ]);
      } else {
        // Crear nueva cotización
        const cotizacion = {
          id: generateId(),
          serviceId,
          proveedorId: state.currentUser.id,
          precio: precioNum,
          plazoDias: plazoNum,
          detalle: form.detalle.trim(),
          ratingProveedorMock: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date().toISOString(),
        };

        const nueva = await createCotizacionApi(cotizacion);
        dispatch({ type: 'ADD_QUOTE', payload: nueva });

        Alert.alert('Éxito', 'Cotización enviada correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Quotes') },
        ]);
      }
    } catch (_error) {
      Alert.alert('Error', isEditing ? 'No se pudo actualizar la cotización' : 'No se pudo enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  if (yaCotizado) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ya cotizaste este servicio</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Cotización' : 'Enviar Cotización'}
        </Text>
      </View>

      {servicio && (
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{servicio.titulo}</Text>
          <Text style={styles.serviceDescription}>{servicio.descripcion}</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Precio (UYU) *</Text>
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={form.precio}
            onChangeText={(text) => {
              // Solo números
              const numeric = text.replace(/[^0-9]/g, '');
              setForm({ ...form, precio: numeric });
            }}
          />
          <Text style={styles.currencySymbol}>UYU</Text>
        </View>
        {form.precio && (
          <Text style={styles.pricePreview}>
            ${Number(form.precio || 0).toLocaleString()} pesos uruguayos
          </Text>
        )}

        <Text style={styles.label}>Plazo (días)</Text>
        <TextInput
          style={styles.input}
          placeholder="7"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={form.plazoDias}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, '');
            setForm({ ...form, plazoDias: numeric });
          }}
        />
        {form.plazoDias && (
          <Text style={styles.plazoPreview}>
            📅 {form.plazoDias} día{Number(form.plazoDias) !== 1 ? 's' : ''} para completar
          </Text>
        )}

        <Text style={styles.label}>Detalle adicional</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Agregá detalles sobre cómo realizarías el trabajo..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={form.detalle}
          onChangeText={(text) => setForm({ ...form, detalle: text })}
          autoCapitalize="sentences"
        />
        {form.detalle && (
          <Text style={styles.charCount}>{form.detalle.length} caracteres</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Enviando...'
              : isEditing
                ? '💾 Guardar cambios'
                : '📤 Enviar presupuesto'}
          </Text>
        </TouchableOpacity>
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
  serviceInfo: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#ddd',
    color: '#000',
    minHeight: 48,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#007bff',
    overflow: 'hidden',
  },
  priceInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#000',
    minHeight: 48,
  },
  currencySymbol: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#f8f9fa',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  pricePreview: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#e7f3ff',
    borderRadius: 6,
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  plazoPreview: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 40,
    color: '#dc3545',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});



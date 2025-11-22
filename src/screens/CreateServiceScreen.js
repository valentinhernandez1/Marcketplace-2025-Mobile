import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { createServicioApi, updateServicioApi } from '../shared/api/serviciosApi';
import DatePicker from '../shared/components/DatePicker';
import { validateService } from '../shared/logic/validateService';

const CATEGORIAS = ['JARDINERIA', 'PINTURA', 'PLOMERIA', 'ELECTRICIDAD', 'CONSTRUCCION', 'LIMPIEZA', 'OTROS'];

export default function CreateServiceScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const serviceId = route.params?.serviceId;
  const servicioExistente = serviceId ? state.services.find((s) => s.id === serviceId) : null;
  const isEditing = !!servicioExistente;

  const [form, setForm] = useState({
    titulo: servicioExistente?.titulo || '',
    descripcion: servicioExistente?.descripcion || '',
    categoria: servicioExistente?.categoria || 'JARDINERIA',
    direccion: servicioExistente?.direccion || '',
    ciudad: servicioExistente?.ciudad || '',
    fechaPreferida: servicioExistente?.fechaPreferida || '',
    insumosRequeridos: servicioExistente?.insumosRequeridos || [],
  });
  const [insumoActual, setInsumoActual] = useState({ nombre: '', cantidad: '' });
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const nombreInsumoRef = useRef(null);
  const cantidadInsumoRef = useRef(null);

  const handleSubmit = async () => {
    const errores = validateService(form);
    if (errores.length > 0) {
      Alert.alert('Error', errores.join('\n'));
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Editar servicio existente
        const data = {
          titulo: form.titulo,
          descripcion: form.descripcion,
          categoria: form.categoria,
          direccion: form.direccion,
          ciudad: form.ciudad,
          fechaPreferida: form.fechaPreferida,
          insumosRequeridos: form.insumosRequeridos || [],
        };

        const actualizado = await updateServicioApi(serviceId, data);
        dispatch({ type: 'UPDATE_SERVICE', payload: { id: serviceId, ...actualizado } });

        Alert.alert('Éxito', 'Servicio actualizado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Services') },
        ]);
      } else {
        // Crear nuevo servicio
        const data = {
          ...form,
          solicitanteId: state.currentUser.id,
          estado: 'PUBLICADO',
          cotizacionSeleccionadaId: null,
          insumosRequeridos: form.insumosRequeridos || [],
        };

        const nuevo = await createServicioApi(data);
        dispatch({ type: 'ADD_SERVICE', payload: nuevo });

        Alert.alert('Éxito', 'Servicio publicado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Services') },
        ]);
      }
    } catch (_error) {
      Alert.alert('Error', isEditing ? 'No se pudo actualizar el servicio' : 'No se pudo crear el servicio');
    } finally {
      setLoading(false);
    }
  };

  const scrollToInsumos = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
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
          {isEditing ? 'Editar Servicio' : 'Publicar Servicio'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Limpieza de jardín"
          value={form.titulo}
          onChangeText={(text) => setForm({ ...form, titulo: text })}
        />

        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                form.categoria === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setForm({ ...form, categoria: cat })}
            >
              <Text
                style={[
                  styles.categoryText,
                  form.categoria === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describí el servicio..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={form.descripcion}
          onChangeText={(text) => setForm({ ...form, descripcion: text })}
          autoCapitalize="sentences"
        />

        <Text style={styles.label}>Dirección *</Text>
        <TextInput
          style={styles.input}
          placeholder="Av. Siempre Viva 742"
          placeholderTextColor="#999"
          value={form.direccion}
          onChangeText={(text) => setForm({ ...form, direccion: text })}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Ciudad *</Text>
        <TextInput
          style={styles.input}
          placeholder="Montevideo"
          placeholderTextColor="#999"
          value={form.ciudad}
          onChangeText={(text) => setForm({ ...form, ciudad: text })}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Fecha preferida *</Text>
        <DatePicker
          value={form.fechaPreferida}
          onChange={(date) => setForm({ ...form, fechaPreferida: date })}
          placeholder="Tocá para seleccionar fecha"
        />

        <Text style={styles.label}>Insumos requeridos (opcional)</Text>
        <View style={styles.insumosContainer}>
          {form.insumosRequeridos.map((insumo, index) => (
            <View key={index} style={styles.insumoItem}>
              <Text style={styles.insumoText}>
                {insumo.nombre} — {insumo.cantidad}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const nuevos = form.insumosRequeridos.filter((_, i) => i !== index);
                  setForm({ ...form, insumosRequeridos: nuevos });
                }}
              >
                <Text style={styles.deleteInsumo}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.addInsumoContainer}>
            <TextInput
              ref={nombreInsumoRef}
              style={[styles.input, styles.inputSmall]}
              placeholder="Nombre insumo"
              placeholderTextColor="#999"
              value={insumoActual.nombre}
              onChangeText={(text) => setInsumoActual({ ...insumoActual, nombre: text })}
              onFocus={scrollToInsumos}
              autoCapitalize="words"
            />
            <TextInput
              ref={cantidadInsumoRef}
              style={[styles.input, styles.inputSmall]}
              placeholder="Cantidad"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={insumoActual.cantidad}
              onChangeText={(text) => setInsumoActual({ ...insumoActual, cantidad: text })}
              onFocus={scrollToInsumos}
            />
            <TouchableOpacity
              style={styles.addInsumoButton}
              onPress={() => {
                if (insumoActual.nombre.trim() && insumoActual.cantidad.trim()) {
                  const nuevo = {
                    nombre: insumoActual.nombre.trim(),
                    cantidad: Number(insumoActual.cantidad) || 1,
                  };
                  setForm({
                    ...form,
                    insumosRequeridos: [...form.insumosRequeridos, nuevo],
                  });
                  setInsumoActual({ nombre: '', cantidad: '' });
                }
              }}
            >
              <Text style={styles.addInsumoButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Publicando...'
              : isEditing
                ? '💾 Guardar cambios'
                : '📢 Publicar servicio'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio extra al final para que se vea con el teclado
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
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
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
  insumosContainer: {
    marginTop: 8,
  },
  insumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insumoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  deleteInsumo: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  addInsumoContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputSmall: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  addInsumoButton: {
    width: 44,
    height: 44,
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addInsumoButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});



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
import { createInsumoApi, updateInsumoApi } from '../shared/api/insumosApi';

const CATEGORIAS = ['PINTURA', 'JARDINERIA', 'PLOMERIA', 'ELECTRICIDAD', 'CONSTRUCCION', 'OTROS'];

export default function CreateSupplyScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;
  const supplyId = route.params?.supplyId;
  const insumoExistente = supplyId ? state.supplies.find((s) => s.id === supplyId) : null;
  const isEditing = !!insumoExistente;

  const [form, setForm] = useState({
    nombre: insumoExistente?.nombre || '',
    categoria: insumoExistente?.categoria || 'PINTURA',
    precioUnit: insumoExistente?.precioUnit?.toString() || '',
    unidad: insumoExistente?.unidad || '',
    stock: insumoExistente?.stock?.toString() || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.nombre || form.nombre.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!form.precioUnit || Number(form.precioUnit) <= 0) {
      Alert.alert('Error', 'El precio unitario debe ser mayor a 0.');
      return;
    }

    if (!form.unidad || form.unidad.trim().length < 1) {
      Alert.alert('Error', 'La unidad es obligatoria.');
      return;
    }

    if (!form.stock || Number(form.stock) < 0) {
      Alert.alert('Error', 'El stock debe ser 0 o mayor.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Editar insumo existente
        const data = {
          nombre: form.nombre.trim(),
          categoria: form.categoria,
          precioUnit: Number(form.precioUnit),
          unidad: form.unidad.trim(),
          stock: Number(form.stock),
        };

        const actualizado = await updateInsumoApi(supplyId, data);
        dispatch({ type: 'UPDATE_SUPPLY', payload: { id: supplyId, ...actualizado } });

        Alert.alert('Éxito', 'Insumo actualizado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Supplies') },
        ]);
      } else {
        // Crear nuevo insumo
        const nuevoInsumo = {
          vendedorId: user.id,
          nombre: form.nombre.trim(),
          categoria: form.categoria,
          precioUnit: Number(form.precioUnit),
          unidad: form.unidad.trim(),
          stock: Number(form.stock),
        };

        const creado = await createInsumoApi(nuevoInsumo);
        dispatch({ type: 'ADD_SUPPLY', payload: creado });

        Alert.alert('Éxito', 'Insumo publicado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Supplies') },
        ]);
      }
    } catch (_error) {
      Alert.alert('Error', isEditing ? 'No se pudo actualizar el insumo' : 'No se pudo crear el insumo');
    } finally {
      setLoading(false);
    }
  };

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
          {isEditing ? 'Editar Insumo' : 'Publicar Insumo'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre del insumo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pintura blanca 4L"
          placeholderTextColor="#999"
          value={form.nombre}
          onChangeText={(text) => setForm({ ...form, nombre: text })}
        />
        {form.nombre && (
          <Text style={styles.charCount}>{form.nombre.length} caracteres</Text>
        )}

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

        <Text style={styles.label}>Precio unitario (UYU) *</Text>
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={form.precioUnit}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, '');
              setForm({ ...form, precioUnit: numeric });
            }}
          />
          <Text style={styles.currencySymbol}>UYU</Text>
        </View>
        {form.precioUnit && (
          <Text style={styles.pricePreview}>
            ${Number(form.precioUnit || 0).toLocaleString()} por {form.unidad || 'unidad'}
          </Text>
        )}

        <Text style={styles.label}>Unidad *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: unidad, kg, litro, balde"
          placeholderTextColor="#999"
          value={form.unidad}
          onChangeText={(text) => setForm({ ...form, unidad: text })}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Stock disponible *</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={form.stock}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, '');
            setForm({ ...form, stock: numeric });
          }}
        />
        {form.stock && (
          <Text style={styles.stockPreview}>
            📦 {form.stock} {form.unidad || 'unidad'}{Number(form.stock) !== 1 ? 'es' : ''} disponible{Number(form.stock) !== 1 ? 's' : ''}
          </Text>
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
                : 'Publicando...'
              : isEditing
                ? '💾 Guardar cambios'
                : '📦 Publicar insumo'}
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
  stockPreview: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 6,
    fontSize: 14,
    color: '#155724',
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
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
});


